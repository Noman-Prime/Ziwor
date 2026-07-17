"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import {
    MapPin,
    MessageCircleMore,
    Mail,
    ArrowUpRight,
    ShieldCheck,
    Truck,
    BadgeDollarSign,
} from "lucide-react";

const Footer = () => {
    const t = useTranslations("Footer");
    const locale = useLocale();
    const router = useRouter();

    const businessName =
        process.env.NEXT_PUBLIC_BUSINESS_NAME || "Ziwor Global Trading";
    const supportEmail =
        process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "";
    const whatsappNumber =
        process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
    const whatsappMessage =
        process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE || "";

    const whatsappUrl = whatsappNumber
        ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
            whatsappMessage
        )}`
        : "#";

    const navigateTo = (href) => {
        router.push(href);
    };

    const shopLinks = [
        {
            id: 1,
            title: t("shop.home"),
            href: "/",
        },
        {
            id: 2,
            title: t("shop.homeAccessories"),
            href: "/collections/home-accessories",
        },
        {
            id: 3,
            title: t("shop.crockery"),
            href: "/collections/crockery",
        },
        {
            id: 4,
            title: t("shop.electronics"),
            href: "/collections/electronics",
        },
        {
            id: 5,
            title: t("shop.healthBeauty"),
            href: "/collections/health-beauty",
        },
    ];

    const supportLinks = [
        {
            id: 1,
            title: t("support.trackOrder"),
            href: "/track-order",
        },
        {
            id: 2,
            title: t("support.returnsRefunds"),
            href: "/returns-refunds",
        },
        {
            id: 3,
            title: t("support.contactUs"),
            href: "/contact",
        },
    ];

    const features = [
        {
            id: 1,
            title: t("features.quality"),
            icon: ShieldCheck,
        },
        {
            id: 2,
            title: t("features.delivery"),
            icon: Truck,
        },
        {
            id: 3,
            title: t("features.prices"),
            icon: BadgeDollarSign,
        },
    ];

    return (
        <footer
            dir={locale === "ar" ? "rtl" : "ltr"}
            className="relative w-full overflow-hidden bg-[#260B19]"
        >
            <div className="pointer-events-none absolute -start-24 -top-24 hidden h-64 w-64 rounded-full bg-[#731D46]/20 blur-2xl lg:block" />
            <div className="pointer-events-none absolute -bottom-24 -end-24 hidden h-72 w-72 rounded-full bg-[#D4A037]/10 blur-2xl lg:block" />

            <div className="relative border-b border-white/10">
                <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-5 px-4 py-7 sm:px-6 sm:py-8 md:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10 xl:px-12">
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            onClick={() => navigateTo("/")}
                            aria-label={businessName}
                            className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white p-2 shadow-lg"
                        >
                            <Image
                                src="/logo.png"
                                alt={businessName}
                                width={56}
                                height={56}
                                className="h-full w-full object-contain"
                            />
                        </button>

                        <div>
                            <h2 className="text-xl font-black text-white sm:text-2xl">
                                {businessName}
                            </h2>

                            <p className="mt-1 max-w-xl text-xs leading-5 text-[#C8B5BD] sm:text-sm">
                                {t("description")}
                            </p>
                        </div>
                    </div>

                    <div className="flex w-full items-center justify-between gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-3 lg:w-auto lg:min-w-[430px] lg:px-5">
                        {features.map((item, index) => {
                            const Icon = item.icon;

                            return (
                                <div
                                    key={item.id}
                                    className={`flex min-w-0 flex-1 items-center justify-center gap-1.5 px-1 sm:gap-2 sm:px-3 ${index !== features.length - 1
                                            ? "border-e border-white/10"
                                            : ""
                                        }`}
                                >
                                    <Icon
                                        size={15}
                                        className="shrink-0 text-[#D4A037] sm:h-[17px] sm:w-[17px]"
                                    />

                                    <span className="truncate text-[9px] font-bold leading-none text-[#E2D5DA] sm:text-[11px] lg:text-xs">
                                        {item.title}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="relative mx-auto grid w-full max-w-[1440px] grid-cols-2 gap-x-6 gap-y-9 px-4 py-10 sm:px-6 md:px-8 lg:grid-cols-[1fr_1fr_1.2fr] lg:gap-12 lg:px-10 lg:py-12 xl:px-12">
                <div>
                    <h3 className="text-base font-extrabold text-white sm:text-lg">
                        {t("shop.title")}
                    </h3>

                    <span className="mt-2 block h-0.5 w-8 rounded-full bg-[#D4A037]" />

                    <div className="mt-5 flex flex-col gap-3">
                        {shopLinks.map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => navigateTo(item.href)}
                                className="group flex w-fit items-center gap-1.5 text-start text-xs leading-5 text-[#C8B5BD] transition duration-300 hover:text-white sm:text-sm"
                            >
                                <span>{item.title}</span>

                                <ArrowUpRight
                                    size={13}
                                    className={`opacity-0 transition duration-300 md:group-hover:opacity-100 ${locale === "ar"
                                            ? "rotate-[-90deg] md:group-hover:-translate-x-0.5"
                                            : "md:group-hover:translate-x-0.5 md:group-hover:-translate-y-0.5"
                                        }`}
                                />
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="text-base font-extrabold text-white sm:text-lg">
                        {t("support.title")}
                    </h3>

                    <span className="mt-2 block h-0.5 w-8 rounded-full bg-[#D4A037]" />

                    <div className="mt-5 flex flex-col gap-3">
                        {supportLinks.map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => navigateTo(item.href)}
                                className="group flex w-fit items-center gap-1.5 text-start text-xs leading-5 text-[#C8B5BD] transition duration-300 hover:text-white sm:text-sm"
                            >
                                <span>{item.title}</span>

                                <ArrowUpRight
                                    size={13}
                                    className={`opacity-0 transition duration-300 md:group-hover:opacity-100 ${locale === "ar"
                                            ? "rotate-[-90deg] md:group-hover:-translate-x-0.5"
                                            : "md:group-hover:translate-x-0.5 md:group-hover:-translate-y-0.5"
                                        }`}
                                />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="col-span-2 lg:col-span-1">
                    <h3 className="text-base font-extrabold text-white sm:text-lg">
                        {t("contact.title")}
                    </h3>

                    <span className="mt-2 block h-0.5 w-8 rounded-full bg-[#D4A037]" />

                    <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
                        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-[#C8B5BD]">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#D4A037]/10 text-[#D4A037]">
                                <MapPin size={17} />
                            </span>

                            <span className="text-xs sm:text-sm">
                                {t("contact.location")}
                            </span>
                        </div>

                        {supportEmail && (
                            <a
                                href={`mailto:${supportEmail}`}
                                className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-[#C8B5BD] transition duration-300 md:hover:border-[#D4A037]/40 md:hover:bg-[#D4A037]/10 md:hover:text-white"
                            >
                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#D4A037]/10 text-[#D4A037] transition duration-300 md:group-hover:bg-[#D4A037] md:group-hover:text-white">
                                    <Mail size={17} />
                                </span>

                                <div className="min-w-0">
                                    <span className="block text-[10px] font-semibold uppercase tracking-wider text-[#A9929C]">
                                        {t("contact.email")}
                                    </span>

                                    <span
                                        dir="ltr"
                                        className="block truncate text-xs text-[#E2D5DA] sm:text-sm"
                                    >
                                        {supportEmail}
                                    </span>
                                </div>
                            </a>
                        )}
                    </div>
                </div>
            </div>

            <div className="relative border-t border-white/10 bg-black/10">
                <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center justify-between gap-2 px-4 py-5 text-center sm:flex-row sm:px-6 sm:text-start md:px-8 lg:px-10 xl:px-12">
                    <p className="text-[11px] text-[#A9929C] sm:text-xs">
                        {t("copyright", { businessName })}
                    </p>

                    <p className="text-[11px] text-[#A9929C] sm:text-xs">
                        {t("poweredBy")}{" "}
                        <a
                            href="https://softrisehub.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold text-white transition duration-300 md:hover:text-[#D4A037] md:hover:underline"
                        >
                            SoftRiseHub
                        </a>
                    </p>
                </div>
            </div>

            {whatsappNumber && (
                <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t("contact.whatsapp")}
                    className={`fixed bottom-4 z-50 flex h-12 w-12 items-center justify-center rounded-full border-2 border-white/70 bg-[#25D366] text-white shadow-xl transition duration-300 md:hover:-translate-y-1 md:hover:scale-105 md:hover:bg-[#20BD5A] sm:bottom-6 sm:h-14 sm:w-14 ${locale === "ar"
                            ? "left-4 sm:left-6"
                            : "right-4 sm:right-6"
                        }`}
                >
                    <MessageCircleMore
                        size={24}
                        className="sm:h-7 sm:w-7"
                    />

                    <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#25D366]/20" />
                </a>
            )}
        </footer>
    );
};

export default Footer;