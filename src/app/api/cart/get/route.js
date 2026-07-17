import { NextResponse } from "next/server";
import { shopifyFetch } from "@/lib/shopify";
import { GET_CART } from "@/lib/queries";

export const POST = async (request) => {
    try {
        const body = await request.json();
        const { cartId } = body;

        if (!cartId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Cart ID is required",
                },
                {
                    status: 400,
                }
            );
        }

        const data = await shopifyFetch({
            query: GET_CART,
            variables: {
                cartId,
            },
        });

        if (!data?.cart) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Cart not found",
                },
                {
                    status: 404,
                }
            );
        }

        return NextResponse.json({
            success: true,
            cart: data.cart,
        });
    } catch (error) {
        console.error("Get cart error:", error);

        return NextResponse.json(
            {
                success: false,
                message: error.message || "Unable to get cart",
            },
            {
                status: 500,
            }
        );
    }
};