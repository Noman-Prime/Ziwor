"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, ArrowRight, Eye } from "lucide-react";

const BestSellers = () => {
    const t = useTranslations("BestSellers");
    const locale = useLocale();
    const isArabic = locale.toLowerCase().startsWith("ar");
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const controller = new AbortController();

        const getProducts = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    `/api/products?locale=${encodeURIComponent(locale)}`,
                    {
                        method: "GET",
                        cache: "no-store",
                        signal: controller.signal,
                    }
                );

                const data = await response.json();

                if (!response.ok || !data.success) {
                    throw new Error(
                        data.message || "Unable to fetch products"
                    );
                }

                setProducts(
                    Array.isArray(data.products)
                        ? data.products
                        : []
                );
            } catch (error) {
                if (error.name !== "AbortError") {
                    setProducts([]);
                    setError(
                        error.message || "Unable to fetch products"
                    );
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        getProducts();

        return () => controller.abort();
    }, [locale]);

    return (
        <section
            dir={isArabic ? "rtl" : "ltr"}
            className="w-full bg-[#FCF8F6] py-12 sm:py-14 md:py-16 lg:py-20"
        >
            <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
                <div className="mb-8 sm:mb-10 lg:mb-12">
                    <span className="inline-flex rounded-full border border-[#731D46]/10 bg-[#F3E5EA] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#731D46] sm:text-xs">
                        {t("badge")}
                    </span>

                    <div className="mt-3 flex items-center justify-between gap-3">
                        <h2 className="text-[28px] font-black leading-tight tracking-[-0.03em] text-[#2B1D1D] sm:text-[38px] md:text-[44px] lg:text-[50px]">
                            {t("title")}
                        </h2>

                        <Link
                            href="/products"
                            className="group inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#D8BEC8] bg-white px-3 py-2 text-[11px] font-bold text-[#731D46] transition duration-300 hover:border-[#731D46] hover:bg-[#731D46] hover:text-white sm:px-5 sm:py-3 sm:text-sm"
                        >
                            <span>{t("viewAll")}</span>

                            {isArabic ? (
                                <ArrowLeft
                                    size={15}
                                    className="transition duration-300 group-hover:-translate-x-1 sm:h-[17px] sm:w-[17px]"
                                />
                            ) : (
                                <ArrowRight
                                    size={15}
                                    className="transition duration-300 group-hover:translate-x-1 sm:h-[17px] sm:w-[17px]"
                                />
                            )}
                        </Link>
                    </div>

                    <p className="mt-2 max-w-xl text-sm leading-7 text-[#74666A] sm:text-base">
                        {t("description")}
                    </p>
                </div>

                {loading && (
                    <div className="grid grid-cols-2 gap-3 sm:gap-5 md:gap-6 lg:grid-cols-4">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
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
                    <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-8 text-center text-sm font-semibold text-red-600">
                        {error}
                    </div>
                )}

                {!loading && !error && products.length === 0 && (
                    <div className="rounded-2xl border border-[#E8DDE1] bg-white px-5 py-10 text-center text-sm font-semibold text-[#74666A]">
                        {t("empty")}
                    </div>
                )}

                {!loading && !error && products.length > 0 && (
                    <div className="grid grid-cols-2 gap-3 sm:gap-5 md:gap-6 lg:grid-cols-4">
                        {products.map((product) => (
                            <article
                                key={product.id}
                                className="group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-[#E8DDE1] bg-white shadow-[0_8px_28px_rgba(62,28,43,0.06)] transition duration-300 hover:-translate-y-1 hover:border-[#D4A037]/60 hover:shadow-[0_18px_45px_rgba(115,29,70,0.13)]"
                            >
                                <Link
                                    href={`/products/${product.handle}`}
                                    aria-label={product.title}
                                    className="relative block aspect-[4/3] overflow-hidden bg-[#F1E8ED]"
                                >
                                    {product.image?.url ? (
                                        <Image
                                            src={product.image.url}
                                            alt={
                                                product.image.altText ||
                                                product.title
                                            }
                                            fill
                                            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 50vw, 25vw"
                                            className="object-cover transition duration-700 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-[#A66D87]">
                                            {t("noImage")}
                                        </div>
                                    )}

                                    <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" />

                                    {product.badge && (
                                        <span className="absolute start-2 top-2 z-10 rounded-full bg-[#D4A037] px-2.5 py-1 text-[9px] font-extrabold tracking-wide text-white shadow-md sm:start-3 sm:top-3 sm:px-3 sm:text-[11px]">
                                            {t(`badges.${product.badge}`)}
                                        </span>
                                    )}
                                </Link>

                                <div className="flex flex-1 flex-col p-3 sm:p-4">
                                    <p className="line-clamp-1 text-[9px] font-bold uppercase tracking-[0.1em] text-[#A66D87] sm:text-[11px]">
                                        {product.category}
                                    </p>

                                    <Link
                                        href={`/products/${product.handle}`}
                                        className="block"
                                    >
                                        <h3 className="mt-1.5 line-clamp-2 min-h-[40px] text-[13px] font-extrabold leading-5 text-[#2D1A22] transition duration-300 hover:text-[#731D46] sm:min-h-[48px] sm:text-base sm:leading-6">
                                            {product.title}
                                        </h3>
                                    </Link>

                                    <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 sm:mt-4">
                                        <span className="text-[15px] font-black text-[#731D46] sm:text-lg">
                                            {product.currencyCode}{" "}
                                            {product.price}
                                        </span>

                                        {product.oldPrice &&
                                            product.oldPrice >
                                            product.price && (
                                                <span className="text-[11px] text-[#B8A4AC] line-through sm:text-sm">
                                                    {
                                                        product.currencyCode
                                                    }{" "}
                                                    {product.oldPrice}
                                                </span>
                                            )}
                                    </div>

                                    <Link
                                        href={`/products/${product.handle}`}
                                        className="mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#731D46] px-2 py-2.5 text-[11px] font-bold text-white transition duration-300 hover:bg-[#D4A037] active:scale-[0.98] sm:min-h-12 sm:px-4 sm:py-3 sm:text-sm"
                                    >
                                        <Eye
                                            size={15}
                                            strokeWidth={2.3}
                                            className="shrink-0 sm:h-[17px] sm:w-[17px]"
                                        />

                                        <span>{t("viewProduct")}</span>
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default BestSellers;