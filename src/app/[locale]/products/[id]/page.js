"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import {
    ArrowLeft,
    ArrowRight,
    Check,
    ChevronRight,
    Heart,
    Minus,
    PackageSearch,
    Plus,
    ShieldCheck,
    ShoppingBag,
    Truck,
} from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { useCart } from "@/context/CartContext";

const labels = {
    en: {
        home: "Home",
        products: "Products",
        inStock: "In stock",
        outOfStock: "Out of stock",
        quantity: "Quantity",
        addToCart: "Add to Cart",
        buyNow: "Buy Now",
        delivery: "Fast delivery",
        deliveryText: "Delivery across Qatar",
        secure: "Secure purchase",
        secureText: "Your order is handled safely",
        quality: "Quality checked",
        qualityText: "Checked before dispatch",
        details: "Product Details",
        productNotFound: "Product not found",
        productNotFoundText:
            "The product you are looking for is unavailable.",
        backToProducts: "Back to Products",
        addedToCart: "Product added to cart",
        addingToCart: "Adding...",
        cartError: "Unable to add product to cart",
        variantUnavailable: "Product variant is unavailable",
        loading: "Loading product",
        unableToLoad: "Unable to load product",
        tryAgain: "Try Again",
        sale: "Sale",
        categoryFallback: "Product",
        descriptionFallback:
            "Explore this product from our Shopify store. Product information and availability are updated directly from the store.",
    },
    ar: {
        home: "الرئيسية",
        products: "المنتجات",
        inStock: "متوفر في المخزون",
        outOfStock: "غير متوفر في المخزون",
        quantity: "الكمية",
        addToCart: "أضف إلى السلة",
        buyNow: "اشترِ الآن",
        delivery: "توصيل سريع",
        deliveryText: "التوصيل إلى جميع أنحاء قطر",
        secure: "شراء آمن",
        secureText: "يتم التعامل مع طلبك بأمان",
        quality: "فحص الجودة",
        qualityText: "يتم فحص المنتج قبل الشحن",
        details: "تفاصيل المنتج",
        productNotFound: "المنتج غير موجود",
        productNotFoundText: "المنتج الذي تبحث عنه غير متوفر.",
        backToProducts: "العودة إلى المنتجات",
        addedToCart: "تمت إضافة المنتج إلى السلة",
        addingToCart: "جاري الإضافة...",
        cartError: "تعذرت إضافة المنتج إلى السلة",
        variantUnavailable: "خيار المنتج غير متوفر",
        loading: "جاري تحميل المنتج",
        unableToLoad: "تعذر تحميل المنتج",
        tryAgain: "إعادة المحاولة",
        sale: "تخفيض",
        categoryFallback: "منتج",
        descriptionFallback:
            "اكتشف هذا المنتج من متجرنا على شوبيفاي. يتم تحديث معلومات المنتج ومدى توفره مباشرة من المتجر.",
    },
};

const ProductDetailsPage = () => {
    const params = useParams();
    const locale = useLocale();
    const language = locale === "ar" ? "ar" : "en";
    const text = labels[language];
    const { addToCart, cartActionLoading } = useCart();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [isFavorite, setIsFavorite] = useState(false);
    const [message, setMessage] = useState("");
    const [cartError, setCartError] = useState("");

    const getProduct = async () => {
        try {
            setLoading(true);
            setError("");
            setProduct(null);
            setQuantity(1);
            setMessage("");
            setCartError("");

            const response = await fetch(
                `/api/products?locale=${encodeURIComponent(locale)}`,
                {
                    method: "GET",
                    cache: "no-store",
                }
            );

            const responseText = await response.text();

            if (!responseText) {
                throw new Error("Products API returned an empty response");
            }

            const data = JSON.parse(responseText);

            if (!response.ok || !data.success) {
                throw new Error(data.message || text.unableToLoad);
            }

            const currentProduct = (data.products || []).find(
                (item) =>
                    item.handle === String(params.id) ||
                    item.id === String(params.id)
            );

            setProduct(currentProduct || null);
        } catch (error) {
            setProduct(null);
            setError(error.message || text.unableToLoad);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (params.id) {
            getProduct();
        }
    }, [params.id, locale]);

    const decreaseQuantity = () => {
        setQuantity((current) => Math.max(1, current - 1));
    };

    const increaseQuantity = () => {
        setQuantity((current) => Math.min(99, current + 1));
    };

    const handleAddToCart = async () => {
        if (
            !product?.availableForSale ||
            !product?.variantId ||
            cartActionLoading
        ) {
            if (!product?.variantId) {
                setCartError(text.variantUnavailable);
            }

            return;
        }

        try {
            setMessage("");
            setCartError("");

            await addToCart(product.variantId, Number(quantity));

            setMessage(text.addedToCart);

            window.setTimeout(() => {
                setMessage("");
            }, 2500);
        } catch (error) {
            setCartError(error.message || text.cartError);
        }
    };

    if (loading) {
        return (
            <main
                dir={language === "ar" ? "rtl" : "ltr"}
                className="min-h-screen bg-[#FCF8F6]"
            >
                <div className="mx-auto w-full max-w-[1440px] px-4 py-10 sm:px-6 md:px-8 lg:px-10 lg:py-16 xl:px-12">
                    <div className="mb-7 h-5 w-64 animate-pulse rounded bg-[#E8DDE1]" />

                    <section className="overflow-hidden rounded-3xl border border-[#E8DDE1] bg-white shadow-[0_15px_50px_rgba(62,28,43,0.08)]">
                        <div className="grid lg:grid-cols-2">
                            <div className="border-b border-[#E8DDE1] p-4 sm:p-6 lg:border-b-0 lg:border-e lg:p-8">
                                <div className="aspect-square animate-pulse rounded-2xl bg-[#F1E8ED]" />
                            </div>

                            <div className="p-5 sm:p-8 lg:p-10">
                                <div className="h-4 w-28 animate-pulse rounded bg-[#F1E8ED]" />
                                <div className="mt-5 h-10 w-full animate-pulse rounded bg-[#F1E8ED]" />
                                <div className="mt-3 h-10 w-4/5 animate-pulse rounded bg-[#F1E8ED]" />
                                <div className="mt-7 h-9 w-40 animate-pulse rounded bg-[#F1E8ED]" />
                                <div className="mt-7 h-24 w-full animate-pulse rounded bg-[#F1E8ED]" />
                                <div className="mt-8 h-14 w-full animate-pulse rounded-full bg-[#F1E8ED]" />

                                <p className="mt-5 text-center text-sm font-semibold text-[#74666A]">
                                    {text.loading}
                                </p>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main
                dir={language === "ar" ? "rtl" : "ltr"}
                className="flex min-h-[70vh] items-center justify-center bg-[#FCF8F6] px-4 py-20"
            >
                <div className="w-full max-w-xl rounded-3xl border border-red-200 bg-white p-8 text-center shadow-[0_15px_50px_rgba(62,28,43,0.08)] sm:p-12">
                    <PackageSearch className="mx-auto h-14 w-14 text-red-300" />

                    <h1 className="mt-5 text-2xl font-black text-[#2B1D1D] sm:text-3xl">
                        {text.unableToLoad}
                    </h1>

                    <p className="mt-3 text-sm leading-7 text-red-500">
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={getProduct}
                        className="mt-7 inline-flex items-center justify-center rounded-full bg-[#731D46] px-7 py-3 text-sm font-bold text-white transition duration-300 hover:bg-[#D4A037]"
                    >
                        {text.tryAgain}
                    </button>
                </div>
            </main>
        );
    }

    if (!product) {
        return (
            <>
                <Navbar />

                <main
                    dir={language === "ar" ? "rtl" : "ltr"}
                    className="flex min-h-[70vh] items-center justify-center bg-[#FCF8F6] px-4 py-20"
                >
                    <div className="w-full max-w-xl rounded-3xl border border-[#E8DDE1] bg-white p-8 text-center shadow-[0_15px_50px_rgba(62,28,43,0.08)] sm:p-12">
                        <ShoppingBag className="mx-auto h-14 w-14 text-[#CDB7C1]" />

                        <h1 className="mt-5 text-2xl font-black text-[#2B1D1D] sm:text-3xl">
                            {text.productNotFound}
                        </h1>

                        <p className="mt-3 leading-7 text-[#74666A]">
                            {text.productNotFoundText}
                        </p>

                        <Link
                            href="/products"
                            className="mt-7 inline-flex items-center justify-center gap-2 rounded-full bg-[#731D46] px-7 py-3 text-sm font-bold text-white transition duration-300 hover:bg-[#D4A037]"
                        >
                            {language === "ar" ? (
                                <ArrowRight className="h-4 w-4" />
                            ) : (
                                <ArrowLeft className="h-4 w-4" />
                            )}

                            {text.backToProducts}
                        </Link>
                    </div>
                </main>

                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />

            <main
                dir={language === "ar" ? "rtl" : "ltr"}
                className="min-h-screen bg-[#FCF8F6]"
            >
                <div className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 md:px-8 lg:px-10 lg:py-10 xl:px-12">
                    <nav
                        aria-label="Breadcrumb"
                        className="mb-6 flex flex-wrap items-center gap-2 text-sm text-[#74666A]"
                    >
                        <Link
                            href="/"
                            className="transition duration-300 hover:text-[#731D46]"
                        >
                            {text.home}
                        </Link>

                        <ChevronRight
                            className={`h-4 w-4 ${language === "ar" ? "rotate-180" : ""
                                }`}
                        />

                        <Link
                            href="/products"
                            className="transition duration-300 hover:text-[#731D46]"
                        >
                            {text.products}
                        </Link>

                        <ChevronRight
                            className={`h-4 w-4 ${language === "ar" ? "rotate-180" : ""
                                }`}
                        />

                        <span className="max-w-[220px] truncate font-semibold text-[#2B1D1D] sm:max-w-md">
                            {product.title}
                        </span>
                    </nav>

                    <section className="overflow-hidden rounded-3xl border border-[#E8DDE1] bg-white shadow-[0_15px_50px_rgba(62,28,43,0.08)]">
                        <div className="grid lg:grid-cols-2">
                            <div className="border-b border-[#E8DDE1] p-4 sm:p-6 lg:border-b-0 lg:border-e lg:p-8">
                                <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#F1E8ED]">
                                    {product.image?.url ? (
                                        <Image
                                            src={product.image.url}
                                            alt={
                                                product.image.altText ||
                                                product.title
                                            }
                                            fill
                                            priority
                                            sizes="(max-width: 1024px) 100vw, 50vw"
                                            className="object-cover transition duration-700 hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center">
                                            <PackageSearch className="h-20 w-20 text-[#CDB7C1]" />
                                        </div>
                                    )}

                                    {product.badge === "sale" && (
                                        <span className="absolute start-4 top-4 z-10 rounded-full bg-[#D4A037] px-4 py-2 text-xs font-extrabold uppercase tracking-wide text-white shadow-md">
                                            {text.sale}
                                        </span>
                                    )}

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setIsFavorite(
                                                (current) => !current
                                            )
                                        }
                                        aria-label="Favorite product"
                                        className="absolute end-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#2B1D1D] shadow-md transition duration-300 hover:scale-105"
                                    >
                                        <Heart
                                            className={`h-5 w-5 ${isFavorite
                                                    ? "fill-[#731D46] text-[#731D46]"
                                                    : ""
                                                }`}
                                        />
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col p-5 sm:p-8 lg:p-10">
                                <p className="text-sm font-bold uppercase tracking-[0.12em] text-[#A66D87]">
                                    {product.category ||
                                        text.categoryFallback}
                                </p>

                                <h1 className="mt-3 text-3xl font-black leading-tight tracking-[-0.03em] text-[#2B1D1D] sm:text-4xl lg:text-5xl">
                                    {product.title}
                                </h1>

                                <div className="mt-7 flex flex-wrap items-end gap-3">
                                    <span className="text-3xl font-black text-[#731D46]">
                                        {product.currencyCode}{" "}
                                        {Number(product.price).toFixed(2)}
                                    </span>

                                    {product.oldPrice &&
                                        product.oldPrice > product.price && (
                                            <span className="pb-1 text-lg text-[#B8A4AC] line-through">
                                                {product.currencyCode}{" "}
                                                {Number(
                                                    product.oldPrice
                                                ).toFixed(2)}
                                            </span>
                                        )}
                                </div>

                                <div
                                    className={`mt-5 inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${product.availableForSale
                                            ? "bg-emerald-50 text-emerald-700"
                                            : "bg-red-50 text-red-600"
                                        }`}
                                >
                                    {product.availableForSale ? (
                                        <Check className="h-4 w-4" />
                                    ) : (
                                        <PackageSearch className="h-4 w-4" />
                                    )}

                                    {product.availableForSale
                                        ? text.inStock
                                        : text.outOfStock}
                                </div>

                                <p className="mt-7 border-t border-[#E8DDE1] pt-7 leading-8 text-[#74666A]">
                                    {product.description ||
                                        text.descriptionFallback}
                                </p>

                                <div className="mt-8">
                                    <h2 className="font-bold text-[#2B1D1D]">
                                        {text.quantity}
                                    </h2>

                                    <div className="mt-3 flex h-12 w-fit items-center overflow-hidden rounded-full border border-[#D9C8CF] bg-white">
                                        <button
                                            type="button"
                                            onClick={decreaseQuantity}
                                            disabled={quantity === 1}
                                            className="flex h-full w-12 items-center justify-center transition duration-300 hover:bg-[#F3E5EA] disabled:cursor-not-allowed disabled:opacity-40"
                                        >
                                            <Minus className="h-4 w-4" />
                                        </button>

                                        <span className="flex h-full min-w-12 items-center justify-center border-x border-[#D9C8CF] px-4 font-bold text-[#2B1D1D]">
                                            {quantity}
                                        </span>

                                        <button
                                            type="button"
                                            onClick={increaseQuantity}
                                            disabled={
                                                !product.availableForSale ||
                                                quantity === 99
                                            }
                                            className="flex h-full w-12 items-center justify-center transition duration-300 hover:bg-[#F3E5EA] disabled:cursor-not-allowed disabled:opacity-40"
                                        >
                                            <Plus className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                                    <button
                                        type="button"
                                        onClick={handleAddToCart}
                                        disabled={
                                            !product.availableForSale ||
                                            !product.variantId ||
                                            cartActionLoading
                                        }
                                        className="flex min-h-14 items-center justify-center gap-2 rounded-full bg-[#731D46] px-6 py-3 font-bold text-white transition duration-300 hover:bg-[#D4A037] disabled:cursor-not-allowed disabled:bg-[#CDB7C1]"
                                    >
                                        {cartActionLoading ? (
                                            <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                        ) : (
                                            <ShoppingBag className="h-5 w-5" />
                                        )}

                                        <span>
                                            {cartActionLoading
                                                ? text.addingToCart
                                                : text.addToCart}
                                        </span>
                                    </button>

                                    <button
                                        type="button"
                                        disabled={!product.availableForSale}
                                        className="min-h-14 rounded-full border-2 border-[#731D46] px-6 py-3 font-bold text-[#731D46] transition duration-300 hover:bg-[#731D46] hover:text-white disabled:cursor-not-allowed disabled:border-[#CDB7C1] disabled:text-[#CDB7C1] disabled:hover:bg-transparent"
                                    >
                                        {text.buyNow}
                                    </button>
                                </div>

                                {message && (
                                    <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
                                        <Check className="h-4 w-4 shrink-0" />
                                        <span>{message}</span>
                                    </div>
                                )}

                                {cartError && (
                                    <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
                                        {cartError}
                                    </div>
                                )}

                                <div className="mt-8 grid gap-4 border-t border-[#E8DDE1] pt-7 sm:grid-cols-3">
                                    <div className="flex items-start gap-3">
                                        <Truck className="mt-0.5 h-5 w-5 shrink-0 text-[#731D46]" />

                                        <div>
                                            <p className="text-sm font-bold text-[#2B1D1D]">
                                                {text.delivery}
                                            </p>

                                            <p className="mt-1 text-xs leading-5 text-[#74666A]">
                                                {text.deliveryText}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#731D46]" />

                                        <div>
                                            <p className="text-sm font-bold text-[#2B1D1D]">
                                                {text.secure}
                                            </p>

                                            <p className="mt-1 text-xs leading-5 text-[#74666A]">
                                                {text.secureText}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Check className="mt-0.5 h-5 w-5 shrink-0 text-[#731D46]" />

                                        <div>
                                            <p className="text-sm font-bold text-[#2B1D1D]">
                                                {text.quality}
                                            </p>

                                            <p className="mt-1 text-xs leading-5 text-[#74666A]">
                                                {text.qualityText}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="mt-8 rounded-3xl border border-[#E8DDE1] bg-white p-6 shadow-[0_15px_50px_rgba(62,28,43,0.06)] sm:p-8">
                        <h2 className="text-2xl font-black text-[#2B1D1D]">
                            {text.details}
                        </h2>

                        <p className="mt-4 max-w-4xl leading-8 text-[#74666A]">
                            {product.description ||
                                text.descriptionFallback}
                        </p>
                    </section>
                </div>
            </main>

            <Footer />
        </>
    );
};

export default ProductDetailsPage;