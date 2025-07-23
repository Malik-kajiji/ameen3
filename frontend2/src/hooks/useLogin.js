import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { userActions } from '../redux/userState';
import { alertActions } from '../redux/AlertController';
import { useNavigate } from 'react-router-dom';


const useLogin = () => {
    const [loading,setLoading] = useState(false);
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const login = async (email,password)=>{
        setLoading(true)
        try {
            const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/user/login`,{
                method:'POST',
                body: JSON.stringify({email,password}),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const json = await res.json();

            if(res.ok){
                localStorage.setItem('user',JSON.stringify(json))
                dispatch(alertActions.showAlert({msg:'تم الدخول بنجاح',type:'success'}))
                dispatch(userActions.setUserData({
                    username:json.username,
                    token:json.token,
                    phoneNumber:json.phoneNumber,
                    email:json.email,
                    userNumber:json.userNumber,
                    status:json.status
                }))
                navigate('/myaccount')
            }else {
                dispatch(alertActions.showAlert({msg:json.message,type:'error'}));
            }
        }catch(err){
            dispatch(alertActions.showAlert({msg:err.message,type:'error'}));
        }
        setLoading(false)
    }


    return {loading,login}
}

export default useLogin