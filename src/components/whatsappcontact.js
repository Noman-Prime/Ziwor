"use client";

import { useLocale, useTranslations } from "next-intl";
import { MessageCircleMore, ArrowRight, ArrowLeft } from "lucide-react";

const WhatsAppBanner = () => {
    const t = useTranslations("WhatsAppBanner");
    const locale = useLocale();

    return (
        <section dir={locale === "ar" ? "rtl" : "ltr"} className="w-full bg-[#FCF8F6] py-8 sm:py-10 lg:py-14">
            <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#25D366] via-[#20C55C] to-[#18B454] px-5 py-6 shadow-[0_15px_40px_rgba(37,211,102,0.22)] sm:px-8 sm:py-8 lg:px-12 lg:py-10">
                    <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10 blur-xl lg:-right-10 lg:-top-10 lg:h-40 lg:w-40" />
                    <div className="absolute -left-8 -bottom-8 h-20 w-20 rounded-full bg-white/10 blur-lg lg:h-28 lg:w-28" />
                    <div className="relative flex flex-col items-center gap-6 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex flex-col items-center text-center lg:flex-row lg:items-center lg:gap-5 lg:text-start">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/15 backdrop-blur-md sm:h-16 sm:w-16 lg:h-20 lg:w-20">
                                <MessageCircleMore size={30} className="text-white lg:h-10 lg:w-10" />
                            </div>
                            <div className="mt-4 lg:mt-0">
                                <span className="inline-flex rounded-full bg-white/15 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white sm:text-xs">{t("badge")}</span>
                                <h2 className="mt-3 text-2xl font-black leading-tight text-white sm:text-3xl lg:text-5xl">{t("title")}</h2>
                                <p className="mt-2 max-w-2xl text-sm leading-6 text-white/90 sm:text-base lg:text-lg lg:leading-7">{t("description")}</p>
                            </div>
                        </div>
                        <a href="https://wa.me/97400000000" target="_blank" rel="noopener noreferrer" className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#1BAE50] shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-2xl lg:min-h-14 lg:px-7 lg:py-4 lg:text-base">
                            <MessageCircleMore size={20} />
                            <span>{t("button")}</span>
                            {locale === "ar" ? <ArrowLeft size={16} className="transition duration-300 group-hover:-translate-x-1" /> : <ArrowRight size={16} className="transition duration-300 group-hover:translate-x-1" />}
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhatsAppBanner;