import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const useFinancial = () => {
  const [overview, setOverview] = useState({
    totalMonthlyIncome: 0,
    totalMonthlyExpenses: 0,
    netProfit: 0,
    totalYearlyIncome: 0,
    totalYearlyExpenses: 0,
    pendingAmount: 0,
    incomeBySource: [],
    expensesByCategory: []
  });
  
  const [incomeTransactions, setIncomeTransactions] = useState([]);
  const [expenseTransactions, setExpenseTransactions] = useState([]);
  const [reports, setReports] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Pagination states
  const [incomePage, setIncomePage] = useState(1);
  const [incomeTotalPages, setIncomeTotalPages] = useState(1);
  const [expensePage, setExpensePage] = useState(1);
  const [expenseTotalPages, setExpenseTotalPages] = useState(1);
  
  // Get user data from Redux store
  const user = useSelector(state => state.userController.user);

  // Fetch financial overview data
  const fetchFinancialOverview = useCallback(async () => {
    if (!user?.token) {
      return;
    }
    try {
      console.log('Fetching financial overview...');
      setLoading(true);
      setError(null);
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/financial/overview`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      console.log('Fetched financial overview:', res.data);
      setOverview(res.data);
    } catch (err) {
      console.error('Error fetching financial overview:', err);
      setError({
        message: err.response?.data?.message || 'فشل في تحميل البيانات المالية',
        source: 'financial-overview'
      });
    } finally {
      setLoading(false);
    }
  }, [user?.token]);

  // Fetch income transactions
  const fetchIncomeTransactions = useCallback(async (page = 1, startDate = null, endDate = null) => {
    if (!user?.token) {
      return;
    }
    try {
      console.log('Fetching income transactions...');
      setLoading(true);
      setError(null);
      
      const params = { page };
      if (startDate && endDate) {
        params.startDate = startDate;
        params.endDate = endDate;
      }
      
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/financial/income`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          params
        }
      );
      console.log('Fetched income transactions:', res.data);
      setIncomeTransactions(res.data.transactions);
      setIncomePage(res.data.page);
      setIncomeTotalPages(res.data.pages);
    } catch (err) {
      console.error('Error fetching income transactions:', err);
      setError({
        message: err.response?.data?.message || 'فشل في تحميل معاملات الإيرادات',
        source: 'income-transactions'
      });
    } finally {
      setLoading(false);
    }
  }, [user?.token]);

  // Fetch expense transactions
  const fetchExpenseTransactions = useCallback(async (page = 1, startDate = null, endDate = null, category = null) => {
    if (!user?.token) {
      return;
    }
    try {
      console.log('Fetching expense transactions...');
      setLoading(true);
      setError(null);
      
      const params = { page };
      if (startDate && endDate) {
        params.startDate = startDate;
        params.endDate = endDate;
      }
      if (category) {
        params.category = category;
      }
      
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/financial/expenses`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          params
        }
      );
      console.log('Fetched expense transactions:', res.data);
      setExpenseTransactions(res.data.expenses);
      setExpensePage(res.data.page);
      setExpenseTotalPages(res.data.pages);
    } catch (err) {
      console.error('Error fetching expense transactions:', err);
      setError({
        message: err.response?.data?.message || 'فشل في تحميل معاملات المصروفات',
        source: 'expense-transactions'
      });
    } finally {
      setLoading(false);
    }
  }, [user?.token]);

  // Add a new expense
  const addExpense = async (expenseData) => {
    if (!user?.token) {
      throw new Error('غير مخول بالوصول');
    }
    
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/financial/expenses`,
        expenseData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      
      // Refresh expense transactions
      fetchExpenseTransactions(expensePage);
      
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'فشل في إضافة المصروف');
    }
  };

  // Create invoice
  const createInvoice = async (invoiceData) => {
    if (!user?.token) {
      throw new Error('غير مخول بالوصول');
    }
    
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/financial/invoices`,
        invoiceData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      
      // Refresh income transactions
      fetchIncomeTransactions(incomePage);
      
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'فشل في إنشاء الفاتورة');
    }
  };

  // Fetch financial reports
  const fetchFinancialReports = useCallback(async (reportType = 'monthly', year = null, month = null) => {
    if (!user?.token) {
      return;
    }
    try {
      console.log('Fetching financial reports...');
      setLoading(true);
      setError(null);
      
      const params = { reportType };
      if (year) params.year = year;
      if (month) params.month = month;
      
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/financial/reports`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          params
        }
      );
      console.log('Fetched financial reports:', res.data);
      setReports(res.data);
      return res.data;
    } catch (err) {
      console.error('Error fetching financial reports:', err);
      setError({
        message: err.response?.data?.message || 'فشل في تحميل التقارير المالية',
        source: 'financial-reports'
      });
    } finally {
      setLoading(false);
    }
  }, [user?.token]);

  // Initial data loading
  useEffect(() => {
    if (user?.token) {
      fetchFinancialOverview();
      fetchIncomeTransactions(1);
      fetchExpenseTransactions(1);
    }
  }, [user?.token, fetchFinancialOverview, fetchIncomeTransactions, fetchExpenseTransactions]);

  return {
    overview,
    incomeTransactions,
    expenseTransactions,
    reports,
    loading,
    error,
    incomePage,
    incomeTotalPages,
    expensePage,
    expenseTotalPages,
    fetchFinancialOverview,
    fetchIncomeTransactions,
    fetchExpenseTransactions,
    addExpense,
    createInvoice,
    fetchFinancialReports
  };
};

export default useFinancial;