import { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const useReports = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [totalPages, setTotalPages] = useState(0);
    const user = useSelector((state) => state.userController.user);

    // Get all reports with pagination and filtering
    const getReports = async (page = 1, limit = 10, type = null, status = null) => {
        try {
            setLoading(true);
            setError(null);

            let url = `${import.meta.env.VITE_API_BASE_URL}/reports?page=${page}&limit=${limit}`;
            if (type) url += `&type=${type}`;
            if (status) url += `&status=${status}`;

            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                },
            });

            setReports(response.data.reports);
            setTotalPages(response.data.pages);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'حدث خطأ أثناء جلب التقارير');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Create a new report
    const createReport = async (reportData) => {
        try {
            setLoading(true);
            setError(null);

            const response = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/reports`,
                reportData,
                {
                    headers: {
                        Authorization: `Bearer ${user?.token}`,
                    },
                }
            );

            setReports(prev => [response.data.report, ...prev]);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'حدث خطأ أثناء إنشاء التقرير');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Update a report
    const updateReport = async (id, updateData) => {
        try {
            setLoading(true);
            setError(null);

            const response = await axios.put(
                `${import.meta.env.VITE_API_BASE_URL}/reports/${id}`,
                updateData,
                {
                    headers: {
                        Authorization: `Bearer ${user?.token}`,
                    },
                }
            );

            setReports(prev => 
                prev.map(report => 
                    report._id === id ? response.data.report : report
                )
            );
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'حدث خطأ أثناء تحديث التقرير');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Delete a report
    const deleteReport = async (id) => {
        try {
            setLoading(true);
            setError(null);

            await axios.delete(
                `${import.meta.env.VITE_API_BASE_URL}/reports/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${user?.token}`,
                    },
                }
            );

            setReports(prev => prev.filter(report => report._id !== id));
        } catch (err) {
            setError(err.response?.data?.message || 'حدث خطأ أثناء حذف التقرير');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Generate report data
    const generateReport = async (id) => {
        try {
            setLoading(true);
            setError(null);

            const response = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/reports/${id}/generate`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${user?.token}`,
                    },
                }
            );

            // Update the report's lastGenerated date in the local state
            setReports(prev => 
                prev.map(report => 
                    report._id === id 
                        ? { ...report, lastGenerated: response.data.report.lastGenerated }
                        : report
                )
            );

            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'حدث خطأ أثناء إنشاء التقرير');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Get scheduled reports
    const getScheduledReports = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}/reports/scheduled`,
                {
                    headers: {
                        Authorization: `Bearer ${user?.token}`,
                    },
                }
            );

            return response.data.reports;
        } catch (err) {
            setError(err.response?.data?.message || 'حدث خطأ أثناء جلب التقارير المجدولة');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Toggle report schedule
    const toggleSchedule = async (id) => {
        try {
            setLoading(true);
            setError(null);

            const response = await axios.patch(
                `${import.meta.env.VITE_API_BASE_URL}/reports/${id}/schedule`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${user?.token}`,
                    },
                }
            );

            setReports(prev => 
                prev.map(report => 
                    report._id === id ? response.data.report : report
                )
            );
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'حدث خطأ أثناء تحديث جدولة التقرير');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        reports,
        loading,
        error,
        totalPages,
        getReports,
        createReport,
        updateReport,
        deleteReport,
        generateReport,
        getScheduledReports,
        toggleSchedule
    };
};

export default useReports;