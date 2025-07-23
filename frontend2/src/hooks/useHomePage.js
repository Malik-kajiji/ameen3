import React, { useEffect, useState } from "react";
import { alertActions } from "../redux/AlertController";
import { useDispatch, useSelector } from "react-redux";

export const useHomePage = () => {
    const [trainingDays,setTrainingDays] = useState([])
    const [packages,setPackages] = useState([])
    const dispatch = useDispatch()

    const getData = async () => {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/user/get-home-page-data`,{
                method:'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            const json = await res.json()
            if(res.status === 400) {
                dispatch(alertActions.showAlert({msg:json.message,type:'error'}))
            }else {
                setTrainingDays(json.trainingSchedual)
                setPackages(json.packages)
            }
        }catch(err){
            dispatch(alertActions.showAlert({msg:err.message,type:'error'}))
        }
    }

    // const getData = async () => {
    //     setIsLoading(true)
    //     try {
    //         const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/g-admin-ordering/get-orders`,{
    //             method:'GET',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'authorization': `bearer ${user?.token}`
    //             }
    //         })
    //         const json = await res.json()
    //         if(res.status === 401){
    //             logout()
    //         }else if(res.status === 400) {
    //             dispatch(alertActions.showAlert({msg:json.message,type:'error'}))
    //         }else {
    //             setAllOrders(json.orders)
    //         }
    //     }catch(err){
    //         dispatch(alertActions.showAlert({msg:err.message,type:'error'}))
    //     }
    //     setIsLoading(false)
    // }




    useEffect(()=>{
        getData()
    },[])
    return {trainingDays,packages}
}