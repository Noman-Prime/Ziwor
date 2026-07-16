import { shopifyFetch } from "@/lib/shopify";
import { HERO_SLIDER_QUERY } from "@/lib/queries";

export const getHeroSliders = async () => {
    try {
        const data = await shopifyFetch({
            query: HERO_SLIDER_QUERY,
            cache: "no-store",
        });

        const entries = data?.metaobjects?.nodes || [];

        return entries
            .map((entry) => ({
                id: entry.id,
                handle: entry.handle,
                title: entry.title?.value || "",
                subtitle: entry.subtitle?.value || "",
                desktopImage:
                    entry.desktopImage?.reference?.image || null,
                mobileImage:
                    entry.mobileImage?.reference?.image || null,
                buttonText: entry.buttonText?.value || "",
                buttonLink: entry.buttonLink?.value || "",
                displayOrder: Number(
                    entry.displayOrder?.value || 0
                ),
            }))
            .filter((entry) => entry.desktopImage?.url)
            .sort(
                (first, second) =>
                    first.displayOrder - second.displayOrder
            );
    } catch (error) {
        console.error(
            "Failed to fetch hero sliders:",
            error.message
        );

        return [];
    }
};