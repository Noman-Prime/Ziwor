import { NextResponse } from "next/server";
import { shopifyFetch } from "@/lib/shopify";
import { REMOVE_CART_LINES } from "@/lib/mutations";

export const DELETE = async (request) => {
    try {
        const body = await request.json();

        const data = await shopifyFetch({
            query: REMOVE_CART_LINES,
            variables: {
                cartId: body.cartId,
                lineIds: [body.lineId],
            },
        });

        return NextResponse.json({
            success: true,
            cart: data.cartLinesRemove.cart,
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