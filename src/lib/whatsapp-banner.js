import { shopifyFetch } from "@/lib/shopify";
import { WHATSAPP_BANNER_QUERY } from "@/lib/queries";

export const getWhatsAppBanner = async (locale = "en") => {
    try {
        const language =
            locale?.toLowerCase() === "ar" ? "AR" : "EN";

        const response = await shopifyFetch({
            query: WHATSAPP_BANNER_QUERY,
            variables: {
                language,
            },
        });

        const data = response?.data || response;

        const banners =
            data?.metaobjects?.edges || [];

        const mappedBanners = banners.map(({ node }) => ({
            id: node?.id || "",
            handle: node?.handle || "",
            showBanner:
                String(node?.showBanner?.value).toLowerCase() ===
                "true",
            heading: node?.heading?.value || "",
            description: node?.description?.value || "",
            whatsappNumber:
                node?.whatsappNumber?.value || "",
            buttonText: node?.buttonText?.value || "",
            backgroundColor:
                node?.backgroundColor?.value || "#25D366",
        }));

        return (
            mappedBanners.find(
                (banner) => banner.showBanner
            ) || null
        );
    } catch (error) {
        console.error(
            "Failed to fetch WhatsApp banner:",
            error
        );

        return null;
    }
};