import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const BASE_URL = process.env.BASE_URL;

export const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    }
});


// Token'ı interceptor kullanarak ekle
api.interceptors.request.use(
    async (config) => {
      const storage = await AsyncStorage.getItem("auth-storage");
      if (storage) {
        const parsedStorage = JSON.parse(storage);
        if (parsedStorage && parsedStorage.state && parsedStorage.state.token) {
          config.headers.Authorization = `Bearer ${parsedStorage.state.token}`;
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );