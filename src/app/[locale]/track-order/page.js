"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Search, PackageCheck, PackageOpen, Truck, MapPin, CheckCircle2, Clock3, Mail, Hash, ShoppingBag, ArrowLeft, ArrowRight, CircleAlert } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const TrackOrderPage = () => {
    const t = useTranslations("TrackOrderPage");
    const locale = useLocale();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [notFound, setNotFound] = useState(false);
    const [formData, setFormData] = useState({
        orderNumber: "",
        email: "",
    });

    const order = {
        orderNumber: "#ZW-10248",
        status: "inTransit",
        orderDate: "July 14, 2026",
        estimatedDelivery: "July 18, 2026",
        customerName: "Muhammad Noman",
        email: "customer@example.com",
        address: "Doha, Qatar",
        total: 288,
        items: [
            {
                id: 1,
                title: t("demo.items.airFryer"),
                quantity: 1,
                price: 189,
            },
            {
                id: 2,
                title: t("demo.items.earbuds"),
                quantity: 1,
                price: 99,
            },
        ],
    };

    const timeline = [
        {
            id: 1,
            title: t("timeline.confirmed.title"),
            description: t("timeline.confirmed.description"),
            date: "July 14, 2026",
            completed: true,
            icon: CheckCircle2,
        },
        {
            id: 2,
            title: t("timeline.processing.title"),
            description: t("timeline.processing.description"),
            date: "July 15, 2026",
            completed: true,
            icon: PackageOpen,
        },
        {
            id: 3,
            title: t("timeline.shipped.title"),
            description: t("timeline.shipped.description"),
            date: "July 16, 2026",
            completed: true,
            icon: Truck,
        },
        {
            id: 4,
            title: t("timeline.outForDelivery.title"),
            description: t("timeline.outForDelivery.description"),
            date: t("timeline.pending"),
            completed: false,
            icon: MapPin,
        },
        {
            id: 5,
            title: t("timeline.delivered.title"),
            description: t("timeline.delivered.description"),
            date: t("timeline.pending"),
            completed: false,
            icon: PackageCheck,
        },
    ];

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setSearched(false);
        setNotFound(false);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setSearched(false);
        setNotFound(false);

        await new Promise((resolve) => setTimeout(resolve, 800));

        const validOrder = formData.orderNumber.trim().toLowerCase() === "zw-10248" || formData.orderNumber.trim().toLowerCase() === "#zw-10248";

        setLoading(false);

        if (validOrder) {
            setSearched(true);
            return;
        }

        setNotFound(true);
    };

    const navigateToShop = () => {
        router.push("/");
    };

    return (
        <>
            <Navbar />
            <main dir={locale === "ar" ? "rtl" : "ltr"} className="w-full bg-[#FCF8F6]">
                <section className="relative overflow-hidden bg-[#731D46]">
                    <div className="pointer-events-none absolute -start-24 -top-24 hidden h-72 w-72 rounded-full bg-white/10 blur-3xl lg:block" />
                    <div className="pointer-events-none absolute -bottom-28 -end-24 hidden h-80 w-80 rounded-full bg-[#D4A037]/20 blur-3xl lg:block" />
                    <div className="relative mx-auto flex min-h-[270px] w-full max-w-[1440px] flex-col items-center justify-center px-4 py-14 text-center sm:min-h-[320px] sm:px-6 md:px-8 lg:min-h-[360px] lg:px-10 xl:px-12">
                        <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-white sm:text-xs">{t("badge")}</span>
                        <h1 className="mt-5 max-w-3xl text-[36px] font-black leading-tight tracking-[-0.035em] text-white sm:text-[46px] md:text-[56px] lg:text-[64px]">{t("title")}</h1>
                        <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80 sm:text-base md:text-lg">{t("description")}</p>
                    </div>
                </section>
                <section className="w-full py-10 sm:py-12 md:py-14 lg:py-20">
                    <div className="mx-auto w-full max-w-[1100px] px-4 sm:px-6 md:px-8">
                        <div className="rounded-3xl border border-[#E8DDE1] bg-white p-5 shadow-[0_16px_50px_rgba(62,28,43,0.08)] sm:p-7 lg:p-9">
                            <div className="mx-auto max-w-2xl text-center">
                                <span className="inline-flex rounded-full bg-[#F3E5EA] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#731D46] sm:text-xs">{t("form.badge")}</span>
                                <h2 className="mt-4 text-[28px] font-black leading-tight text-[#2B1D1D] sm:text-[36px]">{t("form.title")}</h2>
                                <p className="mt-3 text-sm leading-7 text-[#74666A] sm:text-base">{t("form.description")}</p>
                            </div>
                            <form onSubmit={handleSubmit} className="mx-auto mt-8 max-w-3xl">
                                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                    <div>
                                        <label htmlFor="orderNumber" className="mb-2 block text-sm font-bold text-[#2B1D1D]">{t("form.orderNumber")}</label>
                                        <div className="relative">
                                            <Hash size={18} className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-[#A58D97]" />
                                            <input id="orderNumber" name="orderNumber" type="text" value={formData.orderNumber} onChange={handleChange} required placeholder={t("form.orderNumberPlaceholder")} className="min-h-12 w-full rounded-xl border border-[#E1CDD5] bg-[#FCFAFB] py-3 ps-11 pe-4 text-sm text-[#2B1D1D] outline-none transition placeholder:text-[#B3A2A9] focus:border-[#731D46] focus:bg-white" />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="mb-2 block text-sm font-bold text-[#2B1D1D]">{t("form.email")}</label>
                                        <div className="relative">
                                            <Mail size={18} className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-[#A58D97]" />
                                            <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required placeholder={t("form.emailPlaceholder")} className="min-h-12 w-full rounded-xl border border-[#E1CDD5] bg-[#FCFAFB] py-3 ps-11 pe-4 text-sm text-[#2B1D1D] outline-none transition placeholder:text-[#B3A2A9] focus:border-[#731D46] focus:bg-white" />
                                        </div>
                                    </div>
                                </div>
                                <button type="submit" disabled={loading} className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#731D46] px-6 py-3 text-sm font-extrabold text-white transition duration-300 disabled:cursor-not-allowed disabled:opacity-70 md:hover:-translate-y-0.5 md:hover:bg-[#D4A037]">
                                    <Search size={18} />
                                    <span>{loading ? t("form.searching") : t("form.submit")}</span>
                                </button>
                                <p className="mt-4 text-center text-xs leading-5 text-[#9A858D]">{t("form.hint")}</p>
                            </form>
                        </div>
                        {notFound && (
                            <div className="mt-8 rounded-3xl border border-red-200 bg-white p-6 text-center shadow-sm sm:p-8">
                                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                                    <CircleAlert size={28} />
                                </span>
                                <h2 className="mt-4 text-xl font-black text-[#2B1D1D] sm:text-2xl">{t("notFound.title")}</h2>
                                <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[#74666A]">{t("notFound.description")}</p>
                                <button type="button" onClick={navigateToShop} className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#731D46] px-5 py-3 text-sm font-bold text-white transition md:hover:bg-[#D4A037]">
                                    <ShoppingBag size={17} />
                                    <span>{t("notFound.button")}</span>
                                </button>
                            </div>
                        )}
                        {searched && (
                            <div className="mt-8 space-y-6">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                    <div className="rounded-2xl border border-[#E8DDE1] bg-white p-4 shadow-sm">
                                        <span className="text-xs font-bold uppercase tracking-[0.08em] text-[#A28E96]">{t("summary.orderNumber")}</span>
                                        <p dir="ltr" className="mt-2 text-lg font-black text-[#2B1D1D]">{order.orderNumber}</p>
                                    </div>
                                    <div className="rounded-2xl border border-[#E8DDE1] bg-white p-4 shadow-sm">
                                        <span className="text-xs font-bold uppercase tracking-[0.08em] text-[#A28E96]">{t("summary.orderDate")}</span>
                                        <p className="mt-2 text-sm font-extrabold text-[#2B1D1D]">{order.orderDate}</p>
                                    </div>
                                    <div className="rounded-2xl border border-[#E8DDE1] bg-white p-4 shadow-sm">
                                        <span className="text-xs font-bold uppercase tracking-[0.08em] text-[#A28E96]">{t("summary.delivery")}</span>
                                        <p className="mt-2 text-sm font-extrabold text-[#2B1D1D]">{order.estimatedDelivery}</p>
                                    </div>
                                    <div className="rounded-2xl border border-[#25D366]/20 bg-[#25D366]/5 p-4 shadow-sm">
                                        <span className="text-xs font-bold uppercase tracking-[0.08em] text-[#248E4B]">{t("summary.status")}</span>
                                        <p className="mt-2 inline-flex items-center gap-2 text-sm font-extrabold text-[#248E4B]">
                                            <Truck size={17} />
                                            <span>{t(`statuses.${order.status}`)}</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                                    <div className="rounded-3xl border border-[#E8DDE1] bg-white p-5 shadow-sm sm:p-7">
                                        <div className="flex items-center gap-3">
                                            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F3E5EA] text-[#731D46]">
                                                <Truck size={21} />
                                            </span>
                                            <div>
                                                <h2 className="text-xl font-black text-[#2B1D1D]">{t("tracking.title")}</h2>
                                                <p className="mt-1 text-xs text-[#8D7881] sm:text-sm">{t("tracking.description")}</p>
                                            </div>
                                        </div>
                                        <div className="mt-8">
                                            {timeline.map((item, index) => {
                                                const Icon = item.icon;
                                                const lastItem = index === timeline.length - 1;

                                                return (
                                                    <div key={item.id} className="relative flex gap-4 pb-8 last:pb-0">
                                                        {!lastItem && <span className={`absolute start-[21px] top-11 h-[calc(100%-28px)] w-0.5 ${item.completed ? "bg-[#731D46]" : "bg-[#E6DCE0]"}`} />}
                                                        <span className={`relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-4 border-white shadow-sm ${item.completed ? "bg-[#731D46] text-white" : "bg-[#F2EAED] text-[#A9919B]"}`}>
                                                            <Icon size={18} />
                                                        </span>
                                                        <div className="min-w-0 pt-1">
                                                            <div className="flex flex-wrap items-center justify-between gap-2">
                                                                <h3 className={`text-sm font-extrabold sm:text-base ${item.completed ? "text-[#2B1D1D]" : "text-[#9E8A92]"}`}>{item.title}</h3>
                                                                <span className="text-[11px] font-semibold text-[#A58D97] sm:text-xs">{item.date}</span>
                                                            </div>
                                                            <p className="mt-1 text-xs leading-5 text-[#7E6B73] sm:text-sm">{item.description}</p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="rounded-3xl border border-[#E8DDE1] bg-white p-5 shadow-sm sm:p-6">
                                            <div className="flex items-center gap-3">
                                                <PackageOpen size={21} className="text-[#731D46]" />
                                                <h2 className="text-lg font-black text-[#2B1D1D]">{t("orderDetails.title")}</h2>
                                            </div>
                                            <div className="mt-5 space-y-4">
                                                {order.items.map((item) => (
                                                    <div key={item.id} className="flex items-start justify-between gap-4 border-b border-[#EFE5E9] pb-4 last:border-0 last:pb-0">
                                                        <div className="min-w-0">
                                                            <h3 className="text-sm font-extrabold leading-5 text-[#2B1D1D]">{item.title}</h3>
                                                            <p className="mt-1 text-xs text-[#8D7881]">{t("orderDetails.quantity")}: {item.quantity}</p>
                                                        </div>
                                                        <span className="shrink-0 text-sm font-black text-[#731D46]">{t("currency")} {item.price}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="mt-5 flex items-center justify-between border-t border-[#E8DDE1] pt-4">
                                                <span className="text-sm font-bold text-[#74666A]">{t("orderDetails.total")}</span>
                                                <span className="text-lg font-black text-[#731D46]">{t("currency")} {order.total}</span>
                                            </div>
                                        </div>
                                        <div className="rounded-3xl border border-[#E8DDE1] bg-white p-5 shadow-sm sm:p-6">
                                            <div className="flex items-center gap-3">
                                                <MapPin size={21} className="text-[#D4A037]" />
                                                <h2 className="text-lg font-black text-[#2B1D1D]">{t("deliveryDetails.title")}</h2>
                                            </div>
                                            <div className="mt-5 space-y-3 text-sm text-[#74666A]">
                                                <p><span className="font-bold text-[#2B1D1D]">{t("deliveryDetails.customer")}:</span> {order.customerName}</p>
                                                <p><span className="font-bold text-[#2B1D1D]">{t("deliveryDetails.email")}:</span> <span dir="ltr">{order.email}</span></p>
                                                <p><span className="font-bold text-[#2B1D1D]">{t("deliveryDetails.address")}:</span> {order.address}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-center">
                                    <button type="button" onClick={navigateToShop} className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#D8BEC8] bg-white px-6 py-3 text-sm font-bold text-[#731D46] transition md:hover:border-[#731D46] md:hover:bg-[#731D46] md:hover:text-white">
                                        {locale === "ar" ? <ArrowRight size={18} className="transition md:group-hover:translate-x-1" /> : <ArrowLeft size={18} className="transition md:group-hover:-translate-x-1" />}
                                        <span>{t("continueShopping")}</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
};

export default TrackOrderPage;