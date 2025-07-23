import React, { useEffect, useState } from "react";
import { alertActions } from "../redux/AlertController";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "../redux/userState";

export const useMyAccount = () => {
    const [attendanceChartData,setAttendanceChartData] = useState([])
    const dispatch = useDispatch()
    const user = useSelector(state => state.userController.user)
    const [allSubs,setAllSubs] = useState([])
    const [currentSub,setCurrentSub] = useState(null)

    const sendStopRequest = async (startDate,endDate,reason,setModal) => {
        if(startDate ==='' || endDate === ''){
            dispatch(alertActions.showAlert({msg:'تأكد من ملئ الحقول اللازمة!',type:'warrning'}))
        }else if(new Date(startDate) > new Date(endDate)){
            dispatch(alertActions.showAlert({msg:'تأكد من إختيار توقيت صالح!',type:'warrning'}))
        }else {
            try {
                const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/my-account/send-pause-request`,{
                    method:'POST',
                    body:JSON.stringify({startDate,endDate,reason}),
                    headers: {
                        'Content-Type': 'application/json',
                        'authorization': `bearer ${user?.token}`
                    }
                })
                const json = await res.json()
                if(res.status === 400 || res.status === 401) {
                    dispatch(alertActions.showAlert({msg:json.message,type:'error'}))
                }else {
                    dispatch(alertActions.showAlert({msg:'تم إستلام طلبك وجاري التحقق',type:'success'}))
                    setModal(false)
                }
            }catch(err){
                dispatch(alertActions.showAlert({msg:err.message,type:'error'}))
            }
        }
    }

    const changeData = async (phone,email,password,setModal) => {
        if(password === ''){
            dispatch(alertActions.showAlert({msg:'تأكد من إدخال الرمز!',type:'warrning'}))
        }else if(phone === '' && email === ''){
            dispatch(alertActions.showAlert({msg:'تأكد من ملئ أحد الحقول!',type:'warrning'}))
        }else {
            try {
                const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/my-account/chnage-user-data`,{
                    method:'PUT',
                    body:JSON.stringify({phone,email,password}),
                    headers: {
                        'Content-Type': 'application/json',
                        'authorization': `bearer ${user?.token}`
                    }
                })
                const json = await res.json()
                if(res.status === 400 || res.status === 401) {
                    dispatch(alertActions.showAlert({msg:json.message,type:'error'}))
                }else {
                    const { email:newEmail,phone:newPhone } = json
                    dispatch(alertActions.showAlert({msg:'تم تعديل البيانات بنجاح',type:'success'}))
                    const newUserData = {
                        username:user.username,
                        token:user.token,
                        phoneNumber:newPhone,
                        email:newEmail,
                        userNumber:user.userNumber,
                        status:user.status
                    }
                    dispatch(userActions.setUserData({
                        ...newUserData
                    }))
                    localStorage.setItem('user',JSON.stringify(newUserData))
                    setModal(false)
                }
            }catch(err){
                dispatch(alertActions.showAlert({msg:err.message,type:'error'}))
            }
        }
    }

    const subsData = async () => {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/my-account/get-subsriptions`,{
                method:'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `bearer ${user?.token}`
                }
            })
            const json = await res.json()
            if(res.status === 400) {
                dispatch(alertActions.showAlert({msg:json.message,type:'error'}))
            }else {
                const { subs,currentSubscription,userAttendance } = json
                setAttendanceChartData(userAttendance.data)
                setAllSubs(subs)
                setCurrentSub(currentSubscription)
            }
        }catch(err){
            dispatch(alertActions.showAlert({msg:err.message,type:'error'}))
        }
    }




    useEffect(()=>{
        if(user?.token){
            subsData()
        }
    },[user?.token])
    return {sendStopRequest,changeData,allSubs,currentSub,attendanceChartData}
}