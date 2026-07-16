"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, ArrowRight, ShoppingCart } from "lucide-react";

const BestSellers = () => {
    const t = useTranslations("BestSellers");
    const locale = useLocale();

    const products = [
        {
            id: 1,
            category: t("products.airFryer.category"),
            title: t("products.airFryer.title"),
            price: 189,
            oldPrice: 220,
            image: "https://ronin.pk/cdn/shop/files/White02_87e6cf89-99b2-4953-aa01-2a479529748c.webp?v=1781929061&width=832",
            badge: t("badges.sale"),
        },
        {
            id: 2,
            category: t("products.dinnerSet.category"),
            title: t("products.dinnerSet.title"),
            price: 145,
            oldPrice: null,
            image: "https://images.unsplash.com/photo-1603199506016-b9a594b593c0?auto=format&fit=crop&w=1000&q=85",
            badge: null,
        },
        {
            id: 3,
            category: t("products.earbuds.category"),
            title: t("products.earbuds.title"),
            price: 99,
            oldPrice: 130,
            image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=1000&q=85",
            badge: t("badges.sale"),
        },
        {
            id: 4,
            category: t("products.serum.category"),
            title: t("products.serum.title"),
            price: 59,
            oldPrice: null,
            image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1000&q=85",
            badge: t("badges.new"),
        },
        {
            id: 5,
            category: t("products.blender.category"),
            title: t("products.blender.title"),
            price: 129,
            oldPrice: null,
            image: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=1000&q=85",
            badge: null,
        },
        {
            id: 6,
            category: t("products.teaSet.category"),
            title: t("products.teaSet.title"),
            price: 65,
            oldPrice: null,
            image: "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&w=1000&q=85",
            badge: null,
        },
        {
            id: 7,
            category: t("products.deskLamp.category"),
            title: t("products.deskLamp.title"),
            price: 79,
            oldPrice: 99,
            image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=85",
            badge: t("badges.sale"),
        },
        {
            id: 8,
            category: t("products.hairStraightener.category"),
            title: t("products.hairStraightener.title"),
            price: 89,
            oldPrice: null,
            image: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&w=1000&q=85",
            badge: t("badges.new"),
        },
    ];

    return (
        <section dir={locale === "ar" ? "rtl" : "ltr"} className="w-full bg-[#FCF8F6] py-12 sm:py-14 md:py-16 lg:py-20">
            <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
                <div className="mb-8 sm:mb-10 lg:mb-12">
                    <span className="inline-flex rounded-full border border-[#731D46]/10 bg-[#F3E5EA] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#731D46] sm:text-xs">{t("badge")}</span>
                    <div className="mt-3 flex items-center justify-between gap-3">
                        <h2 className="text-[28px] font-black leading-tight tracking-[-0.03em] text-[#2B1D1D] sm:text-[38px] md:text-[44px] lg:text-[50px]">{t("title")}</h2>
                        <Link href="/products" className="group inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#D8BEC8] bg-white px-3 py-2 text-[11px] font-bold text-[#731D46] transition duration-300 hover:border-[#731D46] hover:bg-[#731D46] hover:text-white sm:px-5 sm:py-3 sm:text-sm">
                            <span>{t("viewAll")}</span>
                            {locale === "ar" ? <ArrowLeft size={15} className="transition duration-300 group-hover:-translate-x-1 sm:h-[17px] sm:w-[17px]" /> : <ArrowRight size={15} className="transition duration-300 group-hover:translate-x-1 sm:h-[17px] sm:w-[17px]" />}
                        </Link>
                    </div>
                    <p className="mt-2 max-w-xl text-sm leading-7 text-[#74666A] sm:text-base">{t("description")}</p>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:gap-5 md:gap-6 lg:grid-cols-4">
                    {products.map((product) => (
                        <article key={product.id} className="group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-[#E8DDE1] bg-white shadow-[0_8px_28px_rgba(62,28,43,0.06)] transition duration-300 hover:-translate-y-1 hover:border-[#D4A037]/60 hover:shadow-[0_18px_45px_rgba(115,29,70,0.13)]">
                            <Link href={`/products/${product.id}`} className="relative block aspect-[4/3] overflow-hidden bg-[#F1E8ED]">
                                <Image src={product.image} alt={product.title} fill sizes="(max-width: 768px) 50vw, (max-width: 1024px) 50vw, 25vw" className="object-cover transition duration-700 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" />
                                {product.badge && <span className={`absolute start-2 top-2 z-10 rounded-full px-2.5 py-1 text-[9px] font-extrabold tracking-wide text-white shadow-md sm:start-3 sm:top-3 sm:px-3 sm:text-[11px] ${product.badge === t("badges.new") ? "bg-[#731D46]" : "bg-[#D4A037]"}`}>{product.badge}</span>}
                            </Link>
                            <div className="flex flex-1 flex-col p-3 sm:p-4">
                                <p className="line-clamp-1 text-[9px] font-bold uppercase tracking-[0.1em] text-[#A66D87] sm:text-[11px]">{product.category}</p>
                                <Link href={`/products/${product.id}`}>
                                    <h3 className="mt-1.5 line-clamp-2 min-h-[40px] text-[13px] font-extrabold leading-5 text-[#2D1A22] transition duration-300 hover:text-[#731D46] sm:min-h-[48px] sm:text-base sm:leading-6">{product.title}</h3>
                                </Link>
                                <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 sm:mt-4">
                                    <span className="text-[15px] font-black text-[#731D46] sm:text-lg">{t("currency")} {product.price}</span>
                                    {product.oldPrice && <span className="text-[11px] text-[#B8A4AC] line-through sm:text-sm">{t("currency")} {product.oldPrice}</span>}
                                </div>
                                <button type="button" className="mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#731D46] px-2 py-2.5 text-[11px] font-bold text-white transition duration-300 hover:bg-[#D4A037] active:scale-[0.98] sm:min-h-12 sm:px-4 sm:py-3 sm:text-sm">
                                    <ShoppingCart size={15} strokeWidth={2.3} className="shrink-0 sm:h-[17px] sm:w-[17px]" />
                                    <span>{t("addToCart")}</span>
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BestSellers;