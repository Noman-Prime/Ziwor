import { shopifyFetch } from "@/lib/shopify";
import { SOCIAL_MEDIA_QUERY } from "@/lib/queries";

const getLanguageCode = (locale) =>
    locale?.toLowerCase().startsWith("ar")
        ? "AR"
        : "EN";

const getImage = (reference) => {
    if (!reference) {
        return null;
    }

    if (reference?.image?.url) {
        return {
            url: reference.image.url,
            altText:
                reference.image.altText || "",
            width:
                reference.image.width || null,
            height:
                reference.image.height || null,
        };
    }

    if (reference?.url) {
        return {
            url: reference.url,
            altText: "",
            width: null,
            height: null,
        };
    }

    return null;
};

const getBoolean = (value) => {
    return String(value)
        .trim()
        .toLowerCase() === "true";
};

export async function getSocialMedia(
    locale = "en"
) {
    const response = await shopifyFetch({
        query: SOCIAL_MEDIA_QUERY,
        variables: {
            language:
                getLanguageCode(locale),
        },
    });

    console.log(
        "SOCIAL MEDIA RAW RESPONSE:",
        JSON.stringify(response, null, 2)
    );

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
            "SOCIAL MEDIA GRAPHQL ERRORS:",
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
        response?.body?.data?.metaobjects ||
        response?.body?.metaobjects ||
        null;

    const edges = Array.isArray(
        metaobjects?.edges
    )
        ? metaobjects.edges
        : [];

    console.log(
        "SOCIAL MEDIA ENTRIES FOUND:",
        edges.length
    );

    return edges.map(
        ({ node }, index) => ({
            id:
                node?.id ||
                `social-${index}`,
            handle:
                node?.handle || "",
            showSocialMedia:
                getBoolean(
                    node?.showSocialMedia
                        ?.value
                ),
            name:
                node?.name?.value || "",
            image:
                getImage(
                    node?.image
                        ?.reference
                ),
            link:
                node?.link?.value || "",
            order: index,
        })
    );
}