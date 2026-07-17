"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { BadgeCheck, Wallet, Truck, Banknote } from "lucide-react";

const Features = () => {
    const t = useTranslations("Features");
    const locale = useLocale();
    const isArabic = locale === "ar";

    const [currentFeature, setCurrentFeature] = useState(0);

    const features = useMemo(
        () => [
            {
                id: 1,
                icon: BadgeCheck,
                title: t("items.qualityProducts.title"),
                subtitle: t("items.qualityProducts.subtitle"),
            },
            {
                id: 2,
                icon: Wallet,
                title: t("items.affordablePrices.title"),
                subtitle: t("items.affordablePrices.subtitle"),
            },
            {
                id: 3,
                icon: Truck,
                title: t("items.fastDelivery.title"),
                subtitle: t("items.fastDelivery.subtitle"),
            },
            {
                id: 4,
                icon: Banknote,
                title: t("items.cashOnDelivery.title"),
                subtitle: t("items.cashOnDelivery.subtitle"),
            },
        ],
        [t],
    );

    useEffect(() => {
        if (!features.length) return;

        const featureInterval = setInterval(() => {
            setCurrentFeature((previousFeature) => (previousFeature + 1) % features.length);
        }, 3000);

        return () => clearInterval(featureInterval);
    }, [features.length]);

    return (
        <section
            dir={isArabic ? "rtl" : "ltr"}
            className="w-full overflow-hidden bg-[#731D46]"
        >
            <div className="mx-auto w-full max-w-[1440px] px-4 py-5 sm:px-6 sm:py-6 md:px-8 lg:px-10 lg:py-7 xl:px-12">
                <div className="hidden grid-cols-4 lg:grid">
                    {features.map((item, index) => {
                        const Icon = item.icon;

                        return (
                            <div
                                key={item.id}
                                className={`group flex min-w-0 items-center justify-center gap-4 px-5 ${index !== 0 ? "border-s border-white/15" : ""
                                    }`}
                            >
                                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-[#D6A23B] transition-all duration-300 group-hover:scale-105 group-hover:bg-[#D6A23B] group-hover:text-white">
                                    <Icon size={27} strokeWidth={2.1} />
                                </span>

                                <div className="min-w-0">
                                    <h3 className="text-base font-extrabold leading-tight text-white xl:text-lg">
                                        {item.title}
                                    </h3>

                                    <p className="mt-1 text-xs leading-5 text-white/70 xl:text-sm">
                                        {item.subtitle}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="relative overflow-hidden lg:hidden">
                    <div
                        dir="ltr"
                        className="flex transition-transform duration-700 ease-in-out"
                        style={{
                            transform: `translateX(-${currentFeature * 100}%)`,
                        }}
                    >
                        {features.map((item) => {
                            const Icon = item.icon;

                            return (
                                <div
                                    key={item.id}
                                    dir={isArabic ? "rtl" : "ltr"}
                                    className="flex w-full shrink-0 items-center justify-center gap-4 px-3"
                                >
                                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-[#D6A23B] sm:h-14 sm:w-14">
                                        <Icon
                                            size={27}
                                            strokeWidth={2.1}
                                            className="sm:h-8 sm:w-8"
                                        />
                                    </span>

                                    <div className="min-w-0">
                                        <h3 className="text-base font-extrabold leading-tight text-white sm:text-lg">
                                            {item.title}
                                        </h3>

                                        <p className="mt-1 text-xs leading-5 text-white/70 sm:text-sm">
                                            {item.subtitle}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div
                        dir="ltr"
                        className="mt-4 flex items-center justify-center gap-2"
                    >
                        {features.map((item, index) => (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => setCurrentFeature(index)}
                                aria-label={`${t("goToFeature")} ${index + 1}`}
                                aria-current={
                                    currentFeature === index ? "true" : undefined
                                }
                                className={`h-1.5 rounded-full transition-all duration-300 ${currentFeature === index
                                        ? "w-6 bg-[#D6A23B]"
                                        : "w-1.5 bg-white/40 hover:bg-white/70"
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Features;