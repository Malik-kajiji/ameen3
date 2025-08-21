import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { alertActions } from '../redux/AlertController';

export const useWebsite = () => {
    const [websiteContent, setWebsiteContent] = useState(null);
    const dispatch = useDispatch();
    const user = useSelector((state) => state.userController?.user);

    const showAlert = (msg, type) => {
        dispatch(alertActions.showAlert({ msg, type }));
    };

    if (!user) {
        return {
            websiteContent: null,
            getContent: () => {},
            updateAbout: () => {},
            updateFeatures: () => {},
            updateTrainingDays: () => {},
            updatePackages: () => {},
            updateContact: () => {},
            user: null
        };
    }

    const getContent = async () => {
        if (!user) {
            return;
        }
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/website/content`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`
                }
            });
            const json = await res.json();
            
            if (res.ok) {
                setWebsiteContent(json);
            } else {
                showAlert(json.message, 'error');
            }
        } catch (err) {
            showAlert(err.message, 'error');
        }
    };

    const updateAbout = async (data) => {
        if (!user) {
            return;
        }
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/website/about`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`
                },
                body: JSON.stringify(data)
            });
            const json = await res.json();
            
            if (res.ok) {
                setWebsiteContent(json);
                showAlert('تم تحديث قسم "من نحن" بنجاح', 'success');
            } else {
                showAlert(json.message, 'error');
            }
        } catch (err) {
            showAlert(err.message, 'error');
        }
    };

    const updateFeatures = async (data) => {
        if (!user) {
            return;
        }
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/website/features`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`
                },
                body: JSON.stringify({ features: data })
            });
            const json = await res.json();
            
            if (res.ok) {
                setWebsiteContent(json);
                showAlert('تم تحديث المميزات بنجاح', 'success');
            } else {
                showAlert(json.message, 'error');
            }
        } catch (err) {
            showAlert(err.message, 'error');
        }
    };

    const updateTrainingDays = async (data) => {
        if (!user) {
            return;
        }
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/website/training-days`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`
                },
                body: JSON.stringify({ trainingDays: data })
            });
            const json = await res.json();
            
            if (res.ok) {
                setWebsiteContent(json);
                showAlert('تم تحديث جدول المدربين بنجاح', 'success');
            } else {
                showAlert(json.message, 'error');
            }
        } catch (err) {
            showAlert(err.message, 'error');
        }
    };

    const updatePackages = async (data) => {
        if (!user) {
            return;
        }
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/website/packages`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`
                },
                body: JSON.stringify({ packages: data })
            });
            const json = await res.json();
            
            if (res.ok) {
                setWebsiteContent(json);
                showAlert('تم تحديث الباقات بنجاح', 'success');
            } else {
                showAlert(json.message, 'error');
            }
        } catch (err) {
            showAlert(err.message, 'error');
        }
    };

    const updateContact = async (data) => {
        if (!user) {
            return;
        }
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/website/contact`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`
                },
                body: JSON.stringify({ contact: data })
            });
            const json = await res.json();
            
            if (res.ok) {
                setWebsiteContent(json);
                showAlert('تم تحديث معلومات الاتصال بنجاح', 'success');
            } else {
                showAlert(json.message, 'error');
            }
        } catch (err) {
            showAlert(err.message, 'error');
        }
    };

    return {
        websiteContent,
        getContent,
        updateAbout,
        updateFeatures,
        updateTrainingDays,
        updatePackages,
        updateContact,
        user
    };
};