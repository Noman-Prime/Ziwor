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
                }
                variants(first: 1) {
                    nodes {
                        id
                        availableForSale
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

export const GET = async (request) => {
    try {
        const { searchParams } = new URL(request.url);
        const locale = searchParams.get("locale") || "en";
        const language = locale.toLowerCase().startsWith("ar")
            ? "AR"
            : "EN";

        const storeDomain = getShopifyDomain();
        const storefrontAccessToken =
            process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
        const storefrontApiVersion =
            process.env.SHOPIFY_STOREFRONT_API_VERSION || "2026-04";

        if (!storeDomain || !storefrontAccessToken) {
            return Response.json(
                {
                    success: false,
                    message: "Shopify environment variables are missing",
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
                    "Content-Type": "application/json",
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

        const data = await response.json();

        if (!response.ok) {
            return Response.json(
                {
                    success: false,
                    message: "Shopify request failed",
                    error: data,
                },
                {
                    status: response.status,
                }
            );
        }

        if (data.errors) {
            return Response.json(
                {
                    success: false,
                    message:
                        data.errors[0]?.message ||
                        "Unable to fetch Shopify products",
                    errors: data.errors,
                },
                {
                    status: 400,
                }
            );
        }

        const products =
            data?.data?.products?.nodes?.map((product) => {
                const variant = product.variants?.nodes?.[0] || null;
                const price = Number(variant?.price?.amount || 0);
                const oldPrice = variant?.compareAtPrice?.amount
                    ? Number(variant.compareAtPrice.amount)
                    : null;

                return {
                    id: product.id,
                    variantId: variant?.id || null,
                    handle: product.handle,
                    title: product.title,
                    description: product.description || "",
                    category: product.productType || "Product",
                    availableForSale:
                        Boolean(product.availableForSale) &&
                        Boolean(variant?.availableForSale),
                    image: product.featuredImage,
                    price,
                    oldPrice,
                    currencyCode:
                        variant?.price?.currencyCode || "QAR",
                    badge:
                        oldPrice && oldPrice > price
                            ? "sale"
                            : null,
                };
            }) || [];

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
                    error.message || "Something went wrong",
            },
            {
                status: 500,
            }
        );
    }
};