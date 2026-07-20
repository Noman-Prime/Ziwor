import { NextResponse } from "next/server";
import { getSocialMedia } from "@/lib/social-media";

export const dynamic = "force-dynamic";

export async function GET(request) {
    try {
        const { searchParams } =
            new URL(request.url);

        const locale =
            searchParams.get("locale") ||
            "en";

        const socialMedia =
            await getSocialMedia(locale);

        return NextResponse.json(
            socialMedia,
            {
                headers: {
                    "Cache-Control":
                        "no-store",
                },
            }
        );
    } catch (error) {
        console.error(
            "Social Media API Error:",
            error
        );

        return NextResponse.json(
            {
                error:
                    error?.message ||
                    "Failed to fetch social media.",
            },
            {
                status: 500,
            }
        );
    }
}