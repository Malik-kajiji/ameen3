import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useToast } from '@/hooks/use-toast';

const useSettings = () => {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();
    const user = useSelector((state) => state.userController?.user);
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await fetch(`${BASE_URL}/admin/settings`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                setSettings(data);
            } else {
                toast({
                    title: 'خطأ',
                    description: data.message || 'حدث خطأ أثناء جلب الإعدادات',
                    variant: 'destructive'
                });
            }
        } catch (error) {
            toast({
                title: 'خطأ',
                description: 'حدث خطأ أثناء جلب الإعدادات',
                variant: 'destructive'
            });
        } finally {
            setLoading(false);
        }
    };

    const updateSettings = async (category, data) => {
        try {
            const response = await fetch(`${BASE_URL}/admin/settings/${category}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (response.ok) {
                setSettings(result);
                toast({
                    title: 'تم الحفظ',
                    description: `تم حفظ إعدادات ${category} بنجاح.`
                });
                return true;
            } else {
                toast({
                    title: 'خطأ',
                    description: result.message || 'حدث خطأ أثناء حفظ الإعدادات',
                    variant: 'destructive'
                });
                return false;
            }
        } catch (error) {
            toast({
                title: 'خطأ',
                description: 'حدث خطأ أثناء حفظ الإعدادات',
                variant: 'destructive'
            });
            return false;
        }
    };

    return {
        settings,
        loading,
        updateSettings,
        fetchSettings
    };
};

export default useSettings;