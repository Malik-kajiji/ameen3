import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useToast } from '@/hooks/use-toast';

const useNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [stats, setStats] = useState({ total: 0, delivered: 0, deliveryRate: 0 });
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();
    const user = useSelector((state) => state.userController?.user);
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        fetchNotifications();
        fetchStats();
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await fetch(`${BASE_URL}/admin/notifications`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                setNotifications(data);
            } else {
                toast({
                    title: 'خطأ',
                    description: data.message || 'حدث خطأ أثناء جلب الإشعارات',
                    variant: 'destructive'
                });
            }
        } catch (error) {
            toast({
                title: 'خطأ',
                description: 'حدث خطأ أثناء جلب الإشعارات',
                variant: 'destructive'
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await fetch(`${BASE_URL}/admin/notifications/stats`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                setStats(data);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const verifyPhoneNumber = async (phone) => {
        try {
            const response = await fetch(`${BASE_URL}/admin/notifications/verify-phone/${phone}`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message);
            }
            return data;
        } catch (error) {
            throw error;
        }
    };

    const createNotification = async (notificationData) => {
        try {
            const response = await fetch(`${BASE_URL}/admin/notifications`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(notificationData)
            });
            const data = await response.json();
            if (response.ok) {
                setNotifications(prev => [data, ...prev]);
                toast({
                    title: 'تم بنجاح',
                    description: 'تم إنشاء الإشعار بنجاح'
                });
                fetchStats(); // Refresh stats after creating notification
                return data;
            } else {
                toast({
                    title: 'خطأ',
                    description: data.message || 'حدث خطأ أثناء إنشاء الإشعار',
                    variant: 'destructive'
                });
                throw new Error(data.message);
            }
        } catch (error) {
            toast({
                title: 'خطأ',
                description: error.message || 'حدث خطأ أثناء إنشاء الإشعار',
                variant: 'destructive'
            });
            throw error;
        }
    };

    return {
        notifications,
        stats,
        loading,
        createNotification,
        verifyPhoneNumber,
        fetchNotifications
    };
};

export default useNotifications;