"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useCart } from "@/context/CartContext";
import { ArrowLeft, ArrowRight, LoaderCircle, LockKeyhole, Minus, PackageOpen, Plus, RefreshCcw, ShieldCheck, ShoppingBag, Trash2, Truck } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const CartPage = () => {
    const t = useTranslations("CartPage");
    const locale = useLocale();
    const router = useRouter();
    const { lines, totalQuantity, subtotal, total, loading, cartActionLoading, error, updateCartLine, removeCartLine, checkout } = useCart();

    const navigateTo = (href) => {
        router.push(href);
    };

    const formatPrice = (money) => {
        if (!money) {
            return "";
        }

        return new Intl.NumberFormat(locale === "ar" ? "ar-QA" : "en-QA", {
            style: "currency",
            currency: money.currencyCode,
            minimumFractionDigits: 2,
        }).format(Number(money.amount));
    };

    const getLineUnitPrice = (line) => {
        return line?.merchandise?.price || null;
    };

    const getLineTotalPrice = (line) => {
        return line?.cost?.totalAmount || null;
    };

    const handleDecrease = async (line) => {
        if (cartActionLoading) {
            return;
        }

        if (line.quantity <= 1) {
            await removeCartLine(line.id);
            return;
        }

        await updateCartLine(line.id, line.quantity - 1);
    };

    const handleIncrease = async (line) => {
        if (cartActionLoading || !line.merchandise?.availableForSale) {
            return;
        }

        await updateCartLine(line.id, line.quantity + 1);
    };

    const handleRemove = async (lineId) => {
        if (cartActionLoading) {
            return;
        }

        await removeCartLine(lineId);
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <main dir={locale === "ar" ? "rtl" : "ltr"} className="flex min-h-[70vh] items-center justify-center bg-[#FCF8F6] px-4">
                    <div className="flex flex-col items-center text-center">
                        <LoaderCircle size={42} className="animate-spin text-[#731D46]" />
                        <h1 className="mt-5 text-xl font-black text-[#2B1D1D] sm:text-2xl">{t("loading.title")}</h1>
                        <p className="mt-2 text-sm text-[#74666A]">{t("loading.description")}</p>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <main dir={locale === "ar" ? "rtl" : "ltr"} className="min-h-[70vh] w-full bg-[#FCF8F6]">
                <section className="border-b border-[#E8DDE1] bg-white">
                    <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-3 px-4 py-8 sm:px-6 sm:py-10 md:px-8 lg:px-10 xl:px-12">
                        <span className="inline-flex w-fit rounded-full border border-[#731D46]/10 bg-[#F3E5EA] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#731D46] sm:text-xs">{t("badge")}</span>
                        <div className="flex flex-wrap items-end justify-between gap-4">
                            <div>
                                <h1 className="text-[32px] font-black leading-tight tracking-[-0.03em] text-[#2B1D1D] sm:text-[40px] lg:text-[48px]">{t("title")}</h1>
                                <p className="mt-2 text-sm leading-7 text-[#74666A] sm:text-base">{totalQuantity > 0 ? t("itemsCount", { count: totalQuantity }) : t("description")}</p>
                            </div>
                            {lines.length > 0 && <button type="button" onClick={() => navigateTo("/")} className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#D8BEC8] bg-white px-5 py-3 text-sm font-bold text-[#731D46] transition duration-300 md:hover:border-[#731D46] md:hover:bg-[#731D46] md:hover:text-white">
                                {locale === "ar" ? <ArrowRight size={17} className="transition md:group-hover:translate-x-1" /> : <ArrowLeft size={17} className="transition md:group-hover:-translate-x-1" />}
                                <span>{t("continueShopping")}</span>
                            </button>}
                        </div>
                    </div>
                </section>
                <section className="w-full py-10 sm:py-12 lg:py-16">
                    <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
                        {error && <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">{error}</div>}
                        {lines.length === 0 ? (
                            <div className="mx-auto flex min-h-[440px] max-w-2xl flex-col items-center justify-center rounded-3xl border border-dashed border-[#D8BEC8] bg-white px-5 py-12 text-center shadow-sm">
                                <span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#F3E5EA] text-[#731D46]">
                                    <ShoppingBag size={38} />
                                </span>
                                <h2 className="mt-6 text-[27px] font-black text-[#2B1D1D] sm:text-[34px]">{t("empty.title")}</h2>
                                <p className="mt-3 max-w-lg text-sm leading-7 text-[#74666A] sm:text-base">{t("empty.description")}</p>
                                <button type="button" onClick={() => navigateTo("/")} className="group mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#731D46] px-6 py-3 text-sm font-bold text-white transition duration-300 md:hover:-translate-y-0.5 md:hover:bg-[#D4A037]">
                                    <ShoppingBag size={18} />
                                    <span>{t("empty.button")}</span>
                                    {locale === "ar" ? <ArrowLeft size={17} className="transition md:group-hover:-translate-x-1" /> : <ArrowRight size={17} className="transition md:group-hover:translate-x-1" />}
                                </button>
                            </div>
                        ) : (
                            <div className="grid items-start gap-7 lg:grid-cols-[1fr_380px] xl:gap-10">
                                <div className="space-y-4">
                                    {lines.map((line) => {
                                        const variant = line.merchandise;
                                        const product = variant?.product;
                                        const image = product?.featuredImage;
                                        const variantTitle = variant?.title;
                                        const showVariantTitle = variantTitle && variantTitle !== "Default Title";

                                        return (
                                            <article key={line.id} className="overflow-hidden rounded-2xl border border-[#E8DDE1] bg-white p-3 shadow-sm sm:p-4">
                                                <div className="flex gap-3 sm:gap-5">
                                                    <button type="button" onClick={() => navigateTo(`/products/${product?.handle}`)} className="relative h-28 w-24 shrink-0 overflow-hidden rounded-xl bg-[#F1E8ED] sm:h-36 sm:w-32">
                                                        {image?.url ? <Image src={image.url} alt={image.altText || product?.title || t("productImage")} fill sizes="128px" className="object-cover transition duration-500 md:hover:scale-105" /> : <span className="flex h-full w-full items-center justify-center text-[#B79FAA]"><PackageOpen size={30} /></span>}
                                                    </button>
                                                    <div className="flex min-w-0 flex-1 flex-col">
                                                        <div className="flex items-start justify-between gap-3">
                                                            <div className="min-w-0">
                                                                <button type="button" onClick={() => navigateTo(`/products/${product?.handle}`)} className="text-start">
                                                                    <h2 className="line-clamp-2 text-sm font-black leading-5 text-[#2B1D1D] transition hover:text-[#731D46] sm:text-lg sm:leading-7">{product?.title}</h2>
                                                                </button>
                                                                {showVariantTitle && <p className="mt-1 text-xs font-semibold text-[#8F7882]">{variantTitle}</p>}
                                                                {!variant?.availableForSale && <span className="mt-2 inline-flex w-fit rounded-full bg-red-50 px-3 py-1 text-[10px] font-bold text-red-500">{t("unavailable")}</span>}
                                                            </div>
                                                            <button type="button" onClick={() => handleRemove(line.id)} disabled={cartActionLoading} aria-label={t("remove")} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500 transition disabled:cursor-not-allowed disabled:opacity-50 md:hover:bg-red-500 md:hover:text-white">
                                                                <Trash2 size={17} />
                                                            </button>
                                                        </div>
                                                        <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-4">
                                                            <div>
                                                                <p className="text-xs text-[#8F7882]">{t("unitPrice")}</p>
                                                                <p className="mt-1 text-sm font-black text-[#731D46] sm:text-base">{formatPrice(getLineUnitPrice(line))}</p>
                                                            </div>
                                                            <div className="flex items-center rounded-xl border border-[#E1CDD5] bg-[#FCFAFB] p-1">
                                                                <button type="button" onClick={() => handleDecrease(line)} disabled={cartActionLoading} aria-label={t("decrease")} className="flex h-9 w-9 items-center justify-center rounded-lg text-[#731D46] transition disabled:cursor-not-allowed disabled:opacity-40 md:hover:bg-[#F3E5EA]">
                                                                    <Minus size={16} />
                                                                </button>
                                                                <span className="min-w-9 text-center text-sm font-black text-[#2B1D1D]">{line.quantity}</span>
                                                                <button type="button" onClick={() => handleIncrease(line)} disabled={cartActionLoading || !variant?.availableForSale} aria-label={t("increase")} className="flex h-9 w-9 items-center justify-center rounded-lg text-[#731D46] transition disabled:cursor-not-allowed disabled:opacity-40 md:hover:bg-[#F3E5EA]">
                                                                    <Plus size={16} />
                                                                </button>
                                                            </div>
                                                            <div className="min-w-[90px] text-end">
                                                                <p className="text-xs text-[#8F7882]">{t("lineTotal")}</p>
                                                                <p className="mt-1 text-base font-black text-[#731D46] sm:text-lg">{formatPrice(getLineTotalPrice(line))}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </article>
                                        );
                                    })}
                                    {cartActionLoading && <div className="flex items-center justify-center gap-2 rounded-2xl border border-[#E8DDE1] bg-white px-4 py-3 text-sm font-semibold text-[#731D46]">
                                        <LoaderCircle size={18} className="animate-spin" />
                                        <span>{t("updating")}</span>
                                    </div>}
                                </div>
                                <aside className="rounded-3xl border border-[#E8DDE1] bg-white p-5 shadow-[0_16px_45px_rgba(62,28,43,0.08)] sm:p-6 lg:sticky lg:top-6">
                                    <div className="flex items-center gap-3">
                                        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F3E5EA] text-[#731D46]">
                                            <ShoppingBag size={21} />
                                        </span>
                                        <div>
                                            <h2 className="text-xl font-black text-[#2B1D1D]">{t("summary.title")}</h2>
                                            <p className="mt-1 text-xs text-[#8F7882]">{t("summary.items", { count: totalQuantity })}</p>
                                        </div>
                                    </div>
                                    <div className="mt-6 space-y-4 border-y border-[#EFE4E8] py-5">
                                        <div className="flex items-center justify-between gap-4">
                                            <span className="text-sm font-semibold text-[#74666A]">{t("summary.subtotal")}</span>
                                            <span className="text-sm font-black text-[#2B1D1D]">{formatPrice(subtotal)}</span>
                                        </div>
                                        <div className="flex items-center justify-between gap-4">
                                            <span className="text-sm font-semibold text-[#74666A]">{t("summary.shipping")}</span>
                                            <span className="text-sm font-bold text-[#248E4B]">{t("summary.calculated")}</span>
                                        </div>
                                        <div className="flex items-center justify-between gap-4">
                                            <span className="text-sm font-semibold text-[#74666A]">{t("summary.taxes")}</span>
                                            <span className="text-sm font-bold text-[#74666A]">{t("summary.calculated")}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-end justify-between gap-4 pt-5">
                                        <div>
                                            <p className="text-sm font-bold text-[#74666A]">{t("summary.total")}</p>
                                            <p className="mt-1 text-xs text-[#9A858D]">{t("summary.note")}</p>
                                        </div>
                                        <span className="text-xl font-black text-[#731D46] sm:text-2xl">{formatPrice(total)}</span>
                                    </div>
                                    <button type="button" onClick={checkout} disabled={cartActionLoading || lines.length === 0} className="mt-6 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#731D46] px-6 py-4 text-sm font-extrabold text-white shadow-[0_12px_30px_rgba(115,29,70,0.2)] transition duration-300 disabled:cursor-not-allowed disabled:opacity-60 md:hover:-translate-y-0.5 md:hover:bg-[#D4A037]">
                                        <LockKeyhole size={18} />
                                        <span>{t("checkout")}</span>
                                        {locale === "ar" ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
                                    </button>
                                    <div className="mt-5 grid grid-cols-1 gap-3">
                                        <div className="flex items-start gap-3 rounded-2xl bg-[#FCFAFB] p-3">
                                            <ShieldCheck size={18} className="mt-0.5 shrink-0 text-[#D4A037]" />
                                            <div>
                                                <h3 className="text-xs font-extrabold text-[#2B1D1D]">{t("benefits.secure.title")}</h3>
                                                <p className="mt-1 text-[11px] leading-5 text-[#8F7882]">{t("benefits.secure.description")}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3 rounded-2xl bg-[#FCFAFB] p-3">
                                            <Truck size={18} className="mt-0.5 shrink-0 text-[#D4A037]" />
                                            <div>
                                                <h3 className="text-xs font-extrabold text-[#2B1D1D]">{t("benefits.delivery.title")}</h3>
                                                <p className="mt-1 text-[11px] leading-5 text-[#8F7882]">{t("benefits.delivery.description")}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <button type="button" onClick={() => window.location.reload()} className="mt-4 flex w-full items-center justify-center gap-2 text-xs font-bold text-[#8F7882] transition hover:text-[#731D46]">
                                        <RefreshCcw size={14} />
                                        <span>{t("refresh")}</span>
                                    </button>
                                </aside>
                            </div>
                        )}
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
};

export default CartPage;