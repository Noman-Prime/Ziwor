"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
    MdKeyboardArrowLeft,
    MdKeyboardArrowRight
} from "react-icons/md";

const Hero = ({ slides = [] }) => {
    const t = useTranslations("Hero");
    const locale = useLocale();

    const [currentSlide, setCurrentSlide] = useState(0);

    const isArabic = locale === "ar";
    const hasMultipleSlides = slides.length > 1;

    useEffect(() => {
        if (!hasMultipleSlides) return;

        const sliderInterval = setInterval(() => {
            setCurrentSlide((previousSlide) =>
                previousSlide === slides.length - 1
                    ? 0
                    : previousSlide + 1
            );
        }, 3000);

        return () => clearInterval(sliderInterval);
    }, [hasMultipleSlides, slides.length]);

    useEffect(() => {
        if (currentSlide >= slides.length) {
            setCurrentSlide(0);
        }
    }, [currentSlide, slides.length]);

    const previousSlide = () => {
        if (!hasMultipleSlides) return;

        setCurrentSlide((previousSlide) =>
            previousSlide === 0
                ? slides.length - 1
                : previousSlide - 1
        );
    };

    const nextSlide = () => {
        if (!hasMultipleSlides) return;

        setCurrentSlide((previousSlide) =>
            previousSlide === slides.length - 1
                ? 0
                : previousSlide + 1
        );
    };

    return (
        <section
            dir={isArabic ? "rtl" : "ltr"}
            className="w-full overflow-hidden bg-[#731D46]"
        >
            <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 items-center gap-8 px-4 py-8 sm:px-6 sm:py-10 md:px-8 md:py-12 lg:grid-cols-2 lg:gap-12 lg:px-10 lg:py-16 xl:gap-16 xl:px-12 xl:py-20">
                <div className="flex min-w-0 flex-col">
                    <span className="order-1 inline-flex w-fit items-center rounded-full border border-[#E8BC62]/40 bg-[#D4A037] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-white shadow-[0_8px_30px_rgba(212,160,55,0.22)] sm:px-5 sm:py-2.5 sm:text-xs">
                        {t("badge")}
                    </span>

                    <h1 className="order-2 mt-5 max-w-[700px] text-[34px] font-black leading-[1.05] tracking-[-0.035em] text-white sm:text-[42px] md:text-[50px] lg:mt-6 lg:text-[52px] xl:text-[64px]">
                        <span className="block">
                            {t("titleLine1")}
                        </span>

                        <span className="mt-2 block text-[#D4A037]">
                            {t("titleLine2")}
                        </span>
                    </h1>

                    <div className="order-3 mt-5 h-1 w-20 rounded-full bg-[#D4A037] sm:w-24" />

                    <p className="order-4 mt-5 max-w-[610px] text-sm leading-7 text-white/85 sm:text-base sm:leading-8 md:text-lg">
                        {t("description")}
                    </p>

                    <div className="order-5 mt-7 hidden flex-wrap items-center gap-3 sm:gap-4 lg:flex">
                        <Link
                            href="/collections/all"
                            className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#D4A037] px-7 py-3 text-sm font-bold text-white shadow-[0_10px_30px_rgba(212,160,55,0.28)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#E0AD43] hover:shadow-[0_14px_35px_rgba(212,160,55,0.36)] xl:px-8 xl:text-base"
                        >
                            {t("shopNow")}
                        </Link>

                        <Link
                            href="/collections"
                            className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/40 bg-white/5 px-7 py-3 text-sm font-bold text-white backdrop-blur-sm transition duration-300 hover:-translate-y-0.5 hover:border-white hover:bg-white hover:text-[#731D46] xl:px-8 xl:text-base"
                        >
                            {t("exploreCategories")}
                        </Link>
                    </div>
                </div>

                <div className="relative min-w-0">
                    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-white/15 bg-[#5E1739] shadow-2xl sm:aspect-[16/9] lg:aspect-[14/9] xl:h-[390px] xl:aspect-auto">
                        {!slides.length && (
                            <div className="flex h-full w-full items-center justify-center px-5 text-center">
                                <p className="text-sm font-semibold text-white/70">
                                    No active slider images found.
                                </p>
                            </div>
                        )}

                        {slides.map((slide, index) => {
                            const desktopImage =
                                slide.desktopImage?.url;

                            const mobileImage =
                                slide.mobileImage?.url ||
                                desktopImage;

                            const isActive =
                                index === currentSlide;

                            if (!desktopImage) return null;

                            return (
                                <div
                                    key={slide.id}
                                    aria-hidden={!isActive}
                                    className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                                        isActive
                                            ? "visible translate-x-0 opacity-100"
                                            : isArabic
                                              ? "invisible -translate-x-full opacity-0"
                                              : "invisible translate-x-full opacity-0"
                                    }`}
                                >
                                    <div className="absolute inset-0 hidden sm:block">
                                        <Image
                                            src={desktopImage}
                                            alt={
                                                slide.desktopImage
                                                    ?.altText ||
                                                slide.title ||
                                                "Ziwor slider image"
                                            }
                                            fill
                                            priority={index === 0}
                                            sizes="(max-width: 1024px) 100vw, 50vw"
                                            className="object-cover"
                                        />
                                    </div>

                                    <div className="absolute inset-0 sm:hidden">
                                        <Image
                                            src={mobileImage}
                                            alt={
                                                slide.mobileImage
                                                    ?.altText ||
                                                slide.desktopImage
                                                    ?.altText ||
                                                slide.title ||
                                                "Ziwor slider image"
                                            }
                                            fill
                                            priority={index === 0}
                                            sizes="100vw"
                                            className="object-cover"
                                        />
                                    </div>

                                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

                                    <div className="absolute bottom-11 start-4 z-10 max-w-[78%] sm:bottom-14 sm:start-6">
                                        {slide.title && (
                                            <h2 className="text-lg font-extrabold leading-snug text-white drop-shadow-md sm:text-2xl">
                                                {slide.title}
                                            </h2>
                                        )}

                                        {slide.subtitle && (
                                            <p className="mt-2 line-clamp-2 text-xs leading-5 text-white/85 sm:max-w-md sm:text-sm sm:leading-6">
                                                {slide.subtitle}
                                            </p>
                                        )}

                                        {slide.buttonText &&
                                            slide.buttonLink && (
                                                <Link
                                                    href={
                                                        slide.buttonLink
                                                    }
                                                    tabIndex={
                                                        isActive
                                                            ? 0
                                                            : -1
                                                    }
                                                    className="mt-4 inline-flex min-h-10 items-center justify-center rounded-lg bg-[#D4A037] px-5 py-2 text-xs font-bold text-white shadow-md transition duration-300 hover:bg-[#E0AD43] sm:text-sm"
                                                >
                                                    {
                                                        slide.buttonText
                                                    }
                                                </Link>
                                            )}
                                    </div>
                                </div>
                            );
                        })}

                        {hasMultipleSlides && (
                            <>
                                <button
                                    type="button"
                                    onClick={previousSlide}
                                    aria-label={t(
                                        "previousSlide"
                                    )}
                                    className="absolute start-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-2xl text-white backdrop-blur-sm transition hover:bg-[#D4A037] sm:start-4 sm:h-11 sm:w-11"
                                >
                                    {isArabic ? (
                                        <MdKeyboardArrowRight />
                                    ) : (
                                        <MdKeyboardArrowLeft />
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={nextSlide}
                                    aria-label={t("nextSlide")}
                                    className="absolute end-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-2xl text-white backdrop-blur-sm transition hover:bg-[#D4A037] sm:end-4 sm:h-11 sm:w-11"
                                >
                                    {isArabic ? (
                                        <MdKeyboardArrowLeft />
                                    ) : (
                                        <MdKeyboardArrowRight />
                                    )}
                                </button>

                                <div
                                    dir="ltr"
                                    className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/25 px-3 py-2 backdrop-blur-sm sm:bottom-4"
                                >
                                    {slides.map(
                                        (slide, index) => (
                                            <button
                                                key={slide.id}
                                                type="button"
                                                onClick={() =>
                                                    setCurrentSlide(
                                                        index
                                                    )
                                                }
                                                aria-label={`${t(
                                                    "goToSlide"
                                                )} ${index + 1}`}
                                                aria-current={
                                                    currentSlide ===
                                                    index
                                                        ? "true"
                                                        : undefined
                                                }
                                                className={`h-2 rounded-full transition-all duration-300 ${
                                                    currentSlide ===
                                                    index
                                                        ? "w-7 bg-[#D4A037]"
                                                        : "w-2 bg-white/70 hover:bg-white"
                                                }`}
                                            />
                                        )
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="grid w-full grid-cols-2 gap-3 lg:hidden">
                    <Link
                        href="/collections/all"
                        className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-[#D4A037] px-2 py-3 text-center text-[12px] font-bold leading-tight text-white shadow-[0_10px_30px_rgba(212,160,55,0.28)] transition duration-300 hover:bg-[#E0AD43] min-[380px]:px-3 min-[380px]:text-[13px] sm:px-5 sm:text-sm"
                    >
                        {t("shopNow")}
                    </Link>

                    <Link
                        href="/collections"
                        className="inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-white/40 bg-white/5 px-2 py-3 text-center text-[12px] font-bold leading-tight text-white transition duration-300 hover:bg-white hover:text-[#731D46] min-[380px]:px-3 min-[380px]:text-[13px] sm:px-5 sm:text-sm"
                    >
                        {t("exploreCategories")}
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Hero;