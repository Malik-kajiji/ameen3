import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Globe, Edit, Eye, Upload, Settings, Users, Calendar, MessageSquare } from 'lucide-react';

const fadeSlide = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.1 * i, duration: 0.5 },
  }),
};

const WebsiteManagement = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const pageStats = [
    { page: 'الصفحة الرئيسية', views: '2,847', visitors: '1,923', bounceRate: '32%' },
    { page: 'خطط العضوية', views: '1,456', visitors: '1,234', bounceRate: '28%' },
    { page: 'من نحن', views: '892', visitors: '743', bounceRate: '45%' },
    { page: 'اتصل بنا', views: '634', visitors: '587', bounceRate: '25%' },
  ];

  const tabs = [
    { key: 'overview', label: 'نظرة عامة' },
    { key: 'content', label: 'إدارة المحتوى' },
  ];

  return (
    <motion.div
      dir="rtl"
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={fadeSlide}
    >

      <motion.div className="flex justify-between items-center" variants={fadeSlide} custom={1}>
        <div className="text-right">
          <h2 className="text-3xl font-bold tracking-tight">إدارة الموقع الإلكتروني</h2>
          <p className="text-muted-foreground">إدارة الحضور الرقمي للنادي الرياضي والمحتوى</p>
        </div>
        <div className="flex gap-2 flex-row-reverse">
          <Button variant="outline" asChild>
            <a href="#" tabIndex={-1}>
              <Eye className="w-4 h-4 ml-2" />
              معاينة الموقع
            </a>
          </Button>
          <Button className="btn-gradient" asChild>
            <a href="#" tabIndex={-1}>
              <Globe className="w-4 h-4 ml-2" />
              زيارة الموقع
            </a>
          </Button>
        </div>
      </motion.div>

      <motion.div className="grid gap-4 md:grid-cols-4" variants={fadeSlide} custom={2}>
        {[
          {
            label: 'إجمالي مشاهدات الصفحة',
            value: '5,829',
            icon: <Eye className="w-8 h-8 text-primary" />,
            color: 'text-primary',
          },
          {
            label: 'الزوار الفريدون',
            value: '3,487',
            icon: <Users className="w-8 h-8 text-green-500" />,
            color: 'text-green-500',
          },
          {
            label: 'الاستفسارات الجديدة',
            value: '47',
            icon: <MessageSquare className="w-8 h-8 text-blue-500" />,
            color: 'text-blue-500',
          },
          {
            label: 'معدل التحويل',
            value: '32%',
            icon: <Calendar className="w-8 h-8 text-custom-orange" />,
            color: 'text-custom-orange',
          },
        ].map((stat, i) => (
          <motion.div key={i} variants={fadeSlide} custom={i + 2}>
            <Card className="card-gradient">
              <CardContent className="p-6">
                <div className="flex items-center justify-between flex-row-reverse">
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                  {stat.icon}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="flex flex-row-reverse space-x-1 space-x-reverse bg-muted p-1 rounded-lg w-fit"
        variants={fadeSlide}
        custom={3}
      >
        {tabs.map((tab, i) => (
          <motion.button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            whileTap={{ scale: 0.97 }}
            variants={fadeSlide}
            custom={i + 4}
          >
            {tab.label}
          </motion.button>
        ))}
      </motion.div>

      <AnimatePresence mode="wait">

        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.4 } }}
            exit={{ opacity: 0, y: 40, transition: { duration: 0.3 } }}
            className="grid gap-6 md:grid-cols-2"
          >

            <Card className="card-gradient">
              <CardHeader>
                <CardTitle className="text-right">الإجراءات السريعة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  {
                    label: 'تحرير محتوى الصفحة الرئيسية',
                    icon: <Edit className="w-5 h-5 text-primary" />,
                  },
                  { label: 'تحديث صور المعرض', icon: <Upload className="w-5 h-5 text-primary" /> },
                  { label: 'تحديث جدول الحصص', icon: <Calendar className="w-5 h-5 text-primary" /> },
                  { label: 'إعدادات الموقع', icon: <Settings className="w-5 h-5 text-primary" /> },
                ].map((action, i) => (
                  <motion.button
                    key={action.label}
                    className="w-full text-right p-3 rounded-md bg-primary/10 hover:bg-primary/20 transition-colors"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    variants={fadeSlide}
                    custom={i}
                  >
                    <div className="flex items-center space-x-3 space-x-reverse justify-end">
                      <span>{action.label}</span>
                      {action.icon}
                    </div>
                  </motion.button>
                ))}
              </CardContent>
            </Card>

            <Card className="card-gradient">
              <CardHeader>
                <CardTitle className="text-right">أداء الصفحات</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pageStats.map((page, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0, transition: { delay: 0.1 * index } }}
                    >
                      <div className="text-left">
                        <p className="text-sm font-medium">{page.bounceRate}</p>
                        <p className="text-xs text-muted-foreground">معدل الارتداد</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{page.page}</p>
                        <p className="text-sm text-muted-foreground">
                          {page.views} مشاهدة • {page.visitors} زائر
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {activeTab === 'content' && (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.4 } }}
            exit={{ opacity: 0, y: 40, transition: { duration: 0.3 } }}
            className="grid gap-6"
          >
            <Card className="card-gradient">
              <CardHeader>
                <CardTitle className="text-right">إدارة المحتوى</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  {[
                    { title: 'عنوان الصفحة الرئيسية', desc: 'البانر الرئيسي ودعوة للعمل' },
                    { title: 'خطط العضوية', desc: 'الأسعار وتفاصيل الخطط' },
                    { title: 'من نحن', desc: 'معلومات النادي وقصتنا' },
                    { title: 'المدربون', desc: 'ملفات الموظفين والخبرات' },
                    { title: 'المعرض', desc: 'صور ومقاطع فيديو النادي' },
                    { title: 'معلومات الاتصال', desc: 'العنوان وتفاصيل الاتصال' },
                  ].map((section, i) => (
                    <motion.div
                      key={section.title}
                      className="p-4 border border-border rounded-lg hover:bg-accent transition-colors cursor-pointer"
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1, transition: { delay: 0.1 * i } }}
                      whileHover={{ scale: 1.03 }}
                    >
                      <h3 className="font-semibold mb-2 text-right">{section.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3 text-right">{section.desc}</p>
                      <Button variant="outline" size="sm">
                        تحرير
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default WebsiteManagement;
