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

        const result = data?.cartCreate;
        const userErrors = result?.userErrors || [];

        if (userErrors.length > 0) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        userErrors[0]?.message ||
                        "Unable to create cart",
                },
                {
                    status: 400,
                }
            );
        }

        if (!result?.cart?.id) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Shopify did not return a valid cart",
                },
                {
                    status: 500,
                }
            );
        }

        return NextResponse.json({
            success: true,
            cart: result.cart,
            warnings: result.warnings || [],
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message:
                    error instanceof Error
                        ? error.message
                        : "Unable to create cart",
            },
            {
                status: 500,
            }
        );
    }
};