import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { alertActions } from '../redux/AlertController';

export const useAdmin = () => {
    const [admins, setAdmins] = useState([]);
    const dispatch = useDispatch();
    const user = useSelector((state) => state.userController?.user);

    const showAlert = (msg, type) => {
        dispatch(alertActions.showAlert({ msg, type }));
    };

    if (!user) {
        return {
            admins: [],
            getAdmins: () => {},
            createAdmin: () => {},
            updateAdmin: () => {},
            deleteAdmin: () => {},
            user: null
        };
    }

    const getAdmins = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/admins`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`
                }
            });
            const json = await res.json();
            
            if (res.ok) {
                setAdmins(json);
            } else {
                showAlert(json.message, 'error');
            }
        } catch (err) {
            showAlert(err.message, 'error');
        }
    };

    const createAdmin = async (adminData) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/admins`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`
                },
                body: JSON.stringify(adminData)
            });
            const json = await res.json();
            
            if (res.ok) {
                setAdmins(prev => [...prev, json]);
                showAlert('تم إضافة المشرف بنجاح', 'success');
                return true;
            } else {
                showAlert(json.message, 'error');
                return false;
            }
        } catch (err) {
            showAlert(err.message, 'error');
            return false;
        }
    };

    const updateAdmin = async (id, adminData) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/admins/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`
                },
                body: JSON.stringify(adminData)
            });
            const json = await res.json();
            
            if (res.ok) {
                setAdmins(prev => prev.map(admin => 
                    admin._id === id ? json : admin
                ));
                showAlert('تم تحديث المشرف بنجاح', 'success');
                return true;
            } else {
                showAlert(json.message, 'error');
                return false;
            }
        } catch (err) {
            showAlert(err.message, 'error');
            return false;
        }
    };

    const deleteAdmin = async (id) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/admins/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`
                }
            });
            const json = await res.json();
            
            if (res.ok) {
                setAdmins(prev => prev.filter(admin => admin._id !== id));
                showAlert('تم حذف المشرف بنجاح', 'success');
                return true;
            } else {
                showAlert(json.message, 'error');
                return false;
            }
        } catch (err) {
            showAlert(err.message, 'error');
            return false;
        }
    };

    return {
        admins,
        getAdmins,
        createAdmin,
        updateAdmin,
        deleteAdmin,
        user
    };
};