import { Geist, Geist_Mono, Noto_Sans_Arabic } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { CartProvider } from "@/context/CartContext";
import { CustomerProvider } from "@/context/CustomerContext";
import MetaPixel from "@/components/metapixel";
import "../globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
    display: "swap",
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
    display: "swap",
});

const notoSansArabic = Noto_Sans_Arabic({
    variable: "--font-arabic",
    subsets: ["arabic"],
    display: "swap",
});

export const metadata = {
    title: {
        default: "Ziwora",
        template: "%s | Ziwora",
    },
    description: "Ziwora Global Trading",
    icons: {
        icon: "/favicon.jpeg",
        shortcut: "/favicon.jpeg",
        apple: "/favicon.jpeg",
    },
};

export function generateStaticParams() {
    return routing.locales.map((locale) => ({
        locale,
    }));
}

export default async function RootLayout({ children, params }) {
    const { locale } = await params;

    if (!hasLocale(routing.locales, locale)) {
        notFound();
    }

    const messages = await getMessages({ locale });
    const isArabic = locale.toLowerCase().startsWith("ar");

    return (
        <html
            lang={locale}
            dir={isArabic ? "rtl" : "ltr"}
            className={`${geistSans.variable} ${geistMono.variable} ${notoSansArabic.variable} h-full antialiased`}
        >
            <body
                className={`min-h-screen bg-white text-[#24191E] ${isArabic
                        ? "font-[family-name:var(--font-arabic)]"
                        : "font-[family-name:var(--font-geist-sans)]"
                    }`}
            >
                <MetaPixel />

                <NextIntlClientProvider
                    locale={locale}
                    messages={messages}
                >
                    <CustomerProvider>
                        <CartProvider>{children}</CartProvider>
                    </CustomerProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}