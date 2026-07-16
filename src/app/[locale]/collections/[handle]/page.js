"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { useCart } from "@/context/CartContext";
import { CheckCircle2, ChevronDown, CircleAlert, Filter, Grid2X2, House, ImageIcon, ListFilter, LoaderCircle, PackageSearch, ShoppingCart, SlidersHorizontal, X } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const CollectionPage = () => {
    const t = useTranslations("CollectionPage");
    const locale = useLocale();
    const params = useParams();
    const router = useRouter();
    const { addToCart, cartActionLoading } = useCart();
    const handle = params.handle;
    const [collection, setCollection] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [sortBy, setSortBy] = useState("featured");
    const [filterOpen, setFilterOpen] = useState(false);
    const [selectedAvailability, setSelectedAvailability] = useState("all");
    const [addingProductId, setAddingProductId] = useState(null);
    const [cartMessage, setCartMessage] = useState("");
    const [cartError, setCartError] = useState("");

    useEffect(() => {
        const getCollection = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(`/api/collections/${handle}`, {
                    method: "GET",
                    cache: "no-store",
                });

                const data = await response.json();

                if (!response.ok || !data.success) {
                    throw new Error(data.message || t("errors.load"));
                }

                setCollection(data.collection);
            } catch (error) {
                setError(error.message || t("errors.load"));
            } finally {
                setLoading(false);
            }
        };

        if (handle) {
            getCollection();
        }
    }, [handle, t]);

    useEffect(() => {
        if (!cartMessage && !cartError) {
            return;
        }

        const timer = setTimeout(() => {
            setCartMessage("");
            setCartError("");
        }, 3500);

        return () => clearTimeout(timer);
    }, [cartMessage, cartError]);

    const products = useMemo(() => {
        if (!collection?.products) {
            return [];
        }

        return collection.products.map((product) => {
            const price = Number(product.priceRange?.minVariantPrice?.amount || 0);
            const compareAtPrice = Number(product.compareAtPriceRange?.minVariantPrice?.amount || 0);
            const firstVariant = product.variants?.edges?.[0]?.node || null;

            return {
                id: product.id,
                handle: product.handle,
                title: product.title,
                description: product.description,
                available: product.availableForSale && firstVariant?.availableForSale,
                image: product.featuredImage?.url || null,
                imageAlt: product.featuredImage?.altText || product.title,
                price,
                oldPrice: compareAtPrice > price ? compareAtPrice : null,
                currency: product.priceRange?.minVariantPrice?.currencyCode || "QAR",
                variantId: firstVariant?.id || null,
                badge: compareAtPrice > price ? t("badges.sale") : null,
            };
        });
    }, [collection, t]);

    const filteredProducts = useMemo(() => {
        let result = [...products];

        if (selectedAvailability === "available") {
            result = result.filter((product) => product.available);
        }

        if (selectedAvailability === "unavailable") {
            result = result.filter((product) => !product.available);
        }

        if (sortBy === "price-low") {
            result.sort((a, b) => a.price - b.price);
        }

        if (sortBy === "price-high") {
            result.sort((a, b) => b.price - a.price);
        }

        if (sortBy === "name") {
            result.sort((a, b) => a.title.localeCompare(b.title, locale));
        }

        return result;
    }, [products, selectedAvailability, sortBy, locale]);

    const handleAddToCart = async (product) => {
        if (!product.available || !product.variantId || cartActionLoading) {
            return;
        }

        try {
            setAddingProductId(product.id);
            setCartMessage("");
            setCartError("");

            await addToCart(product.variantId, 1);

            setCartMessage(t("cartSuccess", {
                product: product.title,
            }));
        } catch (error) {
            setCartError(error.message || t("cartError"));
        } finally {
            setAddingProductId(null);
        }
    };

    const navigateTo = (href) => {
        setFilterOpen(false);
        router.push(href);
    };

    const formatPrice = (amount, currency) => {
        return new Intl.NumberFormat(locale === "ar" ? "ar-QA" : "en-QA", {
            style: "currency",
            currency,
            minimumFractionDigits: 2,
        }).format(amount);
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <main dir={locale === "ar" ? "rtl" : "ltr"} className="flex min-h-[70vh] items-center justify-center bg-[#FCF8F6] px-4">
                    <div className="flex flex-col items-center text-center">
                        <LoaderCircle size={42} className="animate-spin text-[#731D46]" />
                        <h1 className="mt-5 text-xl font-black text-[#2B1D1D] sm:text-2xl">{t("loading.title")}</h1>
                        <p className="mt-2 text-sm text-[#74666A]">{t("loading.description")}</p>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    if (error || !collection) {
        return (
            <>
                <Navbar />
                <main dir={locale === "ar" ? "rtl" : "ltr"} className="flex min-h-[70vh] items-center justify-center bg-[#FCF8F6] px-4">
                    <div className="max-w-lg text-center">
                        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                            <CircleAlert size={30} />
                        </span>
                        <h1 className="mt-5 text-3xl font-black text-[#2B1D1D]">{t("notFound.title")}</h1>
                        <p className="mt-3 text-sm leading-7 text-[#74666A] sm:text-base">{error || t("notFound.description")}</p>
                        <button type="button" onClick={() => navigateTo("/")} className="mt-6 inline-flex min-h-12 items-center justify-center rounded-xl bg-[#731D46] px-6 py-3 text-sm font-bold text-white transition md:hover:bg-[#D4A037]">{t("notFound.button")}</button>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <main dir={locale === "ar" ? "rtl" : "ltr"} className="w-full bg-[#FCF8F6]">
                <section className="w-full border-b border-[#E8DDE1] bg-white">
                    <div className="mx-auto flex w-full max-w-[1440px] items-center gap-2 px-4 py-4 text-xs text-[#8B747E] sm:px-6 sm:text-sm md:px-8 lg:px-10 xl:px-12">
                        <button type="button" onClick={() => navigateTo("/")} className="flex items-center gap-1.5 transition hover:text-[#731D46]">
                            <House size={15} />
                            <span>{t("breadcrumb.home")}</span>
                        </button>
                        <span>/</span>
                        <span className="truncate font-semibold text-[#731D46]">{collection.title}</span>
                    </div>
                </section>
                <section className="w-full py-6 sm:py-8">
                    <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
                        <div className="relative min-h-[260px] overflow-hidden rounded-3xl bg-[#2C0D1D] sm:min-h-[320px] lg:min-h-[380px]">
                            {collection.image?.url && <Image src={collection.image.url} alt={collection.image.altText || collection.title} fill priority sizes="100vw" className="object-cover" />}
                            <div className={`absolute inset-0 ${locale === "ar" ? "bg-gradient-to-l" : "bg-gradient-to-r"} from-[#260B19]/95 via-[#260B19]/65 to-[#260B19]/15`} />
                            <div className="relative z-10 flex min-h-[260px] max-w-2xl flex-col justify-center px-5 py-10 sm:min-h-[320px] sm:px-10 lg:min-h-[380px] lg:px-14">
                                <span className="inline-flex w-fit rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-white sm:text-xs">{t("collectionBadge")}</span>
                                <h1 className="mt-4 text-[34px] font-black leading-tight tracking-[-0.03em] text-white sm:text-[46px] lg:text-[58px]">{collection.title}</h1>
                                {collection.description && <p className="mt-4 max-w-xl text-sm leading-7 text-white/85 sm:text-base lg:text-lg">{collection.description}</p>}
                            </div>
                        </div>
                    </div>
                </section>
                <section className="w-full pb-14 sm:pb-16 lg:pb-20">
                    <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
                        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#E8DDE1] bg-white p-3 shadow-sm sm:p-4">
                            <div className="flex items-center gap-2">
                                <button type="button" onClick={() => setFilterOpen(true)} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#E1CDD5] px-4 py-2 text-sm font-bold text-[#731D46] transition hover:border-[#731D46] lg:hidden">
                                    <Filter size={17} />
                                    <span>{t("filters.button")}</span>
                                </button>
                                <div className="hidden items-center gap-2 text-sm text-[#74666A] sm:flex">
                                    <Grid2X2 size={18} className="text-[#731D46]" />
                                    <span>{filteredProducts.length} {t("productsCount")}</span>
                                </div>
                            </div>
                            <div className="relative">
                                <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="min-h-11 appearance-none rounded-xl border border-[#E1CDD5] bg-white py-2 ps-4 pe-10 text-xs font-bold text-[#2B1D1D] outline-none transition focus:border-[#731D46] sm:text-sm">
                                    <option value="featured">{t("sort.featured")}</option>
                                    <option value="price-low">{t("sort.priceLow")}</option>
                                    <option value="price-high">{t("sort.priceHigh")}</option>
                                    <option value="name">{t("sort.name")}</option>
                                </select>
                                <ChevronDown size={16} className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-[#731D46]" />
                            </div>
                        </div>
                        <div className="grid items-start gap-6 lg:grid-cols-[240px_1fr] xl:grid-cols-[260px_1fr]">
                            <aside className="hidden rounded-2xl border border-[#E8DDE1] bg-white p-5 shadow-sm lg:block">
                                <div className="flex items-center gap-2">
                                    <SlidersHorizontal size={19} className="text-[#731D46]" />
                                    <h2 className="text-lg font-black text-[#2B1D1D]">{t("filters.title")}</h2>
                                </div>
                                <div className="mt-6 border-t border-[#EFE4E8] pt-5">
                                    <h3 className="text-sm font-extrabold text-[#2B1D1D]">{t("filters.availability")}</h3>
                                    <div className="mt-4 flex flex-col gap-3">
                                        {["all", "available", "unavailable"].map((value) => (
                                            <label key={value} className="flex cursor-pointer items-center gap-3 text-sm text-[#74666A]">
                                                <input type="radio" name="availability" value={value} checked={selectedAvailability === value} onChange={(event) => setSelectedAvailability(event.target.value)} className="h-4 w-4 accent-[#731D46]" />
                                                <span>{t(`filters.${value}`)}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </aside>
                            <div>
                                <div className="mb-4 flex items-center gap-2 text-sm text-[#74666A] sm:hidden">
                                    <ListFilter size={17} className="text-[#731D46]" />
                                    <span>{filteredProducts.length} {t("productsCount")}</span>
                                </div>
                                {cartMessage && (
                                    <div className="mb-5 flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-green-700">
                                        <CheckCircle2 size={20} className="mt-0.5 shrink-0" />
                                        <p className="text-sm font-semibold leading-6">{cartMessage}</p>
                                    </div>
                                )}
                                {cartError && (
                                    <div className="mb-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-600">
                                        <CircleAlert size={20} className="mt-0.5 shrink-0" />
                                        <p className="text-sm font-semibold leading-6">{cartError}</p>
                                    </div>
                                )}
                                {filteredProducts.length > 0 ? (
                                    <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:gap-6 xl:grid-cols-4">
                                        {filteredProducts.map((product) => (
                                            <article key={product.id} className="group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-[#E8DDE1] bg-white shadow-[0_8px_28px_rgba(62,28,43,0.06)] transition duration-300 md:hover:-translate-y-1 md:hover:border-[#D4A037]/60 md:hover:shadow-[0_18px_45px_rgba(115,29,70,0.13)]">
                                                <button type="button" onClick={() => navigateTo(`/products/${product.handle}`)} className="relative block aspect-[4/3] w-full overflow-hidden bg-[#F1E8ED] text-start">
                                                    {product.image ? (
                                                        <Image src={product.image} alt={product.imageAlt} fill sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw" className="object-cover transition duration-700 md:group-hover:scale-110" />
                                                    ) : (
                                                        <span className="flex h-full w-full items-center justify-center text-[#B79FAA]">
                                                            <ImageIcon size={36} />
                                                        </span>
                                                    )}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" />
                                                    {product.badge && <span className="absolute start-2 top-2 z-10 rounded-full bg-[#D4A037] px-2.5 py-1 text-[9px] font-extrabold text-white shadow-md sm:start-3 sm:top-3 sm:px-3 sm:text-[11px]">{product.badge}</span>}
                                                    {!product.available && <span className="absolute inset-x-3 bottom-3 z-10 rounded-xl bg-black/70 px-3 py-2 text-center text-[10px] font-bold text-white sm:text-xs">{t("soldOut")}</span>}
                                                </button>
                                                <div className="flex flex-1 flex-col p-3 sm:p-4">
                                                    <p className="line-clamp-1 text-[9px] font-bold uppercase tracking-[0.1em] text-[#A66D87] sm:text-[11px]">{collection.title}</p>
                                                    <button type="button" onClick={() => navigateTo(`/products/${product.handle}`)} className="text-start">
                                                        <h3 className="mt-1.5 line-clamp-2 min-h-[40px] text-[13px] font-extrabold leading-5 text-[#2D1A22] transition hover:text-[#731D46] sm:min-h-[48px] sm:text-base sm:leading-6">{product.title}</h3>
                                                    </button>
                                                    <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1">
                                                        <span className="text-[14px] font-black text-[#731D46] sm:text-lg">{formatPrice(product.price, product.currency)}</span>
                                                        {product.oldPrice && <span className="text-[10px] text-[#B8A4AC] line-through sm:text-sm">{formatPrice(product.oldPrice, product.currency)}</span>}
                                                    </div>
                                                    <button type="button" onClick={() => handleAddToCart(product)} disabled={!product.available || !product.variantId || cartActionLoading} className="mt-auto inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#731D46] px-2 py-2.5 text-[11px] font-bold text-white transition disabled:cursor-not-allowed disabled:bg-[#C8B5BD] md:hover:bg-[#D4A037] sm:min-h-12 sm:px-4 sm:py-3 sm:text-sm">
                                                        {addingProductId === product.id ? <LoaderCircle size={15} className="animate-spin" /> : <ShoppingCart size={15} />}
                                                        <span>{!product.available ? t("unavailable") : addingProductId === product.id ? t("addingToCart") : t("addToCart")}</span>
                                                    </button>
                                                </div>
                                            </article>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex min-h-[320px] flex-col items-center justify-center rounded-3xl border border-dashed border-[#D8BEC8] bg-white px-5 text-center">
                                        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F3E5EA] text-[#731D46]">
                                            <PackageSearch size={30} />
                                        </span>
                                        <h2 className="mt-5 text-xl font-black text-[#2B1D1D]">{t("empty.title")}</h2>
                                        <p className="mt-2 max-w-md text-sm leading-6 text-[#74666A]">{t("empty.description")}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
                <div className={`fixed inset-0 z-[70] bg-black/45 transition duration-300 lg:hidden ${filterOpen ? "visible opacity-100" : "invisible opacity-0"}`} onClick={() => setFilterOpen(false)} />
                <aside className={`fixed top-0 z-[80] h-full w-[300px] bg-white p-5 shadow-2xl transition-transform duration-300 lg:hidden ${locale === "ar" ? `right-0 ${filterOpen ? "translate-x-0" : "translate-x-full"}` : `left-0 ${filterOpen ? "translate-x-0" : "-translate-x-full"}`}`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <SlidersHorizontal size={19} className="text-[#731D46]" />
                            <h2 className="text-lg font-black text-[#2B1D1D]">{t("filters.title")}</h2>
                        </div>
                        <button type="button" onClick={() => setFilterOpen(false)} className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F3E5EA] text-[#731D46]">
                            <X size={20} />
                        </button>
                    </div>
                    <div className="mt-6 border-t border-[#EFE4E8] pt-5">
                        <h3 className="text-sm font-extrabold text-[#2B1D1D]">{t("filters.availability")}</h3>
                        <div className="mt-4 flex flex-col gap-4">
                            {["all", "available", "unavailable"].map((value) => (
                                <label key={value} className="flex cursor-pointer items-center gap-3 text-sm text-[#74666A]">
                                    <input type="radio" name="mobileAvailability" value={value} checked={selectedAvailability === value} onChange={(event) => setSelectedAvailability(event.target.value)} className="h-4 w-4 accent-[#731D46]" />
                                    <span>{t(`filters.${value}`)}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <button type="button" onClick={() => setFilterOpen(false)} className="mt-8 w-full rounded-xl bg-[#731D46] px-5 py-3 text-sm font-bold text-white">{t("filters.apply")}</button>
                </aside>
            </main>
            <Footer />
        </>
    );
};

export default CollectionPage;