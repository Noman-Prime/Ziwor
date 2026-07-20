import { NextResponse } from "next/server";
import { getFooterContact } from "@/lib/footer-contact";

export const dynamic = "force-dynamic";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);

        const locale =
            searchParams.get("locale") || "en";

        const footerContact =
            await getFooterContact(locale);

        return NextResponse.json(
            footerContact,
            {
                headers: {
                    "Cache-Control":
                        "no-store",
                },
            }
        );
    } catch (error) {
        console.error(
            "Footer Contact API Error:",
            error
        );

        return NextResponse.json(
            {
                error:
                    error?.message ||
                    "Failed to fetch footer contact.",
            },
            {
                status: 500,
            }
        );
    }
}