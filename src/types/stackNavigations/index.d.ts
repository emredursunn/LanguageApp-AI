type RootStackParamList = {
    Splash: undefined;
    Tab: undefined,
    EmailConfirm: undefined,
    CodeConfirm: {
        email:string,
        mode: "VERIFY" | "RESET"
    },
    StoryInfo:undefined
    NewPassword:{
        email:string,
    }
    FirstInfo:undefined,
    Story:undefined
};

export type TabStackParamList = {
    Home: undefined,
    Profile: undefined,
    Settings:undefined,
    PersonalInformation:undefined,
    SavedWordsMenu:undefined,
    SavedWordsList:{
        languageId:number,
        language:string,
    },
    LearntWordsMenu:undefined,
    LearntWordsList: {
        languageId:number,
        language:string,
    },
    Login:undefined,
    Register:undefined
}