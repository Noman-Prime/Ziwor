import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { CUSTOMER_AUTH_COOKIE_NAMES, CUSTOMER_AUTH_COOKIE_OPTIONS, customerAccountFetch, refreshCustomerAccessToken } from "@/lib/customer-auth";

export const dynamic = "force-dynamic";

const GET_CUSTOMER = `
    query GetCustomer {
        customer {
            id
            firstName
            lastName
            displayName
            emailAddress {
                emailAddress
            }
            phoneNumber {
                phoneNumber
            }
        }
    }
`;

const clearAuthenticationCookies = (response) => {
    const authenticationCookies = [
        CUSTOMER_AUTH_COOKIE_NAMES.accessToken,
        CUSTOMER_AUTH_COOKIE_NAMES.refreshToken,
        CUSTOMER_AUTH_COOKIE_NAMES.idToken,
        CUSTOMER_AUTH_COOKIE_NAMES.expiresAt,
    ];

    authenticationCookies.forEach((name) => {
        response.cookies.set(name, "", {
            ...CUSTOMER_AUTH_COOKIE_OPTIONS,
            maxAge: 0,
        });
    });
};

const setAuthenticationCookies = (response, tokens) => {
    const expiresIn = Number(tokens.expires_in || 3600);
    const expiresAt = Math.floor(Date.now() / 1000) + expiresIn;

    response.cookies.set(CUSTOMER_AUTH_COOKIE_NAMES.accessToken, tokens.access_token, {
        ...CUSTOMER_AUTH_COOKIE_OPTIONS,
        maxAge: expiresIn,
    });

    if (tokens.refresh_token) {
        response.cookies.set(CUSTOMER_AUTH_COOKIE_NAMES.refreshToken, tokens.refresh_token, {
            ...CUSTOMER_AUTH_COOKIE_OPTIONS,
            maxAge: 60 * 60 * 24 * 30,
        });
    }

    if (tokens.id_token) {
        response.cookies.set(CUSTOMER_AUTH_COOKIE_NAMES.idToken, tokens.id_token, {
            ...CUSTOMER_AUTH_COOKIE_OPTIONS,
            maxAge: 60 * 60 * 24 * 30,
        });
    }

    response.cookies.set(CUSTOMER_AUTH_COOKIE_NAMES.expiresAt, String(expiresAt), {
        ...CUSTOMER_AUTH_COOKIE_OPTIONS,
        maxAge: 60 * 60 * 24 * 30,
    });
};

const getCustomer = async (accessToken) => {
    const data = await customerAccountFetch({
        accessToken,
        query: GET_CUSTOMER,
    });

    return data.customer;
};

export const GET = async () => {
    const cookieStore = await cookies();
    let accessToken = cookieStore.get(CUSTOMER_AUTH_COOKIE_NAMES.accessToken)?.value;
    const refreshToken = cookieStore.get(CUSTOMER_AUTH_COOKIE_NAMES.refreshToken)?.value;
    const expiresAt = Number(cookieStore.get(CUSTOMER_AUTH_COOKIE_NAMES.expiresAt)?.value || 0);
    const currentTime = Math.floor(Date.now() / 1000);
    let refreshedTokens = null;

    try {
        if (!accessToken && !refreshToken) {
            return NextResponse.json({
                success: true,
                authenticated: false,
                customer: null,
            });
        }

        if ((!accessToken || expiresAt <= currentTime + 60) && refreshToken) {
            refreshedTokens = await refreshCustomerAccessToken(refreshToken);
            accessToken = refreshedTokens.access_token;
        }

        if (!accessToken) {
            const response = NextResponse.json({
                success: true,
                authenticated: false,
                customer: null,
            });

            clearAuthenticationCookies(response);

            return response;
        }

        let customer;

        try {
            customer = await getCustomer(accessToken);
        } catch (error) {
            if (!refreshToken || refreshedTokens) {
                throw error;
            }

            refreshedTokens = await refreshCustomerAccessToken(refreshToken);
            accessToken = refreshedTokens.access_token;
            customer = await getCustomer(accessToken);
        }

        if (!customer) {
            const response = NextResponse.json({
                success: true,
                authenticated: false,
                customer: null,
            });

            clearAuthenticationCookies(response);

            return response;
        }

        const response = NextResponse.json({
            success: true,
            authenticated: true,
            customer: {
                id: customer.id,
                firstName: customer.firstName || "",
                lastName: customer.lastName || "",
                displayName: customer.displayName || "",
                email: customer.emailAddress?.emailAddress || "",
                phone: customer.phoneNumber?.phoneNumber || "",
            },
        });

        if (refreshedTokens) {
            setAuthenticationCookies(response, refreshedTokens);
        }

        return response;
    } catch (error) {
        const response = NextResponse.json(
            {
                success: false,
                authenticated: false,
                customer: null,
                message: error.message || "Unable to load customer session",
            },
            {
                status: 401,
            }
        );

        clearAuthenticationCookies(response);

        return response;
    }
};