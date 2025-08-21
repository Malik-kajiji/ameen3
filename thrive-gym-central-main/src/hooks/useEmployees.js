import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const useEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Get user data from Redux store
  const user = useSelector(state => state.userController.user);

  const fetchEmployees = useCallback(async () => {
    if (!user?.token) {
      return;
    }
    try {
      console.log('Fetching employees...');
      setLoading(true);
      setError(null); // Clear any previous errors
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/employees`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      console.log('Fetched employees:', res.data);
      setEmployees(res.data);
    } catch (err) {
      console.error('Error fetching employees:', err);
      setError({
        message: err.response?.data?.message || 'فشل في تحميل بيانات الموظفين',
        source: 'employees'
      });
    } finally {
      setLoading(false);
    }
  }, [user?.token]);

  const fetchEmployeeById = async (id) => {
    if (!user?.token) {
      throw new Error('غير مخول بالوصول');
    }
    
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/employees/${id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'فشل في تحميل بيانات الموظف');
    }
  };

  const createEmployee = async (employeeData) => {
    if (!user?.token) {
      throw new Error('غير مخول بالوصول');
    }
    
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/employees`,
        employeeData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      
      // Add the new employee to the local state
      setEmployees(prev => [...prev, res.data.employee]);
      
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'فشل في إنشاء الموظف');
    }
  };

  const updateEmployee = async (id, employeeData) => {
    if (!user?.token) {
      throw new Error('غير مخول بالوصول');
    }
    
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/employees/${id}`,
        employeeData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      
      // Update the employee in the local state
      setEmployees(prev => prev.map(employee => 
        employee.id === id ? res.data.employee : employee
      ));
      
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'فشل في تحديث بيانات الموظف');
    }
  };

  const deleteEmployee = async (id) => {
    if (!user?.token) {
      throw new Error('غير مخول بالوصول');
    }
    
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/employees/${id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      
      // Remove the employee from the local state
      setEmployees(prev => prev.filter(employee => employee.id !== id));
      
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'فشل في حذف الموظف');
    }
  };

  const setEmployeeActiveStatus = async (id, isActive) => {
    if (!user?.token) {
      throw new Error('غير مخول بالوصول');
    }
    
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/employees/${id}/active`,
        { isActive },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      
      // Update the employee status in the local state
      setEmployees(prev => prev.map(employee => 
        employee.id === id ? { ...employee, isActive } : employee
      ));
      
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'فشل في تغيير حالة تفعيل الموظف');
    }
  };

  const setEmployeeSalary = async (id, salary) => {
    if (!user?.token) {
      throw new Error('غير مخول بالوصول');
    }
    
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/employees/${id}/salary`,
        { salary },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      
      // Update the employee salary in the local state
      setEmployees(prev => prev.map(employee => 
        employee.id === id ? { ...employee, salary } : employee
      ));
      
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'فشل في تحديث راتب الموظف');
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchEmployees();
    }
  }, [user?.token, fetchEmployees]);

  return {
    employees,
    loading,
    error,
    fetchEmployees,
    fetchEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    setEmployeeActiveStatus,
    setEmployeeSalary
  };
};

export default useEmployees;