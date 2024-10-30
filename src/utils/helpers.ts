import Toast, { ToastType } from "react-native-toast-message";

export const showToast = (
  type: ToastType,
  text1: string | undefined,
  text2: string | undefined,
  visibilityTime?: number
) => {
  Toast.show({
    type,
    text1,
    text2,
    swipeable: true,
    text1Style: { fontSize: 18 },
    text2Style: { fontSize: 12 },
    visibilityTime,
  });
};

export const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const imageMap: { [key: string]: any } = {
  "1": require("../../assets/profile-images/1.jpeg"),
  "2": require("../../assets/profile-images/2.jpeg"),
  "3": require("../../assets/profile-images/3.jpeg"),
  "4": require("../../assets/profile-images/4.jpeg"),
  "5": require("../../assets/profile-images/5.jpeg"),
  "6": require("../../assets/profile-images/6.jpeg"),
  "7": require("../../assets/profile-images/7.jpeg"),
  "8": require("../../assets/profile-images/8.jpeg"),
};

export const getImageSource = (imageUrl: string) => {
  return (
    imageMap[imageUrl] || require("../../assets/profile-images/1.jpeg")
  ); 
};
