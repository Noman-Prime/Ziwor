"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

const Hero = () => {
    const t = useTranslations("Hero");
    const locale = useLocale();

    const [currentSlide, setCurrentSlide] = useState(0);

    const sliderImages = [
        {
            id: 1,
            image: "https://ronin.pk/cdn/shop/files/White02_87e6cf89-99b2-4953-aa01-2a479529748c.webp?v=1781929061&width=832",
            alt: t("slides.homeEssentials.alt"),
            title: t("slides.homeEssentials.title"),
        },
        {
            id: 2,
            image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200",
            alt: t("slides.kitchenEssentials.alt"),
            title: t("slides.kitchenEssentials.title"),
        },
        {
            id: 3,
            image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200",
            alt: t("slides.electronics.alt"),
            title: t("slides.electronics.title"),
        },
    ];

    useEffect(() => {
        const sliderInterval = setInterval(() => {
            setCurrentSlide((previousSlide) =>
                previousSlide === sliderImages.length - 1
                    ? 0
                    : previousSlide + 1
            );
        }, 3000);

        return () => clearInterval(sliderInterval);
    }, [sliderImages.length]);

    const previousSlide = () => {
        setCurrentSlide((previousSlide) =>
            previousSlide === 0
                ? sliderImages.length - 1
                : previousSlide - 1
        );
    };

    const nextSlide = () => {
        setCurrentSlide((previousSlide) =>
            previousSlide === sliderImages.length - 1
                ? 0
                : previousSlide + 1
        );
    };

    return (
        <section dir={locale === "ar" ? "rtl" : "ltr"} className="w-full overflow-hidden bg-[#731D46]">
            <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 items-center gap-8 px-4 py-8 sm:px-6 sm:py-10 md:px-8 md:py-12 lg:grid-cols-2 lg:gap-12 lg:px-10 lg:py-16 xl:gap-16 xl:px-12 xl:py-20">
                <div className="flex min-w-0 flex-col">
                    <span className="order-1 inline-flex w-fit items-center rounded-full border border-[#E8BC62]/40 bg-[#D4A037] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-white shadow-[0_8px_30px_rgba(212,160,55,0.22)] sm:px-5 sm:py-2.5 sm:text-xs">{t("badge")}</span>
                    <h1 className="order-2 mt-5 max-w-[700px] text-[34px] font-black leading-[1.05] tracking-[-0.035em] text-white sm:text-[42px] md:text-[50px] lg:mt-6 lg:text-[52px] xl:text-[64px]">
                        <span className="block">{t("titleLine1")}</span>
                        <span className="mt-2 block text-[#D4A037]">{t("titleLine2")}</span>
                    </h1>
                    <div className="order-3 mt-5 h-1 w-20 rounded-full bg-[#D4A037] sm:w-24" />
                    <p className="order-4 mt-5 max-w-[610px] text-sm leading-7 text-white/85 sm:text-base sm:leading-8 md:text-lg">{t("description")}</p>
                    <div className="order-5 mt-7 hidden flex-wrap items-center gap-3 sm:gap-4 lg:flex">
                        <Link href="/collections/all" className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#D4A037] px-7 py-3 text-sm font-bold text-white shadow-[0_10px_30px_rgba(212,160,55,0.28)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#E0AD43] hover:shadow-[0_14px_35px_rgba(212,160,55,0.36)] xl:px-8 xl:text-base">{t("shopNow")}</Link>
                        <Link href="/collections" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/40 bg-white/5 px-7 py-3 text-sm font-bold text-white backdrop-blur-sm transition duration-300 hover:-translate-y-0.5 hover:border-white hover:bg-white hover:text-[#731D46] xl:px-8 xl:text-base">{t("exploreCategories")}</Link>
                    </div>
                </div>
                <div className="relative min-w-0">
                    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-white/15 bg-[#5E1739] shadow-2xl sm:aspect-[16/9] lg:aspect-[14/9] xl:h-[390px] xl:aspect-auto">
                        {sliderImages.map((slide, index) => (
                            <div key={slide.id} className={`absolute inset-0 transition-all duration-700 ease-in-out ${index === currentSlide ? "translate-x-0 opacity-100" : locale === "ar" ? "-translate-x-full opacity-0" : "translate-x-full opacity-0"}`}>
                                <Image src={slide.image} alt={slide.alt} fill priority={index === 0} sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" />
                                {slide.title && (
                                    <div className="absolute bottom-12 start-4 z-10 max-w-[75%] sm:bottom-14 sm:start-6">
                                        <p className="text-lg font-extrabold leading-snug text-white drop-shadow-md sm:text-2xl">{slide.title}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                        <button type="button" onClick={previousSlide} aria-label={t("previousSlide")} className="absolute start-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-2xl text-white backdrop-blur-sm transition hover:bg-[#D4A037] sm:start-4 sm:h-11 sm:w-11">
                            {locale === "ar" ? <MdKeyboardArrowRight /> : <MdKeyboardArrowLeft />}
                        </button>
                        <button type="button" onClick={nextSlide} aria-label={t("nextSlide")} className="absolute end-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-2xl text-white backdrop-blur-sm transition hover:bg-[#D4A037] sm:end-4 sm:h-11 sm:w-11">
                            {locale === "ar" ? <MdKeyboardArrowLeft /> : <MdKeyboardArrowRight />}
                        </button>
                        <div dir="ltr" className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/25 px-3 py-2 backdrop-blur-sm sm:bottom-4">
                            {sliderImages.map((slide, index) => (
                                <button key={slide.id} type="button" onClick={() => setCurrentSlide(index)} aria-label={`${t("goToSlide")} ${index + 1}`} className={`h-2 rounded-full transition-all duration-300 ${currentSlide === index ? "w-7 bg-[#D4A037]" : "w-2 bg-white/70 hover:bg-white"}`} />
                            ))}
                        </div>
                    </div>
                </div>
                <div className="grid w-full grid-cols-2 gap-3 lg:hidden">
                    <Link href="/collections/all" className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-[#D4A037] px-2 py-3 text-center text-[12px] font-bold leading-tight text-white shadow-[0_10px_30px_rgba(212,160,55,0.28)] transition duration-300 hover:bg-[#E0AD43] min-[380px]:px-3 min-[380px]:text-[13px] sm:px-5 sm:text-sm">{t("shopNow")}</Link>
                    <Link href="/collections" className="inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-white/40 bg-white/5 px-2 py-3 text-center text-[12px] font-bold leading-tight text-white transition duration-300 hover:bg-white hover:text-[#731D46] min-[380px]:px-3 min-[380px]:text-[13px] sm:px-5 sm:text-sm">{t("exploreCategories")}</Link>
                </div>
            </div>
        </section>
    );
};

export default Hero;