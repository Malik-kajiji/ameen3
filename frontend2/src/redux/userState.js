import { createSlice } from '@reduxjs/toolkit';

export const userController = createSlice({
    name:'userController',
    initialState:{user:null},
    reducers: {
        setUserData(state,action){
            state.user = {
                username:action.payload.username,
                token:action.payload.token,
                phoneNumber:action.payload.phoneNumber,
                email:action.payload.email,
                userNumber:action.payload.userNumber,
                status:action.payload.status,
            }
        },
        clearData(state,payload){
            state.user = null
        },
    }
}) 


export const userActions = userController.actions