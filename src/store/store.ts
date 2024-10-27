import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import userReducer from "./reducer/userSlice"

export const store = configureStore({
    reducer:{
        user: userReducer,
    }
})

export const useAppDispatch = () => useDispatch<typeof store.dispatch>()
export type RootStateType = ReturnType<typeof store.getState>