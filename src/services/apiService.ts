import { api } from "./api";

export const getCountry = async () => {
    const response = await api.get("/country");
  
    return response.data;
};

export const getLanguage = async () => {
    const response = await api.get("/language");
  
    return response.data;
};
  
export const translateText = async ({text, targetLang} : {text:string,targetLang:string}) => {
    try {
        const response = await fetch('https://api-free.deepl.com/v2/translate', {
            method: 'POST',
            headers: {
                'Authorization': `DeepL-Auth-Key ${process.env.DEEPL_AUTH_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: [text],
                target_lang: targetLang,
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("data",data);
        if (data.translations) {
            return data.translations[0].text;
        } else {
            throw new Error('No translations found');
        }
    } catch (error) {
        console.error('Error translating text:', error);
        throw error;
    }
};

export const transleMeaning = async ({text, targetLang} : {text:string,targetLang:string}) =>{
    const cleanedResponse = text.replace(/^- | -$/g, '');

    try {
        const response = await fetch('https://api-free.deepl.com/v2/translate', {
            method: 'POST',
            headers: {
                'Authorization': `DeepL-Auth-Key ${process.env.DEEPL_AUTH_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: [cleanedResponse],
                target_lang: targetLang,
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("data",data);
        if (data.translations) {
            return data.translations[0].text;
        } else {
            throw new Error('No translations found');
        }
    } catch (error) {
        console.error('Error translating text:', error);
        throw error;
    }
}