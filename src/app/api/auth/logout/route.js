import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { CUSTOMER_AUTH_COOKIE_NAMES, CUSTOMER_AUTH_COOKIE_OPTIONS, getCustomerLogoutUrl, sanitizeLocale } from "@/lib/customer-auth";

export const dynamic = "force-dynamic";

const clearAuthenticationCookies = (response) => {
    const authenticationCookies = [
        CUSTOMER_AUTH_COOKIE_NAMES.accessToken,
        CUSTOMER_AUTH_COOKIE_NAMES.refreshToken,
        CUSTOMER_AUTH_COOKIE_NAMES.idToken,
        CUSTOMER_AUTH_COOKIE_NAMES.expiresAt,
        CUSTOMER_AUTH_COOKIE_NAMES.state,
        CUSTOMER_AUTH_COOKIE_NAMES.nonce,
        CUSTOMER_AUTH_COOKIE_NAMES.verifier,
        CUSTOMER_AUTH_COOKIE_NAMES.locale,
        CUSTOMER_AUTH_COOKIE_NAMES.returnTo,
    ];

    authenticationCookies.forEach((name) => {
        response.cookies.set(name, "", {
            ...CUSTOMER_AUTH_COOKIE_OPTIONS,
            maxAge: 0,
        });
    });
};

export const GET = async (request) => {
    const requestUrl = new URL(request.url);
    const cookieStore = await cookies();
    const locale = sanitizeLocale(requestUrl.searchParams.get("locale"));
    const idToken = cookieStore.get(CUSTOMER_AUTH_COOKIE_NAMES.idToken)?.value;
    const localRedirectUrl = new URL(`/${locale}`, process.env.NEXT_PUBLIC_SITE_URL);

    try {
        if (!idToken) {
            const response = NextResponse.redirect(localRedirectUrl);

            clearAuthenticationCookies(response);

            return response;
        }

        const logoutUrl = await getCustomerLogoutUrl({
            idToken,
            locale,
        });

        const response = NextResponse.redirect(logoutUrl);

        clearAuthenticationCookies(response);

        return response;
    } catch {
        const response = NextResponse.redirect(localRedirectUrl);

        clearAuthenticationCookies(response);

        return response;
    }
};