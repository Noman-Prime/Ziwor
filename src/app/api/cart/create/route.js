import { NextResponse } from "next/server";
import { shopifyFetch } from "@/lib/shopify";
import { CREATE_CART } from "@/lib/mutations";

export const POST = async () => {
    try {
        const data = await shopifyFetch({
            query: CREATE_CART,
            variables: {
                input: {},
            },
        });

        return NextResponse.json({
            success: true,
            cart: data.cartCreate.cart,
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