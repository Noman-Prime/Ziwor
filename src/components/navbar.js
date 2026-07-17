"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useCart } from "@/context/CartContext";
import { FaHome, FaUserAlt } from "react-icons/fa";
import { MdOutlinePhoneAndroid, MdMenu, MdClose, MdGridView } from "react-icons/md";
import { LuUtensilsCrossed } from "react-icons/lu";
import { PiToiletPaperBold } from "react-icons/pi";
import { IoSearch } from "react-icons/io5";
import { FiShoppingCart, FiLogIn, FiUserPlus } from "react-icons/fi";
const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [accountOpen, setAccountOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const accountRef = useRef(null);
    const searchRef = useRef(null);
    const t = useTranslations("Navbar");
    const locale = useLocale();
    const pathname = usePathname();
    const router = useRouter();
    const { totalQuantity, loading: cartLoading } = useCart();
    const cartCount = cartLoading ? 0 : Number(totalQuantity) || 0;
    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (accountRef.current && !accountRef.current.contains(event.target)) setAccountOpen(false);
            if (searchRef.current && !searchRef.current.contains(event.target)) setSearchOpen(false);
        };
        document.addEventListener("mousedown", handleOutsideClick);
        document.addEventListener("touchstart", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
            document.removeEventListener("touchstart", handleOutsideClick);
        };
    }, []);
    useEffect(() => {
        setMenuOpen(false);
        setAccountOpen(false);
        setSearchOpen(false);
    }, [pathname]);
    const navigateTo = (href) => {
        setMenuOpen(false);
        setAccountOpen(false);
        setSearchOpen(false);
        router.push(href);
    };
    const toggleMenu = () => {
        setAccountOpen(false);
        setSearchOpen(false);
        setMenuOpen((current) => !current);
    };
    const toggleAccount = () => {
        setMenuOpen(false);
        setSearchOpen(false);
        setAccountOpen((current) => !current);
    };
    const toggleSearch = () => {
        setMenuOpen(false);
        setAccountOpen(false);
        setSearchOpen((current) => !current);
    };
    const changeLanguage = (nextLocale) => {
        if (nextLocale === locale) return;
        setMenuOpen(false);
        setAccountOpen(false);
        setSearchOpen(false);
        router.replace(pathname, { locale: nextLocale });
    };
    const handleSearch = (event) => {
        event.preventDefault();
        const query = searchQuery.trim();
        if (!query) return;
        navigateTo(`/search?q=${encodeURIComponent(query)}`);
    };
    const menuItems = [
        {
            id: 1,
            title: t("homeAccessories"),
            href: "/collections/home-accessories",
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
                    <button type="button" onClick={toggleMenu} aria-label={menuOpen ? t("closeMenu") : t("openMenu")} aria-expanded={menuOpen} className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F8EDF1] text-[26px] text-[#7A1E3A] transition hover:bg-[#F1DDE5] lg:hidden">
                        {menuOpen ? <MdClose /> : <MdMenu />}
                    </button>
                    <button type="button" onClick={() => navigateTo("/")} aria-label={t("home")} className="flex shrink-0 items-center">
                        <Image src="/ziwora.png" alt="Ziwor" width={220} height={80} priority sizes="(max-width:640px) 150px, 200px" className="h-11 w-auto object-contain sm:h-12 lg:h-14" />
                    </button>
                </div>
                <div className="hidden items-center gap-2 lg:flex xl:gap-3">
                    {menuItems.map(({ id, title, href, icon: Icon }) => (
                        <button key={id} type="button" onClick={() => navigateTo(href)} className="flex items-center gap-2 whitespace-nowrap rounded-full border border-[#EADCE2] bg-[#FCF7F9] px-3.5 py-2.5 text-[13px] font-semibold text-[#2A2024] transition duration-300 hover:border-[#7A1E3A] hover:bg-[#7A1E3A] hover:text-white xl:px-4 xl:text-sm">
                            <Icon className="shrink-0 text-[16px]" />
                            <span>{title}</span>
                        </button>
                    ))}
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
                    <div ref={searchRef} className="static sm:relative">
                        <button type="button" onClick={toggleSearch} aria-label={t("search")} aria-expanded={searchOpen} className={`flex h-10 w-10 items-center justify-center rounded-full text-[23px] transition sm:text-[25px] ${searchOpen ? "bg-[#7A1E3A] text-white" : "text-[#222] hover:bg-[#F8EDF1] hover:text-[#7A1E3A]"}`}>
                            {searchOpen ? <MdClose /> : <IoSearch />}
                        </button>
                        <div className={`absolute inset-x-4 top-full z-[100] mt-3 origin-top rounded-2xl border border-[#E8D8DF] bg-white p-3 shadow-[0_18px_45px_rgba(62,28,43,0.18)] transition duration-200 sm:inset-x-auto sm:end-0 sm:top-[calc(100%+12px)] sm:mt-0 sm:w-[340px] ${searchOpen ? "visible translate-y-0 scale-100 opacity-100" : "invisible -translate-y-2 scale-95 opacity-0"}`}>
                            <form onSubmit={handleSearch} className="flex items-center gap-2">
                                <input type="search" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder={t("searchPlaceholder")} autoComplete="off" className="h-11 min-w-0 flex-1 rounded-xl border border-[#E8D8DF] bg-[#FCF7F9] px-4 text-sm text-[#2A2024] outline-none transition placeholder:text-[#9A858E] focus:border-[#7A1E3A] focus:ring-2 focus:ring-[#7A1E3A]/10" />
                                <button type="submit" disabled={!searchQuery.trim()} aria-label={t("search")} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#7A1E3A] text-xl text-white transition hover:bg-[#5E1730] disabled:cursor-not-allowed disabled:opacity-50">
                                    <IoSearch />
                                </button>
                            </form>
                        </div>
                    </div>
                    <button type="button" onClick={() => navigateTo("/cart")} aria-label={`${t("cart")} (${cartCount})`} className="relative flex h-10 w-10 items-center justify-center rounded-full text-[23px] text-[#222] transition hover:bg-[#F8EDF1] hover:text-[#7A1E3A] sm:text-[25px]">
                        <FiShoppingCart />
                        <span className="absolute right-0 top-0 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#C79A2B] px-1 text-[10px] font-bold leading-none text-white">{cartCount > 99 ? "99+" : cartCount}</span>
                    </button>
                    <div ref={accountRef} className="relative">
                        <button type="button" onClick={toggleAccount} aria-label={t("account")} aria-expanded={accountOpen} className={`flex h-10 w-10 items-center justify-center rounded-full text-[19px] transition sm:text-[21px] ${accountOpen ? "bg-[#7A1E3A] text-white" : "text-[#222] hover:bg-[#F8EDF1] hover:text-[#7A1E3A]"}`}>
                            <FaUserAlt />
                        </button>
                        <div className={`absolute end-0 top-[calc(100%+12px)] z-[100] w-[230px] origin-top rounded-2xl border border-[#E8D8DF] bg-white p-3 shadow-[0_18px_45px_rgba(62,28,43,0.18)] transition duration-200 ${accountOpen ? "visible translate-y-0 scale-100 opacity-100" : "invisible -translate-y-2 scale-95 opacity-0"}`}>
                            <div className="mb-3 border-b border-[#EADCE2] px-2 pb-3">
                                <p className="text-sm font-extrabold text-[#2A2024]">{t("accountTitle")}</p>
                                <p className="mt-1 text-xs leading-5 text-[#8F7882]">{t("accountDescription")}</p>
                            </div>
                            <button type="button" onClick={() => navigateTo("/login")} className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#731D46] px-4 py-3 text-sm font-bold text-white transition duration-300 hover:bg-[#D4A037]">
                                <FiLogIn size={17} />
                                <span>{t("login")}</span>
                            </button>
                            <button type="button" onClick={() => navigateTo("/signup")} className="mt-2 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#731D46] bg-white px-4 py-3 text-sm font-bold text-[#731D46] transition duration-300 hover:bg-[#F8EDF1]">
                                <FiUserPlus size={17} />
                                <span>{t("signup")}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className={`absolute left-0 top-full w-full overflow-hidden bg-white shadow-xl transition-all duration-300 lg:hidden ${menuOpen ? "max-h-[700px] border-b border-[#EADCE2] opacity-100" : "pointer-events-none max-h-0 opacity-0"}`}>
                <div className="flex flex-col gap-3 px-4 py-5 sm:px-6">
                    {menuItems.map(({ id, title, href, icon: Icon }) => (
                        <button key={id} type="button" onClick={() => navigateTo(href)} className="group flex w-full items-center gap-4 rounded-2xl border border-[#E8D8DF] bg-[#FCF7F9] px-4 py-4 text-[#2A2024] transition duration-300 hover:border-[#7A1E3A] hover:bg-[#7A1E3A] hover:text-white active:scale-[0.98]">
                            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#7A1E3A] text-xl text-white transition group-hover:bg-white group-hover:text-[#7A1E3A]">
                                <Icon />
                            </span>
                            <span className="text-start text-[15px] font-bold">{title}</span>
                        </button>
                    ))}
                    <div className="mt-2 border-t border-[#EADCE2] pt-5">
                        <p className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.15em] text-[#9A7686]">{t("language")}</p>
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