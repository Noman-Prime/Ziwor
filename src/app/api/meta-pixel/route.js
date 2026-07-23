import { NextResponse } from "next/server";
import { getMetaPixelSettings } from "@/lib/shopify";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);

        const locale =
            searchParams.get("locale") || "en";

        const settings =
            await getMetaPixelSettings(locale);

        return NextResponse.json({
            success: true,
            data: settings,
        });
    } catch (error) {
        console.error("Meta Pixel API:", error);

        return NextResponse.json(
            {
                success: false,
                error: error.message,
            },
            {
                status: 500,
            }
        );
    }
}