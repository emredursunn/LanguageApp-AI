import { useTranslation } from "react-i18next";

export default function(keyPrefix: string) {
    const { t, i18n } = useTranslation("translation", { keyPrefix });

    return { t, i18n };
}