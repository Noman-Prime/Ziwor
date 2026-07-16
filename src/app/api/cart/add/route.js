import { NextResponse } from "next/server";
import { shopifyFetch } from "@/lib/shopify";
import { ADD_CART_LINES } from "@/lib/mutations";

export const POST = async (request) => {
    try {
        const body = await request.json();

        const data = await shopifyFetch({
            query: ADD_CART_LINES,
            variables: {
                cartId: body.cartId,
                lines: [
                    {
                        merchandiseId: body.variantId,
                        quantity: body.quantity,
                    },
                ],
            },
        });

        return NextResponse.json({
            success: true,
            cart: data.cartLinesAdd.cart,
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