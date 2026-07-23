const PRODUCTS_QUERY = `
    query Products($language: LanguageCode!)
    @inContext(language: $language) {
        products(first: 100) {
            nodes {
                id
                handle
                title
                description
                productType
                availableForSale

                featuredImage {
                    url
                    altText
                    width
                    height
                }

                images(first: 20) {
                    nodes {
                        url
                        altText
                        width
                        height
                    }
                }

                variants(first: 100) {
                    nodes {
                        id
                        title
                        availableForSale

                        selectedOptions {
                            name
                            value
                        }

                        image {
                            url
                            altText
                            width
                            height
                        }

                        price {
                            amount
                            currencyCode
                        }

                        compareAtPrice {
                            amount
                            currencyCode
                        }
                    }
                }
            }
        }
    }
`;

const getShopifyDomain = () => {
    return process.env.SHOPIFY_STORE_DOMAIN
        ?.replace("https://", "")
        .replace("http://", "")
        .replace(/\/$/, "");
};

const createProductOptions = (variants) => {
    const optionMap = new Map();

    variants.forEach((variant) => {
        variant.selectedOptions.forEach((option) => {
            if (!optionMap.has(option.name)) {
                optionMap.set(
                    option.name,
                    new Set()
                );
            }

            optionMap
                .get(option.name)
                .add(option.value);
        });
    });

    return Array.from(
        optionMap.entries()
    ).map(([name, values]) => ({
        name,
        values: Array.from(values),
    }));
};

const normalizeProductImages = (
    product,
    variants
) => {
    const productImages = Array.isArray(
        product?.images?.nodes
    )
        ? product.images.nodes
        : [];

    const variantImages = variants
        .map((variant) => variant.image)
        .filter((image) => image?.url);

    const allImages = [
        product.featuredImage,
        ...productImages,
        ...variantImages,
    ].filter((image) => image?.url);

    return allImages.filter(
        (image, index, currentImages) =>
            currentImages.findIndex(
                (currentImage) =>
                    currentImage.url ===
                    image.url
            ) === index
    );
};

export const GET = async (request) => {
    try {
        const { searchParams } = new URL(
            request.url
        );

        const locale =
            searchParams.get("locale") || "en";

        const language = locale
            .toLowerCase()
            .startsWith("ar")
            ? "AR"
            : "EN";

        const storeDomain =
            getShopifyDomain();

        const storefrontAccessToken =
            process.env
                .SHOPIFY_STOREFRONT_ACCESS_TOKEN;

        const storefrontApiVersion =
            process.env
                .SHOPIFY_STOREFRONT_API_VERSION ||
            process.env.SHOPIFY_API_VERSION ||
            "2026-04";

        if (
            !storeDomain ||
            !storefrontAccessToken
        ) {
            return Response.json(
                {
                    success: false,
                    message:
                        "Shopify environment variables are missing",
                },
                {
                    status: 500,
                }
            );
        }

        const response = await fetch(
            `https://${storeDomain}/api/${storefrontApiVersion}/graphql.json`,
            {
                method: "POST",
                headers: {
                    "Content-Type":
                        "application/json",
                    "Shopify-Storefront-Private-Token":
                        storefrontAccessToken,
                },
                body: JSON.stringify({
                    query: PRODUCTS_QUERY,
                    variables: {
                        language,
                    },
                }),
                cache: "no-store",
            }
        );

        const data =
            await response.json();

        if (!response.ok) {
            return Response.json(
                {
                    success: false,
                    message:
                        "Shopify request failed",
                    error: data,
                },
                {
                    status: response.status,
                }
            );
        }

        if (data.errors?.length) {
            return Response.json(
                {
                    success: false,
                    message:
                        data.errors[0]
                            ?.message ||
                        "Unable to fetch Shopify products",
                    errors: data.errors,
                },
                {
                    status: 400,
                }
            );
        }

        const products =
            data?.data?.products?.nodes?.map(
                (product) => {
                    const variants =
                        product.variants?.nodes?.map(
                            (variant) => {
                                const price =
                                    Number(
                                        variant
                                            .price
                                            ?.amount ||
                                        0
                                    );

                                const oldPrice =
                                    variant
                                        .compareAtPrice
                                        ?.amount
                                        ? Number(
                                            variant
                                                .compareAtPrice
                                                .amount
                                        )
                                        : null;

                                return {
                                    id: variant.id,
                                    title:
                                        variant.title,
                                    availableForSale:
                                        Boolean(
                                            variant.availableForSale
                                        ),
                                    selectedOptions:
                                        variant.selectedOptions ||
                                        [],
                                    image:
                                        variant.image ||
                                        product.featuredImage ||
                                        null,
                                    price,
                                    oldPrice,
                                    currencyCode:
                                        variant
                                            .price
                                            ?.currencyCode ||
                                        "QAR",
                                };
                            }
                        ) || [];

                    const firstAvailableVariant =
                        variants.find(
                            (variant) =>
                                variant.availableForSale
                        );

                    const defaultVariant =
                        firstAvailableVariant ||
                        variants[0] ||
                        null;

                    const price =
                        defaultVariant?.price ||
                        0;

                    const oldPrice =
                        defaultVariant?.oldPrice ||
                        null;

                    const images =
                        normalizeProductImages(
                            product,
                            variants
                        );

                    return {
                        id: product.id,
                        handle:
                            product.handle,
                        title: product.title,
                        description:
                            product.description ||
                            "",
                        category:
                            product.productType ||
                            "Product",
                        availableForSale:
                            Boolean(
                                product.availableForSale
                            ) &&
                            variants.some(
                                (variant) =>
                                    variant.availableForSale
                            ),

                        image:
                            images[0] ||
                            defaultVariant?.image ||
                            product.featuredImage ||
                            null,

                        images,

                        variantId:
                            defaultVariant?.id ||
                            null,

                        price,
                        oldPrice,

                        currencyCode:
                            defaultVariant?.currencyCode ||
                            "QAR",

                        badge:
                            oldPrice &&
                                oldPrice > price
                                ? "sale"
                                : null,

                        options:
                            createProductOptions(
                                variants
                            ),

                        variants,
                    };
                }
            ) || [];

        return Response.json(
            {
                success: true,
                products,
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        return Response.json(
            {
                success: false,
                message:
                    error instanceof Error
                        ? error.message
                        : "Something went wrong",
            },
            {
                status: 500,
            }
        );
    }
};