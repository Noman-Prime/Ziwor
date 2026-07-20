import { shopifyFetch } from "@/lib/shopify";
import { BRAND_LOGO_QUERY } from "@/lib/queries";

export const getBrandLogo = async (locale = "en") => {
    try {
        const language =
            locale?.toLowerCase().startsWith("ar")
                ? "AR"
                : "EN";

        const response = await shopifyFetch({
            query: BRAND_LOGO_QUERY,
            variables: {
                language,
            },
        });

        const data = response?.data || response;

        const brands =
            data?.metaobjects?.edges?.map(({ node }) => {
                const fields = Object.fromEntries(
                    (node?.fields || []).map((field) => [
                        field.key,
                        field,
                    ])
                );

                const logoField = fields.logo;

                return {
                    id: node?.id || "",
                    handle: node?.handle || "",

                    showBrand:
                        String(
                            fields.show_brand?.value
                        ).toLowerCase() === "true",

                    logo: {
                        url:
                            logoField?.reference?.image?.url ||
                            logoField?.reference?.url ||
                            "",

                        altText:
                            logoField?.reference?.image?.altText ||
                            fields.business_name?.value ||
                            "",

                        width:
                            logoField?.reference?.image?.width ||
                            null,

                        height:
                            logoField?.reference?.image?.height ||
                            null,
                    },

                    businessName:
                        fields.business_name?.value || "",

                    description:
                        fields.description?.value || "",
                };
            }) || [];

        return (
            brands.find(
                (brand) =>
                    brand.showBrand &&
                    brand.logo.url
            ) || null
        );
    } catch (error) {
        console.error(
            "Failed to fetch brand logo:",
            error
        );

        return null;
    }
};