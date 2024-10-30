// src/store/useUserStore.ts
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface UserState {
  spokenLanguageId: number;
  languageId: number;
  countryId: number;
  spokenLanguageCode: string;
  setSpokenLanguageCode: (spokenLanguageCode: string) => void;
  setSpokenLanguageId: (spokenLanguageId: number) => void;
  setLanguageId: (languageId: number) => void;
  setCountryId: (countryId: number) => void;
}

export const useUserStore = create(
  persist<UserState>(
    (set) => ({
      spokenLanguageId: 1,
      languageId: 1,
      countryId: 1,
      spokenLanguageCode:"en",
      setSpokenLanguageCode: (spokenLanguageCode) => {
        set({ spokenLanguageCode });
      },
      setSpokenLanguageId: (spokenLanguageId) => {
        set({ spokenLanguageId });
      },
      setLanguageId: (languageId) => {
        set({ languageId });
      },
      setCountryId: (countryId) => {
        set({ countryId });
      },
    }),
    {
      name: "user-storage", // Name of the item in AsyncStorage
      storage: createJSONStorage(() => AsyncStorage), // Use AsyncStorage for persistence
    }
  )
);
