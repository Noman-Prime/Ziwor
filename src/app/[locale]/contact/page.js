"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
    MapPin,
    Mail,
    MessageCircleMore,
    Clock3,
    Send,
    User,
    Phone,
    Tag,
    MessageSquareText,
    CheckCircle2,
} from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const ContactPage = () => {
    const t = useTranslations("ContactPage");
    const locale = useLocale();
    const isArabic = locale.toLowerCase().startsWith("ar");

    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    });

    const supportEmail =
        process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "";

    const whatsappNumber = (
        process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ""
    ).replace(/\D/g, "");

    const whatsappMessage =
        process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE || "";

    const locationUrl =
        process.env.NEXT_PUBLIC_LOCATION_URL ||
        "https://maps.google.com/?q=Doha,Qatar";

    const whatsappUrl = whatsappNumber
        ? `https://wa.me/${whatsappNumber}${whatsappMessage
            ? `?text=${encodeURIComponent(whatsappMessage)}`
            : ""
        }`
        : "";

    const whatsappDisplayNumber = whatsappNumber
        ? `+${whatsappNumber}`
        : t("cards.whatsapp.value");

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setSubmitted(false);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setSubmitted(false);

        await new Promise((resolve) => setTimeout(resolve, 1000));

        setFormData({
            name: "",
            email: "",
            phone: "",
            subject: "",
            message: "",
        });

        setLoading(false);
        setSubmitted(true);
    };

    const contactItems = [
        {
            id: 1,
            title: t("cards.location.title"),
            value: t("cards.location.value"),
            href: locationUrl,
            external: true,
            direction: undefined,
            icon: MapPin,
            color: "bg-[#D4A037]/10 text-[#D4A037]",
        },
        {
            id: 2,
            title: t("cards.whatsapp.title"),
            value: whatsappDisplayNumber,
            href: whatsappUrl,
            external: true,
            direction: "ltr",
            icon: MessageCircleMore,
            color: "bg-[#25D366]/10 text-[#25D366]",
        },
        {
            id: 3,
            title: t("cards.email.title"),
            value: supportEmail || t("cards.email.value"),
            href: supportEmail ? `mailto:${supportEmail}` : "",
            external: false,
            direction: "ltr",
            icon: Mail,
            color: "bg-[#731D46]/10 text-[#731D46]",
        },
        {
            id: 4,
            title: t("cards.hours.title"),
            value: t("cards.hours.value"),
            href: "",
            external: false,
            direction: undefined,
            icon: Clock3,
            color: "bg-[#D4A037]/10 text-[#D4A037]",
        },
    ];

    return (
        <>
            <Navbar />

            <main
                dir={isArabic ? "rtl" : "ltr"}
                className="w-full bg-[#FCF8F6]"
            >
                <section className="relative overflow-hidden bg-[#731D46]">
                    <div className="pointer-events-none absolute -start-24 -top-24 hidden h-72 w-72 rounded-full bg-white/10 blur-3xl lg:block" />

                    <div className="pointer-events-none absolute -bottom-28 -end-24 hidden h-80 w-80 rounded-full bg-[#D4A037]/20 blur-3xl lg:block" />

                    <div className="relative mx-auto flex min-h-[270px] w-full max-w-[1440px] flex-col items-center justify-center px-4 py-14 text-center sm:min-h-[320px] sm:px-6 md:px-8 lg:min-h-[360px] lg:px-10 xl:px-12">
                        <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-white sm:text-xs">
                            {t("badge")}
                        </span>

                        <h1 className="mt-5 max-w-3xl text-[36px] font-black leading-tight tracking-[-0.035em] text-white sm:text-[46px] md:text-[56px] lg:text-[64px]">
                            {t("title")}
                        </h1>

                        <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80 sm:text-base md:text-lg">
                            {t("description")}
                        </p>
                    </div>
                </section>

                <section className="w-full py-10 sm:py-12 md:py-14 lg:py-20">
                    <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-10 xl:gap-14">
                            <div>
                                <span className="inline-flex rounded-full border border-[#731D46]/10 bg-[#F3E5EA] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#731D46] sm:text-xs">
                                    {t("info.badge")}
                                </span>

                                <h2 className="mt-4 text-[30px] font-black leading-tight tracking-[-0.03em] text-[#2B1D1D] sm:text-[38px] lg:text-[46px]">
                                    {t("info.title")}
                                </h2>

                                <p className="mt-4 max-w-xl text-sm leading-7 text-[#74666A] sm:text-base">
                                    {t("info.description")}
                                </p>

                                <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                                    {contactItems.map((item) => {
                                        const Icon = item.icon;

                                        const content = (
                                            <>
                                                <span
                                                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${item.color}`}
                                                >
                                                    <Icon
                                                        size={20}
                                                        strokeWidth={2.1}
                                                    />
                                                </span>

                                                <span className="min-w-0">
                                                    <span className="block text-xs font-bold uppercase tracking-[0.08em] text-[#A28E96]">
                                                        {item.title}
                                                    </span>

                                                    <span
                                                        dir={item.direction}
                                                        className="mt-1 block truncate text-sm font-extrabold text-[#2B1D1D] sm:text-[15px]"
                                                    >
                                                        {item.value}
                                                    </span>
                                                </span>
                                            </>
                                        );

                                        return item.href ? (
                                            <a
                                                key={item.id}
                                                href={item.href}
                                                target={
                                                    item.external
                                                        ? "_blank"
                                                        : undefined
                                                }
                                                rel={
                                                    item.external
                                                        ? "noopener noreferrer"
                                                        : undefined
                                                }
                                                className="flex items-center gap-3 rounded-2xl border border-[#E8DDE1] bg-white p-4 shadow-sm transition duration-300 md:hover:-translate-y-1 md:hover:border-[#D4A037]/60 md:hover:shadow-lg"
                                            >
                                                {content}
                                            </a>
                                        ) : (
                                            <div
                                                key={item.id}
                                                className="flex items-center gap-3 rounded-2xl border border-[#E8DDE1] bg-white p-4 shadow-sm"
                                            >
                                                {content}
                                            </div>
                                        );
                                    })}
                                </div>

                                {whatsappUrl && (
                                    <div className="mt-6 rounded-2xl border border-[#25D366]/20 bg-[#25D366]/5 p-5 sm:p-6">
                                        <div className="flex items-start gap-4">
                                            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#25D366] text-white">
                                                <MessageCircleMore size={24} />
                                            </span>

                                            <div>
                                                <h3 className="text-lg font-black text-[#2B1D1D]">
                                                    {t("whatsapp.title")}
                                                </h3>

                                                <p className="mt-2 text-sm leading-6 text-[#74666A]">
                                                    {t(
                                                        "whatsapp.description"
                                                    )}
                                                </p>

                                                <a
                                                    href={whatsappUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 text-sm font-bold text-white transition duration-300 md:hover:-translate-y-0.5 md:hover:bg-[#20BD5A]"
                                                >
                                                    <MessageCircleMore
                                                        size={18}
                                                    />

                                                    <span>
                                                        {t(
                                                            "whatsapp.button"
                                                        )}
                                                    </span>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="rounded-3xl border border-[#E8DDE1] bg-white p-5 shadow-[0_16px_50px_rgba(62,28,43,0.08)] sm:p-7 lg:p-8">
                                <div>
                                    <span className="inline-flex rounded-full bg-[#F3E5EA] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#731D46] sm:text-xs">
                                        {t("form.badge")}
                                    </span>

                                    <h2 className="mt-4 text-[27px] font-black leading-tight text-[#2B1D1D] sm:text-[34px]">
                                        {t("form.title")}
                                    </h2>

                                    <p className="mt-2 text-sm leading-6 text-[#74666A] sm:text-base">
                                        {t("form.description")}
                                    </p>
                                </div>

                                {submitted && (
                                    <div
                                        role="status"
                                        className="mt-6 flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 p-4 text-green-700"
                                    >
                                        <CheckCircle2
                                            size={21}
                                            className="mt-0.5 shrink-0"
                                        />

                                        <div>
                                            <h3 className="text-sm font-extrabold">
                                                {t("success.title")}
                                            </h3>

                                            <p className="mt-1 text-xs leading-5 sm:text-sm">
                                                {t(
                                                    "success.description"
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <form
                                    onSubmit={handleSubmit}
                                    className="mt-7"
                                >
                                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                        <div>
                                            <label
                                                htmlFor="name"
                                                className="mb-2 block text-sm font-bold text-[#2B1D1D]"
                                            >
                                                {t("form.name")}
                                            </label>

                                            <div className="relative">
                                                <User
                                                    size={18}
                                                    className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-[#A58D97]"
                                                />

                                                <input
                                                    id="name"
                                                    name="name"
                                                    type="text"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    required
                                                    autoComplete="name"
                                                    placeholder={t(
                                                        "form.namePlaceholder"
                                                    )}
                                                    className="min-h-12 w-full rounded-xl border border-[#E1CDD5] bg-[#FCFAFB] py-3 ps-11 pe-4 text-sm text-[#2B1D1D] outline-none transition placeholder:text-[#B3A2A9] focus:border-[#731D46] focus:bg-white"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="email"
                                                className="mb-2 block text-sm font-bold text-[#2B1D1D]"
                                            >
                                                {t("form.email")}
                                            </label>

                                            <div className="relative">
                                                <Mail
                                                    size={18}
                                                    className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-[#A58D97]"
                                                />

                                                <input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    required
                                                    autoComplete="email"
                                                    inputMode="email"
                                                    placeholder={t(
                                                        "form.emailPlaceholder"
                                                    )}
                                                    className="min-h-12 w-full rounded-xl border border-[#E1CDD5] bg-[#FCFAFB] py-3 ps-11 pe-4 text-sm text-[#2B1D1D] outline-none transition placeholder:text-[#B3A2A9] focus:border-[#731D46] focus:bg-white"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="phone"
                                                className="mb-2 block text-sm font-bold text-[#2B1D1D]"
                                            >
                                                {t("form.phone")}
                                            </label>

                                            <div className="relative">
                                                <Phone
                                                    size={18}
                                                    className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-[#A58D97]"
                                                />

                                                <input
                                                    id="phone"
                                                    name="phone"
                                                    type="tel"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    autoComplete="tel"
                                                    inputMode="tel"
                                                    dir="ltr"
                                                    placeholder={t(
                                                        "form.phonePlaceholder"
                                                    )}
                                                    className="min-h-12 w-full rounded-xl border border-[#E1CDD5] bg-[#FCFAFB] py-3 ps-11 pe-4 text-sm text-[#2B1D1D] outline-none transition placeholder:text-[#B3A2A9] focus:border-[#731D46] focus:bg-white"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="subject"
                                                className="mb-2 block text-sm font-bold text-[#2B1D1D]"
                                            >
                                                {t("form.subject")}
                                            </label>

                                            <div className="relative">
                                                <Tag
                                                    size={18}
                                                    className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-[#A58D97]"
                                                />

                                                <input
                                                    id="subject"
                                                    name="subject"
                                                    type="text"
                                                    value={formData.subject}
                                                    onChange={handleChange}
                                                    required
                                                    placeholder={t(
                                                        "form.subjectPlaceholder"
                                                    )}
                                                    className="min-h-12 w-full rounded-xl border border-[#E1CDD5] bg-[#FCFAFB] py-3 ps-11 pe-4 text-sm text-[#2B1D1D] outline-none transition placeholder:text-[#B3A2A9] focus:border-[#731D46] focus:bg-white"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-5">
                                        <label
                                            htmlFor="message"
                                            className="mb-2 block text-sm font-bold text-[#2B1D1D]"
                                        >
                                            {t("form.message")}
                                        </label>

                                        <div className="relative">
                                            <MessageSquareText
                                                size={18}
                                                className="pointer-events-none absolute start-4 top-4 text-[#A58D97]"
                                            />

                                            <textarea
                                                id="message"
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                required
                                                rows={6}
                                                placeholder={t(
                                                    "form.messagePlaceholder"
                                                )}
                                                className="w-full resize-none rounded-xl border border-[#E1CDD5] bg-[#FCFAFB] py-3.5 ps-11 pe-4 text-sm leading-6 text-[#2B1D1D] outline-none transition placeholder:text-[#B3A2A9] focus:border-[#731D46] focus:bg-white"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#731D46] px-6 py-3 text-sm font-extrabold text-white transition duration-300 disabled:cursor-not-allowed disabled:opacity-70 md:hover:-translate-y-0.5 md:hover:bg-[#D4A037] sm:w-auto sm:min-w-[180px]"
                                    >
                                        <Send
                                            size={18}
                                            className={
                                                isArabic
                                                    ? "-rotate-90"
                                                    : ""
                                            }
                                        />

                                        <span>
                                            {loading
                                                ? t("form.sending")
                                                : t("form.submit")}
                                        </span>
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
};

export default ContactPage;