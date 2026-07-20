import { shopifyFetch } from "@/lib/shopify";
import { SOCIAL_MEDIA_QUERY } from "@/lib/queries";

const getLinkUrl = (value) => {
    if (!value) {
        return "";
    }

    try {
        const parsedLink = JSON.parse(value);

        return parsedLink?.url || "";
    } catch {
        return value;
    }
};

export const getSocialMedia = async (locale = "en") => {
    try {
        const language =
            locale?.toLowerCase().startsWith("ar")
                ? "AR"
                : "EN";

        const response = await shopifyFetch({
            query: SOCIAL_MEDIA_QUERY,
            variables: {
                language,
            },
        });

        const data = response?.data || response;

        const socialMedia =
            data?.metaobjects?.edges?.map(({ node }) => ({
                id: node?.id || "",
                handle: node?.handle || "",

                showSocialMedia:
                    String(
                        node?.showSocialMedia?.value
                    ).toLowerCase() === "true",

                name:
                    node?.name?.value || "",

                image: {
                    url:
                        node?.image?.reference?.image?.url ||
                        node?.image?.reference?.url ||
                        "",

                    altText:
                        node?.image?.reference?.image
                            ?.altText ||
                        node?.name?.value ||
                        "",

                    width:
                        node?.image?.reference?.image
                            ?.width || null,

                    height:
                        node?.image?.reference?.image
                            ?.height || null,
                },

                link: getLinkUrl(
                    node?.link?.value
                ),
            })) || [];

        return socialMedia.filter(
            (item) =>
                item.showSocialMedia &&
                item.image.url &&
                item.link
        );
    } catch (error) {
        console.error(
            "Failed to fetch social media:",
            error
        );

        return [];
    }
};