import { NextResponse } from "next/server";
import { shopifyFetch } from "@/lib/shopify";
import { GET_COLLECTIONS } from "@/lib/queries";

export const GET = async (request) => {
    try {
        const { searchParams } = new URL(request.url);
        const locale = searchParams.get("locale") || "en";
        const language = locale.toLowerCase().startsWith("ar") ? "AR" : "EN";

        const data = await shopifyFetch({
            query: GET_COLLECTIONS,
            variables: {
                language,
            },
            cache: "no-store",
        });

        const collections =
            data?.collections?.edges?.map(({ node }) => node) || [];

        return NextResponse.json({
            success: true,
            collections,
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: error.message || "Unable to load collections",
            },
            {
                status: 500,
            }
        );
    }
};