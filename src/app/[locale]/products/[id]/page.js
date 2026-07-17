"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
    ArrowLeft,
    ArrowRight,
    Check,
    ChevronRight,
    Minus,
    PackageSearch,
    Plus,
    ShieldCheck,
    ShoppingBag,
    Truck,
} from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { useCart } from "@/context/CartContext";

const ProductDetailsPage = () => {
    const params = useParams();
    const locale = useLocale();
    const t = useTranslations("ProductDetailsPage");

    const isArabic = locale.toLowerCase().startsWith("ar");

    const {
        addToCart,
        buyNow,
        cartActionLoading,
    } = useCart();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [buyNowLoading, setBuyNowLoading] = useState(false);
    const [error, setError] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [message, setMessage] = useState("");
    const [cartError, setCartError] = useState("");

    const productIdentifier = Array.isArray(params.id)
        ? params.id[0]
        : params.id;

    const getProduct = useCallback(async () => {
        if (!productIdentifier) {
            setProduct(null);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError("");
            setProduct(null);
            setQuantity(1);
            setMessage("");
            setCartError("");

            const response = await fetch(
                `/api/products?locale=${encodeURIComponent(locale)}`,
                {
                    method: "GET",
                    cache: "no-store",
                }
            );

            const data = await response.json().catch(() => null);

            if (!response.ok || !data?.success) {
                throw new Error(
                    data?.message || t("errors.fetch")
                );
            }

            const products = Array.isArray(data.products)
                ? data.products
                : [];

            const currentProduct = products.find(
                (item) =>
                    String(item.handle) ===
                    String(productIdentifier) ||
                    String(item.id) ===
                    String(productIdentifier)
            );

            setProduct(currentProduct || null);
        } catch (error) {
            setProduct(null);

            setError(
                error instanceof Error
                    ? error.message
                    : t("errors.fetch")
            );
        } finally {
            setLoading(false);
        }
    }, [locale, productIdentifier, t]);

    useEffect(() => {
        getProduct();
    }, [getProduct]);

    useEffect(() => {
        return () => {
            window.clearTimeout(
                ProductDetailsPage.messageTimeout
            );
        };
    }, []);

    const formatPrice = (value, currencyCode) => {
        const amount = Number(value);
        const currency = currencyCode || "QAR";

        if (!Number.isFinite(amount)) {
            return "";
        }

        try {
            return new Intl.NumberFormat(locale, {
                style: "currency",
                currency,
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }).format(amount);
        } catch {
            return `${currency} ${amount.toFixed(2)}`;
        }
    };

    const decreaseQuantity = () => {
        setQuantity((current) =>
            Math.max(1, current - 1)
        );
    };

    const increaseQuantity = () => {
        setQuantity((current) =>
            Math.min(99, current + 1)
        );
    };

    const handleAddToCart = async () => {
        if (
            !product?.availableForSale ||
            !product?.variantId ||
            cartActionLoading ||
            buyNowLoading
        ) {
            if (!product?.variantId) {
                setCartError(
                    t("errors.variantUnavailable")
                );
            }

            return;
        }

        try {
            setMessage("");
            setCartError("");

            await addToCart(
                product.variantId,
                Number(quantity)
            );

            setMessage(t("messages.addedToCart"));

            window.clearTimeout(
                ProductDetailsPage.messageTimeout
            );

            ProductDetailsPage.messageTimeout =
                window.setTimeout(() => {
                    setMessage("");
                }, 2500);
        } catch (error) {
            setCartError(
                error instanceof Error
                    ? error.message
                    : t("errors.addToCart")
            );
        }
    };

    const handleBuyNow = async () => {
        if (
            !product?.availableForSale ||
            !product?.variantId ||
            buyNowLoading ||
            cartActionLoading
        ) {
            if (!product?.variantId) {
                setCartError(
                    t("errors.variantUnavailable")
                );
            }

            return;
        }

        try {
            setBuyNowLoading(true);
            setMessage("");
            setCartError("");

            await buyNow(
                product.variantId,
                Number(quantity)
            );
        } catch (error) {
            setCartError(
                error instanceof Error
                    ? error.message
                    : t("errors.buyNow")
            );

            setBuyNowLoading(false);
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />

                <main
                    dir={isArabic ? "rtl" : "ltr"}
                    className="min-h-screen bg-[#FCF8F6]"
                >
                    <div className="mx-auto w-full max-w-[1440px] px-4 py-10 sm:px-6 md:px-8 lg:px-10 lg:py-16 xl:px-12">
                        <div className="mb-7 h-5 w-64 animate-pulse rounded bg-[#E8DDE1]" />

                        <section
                            aria-label={t("loading")}
                            aria-busy="true"
                            className="overflow-hidden rounded-3xl border border-[#E8DDE1] bg-white shadow-[0_15px_50px_rgba(62,28,43,0.08)]"
                        >
                            <div className="grid lg:grid-cols-2">
                                <div className="border-b border-[#E8DDE1] p-4 sm:p-6 lg:border-b-0 lg:border-e lg:p-8">
                                    <div className="aspect-square animate-pulse rounded-2xl bg-[#F1E8ED]" />
                                </div>

                                <div className="p-5 sm:p-8 lg:p-10">
                                    <div className="h-4 w-28 animate-pulse rounded bg-[#F1E8ED]" />

                                    <div className="mt-5 h-10 w-full animate-pulse rounded bg-[#F1E8ED]" />

                                    <div className="mt-3 h-10 w-4/5 animate-pulse rounded bg-[#F1E8ED]" />

                                    <div className="mt-7 h-9 w-40 animate-pulse rounded bg-[#F1E8ED]" />

                                    <div className="mt-7 h-24 w-full animate-pulse rounded bg-[#F1E8ED]" />

                                    <div className="mt-8 h-14 w-full animate-pulse rounded-full bg-[#F1E8ED]" />

                                    <p className="mt-5 text-center text-sm font-semibold text-[#74666A]">
                                        {t("loading")}
                                    </p>
                                </div>
                            </div>
                        </section>
                    </div>
                </main>

                <Footer />
            </>
        );
    }

    if (error) {
        return (
            <>
                <Navbar />

                <main
                    dir={isArabic ? "rtl" : "ltr"}
                    className="flex min-h-[70vh] items-center justify-center bg-[#FCF8F6] px-4 py-20"
                >
                    <div
                        role="alert"
                        className="w-full max-w-xl rounded-3xl border border-red-200 bg-white p-8 text-center shadow-[0_15px_50px_rgba(62,28,43,0.08)] sm:p-12"
                    >
                        <PackageSearch className="mx-auto h-14 w-14 text-red-300" />

                        <h1 className="mt-5 text-2xl font-black text-[#2B1D1D] sm:text-3xl">
                            {t("error.title")}
                        </h1>

                        <p className="mt-3 text-sm leading-7 text-red-500">
                            {error}
                        </p>

                        <button
                            type="button"
                            onClick={getProduct}
                            className="mt-7 inline-flex items-center justify-center rounded-full bg-[#731D46] px-7 py-3 text-sm font-bold text-white transition duration-300 hover:bg-[#D4A037] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#731D46] focus-visible:ring-offset-2"
                        >
                            {t("error.retry")}
                        </button>
                    </div>
                </main>

                <Footer />
            </>
        );
    }

    if (!product) {
        return (
            <>
                <Navbar />

                <main
                    dir={isArabic ? "rtl" : "ltr"}
                    className="flex min-h-[70vh] items-center justify-center bg-[#FCF8F6] px-4 py-20"
                >
                    <div className="w-full max-w-xl rounded-3xl border border-[#E8DDE1] bg-white p-8 text-center shadow-[0_15px_50px_rgba(62,28,43,0.08)] sm:p-12">
                        <ShoppingBag className="mx-auto h-14 w-14 text-[#CDB7C1]" />

                        <h1 className="mt-5 text-2xl font-black text-[#2B1D1D] sm:text-3xl">
                            {t("notFound.title")}
                        </h1>

                        <p className="mt-3 leading-7 text-[#74666A]">
                            {t("notFound.description")}
                        </p>

                        <Link
                            href="/products"
                            className="mt-7 inline-flex items-center justify-center gap-2 rounded-full bg-[#731D46] px-7 py-3 text-sm font-bold text-white transition duration-300 hover:bg-[#D4A037] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#731D46] focus-visible:ring-offset-2"
                        >
                            {isArabic ? (
                                <ArrowRight className="h-4 w-4" />
                            ) : (
                                <ArrowLeft className="h-4 w-4" />
                            )}

                            <span>
                                {t("notFound.backToProducts")}
                            </span>
                        </Link>
                    </div>
                </main>

                <Footer />
            </>
        );
    }

    const hasOldPrice =
        Number.isFinite(Number(product.oldPrice)) &&
        Number(product.oldPrice) >
        Number(product.price);

    const productAvailable =
        Boolean(product.availableForSale) &&
        Boolean(product.variantId);

    const actionLoading =
        cartActionLoading || buyNowLoading;

    return (
        <>
            <Navbar />

            <main
                dir={isArabic ? "rtl" : "ltr"}
                className="min-h-screen bg-[#FCF8F6]"
            >
                <div className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 md:px-8 lg:px-10 lg:py-10 xl:px-12">
                    <nav
                        aria-label={t("breadcrumb.label")}
                        className="mb-6 flex flex-wrap items-center gap-2 text-sm text-[#74666A]"
                    >
                        <Link
                            href="/"
                            className="transition duration-300 hover:text-[#731D46]"
                        >
                            {t("breadcrumb.home")}
                        </Link>

                        <ChevronRight
                            aria-hidden="true"
                            className={`h-4 w-4 ${isArabic
                                    ? "rotate-180"
                                    : ""
                                }`}
                        />

                        <Link
                            href="/products"
                            className="transition duration-300 hover:text-[#731D46]"
                        >
                            {t("breadcrumb.products")}
                        </Link>

                        <ChevronRight
                            aria-hidden="true"
                            className={`h-4 w-4 ${isArabic
                                    ? "rotate-180"
                                    : ""
                                }`}
                        />

                        <span
                            aria-current="page"
                            className="max-w-[220px] truncate font-semibold text-[#2B1D1D] sm:max-w-md"
                        >
                            {product.title}
                        </span>
                    </nav>

                    <section className="overflow-hidden rounded-3xl border border-[#E8DDE1] bg-white shadow-[0_15px_50px_rgba(62,28,43,0.08)]">
                        <div className="grid lg:grid-cols-2">
                            <div className="border-b border-[#E8DDE1] p-4 sm:p-6 lg:border-b-0 lg:border-e lg:p-8">
                                <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#F1E8ED]">
                                    {product.image?.url ? (
                                        <Image
                                            src={
                                                product.image.url
                                            }
                                            alt={
                                                product.image
                                                    .altText ||
                                                product.title
                                            }
                                            fill
                                            priority
                                            sizes="(max-width: 1024px) 100vw, 50vw"
                                            className="object-cover transition duration-700 hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center">
                                            <PackageSearch className="h-20 w-20 text-[#CDB7C1]" />
                                        </div>
                                    )}

                                    {product.badge ===
                                        "sale" && (
                                            <span className="absolute start-4 top-4 z-10 rounded-full bg-[#D4A037] px-4 py-2 text-xs font-extrabold uppercase tracking-wide text-white shadow-md">
                                                {t("product.sale")}
                                            </span>
                                        )}
                                </div>
                            </div>

                            <div className="flex flex-col p-5 sm:p-8 lg:p-10">
                                <p className="text-sm font-bold uppercase tracking-[0.12em] text-[#A66D87]">
                                    {product.category ||
                                        t(
                                            "product.categoryFallback"
                                        )}
                                </p>

                                <h1 className="mt-3 text-3xl font-black leading-tight tracking-[-0.03em] text-[#2B1D1D] sm:text-4xl lg:text-5xl">
                                    {product.title}
                                </h1>

                                <div className="mt-7 flex flex-wrap items-end gap-3">
                                    <span className="text-3xl font-black text-[#731D46]">
                                        {formatPrice(
                                            product.price,
                                            product.currencyCode
                                        )}
                                    </span>

                                    {hasOldPrice && (
                                        <span className="pb-1 text-lg text-[#B8A4AC] line-through">
                                            {formatPrice(
                                                product.oldPrice,
                                                product.currencyCode
                                            )}
                                        </span>
                                    )}
                                </div>

                                <div
                                    className={`mt-5 inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${productAvailable
                                            ? "bg-emerald-50 text-emerald-700"
                                            : "bg-red-50 text-red-600"
                                        }`}
                                >
                                    {productAvailable ? (
                                        <Check className="h-4 w-4" />
                                    ) : (
                                        <PackageSearch className="h-4 w-4" />
                                    )}

                                    <span>
                                        {productAvailable
                                            ? t(
                                                "product.inStock"
                                            )
                                            : t(
                                                "product.outOfStock"
                                            )}
                                    </span>
                                </div>

                                <p className="mt-7 border-t border-[#E8DDE1] pt-7 leading-8 text-[#74666A]">
                                    {product.description ||
                                        t(
                                            "product.descriptionFallback"
                                        )}
                                </p>

                                <div className="mt-8">
                                    <h2 className="font-bold text-[#2B1D1D]">
                                        {t("product.quantity")}
                                    </h2>

                                    <div className="mt-3 flex h-12 w-fit items-center overflow-hidden rounded-full border border-[#D9C8CF] bg-white">
                                        <button
                                            type="button"
                                            onClick={
                                                decreaseQuantity
                                            }
                                            disabled={
                                                quantity === 1 ||
                                                actionLoading
                                            }
                                            aria-label={t(
                                                "quantity.decrease"
                                            )}
                                            className="flex h-full w-12 items-center justify-center transition duration-300 hover:bg-[#F3E5EA] disabled:cursor-not-allowed disabled:opacity-40"
                                        >
                                            <Minus className="h-4 w-4" />
                                        </button>

                                        <span
                                            aria-live="polite"
                                            className="flex h-full min-w-12 items-center justify-center border-x border-[#D9C8CF] px-4 font-bold text-[#2B1D1D]"
                                        >
                                            {quantity}
                                        </span>

                                        <button
                                            type="button"
                                            onClick={
                                                increaseQuantity
                                            }
                                            disabled={
                                                !productAvailable ||
                                                quantity === 99 ||
                                                actionLoading
                                            }
                                            aria-label={t(
                                                "quantity.increase"
                                            )}
                                            className="flex h-full w-12 items-center justify-center transition duration-300 hover:bg-[#F3E5EA] disabled:cursor-not-allowed disabled:opacity-40"
                                        >
                                            <Plus className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                                    <button
                                        type="button"
                                        onClick={
                                            handleAddToCart
                                        }
                                        disabled={
                                            !productAvailable ||
                                            actionLoading
                                        }
                                        className="flex min-h-14 items-center justify-center gap-2 rounded-full bg-[#731D46] px-6 py-3 font-bold text-white transition duration-300 hover:bg-[#D4A037] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#731D46] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-[#CDB7C1]"
                                    >
                                        {cartActionLoading &&
                                            !buyNowLoading ? (
                                            <span
                                                aria-hidden="true"
                                                className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white"
                                            />
                                        ) : (
                                            <ShoppingBag className="h-5 w-5" />
                                        )}

                                        <span>
                                            {cartActionLoading &&
                                                !buyNowLoading
                                                ? t(
                                                    "actions.adding"
                                                )
                                                : t(
                                                    "actions.addToCart"
                                                )}
                                        </span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={
                                            handleBuyNow
                                        }
                                        disabled={
                                            !productAvailable ||
                                            actionLoading
                                        }
                                        className="flex min-h-14 items-center justify-center gap-2 rounded-full border-2 border-[#731D46] px-6 py-3 font-bold text-[#731D46] transition duration-300 hover:bg-[#731D46] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#731D46] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:border-[#CDB7C1] disabled:text-[#CDB7C1] disabled:hover:bg-transparent"
                                    >
                                        {buyNowLoading ? (
                                            <span
                                                aria-hidden="true"
                                                className="h-5 w-5 animate-spin rounded-full border-2 border-[#731D46]/30 border-t-[#731D46]"
                                            />
                                        ) : (
                                            <ShoppingBag className="h-5 w-5" />
                                        )}

                                        <span>
                                            {buyNowLoading
                                                ? t(
                                                    "actions.redirecting"
                                                )
                                                : t(
                                                    "actions.buyNow"
                                                )}
                                        </span>
                                    </button>
                                </div>

                                <div
                                    aria-live="polite"
                                    aria-atomic="true"
                                >
                                    {message && (
                                        <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
                                            <Check className="h-4 w-4 shrink-0" />

                                            <span>
                                                {message}
                                            </span>
                                        </div>
                                    )}

                                    {cartError && (
                                        <div
                                            role="alert"
                                            className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600"
                                        >
                                            {cartError}
                                        </div>
                                    )}
                                </div>

                                <div className="mt-8 grid gap-4 border-t border-[#E8DDE1] pt-7 sm:grid-cols-3">
                                    <div className="flex items-start gap-3">
                                        <Truck className="mt-0.5 h-5 w-5 shrink-0 text-[#731D46]" />

                                        <div>
                                            <p className="text-sm font-bold text-[#2B1D1D]">
                                                {t(
                                                    "benefits.delivery.title"
                                                )}
                                            </p>

                                            <p className="mt-1 text-xs leading-5 text-[#74666A]">
                                                {t(
                                                    "benefits.delivery.description"
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#731D46]" />

                                        <div>
                                            <p className="text-sm font-bold text-[#2B1D1D]">
                                                {t(
                                                    "benefits.secure.title"
                                                )}
                                            </p>

                                            <p className="mt-1 text-xs leading-5 text-[#74666A]">
                                                {t(
                                                    "benefits.secure.description"
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Check className="mt-0.5 h-5 w-5 shrink-0 text-[#731D46]" />

                                        <div>
                                            <p className="text-sm font-bold text-[#2B1D1D]">
                                                {t(
                                                    "benefits.quality.title"
                                                )}
                                            </p>

                                            <p className="mt-1 text-xs leading-5 text-[#74666A]">
                                                {t(
                                                    "benefits.quality.description"
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="mt-8 rounded-3xl border border-[#E8DDE1] bg-white p-6 shadow-[0_15px_50px_rgba(62,28,43,0.06)] sm:p-8">
                        <h2 className="text-2xl font-black text-[#2B1D1D]">
                            {t("details.title")}
                        </h2>

                        <p className="mt-4 max-w-4xl whitespace-pre-line leading-8 text-[#74666A]">
                            {product.description ||
                                t(
                                    "product.descriptionFallback"
                                )}
                        </p>
                    </section>
                </div>
            </main>

            <Footer />
        </>
    );
};

ProductDetailsPage.messageTimeout = null;

export default ProductDetailsPage;