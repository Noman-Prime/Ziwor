"use client";

import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { Link } from "@/i18n/navigation";
import { Eye, Search, X } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const SearchPage = () => {
    const t = useTranslations("Search");
    const locale = useLocale();
    const searchParams = useSearchParams();
    const isArabic = locale.toLowerCase().startsWith("ar");
    const query = searchParams.get("q")?.trim() || "";

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
                        data.message || "Unable to search products"
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
                        error.message || "Unable to search products"
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

    const filteredProducts = useMemo(() => {
        if (!query) {
            return [];
        }

        const normalizedQuery = query.toLocaleLowerCase(locale);

        return products.filter((product) => {
            const searchableValues = [
                product.title,
                product.handle,
                product.category,
                product.description,
                product.vendor,
                product.productType,
            ];

            return searchableValues.some((value) =>
                String(value || "")
                    .toLocaleLowerCase(locale)
                    .includes(normalizedQuery)
            );
        });
    }, [products, query, locale]);

    return (
        <main
            dir={isArabic ? "rtl" : "ltr"}
            className="min-h-screen bg-[#FCF8F6]"
        >
            <Navbar />

            <section className="w-full py-12 sm:py-14 md:py-16 lg:py-20">
                <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
                    <div className="mb-8 sm:mb-10 lg:mb-12">
                        <span className="inline-flex rounded-full border border-[#731D46]/10 bg-[#F3E5EA] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#731D46] sm:text-xs">
                            {t("badge")}
                        </span>

                        <h1 className="mt-3 text-[28px] font-black leading-tight tracking-[-0.03em] text-[#2B1D1D] sm:text-[38px] md:text-[44px] lg:text-[50px]">
                            {t("title")}
                        </h1>

                        {query && (
                            <p className="mt-2 text-sm leading-7 text-[#74666A] sm:text-base">
                                {t("resultsFor")}{" "}
                                <span className="font-bold text-[#731D46]">
                                    “{query}”
                                </span>
                            </p>
                        )}
                    </div>

                    {!query && (
                        <div className="rounded-2xl border border-[#E8DDE1] bg-white px-5 py-12 text-center shadow-[0_8px_28px_rgba(62,28,43,0.06)]">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F3E5EA] text-[#731D46]">
                                <Search size={25} />
                            </div>

                            <h2 className="mt-4 text-xl font-black text-[#2B1D1D]">
                                {t("emptyQueryTitle")}
                            </h2>

                            <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-[#74666A]">
                                {t("emptyQueryDescription")}
                            </p>
                        </div>
                    )}

                    {query && loading && (
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

                    {query && !loading && error && (
                        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-10 text-center">
                            <p className="text-sm font-semibold text-red-600">
                                {error}
                            </p>
                        </div>
                    )}

                    {query &&
                        !loading &&
                        !error &&
                        filteredProducts.length === 0 && (
                            <div className="rounded-2xl border border-[#E8DDE1] bg-white px-5 py-12 text-center shadow-[0_8px_28px_rgba(62,28,43,0.06)]">
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F3E5EA] text-[#731D46]">
                                    <X size={25} />
                                </div>

                                <h2 className="mt-4 text-xl font-black text-[#2B1D1D]">
                                    {t("notFoundTitle")}
                                </h2>

                                <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-[#74666A]">
                                    {t("notFoundDescription", {
                                        query,
                                    })}
                                </p>

                                <Link
                                    href="/products"
                                    className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-[#731D46] px-6 py-3 text-sm font-bold text-white transition duration-300 hover:bg-[#D4A037]"
                                >
                                    {t("viewAllProducts")}
                                </Link>
                            </div>
                        )}

                    {query &&
                        !loading &&
                        !error &&
                        filteredProducts.length > 0 && (
                            <>
                                <p className="mb-5 text-sm font-semibold text-[#74666A]">
                                    {t("productsFound", {
                                        count: filteredProducts.length,
                                    })}
                                </p>

                                <div className="grid grid-cols-2 gap-3 sm:gap-5 md:gap-6 lg:grid-cols-4">
                                    {filteredProducts.map((product) => (
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
                                                            product.image
                                                                .altText ||
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
                                            </Link>

                                            <div className="flex flex-1 flex-col p-3 sm:p-4">
                                                {product.category && (
                                                    <p className="line-clamp-1 text-[9px] font-bold uppercase tracking-[0.1em] text-[#A66D87] sm:text-[11px]">
                                                        {product.category}
                                                    </p>
                                                )}

                                                <Link
                                                    href={`/products/${product.handle}`}
                                                    className="block"
                                                >
                                                    <h2 className="mt-1.5 line-clamp-2 min-h-[40px] text-[13px] font-extrabold leading-5 text-[#2D1A22] transition duration-300 hover:text-[#731D46] sm:min-h-[48px] sm:text-base sm:leading-6">
                                                        {product.title}
                                                    </h2>
                                                </Link>

                                                <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 sm:mt-4">
                                                    <span className="text-[15px] font-black text-[#731D46] sm:text-lg">
                                                        {
                                                            product.currencyCode
                                                        }{" "}
                                                        {product.price}
                                                    </span>

                                                    {product.oldPrice &&
                                                        Number(
                                                            product.oldPrice
                                                        ) >
                                                        Number(
                                                            product.price
                                                        ) && (
                                                            <span className="text-[11px] text-[#B8A4AC] line-through sm:text-sm">
                                                                {
                                                                    product.currencyCode
                                                                }{" "}
                                                                {
                                                                    product.oldPrice
                                                                }
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

                                                    <span>
                                                        {t("viewProduct")}
                                                    </span>
                                                </Link>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            </>
                        )}
                </div>
            </section>

            <Footer />
        </main>
    );
};

export default SearchPage;