import { NextResponse } from "next/server";
import { shopifyFetch } from "@/lib/shopify";
import { GET_COLLECTIONS } from "@/lib/queries";

export const GET = async () => {
    try {
        const data = await shopifyFetch({
            query: GET_COLLECTIONS,
        });

        return NextResponse.json({
            success: true,
            collections: data.collections.edges,
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: error.message,
            },
            {
                status: 500,
            }
        );
    }
};