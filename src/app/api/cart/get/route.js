import { NextResponse } from "next/server";
import { shopifyFetch } from "@/lib/shopify";
import { GET_CART } from "@/lib/queries";

export const POST = async (request) => {
    try {
        const body = await request.json();

        const data = await shopifyFetch({
            query: GET_CART,
            variables: {
                cartId: body.cartId,
            },
        });

        return NextResponse.json({
            success: true,
            cart: data.cart,
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