import { NextResponse } from "next/server";
import { shopifyFetch } from "@/lib/shopify";
import { UPDATE_CART_LINES } from "@/lib/mutations";

export const PUT = async (request) => {
    try {
        const body = await request.json();

        const data = await shopifyFetch({
            query: UPDATE_CART_LINES,
            variables: {
                cartId: body.cartId,
                lines: [
                    {
                        id: body.lineId,
                        quantity: body.quantity,
                    },
                ],
            },
        });

        return NextResponse.json({
            success: true,
            cart: data.cartLinesUpdate.cart,
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