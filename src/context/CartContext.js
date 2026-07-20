"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

const CartContext = createContext(null);

const CART_STORAGE_KEY = "ziwora_cart_id";

const normalizeCart = (cart) => {
    if (!cart) {
        return null;
    }

    return {
        ...cart,
        lines:
            cart.lines?.edges?.map(
                (item) => item.node
            ) || [],
    };
};

const readJsonResponse = async (response) => {
    const data = await response
        .json()
        .catch(() => null);

    if (!data) {
        throw new Error(
            `Invalid server response (${response.status})`
        );
    }

    return data;
};

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [
        cartActionLoading,
        setCartActionLoading,
    ] = useState(false);
    const [error, setError] = useState("");

    const saveCart = useCallback((nextCart) => {
        const normalizedCart =
            normalizeCart(nextCart);

        setCart(normalizedCart);

        if (normalizedCart?.id) {
            localStorage.setItem(
                CART_STORAGE_KEY,
                normalizedCart.id
            );
        }

        return normalizedCart;
    }, []);

    const clearCart = useCallback(() => {
        localStorage.removeItem(
            CART_STORAGE_KEY
        );

        setCart(null);
    }, []);

    const createCart = useCallback(async () => {
        const response = await fetch(
            "/api/cart/create",
            {
                method: "POST",
                headers: {
                    "Content-Type":
                        "application/json",
                },
                cache: "no-store",
            }
        );

        const data =
            await readJsonResponse(response);

        if (
            !response.ok ||
            !data.success ||
            !data.cart?.id
        ) {
            throw new Error(
                data.message ||
                "Unable to create cart"
            );
        }

        return saveCart(data.cart);
    }, [saveCart]);

    const getCart = useCallback(
        async (cartId) => {
            const response = await fetch(
                "/api/cart/get",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        cartId,
                    }),
                    cache: "no-store",
                }
            );

            const data =
                await readJsonResponse(response);

            if (
                !response.ok ||
                !data.success ||
                !data.cart
            ) {
                throw new Error(
                    data.message ||
                    "Unable to load cart"
                );
            }

            return saveCart(data.cart);
        },
        [saveCart]
    );

    const ensureCart = useCallback(async () => {
        if (cart?.id) {
            return cart;
        }

        const storedCartId =
            localStorage.getItem(
                CART_STORAGE_KEY
            );

        if (storedCartId) {
            try {
                return await getCart(
                    storedCartId
                );
            } catch {
                clearCart();
            }
        }

        return await createCart();
    }, [
        cart,
        clearCart,
        createCart,
        getCart,
    ]);

    const addToCart = useCallback(
        async (variantId, quantity = 1) => {
            if (!variantId) {
                throw new Error(
                    "Variant ID is required"
                );
            }

            const validQuantity = Math.max(
                1,
                Number(quantity) || 1
            );

            try {
                setCartActionLoading(true);
                setError("");

                const currentCart =
                    await ensureCart();

                const response = await fetch(
                    "/api/cart/add",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        body: JSON.stringify({
                            cartId:
                                currentCart.id,
                            variantId,
                            quantity:
                                validQuantity,
                        }),
                        cache: "no-store",
                    }
                );

                const data =
                    await readJsonResponse(
                        response
                    );

                if (
                    !response.ok ||
                    !data.success ||
                    !data.cart
                ) {
                    throw new Error(
                        data.message ||
                        "Unable to add item to cart"
                    );
                }

                return saveCart(data.cart);
            } catch (error) {
                const message =
                    error instanceof Error
                        ? error.message
                        : "Unable to add item to cart";

                setError(message);

                throw new Error(message);
            } finally {
                setCartActionLoading(false);
            }
        },
        [ensureCart, saveCart]
    );

    const buyNow = useCallback(
        async (variantId, quantity = 1) => {
            if (!variantId) {
                throw new Error(
                    "Variant ID is required"
                );
            }

            const validQuantity = Math.max(
                1,
                Number(quantity) || 1
            );

            try {
                setCartActionLoading(true);
                setError("");

                const createResponse =
                    await fetch(
                        "/api/cart/create",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type":
                                    "application/json",
                            },
                            cache: "no-store",
                        }
                    );

                const createData =
                    await readJsonResponse(
                        createResponse
                    );

                if (
                    !createResponse.ok ||
                    !createData.success ||
                    !createData.cart?.id
                ) {
                    throw new Error(
                        createData.message ||
                        "Unable to create checkout cart"
                    );
                }

                const addResponse =
                    await fetch(
                        "/api/cart/add",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type":
                                    "application/json",
                            },
                            body: JSON.stringify({
                                cartId:
                                    createData
                                        .cart.id,
                                variantId,
                                quantity:
                                    validQuantity,
                            }),
                            cache: "no-store",
                        }
                    );

                const addData =
                    await readJsonResponse(
                        addResponse
                    );

                if (
                    !addResponse.ok ||
                    !addData.success ||
                    !addData.cart
                ) {
                    throw new Error(
                        addData.message ||
                        "Unable to add product to checkout"
                    );
                }

                if (
                    !addData.cart.checkoutUrl
                ) {
                    throw new Error(
                        "Shopify checkout URL is unavailable"
                    );
                }

                window.location.assign(
                    addData.cart.checkoutUrl
                );
            } catch (error) {
                const message =
                    error instanceof Error
                        ? error.message
                        : "Unable to start checkout";

                setError(message);

                throw new Error(message);
            } finally {
                setCartActionLoading(false);
            }
        },
        []
    );

    const removeCartLine = useCallback(
        async (lineId) => {
            if (!cart?.id || !lineId) {
                return;
            }

            try {
                setCartActionLoading(true);
                setError("");

                const response = await fetch(
                    "/api/cart/remove",
                    {
                        method: "DELETE",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        body: JSON.stringify({
                            cartId: cart.id,
                            lineId,
                        }),
                        cache: "no-store",
                    }
                );

                const data =
                    await readJsonResponse(
                        response
                    );

                if (
                    !response.ok ||
                    !data.success ||
                    !data.cart
                ) {
                    throw new Error(
                        data.message ||
                        "Unable to remove cart item"
                    );
                }

                return saveCart(data.cart);
            } catch (error) {
                const message =
                    error instanceof Error
                        ? error.message
                        : "Unable to remove cart item";

                setError(message);

                throw new Error(message);
            } finally {
                setCartActionLoading(false);
            }
        },
        [cart, saveCart]
    );

    const updateCartLine = useCallback(
        async (lineId, quantity) => {
            if (!cart?.id || !lineId) {
                return;
            }

            const validQuantity =
                Number(quantity) || 0;

            if (validQuantity <= 0) {
                return await removeCartLine(
                    lineId
                );
            }

            try {
                setCartActionLoading(true);
                setError("");

                const response = await fetch(
                    "/api/cart/update",
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        body: JSON.stringify({
                            cartId: cart.id,
                            lineId,
                            quantity:
                                validQuantity,
                        }),
                        cache: "no-store",
                    }
                );

                const data =
                    await readJsonResponse(
                        response
                    );

                if (
                    !response.ok ||
                    !data.success ||
                    !data.cart
                ) {
                    throw new Error(
                        data.message ||
                        "Unable to update cart item"
                    );
                }

                return saveCart(data.cart);
            } catch (error) {
                const message =
                    error instanceof Error
                        ? error.message
                        : "Unable to update cart item";

                setError(message);

                throw new Error(message);
            } finally {
                setCartActionLoading(false);
            }
        },
        [
            cart,
            removeCartLine,
            saveCart,
        ]
    );

    const refreshCart =
        useCallback(async () => {
            if (!cart?.id) {
                return;
            }

            try {
                setError("");

                return await getCart(cart.id);
            } catch (error) {
                const message =
                    error instanceof Error
                        ? error.message
                        : "Unable to refresh cart";

                setError(message);
                clearCart();
            }
        }, [cart, clearCart, getCart]);

    const checkout = useCallback(() => {
        if (!cart?.checkoutUrl) {
            setError(
                "Shopify checkout URL is unavailable"
            );

            return;
        }

        setError("");
        setCartActionLoading(true);

        window.location.assign(
            cart.checkoutUrl
        );
    }, [cart]);

    useEffect(() => {
        const initializeCart = async () => {
            try {
                setLoading(true);
                setError("");

                const storedCartId =
                    localStorage.getItem(
                        CART_STORAGE_KEY
                    );

                if (!storedCartId) {
                    return;
                }

                await getCart(storedCartId);
            } catch (error) {
                clearCart();

                setError(
                    error instanceof Error
                        ? error.message
                        : "Unable to load cart"
                );
            } finally {
                setLoading(false);
            }
        };

        initializeCart();
    }, [clearCart, getCart]);

    const value = useMemo(() => {
        return {
            cart,
            lines: cart?.lines || [],
            totalQuantity:
                cart?.totalQuantity || 0,
            subtotal:
                cart?.cost
                    ?.subtotalAmount || null,
            total:
                cart?.cost?.totalAmount ||
                null,
            checkoutUrl:
                cart?.checkoutUrl || null,
            loading,
            cartActionLoading,
            error,
            addToCart,
            buyNow,
            updateCartLine,
            removeCartLine,
            refreshCart,
            checkout,
            clearCart,
        };
    }, [
        cart,
        loading,
        cartActionLoading,
        error,
        addToCart,
        buyNow,
        updateCartLine,
        removeCartLine,
        refreshCart,
        checkout,
        clearCart,
    ]);

    return (
        <CartContext.Provider
            value={value}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context =
        useContext(CartContext);

    if (!context) {
        throw new Error(
            "useCart must be used inside CartProvider"
        );
    }

    return context;
};