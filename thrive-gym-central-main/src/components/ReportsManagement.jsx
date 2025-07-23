import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, TrendingUp, Users, DollarSign, Calendar, BarChart3, PieChart, Plus, Eye, Edit, Pause, Play, Trash2 } from 'lucide-react';
import CreateReportDialog from './CreateReportDialog';
import { motion } from 'framer-motion';

const ReportsManagement = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [reports, setReports] = useState([
    {
      id: 'RPT-001',
      title: 'الملخص المالي الشهري',
      type: 'financial',
      status: 'مجدول',
      lastGenerated: '2024-01-15',
      schedule: {
        enabled: true,
        frequency: 'monthly',
        nextRun: '2024-02-01'
      }
    },
    {
      id: 'RPT-002',
      title: 'نشاط الأعضاء الأسبوعي',
      type: 'membership',
      status: 'نشط',
      lastGenerated: '2024-01-20',
      schedule: {
        enabled: true,
        frequency: 'weekly',
        nextRun: '2024-01-22'
      }
    }
  ]);

  const reportTypes = [
    {
      title: 'تقرير العضوية',
      description: 'تحليل مفصل لأنشطة الأعضاء والاتجاهات',
      icon: Users,
      color: 'text-blue-500',
      lastGenerated: '2024-01-15'
    },
    {
      title: 'التقرير المالي',
      description: 'تحليل الإيرادات والمصاريف والأرباح',
      icon: DollarSign,
      color: 'text-green-500',
      lastGenerated: '2024-01-14'
    },
    {
      title: 'استخدام المعدات',
      description: 'تقارير الاستفادة من المعدات والصيانة',
      icon: BarChart3,
      color: 'text-orange-500',
      lastGenerated: '2024-01-13'
    },
    {
      title: 'أداء الموظفين',
      description: 'تقارير إنتاجية الموظفين والحضور',
      icon: TrendingUp,
      color: 'text-purple-500',
      lastGenerated: '2024-01-12'
    }
  ];

  const quickStats = [
    { label: 'إجمالي التقارير المُنشأة', value: '247', change: '+12%', trend: 'up' },
    { label: 'الأعضاء النشطون هذا الشهر', value: '1,247', change: '+8%', trend: 'up' },
    { label: 'الإيرادات هذا الشهر', value: '45,230 د.ل', change: '+15%', trend: 'up' },
    { label: 'استخدام المعدات', value: '87%', change: '+3%', trend: 'up' }
  ];

  const handleCreateReport = (newReport) => {
    setReports([...reports, newReport]);
    console.log('تم إنشاء تقرير جديد:', newReport);
  };

  const handleViewReport = (reportId) => {
    console.log('عرض التقرير:', reportId);
  };

  const handleEditReport = (reportId) => {
    console.log('تعديل التقرير:', reportId);
  };

  const handleToggleSchedule = (reportId) => {
    setReports(reports.map(report =>
      report.id === reportId
        ? { ...report, schedule: { ...report.schedule, enabled: !report.schedule.enabled } }
        : report
    ));
  };

  const handleDeleteReport = (reportId) => {
    setReports(reports.filter(report => report.id !== reportId));
  };

  const handleGenerateReport = (reportType) => {
    console.log('إنشاء تقرير:', reportType);
  };

  const fade = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.38, type: 'spring' } },
  };
  const staggerCards = (i) => ({
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { delay: i * 0.07 + 0.07, duration: 0.22, type: 'spring' } }
  });

  return (
    <motion.div className="space-y-6 phone-space-y-4 rtl" variants={fade} initial="hidden" animate="show">
      <motion.div variants={fade}>
        <div className="flex flex-col phone:flex-col sm:flex-row justify-between items-start sm:items-center gap-4 phone-gap-3">
          <div className="text-right">
            <h2 className="text-3xl phone-text-xl font-bold tracking-tight">إدارة التقارير</h2>
            <p className="text-muted-foreground phone-text-sm">إنشاء وإدارة تقارير ذكاء الأعمال</p>
          </div>
          <div className="flex flex-col phone:flex-col sm:flex-row gap-2 phone-gap-2 w-full phone:w-full sm:w-auto">
            <Button variant="outline" className="phone-text-sm phone-p-2">
              <Calendar className="w-4 h-4 phone-w-3 phone-h-3 ml-2" />
              جدولة تقرير
            </Button>
            <Button
              className="btn-gradient phone-text-sm phone-p-2"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              <Plus className="w-4 h-4 phone-w-3 phone-h-3 ml-2" />
              إنشاء تقرير جديد
            </Button>
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
                <div className="flex items-center mt-2 justify-end">
                  <span className="text-sm phone-text-xs text-green-500">{stat.change}</span>
                  <TrendingUp className="w-4 h-4 phone-w-3 phone-h-3 text-green-500 mr-1" />
                </div>
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
                  <div className="flex gap-1 flex-col">
                    <Button
                      variant="outline"
                      size="sm"
                      className="phone-p-1 flex-shrink-0"
                      onClick={() => handleViewReport(report.title)}
                    >
                      <Eye className="w-4 h-4 phone-w-3 phone-h-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="phone-p-1 flex-shrink-0"
                      onClick={() => handleGenerateReport(report.title)}
                    >
                      <Download className="w-4 h-4 phone-w-3 phone-h-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="phone-p-4">
                <div className="flex flex-col phone:flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <span className="text-sm phone-text-xs text-muted-foreground">
                    آخر إنشاء: {report.lastGenerated}
                  </span>
                  <div className="flex gap-2 w-full phone:w-full sm:w-auto">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="phone-text-xs phone-p-1 flex-1 phone:flex-1 sm:flex-none"
                      onClick={() => handleViewReport(report.title)}
                    >
                      عرض
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary phone-text-xs phone-p-1 flex-1 phone:flex-1 sm:flex-none"
                      onClick={() => handleGenerateReport(report.title)}
                    >
                      إنشاء
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <motion.div variants={fade}>
        <Card className="card-gradient">
          <CardHeader className="phone-p-4">
            <div className="flex justify-between items-center">
              <CardTitle className="phone-text-base text-right">التقارير المجدولة</CardTitle>
              <Button size="sm" variant="outline" onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="w-4 h-4 ml-2" />
                إضافة جدولة
              </Button>
            </div>
          </CardHeader>
          <CardContent className="phone-p-4">
            <div className="space-y-4 phone-space-y-3">
              {reports.map((report, i) => (
                <motion.div key={report.id} variants={staggerCards(i)} initial="hidden" animate="show">
                  <div className="flex flex-col phone:flex-col sm:flex-row items-start sm:items-center justify-between p-4 phone-p-3 bg-muted/50 rounded-lg gap-3 phone-gap-2">
                    <div className="flex items-center space-x-3 space-x-reverse phone-space-x-2 flex-1 min-w-0">
                      <FileText className="w-5 h-5 phone-w-4 phone-h-4 text-primary flex-shrink-0" />
                      <div className="min-w-0 text-right">
                        <p className="font-medium phone-text-sm truncate">{report.title}</p>
                        <p className="text-sm phone-text-xs text-muted-foreground">
                          {report.schedule.enabled ? `التشغيل التالي: ${report.schedule.nextRun}` : 'معطل'}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 w-full phone:w-full sm:w-auto">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="phone-text-xs phone-p-1 flex-1 phone:flex-1 sm:flex-none"
                        onClick={() => handleViewReport(report.id)}
                      >
                        <Eye className="w-4 h-4 ml-1" />
                        عرض
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="phone-text-xs phone-p-1 flex-1 phone:flex-1 sm:flex-none"
                        onClick={() => handleEditReport(report.id)}
                      >
                        <Edit className="w-4 h-4 ml-1" />
                        تعديل
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="phone-text-xs phone-p-1 flex-1 phone:flex-1 sm:flex-none"
                        onClick={() => handleToggleSchedule(report.id)}
                      >
                        {report.schedule.enabled ?
                          <><Pause className="w-4 h-4 ml-1" />إيقاف</> :
                          <><Play className="w-4 h-4 ml-1" />تشغيل</>
                        }
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 phone-text-xs phone-p-1 flex-1 phone:flex-1 sm:flex-none"
                        onClick={() => handleDeleteReport(report.id)}
                      >
                        <Trash2 className="w-4 h-4 ml-1" />
                        حذف
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div className="grid gap-6 phone-gap-4 grid-cols-1 md:grid-cols-2" initial="hidden" animate="show">
        {[
          {
            title: 'نمو العضوية',
            icon: <PieChart className="w-5 h-5 phone-w-4 phone-h-4 text-muted-foreground" />,
            chart: <PieChart className="w-12 h-12 mx-auto mb-2 opacity-50" />,
            desc: 'رسم بياني لنمو العضوية'
          },
          {
            title: 'تحليلات الإيرادات',
            icon: <BarChart3 className="w-5 h-5 phone-w-4 phone-h-4 text-muted-foreground" />,
            chart: <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />,
            desc: 'رسم بياني لتحليلات الإيرادات'
          }
        ].map((section, i) => (
          <motion.div key={section.title} variants={staggerCards(i)} initial="hidden" animate="show">
            <Card className="card-gradient">
              <CardHeader className="phone-p-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="phone-text-base text-right">{section.title}</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                    {section.icon}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="phone-p-4">
                <div className="h-64 phone-h-32 flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg">
                  <div className="text-center">
                    {section.chart}
                    <span className="phone-text-sm text-center">{section.desc}</span>
                    <br />
                    <Button variant="ghost" size="sm" className="mt-2">
                      عرض البيانات التفاعلية
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <CreateReportDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSave={handleCreateReport}
      />
    </motion.div>
  );
};

export default ReportsManagement;
