import { shopifyFetch } from "@/lib/shopify";
import { FOOTER_CONTACT_QUERY } from "@/lib/queries";

const getLanguageCode = (locale) =>
    locale?.toLowerCase().startsWith("ar")
        ? "AR"
        : "EN";

const getFieldValue = (field) => {
    if (!field?.value) {
        return "";
    }

    return String(field.value).trim();
};

export async function getFooterContact(
    locale = "en"
) {
    const response = await shopifyFetch({
        query: FOOTER_CONTACT_QUERY,
        variables: {
            language:
                getLanguageCode(locale),
        },
    });

    const graphqlErrors =
        response?.errors ||
        response?.body?.errors ||
        response?.data?.errors ||
        [];

    if (
        Array.isArray(graphqlErrors) &&
        graphqlErrors.length > 0
    ) {
        console.error(
            "Footer Contact GraphQL Errors:",
            JSON.stringify(
                graphqlErrors,
                null,
                2
            )
        );

        throw new Error(
            graphqlErrors
                .map(
                    (error) =>
                        error?.message ||
                        "GraphQL error"
                )
                .join(", ")
        );
    }

    const metaobjects =
        response?.data?.metaobjects ||
        response?.metaobjects ||
        response?.body?.data
            ?.metaobjects ||
        response?.body?.metaobjects ||
        null;

    const entry =
        metaobjects?.edges?.[0]?.node ||
        null;

    if (!entry) {
        return null;
    }

    return {
        id: entry.id || "",
        handle: entry.handle || "",
        email:
            getFieldValue(entry.email),
        whatsappNumber:
            getFieldValue(
                entry.whatsappNumber
            ),
        whatsappMessage:
            getFieldValue(
                entry.whatsappMessage
            ),
        address:
            getFieldValue(entry.address),
    };
}