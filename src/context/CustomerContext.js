"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const CustomerContext = createContext(null);

export const CustomerProvider = ({ children }) => {
    const [customer, setCustomer] = useState(null);
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    const loadCustomer = useCallback(async () => {
        try {
            setLoading(true);

            const response = await fetch("/api/auth/session", {
                method: "GET",
                credentials: "include",
                cache: "no-store",
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                setAuthenticated(false);
                setCustomer(null);
                return;
            }

            setAuthenticated(data.authenticated);
            setCustomer(data.customer);
        } catch {
            setAuthenticated(false);
            setCustomer(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadCustomer();
    }, [loadCustomer]);

    const login = (locale = "en", returnTo = `/${locale}`) => {
        window.location.href = `/api/auth/login?locale=${locale}&returnTo=${encodeURIComponent(returnTo)}`;
    };

    const signup = (locale = "en", returnTo = `/${locale}`) => {
        window.location.href = `/api/auth/login?locale=${locale}&returnTo=${encodeURIComponent(returnTo)}`;
    };

    const logout = (locale = "en") => {
        window.location.href = `/api/auth/logout?locale=${locale}`;
    };

    const value = useMemo(
        () => ({
            customer,
            authenticated,
            loading,
            login,
            signup,
            logout,
            refreshCustomer: loadCustomer,
        }),
        [customer, authenticated, loading, loadCustomer]
    );

    return (
        <CustomerContext.Provider value={value}>
            {children}
        </CustomerContext.Provider>
    );
};

export const useCustomer = () => {
    const context = useContext(CustomerContext);

    if (!context) {
        throw new Error("useCustomer must be used inside CustomerProvider");
    }

    return context;
};