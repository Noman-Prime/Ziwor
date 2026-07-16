"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { House, UtensilsCrossed, Smartphone, Sparkles, ArrowUpRight } from "lucide-react";

const Categories = () => {
    const t = useTranslations("Categories");
    const locale = useLocale();
    const router = useRouter();

    const navigateTo = (href) => {
        router.push(href);
    };

    const categories = [
        {
            id: 1,
            title: t("items.homeAppliances"),
            image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=1200&q=85",
            href: "/collections/home-appliances",
            icon: House,
        },
        {
            id: 2,
            title: t("items.crockery"),
            image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=85",
            href: "/collections/crockery",
            icon: UtensilsCrossed,
        },
        {
            id: 3,
            title: t("items.electronics"),
            image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=1200&q=85",
            href: "/collections/electronics",
            icon: Smartphone,
        },
        {
            id: 4,
            title: t("items.healthBeauty"),
            image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1200&q=85",
            href: "/collections/health-beauty",
            icon: Sparkles,
        },
    ];

    return (
        <section dir={locale === "ar" ? "rtl" : "ltr"} className="w-full bg-[#FCF8F7] py-12 sm:py-14 md:py-16 lg:py-20">
            <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
                <div className="mx-auto max-w-2xl text-center">
                    <span className="inline-flex items-center rounded-full border border-[#731D46]/10 bg-[#F3E5EA] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#731D46] sm:text-xs">{t("badge")}</span>
                    <h2 className="mt-4 text-[30px] font-black leading-tight tracking-[-0.03em] text-[#2B1D1D] sm:text-[38px] md:text-[44px] lg:text-[50px]">{t("title")}</h2>
                    <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[#74666A] sm:text-base md:text-lg">{t("description")}</p>
                    <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-[#D4A037] sm:w-20" />
                </div>
                <div className="mt-9 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-5 md:mt-12 md:gap-6 lg:grid-cols-4 lg:gap-7">
                    {categories.map((category) => {
                        const Icon = category.icon;

                        return (
                            <button key={category.id} type="button" onClick={() => navigateTo(category.href)} className="group relative overflow-hidden rounded-2xl border border-[#E7D9DD] bg-white text-start shadow-[0_8px_30px_rgba(43,29,29,0.06)] transition duration-300 hover:-translate-y-1.5 hover:border-[#D4A037]/70 hover:shadow-[0_20px_50px_rgba(115,29,70,0.15)]">
                                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F2E8EC] sm:aspect-[5/4] lg:aspect-[4/3]">
                                    <Image src={category.image} alt={category.title} fill sizes="(max-width: 768px) 50vw, (max-width: 1024px) 50vw, 25vw" className="object-cover transition duration-700 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#2B1D1D]/65 via-[#2B1D1D]/5 to-transparent" />
                                    <span className="absolute end-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/30 bg-black/20 text-white opacity-0 backdrop-blur-md transition duration-300 group-hover:opacity-100 sm:h-9 sm:w-9">
                                        <ArrowUpRight size={17} strokeWidth={2.3} className={locale === "ar" ? "-rotate-90" : ""} />
                                    </span>
                                </div>
                                <div className="relative px-3 pb-5 pt-8 sm:px-5 sm:pb-6 sm:pt-9">
                                    <span className="absolute -top-6 start-3 flex h-12 w-12 items-center justify-center rounded-xl border-4 border-white bg-[#731D46] text-white shadow-lg transition duration-300 group-hover:bg-[#D4A037] sm:-top-7 sm:start-5 sm:h-14 sm:w-14 sm:rounded-2xl">
                                        <Icon size={23} strokeWidth={2.2} className="sm:h-7 sm:w-7" />
                                    </span>
                                    <h3 className="min-h-[42px] text-[14px] font-extrabold leading-snug text-[#2B1D1D] transition duration-300 group-hover:text-[#731D46] sm:min-h-[48px] sm:text-lg lg:text-xl xl:text-[22px]">{category.title}</h3>
                                    <div className="mt-3 h-[3px] w-8 rounded-full bg-[#D4A037] transition-all duration-300 group-hover:w-14 sm:mt-4" />
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Categories;