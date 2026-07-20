import { shopifyFetch } from "@/lib/shopify";
import { BRAND_LOGO_QUERY } from "@/lib/queries";

export const getBrandLogo = async (locale = "en") => {
    try {
        const language = locale
            ?.toLowerCase()
            .startsWith("ar")
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

                const logoReference =
                    fields.logo?.reference;

                return {
                    id: node?.id || "",
                    handle: node?.handle || "",

                    showBrand:
                        String(
                            fields.show_brand?.value
                        ).toLowerCase() === "true",

                    logo: {
                        url:
                            logoReference?.image?.url ||
                            logoReference?.url ||
                            "",

                        altText:
                            logoReference?.image?.altText ||
                            fields.business_name?.value ||
                            "Brand logo",

                        width:
                            logoReference?.image?.width ||
                            null,

                        height:
                            logoReference?.image?.height ||
                            null,
                    },

                    businessName:
                        fields.business_name?.value || "",

                    description:
                        fields.description?.value || "",
                };
            }) || [];

        const activeBrand = brands.find(
            (brand) => brand.showBrand
        );

        return activeBrand || null;
    } catch (error) {
        console.error(
            "Failed to fetch brand data:",
            error
        );

        return null;
    }
};