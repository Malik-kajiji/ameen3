import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const useAssets = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Get user data from Redux store
  const user = useSelector(state => state.userController.user);

  const fetchAssets = useCallback(async () => {
    if (!user?.token) {
      return;
    }
    try {
      console.log('Fetching assets...');
      setLoading(true);
      setError(null); // Clear any previous errors
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/assets`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      console.log('Fetched assets:', res.data);
      setAssets(res.data);
    } catch (err) {
      console.error('Error fetching assets:', err);
      setError({
        message: err.response?.data?.message || 'فشل في تحميل بيانات الأصول',
        source: 'assets'
      });
    } finally {
      setLoading(false);
    }
  }, [user?.token]);

  const fetchAssetById = async (id) => {
    if (!user?.token) {
      throw new Error('غير مخول بالوصول');
    }
    
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/assets/${id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'فشل في تحميل بيانات الأصل');
    }
  };

  const createAsset = async (assetData) => {
    if (!user?.token) {
      throw new Error('غير مخول بالوصول');
    }
    
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/assets`,
        assetData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      
      // Add the new asset to the local state
      setAssets(prev => [...prev, res.data.asset]);
      
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'فشل في إنشاء الأصل');
    }
  };

  const updateAsset = async (id, assetData) => {
    if (!user?.token) {
      throw new Error('غير مخول بالوصول');
    }
    
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/assets/${id}`,
        assetData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      
      // Update the asset in the local state
      setAssets(prev => prev.map(asset => 
        asset.id === id ? res.data.asset : asset
      ));
      
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'فشل في تحديث بيانات الأصل');
    }
  };

  const deleteAsset = async (id) => {
    if (!user?.token) {
      throw new Error('غير مخول بالوصول');
    }
    
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/assets/${id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      
      // Remove the asset from the local state
      setAssets(prev => prev.filter(asset => asset.id !== id));
      
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'فشل في حذف الأصل');
    }
  };

  const getMaintenanceLogs = async (assetId) => {
    if (!user?.token) {
      throw new Error('غير مخول بالوصول');
    }
    
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/assets/${assetId}/maintenance`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'فشل في تحميل سجل الصيانة');
    }
  };

  const addMaintenanceLog = async (assetId, logData) => {
    if (!user?.token) {
      throw new Error('غير مخول بالوصول');
    }
    
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/assets/${assetId}/maintenance`,
        logData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'فشل في إضافة سجل الصيانة');
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchAssets();
    }
  }, [user?.token, fetchAssets]);

  return {
    assets,
    loading,
    error,
    fetchAssets,
    fetchAssetById,
    createAsset,
    updateAsset,
    deleteAsset,
    getMaintenanceLogs,
    addMaintenanceLog
  };
};

export default useAssets;