import Link from "next/link";

const cleanWhatsAppNumber = (number = "") => {
    return String(number).replace(/\D/g, "");
};

const WhatsAppBanner = ({
    banner,
    locale = "en",
}) => {
    if (!banner?.showBanner) {
        return null;
    }

    const whatsappNumber = cleanWhatsAppNumber(
        banner.whatsappNumber
    );

    const whatsappLink = whatsappNumber
        ? `https://wa.me/${whatsappNumber}`
        : null;

    const isArabic = locale === "ar";

    return (
        <section
            dir={isArabic ? "rtl" : "ltr"}
            className="w-full px-3 py-3 sm:px-5 sm:py-4"
            style={{
                backgroundColor:
                    banner.backgroundColor || "#25D366",
            }}
        >
            <div className="mx-auto max-w-7xl">
                <div className="flex flex-col gap-3 rounded-xl border border-white/20 bg-black/10 px-4 py-4 text-white shadow-sm sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6">
                    <div className="flex min-w-0 flex-1 items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#128C7E] shadow-sm">
                            <svg
                                viewBox="0 0 32 32"
                                aria-hidden="true"
                                className="h-5 w-5"
                                fill="currentColor"
                            >
                                <path d="M16.04 3C9.42 3 4 8.3 4 14.83c0 2.08.55 4.11 1.6 5.9L4 29l8.5-2.2a12.1 12.1 0 0 0 3.54.53C22.67 27.33 28 22 28 15.43 28 8.87 22.67 3 16.04 3Zm0 21.93c-1.1 0-2.18-.18-3.2-.54l-.46-.16-5.05 1.3.98-4.87-.3-.5a9.42 9.42 0 0 1-1.45-5.02c0-5.17 4.26-9.37 9.5-9.37 5.25 0 9.5 4.2 9.5 9.37 0 5.16-4.25 9.36-9.5 9.36Zm5.2-7.03c-.28-.14-1.66-.81-1.92-.9-.26-.1-.45-.14-.64.14-.19.28-.74.9-.9 1.08-.17.19-.33.21-.61.07-.28-.14-1.18-.43-2.24-1.38-.83-.73-1.39-1.63-1.55-1.9-.16-.28-.02-.43.12-.57.13-.13.28-.33.42-.5.14-.17.19-.28.28-.47.1-.19.05-.35-.02-.5-.07-.14-.64-1.53-.88-2.1-.23-.56-.47-.48-.64-.49h-.55c-.19 0-.5.07-.76.35-.26.28-1 1-1 2.43s1.03 2.81 1.17 3c.14.19 2.02 3.08 4.9 4.32.69.3 1.22.48 1.64.61.69.22 1.32.19 1.82.11.55-.08 1.66-.67 1.9-1.32.23-.65.23-1.2.16-1.32-.07-.12-.26-.19-.54-.33Z" />
                            </svg>
                        </div>

                        <div className="min-w-0 flex-1">
                            {banner.heading && (
                                <h2 className="text-base font-bold leading-6 sm:text-lg">
                                    {banner.heading}
                                </h2>
                            )}

                            {banner.description && (
                                <p className="mt-1 max-w-3xl text-sm leading-5 text-white/90 sm:text-[15px] sm:leading-6">
                                    {banner.description}
                                </p>
                            )}
                        </div>
                    </div>

                    {banner.buttonText && whatsappLink && (
                        <Link
                            href={whatsappLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex min-h-10 w-full shrink-0 items-center justify-center rounded-lg bg-white px-5 py-2.5 text-sm font-bold text-[#128C7E] shadow-sm transition duration-200 hover:bg-white/90 sm:w-auto"
                        >
                            {banner.buttonText}
                        </Link>
                    )}
                </div>
            </div>
        </section>
    );
};

export default WhatsAppBanner;