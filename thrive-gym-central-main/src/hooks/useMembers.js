import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const useMembers = () => {
  const [members, setMembers] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Get user data from Redux store
  const user = useSelector(state => state.userController.user);

  const fetchMembers = useCallback(async () => {
    if (!user?.token) {
      return;
    }
    try {
      console.log('Fetching members...');
      setLoading(true);
      setError(null); // Clear any previous errors
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/members`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      console.log('Fetched members:', res.data);
      setMembers(res.data);
    } catch (err) {
      console.error('Error fetching members:', err);
      setError({
        message: err.response?.data?.message || 'فشل في تحميل بيانات الأعضاء',
        source: 'members'
      });
    } finally {
      setLoading(false);
    }
  }, [user?.token]);

  const fetchPackages = useCallback(async () => {
    if (!user?.token) {
      return;
    }
    try {
      console.log('Fetching packages...');
      // First try the authenticated endpoint
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/members/packages`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        console.log('Fetched packages (authenticated):', res.data);
        setPackages(res.data);
      } catch (authError) {
        console.warn('Authenticated packages endpoint failed, trying test endpoint...');
        // If authenticated endpoint fails, try the test endpoint
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/test/packages`
        );
        console.log('Fetched packages (test):', res.data);
        setPackages(res.data);
      }
    } catch (err) {
      console.error('Error fetching packages:', err);
      setError({
        message: err.response?.data?.message || 'فشل في تحميل بيانات الخطط',
        source: 'packages'
      });
    }
  }, [user?.token]);

  const fetchMemberById = async (id) => {
    if (!user?.token) {
      throw new Error('غير مخول بالوصول');
    }
    
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/members/${id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'فشل في تحميل بيانات العضو');
    }
  };

  const updateMember = async (id, memberData) => {
    if (!user?.token) {
      throw new Error('غير مخول بالوصول');
    }
    
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/members/${id}`,
        memberData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      
      // Update the member in the local state
      setMembers(prev => prev.map(member => 
        member.id === id ? res.data : member
      ));
      
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'فشل في تحديث بيانات العضو');
    }
  };

  const createMember = async (memberData) => {
    if (!user?.token) {
      throw new Error('غير مخول بالوصول');
    }
    
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/members`,
        memberData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      
      // Add the new member to the local state
      setMembers(prev => [res.data, ...prev]);
      
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'فشل في إنشاء العضو');
    }
  };

  const deleteMember = async (id) => {
    if (!user?.token) {
      throw new Error('غير مخول بالوصول');
    }
    
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/members/${id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      
      // Remove the member from the local state
      setMembers(prev => prev.filter(member => member.id !== id));
    } catch (err) {
      throw new Error(err.response?.data?.message || 'فشل في حذف العضو');
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchMembers();
      fetchPackages();
    }
  }, [user?.token, fetchMembers, fetchPackages]);

  return {
    members,
    packages,
    loading,
    error,
    fetchMembers,
    fetchPackages,
    fetchMemberById,
    createMember,
    updateMember,
    deleteMember
  };
};

export default useMembers;