import { NextResponse } from "next/server";
import { createAuthorizationUrl, CUSTOMER_AUTH_COOKIE_NAMES, CUSTOMER_AUTH_COOKIE_OPTIONS, generateCodeChallenge, generateCodeVerifier, generateRandomValue, sanitizeLocale, sanitizeReturnTo } from "@/lib/customer-auth";

export const dynamic = "force-dynamic";

export const GET = async (request) => {
    try {
        const requestUrl = new URL(request.url);
        const locale = sanitizeLocale(requestUrl.searchParams.get("locale"));
        const returnTo = sanitizeReturnTo(requestUrl.searchParams.get("returnTo"), locale);
        const loginHint = requestUrl.searchParams.get("email") || "";
        const state = generateRandomValue(32);
        const nonce = generateRandomValue(32);
        const codeVerifier = generateCodeVerifier();
        const codeChallenge = generateCodeChallenge(codeVerifier);

        const authorizationUrl = await createAuthorizationUrl({
            state,
            nonce,
            codeChallenge,
            locale,
            loginHint,
        });

        const response = NextResponse.redirect(authorizationUrl);

        response.cookies.set(CUSTOMER_AUTH_COOKIE_NAMES.state, state, {
            ...CUSTOMER_AUTH_COOKIE_OPTIONS,
            maxAge: 60 * 10,
        });

        response.cookies.set(CUSTOMER_AUTH_COOKIE_NAMES.nonce, nonce, {
            ...CUSTOMER_AUTH_COOKIE_OPTIONS,
            maxAge: 60 * 10,
        });

        response.cookies.set(CUSTOMER_AUTH_COOKIE_NAMES.verifier, codeVerifier, {
            ...CUSTOMER_AUTH_COOKIE_OPTIONS,
            maxAge: 60 * 10,
        });

        response.cookies.set(CUSTOMER_AUTH_COOKIE_NAMES.locale, locale, {
            ...CUSTOMER_AUTH_COOKIE_OPTIONS,
            maxAge: 60 * 10,
        });

        response.cookies.set(CUSTOMER_AUTH_COOKIE_NAMES.returnTo, returnTo, {
            ...CUSTOMER_AUTH_COOKIE_OPTIONS,
            maxAge: 60 * 10,
        });

        return response;
    } catch (error) {
        const requestUrl = new URL(request.url);
        const locale = sanitizeLocale(requestUrl.searchParams.get("locale"));
        const errorUrl = new URL(`/${locale}/login`, requestUrl.origin);

        errorUrl.searchParams.set("error", "shopify_login_failed");

        return NextResponse.redirect(errorUrl);
    }
};