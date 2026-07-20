"use client";

import { useEffect, useMemo, useState } from "react";
import SaleCountdown from "@/components/promotions/sale-countdown";

const HomepagePromotions = ({
    promotions = [],
    location,
    locale = "en",
}) => {
    const [activeIndex, setActiveIndex] = useState(0);

    const visiblePromotions = useMemo(() => {
        return promotions
            .filter((promotion) => promotion?.enabled)
            .filter(
                (promotion) =>
                    promotion?.displayLocation?.trim().toLowerCase() ===
                    location?.trim().toLowerCase()
            )
            .filter(
                (promotion) =>
                    promotion?.promotionType?.trim().toLowerCase() ===
                    "countdown"
            )
            .sort(
                (first, second) =>
                    Number(first?.position || 0) -
                    Number(second?.position || 0)
            );
    }, [promotions, location]);

    useEffect(() => {
        if (activeIndex >= visiblePromotions.length) {
            setActiveIndex(0);
        }
    }, [activeIndex, visiblePromotions.length]);

    useEffect(() => {
        if (visiblePromotions.length <= 1) {
            return;
        }

        const sliderInterval = setInterval(() => {
            setActiveIndex(
                (previousIndex) =>
                    (previousIndex + 1) % visiblePromotions.length
            );
        }, 5000);

        return () => clearInterval(sliderInterval);
    }, [visiblePromotions.length]);

    if (visiblePromotions.length === 0) {
        return null;
    }

    if (visiblePromotions.length === 1) {
        return (
            <SaleCountdown
                promotion={visiblePromotions[0]}
                locale={locale}
            />
        );
    }

    const activePromotion =
        visiblePromotions[
        Math.min(activeIndex, visiblePromotions.length - 1)
        ];

    return (
        <section className="relative w-full overflow-hidden">
            <div
                key={activePromotion.id}
                className="promotion-slide"
            >
                <SaleCountdown
                    promotion={activePromotion}
                    locale={locale}
                />
            </div>

            <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
                {visiblePromotions.map((promotion, index) => (
                    <button
                        key={promotion.id}
                        type="button"
                        aria-label={`Show promotion ${index + 1}`}
                        onClick={() => setActiveIndex(index)}
                        className={`h-2 rounded-full border border-white/40 transition-all duration-300 ${index === activeIndex
                                ? "w-6 bg-white"
                                : "w-2 bg-white/50 hover:bg-white/80"
                            }`}
                    />
                ))}
            </div>

            <style jsx>{`
        .promotion-slide {
          animation: promotionSlide 500ms ease-in-out;
        }

        @keyframes promotionSlide {
          from {
            opacity: 0;
            transform: translateX(30px);
          }

          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
        </section>
    );
};

export default HomepagePromotions;