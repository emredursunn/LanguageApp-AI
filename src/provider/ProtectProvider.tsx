import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Loading from '../components/common/Loading';
import { useUserStore } from '../store/useUserStore';


export default function ProtectProvider({ children }: any) {
    
    
    const [loading, setLoading] = useState(true);
    const { i18n } = useTranslation();

    useEffect(() => {
        Auth();
    }, []);

    async function Auth() {
        const { spokenLanguageCode } = useUserStore();

        if(spokenLanguageCode){
            i18n.changeLanguage(spokenLanguageCode);
            console.log("SPOKEN", spokenLanguageCode);
        }

        setLoading(false);
    }
    
    
    if(loading) {
        return <Loading />
    }

    return children;
}