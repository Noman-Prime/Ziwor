const getShopifyDomain = () => {
    return process.env.SHOPIFY_STORE_DOMAIN
        ?.replace("https://", "")
        .replace("http://", "")
        .replace(/\/$/, "");
};

export const POST = async (request) => {
    try {
        const { checkoutUrl } = await request.json();

        if (!checkoutUrl) {
            return Response.json(
                {
                    success: false,
                    message: "Checkout URL is required",
                },
                {
                    status: 400,
                }
            );
        }

        const shopifyDomain = getShopifyDomain();

        if (!shopifyDomain) {
            return Response.json(
                {
                    success: false,
                    message:
                        "SHOPIFY_STORE_DOMAIN is missing",
                },
                {
                    status: 500,
                }
            );
        }

        const originalUrl = new URL(checkoutUrl);

        if (!originalUrl.pathname.startsWith("/cart/c/")) {
            return Response.json(
                {
                    success: false,
                    message:
                        "Invalid Shopify checkout URL",
                },
                {
                    status: 400,
                }
            );
        }

        const safeCheckoutUrl = new URL(
            originalUrl.pathname +
                originalUrl.search,
            `https://${shopifyDomain}`
        );

        return Response.json(
            {
                success: true,
                checkoutUrl:
                    safeCheckoutUrl.toString(),
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
                        : "Unable to prepare checkout",
            },
            {
                status: 500,
            }
        );
    }
};