"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function MetaPixel() {
    const pathname = usePathname();
    const initialized = useRef(false);

    useEffect(() => {
        const initPixel = async () => {
            try {
                const locale =
                    pathname?.split("/").filter(Boolean)[0] || "en";

                const response = await fetch(
                    `/api/meta-pixel?locale=${locale}`,
                    { cache: "no-store" }
                );

                const result = await response.json();

                if (
                    !result.success ||
                    !result.data?.enabled ||
                    !result.data?.pixelId
                ) {
                    return;
                }

                const pixelId = result.data.pixelId;

                if (!window.fbq) {
                    !(function (f, b, e, v, n, t, s) {
                        if (f.fbq) return;
                        n = f.fbq = function () {
                            n.callMethod
                                ? n.callMethod.apply(n, arguments)
                                : n.queue.push(arguments);
                        };
                        if (!f._fbq) f._fbq = n;
                        n.push = n;
                        n.loaded = true;
                        n.version = "2.0";
                        n.queue = [];
                        t = b.createElement(e);
                        t.async = true;
                        t.src = v;
                        s = b.getElementsByTagName(e)[0];
                        s.parentNode.insertBefore(t, s);
                    })(
                        window,
                        document,
                        "script",
                        "https://connect.facebook.net/en_US/fbevents.js"
                    );
                }

                if (!initialized.current) {
                    window.fbq("init", pixelId);
                    initialized.current = true;
                }

                window.fbq("track", "PageView");
            } catch (error) {
                console.error(error);
            }
        };

        initPixel();
    }, []);

    useEffect(() => {
        if (initialized.current && window.fbq) {
            window.fbq("track", "PageView");
        }
    }, [pathname]);

    return null;
}