"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useCustomer } from "@/context/CustomerContext";
import {
    ArrowLeft,
    ArrowRight,
    Check,
    CheckCircle2,
    LoaderCircle,
    LockKeyhole,
    MailCheck,
    ShoppingBag,
    UserPlus
} from "lucide-react";

const SignupPage = () => {
    const t = useTranslations("SignupPage");
    const locale = useLocale();
    const router = useRouter();
    const { authenticated, customer, loading, signup } = useCustomer();

    const [redirecting, setRedirecting] = useState(false);
    const [authError, setAuthError] = useState("");

    const isArabic = locale === "ar";

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const error = searchParams.get("error");

        if (error) {
            setAuthError(t("errors.authentication"));
        }
    }, [t]);

    const handleSignup = async () => {
        setRedirecting(true);
        setAuthError("");

        try {
            await signup(locale, `/${locale}`);
        } catch {
            setRedirecting(false);
            setAuthError(t("errors.authentication"));
        }
    };

    const navigateTo = (href) => {
        router.push(href);
    };

    if (loading) {
        return (
            <main
                dir={isArabic ? "rtl" : "ltr"}
                className="flex min-h-screen items-center justify-center bg-[#FCF8F6] px-4"
            >
                <div className="text-center">
                    <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
                        <LoaderCircle
                            size={28}
                            className="animate-spin text-[#731D46]"
                        />
                    </span>

                    <h1 className="mt-5 text-xl font-black text-[#2B1D1D] sm:text-2xl">
                        {t("loading.title")}
                    </h1>

                    <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#74666A]">
                        {t("loading.description")}
                    </p>
                </div>
            </main>
        );
    }

    if (authenticated) {
        return (
            <main
                dir={isArabic ? "rtl" : "ltr"}
                className="flex min-h-screen items-center justify-center bg-[#FCF8F6] px-4 py-8 sm:px-6"
            >
                <section className="w-full max-w-md rounded-3xl border border-[#E8DDE1] bg-white p-6 text-center shadow-[0_18px_50px_rgba(62,28,43,0.08)] sm:p-9">
                    <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-green-600">
                        <CheckCircle2 size={32} />
                    </span>

                    <h1 className="mt-5 text-2xl font-black leading-tight text-[#2B1D1D] sm:text-3xl">
                        {t("authenticated.title", {
                            name:
                                customer?.firstName ||
                                customer?.displayName ||
                                ""
                        })}
                    </h1>

                    <p className="mt-3 text-sm leading-7 text-[#74666A] sm:text-base">
                        {t("authenticated.description")}
                    </p>

                    <button
                        type="button"
                        onClick={() => navigateTo("/")}
                        className="mt-7 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-[#731D46] px-6 py-3 text-sm font-bold text-white transition duration-300 hover:bg-[#5D1638]"
                    >
                        {t("continueShopping")}
                    </button>
                </section>
            </main>
        );
    }

    return (
        <main
            dir={isArabic ? "rtl" : "ltr"}
            className="relative min-h-screen overflow-hidden bg-[#FCF8F6]"
        >
            <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#731D46]/10 blur-3xl" />

            <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
                <header className="flex items-center justify-between">
                    <button
                        type="button"
                        onClick={() => navigateTo("/")}
                        className="group inline-flex min-h-11 items-center gap-2 rounded-xl px-2 text-sm font-bold text-[#74666A] transition hover:bg-white hover:text-[#731D46]"
                    >
                        {isArabic ? (
                            <ArrowRight
                                size={18}
                                className="transition group-hover:translate-x-1"
                            />
                        ) : (
                            <ArrowLeft
                                size={18}
                                className="transition group-hover:-translate-x-1"
                            />
                        )}

                        <span>{t("continueShopping")}</span>
                    </button>

                    <div className="flex items-center gap-2">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#731D46] text-lg font-black text-white">
                            Z
                        </span>

                        <span className="hidden text-lg font-black text-[#2B1D1D] sm:block">
                            ZiworGlobalTrading
                        </span>
                    </div>
                </header>

                <div className="flex flex-1 items-center justify-center py-8 sm:py-10 lg:py-12">
                    <div className="w-full max-w-md">
                        <div className="mb-6 text-center sm:mb-8">
                            <span className="inline-flex rounded-full bg-[#F3E5EA] px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#731D46] sm:text-xs">
                                {t("badge")}
                            </span>

                            <h1 className="mt-4 text-[30px] font-black leading-tight tracking-[-0.03em] text-[#2B1D1D] sm:text-[38px]">
                                {t("title")}
                            </h1>

                            <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-[#74666A] sm:text-base">
                                {t("description")}
                            </p>
                        </div>

                        <section className="rounded-3xl border border-[#E8DDE1] bg-white p-5 shadow-[0_18px_50px_rgba(62,28,43,0.08)] sm:p-8">
                            {authError && (
                                <div
                                    role="alert"
                                    className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold leading-6 text-red-600"
                                >
                                    {authError}
                                </div>
                            )}

                            <div className="flex items-start gap-3">
                                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F3E5EA] text-[#731D46]">
                                    <MailCheck size={21} />
                                </span>

                                <div>
                                    <h2 className="text-sm font-extrabold text-[#2B1D1D] sm:text-base">
                                        {t("steps.email.title")}
                                    </h2>

                                    <p className="mt-1 text-xs leading-6 text-[#74666A] sm:text-sm">
                                        {t("steps.email.description")}
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handleSignup}
                                disabled={redirecting}
                                className="mt-6 inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-xl bg-[#731D46] px-5 py-4 text-sm font-extrabold text-white shadow-[0_10px_24px_rgba(115,29,70,0.18)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#5D1638] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
                            >
                                {redirecting ? (
                                    <LoaderCircle
                                        size={20}
                                        className="animate-spin"
                                    />
                                ) : (
                                    <UserPlus size={20} />
                                )}

                                <span>
                                    {redirecting
                                        ? t("redirecting")
                                        : t("button")}
                                </span>

                                {!redirecting &&
                                    (isArabic ? (
                                        <ArrowLeft size={18} />
                                    ) : (
                                        <ArrowRight size={18} />
                                    ))}
                            </button>

                            <div className="mt-6 space-y-3 border-t border-[#EEE5E8] pt-5">
                                <BenefitItem text={t("benefits.orders")} />
                                <BenefitItem text={t("benefits.checkout")} />
                                <BenefitItem text={t("benefits.addresses")} />
                                <BenefitItem text={t("benefits.returns")} />
                            </div>

                            <div className="mt-6 rounded-xl bg-[#F8F3F5] px-4 py-3">
                                <div className="flex items-start gap-3">
                                    <LockKeyhole
                                        size={17}
                                        className="mt-0.5 shrink-0 text-[#D4A037]"
                                    />

                                    <p className="text-xs leading-6 text-[#74666A]">
                                        {t("automaticAccount")}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 border-t border-[#EEE5E8] pt-5 text-center">
                                <p className="text-sm text-[#74666A]">
                                    {t("login.text")}
                                </p>

                                <button
                                    type="button"
                                    onClick={() => navigateTo("/login")}
                                    className="mt-2 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-3 text-sm font-extrabold text-[#731D46] transition hover:bg-[#F8EDF1] hover:text-[#D4A037]"
                                >
                                    <ShoppingBag size={17} />
                                    <span>{t("login.button")}</span>
                                </button>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </main>
    );
};

const BenefitItem = ({ text }) => {
    return (
        <div className="flex items-center gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#F3E5EA] text-[#731D46]">
                <Check size={14} strokeWidth={3} />
            </span>

            <p className="text-xs font-semibold leading-6 text-[#74666A] sm:text-sm">
                {text}
            </p>
        </div>
    );
};

export default SignupPage;