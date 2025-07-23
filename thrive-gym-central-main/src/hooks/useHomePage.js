import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';


const useHomePage = () => {
  const [mainData, setMainData] = useState(null);
  const [timeframeData, setTimeframeData] = useState(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState('weekly');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = useSelector(state => state.userController.user)

  const fetchMainData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${process.env.VITE_API_BASE_URL}/dashboard/main`, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      setMainData(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load main dashboard data');
    } finally {
      setLoading(false);
    }
  }, [user.token]);

  const fetchTimeframeData = useCallback(async (timeframe = 'weekly') => {
    try {
      setLoading(true);
      const res = await axios.get(`${process.env.VITE_API_BASE_URL}/dashboard/${timeframe}`, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      setTimeframeData(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load timeframe data');
    } finally {
      setLoading(false);
    }
  }, [user.token]);

  useEffect(() => {
    fetchMainData();
    fetchTimeframeData(selectedTimeframe);
  }, [fetchMainData, fetchTimeframeData, selectedTimeframe]);

  const changeTimeframe = (newTimeframe) => {
    if (['weekly', 'monthly', 'yearly'].includes(newTimeframe)) {
      setSelectedTimeframe(newTimeframe);
    }
  };

  return {
    mainData,
    timeframeData,
    selectedTimeframe,
    changeTimeframe,
    loading,
    error
  };
};

export default useHomePage;
