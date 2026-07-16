import { createHash, randomBytes } from "crypto";

const clientId = process.env.SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID;
const customerAccountDomain = process.env.SHOPIFY_CUSTOMER_ACCOUNT_DOMAIN;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

if (!clientId) {
    throw new Error("SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID is missing");
}

if (!customerAccountDomain) {
    throw new Error("SHOPIFY_CUSTOMER_ACCOUNT_DOMAIN is missing");
}

if (!siteUrl) {
    throw new Error("NEXT_PUBLIC_SITE_URL is missing");
}

export const CUSTOMER_AUTH_COOKIE_NAMES = {
    state: "ziwora_auth_state",
    nonce: "ziwora_auth_nonce",
    verifier: "ziwora_auth_verifier",
    locale: "ziwora_auth_locale",
    returnTo: "ziwora_auth_return_to",
    accessToken: "ziwora_customer_access_token",
    refreshToken: "ziwora_customer_refresh_token",
    idToken: "ziwora_customer_id_token",
    expiresAt: "ziwora_customer_expires_at",
};

export const CUSTOMER_AUTH_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
};

export const getCustomerAuthConfig = async () => {
    const response = await fetch(`https://${customerAccountDomain}/.well-known/openid-configuration`, {
        method: "GET",
        cache: "no-store",
        headers: {
            Accept: "application/json",
            "User-Agent": "Ziwora-NextJS-Storefront",
        },
    });

    if (!response.ok) {
        throw new Error(`Unable to load Shopify authentication configuration: ${response.status}`);
    }

    const config = await response.json();

    if (!config.authorization_endpoint || !config.token_endpoint || !config.end_session_endpoint) {
        throw new Error("Shopify authentication configuration is incomplete");
    }

    return config;
};

export const getCustomerApiConfig = async () => {
    const response = await fetch(`https://${customerAccountDomain}/.well-known/customer-account-api`, {
        method: "GET",
        cache: "no-store",
        headers: {
            Accept: "application/json",
            "User-Agent": "Ziwora-NextJS-Storefront",
        },
    });

    if (!response.ok) {
        throw new Error(`Unable to load Shopify Customer Account API configuration: ${response.status}`);
    }

    const config = await response.json();

    if (!config.graphql_api) {
        throw new Error("Shopify Customer Account GraphQL endpoint is missing");
    }

    return config;
};

export const generateRandomValue = (size = 32) => {
    return randomBytes(size).toString("base64url");
};

export const generateCodeVerifier = () => {
    return generateRandomValue(64);
};

export const generateCodeChallenge = (verifier) => {
    return createHash("sha256").update(verifier).digest("base64url");
};

export const getCustomerCallbackUrl = () => {
    return `${siteUrl}/api/auth/callback`;
};

export const sanitizeLocale = (locale) => {
    return locale === "ar" ? "ar" : "en";
};

export const sanitizeReturnTo = (returnTo, locale = "en") => {
    const safeLocale = sanitizeLocale(locale);

    if (!returnTo || typeof returnTo !== "string") {
        return `/${safeLocale}`;
    }

    if (!returnTo.startsWith("/") || returnTo.startsWith("//")) {
        return `/${safeLocale}`;
    }

    return returnTo;
};

export const createAuthorizationUrl = async ({
    state,
    nonce,
    codeChallenge,
    locale = "en",
    loginHint = "",
}) => {
    const config = await getCustomerAuthConfig();
    const callbackUrl = getCustomerCallbackUrl();
    const safeLocale = sanitizeLocale(locale);
    const authorizationUrl = new URL(config.authorization_endpoint);

    authorizationUrl.searchParams.set("scope", "openid email customer-account-api:full");
    authorizationUrl.searchParams.set("client_id", clientId);
    authorizationUrl.searchParams.set("response_type", "code");
    authorizationUrl.searchParams.set("redirect_uri", callbackUrl);
    authorizationUrl.searchParams.set("state", state);
    authorizationUrl.searchParams.set("nonce", nonce);
    authorizationUrl.searchParams.set("code_challenge", codeChallenge);
    authorizationUrl.searchParams.set("code_challenge_method", "S256");
    authorizationUrl.searchParams.set("locale", safeLocale === "ar" ? "ar" : "en");
    authorizationUrl.searchParams.set("region_country", "QA");

    if (loginHint?.trim()) {
        authorizationUrl.searchParams.set("login_hint", loginHint.trim());
    }

    return authorizationUrl;
};

export const exchangeAuthorizationCode = async ({
    code,
    codeVerifier,
}) => {
    const config = await getCustomerAuthConfig();
    const callbackUrl = getCustomerCallbackUrl();
    const body = new URLSearchParams();

    body.set("grant_type", "authorization_code");
    body.set("client_id", clientId);
    body.set("redirect_uri", callbackUrl);
    body.set("code", code);
    body.set("code_verifier", codeVerifier);

    const response = await fetch(config.token_endpoint, {
        method: "POST",
        cache: "no-store",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/json",
            Origin: siteUrl,
            "User-Agent": "Ziwora-NextJS-Storefront",
        },
        body,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error_description || data.error || "Unable to complete Shopify authentication");
    }

    if (!data.access_token || !data.refresh_token || !data.id_token) {
        throw new Error("Shopify did not return complete authentication tokens");
    }

    return data;
};

export const refreshCustomerAccessToken = async (refreshToken) => {
    const config = await getCustomerAuthConfig();
    const body = new URLSearchParams();

    body.set("grant_type", "refresh_token");
    body.set("client_id", clientId);
    body.set("refresh_token", refreshToken);

    const response = await fetch(config.token_endpoint, {
        method: "POST",
        cache: "no-store",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/json",
            Origin: siteUrl,
            "User-Agent": "Ziwora-NextJS-Storefront",
        },
        body,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error_description || data.error || "Unable to refresh Shopify authentication");
    }

    return data;
};

export const getCustomerLogoutUrl = async ({
    idToken,
    locale = "en",
}) => {
    const config = await getCustomerAuthConfig();
    const safeLocale = sanitizeLocale(locale);
    const logoutUrl = new URL(config.end_session_endpoint);

    logoutUrl.searchParams.set("id_token_hint", idToken);
    logoutUrl.searchParams.set("post_logout_redirect_uri", `${siteUrl}/${safeLocale}`);

    return logoutUrl;
};

export const customerAccountFetch = async ({
    accessToken,
    query,
    variables = {},
}) => {
    const config = await getCustomerApiConfig();

    const response = await fetch(config.graphql_api, {
        method: "POST",
        cache: "no-store",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: accessToken,
            Origin: siteUrl,
            "User-Agent": "Ziwora-NextJS-Storefront",
        },
        body: JSON.stringify({
            query,
            variables,
        }),
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(`Customer Account API request failed: ${response.status}`);
    }

    if (result.errors?.length) {
        throw new Error(result.errors.map((error) => error.message).join(", "));
    }

    return result.data;
};