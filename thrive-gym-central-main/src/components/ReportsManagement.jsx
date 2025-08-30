import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Users, DollarSign, BarChart3 } from 'lucide-react';
import CreateReportDialog from './CreateReportDialog';
import { motion } from 'framer-motion';
import useReports from '@/hooks/useReports';
import { toast } from 'sonner';

const ReportsManagement = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [downloading, setDownloading] = useState({});
  const [monthlyStats, setMonthlyStats] = useState({
    monthlyAttendance: 0,
    monthlyRevenue: 0,
    newMembers: 0,
    maintenanceCost: 0
  });
  const user = useSelector((state) => state.userController.user);

  const {
    reports,
    loading,
    error,
    getReports,
    createReport,
    updateReport,
    deleteReport,
    generateReport,
    toggleSchedule
  } = useReports();

  const handleDownload = async (report, period, format) => {
    if (!user?.token) {
      toast.error('يرجى تسجيل الدخول مرة أخرى');
      return;
    }

    const downloadKey = `${report.type}-${format}`;
    setDownloading(prev => ({ ...prev, [downloadKey]: true }));
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/reports/${report.type}/${period}/${format}`,
        {
          headers: {
            'Authorization': `Bearer ${user?.token}`
          },
          responseType: 'blob'
        }
      );

      // Check if the response is JSON (error message)
      const contentType = response.headers['content-type'];
      if (contentType.includes('application/json')) {
        const reader = new FileReader();
        reader.onload = () => {
          const errorData = JSON.parse(reader.result);
          toast.error(errorData.message || 'حدث خطأ أثناء تحميل التقرير');
        };
        reader.readAsText(response.data);
        return;
      }

      // Get filename from Content-Disposition header or use default
      const contentDisposition = response.headers['content-disposition'];
      let filename = `${report.title}-${period}.xlsx`;
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename=(.+)/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      // Create blob URL and trigger download
      const blob = new Blob([response.data], { type: contentType });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();

      // Cleanup
      window.URL.revokeObjectURL(url);
      link.remove();
    } catch (err) {
      console.error('Download error:', err.response?.data || err);
      if (err.response?.status === 401) {
        toast.error('يرجى تسجيل الدخول مرة أخرى');
      } else {
        toast.error(err.response?.data?.message || 'حدث خطأ أثناء تحميل التقرير');
      }
    } finally {
      setDownloading(prev => ({ ...prev, [downloadKey]: false }));
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.token) {
        return;
      }
      try {
        await getReports();
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/dashboard-stats/monthly`,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );
        setMonthlyStats(res.data);
      } catch (err) {
        toast.error('حدث خطأ أثناء جلب البيانات');
      }
    };

    if (user?.token) {
      fetchData();
    }
  }, [user?.token]);

  const reportTypes = [
    {
      title: 'تقرير العضوية',
      description: 'تقرير عن الأعضاء الجدد والاشتراكات وطلبات الإيقاف',
      icon: Users,
      color: 'text-blue-500',
      type: 'membership'
    },
    {
      title: 'التقرير المالي',
      description: 'تقرير شامل عن جميع العمليات المالية',
      icon: DollarSign,
      color: 'text-green-500',
      type: 'financial'
    },
    {
      title: 'تقرير المعدات',
      description: 'تقرير عن تفاصيل المعدات وحالتها',
      icon: BarChart3,
      color: 'text-orange-500',
      type: 'assets'
    },
    {
      title: 'تقرير الموظفين',
      description: 'تقرير عن بيانات الموظفين',
      icon: TrendingUp,
      color: 'text-purple-500',
      type: 'employees'
    }
  ];

  const handleCreateReport = async (newReport) => {
    try {
      await createReport(newReport);
      setIsCreateDialogOpen(false);
      toast.success('تم إنشاء التقرير بنجاح');
    } catch (err) {
      toast.error('حدث خطأ أثناء إنشاء التقرير');
    }
  };

  const handleViewReport = async (reportId) => {
    try {
      const result = await generateReport(reportId);
      // Here you would handle displaying the report data
      console.log('بيانات التقرير:', result);
    } catch (err) {
      toast.error('حدث خطأ أثناء عرض التقرير');
    }
  };

  const handleEditReport = async (reportId, updateData) => {
    try {
      await updateReport(reportId, updateData);
      toast.success('تم تحديث التقرير بنجاح');
    } catch (err) {
      toast.error('حدث خطأ أثناء تحديث التقرير');
    }
  };

  const handleToggleSchedule = async (reportId) => {
    try {
      const result = await toggleSchedule(reportId);
      toast.success(`تم ${result.report.schedule.enabled ? 'تفعيل' : 'تعطيل'} جدولة التقرير`);
    } catch (err) {
      toast.error('حدث خطأ أثناء تحديث جدولة التقرير');
    }
  };

  const handleDeleteReport = async (reportId) => {
    try {
      await deleteReport(reportId);
      toast.success('تم حذف التقرير بنجاح');
    } catch (err) {
      toast.error('حدث خطأ أثناء حذف التقرير');
    }
  };

  const handleGenerateReport = async (reportType) => {
    try {
      // Create a new report of the selected type
      const newReport = {
        title: `تقرير ${reportType} جديد`,
        type: reportType,
        dateRange: {
          from: new Date(),
          to: new Date()
        }
      };
      const result = await createReport(newReport);
      await generateReport(result.report._id);
      toast.success('تم إنشاء التقرير بنجاح');
    } catch (err) {
      toast.error('حدث خطأ أثناء إنشاء التقرير');
    }
  };

  const quickStats = [
    { label: 'الحضور لهذا الشهر', value: monthlyStats.monthlyAttendance.toString() },
    { label: 'الايرادات لهذا الشهر', value: `${monthlyStats.monthlyRevenue.toLocaleString()} د.ل` },
    { label: 'الأعضاء الجدد لهذا الشهر', value: monthlyStats.newMembers.toString() },
    { label: 'إجمالي المصروف على الصيانة', value: `${monthlyStats.maintenanceCost.toLocaleString()} د.ل` }
  ];

  const fade = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.38, type: 'spring' } },
  };

  const staggerCards = (i) => ({
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { delay: i * 0.07 + 0.07, duration: 0.22, type: 'spring' } }
  });

  if (loading) {
    return <div>جاري التحميل...</div>;
  }

  if (error) {
    return <div>حدث خطأ: {error}</div>;
  }

  return (
    <motion.div className="space-y-6 phone-space-y-4 rtl" variants={fade} initial="hidden" animate="show">
      <motion.div variants={fade}>
        <div className="flex flex-col phone:flex-col sm:flex-row justify-between items-start sm:items-center gap-4 phone-gap-3">
          <div className="text-right">
            <h2 className="text-3xl phone-text-xl font-bold tracking-tight">إدارة التقارير</h2>
            <p className="text-muted-foreground phone-text-sm">إنشاء وإدارة تقارير ذكاء الأعمال</p>
          </div>
        </div>
      </motion.div>

      <motion.div className="grid gap-4 phone-gap-3 grid-cols-1 phone:grid-cols-2 md:grid-cols-4" initial="hidden" animate="show">
        {quickStats.map((stat, i) => (
          <motion.div key={i} variants={staggerCards(i)} initial="hidden" animate="show">
            <Card className="card-gradient">
              <CardContent className="p-6 phone-p-4 text-right">
                <div className="text-2xl phone-text-lg font-bold text-primary">{stat.value}</div>
                <p className="text-xs phone-text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <motion.div variants={fade}>
        <div className="flex space-x-1 space-x-reverse bg-muted p-1 rounded-lg w-full phone:w-full sm:w-fit overflow-x-auto">
          {[
            { key: 'daily', label: 'يومي' },
            { key: 'weekly', label: 'أسبوعي' },
            { key: 'monthly', label: 'شهري' },
            { key: 'yearly', label: 'سنوي' }
          ].map((period) => (
            <button
              key={period.key}
              onClick={() => setSelectedPeriod(period.key)}
              className={`px-4 py-2 phone-px-3 phone-py-1 rounded-md text-sm phone-text-xs font-medium transition-colors flex-shrink-0 ${
                selectedPeriod === period.key
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div className="grid gap-6 phone-gap-4 grid-cols-1 md:grid-cols-2" initial="hidden" animate="show">
        {reportTypes.map((report, i) => (
          <motion.div key={i} variants={staggerCards(i)} initial="hidden" animate="show" whileHover={{ scale: 1.02 }}>
            <Card className="card-gradient hover:bg-accent/50 transition-colors">
              <CardHeader className="phone-p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 space-x-reverse phone-space-x-2 flex-1 min-w-0">
                    <report.icon className={`w-8 h-8 phone-w-6 phone-h-6 ${report.color} flex-shrink-0`} />
                    <div className="min-w-0 flex-1 text-right">
                      <CardTitle className="text-lg phone-text-base truncate">{report.title}</CardTitle>
                      <p className="text-sm phone-text-xs text-muted-foreground">{report.description}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="phone-p-1 relative"
                    disabled={downloading[`${report.type}-xlsx`]}
                    onClick={async () => {
                      handleDownload(report, selectedPeriod, 'xlsx')
                    }}
                  >
                    {downloading[`${report.type}-xlsx`] ? (
                      <span className="animate-spin">⏳</span>
                    ) : (
                      'تحميل'
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="phone-p-4">
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

    </motion.div>
  );
};

export default ReportsManagement;
