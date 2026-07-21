"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useCart } from "@/context/CartContext";
import {
    MdKeyboardArrowLeft,
    MdKeyboardArrowRight,
} from "react-icons/md";

const Hero = ({ slides = [] }) => {
    const t = useTranslations("Hero");
    const locale = useLocale();
    const { buyNow, cartActionLoading } = useCart();

    const [currentSlide, setCurrentSlide] =
        useState(0);

    const isArabic = locale === "ar";
    const hasSlides = slides.length > 0;
    const hasMultipleSlides =
        slides.length > 1;

    const activeSlide =
        slides[currentSlide] || null;

    const activeBadge =
        activeSlide?.badgeText ||
        activeSlide?.badge ||
        t("badge");

    const activeTitle =
        activeSlide?.title ||
        t("titleLine1");

    const activeSubtitle =
        activeSlide?.subtitle ||
        t("description");

    const activeButtonText =
        activeSlide?.buttonText ||
        t("shopNow");

    const activeVariant =
        activeSlide?.product?.variant ||
        null;

    const buyNowDisabled =
        cartActionLoading ||
        !activeSlide?.product
            ?.availableForSale ||
        !activeVariant?.id ||
        !activeVariant?.availableForSale;

    useEffect(() => {
        if (!hasMultipleSlides) {
            return;
        }

        const sliderInterval =
            setInterval(() => {
                setCurrentSlide(
                    (previousSlide) =>
                        previousSlide ===
                            slides.length - 1
                            ? 0
                            : previousSlide + 1
                );
            }, 3000);

        return () =>
            clearInterval(sliderInterval);
    }, [
        hasMultipleSlides,
        slides.length,
    ]);

    useEffect(() => {
        if (
            !slides.length ||
            currentSlide >= slides.length
        ) {
            setCurrentSlide(0);
        }
    }, [
        currentSlide,
        slides.length,
    ]);

    const previousSlide = () => {
        if (!hasMultipleSlides) {
            return;
        }

        setCurrentSlide(
            (previousSlide) =>
                previousSlide === 0
                    ? slides.length - 1
                    : previousSlide - 1
        );
    };

    const nextSlide = () => {
        if (!hasMultipleSlides) {
            return;
        }

        setCurrentSlide(
            (previousSlide) =>
                previousSlide ===
                    slides.length - 1
                    ? 0
                    : previousSlide + 1
        );
    };

    const handleBuyNow = async () => {
        if (buyNowDisabled) {
            return;
        }

        try {
            await buyNow(
                activeVariant.id
            );
        } catch (error) {
            console.error(
                "Buy now failed:",
                error.message
            );
        }
    };

    return (
        <section
            dir={
                isArabic
                    ? "rtl"
                    : "ltr"
            }
            className="w-full overflow-hidden bg-[#731D46]"
        >
            <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 items-center gap-8 px-4 py-8 sm:px-6 sm:py-10 md:px-8 md:py-12 lg:grid-cols-2 lg:gap-12 lg:px-10 lg:py-16 xl:gap-16 xl:px-12 xl:py-20">
                <div className="flex min-w-0 flex-col">
                    <span className="inline-flex w-fit items-center rounded-full border border-[#E8BC62]/40 bg-[#D4A037] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-white shadow-[0_8px_30px_rgba(212,160,55,0.22)] sm:px-5 sm:py-2.5 sm:text-xs">
                        {activeBadge}
                    </span>

                    <h1
                        key={`title-${currentSlide}`}
                        className="mt-5 max-w-[700px] text-[34px] font-black leading-[1.05] tracking-[-0.035em] text-white transition-opacity duration-500 sm:text-[42px] md:text-[50px] lg:mt-6 lg:text-[52px] xl:text-[64px]"
                    >
                        {activeTitle}
                    </h1>

                    <div className="mt-5 h-1 w-20 rounded-full bg-[#D4A037] sm:w-24" />

                    <p
                        key={`subtitle-${currentSlide}`}
                        className="mt-5 max-w-[610px] text-sm leading-7 text-white/85 transition-opacity duration-500 sm:text-base sm:leading-8 md:text-lg"
                    >
                        {activeSubtitle}
                    </p>

                    <div className="mt-7 hidden flex-wrap items-center gap-3 sm:gap-4 lg:flex">
                        <button
                            type="button"
                            onClick={
                                handleBuyNow
                            }
                            disabled={
                                buyNowDisabled
                            }
                            className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#D4A037] px-7 py-3 text-sm font-bold text-white shadow-[0_10px_30px_rgba(212,160,55,0.28)] transition duration-300 disabled:cursor-not-allowed disabled:opacity-50 md:hover:-translate-y-0.5 md:hover:bg-[#E0AD43] md:hover:shadow-[0_14px_35px_rgba(212,160,55,0.36)] xl:px-8 xl:text-base"
                        >
                            {
                                activeButtonText
                            }
                        </button>

                        <Link
                            href="/collections"
                            className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/40 bg-white/5 px-7 py-3 text-sm font-bold text-white backdrop-blur-sm transition duration-300 hover:-translate-y-0.5 hover:border-white hover:bg-white hover:text-[#731D46] xl:px-8 xl:text-base"
                        >
                            {t(
                                "exploreCategories"
                            )}
                        </Link>
                    </div>
                </div>

                <div className="relative min-w-0">
                    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-white/15 bg-[#5E1739] shadow-2xl sm:aspect-[16/9] lg:aspect-[14/9] xl:h-[390px] xl:aspect-auto">
                        {!hasSlides && (
                            <div className="flex h-full w-full items-center justify-center px-5 text-center">
                                <p className="text-sm font-semibold text-white/70">
                                    {t(
                                        "noSlides"
                                    )}
                                </p>
                            </div>
                        )}

                        {slides.map(
                            (
                                slide,
                                index
                            ) => {
                                const desktopImage =
                                    slide
                                        .desktopImage
                                        ?.url;

                                const mobileImage =
                                    slide
                                        .mobileImage
                                        ?.url ||
                                    desktopImage;

                                const isActive =
                                    index ===
                                    currentSlide;

                                if (
                                    !desktopImage
                                ) {
                                    return null;
                                }

                                const desktopAlt =
                                    slide
                                        .desktopImage
                                        ?.altText ||
                                    slide.title ||
                                    "Ziwor slider image";

                                const mobileAlt =
                                    slide
                                        .mobileImage
                                        ?.altText ||
                                    slide
                                        .desktopImage
                                        ?.altText ||
                                    slide.title ||
                                    "Ziwor slider image";

                                return (
                                    <div
                                        key={
                                            slide.id ||
                                            index
                                        }
                                        aria-hidden={
                                            !isActive
                                        }
                                        className={`absolute inset-0 overflow-hidden transition-all duration-700 ease-in-out ${isActive
                                                ? "visible translate-x-0 opacity-100"
                                                : isArabic
                                                    ? "invisible -translate-x-full opacity-0"
                                                    : "invisible translate-x-full opacity-0"
                                            }`}
                                    >
                                        <div className="absolute inset-0 hidden overflow-hidden sm:block">
                                            <Image
                                                src={
                                                    desktopImage
                                                }
                                                alt=""
                                                fill
                                                priority={
                                                    index ===
                                                    0
                                                }
                                                sizes="(max-width: 1024px) 100vw, 50vw"
                                                aria-hidden="true"
                                                className="scale-110 object-cover opacity-45 blur-2xl"
                                            />

                                            <div className="absolute inset-0 bg-black/10" />

                                            <Image
                                                src={
                                                    desktopImage
                                                }
                                                alt={
                                                    desktopAlt
                                                }
                                                fill
                                                priority={
                                                    index ===
                                                    0
                                                }
                                                sizes="(max-width: 1024px) 100vw, 50vw"
                                                className="relative z-10 object-contain"
                                            />
                                        </div>

                                        <div className="absolute inset-0 overflow-hidden sm:hidden">
                                            <Image
                                                src={
                                                    mobileImage
                                                }
                                                alt=""
                                                fill
                                                priority={
                                                    index ===
                                                    0
                                                }
                                                sizes="100vw"
                                                aria-hidden="true"
                                                className="scale-110 object-cover opacity-45 blur-2xl"
                                            />

                                            <div className="absolute inset-0 bg-black/10" />

                                            <Image
                                                src={
                                                    mobileImage
                                                }
                                                alt={
                                                    mobileAlt
                                                }
                                                fill
                                                priority={
                                                    index ===
                                                    0
                                                }
                                                sizes="100vw"
                                                className="relative z-10 object-contain"
                                            />
                                        </div>
                                    </div>
                                );
                            }
                        )}

                        {hasMultipleSlides && (
                            <>
                                <button
                                    type="button"
                                    onClick={
                                        previousSlide
                                    }
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
                                    onClick={
                                        nextSlide
                                    }
                                    aria-label={t(
                                        "nextSlide"
                                    )}
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
                                        (
                                            slide,
                                            index
                                        ) => (
                                            <button
                                                key={
                                                    slide.id ||
                                                    index
                                                }
                                                type="button"
                                                onClick={() =>
                                                    setCurrentSlide(
                                                        index
                                                    )
                                                }
                                                aria-label={`${t(
                                                    "goToSlide"
                                                )} ${index +
                                                    1
                                                    }`}
                                                aria-current={
                                                    currentSlide ===
                                                        index
                                                        ? "true"
                                                        : undefined
                                                }
                                                className={`h-2 rounded-full transition-all duration-300 ${currentSlide ===
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
                    <button
                        type="button"
                        onClick={
                            handleBuyNow
                        }
                        disabled={
                            buyNowDisabled
                        }
                        className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-[#D4A037] px-2 py-3 text-center text-[12px] font-bold leading-tight text-white shadow-[0_10px_30px_rgba(212,160,55,0.28)] transition duration-300 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-[#E0AD43] min-[380px]:px-3 min-[380px]:text-[13px] sm:px-5 sm:text-sm"
                    >
                        {
                            activeButtonText
                        }
                    </button>

                    <Link
                        href="/collections"
                        className="inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-white/40 bg-white/5 px-2 py-3 text-center text-[12px] font-bold leading-tight text-white transition duration-300 hover:bg-white hover:text-[#731D46] min-[380px]:px-3 min-[380px]:text-[13px] sm:px-5 sm:text-sm"
                    >
                        {t(
                            "exploreCategories"
                        )}
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Hero;