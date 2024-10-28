// src/store/useUserStore.ts
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface UserState {
  spokenLanguageId: number;
  setSpokenLanguageId: (spokenLanguageId: number) => void;
}

export const useUserStore = create(
  persist<UserState>(
    (set) => ({
      spokenLanguageId: 1,
      setSpokenLanguageId: (spokenLanguageId) => {
        set({ spokenLanguageId });
      },
    }),
    {
      name: "user-storage", // Name of the item in AsyncStorage
      storage: createJSONStorage(() => AsyncStorage), // Use AsyncStorage for persistence
    }
  )
);
