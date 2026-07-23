import { META_PIXEL_SETTINGS_QUERY } from "./queries";

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

export const getMetaPixelSettings = async (
    locale = "en"
) => {
    const language =
        locale?.toLowerCase().startsWith("ar")
            ? "AR"
            : "EN";

    try {
        const data = await shopifyFetch({
            query: META_PIXEL_SETTINGS_QUERY,
            variables: {
                language,
            },
            cache: "no-store",
        });

        const node =
            data?.metaobjects?.edges?.[0]?.node;

        if (!node) {
            return null;
        }

        const enabled =
            node.enabled?.value === "true";

        const pixelId =
            node.pixelId?.value?.trim() || "";

        const testEventCode =
            node.testEventCode?.value?.trim() || "";

        if (!enabled || !pixelId) {
            return null;
        }

        return {
            enabled,
            pixelId,
            testEventCode,
        };
    } catch (error) {
        console.error(
            "Failed to fetch Meta Pixel settings:",
            error
        );

        return null;
    }
};