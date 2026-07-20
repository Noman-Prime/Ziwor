"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const SaleCountdown = ({ promotion }) => {
    const [mounted, setMounted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(null);

    const calculateTimeLeft = () => {
        if (!promotion?.endDate) {
            return null;
        }

        const difference =
            new Date(promotion.endDate).getTime() - Date.now();

        if (difference <= 0) {
            return null;
        }

        return {
            days: Math.floor(
                difference / (1000 * 60 * 60 * 24)
            ),
            hours: Math.floor(
                (difference / (1000 * 60 * 60)) % 24
            ),
            minutes: Math.floor(
                (difference / (1000 * 60)) % 60
            ),
            seconds: Math.floor(
                (difference / 1000) % 60
            ),
        };
    };

    useEffect(() => {
        setMounted(true);
        setTimeLeft(calculateTimeLeft());

        const interval = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(interval);
    }, [promotion.endDate]);

    if (!mounted || !timeLeft) {
        return null;
    }

    const href = promotion.product?.handle
        ? `/products/${promotion.product.handle}`
        : promotion.collection?.handle
            ? `/collections/${promotion.collection.handle}`
            : null;

    const countdownItems = [
        {
            label: "Days",
            value: timeLeft.days,
        },
        {
            label: "Hours",
            value: timeLeft.hours,
        },
        {
            label: "Minutes",
            value: timeLeft.minutes,
        },
        {
            label: "Seconds",
            value: timeLeft.seconds,
        },
    ];

    return (
        <section
            className="w-full px-3 py-5 sm:px-4 sm:py-8"
            style={{
                backgroundColor:
                    promotion.backgroundColor || "#7A1749",
            }}
        >
            <div className="mx-auto grid max-w-6xl items-center gap-5 text-white md:grid-cols-2 md:gap-8">
                <div className="flex flex-col items-center text-center md:items-start md:text-left">
                    {promotion.heading && (
                        <h2 className="text-lg font-bold leading-tight sm:text-2xl lg:text-3xl">
                            {promotion.heading}
                        </h2>
                    )}

                    {promotion.description && (
                        <p className="mt-1.5 max-w-xl text-xs leading-5 text-white/80 sm:mt-2 sm:text-sm">
                            {promotion.description}
                        </p>
                    )}

                    <div className="mt-4 grid w-full max-w-[320px] grid-cols-4 gap-1.5 sm:mt-6 sm:max-w-md sm:gap-3">
                        {countdownItems.map((item) => (
                            <div
                                key={item.label}
                                className="flex min-w-0 flex-col items-center justify-center rounded-lg border border-white/20 bg-white/10 px-1 py-2 backdrop-blur-sm sm:rounded-xl sm:px-3 sm:py-4"
                            >
                                <span className="text-base font-bold leading-none sm:text-2xl">
                                    {String(item.value).padStart(
                                        2,
                                        "0"
                                    )}
                                </span>

                                <span className="mt-1 text-[8px] font-medium uppercase tracking-wide text-white/80 sm:mt-2 sm:text-[10px]">
                                    {item.label}
                                </span>
                            </div>
                        ))}
                    </div>

                    {promotion.buttonText && href && (
                        <Link
                            href={href}
                            className="mt-4 inline-flex min-h-9 items-center justify-center rounded-md bg-white px-5 py-2 text-xs font-semibold text-[#7A1749] shadow-sm transition hover:bg-[#F8E8EF] sm:mt-6 sm:min-h-11 sm:rounded-lg sm:px-7 sm:py-3 sm:text-sm"
                        >
                            {promotion.buttonText}
                        </Link>
                    )}
                </div>

                {promotion.image?.url && (
                    <div className="relative mx-auto aspect-[16/10] w-full max-w-md overflow-hidden rounded-xl md:max-w-none">
                        <Image
                            src={promotion.image.url}
                            alt={
                                promotion.image.altText ||
                                promotion.heading ||
                                promotion.title ||
                                "Promotion image"
                            }
                            fill
                            unoptimized
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover"
                        />
                    </div>
                )}
            </div>
        </section>
    );
};

export default SaleCountdown;