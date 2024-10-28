import Toast, { ToastType } from "react-native-toast-message";

export const showToast = (
    type: ToastType,
    text1: string | undefined,
    text2: string | undefined,
    visibilityTime?:number
  ) => {
    Toast.show({
      type,
      text1,
      text2,
      swipeable: true,
      text1Style: { fontSize: 18 },
      text2Style: { fontSize: 12 },
      visibilityTime
    });
  };

  export const validateEmail = (email:string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };