import i18n from "i18next";
import { initReactI18next } from "react-i18next";
//
import enLocales from "./langs/en";
import hiLocales from "./langs/hi";
import { defaultLang } from "./config-lang";

// ----------------------------------------------------------------------

let lng = defaultLang.value;

i18n.use(initReactI18next).init({
  compatibilityJSON: "v3",
  resources: {
    en: { translations: enLocales },
    hi: { translations: hiLocales },
  },
  lng,
  fallbackLng: defaultLang.value,
  debug: false,
  ns: ["translations"],
  defaultNS: "translations",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
