import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userInfo:{
        token: null,
        id: null
    } as any,
    image:"",
    lang: "tr"
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<any>) => {
            state.userInfo = action.payload;
        },
        setUserImage: (state, action: PayloadAction<any>) => {
            state.userInfo = {...state.userInfo, image:action.payload};
        },
        
        updateUser: (state, action: PayloadAction<any>) => {
            console.log("action payload", action.payload);
            state.userInfo = { 
                userId: state.userInfo.userId, 
                biography:action.payload.biography, 
                city:action.payload.city, 
                country:action.payload.country,
                email:action.payload.email,
                name:action.payload.name,
                phone:action.payload.phone,
                surname:action.payload.surname,
             };
        },
        logout: (state, action: PayloadAction<any>) => {

            const isLogout = action.payload;""
            
            if(isLogout){
                state.userInfo = {
                    token:null,
                    id:null
                };
            }

           
        },
        setLang: (state, action: PayloadAction<any>) => {
            state.lang = action.payload;
        },
        clear: (state) => {
            state.userInfo = {
                token : null,
                id : null
            }
        }
    }

})

export const userSliceActions = {...userSlice.actions}
export default userSlice.reducer