import { useState } from 'react';
import axios from 'axios';

const useAdminAuth = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loginAsAdmin = async (username, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/owner/login`,
        { username, password }
      );
      
      const adminData = {
        username: res.data.username,
        access: res.data.access,
        token: res.data.token
      };
      
      setAdmin(adminData);
      return adminData;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'فشل في تسجيل الدخول كمسؤول';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setAdmin(null);
    setError(null);
  };

  return {
    admin,
    loading,
    error,
    loginAsAdmin,
    logout
  };
};

export default useAdminAuth;