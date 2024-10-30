// src/store/useAuthStore.ts
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface IAuth {
  id:number,
  name:string,
  surname:string,
  email:string,
  imageUrl:string,
}

interface AuthState {
  auth: IAuth | null;
  token: string | null;
  setToken: (token: string | null) => void;
  setAuth: (auth: IAuth | null) => void;
  logout: () => void;
}

export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      auth: null,
      token: null,
      setToken: (token) => {
        set({ token });
      },
      setAuth: (auth) => {
        set({ auth });
      },
      logout: () => {
        set({ auth: null, token: null });
      },
    }),
    {
      name: "auth-storage", // Name of the item in AsyncStorage
      storage: createJSONStorage(() => AsyncStorage), // Use AsyncStorage for persistence
    }
  )
);