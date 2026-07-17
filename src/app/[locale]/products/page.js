"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
    ArrowLeft,
    ArrowRight,
    Eye,
    PackageSearch,
} from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const ProductsPage = () => {
    const t = useTranslations("ProductsPage");
    const locale = useLocale();

    const isArabic = locale.toLowerCase().startsWith("ar");

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const getProducts = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch("/api/products", {
                method: "GET",
                cache: "no-store",
            });

            const data = await response.json().catch(() => null);

            if (!response.ok || !data?.success) {
                throw new Error(
                    data?.message || t("errors.fetch")
                );
            }

            setProducts(
                Array.isArray(data.products)
                    ? data.products
                    : []
            );
        } catch (error) {
            setProducts([]);
            setError(
                error instanceof Error
                    ? error.message
                    : t("errors.fetch")
            );
        } finally {
            setLoading(false);
        }
    }, [t]);

    useEffect(() => {
        getProducts();
    }, [getProducts]);

    const formatPrice = (value, currencyCode) => {
        const amount = Number(value);

        if (!Number.isFinite(amount)) {
            return "";
        }

        try {
            return new Intl.NumberFormat(locale, {
                style: "currency",
                currency: currencyCode || "QAR",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }).format(amount);
        } catch {
            return `${currencyCode || "QAR"} ${amount.toFixed(2)}`;
        }
    };

    return (
        <>
            <Navbar />

            <main
                dir={isArabic ? "rtl" : "ltr"}
                className="min-h-screen bg-[#FCF8F6]"
            >
                <section className="border-b border-[#E8DDE1] bg-white py-10 sm:py-14 md:py-16">
                    <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
                        <span className="inline-flex rounded-full border border-[#731D46]/10 bg-[#F3E5EA] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#731D46] sm:text-xs">
                            {t("hero.badge")}
                        </span>

                        <h1 className="mt-4 text-[34px] font-black leading-tight tracking-[-0.04em] text-[#2B1D1D] sm:text-[44px] md:text-[54px] lg:text-[62px]">
                            {t("hero.title")}
                        </h1>

                        <p className="mt-3 max-w-2xl text-sm leading-7 text-[#74666A] sm:text-base">
                            {t("hero.description")}
                        </p>
                    </div>
                </section>

                <section className="py-10 sm:py-12 md:py-16 lg:py-20">
                    <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
                        {loading && (
                            <div
                                aria-label={t("loading")}
                                className="grid grid-cols-2 gap-3 sm:gap-5 md:gap-6 lg:grid-cols-4"
                            >
                                {[1, 2, 3, 4].map((item) => (
                                    <div
                                        key={item}
                                        className="overflow-hidden rounded-2xl border border-[#E8DDE1] bg-white"
                                    >
                                        <div className="aspect-[4/3] animate-pulse bg-[#F1E8ED]" />

                                        <div className="space-y-3 p-3 sm:p-4">
                                            <div className="h-3 w-20 animate-pulse rounded bg-[#F1E8ED]" />

                                            <div className="h-5 w-full animate-pulse rounded bg-[#F1E8ED]" />

                                            <div className="h-5 w-24 animate-pulse rounded bg-[#F1E8ED]" />

                                            <div className="h-10 w-full animate-pulse rounded-xl bg-[#F1E8ED] sm:h-12" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {!loading && error && (
                            <div
                                role="alert"
                                className="rounded-2xl border border-red-200 bg-red-50 px-5 py-10 text-center"
                            >
                                <PackageSearch className="mx-auto h-10 w-10 text-red-400" />

                                <h2 className="mt-4 text-xl font-black text-red-700">
                                    {t("error.title")}
                                </h2>

                                <p className="mx-auto mt-2 max-w-md text-sm font-semibold leading-6 text-red-600">
                                    {error}
                                </p>

                                <button
                                    type="button"
                                    onClick={getProducts}
                                    className="mt-5 rounded-full bg-[#731D46] px-6 py-3 text-sm font-bold text-white transition duration-300 hover:bg-[#D4A037]"
                                >
                                    {t("error.retry")}
                                </button>
                            </div>
                        )}

                        {!loading &&
                            !error &&
                            products.length === 0 && (
                                <div className="rounded-2xl border border-[#E8DDE1] bg-white px-5 py-12 text-center">
                                    <PackageSearch className="mx-auto h-12 w-12 text-[#A66D87]" />

                                    <h2 className="mt-4 text-xl font-black text-[#2B1D1D]">
                                        {t("empty.title")}
                                    </h2>

                                    <p className="mt-2 text-sm text-[#74666A]">
                                        {t("empty.description")}
                                    </p>
                                </div>
                            )}

                        {!loading &&
                            !error &&
                            products.length > 0 && (
                                <>
                                    <div className="mb-6 flex items-center justify-between gap-4 sm:mb-8">
                                        <p className="text-sm font-semibold text-[#74666A]">
                                            {t("count", {
                                                count: products.length,
                                            })}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 sm:gap-5 md:gap-6 lg:grid-cols-4">
                                        {products.map((product) => {
                                            const productUrl = `/products/${product.handle}`;

                                            const hasOldPrice =
                                                Number.isFinite(
                                                    Number(
                                                        product.oldPrice
                                                    )
                                                ) &&
                                                Number(
                                                    product.oldPrice
                                                ) >
                                                Number(
                                                    product.price
                                                );

                                            return (
                                                <article
                                                    key={product.id}
                                                    className="group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-[#E8DDE1] bg-white shadow-[0_8px_28px_rgba(62,28,43,0.06)] transition duration-300 hover:-translate-y-1 hover:border-[#D4A037]/60 hover:shadow-[0_18px_45px_rgba(115,29,70,0.13)]"
                                                >
                                                    <Link
                                                        href={
                                                            productUrl
                                                        }
                                                        aria-label={t(
                                                            "product.open",
                                                            {
                                                                title:
                                                                    product.title,
                                                            }
                                                        )}
                                                        className="relative block aspect-[4/3] overflow-hidden bg-[#F1E8ED]"
                                                    >
                                                        {product
                                                            .image
                                                            ?.url ? (
                                                            <Image
                                                                src={
                                                                    product
                                                                        .image
                                                                        .url
                                                                }
                                                                alt={
                                                                    product
                                                                        .image
                                                                        .altText ||
                                                                    product.title
                                                                }
                                                                fill
                                                                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 50vw, 25vw"
                                                                className="object-cover transition duration-700 group-hover:scale-110"
                                                            />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center">
                                                                <PackageSearch className="h-10 w-10 text-[#A66D87]" />
                                                            </div>
                                                        )}

                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" />

                                                        {product.badge ===
                                                            "sale" && (
                                                                <span className="absolute start-2 top-2 z-10 rounded-full bg-[#D4A037] px-2.5 py-1 text-[9px] font-extrabold tracking-wide text-white shadow-md sm:start-3 sm:top-3 sm:px-3 sm:text-[11px]">
                                                                    {t(
                                                                        "product.sale"
                                                                    )}
                                                                </span>
                                                            )}
                                                    </Link>

                                                    <div className="flex flex-1 flex-col p-3 sm:p-4">
                                                        <p className="line-clamp-1 text-[9px] font-bold uppercase tracking-[0.1em] text-[#A66D87] sm:text-[11px]">
                                                            {product.category ||
                                                                t(
                                                                    "product.categoryFallback"
                                                                )}
                                                        </p>

                                                        <Link
                                                            href={
                                                                productUrl
                                                            }
                                                            className="block"
                                                        >
                                                            <h2 className="mt-1.5 line-clamp-2 min-h-[40px] text-[13px] font-extrabold leading-5 text-[#2D1A22] transition duration-300 hover:text-[#731D46] sm:min-h-[48px] sm:text-base sm:leading-6">
                                                                {
                                                                    product.title
                                                                }
                                                            </h2>
                                                        </Link>

                                                        <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 sm:mt-4">
                                                            <span className="text-[15px] font-black text-[#731D46] sm:text-lg">
                                                                {formatPrice(
                                                                    product.price,
                                                                    product.currencyCode
                                                                )}
                                                            </span>

                                                            {hasOldPrice && (
                                                                <span className="text-[11px] text-[#B8A4AC] line-through sm:text-sm">
                                                                    {formatPrice(
                                                                        product.oldPrice,
                                                                        product.currencyCode
                                                                    )}
                                                                </span>
                                                            )}
                                                        </div>

                                                        <Link
                                                            href={
                                                                productUrl
                                                            }
                                                            aria-label={t(
                                                                "product.viewLabel",
                                                                {
                                                                    title:
                                                                        product.title,
                                                                }
                                                            )}
                                                            className="mt-auto inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#731D46] px-2 py-2.5 text-[11px] font-bold text-white transition duration-300 hover:bg-[#D4A037] active:scale-[0.98] sm:min-h-12 sm:px-4 sm:py-3 sm:text-sm"
                                                        >
                                                            <Eye
                                                                size={
                                                                    15
                                                                }
                                                                strokeWidth={
                                                                    2.3
                                                                }
                                                                className="shrink-0 sm:h-[17px] sm:w-[17px]"
                                                            />

                                                            <span>
                                                                {t(
                                                                    "product.view"
                                                                )}
                                                            </span>

                                                            {isArabic ? (
                                                                <ArrowLeft
                                                                    size={
                                                                        15
                                                                    }
                                                                    className="shrink-0"
                                                                />
                                                            ) : (
                                                                <ArrowRight
                                                                    size={
                                                                        15
                                                                    }
                                                                    className="shrink-0"
                                                                />
                                                            )}
                                                        </Link>
                                                    </div>
                                                </article>
                                            );
                                        })}
                                    </div>
                                </>
                            )}
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
};

export default ProductsPage;