import { shopifyFetch } from "@/lib/shopify";
import { HOMEPAGE_PROMOTIONS_QUERY } from "@/lib/queries";

export const getHomepagePromotions = async (locale = "en") => {
    try {
        const language = locale.toLowerCase().startsWith("ar") ? "AR" : "EN";

        const data = await shopifyFetch({
            query: HOMEPAGE_PROMOTIONS_QUERY,
            variables: {
                language,
            },
            cache: "no-store",
        });

        const entries = data?.metaobjects?.nodes || [];

        return entries
            .map((entry) => ({
                id: entry.id,
                handle: entry.handle,
                title: entry.title?.value || "",
                promotionType: entry.promotionType?.value || "",
                enabled: entry.enabled?.value === "true",
                displayLocation: entry.displayLocation?.value || "",
                position: Number(entry.position?.value || 0),
                heading: entry.heading?.value || "",
                description: entry.description?.value || "",
                image: entry.image?.reference?.image || null,
                buttonText: entry.buttonText?.value || "",
                startDate: entry.startDate?.value || null,
                endDate: entry.endDate?.value || null,
                backgroundColor:
                    entry.backgroundColor?.value || "#111111",

                collection: entry.collection?.reference
                    ? {
                        id: entry.collection.reference.id,
                        title: entry.collection.reference.title,
                        handle: entry.collection.reference.handle,
                        image: entry.collection.reference.image,
                    }
                    : null,

                product: entry.product?.reference
                    ? {
                        id: entry.product.reference.id,
                        title: entry.product.reference.title,
                        handle: entry.product.reference.handle,
                        availableForSale:
                            entry.product.reference.availableForSale,
                        featuredImage:
                            entry.product.reference.featuredImage,
                        variant:
                            entry.product.reference
                                .selectedOrFirstAvailableVariant,
                    }
                    : null,
            }))
            .filter((entry) => entry.enabled)
            .sort((first, second) => first.position - second.position);
    } catch (error) {
        console.error(
            "Failed to fetch homepage promotions:",
            error.message
        );

        return [];
    }
};