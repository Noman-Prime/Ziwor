const domain = process.env.SHOPIFY_STORE_DOMAIN;
const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const apiVersion = process.env.SHOPIFY_API_VERSION;

if (!domain) {
    throw new Error("SHOPIFY_STORE_DOMAIN is missing");
}

if (!token) {
    throw new Error(
        "SHOPIFY_STOREFRONT_ACCESS_TOKEN is missing"
    );
}

if (!apiVersion) {
    throw new Error("SHOPIFY_API_VERSION is missing");
}

const endpoint =
    `https://${domain}/api/${apiVersion}/graphql.json`;

export const shopifyFetch = async ({
    query,
    variables = {},
    cache = "no-store",
}) => {
    const response = await fetch(endpoint, {
        method: "POST",
        cache,
        headers: {
            "Content-Type": "application/json",
            "Shopify-Storefront-Private-Token": token,
        },
        body: JSON.stringify({
            query,
            variables,
        }),
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            `Shopify request failed with status ${response.status}`
        );
    }

    if (result.errors?.length) {
        throw new Error(
            result.errors
                .map((error) => error.message)
                .join(", ")
        );
    }

    return result.data;
};