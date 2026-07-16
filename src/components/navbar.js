"use client";

import { useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { FaHome, FaUserAlt } from "react-icons/fa";
import { MdOutlinePhoneAndroid, MdMenu, MdClose } from "react-icons/md";
import { LuUtensilsCrossed } from "react-icons/lu";
import { PiToiletPaperBold } from "react-icons/pi";
import { IoSearch } from "react-icons/io5";
import { FiShoppingCart } from "react-icons/fi";

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const t = useTranslations("Navbar");
    const locale = useLocale();
    const pathname = usePathname();
    const router = useRouter();

    const closeMenu = () => {
        setMenuOpen(false);
    };

    const navigateTo = (href) => {
        setMenuOpen(false);
        router.push(href);
    };

    const changeLanguage = (nextLocale) => {
        if (nextLocale === locale) {
            return;
        }

        setMenuOpen(false);
        router.replace(pathname, {
            locale: nextLocale,
        });
    };

    const menuItems = [
        {
            id: 1,
            title: t("homeAppliances"),
            href: "/collections/home-appliances",
            icon: FaHome,
        },
        {
            id: 2,
            title: t("crockery"),
            href: "/collections/crockery",
            icon: LuUtensilsCrossed,
        },
        {
            id: 3,
            title: t("electronics"),
            href: "/collections/electronics",
            icon: MdOutlinePhoneAndroid,
        },
        {
            id: 4,
            title: t("healthBeauty"),
            href: "/collections/health-beauty",
            icon: PiToiletPaperBold,
        },
    ];

    return (
        <nav className="relative z-50 w-full border-b-2 border-[#7A1E3A] bg-white">
            <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:h-[72px] lg:px-8 xl:h-20">
                <div className="flex items-center gap-3">
                    <button type="button" onClick={() => setMenuOpen((prev) => !prev)} aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"} aria-expanded={menuOpen} className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F8EDF1] text-[26px] text-[#7A1E3A] transition hover:bg-[#F1DDE5] lg:hidden">
                        {menuOpen ? <MdClose /> : <MdMenu />}
                    </button>
                    <button type="button" onClick={() => navigateTo("/")} className="flex shrink-0 items-center">
                        <Image src="/logo.png" alt="Ziwora" width={48} height={48} priority className="h-10 w-auto object-contain sm:h-11 lg:h-12" />
                    </button>
                </div>
                <div className="hidden items-center gap-2 lg:flex xl:gap-3">
                    {menuItems.map((item) => {
                        const Icon = item.icon;

                        return (
                            <button key={item.id} type="button" onClick={() => navigateTo(item.href)} className="flex items-center gap-2 whitespace-nowrap rounded-full border border-[#EADCE2] bg-[#FCF7F9] px-3.5 py-2.5 text-[13px] font-semibold text-[#2A2024] transition duration-300 hover:border-[#7A1E3A] hover:bg-[#7A1E3A] hover:text-white xl:px-4 xl:text-sm">
                                <Icon className="shrink-0 text-[16px]" />
                                <span>{item.title}</span>
                            </button>
                        );
                    })}
                </div>
                <div className="flex items-center gap-1 sm:gap-2 lg:gap-3">
                    <div dir="ltr" className="relative hidden h-10 w-[118px] grid-cols-2 rounded-full border border-[#D8AEBB] bg-[#F8EDF1] p-1 xl:grid">
                        <span className={`absolute top-1 h-8 w-[53px] rounded-full bg-[#7A1E3A] shadow-sm transition-all duration-300 ${locale === "ar" ? "translate-x-[57px]" : "translate-x-0"}`} />
                        <button type="button" onClick={() => changeLanguage("en")} aria-pressed={locale === "en"} className={`relative z-10 flex items-center justify-center rounded-full text-xs font-bold transition-colors duration-300 ${locale === "en" ? "text-white" : "text-[#7A1E3A]"}`}>
                            EN
                        </button>
                        <button type="button" onClick={() => changeLanguage("ar")} aria-pressed={locale === "ar"} className={`relative z-10 flex items-center justify-center rounded-full text-xs font-bold transition-colors duration-300 ${locale === "ar" ? "text-white" : "text-[#7A1E3A]"}`}>
                            عربي
                        </button>
                    </div>
                    <button type="button" aria-label="Search" className="flex h-10 w-10 items-center justify-center rounded-full text-[23px] text-[#222] transition hover:bg-[#F8EDF1] hover:text-[#7A1E3A] sm:text-[25px]">
                        <IoSearch />
                    </button>
                    <button type="button" aria-label="Shopping cart" className="relative flex h-10 w-10 items-center justify-center rounded-full text-[23px] text-[#222] transition hover:bg-[#F8EDF1] hover:text-[#7A1E3A] sm:text-[25px]">
                        <FiShoppingCart />
                        <span className="absolute right-0 top-0 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#C79A2B] px-1 text-[10px] font-bold leading-none text-white">2</span>
                    </button>
                    <button type="button" aria-label="Customer account" className="flex h-10 w-10 items-center justify-center rounded-full text-[19px] text-[#222] transition hover:bg-[#F8EDF1] hover:text-[#7A1E3A] sm:text-[21px]">
                        <FaUserAlt />
                    </button>
                </div>
            </div>
            <div className={`absolute left-0 top-full w-full overflow-hidden bg-white shadow-xl transition-all duration-300 lg:hidden ${menuOpen ? "max-h-[720px] border-b border-[#EADCE2] opacity-100" : "pointer-events-none max-h-0 opacity-0"}`}>
                <div className="flex flex-col gap-3 px-4 py-5 sm:px-6">
                    {menuItems.map((item) => {
                        const Icon = item.icon;

                        return (
                            <button key={item.id} type="button" onClick={() => navigateTo(item.href)} className="group flex w-full items-center gap-4 rounded-2xl border border-[#E8D8DF] bg-[#FCF7F9] px-4 py-4 text-[#2A2024] transition duration-300 hover:border-[#7A1E3A] hover:bg-[#7A1E3A] hover:text-white active:scale-[0.98]">
                                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#7A1E3A] text-xl text-white transition group-hover:bg-white group-hover:text-[#7A1E3A]">
                                    <Icon />
                                </span>
                                <span className="text-start text-[15px] font-bold">{item.title}</span>
                            </button>
                        );
                    })}
                    <div className="mt-2 border-t border-[#EADCE2] pt-5">
                        <p className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.15em] text-[#9A7686]">{locale === "ar" ? "اللغة" : "Language"}</p>
                        <div dir="ltr" className="relative mx-auto grid h-12 w-full max-w-[240px] grid-cols-2 rounded-full border border-[#D8AEBB] bg-[#F8EDF1] p-1">
                            <span className={`absolute top-1 h-10 w-[calc(50%-4px)] rounded-full bg-[#7A1E3A] shadow-sm transition-all duration-300 ${locale === "ar" ? "left-[50%]" : "left-1"}`} />
                            <button type="button" onClick={() => changeLanguage("en")} aria-pressed={locale === "en"} className={`relative z-10 rounded-full text-sm font-bold transition ${locale === "en" ? "text-white" : "text-[#7A1E3A]"}`}>
                                English
                            </button>
                            <button type="button" onClick={() => changeLanguage("ar")} aria-pressed={locale === "ar"} className={`relative z-10 rounded-full text-sm font-bold transition ${locale === "ar" ? "text-white" : "text-[#7A1E3A]"}`}>
                                العربية
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;