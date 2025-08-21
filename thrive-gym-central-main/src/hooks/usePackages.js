import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { alertActions } from '../redux/AlertController';

export const usePackages = () => {
    const [packages, setPackages] = useState([]);
    const dispatch = useDispatch();
    const user = useSelector((state) => state.userController?.user);

    const showAlert = (msg, type) => {
        dispatch(alertActions.showAlert({ msg, type }));
    };

    if (!user) {
        return {
            packages: [],
            getPackages: () => {},
            updatePackages: () => {},
            user: null
        };
    }

    const getPackages = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/packages`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`
                }
            });
            const json = await res.json();
            
            if (res.ok) {
                setPackages(json);
            } else {
                showAlert(json.message, 'error');
            }
        } catch (err) {
            showAlert(err.message, 'error');
        }
    };

    const updatePackages = async (data) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/packages`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`
                },
                body: JSON.stringify({ packages: data })
            });
            const json = await res.json();
            
            if (res.ok) {
                setPackages(json);
                showAlert('تم تحديث الباقات بنجاح', 'success');
            } else {
                showAlert(json.message, 'error');
            }
        } catch (err) {
            showAlert(err.message, 'error');
        }
    };

    return {
        packages,
        getPackages,
        updatePackages,
        user
    };
};