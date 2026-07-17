import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

let cachedAccessToken = null;
let cachedAccessTokenExpiresAt = 0;

const ORDER_QUERY = `
    query TrackOrder($query: String!) {
        orders(
            first: 10
            query: $query
            sortKey: CREATED_AT
            reverse: true
        ) {
            nodes {
                id
                name
                email
                createdAt
                processedAt
                cancelledAt
                cancelReason
                displayFinancialStatus
                displayFulfillmentStatus

                totalPriceSet {
                    shopMoney {
                        amount
                        currencyCode
                    }
                }

                shippingAddress {
                    name
                    firstName
                    lastName
                    address1
                    address2
                    city
                    province
                    provinceCode
                    country
                    countryCodeV2
                    zip
                    phone
                }

                lineItems(first: 100) {
                    nodes {
                        id
                        name
                        title
                        quantity
                        currentQuantity

                        originalUnitPriceSet {
                            shopMoney {
                                amount
                                currencyCode
                            }
                        }

                        discountedUnitPriceSet {
                            shopMoney {
                                amount
                                currencyCode
                            }
                        }

                        image {
                            url
                            altText
                        }

                        variant {
                            id
                            title
                        }
                    }
                }

                fulfillments(first: 20) {
                    id
                    name
                    status
                    displayStatus
                    createdAt
                    updatedAt
                    inTransitAt
                    estimatedDeliveryAt
                    deliveredAt

                    trackingInfo(first: 10) {
                        company
                        number
                        url
                    }

                    events(
                        first: 50
                        reverse: false
                    ) {
                        nodes {
                            id
                            status
                            createdAt
                            happenedAt
                            estimatedDeliveryAt
                            address1
                            city
                            province
                            country
                            zip
                            message
                        }
                    }
                }
            }
        }
    }
`;

const jsonResponse = (body, status = 200) => {
    return NextResponse.json(body, {
        status,
        headers: {
            "Cache-Control":
                "no-store, no-cache, must-revalidate",
        },
    });
};

const normalizeStoreDomain = (domain) => {
    return String(domain || "")
        .trim()
        .replace(/^https?:\/\//i, "")
        .replace(/\/+$/, "");
};

const normalizeOrderNumber = (value) => {
    return String(value || "")
        .trim()
        .replace(/^#/, "");
};

const normalizeEmail = (value) => {
    return String(value || "")
        .trim()
        .toLowerCase();
};

const escapeSearchValue = (value) => {
    return String(value || "")
        .replace(/\\/g, "\\\\")
        .replace(/"/g, '\\"');
};

const normalizeOrderNameForComparison = (value) => {
    return normalizeOrderNumber(value).toLowerCase();
};

const getShopifyConfiguration = () => {
    const storeDomain = normalizeStoreDomain(
        process.env.SHOPIFY_STORE_DOMAIN
    );

    const clientId = String(
        process.env.SHOPIFY_ADMIN_CLIENT_ID || ""
    ).trim();

    const clientSecret = String(
        process.env.SHOPIFY_ADMIN_CLIENT_SECRET || ""
    ).trim();

    const apiVersion = String(
        process.env.SHOPIFY_API_VERSION || "2026-07"
    ).trim();

    if (!storeDomain) {
        throw new Error(
            "SHOPIFY_STORE_DOMAIN is missing"
        );
    }

    if (!clientId) {
        throw new Error(
            "SHOPIFY_ADMIN_CLIENT_ID is missing"
        );
    }

    if (!clientSecret) {
        throw new Error(
            "SHOPIFY_ADMIN_CLIENT_SECRET is missing"
        );
    }

    return {
        storeDomain,
        clientId,
        clientSecret,
        apiVersion,
    };
};

const getShopifyAccessToken = async () => {
    const currentTime = Date.now();

    if (
        cachedAccessToken &&
        cachedAccessTokenExpiresAt >
        currentTime + 60 * 1000
    ) {
        return cachedAccessToken;
    }

    const {
        storeDomain,
        clientId,
        clientSecret,
    } = getShopifyConfiguration();

    const tokenResponse = await fetch(
        `https://${storeDomain}/admin/oauth/access_token`,
        {
            method: "POST",
            headers: {
                "Content-Type":
                    "application/x-www-form-urlencoded",
                Accept: "application/json",
            },
            body: new URLSearchParams({
                grant_type: "client_credentials",
                client_id: clientId,
                client_secret: clientSecret,
            }).toString(),
            cache: "no-store",
        }
    );

    const responseText =
        await tokenResponse.text();

    let tokenData = null;

    try {
        tokenData = responseText
            ? JSON.parse(responseText)
            : null;
    } catch {
        throw new Error(
            "Shopify returned an invalid authentication response"
        );
    }

    if (
        !tokenResponse.ok ||
        !tokenData?.access_token
    ) {
        const shopifyMessage =
            tokenData?.error_description ||
            tokenData?.error ||
            tokenData?.message;

        throw new Error(
            shopifyMessage ||
            "Unable to authenticate with Shopify"
        );
    }

    const expiresIn = Number(
        tokenData.expires_in || 86399
    );

    cachedAccessToken =
        tokenData.access_token;

    cachedAccessTokenExpiresAt =
        Date.now() + expiresIn * 1000;

    return cachedAccessToken;
};

const shopifyAdminRequest = async (
    query,
    variables
) => {
    const {
        storeDomain,
        apiVersion,
    } = getShopifyConfiguration();

    const accessToken =
        await getShopifyAccessToken();

    const response = await fetch(
        `https://${storeDomain}/admin/api/${apiVersion}/graphql.json`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-Shopify-Access-Token":
                    accessToken,
            },
            body: JSON.stringify({
                query,
                variables,
            }),
            cache: "no-store",
        }
    );

    const responseText = await response.text();

    let data = null;

    try {
        data = responseText
            ? JSON.parse(responseText)
            : null;
    } catch {
        throw new Error(
            "Shopify returned an invalid API response"
        );
    }

    if (!response.ok) {
        throw new Error(
            data?.errors?.[0]?.message ||
            data?.message ||
            "Shopify Admin API request failed"
        );
    }

    if (data?.errors?.length) {
        throw new Error(
            data.errors
                .map((error) => error.message)
                .filter(Boolean)
                .join(", ") ||
            "Shopify GraphQL request failed"
        );
    }

    return data?.data;
};

const getLatestFulfillment = (
    fulfillments = []
) => {
    if (!Array.isArray(fulfillments)) {
        return null;
    }

    return (
        [...fulfillments].sort(
            (first, second) => {
                const firstDate = new Date(
                    first.updatedAt ||
                    first.createdAt ||
                    0
                ).getTime();

                const secondDate = new Date(
                    second.updatedAt ||
                    second.createdAt ||
                    0
                ).getTime();

                return secondDate - firstDate;
            }
        )[0] || null
    );
};

const hasFulfillmentDisplayStatus = (
    fulfillments,
    statuses
) => {
    return (fulfillments || []).some(
        (fulfillment) =>
            statuses.includes(
                fulfillment?.displayStatus
            )
    );
};

const getDeliveredFulfillment = (
    fulfillments = []
) => {
    return (
        fulfillments.find(
            (fulfillment) =>
                fulfillment?.deliveredAt
        ) ||
        fulfillments.find(
            (fulfillment) =>
                fulfillment?.displayStatus ===
                "DELIVERED"
        ) ||
        null
    );
};

const getOrderStatus = (order) => {
    if (order.cancelledAt) {
        return "cancelled";
    }

    const fulfillments =
        order.fulfillments || [];

    const delivered =
        hasFulfillmentDisplayStatus(
            fulfillments,
            ["DELIVERED"]
        ) ||
        fulfillments.some(
            (fulfillment) =>
                Boolean(fulfillment.deliveredAt)
        );

    if (delivered) {
        return "delivered";
    }

    const outForDelivery =
        hasFulfillmentDisplayStatus(
            fulfillments,
            ["OUT_FOR_DELIVERY"]
        );

    if (outForDelivery) {
        return "outForDelivery";
    }

    const inTransit =
        hasFulfillmentDisplayStatus(
            fulfillments,
            [
                "IN_TRANSIT",
                "CARRIER_PICKED_UP",
                "PICKED_UP",
                "ATTEMPTED_DELIVERY",
                "DELAYED",
            ]
        ) ||
        fulfillments.some(
            (fulfillment) =>
                Boolean(fulfillment.inTransitAt)
        );

    if (inTransit) {
        return "inTransit";
    }

    const shipped =
        fulfillments.length > 0 ||
        [
            "FULFILLED",
            "PARTIALLY_FULFILLED",
        ].includes(
            order.displayFulfillmentStatus
        );

    if (shipped) {
        return "shipped";
    }

    const processing =
        [
            "PAID",
            "AUTHORIZED",
            "PARTIALLY_PAID",
        ].includes(
            order.displayFinancialStatus
        ) ||
        [
            "IN_PROGRESS",
            "PENDING_FULFILLMENT",
            "SCHEDULED",
        ].includes(
            order.displayFulfillmentStatus
        );

    if (processing) {
        return "processing";
    }

    return "confirmed";
};

const buildTimeline = (order) => {
    const fulfillments =
        order.fulfillments || [];

    const latestFulfillment =
        getLatestFulfillment(fulfillments);

    const deliveredFulfillment =
        getDeliveredFulfillment(
            fulfillments
        );

    const paymentProcessed =
        [
            "PAID",
            "AUTHORIZED",
            "PARTIALLY_PAID",
            "PARTIALLY_REFUNDED",
            "REFUNDED",
        ].includes(
            order.displayFinancialStatus
        );

    const shipped =
        fulfillments.length > 0 ||
        [
            "FULFILLED",
            "PARTIALLY_FULFILLED",
        ].includes(
            order.displayFulfillmentStatus
        );

    const outForDelivery =
        hasFulfillmentDisplayStatus(
            fulfillments,
            ["OUT_FOR_DELIVERY"]
        );

    const delivered =
        Boolean(
            deliveredFulfillment?.deliveredAt
        ) ||
        hasFulfillmentDisplayStatus(
            fulfillments,
            ["DELIVERED"]
        );

    const outForDeliveryFulfillment =
        fulfillments.find(
            (fulfillment) =>
                fulfillment.displayStatus ===
                "OUT_FOR_DELIVERY"
        );

    return [
        {
            id: "confirmed",
            status: "confirmed",
            date: order.createdAt,
            completed: true,
        },
        {
            id: "processing",
            status: "processing",
            date:
                order.processedAt ||
                order.createdAt,
            completed: paymentProcessed,
        },
        {
            id: "shipped",
            status: "shipped",
            date: shipped
                ? latestFulfillment?.createdAt ||
                latestFulfillment?.updatedAt ||
                null
                : null,
            completed: shipped,
        },
        {
            id: "outForDelivery",
            status: "outForDelivery",
            date: outForDelivery
                ? outForDeliveryFulfillment
                    ?.updatedAt ||
                latestFulfillment?.updatedAt ||
                null
                : null,
            completed: outForDelivery,
        },
        {
            id: "delivered",
            status: "delivered",
            date: delivered
                ? deliveredFulfillment
                    ?.deliveredAt ||
                deliveredFulfillment
                    ?.updatedAt ||
                latestFulfillment?.updatedAt ||
                null
                : null,
            completed: delivered,
        },
    ];
};

const formatAddress = (address) => {
    if (!address) {
        return "";
    }

    return [
        address.address1,
        address.address2,
        address.city,
        address.province,
        address.country,
        address.zip,
    ]
        .filter(Boolean)
        .join(", ");
};

const getTrackingInformation = (
    fulfillments = []
) => {
    const sortedFulfillments = [
        ...fulfillments,
    ].sort((first, second) => {
        const firstDate = new Date(
            first.updatedAt ||
            first.createdAt ||
            0
        ).getTime();

        const secondDate = new Date(
            second.updatedAt ||
            second.createdAt ||
            0
        ).getTime();

        return secondDate - firstDate;
    });

    for (const fulfillment of sortedFulfillments) {
        const tracking =
            fulfillment.trackingInfo?.find(
                (item) =>
                    item?.number ||
                    item?.url ||
                    item?.company
            );

        if (tracking) {
            return {
                company:
                    tracking.company || "",
                number:
                    tracking.number || "",
                url: tracking.url || "",
            };
        }
    }

    return null;
};

const getEstimatedDelivery = (
    fulfillments = []
) => {
    const withEstimatedDelivery =
        fulfillments
            .filter(
                (fulfillment) =>
                    fulfillment
                        ?.estimatedDeliveryAt
            )
            .sort(
                (first, second) =>
                    new Date(
                        first.estimatedDeliveryAt
                    ).getTime() -
                    new Date(
                        second.estimatedDeliveryAt
                    ).getTime()
            );

    if (withEstimatedDelivery.length) {
        return withEstimatedDelivery[0]
            .estimatedDeliveryAt;
    }

    const eventWithEstimatedDelivery =
        fulfillments
            .flatMap(
                (fulfillment) =>
                    fulfillment.events?.nodes ||
                    []
            )
            .filter(
                (event) =>
                    event?.estimatedDeliveryAt
            )
            .sort(
                (first, second) =>
                    new Date(
                        first.estimatedDeliveryAt
                    ).getTime() -
                    new Date(
                        second.estimatedDeliveryAt
                    ).getTime()
            )[0];

    return (
        eventWithEstimatedDelivery
            ?.estimatedDeliveryAt || null
    );
};

const getDeliveredAt = (
    fulfillments = []
) => {
    const deliveredFulfillment =
        getDeliveredFulfillment(
            fulfillments
        );

    return (
        deliveredFulfillment?.deliveredAt ||
        null
    );
};

const mapLineItems = (
    lineItems,
    orderCurrencyCode
) => {
    return (lineItems?.nodes || []).map(
        (item) => {
            const discountedMoney =
                item.discountedUnitPriceSet
                    ?.shopMoney;

            const originalMoney =
                item.originalUnitPriceSet
                    ?.shopMoney;

            const money =
                discountedMoney ||
                originalMoney ||
                {};

            return {
                id: item.id,
                title:
                    item.name ||
                    item.title ||
                    "Product",
                quantity:
                    item.currentQuantity ??
                    item.quantity ??
                    1,
                price: Number(
                    money.amount || 0
                ),
                currencyCode:
                    money.currencyCode ||
                    orderCurrencyCode ||
                    "QAR",
                variantTitle:
                    item.variant?.title || "",
                image: item.image
                    ? {
                        url:
                            item.image.url,
                        altText:
                            item.image
                                .altText ||
                            item.title ||
                            item.name ||
                            "",
                    }
                    : null,
            };
        }
    );
};

const mapFulfillmentEvents = (
    fulfillments = []
) => {
    return fulfillments
        .flatMap((fulfillment) =>
            (
                fulfillment.events?.nodes ||
                []
            ).map((event) => ({
                id: event.id,
                fulfillmentId:
                    fulfillment.id,
                status: event.status,
                createdAt:
                    event.createdAt,
                happenedAt:
                    event.happenedAt,
                estimatedDeliveryAt:
                    event.estimatedDeliveryAt,
                message:
                    event.message || "",
                location: [
                    event.address1,
                    event.city,
                    event.province,
                    event.country,
                    event.zip,
                ]
                    .filter(Boolean)
                    .join(", "),
            }))
        )
        .sort(
            (first, second) =>
                new Date(
                    first.happenedAt ||
                    first.createdAt ||
                    0
                ).getTime() -
                new Date(
                    second.happenedAt ||
                    second.createdAt ||
                    0
                ).getTime()
        );
};

const mapOrder = (order) => {
    const fulfillments =
        order.fulfillments || [];

    const totalMoney =
        order.totalPriceSet?.shopMoney || {};

    return {
        id: order.id,
        orderNumber: order.name,
        status: getOrderStatus(order),

        financialStatus:
            order.displayFinancialStatus ||
            null,

        fulfillmentStatus:
            order.displayFulfillmentStatus ||
            null,

        orderDate: order.createdAt,
        processedAt:
            order.processedAt || null,

        cancelledAt:
            order.cancelledAt || null,

        cancelReason:
            order.cancelReason || null,

        estimatedDelivery:
            getEstimatedDelivery(
                fulfillments
            ),

        deliveredAt:
            getDeliveredAt(fulfillments),

        customerName:
            order.shippingAddress?.name ||
            [
                order.shippingAddress
                    ?.firstName,
                order.shippingAddress
                    ?.lastName,
            ]
                .filter(Boolean)
                .join(" ") ||
            "",

        email: order.email || "",

        address: formatAddress(
            order.shippingAddress
        ),

        shippingAddress:
            order.shippingAddress || null,

        total: Number(
            totalMoney.amount || 0
        ),

        currencyCode:
            totalMoney.currencyCode ||
            "QAR",

        tracking:
            getTrackingInformation(
                fulfillments
            ),

        items: mapLineItems(
            order.lineItems,
            totalMoney.currencyCode
        ),

        timeline:
            order.cancelledAt
                ? [
                    {
                        id: "confirmed",
                        status:
                            "confirmed",
                        date:
                            order.createdAt,
                        completed: true,
                    },
                    {
                        id: "cancelled",
                        status:
                            "cancelled",
                        date:
                            order.cancelledAt,
                        completed: true,
                    },
                ]
                : buildTimeline(order),

        fulfillmentEvents:
            mapFulfillmentEvents(
                fulfillments
            ),
    };
};

export const POST = async (request) => {
    try {
        const body = await request.json();

        const orderNumber =
            normalizeOrderNumber(
                body?.orderNumber
            );

        const email = normalizeEmail(
            body?.email
        );

        if (!orderNumber || !email) {
            return jsonResponse(
                {
                    success: false,
                    message:
                        "Order number and email are required",
                },
                400
            );
        }

        if (orderNumber.length > 100) {
            return jsonResponse(
                {
                    success: false,
                    message:
                        "Invalid order number",
                },
                400
            );
        }

        if (
            email.length > 254 ||
            !email.includes("@")
        ) {
            return jsonResponse(
                {
                    success: false,
                    message:
                        "Invalid email address",
                },
                400
            );
        }

        const searchQuery = [
            `name:"${escapeSearchValue(
                orderNumber
            )}"`,
            `email:"${escapeSearchValue(
                email
            )}"`,
        ].join(" ");

        const shopifyData =
            await shopifyAdminRequest(
                ORDER_QUERY,
                {
                    query: searchQuery,
                }
            );

        const orders =
            shopifyData?.orders?.nodes ||
            [];

        const matchingOrder =
            orders.find((order) => {
                const orderName =
                    normalizeOrderNameForComparison(
                        order.name
                    );

                const enteredOrderNumber =
                    normalizeOrderNameForComparison(
                        orderNumber
                    );

                const orderEmail =
                    normalizeEmail(
                        order.email
                    );

                return (
                    orderName ===
                    enteredOrderNumber &&
                    orderEmail === email
                );
            });

        if (!matchingOrder) {
            return jsonResponse(
                {
                    success: false,
                    message:
                        "No order was found with that order number and email",
                },
                404
            );
        }

        return jsonResponse(
            {
                success: true,
                order: mapOrder(
                    matchingOrder
                ),
            },
            200
        );
    } catch (error) {
        console.error(
            "Track order API error:",
            error
        );

        return jsonResponse(
            {
                success: false,
                message:
                    process.env.NODE_ENV ===
                        "development"
                        ? error.message
                        : "Unable to track this order right now",
            },
            500
        );
    }
};