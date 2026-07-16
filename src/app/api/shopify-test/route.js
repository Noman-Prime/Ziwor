import { NextResponse } from "next/server";
import { shopifyFetch } from "@/lib/shopify";
import { GET_SHOP } from "@/lib/queries";

export const GET = async () => {
    try {
        const data = await shopifyFetch({
            query: GET_SHOP,
        });

        return NextResponse.json({
            success: true,
            shop: data.shop,
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