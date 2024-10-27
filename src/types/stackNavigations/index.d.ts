type RootStackParamList = {
    Splash: undefined;
    Tab: undefined,
    EmailConfirm: undefined,
    CodeConfirm: {
        email:string,
        mode: "VERIFY" | "RESET"
    },
    NewPassword:{
        email:string,
    }
    FirstInfo:undefined
};

export type TabStackParamList = {
    Home: undefined,
    Profile: undefined,
    Login:undefined,
    Register:undefined
}