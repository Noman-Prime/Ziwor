"use client";

import { useEffect, useState } from "react";

const items = [
    {
        id: 1,
        icon: "🚚",
        text: "Fast Delivery across Qatar",
    },
    {
        id: 2,
        icon: "💵",
        text: "Cash on Delivery Available",
    },
    {
        id: 3,
        icon: "✨",
        text: "Quality Products • Affordable Prices",
    },
];

const TopBar = () => {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % items.length);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full bg-[#861E50] text-white">

            <div className="mx-auto flex min-h-10 max-w-7xl items-center justify-center px-4 sm:px-6 lg:px-8">

                <div className="flex w-full items-center justify-center md:hidden">

                    <div
                        key={items[current].id}
                        className="flex items-center justify-center gap-2 text-center"
                    >
                        <span className="text-base">
                            {items[current].icon}
                        </span>

                        <span className="text-xs font-semibold sm:text-sm">
                            {items[current].text}
                        </span>
                    </div>

                </div>

                <div className="hidden w-full items-center justify-center gap-8 md:flex lg:gap-12">

                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center gap-2 whitespace-nowrap"
                        >
                            <span className="text-base">
                                {item.icon}
                            </span>

                            <span className="text-sm font-medium">
                                {item.text}
                            </span>
                        </div>
                    ))}

                </div>

            </div>

        </div>
    );
};

export default TopBar;