import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useUserStore } from '../store/useUserStore';


export default function ProtectProvider({ children }: any) {
    
    const { i18n } = useTranslation();
    const { spokenLanguageCode } = useUserStore();

    useEffect(() => {
        Auth();
    }, []);

    async function Auth() {
        
        i18n.changeLanguage(spokenLanguageCode);


    }
    
    return children;
}