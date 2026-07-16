import { NextResponse } from "next/server";
import { shopifyFetch } from "@/lib/shopify";
import { GET_COLLECTION_BY_HANDLE } from "@/lib/queries";

export const GET = async (request, { params }) => {
    try {
        const { handle } = await params;

        const data = await shopifyFetch({
            query: GET_COLLECTION_BY_HANDLE,
            variables: {
                handle,
            },
        });

        if (!data.collection) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Collection not found",
                },
                {
                    status: 404,
                }
            );
        }

        return NextResponse.json({
            success: true,
            collection: {
                ...data.collection,
                products: data.collection.products.edges.map((item) => item.node),
            },
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