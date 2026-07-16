"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, ArrowRight, ChevronDown, Filter, Grid2X2, House, ListFilter, ShoppingCart, SlidersHorizontal, X } from "lucide-react";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";

const CollectionPage = () => {
    const t = useTranslations("CollectionPage");
    const locale = useLocale();
    const params = useParams();
    const handle = params.handle;
    const [sortBy, setSortBy] = useState("featured");
    const [filterOpen, setFilterOpen] = useState(false);
    const [selectedAvailability, setSelectedAvailability] = useState("all");

    const collectionData = {
        "home-appliances": {
            title: t("collections.homeAppliances.title"),
            description: t("collections.homeAppliances.description"),
            banner: "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1600&q=85",
        },
        crockery: {
            title: t("collections.crockery.title"),
            description: t("collections.crockery.description"),
            banner: "https://images.unsplash.com/photo-1603199506016-b9a594b593c0?auto=format&fit=crop&w=1600&q=85",
        },
        electronics: {
            title: t("collections.electronics.title"),
            description: t("collections.electronics.description"),
            banner: "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=1600&q=85",
        },
        "health-beauty": {
            title: t("collections.healthBeauty.title"),
            description: t("collections.healthBeauty.description"),
            banner: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1600&q=85",
        },
    };

    const products = [
        {
            id: 1,
            collection: "home-appliances",
            title: t("products.airFryer"),
            price: 189,
            oldPrice: 220,
            available: true,
            badge: t("badges.sale"),
            image: "https://ronin.pk/cdn/shop/files/White02_87e6cf89-99b2-4953-aa01-2a479529748c.webp?v=1781929061&width=832",
        },
        {
            id: 2,
            collection: "home-appliances",
            title: t("products.blender"),
            price: 129,
            oldPrice: null,
            available: true,
            badge: null,
            image: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=1000&q=85",
        },
        {
            id: 3,
            collection: "home-appliances",
            title: t("products.coffeeMachine"),
            price: 249,
            oldPrice: 289,
            available: false,
            badge: t("badges.sale"),
            image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=1000&q=85",
        },
        {
            id: 4,
            collection: "home-appliances",
            title: t("products.toaster"),
            price: 89,
            oldPrice: null,
            available: true,
            badge: t("badges.new"),
            image: "https://images.unsplash.com/photo-1583726268515-6e83e902d0de?auto=format&fit=crop&w=1000&q=85",
        },
        {
            id: 5,
            collection: "crockery",
            title: t("products.dinnerSet"),
            price: 145,
            oldPrice: null,
            available: true,
            badge: t("badges.new"),
            image: "https://images.unsplash.com/photo-1603199506016-b9a594b593c0?auto=format&fit=crop&w=1000&q=85",
        },
        {
            id: 6,
            collection: "crockery",
            title: t("products.teaSet"),
            price: 65,
            oldPrice: 79,
            available: true,
            badge: t("badges.sale"),
            image: "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&w=1000&q=85",
        },
        {
            id: 7,
            collection: "crockery",
            title: t("products.bowlSet"),
            price: 55,
            oldPrice: null,
            available: true,
            badge: null,
            image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=1000&q=85",
        },
        {
            id: 8,
            collection: "crockery",
            title: t("products.cutlerySet"),
            price: 95,
            oldPrice: null,
            available: false,
            badge: null,
            image: "https://images.unsplash.com/photo-1584346133934-a3afd2a33c4c?auto=format&fit=crop&w=1000&q=85",
        },
        {
            id: 9,
            collection: "electronics",
            title: t("products.earbuds"),
            price: 99,
            oldPrice: 130,
            available: true,
            badge: t("badges.sale"),
            image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=1000&q=85",
        },
        {
            id: 10,
            collection: "electronics",
            title: t("products.smartWatch"),
            price: 179,
            oldPrice: null,
            available: true,
            badge: t("badges.new"),
            image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=85",
        },
        {
            id: 11,
            collection: "electronics",
            title: t("products.deskLamp"),
            price: 79,
            oldPrice: 99,
            available: true,
            badge: t("badges.sale"),
            image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=85",
        },
        {
            id: 12,
            collection: "electronics",
            title: t("products.speaker"),
            price: 139,
            oldPrice: null,
            available: false,
            badge: null,
            image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=1000&q=85",
        },
        {
            id: 13,
            collection: "health-beauty",
            title: t("products.serum"),
            price: 59,
            oldPrice: null,
            available: true,
            badge: t("badges.new"),
            image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1000&q=85",
        },
        {
            id: 14,
            collection: "health-beauty",
            title: t("products.hairStraightener"),
            price: 89,
            oldPrice: 109,
            available: true,
            badge: t("badges.sale"),
            image: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&w=1000&q=85",
        },
        {
            id: 15,
            collection: "health-beauty",
            title: t("products.skinCareSet"),
            price: 119,
            oldPrice: null,
            available: true,
            badge: null,
            image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=1000&q=85",
        },
        {
            id: 16,
            collection: "health-beauty",
            title: t("products.makeupSet"),
            price: 149,
            oldPrice: null,
            available: false,
            badge: t("badges.new"),
            image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1000&q=85",
        },
    ];

    const collection = collectionData[handle];

    const filteredProducts = useMemo(() => {
        let result = products.filter((product) => product.collection === handle);

        if (selectedAvailability === "available") {
            result = result.filter((product) => product.available);
        }

        if (selectedAvailability === "unavailable") {
            result = result.filter((product) => !product.available);
        }

        if (sortBy === "price-low") {
            result = [...result].sort((a, b) => a.price - b.price);
        }

        if (sortBy === "price-high") {
            result = [...result].sort((a, b) => b.price - a.price);
        }

        if (sortBy === "name") {
            result = [...result].sort((a, b) => a.title.localeCompare(b.title));
        }

        return result;
    }, [handle, selectedAvailability, sortBy]);

    if (!collection) {
        return (
            <>
                <Navbar />
                <main dir={locale === "ar" ? "rtl" : "ltr"} className="flex min-h-[70vh] items-center justify-center bg-[#FCF8F6] px-4">
                    <div className="text-center">
                        <h1 className="text-3xl font-black text-[#2B1D1D]">{t("notFound.title")}</h1>
                        <p className="mt-3 text-sm text-[#74666A] sm:text-base">{t("notFound.description")}</p>
                        <Link href="/" className="mt-6 inline-flex min-h-12 items-center justify-center rounded-xl bg-[#731D46] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#D4A037]">{t("notFound.button")}</Link>
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
                        <Link href="/" className="flex items-center gap-1.5 transition hover:text-[#731D46]">
                            <House size={15} />
                            <span>{t("breadcrumb.home")}</span>
                        </Link>
                        <span>/</span>
                        <span>{collection.title}</span>
                    </div>
                </section>
                <section className="w-full py-6 sm:py-8">
                    <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
                        <div className="relative min-h-[260px] overflow-hidden rounded-3xl bg-[#2C0D1D] sm:min-h-[320px] lg:min-h-[380px]">
                            <Image src={collection.banner} alt={collection.title} fill priority sizes="100vw" className="object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-r from-[#260B19]/90 via-[#260B19]/60 to-transparent rtl:bg-gradient-to-l" />
                            <div className="relative z-10 flex min-h-[260px] max-w-2xl flex-col justify-center px-5 py-10 sm:min-h-[320px] sm:px-10 lg:min-h-[380px] lg:px-14">
                                <span className="inline-flex w-fit rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-sm sm:text-xs">{t("collectionBadge")}</span>
                                <h1 className="mt-4 text-[34px] font-black leading-tight tracking-[-0.03em] text-white sm:text-[46px] lg:text-[58px]">{collection.title}</h1>
                                <p className="mt-4 max-w-xl text-sm leading-7 text-white/85 sm:text-base lg:text-lg">{collection.description}</p>
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
                                {filteredProducts.length > 0 ? (
                                    <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:gap-6 xl:grid-cols-4">
                                        {filteredProducts.map((product) => (
                                            <article key={product.id} className="group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-[#E8DDE1] bg-white shadow-[0_8px_28px_rgba(62,28,43,0.06)] transition duration-300 hover:-translate-y-1 hover:border-[#D4A037]/60 hover:shadow-[0_18px_45px_rgba(115,29,70,0.13)]">
                                                <Link href={`/products/${product.id}`} className="relative block aspect-[4/3] overflow-hidden bg-[#F1E8ED]">
                                                    <Image src={product.image} alt={product.title} fill sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw" className="object-cover transition duration-700 group-hover:scale-110" />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" />
                                                    {product.badge && <span className={`absolute start-2 top-2 z-10 rounded-full px-2.5 py-1 text-[9px] font-extrabold text-white shadow-md sm:start-3 sm:top-3 sm:px-3 sm:text-[11px] ${product.badge === t("badges.new") ? "bg-[#731D46]" : "bg-[#D4A037]"}`}>{product.badge}</span>}
                                                    {!product.available && <span className="absolute inset-x-3 bottom-3 z-10 rounded-xl bg-black/70 px-3 py-2 text-center text-[10px] font-bold text-white backdrop-blur-sm sm:text-xs">{t("soldOut")}</span>}
                                                </Link>
                                                <div className="flex flex-1 flex-col p-3 sm:p-4">
                                                    <p className="line-clamp-1 text-[9px] font-bold uppercase tracking-[0.1em] text-[#A66D87] sm:text-[11px]">{collection.title}</p>
                                                    <Link href={`/products/${product.id}`}>
                                                        <h3 className="mt-1.5 line-clamp-2 min-h-[40px] text-[13px] font-extrabold leading-5 text-[#2D1A22] transition hover:text-[#731D46] sm:min-h-[48px] sm:text-base sm:leading-6">{product.title}</h3>
                                                    </Link>
                                                    <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1">
                                                        <span className="text-[15px] font-black text-[#731D46] sm:text-lg">{t("currency")} {product.price}</span>
                                                        {product.oldPrice && <span className="text-[11px] text-[#B8A4AC] line-through sm:text-sm">{t("currency")} {product.oldPrice}</span>}
                                                    </div>
                                                    <button type="button" disabled={!product.available} className="mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#731D46] px-2 py-2.5 text-[11px] font-bold text-white transition hover:bg-[#D4A037] disabled:cursor-not-allowed disabled:bg-[#C8B5BD] sm:min-h-12 sm:px-4 sm:py-3 sm:text-sm">
                                                        <ShoppingCart size={15} />
                                                        <span>{product.available ? t("addToCart") : t("unavailable")}</span>
                                                    </button>
                                                </div>
                                            </article>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#D8BEC8] bg-white px-4 text-center">
                                        <h2 className="text-xl font-black text-[#2B1D1D]">{t("empty.title")}</h2>
                                        <p className="mt-2 text-sm text-[#74666A]">{t("empty.description")}</p>
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