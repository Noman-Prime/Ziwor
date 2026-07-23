"use client";

import Image from "next/image";
import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
    ArrowLeft,
    ArrowRight,
    Check,
    ChevronLeft,
    ChevronRight,
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

const ProductDetailsPage = () => {
    const params = useParams();
    const locale = useLocale();
    const t = useTranslations("ProductDetailsPage");
    const isArabic = locale.toLowerCase().startsWith("ar");

    const {
        addToCart,
        buyNow,
        cartActionLoading,
    } = useCart();

    const messageTimeoutRef = useRef(null);
    const thumbnailsRef = useRef(null);

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [buyNowLoading, setBuyNowLoading] = useState(false);
    const [error, setError] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [message, setMessage] = useState("");
    const [cartError, setCartError] = useState("");
    const [selectedOptions, setSelectedOptions] = useState({});
    const [selectedImageUrl, setSelectedImageUrl] = useState("");

    const productIdentifier = Array.isArray(params.id)
        ? params.id[0]
        : params.id;

    const initializeSelectedOptions = useCallback((currentProduct) => {
        const variants = Array.isArray(currentProduct?.variants)
            ? currentProduct.variants
            : [];

        const defaultVariant =
            variants.find((variant) => variant.availableForSale) ||
            variants[0] ||
            null;

        if (!defaultVariant) {
            setSelectedOptions({});
            return;
        }

        const initialOptions = {};

        defaultVariant.selectedOptions?.forEach((option) => {
            initialOptions[option.name] = option.value;
        });

        setSelectedOptions(initialOptions);
    }, []);

    const getProduct = useCallback(async () => {
        if (!productIdentifier) {
            setProduct(null);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError("");
            setProduct(null);
            setQuantity(1);
            setMessage("");
            setCartError("");
            setSelectedOptions({});
            setSelectedImageUrl("");

            const response = await fetch(
                `/api/products?locale=${encodeURIComponent(locale)}`,
                {
                    method: "GET",
                    cache: "no-store",
                }
            );

            const data = await response.json().catch(() => null);

            if (!response.ok || !data?.success) {
                throw new Error(
                    data?.message || t("errors.fetch")
                );
            }

            const products = Array.isArray(data.products)
                ? data.products
                : [];

            const currentProduct = products.find(
                (item) =>
                    String(item.handle) === String(productIdentifier) ||
                    String(item.id) === String(productIdentifier)
            );

            if (!currentProduct) {
                setProduct(null);
                return;
            }

            setProduct(currentProduct);
            initializeSelectedOptions(currentProduct);

            const firstImage =
                currentProduct.images?.[0] ||
                currentProduct.image ||
                currentProduct.variants?.[0]?.image ||
                null;

            setSelectedImageUrl(firstImage?.url || "");
        } catch (fetchError) {
            setProduct(null);
            setError(
                fetchError instanceof Error
                    ? fetchError.message
                    : t("errors.fetch")
            );
        } finally {
            setLoading(false);
        }
    }, [
        initializeSelectedOptions,
        locale,
        productIdentifier,
        t,
    ]);

    useEffect(() => {
        getProduct();
    }, [getProduct]);

    useEffect(() => {
        return () => {
            if (messageTimeoutRef.current) {
                window.clearTimeout(messageTimeoutRef.current);
            }
        };
    }, []);

    const selectedVariant = useMemo(() => {
        const variants = Array.isArray(product?.variants)
            ? product.variants
            : [];

        if (!variants.length) {
            return null;
        }

        return (
            variants.find((variant) =>
                (variant.selectedOptions || []).every(
                    (option) =>
                        selectedOptions[option.name] === option.value
                )
            ) || null
        );
    }, [product, selectedOptions]);

    const displayedVariant =
        selectedVariant ||
        product?.variants?.find(
            (variant) => variant.id === product?.variantId
        ) ||
        product?.variants?.[0] ||
        null;

    const displayedPrice =
        displayedVariant?.price ??
        product?.price;

    const displayedOldPrice =
        displayedVariant?.oldPrice ??
        product?.oldPrice;

    const displayedCurrencyCode =
        displayedVariant?.currencyCode ||
        product?.currencyCode ||
        "QAR";

    const galleryImages = useMemo(() => {
        const productImages = Array.isArray(product?.images)
            ? product.images
            : [];

        const variantImages = Array.isArray(product?.variants)
            ? product.variants
                .map((variant) => variant?.image)
                .filter((image) => image?.url)
            : [];

        const possibleImages = [
            ...productImages,
            product?.image,
            ...variantImages,
            displayedVariant?.image,
        ].filter((image) => image?.url);

        return possibleImages.filter(
            (image, index, images) =>
                images.findIndex(
                    (currentImage) =>
                        currentImage.url === image.url
                ) === index
        );
    }, [
        product?.images,
        product?.image,
        product?.variants,
        displayedVariant?.image,
    ]);

    useEffect(() => {
        const variantImageUrl = displayedVariant?.image?.url;

        if (variantImageUrl) {
            setSelectedImageUrl(variantImageUrl);
            return;
        }

        setSelectedImageUrl((currentImageUrl) => {
            const imageStillExists = galleryImages.some(
                (image) => image.url === currentImageUrl
            );

            if (imageStillExists) {
                return currentImageUrl;
            }

            return galleryImages[0]?.url || "";
        });
    }, [
        displayedVariant?.id,
        displayedVariant?.image?.url,
        galleryImages,
    ]);

    const displayedImage =
        galleryImages.find(
            (image) => image.url === selectedImageUrl
        ) ||
        galleryImages[0] ||
        displayedVariant?.image ||
        product?.image ||
        null;

    const selectedImageIndex = galleryImages.findIndex(
        (image) => image.url === displayedImage?.url
    );

    const productDetails = useMemo(() => {
        const description = String(
            product?.description || ""
        ).trim();

        if (!description) {
            return [];
        }

        const descriptionLines = description
            .split(/\r?\n/)
            .map((line) =>
                line
                    .replace(/^[\s•\-–—*]+/, "")
                    .trim()
            )
            .filter(Boolean);

        if (descriptionLines.length > 1) {
            return descriptionLines;
        }

        return description
            .split(/(?<=[.!?])\s+/)
            .map((sentence) => sentence.trim())
            .filter(Boolean);
    }, [product?.description]);

    const hasOldPrice =
        Number.isFinite(Number(displayedOldPrice)) &&
        Number(displayedOldPrice) > Number(displayedPrice);

    const productAvailable =
        Boolean(selectedVariant) &&
        Boolean(selectedVariant.availableForSale) &&
        Boolean(selectedVariant.id);

    const actionLoading =
        cartActionLoading || buyNowLoading;

    const formatPrice = (value, currencyCode) => {
        const amount = Number(value);
        const currency = currencyCode || "QAR";

        if (!Number.isFinite(amount)) {
            return "";
        }

        try {
            return new Intl.NumberFormat(locale, {
                style: "currency",
                currency,
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }).format(amount);
        } catch {
            return `${currency} ${amount.toFixed(2)}`;
        }
    };

    const isOptionValueAvailable = (
        optionName,
        optionValue
    ) => {
        const variants = Array.isArray(product?.variants)
            ? product.variants
            : [];

        const nextSelection = {
            ...selectedOptions,
            [optionName]: optionValue,
        };

        return variants.some((variant) => {
            if (!variant.availableForSale) {
                return false;
            }

            return (variant.selectedOptions || []).every(
                (option) => {
                    const selectedValue =
                        nextSelection[option.name];

                    if (!selectedValue) {
                        return true;
                    }

                    return selectedValue === option.value;
                }
            );
        });
    };

    const handleOptionChange = (
        optionName,
        optionValue
    ) => {
        if (actionLoading) {
            return;
        }

        setMessage("");
        setCartError("");
        setSelectedOptions((current) => ({
            ...current,
            [optionName]: optionValue,
        }));
        setQuantity(1);
    };

    const decreaseQuantity = () => {
        setQuantity((current) =>
            Math.max(1, current - 1)
        );
    };

    const increaseQuantity = () => {
        setQuantity((current) =>
            Math.min(99, current + 1)
        );
    };

    const showPreviousImage = () => {
        if (galleryImages.length < 2) {
            return;
        }

        const nextIndex =
            selectedImageIndex <= 0
                ? galleryImages.length - 1
                : selectedImageIndex - 1;

        setSelectedImageUrl(galleryImages[nextIndex].url);
    };

    const showNextImage = () => {
        if (galleryImages.length < 2) {
            return;
        }

        const nextIndex =
            selectedImageIndex >= galleryImages.length - 1
                ? 0
                : selectedImageIndex + 1;

        setSelectedImageUrl(galleryImages[nextIndex].url);
    };

    const scrollThumbnails = (direction) => {
        if (!thumbnailsRef.current) {
            return;
        }

        thumbnailsRef.current.scrollBy({
            left: direction === "next" ? 320 : -320,
            behavior: "smooth",
        });
    };

    const handleAddToCart = async () => {
        if (
            !productAvailable ||
            !selectedVariant?.id ||
            actionLoading
        ) {
            setCartError(t("errors.variantUnavailable"));
            return;
        }

        try {
            setMessage("");
            setCartError("");

            await addToCart(
                selectedVariant.id,
                Number(quantity)
            );

            setMessage(t("messages.addedToCart"));

            if (messageTimeoutRef.current) {
                window.clearTimeout(
                    messageTimeoutRef.current
                );
            }

            messageTimeoutRef.current = window.setTimeout(
                () => {
                    setMessage("");
                },
                2500
            );
        } catch (addError) {
            setCartError(
                addError instanceof Error
                    ? addError.message
                    : t("errors.addToCart")
            );
        }
    };

    const handleBuyNow = async () => {
        if (
            !productAvailable ||
            !selectedVariant?.id ||
            actionLoading
        ) {
            setCartError(t("errors.variantUnavailable"));
            return;
        }

        try {
            setBuyNowLoading(true);
            setMessage("");
            setCartError("");

            await buyNow(
                selectedVariant.id,
                Number(quantity)
            );
        } catch (buyError) {
            setCartError(
                buyError instanceof Error
                    ? buyError.message
                    : t("errors.buyNow")
            );
            setBuyNowLoading(false);
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />

                <main
                    dir={isArabic ? "rtl" : "ltr"}
                    className="min-h-screen bg-[#FCF8F6]"
                >
                    <div className="mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-6 md:px-8 lg:px-10 lg:py-12 xl:px-12">
                        <div className="mb-6 h-5 w-64 animate-pulse rounded-full bg-[#E8DDE1]" />

                        <section className="overflow-hidden rounded-3xl border border-[#E8DDE1] bg-white shadow-[0_18px_55px_rgba(62,28,43,0.08)]">
                            <div className="grid lg:grid-cols-2">
                                <div className="border-b border-[#E8DDE1] p-4 sm:p-6 lg:border-b-0 lg:border-e lg:p-8">
                                    <div className="h-[430px] animate-pulse rounded-2xl bg-[#F1E8ED] sm:h-[560px] lg:h-[650px]" />

                                    <div className="mt-4 flex gap-3 overflow-hidden">
                                        {[1, 2, 3, 4].map((item) => (
                                            <div
                                                key={item}
                                                className="h-20 w-20 shrink-0 animate-pulse rounded-xl bg-[#F1E8ED] sm:h-24 sm:w-24"
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div className="p-5 sm:p-8 lg:p-10">
                                    <div className="h-4 w-28 animate-pulse rounded bg-[#F1E8ED]" />
                                    <div className="mt-5 h-10 w-full animate-pulse rounded bg-[#F1E8ED]" />
                                    <div className="mt-3 h-10 w-4/5 animate-pulse rounded bg-[#F1E8ED]" />
                                    <div className="mt-7 h-10 w-44 animate-pulse rounded bg-[#F1E8ED]" />
                                    <div className="mt-7 h-32 w-full animate-pulse rounded-2xl bg-[#F1E8ED]" />
                                    <div className="mt-8 h-14 w-full animate-pulse rounded-xl bg-[#F1E8ED]" />
                                    <p className="mt-5 text-center text-sm font-semibold text-[#74666A]">
                                        {t("loading")}
                                    </p>
                                </div>
                            </div>
                        </section>
                    </div>
                </main>

                <Footer />
            </>
        );
    }

    if (error) {
        return (
            <>
                <Navbar />

                <main
                    dir={isArabic ? "rtl" : "ltr"}
                    className="flex min-h-[70vh] items-center justify-center bg-[#FCF8F6] px-4 py-20"
                >
                    <div
                        role="alert"
                        className="w-full max-w-xl rounded-3xl border border-red-200 bg-white p-8 text-center shadow-[0_15px_50px_rgba(62,28,43,0.08)] sm:p-12"
                    >
                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
                            <PackageSearch className="h-10 w-10 text-red-400" />
                        </div>

                        <h1 className="mt-6 text-2xl font-black text-[#2B1D1D] sm:text-3xl">
                            {t("error.title")}
                        </h1>

                        <p className="mt-3 text-sm leading-7 text-red-500">
                            {error}
                        </p>

                        <button
                            type="button"
                            onClick={getProduct}
                            className="mt-7 inline-flex items-center justify-center rounded-full bg-[#731D46] px-7 py-3 text-sm font-bold text-white transition duration-300 hover:bg-[#D4A037] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#731D46] focus-visible:ring-offset-2"
                        >
                            {t("error.retry")}
                        </button>
                    </div>
                </main>

                <Footer />
            </>
        );
    }

    if (!product) {
        return (
            <>
                <Navbar />

                <main
                    dir={isArabic ? "rtl" : "ltr"}
                    className="flex min-h-[70vh] items-center justify-center bg-[#FCF8F6] px-4 py-20"
                >
                    <div className="w-full max-w-xl rounded-3xl border border-[#E8DDE1] bg-white p-8 text-center shadow-[0_15px_50px_rgba(62,28,43,0.08)] sm:p-12">
                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#F7F0F3]">
                            <ShoppingBag className="h-10 w-10 text-[#A66D87]" />
                        </div>

                        <h1 className="mt-6 text-2xl font-black text-[#2B1D1D] sm:text-3xl">
                            {t("notFound.title")}
                        </h1>

                        <p className="mt-3 leading-7 text-[#74666A]">
                            {t("notFound.description")}
                        </p>

                        <Link
                            href="/products"
                            className="mt-7 inline-flex items-center justify-center gap-2 rounded-full bg-[#731D46] px-7 py-3 text-sm font-bold text-white transition duration-300 hover:bg-[#D4A037] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#731D46] focus-visible:ring-offset-2"
                        >
                            {isArabic ? (
                                <ArrowRight className="h-4 w-4" />
                            ) : (
                                <ArrowLeft className="h-4 w-4" />
                            )}

                            <span>
                                {t("notFound.backToProducts")}
                            </span>
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
                dir={isArabic ? "rtl" : "ltr"}
                className="min-h-screen bg-[#FCF8F6]"
            >
                <div className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 md:px-8 lg:px-10 lg:py-10 xl:px-12">
                    <nav
                        aria-label={t("breadcrumb.label")}
                        className="mb-6 flex flex-wrap items-center gap-2 text-sm text-[#74666A]"
                    >
                        <Link
                            href="/"
                            className="transition duration-300 hover:text-[#731D46]"
                        >
                            {t("breadcrumb.home")}
                        </Link>

                        <ChevronRight
                            aria-hidden="true"
                            className={`h-4 w-4 ${isArabic ? "rotate-180" : ""
                                }`}
                        />

                        <Link
                            href="/products"
                            className="transition duration-300 hover:text-[#731D46]"
                        >
                            {t("breadcrumb.products")}
                        </Link>

                        <ChevronRight
                            aria-hidden="true"
                            className={`h-4 w-4 ${isArabic ? "rotate-180" : ""
                                }`}
                        />

                        <span
                            aria-current="page"
                            className="max-w-[220px] truncate font-semibold text-[#2B1D1D] sm:max-w-md"
                        >
                            {product.title}
                        </span>
                    </nav>

                    <section className="overflow-hidden rounded-3xl border border-[#E8DDE1] bg-white shadow-[0_18px_55px_rgba(62,28,43,0.08)]">
                        <div className="grid items-start lg:grid-cols-2">
                            <div className="border-b border-[#E8DDE1] bg-[#FFFDFC] p-4 sm:p-6 lg:border-b-0 lg:border-e lg:p-8">
                                <div className="relative h-[430px] w-full overflow-hidden rounded-2xl border border-[#E8DDE1] bg-[#F7F1F4] sm:h-[560px] lg:h-[650px]">
                                    {displayedImage?.url ? (
                                        <Image
                                            src={displayedImage.url}
                                            alt={
                                                displayedImage.altText ||
                                                product.title
                                            }
                                            fill
                                            priority
                                            sizes="(max-width: 1024px) 100vw, 50vw"
                                            className="object-contain p-2 sm:p-4"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center">
                                            <PackageSearch className="h-20 w-20 text-[#CDB7C1]" />
                                        </div>
                                    )}

                                    {hasOldPrice && (
                                        <span className="absolute start-4 top-4 z-10 rounded-full bg-[#D4A037] px-4 py-2 text-xs font-extrabold uppercase tracking-wide text-white shadow-md">
                                            {t("product.sale")}
                                        </span>
                                    )}

                                    {galleryImages.length > 1 && (
                                        <>
                                            <button
                                                type="button"
                                                onClick={showPreviousImage}
                                                aria-label="Previous image"
                                                className="absolute start-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/90 text-[#731D46] shadow-md backdrop-blur transition hover:bg-[#731D46] hover:text-white sm:start-5"
                                            >
                                                {isArabic ? (
                                                    <ChevronRight className="h-5 w-5" />
                                                ) : (
                                                    <ChevronLeft className="h-5 w-5" />
                                                )}
                                            </button>

                                            <button
                                                type="button"
                                                onClick={showNextImage}
                                                aria-label="Next image"
                                                className="absolute end-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/90 text-[#731D46] shadow-md backdrop-blur transition hover:bg-[#731D46] hover:text-white sm:end-5"
                                            >
                                                {isArabic ? (
                                                    <ChevronLeft className="h-5 w-5" />
                                                ) : (
                                                    <ChevronRight className="h-5 w-5" />
                                                )}
                                            </button>

                                            <span className="absolute bottom-4 end-4 z-10 rounded-full bg-[#2B1D1D]/75 px-3 py-1.5 text-xs font-bold text-white backdrop-blur">
                                                {selectedImageIndex + 1} /{" "}
                                                {galleryImages.length}
                                            </span>
                                        </>
                                    )}
                                </div>

                                {galleryImages.length > 1 && (
                                    <div className="relative mt-5">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                scrollThumbnails("previous")
                                            }
                                            aria-label="Scroll images backward"
                                            className="absolute start-0 top-1/2 z-20 hidden h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#E8DDE1] bg-white text-[#731D46] shadow-md transition hover:bg-[#731D46] hover:text-white sm:flex"
                                        >
                                            {isArabic ? (
                                                <ChevronRight className="h-4 w-4" />
                                            ) : (
                                                <ChevronLeft className="h-4 w-4" />
                                            )}
                                        </button>

                                        <div
                                            ref={thumbnailsRef}
                                            className="flex w-full gap-3 overflow-x-auto scroll-smooth pb-3"
                                        >
                                            {galleryImages.map(
                                                (image, index) => {
                                                    const isSelected =
                                                        displayedImage?.url ===
                                                        image.url;

                                                    return (
                                                        <button
                                                            key={`${image.url}-${index}`}
                                                            type="button"
                                                            onClick={() =>
                                                                setSelectedImageUrl(
                                                                    image.url
                                                                )
                                                            }
                                                            aria-label={`${product.title} image ${index + 1
                                                                }`}
                                                            aria-pressed={
                                                                isSelected
                                                            }
                                                            className={`relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border-2 bg-white transition duration-300 sm:h-28 sm:w-28 ${isSelected
                                                                    ? "border-[#731D46] shadow-[0_8px_22px_rgba(115,29,70,0.18)]"
                                                                    : "border-[#E8DDE1] hover:border-[#D4A037]"
                                                                }`}
                                                        >
                                                            <Image
                                                                src={image.url}
                                                                alt={
                                                                    image.altText ||
                                                                    `${product.title} ${index +
                                                                    1
                                                                    }`
                                                                }
                                                                fill
                                                                sizes="112px"
                                                                className="object-contain p-1.5"
                                                            />
                                                        </button>
                                                    );
                                                }
                                            )}
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                scrollThumbnails("next")
                                            }
                                            aria-label="Scroll images forward"
                                            className="absolute end-0 top-1/2 z-20 hidden h-9 w-9 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#E8DDE1] bg-white text-[#731D46] shadow-md transition hover:bg-[#731D46] hover:text-white sm:flex"
                                        >
                                            {isArabic ? (
                                                <ChevronLeft className="h-4 w-4" />
                                            ) : (
                                                <ChevronRight className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="flex min-w-0 flex-col p-5 sm:p-8 lg:p-10">
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <p className="text-sm font-bold uppercase tracking-[0.12em] text-[#A66D87]">
                                        {product.category ||
                                            t(
                                                "product.categoryFallback"
                                            )}
                                    </p>

                                    <div
                                        className={`inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${productAvailable
                                                ? "bg-emerald-50 text-emerald-700"
                                                : "bg-red-50 text-red-600"
                                            }`}
                                    >
                                        {productAvailable ? (
                                            <Check className="h-4 w-4" />
                                        ) : (
                                            <PackageSearch className="h-4 w-4" />
                                        )}

                                        <span>
                                            {productAvailable
                                                ? t("product.inStock")
                                                : t("product.outOfStock")}
                                        </span>
                                    </div>
                                </div>

                                <h1 className="mt-4 break-words text-3xl font-black leading-tight tracking-[-0.03em] text-[#2B1D1D] sm:text-4xl lg:text-5xl">
                                    {product.title}
                                </h1>

                                <div className="mt-7 flex flex-wrap items-end gap-3 rounded-2xl border border-[#E8DDE1] bg-[#FCF8F6] p-5">
                                    <span className="text-3xl font-black text-[#731D46] sm:text-4xl">
                                        {formatPrice(
                                            displayedPrice,
                                            displayedCurrencyCode
                                        )}
                                    </span>

                                    {hasOldPrice && (
                                        <span className="pb-1 text-lg font-semibold text-[#B8A4AC] line-through">
                                            {formatPrice(
                                                displayedOldPrice,
                                                displayedCurrencyCode
                                            )}
                                        </span>
                                    )}
                                </div>

                                <div className="mt-6 rounded-2xl border border-[#E8DDE1] bg-white p-5 shadow-[0_8px_25px_rgba(62,28,43,0.04)]">
                                    <h2 className="text-lg font-extrabold text-[#2B1D1D]">
                                        {isArabic
                                            ? "تفاصيل المنتج"
                                            : "Product details"}
                                    </h2>

                                    <ul className="mt-4 space-y-3">
                                        {(productDetails.length
                                            ? productDetails
                                            : [
                                                t(
                                                    "product.descriptionFallback"
                                                ),
                                            ]
                                        ).map((detail, index) => (
                                            <li
                                                key={`${detail}-${index}`}
                                                className="flex items-start gap-3 leading-7 text-[#74666A]"
                                            >
                                                <span className="mt-1.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#F3E5EA]">
                                                    <Check className="h-3 w-3 text-[#731D46]" />
                                                </span>

                                                <span className="min-w-0 break-words">
                                                    {detail}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {Array.isArray(product.options) &&
                                    product.options.map((option) => (
                                        <div
                                            key={option.name}
                                            className="mt-7"
                                        >
                                            <div className="flex items-center justify-between gap-4">
                                                <h2 className="font-bold text-[#2B1D1D]">
                                                    {option.name}
                                                </h2>

                                                {selectedOptions[
                                                    option.name
                                                ] && (
                                                        <span className="rounded-full bg-[#F3E5EA] px-3 py-1 text-sm font-semibold text-[#731D46]">
                                                            {
                                                                selectedOptions[
                                                                option.name
                                                                ]
                                                            }
                                                        </span>
                                                    )}
                                            </div>

                                            <div className="mt-3 flex flex-wrap gap-3">
                                                {(option.values || []).map(
                                                    (value) => {
                                                        const isSelected =
                                                            selectedOptions[
                                                            option.name
                                                            ] === value;

                                                        const isAvailable =
                                                            isOptionValueAvailable(
                                                                option.name,
                                                                value
                                                            );

                                                        return (
                                                            <button
                                                                key={value}
                                                                type="button"
                                                                onClick={() =>
                                                                    handleOptionChange(
                                                                        option.name,
                                                                        value
                                                                    )
                                                                }
                                                                disabled={
                                                                    !isAvailable ||
                                                                    actionLoading
                                                                }
                                                                aria-pressed={
                                                                    isSelected
                                                                }
                                                                className={`min-w-20 rounded-full border px-5 py-2.5 text-sm font-bold transition duration-300 ${isSelected
                                                                        ? "border-[#731D46] bg-[#731D46] text-white shadow-md"
                                                                        : isAvailable
                                                                            ? "border-[#D9C8CF] bg-white text-[#2B1D1D] hover:border-[#731D46] hover:text-[#731D46]"
                                                                            : "cursor-not-allowed border-[#E8DDE1] bg-[#F7F3F5] text-[#B8A4AC] line-through"
                                                                    }`}
                                                            >
                                                                {value}
                                                            </button>
                                                        );
                                                    }
                                                )}
                                            </div>
                                        </div>
                                    ))}

                                <div className="mt-8">
                                    <h2 className="font-bold text-[#2B1D1D]">
                                        {t("product.quantity")}
                                    </h2>

                                    <div className="mt-3 flex h-12 w-fit items-center overflow-hidden rounded-full border border-[#D9C8CF] bg-white">
                                        <button
                                            type="button"
                                            onClick={decreaseQuantity}
                                            disabled={
                                                quantity === 1 ||
                                                actionLoading
                                            }
                                            aria-label={t(
                                                "quantity.decrease"
                                            )}
                                            className="flex h-full w-12 items-center justify-center transition duration-300 hover:bg-[#F3E5EA] disabled:cursor-not-allowed disabled:opacity-40"
                                        >
                                            <Minus className="h-4 w-4" />
                                        </button>

                                        <span
                                            aria-live="polite"
                                            className="flex h-full min-w-14 items-center justify-center border-x border-[#D9C8CF] px-4 font-bold text-[#2B1D1D]"
                                        >
                                            {quantity}
                                        </span>

                                        <button
                                            type="button"
                                            onClick={increaseQuantity}
                                            disabled={
                                                !productAvailable ||
                                                quantity === 99 ||
                                                actionLoading
                                            }
                                            aria-label={t(
                                                "quantity.increase"
                                            )}
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
                                            !productAvailable ||
                                            actionLoading
                                        }
                                        className="flex min-h-14 items-center justify-center gap-2 rounded-full bg-[#731D46] px-6 py-3 font-bold text-white shadow-[0_12px_28px_rgba(115,29,70,0.18)] transition duration-300 hover:bg-[#D4A037] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#731D46] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-[#CDB7C1] disabled:shadow-none"
                                    >
                                        {cartActionLoading &&
                                            !buyNowLoading ? (
                                            <span
                                                aria-hidden="true"
                                                className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white"
                                            />
                                        ) : (
                                            <ShoppingBag className="h-5 w-5" />
                                        )}

                                        <span>
                                            {cartActionLoading &&
                                                !buyNowLoading
                                                ? t("actions.adding")
                                                : t(
                                                    "actions.addToCart"
                                                )}
                                        </span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleBuyNow}
                                        disabled={
                                            !productAvailable ||
                                            actionLoading
                                        }
                                        className="flex min-h-14 items-center justify-center gap-2 rounded-full border-2 border-[#731D46] bg-white px-6 py-3 font-bold text-[#731D46] transition duration-300 hover:bg-[#731D46] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#731D46] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:border-[#CDB7C1] disabled:text-[#CDB7C1] disabled:hover:bg-white"
                                    >
                                        {buyNowLoading ? (
                                            <span
                                                aria-hidden="true"
                                                className="h-5 w-5 animate-spin rounded-full border-2 border-[#731D46]/30 border-t-[#731D46]"
                                            />
                                        ) : (
                                            <ShoppingBag className="h-5 w-5" />
                                        )}

                                        <span>
                                            {buyNowLoading
                                                ? t(
                                                    "actions.redirecting"
                                                )
                                                : t("actions.buyNow")}
                                        </span>
                                    </button>
                                </div>

                                <div
                                    aria-live="polite"
                                    aria-atomic="true"
                                >
                                    {message && (
                                        <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
                                            <Check className="h-4 w-4 shrink-0" />
                                            <span>{message}</span>
                                        </div>
                                    )}

                                    {cartError && (
                                        <div
                                            role="alert"
                                            className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600"
                                        >
                                            {cartError}
                                        </div>
                                    )}
                                </div>

                                <div className="mt-8 grid gap-3 border-t border-[#E8DDE1] pt-7 sm:grid-cols-2">
                                    <div className="flex items-start gap-3 rounded-2xl border border-[#EEE2E7] bg-[#FCF8F6] p-4">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#731D46] shadow-sm">
                                            <Truck className="h-5 w-5" />
                                        </div>

                                        <div>
                                            <p className="font-bold text-[#2B1D1D]">
                                                {isArabic
                                                    ? "توصيل سريع"
                                                    : "Fast delivery"}
                                            </p>

                                            <p className="mt-1 text-sm leading-6 text-[#74666A]">
                                                {isArabic
                                                    ? "يتم تجهيز طلبك وتوصيله بأمان."
                                                    : "Your order is prepared and delivered securely."}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 rounded-2xl border border-[#EEE2E7] bg-[#FCF8F6] p-4">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#731D46] shadow-sm">
                                            <ShieldCheck className="h-5 w-5" />
                                        </div>

                                        <div>
                                            <p className="font-bold text-[#2B1D1D]">
                                                {isArabic
                                                    ? "دفع آمن"
                                                    : "Secure checkout"}
                                            </p>

                                            <p className="mt-1 text-sm leading-6 text-[#74666A]">
                                                {isArabic
                                                    ? "تتم عملية الدفع من خلال صفحة الدفع الآمنة الخاصة بشوبيفاي."
                                                    : "Payment is completed through Shopify Checkout."}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            <Footer />
        </>
    );
};

export default ProductDetailsPage;