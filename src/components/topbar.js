"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

const TopBar = () => {
    const [current, setCurrent] = useState(0);
    const t = useTranslations("TopBar");

    const items = [
        { id: 1, icon: "🚚", text: t("fastDelivery") },
        { id: 2, icon: "⚡", text: t("sameDayDelivery") },
        { id: 3, icon: "💵", text: t("cashOnDelivery") },
        { id: 4, icon: "✨", text: t("qualityProducts") }
    ];

    useEffect(() => {
        const intervalId = window.setInterval(() => {
            setCurrent((previous) => (previous + 1) % items.length);
        }, 3000);

        return () => window.clearInterval(intervalId);
    }, [items.length]);

    const currentItem = items[current] ?? items[0];

    return (
        <div className="w-full bg-[#861E50] text-white">
            <div className="mx-auto flex min-h-10 max-w-7xl items-center justify-center px-4 sm:px-6 lg:px-8">
                <div
                    className="flex w-full items-center justify-center md:hidden"
                    aria-live="polite"
                    aria-atomic="true"
                >
                    <div
                        key={`${currentItem.id}-${currentItem.text}`}
                        className="flex items-center justify-center gap-2 text-center"
                    >
                        <span className="text-base" aria-hidden="true">
                            {currentItem.icon}
                        </span>
                        <span className="text-xs font-semibold sm:text-sm">
                            {currentItem.text}
                        </span>
                    </div>
                </div>

                <div className="hidden w-full items-center justify-center gap-8 md:flex lg:gap-12">
                    {items.map(({ id, icon, text }) => (
                        <div
                            key={id}
                            className="flex items-center gap-2 whitespace-nowrap"
                        >
                            <span className="text-base" aria-hidden="true">
                                {icon}
                            </span>
                            <span className="text-sm font-medium">{text}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TopBar;