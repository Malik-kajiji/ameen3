import React from 'react'
import { useDispatch } from 'react-redux';
import { userActions } from '../redux/userState';
import { alertActions } from '../redux/AlertController';
// import Store from 'electron-store'

const useLogout = () => {
    // const userStore = new Store()
    const dispatch = useDispatch()
    const logout = () => {
        localStorage.clear()
        // userStore.set('user',null)
        dispatch(userActions.clearData({}))
        dispatch(alertActions.showAlert({msg:'تم تسجيل الخروج بنجاح',type:'success'}));
    }

    return {logout}
}

export default useLogout