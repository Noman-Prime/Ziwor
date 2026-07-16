import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

import enMessages from "../messages/en.json";
import arMessages from "../messages/ar.json";

const messages = {
    en: enMessages,
    ar: arMessages,
};

export default getRequestConfig(async ({ requestLocale }) => {
    const requestedLocale = await requestLocale;

    const locale = hasLocale(routing.locales, requestedLocale)
        ? requestedLocale
        : routing.defaultLocale;

    return {
        locale,
        messages: messages[locale],
    };
});