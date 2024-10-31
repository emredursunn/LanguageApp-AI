import i18n from "i18next";
import { initReactI18next } from "react-i18next";


import translationDe from "./locales/de.json";
import translationEn from "./locales/en.json";
import translationEs from "./locales/es.json";
import translationFr from "./locales/fr.json";
import translationHi from "./locales/hi.json";
import translationIt from "./locales/it.json";
import translationJa from "./locales/ja.json";
import translationPt from "./locales/pt.json";
import translationRu from "./locales/ru.json";
import translationTh from "./locales/th.json";
import translationTr from "./locales/tr.json";
import translationVi from "./locales/vi.json";


i18n
.use(initReactI18next)
.init({
    compatibilityJSON: "v3",
    fallbackLng:"tr",
    lng:"tr",
    debug: false,
    resources:{
        de: {
            translation: translationDe
        },
        en: {
            translation: translationEn
        },
        es: {
            translation: translationEs
        },
        fr: {
            translation: translationFr
        },
        hi: {
            translation: translationHi
        },
        it: {
            translation: translationIt
        },
        ja: {
            translation: translationJa
        },
        pt: {
            translation: translationPt
        },
        ru: {
            translation: translationRu
        },
        th: {
            translation: translationTh
        },
        tr: {
            translation: translationTr
        },
        vi: {
            translation: translationVi
        },
    }
});

export default i18n;