import i18n from "i18next";
import { initReactI18next } from "react-i18next";


import translationEn from "./locales/en.json";
import translationTr from "./locales/tr.json";


i18n
.use(initReactI18next)
.init({
    compatibilityJSON: "v3",
    fallbackLng:"tr",
    lng:"tr",
    debug: false,
    resources:{
        tr: {
            translation: translationTr
        },
        en: {
            translation: translationEn
        }
    }
});

export default i18n;