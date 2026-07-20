import { NextResponse } from "next/server";
import { getBrandLogo } from "@/lib/brand-logo";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);

        const locale = searchParams.get("locale") || "en";

        const brand = await getBrandLogo(locale);

        return NextResponse.json(brand);
    } catch (error) {
        console.error("Brand API Error:", error);

        return NextResponse.json(
            { error: "Failed to load brand." },
            { status: 500 }
        );
    }
}