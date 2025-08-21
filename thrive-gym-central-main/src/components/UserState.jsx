import { userActions } from '../redux/userState'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
// import Store from 'electron-store'

const UserState = () => {
    // const userStore = new Store()
    const navigate = useNavigate()
    const dispatch = useDispatch();
    // const user = useSelector(state => state.userController.user)


    // useEffect(()=> {
    //     if(!user){
    //         navigate('/login')
    //     }
    // },[user])

    useEffect(()=>{
        // const data = userStore.get('user')
        const data = JSON.parse(localStorage.getItem('user'))
        if(data){
            dispatch(userActions.setUserData({
                username: data.username,
                token: data.token,
                access: data.access
            }))
        }else {
            navigate('/login')
        }
    },[])
    return (
        <></>
    )
}

export default UserState