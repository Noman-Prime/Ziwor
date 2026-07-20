import { shopifyFetch } from "@/lib/shopify";
import { FOOTER_CONTACT_QUERY } from "@/lib/queries";

export const getFooterContact = async (
    locale = "en"
) => {
    try {
        const language =
            locale?.toLowerCase().startsWith("ar")
                ? "AR"
                : "EN";

        const response = await shopifyFetch({
            query: FOOTER_CONTACT_QUERY,
            variables: {
                language,
            },
        });

        const data = response?.data || response;

        const node =
            data?.metaobjects?.edges?.[0]?.node;

        if (!node) {
            return null;
        }

        return {
            id: node?.id || "",
            handle: node?.handle || "",
            email: node?.email?.value || "",
            whatsappNumber:
                node?.whatsappNumber?.value || "",
            whatsappMessage:
                node?.whatsappMessage?.value || "",
            address: node?.address?.value || "",
        };
    } catch (error) {
        console.error(
            "Failed to fetch footer contact:",
            error
        );

        return null;
    }
};