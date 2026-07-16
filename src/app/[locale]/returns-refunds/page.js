"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { ArrowLeft, ArrowRight, BadgeCheck, Box, CheckCircle2, ChevronDown, CircleAlert, Clock3, CreditCard, FileText, PackageCheck, RefreshCcw, RotateCcw, ShieldCheck, Truck, XCircle } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const ReturnsRefundsPage = () => {
    const t = useTranslations("ReturnsRefundsPage");
    const locale = useLocale();
    const router = useRouter();
    const [activeQuestion, setActiveQuestion] = useState(null);

    const navigateTo = (href) => {
        router.push(href);
    };

    const policyItems = [
        {
            id: 1,
            title: t("policy.returnWindow.title"),
            description: t("policy.returnWindow.description"),
            icon: Clock3,
        },
        {
            id: 2,
            title: t("policy.productCondition.title"),
            description: t("policy.productCondition.description"),
            icon: Box,
        },
        {
            id: 3,
            title: t("policy.proofOfPurchase.title"),
            description: t("policy.proofOfPurchase.description"),
            icon: FileText,
        },
        {
            id: 4,
            title: t("policy.refundMethod.title"),
            description: t("policy.refundMethod.description"),
            icon: CreditCard,
        },
    ];

    const steps = [
        {
            id: 1,
            number: "01",
            title: t("steps.contact.title"),
            description: t("steps.contact.description"),
            icon: CircleAlert,
        },
        {
            id: 2,
            number: "02",
            title: t("steps.review.title"),
            description: t("steps.review.description"),
            icon: BadgeCheck,
        },
        {
            id: 3,
            number: "03",
            title: t("steps.return.title"),
            description: t("steps.return.description"),
            icon: Truck,
        },
        {
            id: 4,
            number: "04",
            title: t("steps.refund.title"),
            description: t("steps.refund.description"),
            icon: RefreshCcw,
        },
    ];

    const eligibleItems = [
        {
            id: 1,
            text: t("eligibility.accepted.unused"),
        },
        {
            id: 2,
            text: t("eligibility.accepted.packaging"),
        },
        {
            id: 3,
            text: t("eligibility.accepted.receipt"),
        },
        {
            id: 4,
            text: t("eligibility.accepted.damaged"),
        },
    ];

    const excludedItems = [
        {
            id: 1,
            text: t("eligibility.excluded.used"),
        },
        {
            id: 2,
            text: t("eligibility.excluded.personalCare"),
        },
        {
            id: 3,
            text: t("eligibility.excluded.clearance"),
        },
        {
            id: 4,
            text: t("eligibility.excluded.missingParts"),
        },
    ];

    const questions = [
        {
            id: 1,
            question: t("faq.items.time.question"),
            answer: t("faq.items.time.answer"),
        },
        {
            id: 2,
            question: t("faq.items.delivery.question"),
            answer: t("faq.items.delivery.answer"),
        },
        {
            id: 3,
            question: t("faq.items.exchange.question"),
            answer: t("faq.items.exchange.answer"),
        },
        {
            id: 4,
            question: t("faq.items.damaged.question"),
            answer: t("faq.items.damaged.answer"),
        },
        {
            id: 5,
            question: t("faq.items.shipping.question"),
            answer: t("faq.items.shipping.answer"),
        },
    ];

    return (
        <>
            <Navbar />
            <main dir={locale === "ar" ? "rtl" : "ltr"} className="w-full bg-[#FCF8F6]">
                <section className="relative overflow-hidden bg-[#731D46]">
                    <div className="pointer-events-none absolute -start-24 -top-24 hidden h-72 w-72 rounded-full bg-white/10 blur-3xl lg:block" />
                    <div className="pointer-events-none absolute -bottom-28 -end-24 hidden h-80 w-80 rounded-full bg-[#D4A037]/20 blur-3xl lg:block" />
                    <div className="relative mx-auto flex min-h-[270px] w-full max-w-[1440px] flex-col items-center justify-center px-4 py-14 text-center sm:min-h-[320px] sm:px-6 md:px-8 lg:min-h-[360px] lg:px-10 xl:px-12">
                        <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-white sm:text-xs">{t("badge")}</span>
                        <h1 className="mt-5 max-w-4xl text-[36px] font-black leading-tight tracking-[-0.035em] text-white sm:text-[46px] md:text-[56px] lg:text-[64px]">{t("title")}</h1>
                        <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80 sm:text-base md:text-lg">{t("description")}</p>
                    </div>
                </section>
                <section className="w-full py-10 sm:py-12 md:py-14 lg:py-20">
                    <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
                        <div className="mx-auto max-w-3xl text-center">
                            <span className="inline-flex rounded-full border border-[#731D46]/10 bg-[#F3E5EA] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#731D46] sm:text-xs">{t("policy.badge")}</span>
                            <h2 className="mt-4 text-[30px] font-black leading-tight tracking-[-0.03em] text-[#2B1D1D] sm:text-[38px] lg:text-[46px]">{t("policy.title")}</h2>
                            <p className="mt-3 text-sm leading-7 text-[#74666A] sm:text-base">{t("policy.description")}</p>
                        </div>
                        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-10 lg:grid-cols-4 lg:gap-6">
                            {policyItems.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <div key={item.id} className="rounded-2xl border border-[#E8DDE1] bg-white p-5 shadow-sm transition duration-300 md:hover:-translate-y-1 md:hover:border-[#D4A037]/60 md:hover:shadow-lg">
                                        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F3E5EA] text-[#731D46]">
                                            <Icon size={22} strokeWidth={2.1} />
                                        </span>
                                        <h3 className="mt-4 text-lg font-black text-[#2B1D1D]">{item.title}</h3>
                                        <p className="mt-2 text-sm leading-6 text-[#74666A]">{item.description}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
                <section className="w-full bg-white py-10 sm:py-12 md:py-14 lg:py-20">
                    <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-12">
                            <div>
                                <span className="inline-flex rounded-full bg-[#F3E5EA] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#731D46] sm:text-xs">{t("steps.badge")}</span>
                                <h2 className="mt-4 text-[30px] font-black leading-tight tracking-[-0.03em] text-[#2B1D1D] sm:text-[38px] lg:text-[46px]">{t("steps.title")}</h2>
                                <p className="mt-4 max-w-xl text-sm leading-7 text-[#74666A] sm:text-base">{t("steps.description")}</p>
                                <div className="mt-6 rounded-2xl border border-[#D4A037]/20 bg-[#D4A037]/5 p-5">
                                    <div className="flex items-start gap-3">
                                        <ShieldCheck size={22} className="mt-0.5 shrink-0 text-[#D4A037]" />
                                        <div>
                                            <h3 className="text-base font-black text-[#2B1D1D]">{t("steps.note.title")}</h3>
                                            <p className="mt-1 text-sm leading-6 text-[#74666A]">{t("steps.note.description")}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                {steps.map((item) => {
                                    const Icon = item.icon;

                                    return (
                                        <div key={item.id} className="relative overflow-hidden rounded-2xl border border-[#E8DDE1] bg-[#FCFAFB] p-5">
                                            <span className="absolute end-4 top-3 text-4xl font-black text-[#731D46]/5">{item.number}</span>
                                            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#731D46] text-white">
                                                <Icon size={20} />
                                            </span>
                                            <h3 className="mt-4 text-lg font-black text-[#2B1D1D]">{item.title}</h3>
                                            <p className="mt-2 text-sm leading-6 text-[#74666A]">{item.description}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </section>
                <section className="w-full py-10 sm:py-12 md:py-14 lg:py-20">
                    <div className="mx-auto grid w-full max-w-[1200px] grid-cols-1 gap-6 px-4 sm:px-6 md:px-8 lg:grid-cols-2">
                        <div className="rounded-3xl border border-green-200 bg-white p-5 shadow-sm sm:p-7">
                            <div className="flex items-center gap-3">
                                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-green-600">
                                    <CheckCircle2 size={24} />
                                </span>
                                <div>
                                    <span className="text-xs font-bold uppercase tracking-[0.1em] text-green-600">{t("eligibility.accepted.badge")}</span>
                                    <h2 className="mt-1 text-xl font-black text-[#2B1D1D]">{t("eligibility.accepted.title")}</h2>
                                </div>
                            </div>
                            <div className="mt-6 space-y-4">
                                {eligibleItems.map((item) => (
                                    <div key={item.id} className="flex items-start gap-3">
                                        <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-green-600" />
                                        <p className="text-sm leading-6 text-[#74666A]">{item.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="rounded-3xl border border-red-200 bg-white p-5 shadow-sm sm:p-7">
                            <div className="flex items-center gap-3">
                                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                                    <XCircle size={24} />
                                </span>
                                <div>
                                    <span className="text-xs font-bold uppercase tracking-[0.1em] text-red-500">{t("eligibility.excluded.badge")}</span>
                                    <h2 className="mt-1 text-xl font-black text-[#2B1D1D]">{t("eligibility.excluded.title")}</h2>
                                </div>
                            </div>
                            <div className="mt-6 space-y-4">
                                {excludedItems.map((item) => (
                                    <div key={item.id} className="flex items-start gap-3">
                                        <XCircle size={18} className="mt-0.5 shrink-0 text-red-500" />
                                        <p className="text-sm leading-6 text-[#74666A]">{item.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
                <section className="w-full bg-white py-10 sm:py-12 md:py-14 lg:py-20">
                    <div className="mx-auto w-full max-w-[1000px] px-4 sm:px-6 md:px-8">
                        <div className="mx-auto max-w-2xl text-center">
                            <span className="inline-flex rounded-full bg-[#F3E5EA] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#731D46] sm:text-xs">{t("faq.badge")}</span>
                            <h2 className="mt-4 text-[30px] font-black leading-tight text-[#2B1D1D] sm:text-[38px] lg:text-[46px]">{t("faq.title")}</h2>
                            <p className="mt-3 text-sm leading-7 text-[#74666A] sm:text-base">{t("faq.description")}</p>
                        </div>
                        <div className="mt-8 space-y-3">
                            {questions.map((item) => {
                                const isActive = activeQuestion === item.id;

                                return (
                                    <div key={item.id} className="overflow-hidden rounded-2xl border border-[#E8DDE1] bg-[#FCFAFB]">
                                        <button type="button" onClick={() => setActiveQuestion(isActive ? null : item.id)} className="flex w-full items-center justify-between gap-4 px-4 py-4 text-start sm:px-5 sm:py-5">
                                            <span className="text-sm font-extrabold text-[#2B1D1D] sm:text-base">{item.question}</span>
                                            <ChevronDown size={19} className={`shrink-0 text-[#731D46] transition duration-300 ${isActive ? "rotate-180" : ""}`} />
                                        </button>
                                        <div className={`grid transition-all duration-300 ${isActive ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                                            <div className="overflow-hidden">
                                                <p className="border-t border-[#E8DDE1] px-4 py-4 text-sm leading-6 text-[#74666A] sm:px-5">{item.answer}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
                <section className="w-full py-10 sm:py-12 lg:py-16">
                    <div className="mx-auto w-full max-w-[1100px] px-4 sm:px-6 md:px-8">
                        <div className="rounded-3xl bg-[#731D46] px-5 py-8 text-center sm:px-8 sm:py-10 lg:px-12">
                            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-white">
                                <RotateCcw size={26} />
                            </span>
                            <h2 className="mt-5 text-[27px] font-black leading-tight text-white sm:text-[34px]">{t("cta.title")}</h2>
                            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">{t("cta.description")}</p>
                            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                                <button type="button" onClick={() => navigateTo("/contact")} className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#D4A037] px-6 py-3 text-sm font-bold text-white transition duration-300 md:hover:-translate-y-0.5 md:hover:bg-[#E0AD43]">{t("cta.contact")}</button>
                                <button type="button" onClick={() => navigateTo("/track-order")} className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/5 px-6 py-3 text-sm font-bold text-white transition duration-300 md:hover:bg-white md:hover:text-[#731D46]">
                                    <span>{t("cta.track")}</span>
                                    {locale === "ar" ? <ArrowLeft size={17} className="transition md:group-hover:-translate-x-1" /> : <ArrowRight size={17} className="transition md:group-hover:translate-x-1" />}
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
};

export default ReturnsRefundsPage;