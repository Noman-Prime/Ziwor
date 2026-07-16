import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { CUSTOMER_AUTH_COOKIE_NAMES, CUSTOMER_AUTH_COOKIE_OPTIONS, exchangeAuthorizationCode, sanitizeLocale, sanitizeReturnTo } from "@/lib/customer-auth";

export const dynamic = "force-dynamic";

const decodeJwtPayload = (token) => {
    const parts = token.split(".");

    if (parts.length !== 3) {
        throw new Error("Invalid ID token");
    }

    const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padding = payload.length % 4 === 0 ? "" : "=".repeat(4 - (payload.length % 4));

    return JSON.parse(Buffer.from(`${payload}${padding}`, "base64").toString("utf8"));
};

const clearTemporaryCookies = (response) => {
    const temporaryCookies = [
        CUSTOMER_AUTH_COOKIE_NAMES.state,
        CUSTOMER_AUTH_COOKIE_NAMES.nonce,
        CUSTOMER_AUTH_COOKIE_NAMES.verifier,
        CUSTOMER_AUTH_COOKIE_NAMES.locale,
        CUSTOMER_AUTH_COOKIE_NAMES.returnTo,
    ];

    temporaryCookies.forEach((name) => {
        response.cookies.set(name, "", {
            ...CUSTOMER_AUTH_COOKIE_OPTIONS,
            maxAge: 0,
        });
    });
};

export const GET = async (request) => {
    const requestUrl = new URL(request.url);
    const cookieStore = await cookies();
    const storedLocale = sanitizeLocale(cookieStore.get(CUSTOMER_AUTH_COOKIE_NAMES.locale)?.value);
    const storedReturnTo = sanitizeReturnTo(cookieStore.get(CUSTOMER_AUTH_COOKIE_NAMES.returnTo)?.value, storedLocale);
    const loginUrl = new URL(`/${storedLocale}/login`, process.env.NEXT_PUBLIC_SITE_URL);

    try {
        const authorizationError = requestUrl.searchParams.get("error");
        const authorizationErrorDescription = requestUrl.searchParams.get("error_description");
        const code = requestUrl.searchParams.get("code");
        const returnedState = requestUrl.searchParams.get("state");
        const storedState = cookieStore.get(CUSTOMER_AUTH_COOKIE_NAMES.state)?.value;
        const storedNonce = cookieStore.get(CUSTOMER_AUTH_COOKIE_NAMES.nonce)?.value;
        const codeVerifier = cookieStore.get(CUSTOMER_AUTH_COOKIE_NAMES.verifier)?.value;

        if (authorizationError) {
            throw new Error(authorizationErrorDescription || authorizationError);
        }

        if (!code) {
            throw new Error("Shopify did not return an authorization code");
        }

        if (!returnedState || !storedState || returnedState !== storedState) {
            throw new Error("Invalid authentication state");
        }

        if (!codeVerifier) {
            throw new Error("PKCE code verifier is missing or expired");
        }

        const tokens = await exchangeAuthorizationCode({
            code,
            codeVerifier,
        });

        const idTokenPayload = decodeJwtPayload(tokens.id_token);

        if (!storedNonce || idTokenPayload.nonce !== storedNonce) {
            throw new Error("Invalid authentication nonce");
        }

        const expiresIn = Number(tokens.expires_in || 3600);
        const expiresAt = Math.floor(Date.now() / 1000) + expiresIn;
        const response = NextResponse.redirect(new URL(storedReturnTo, process.env.NEXT_PUBLIC_SITE_URL));

        response.cookies.set(CUSTOMER_AUTH_COOKIE_NAMES.accessToken, tokens.access_token, {
            ...CUSTOMER_AUTH_COOKIE_OPTIONS,
            maxAge: expiresIn,
        });

        response.cookies.set(CUSTOMER_AUTH_COOKIE_NAMES.refreshToken, tokens.refresh_token, {
            ...CUSTOMER_AUTH_COOKIE_OPTIONS,
            maxAge: 60 * 60 * 24 * 30,
        });

        response.cookies.set(CUSTOMER_AUTH_COOKIE_NAMES.idToken, tokens.id_token, {
            ...CUSTOMER_AUTH_COOKIE_OPTIONS,
            maxAge: 60 * 60 * 24 * 30,
        });

        response.cookies.set(CUSTOMER_AUTH_COOKIE_NAMES.expiresAt, String(expiresAt), {
            ...CUSTOMER_AUTH_COOKIE_OPTIONS,
            maxAge: 60 * 60 * 24 * 30,
        });

        clearTemporaryCookies(response);

        return response;
    } catch (error) {
        loginUrl.searchParams.set("error", "shopify_callback_failed");
        loginUrl.searchParams.set("message", error.message);

        const response = NextResponse.redirect(loginUrl);

        clearTemporaryCookies(response);

        return response;
    }
};