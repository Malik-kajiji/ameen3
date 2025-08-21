import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import useAdminAuth from './useAdminAuth';

const useHomePage = () => {
  const [mainData, setMainData] = useState(null);
  const [timeframeData, setTimeframeData] = useState(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { admin, loginAsAdmin, loading: adminLoading, error: adminError } = useAdminAuth();

  // Auto-login as admin when hook is used
  useEffect(() => {
    const autoLogin = async () => {
      try {
        // Using the owner credentials from the backend
        await loginAsAdmin('ameen@gmail.com', '12345678');
      } catch (err) {
        setError({
          message: 'فشل في تسجيل الدخول التلقائي كمسؤول'
        });
      }
    };

    if (!admin && !adminLoading) {
      autoLogin();
    }
  }, [admin, adminLoading, loginAsAdmin]);

  const fetchMainData = useCallback(async () => {
    if (!admin?.token) {
      // Wait for admin login
      return;
    }
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/dashboard/main`,
        {
          headers: {
            Authorization: `Bearer ${admin.token}`,
          },
        }
      );
      setMainData(res.data);
    } catch (err) {
      setError({
        message:
          err.response?.data?.message || 'فشل تحميل بيانات لوحة التحكم الرئيسية',
      });
    } finally {
      setLoading(false);
    }
  }, [admin?.token]);

  const fetchTimeframeData = useCallback(
    async (timeframe = 'week') => {
      if (!admin?.token) {
        // Wait for admin login
        return;
      }
      
      // Map frontend timeframe values to backend endpoint values
      const timeframeMapping = {
        'week': 'weekly',
        'month': 'monthly',
        'year': 'yearly'
      };
      
      const backendTimeframe = timeframeMapping[timeframe] || 'weekly';
      
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/dashboard/${backendTimeframe}`,
          {
            headers: {
              Authorization: `Bearer ${admin.token}`,
            },
          }
        );
        setTimeframeData(res.data);
      } catch (err) {
        setError({
          message:
            err.response?.data?.message || 'فشل تحميل بيانات الفترة الزمنية',
        });
      } finally {
        setLoading(false);
      }
    },
    [admin?.token]
  );

  useEffect(() => {
    if (admin?.token) {
      fetchMainData();
      fetchTimeframeData(selectedTimeframe);
    }
  }, [admin?.token, fetchMainData, fetchTimeframeData, selectedTimeframe]);

  const changeTimeframe = (newTimeframe) => {
    if (['week', 'month', 'year'].includes(newTimeframe)) {
      setSelectedTimeframe(newTimeframe);
    }
  };

  return {
    mainData,
    timeframeData,
    selectedTimeframe,
    changeTimeframe,
    loading: loading || adminLoading,
    error: error || adminError,
    admin,
  };
};

export default useHomePage;
