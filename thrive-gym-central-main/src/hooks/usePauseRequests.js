import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const usePauseRequests = () => {
  const [pauseRequests, setPauseRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Get user data from Redux store
  const user = useSelector(state => state.userController.user);

  const fetchPauseRequests = useCallback(async () => {
    if (!user?.token) {
      return;
    }
    try {
      console.log('Fetching pause requests...');
      setLoading(true);
      setError(null); // Clear any previous errors
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/pause-requests`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      console.log('Fetched pause requests:', res.data);
      setPauseRequests(res.data);
    } catch (err) {
      console.error('Error fetching pause requests:', err);
      setError({
        message: err.response?.data?.message || 'فشل في تحميل بيانات طلبات الإيقاف',
        source: 'pause-requests'
      });
    } finally {
      setLoading(false);
    }
  }, [user?.token]);

  const fetchPauseRequestById = async (id) => {
    if (!user?.token) {
      throw new Error('غير مخول بالوصول');
    }
    
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/pause-requests/${id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'فشل في تحميل بيانات طلب الإيقاف');
    }
  };

  const approvePauseRequest = async (id) => {
    if (!user?.token) {
      throw new Error('غير مخول بالوصول');
    }
    
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/pause-requests/${id}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      
      // Update the request in the local state
      setPauseRequests(prev => prev.map(request => 
        request.id === id ? { ...request, status: 'موافق' } : request
      ));
      
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'فشل في الموافقة على طلب الإيقاف');
    }
  };

  const rejectPauseRequest = async (id) => {
    if (!user?.token) {
      throw new Error('غير مخول بالوصول');
    }
    
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/pause-requests/${id}/reject`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      
      // Update the request in the local state
      setPauseRequests(prev => prev.map(request => 
        request.id === id ? { ...request, status: 'مرفوض' } : request
      ));
      
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'فشل في رفض طلب الإيقاف');
    }
  };

  const bulkApprovePauseRequests = async (ids) => {
    if (!user?.token) {
      throw new Error('غير مخول بالوصول');
    }
    
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/pause-requests/bulk/approve`,
        { ids },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      
      // Update the requests in the local state
      setPauseRequests(prev => prev.map(request => 
        ids.includes(request.id) ? { ...request, status: 'موافق' } : request
      ));
      
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'فشل في الموافقة على طلبات الإيقاف');
    }
  };

  const bulkRejectPauseRequests = async (ids) => {
    if (!user?.token) {
      throw new Error('غير مخول بالوصول');
    }
    
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/pause-requests/bulk/reject`,
        { ids },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      
      // Update the requests in the local state
      setPauseRequests(prev => prev.map(request => 
        ids.includes(request.id) ? { ...request, status: 'مرفوض' } : request
      ));
      
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'فشل في رفض طلبات الإيقاف');
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchPauseRequests();
    }
  }, [user?.token, fetchPauseRequests]);

  return {
    pauseRequests,
    loading,
    error,
    fetchPauseRequests,
    fetchPauseRequestById,
    approvePauseRequest,
    rejectPauseRequest,
    bulkApprovePauseRequests,
    bulkRejectPauseRequests
  };
};

export default usePauseRequests;