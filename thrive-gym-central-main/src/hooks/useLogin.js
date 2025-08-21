import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { userActions } from '../redux/userState';
import { alertActions } from '../redux/AlertController';
// import Store from 'electron-store'


const useLogin = () => {
    // const userStore = new Store()
    const [loading,setLoading] = useState(false);
    const dispatch = useDispatch()

    // const adminLogin = async (username,password)=>{
    //     setLoading(true)
    //     try {
    //         const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/admins/login`,{
    //             method:'POST',
    //             body: JSON.stringify({username,password}),
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             }
    //         })
    //         const json = await res.json();

    //         if(res.ok){
    //             localStorage.setItem('user',JSON.stringify(json))
    //             dispatch(alertActions.showAlert({msg:'تم الدخول بنجاح',type:'success'}))
    //             dispatch(userActions.setUserData({
    //                 username:json.username,
    //                 token:json.token,
    //                 access:json.access
    //             }))
    //         }else {
    //             dispatch(alertActions.showAlert({msg:json.message,type:'error'}));
    //         }
    //     }catch(err){
    //         dispatch(alertActions.showAlert({msg:err.message,type:'error'}));
    //     }
    //     setLoading(false)
    // }

    const BASE_URL = import.meta.env.VITE_API_BASE_URL

    const login = async (username, password) => {
        setLoading(true)
        try {
            // Try admin login first
            let res = await fetch(`${BASE_URL}/admin/login`, {
                method: 'POST',
                body: JSON.stringify({ username, password }),
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            // If admin login fails, try owner login
            if (!res.ok && res.status === 400) {
                res = await fetch(`${BASE_URL}/owner/login`, {
                    method: 'POST',
                    body: JSON.stringify({ username, password }),
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });
            }

            const json = await res.json();

            if (res.ok) {
                localStorage.setItem('user', JSON.stringify(json))
                dispatch(alertActions.showAlert({ msg: 'تم الدخول بنجاح', type: 'success' }))
                dispatch(userActions.setUserData({
                    username: json.username,
                    token: json.token,
                    access: json.access
                }))
            } else {
                dispatch(alertActions.showAlert({ msg: json.message, type: 'error' }));
            }
        } catch (err) {
            dispatch(alertActions.showAlert({ msg: err.message, type: 'error' }));
        }
        setLoading(false)
    }

    return { loading, login }
}

export default useLogin