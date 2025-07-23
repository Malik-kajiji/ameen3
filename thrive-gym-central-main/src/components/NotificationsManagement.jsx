import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Bell, Send, Users, Mail, MessageSquare, Plus } from 'lucide-react';
import CreateNotificationDialog from './CreateNotificationDialog';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationsManagement = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [showCreateNotification, setShowCreateNotification] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 'NOT-001',
      title: 'تذكير انتهاء العضوية',
      message: 'عضويتك تنتهي خلال 3 أيام',
      recipient: 'أحمد علي',
      type: 'تلقائي',
      status: 'مُرسل',
      date: '2024-01-15 10:30'
    },
    {
      id: 'NOT-002',
      title: 'عرض جديد متاح',
      message: 'خصم 20% على الاشتراك السنوي',
      recipient: 'جميع الأعضاء',
      type: 'يدوي',
      status: 'مجدول',
      date: '2024-01-16 09:00'
    },
    {
      id: 'NOT-003',
      title: 'طلب الإيقاف موافق عليه',
      message: 'تم الموافقة على طلب إيقاف عضويتك',
      recipient: 'سارة حسن',
      type: 'تلقائي',
      status: 'مُرسل',
      date: '2024-01-14 14:20'
    }
  ]);

  const tabs = [
    { key: 'all', label: 'الكل' },
    { key: 'sent', label: 'مُرسل' },
    { key: 'scheduled', label: 'مجدول' },
    { key: 'failed', label: 'فاشل' }
  ];

  const handleCreateNotification = (newNotification) => {
    setNotifications(prev => [newNotification, ...prev]);
    console.log('إنشاء إشعار جديد:', newNotification);
  };

  const handleQuickAction = (actionType) => {
    console.log('تنفيذ إجراء سريع:', actionType);
  };

  const filteredNotifications =
    activeTab === 'all'
      ? notifications
      : notifications.filter(n =>
          activeTab === 'sent'
            ? n.status === 'مُرسل'
            : activeTab === 'scheduled'
            ? n.status === 'مجدول'
            : n.status === 'فاشل'
        );

  const fade = {
    hidden: { opacity: 0, y: 28 },
    show: { opacity: 1, y: 0, transition: { duration: 0.38, type: 'spring' } },
  };
  const cardFade = i => ({
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { delay: i * 0.08 + 0.04, duration: 0.3, type: 'spring' } },
  });

  return (
    <motion.div className="space-y-6 rtl" variants={fade} initial="hidden" animate="show">
      <motion.div variants={fade}>
        <div className="flex justify-between items-center">
          <div className="text-right">
            <h2 className="text-3xl font-bold tracking-tight">إدارة الإشعارات</h2>
            <p className="text-muted-foreground">إرسال وإدارة الإشعارات للأعضاء والموظفين</p>
          </div>
          <Button
            className="btn-gradient"
            onClick={() => setShowCreateNotification(true)}
            whileHover={{ scale: 1.05 }}
          >
            <Plus className="w-4 h-4 ml-2" />
            إنشاء إشعار
          </Button>
        </div>
      </motion.div>

      <motion.div className="grid gap-4 md:grid-cols-4" initial="hidden" animate="show">
        {[
          {
            value: notifications.filter(n => n.status === 'مُرسل').length,
            label: 'إجمالي المُرسل',
            color: 'text-primary',
            icon: <Send className="w-8 h-8 text-primary" />,
          },
          {
            value: '89%',
            label: 'معدل القراءة',
            color: 'text-green-500',
            icon: <Mail className="w-8 h-8 text-green-500" />,
          },
          {
            value: notifications.filter(n => n.status === 'مجدول').length,
            label: 'مجدول',
            color: 'text-yellow-500',
            icon: <Bell className="w-8 h-8 text-yellow-500" />,
          },
          {
            value: 45,
            label: 'هذا الأسبوع',
            color: 'text-blue-500',
            icon: <MessageSquare className="w-8 h-8 text-blue-500" />,
          },
        ].map((item, i) => (
          <motion.div key={i} variants={cardFade(i)} initial="hidden" animate="show">
            <Card className="card-gradient">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${item.color}`}>{item.value}</div>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                  </div>
                  {item.icon}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <motion.div className="grid gap-4 md:grid-cols-3" initial="hidden" animate="show">
        {[
          {
            icon: <Users className="w-8 h-8 text-primary" />,
            title: 'إشعار لجميع الأعضاء',
            desc: 'إرسال إشعار لجميع الأعضاء النشطين',
            onClick: () => handleQuickAction('all-members'),
          },
          {
            icon: <Bell className="w-8 h-8 text-green-500" />,
            title: 'تذكيرات الانتهاء',
            desc: 'إرسال تذكيرات للعضويات المنتهية',
            onClick: () => handleQuickAction('expiry-reminders'),
          },
          {
            icon: <MessageSquare className="w-8 h-8 text-blue-500" />,
            title: 'رسالة مخصصة',
            desc: 'إنشاء وإرسال إشعار مخصص',
            onClick: () => setShowCreateNotification(true),
          },
        ].map((action, i) => (
          <motion.div
            key={action.title}
            variants={cardFade(i)}
            initial="hidden"
            animate="show"
            whileHover={{ scale: 1.03 }}
          >
            <Card
              className="card-gradient cursor-pointer hover:bg-accent transition-colors"
              onClick={action.onClick}
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 space-x-reverse">
                  {action.icon}
                  <div className="text-right">
                    <h3 className="font-semibold">{action.title}</h3>
                    <p className="text-sm text-muted-foreground">{action.desc}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <motion.div variants={fade}>
        <Card className="card-gradient">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>سجل الإشعارات</CardTitle>
              <div className="flex space-x-2 space-x-reverse">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      activeTab === tab.key
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <AnimatePresence>
              <motion.div
                key={activeTab}
                variants={fade}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0, y: 32, transition: { duration: 0.16 } }}
              >
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">الإجراءات</TableHead>
                        <TableHead className="text-right">التاريخ</TableHead>
                        <TableHead className="text-right">الحالة</TableHead>
                        <TableHead className="text-right">النوع</TableHead>
                        <TableHead className="text-right">المستقبل</TableHead>
                        <TableHead className="text-right">العنوان</TableHead>
                        <TableHead className="text-right">الرقم</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredNotifications.map((notification, i) => (
                        <motion.tr
                          key={notification.id}
                          variants={cardFade(i)}
                          initial="hidden"
                          animate="show"
                          exit="hidden"
                        >
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              عرض
                            </Button>
                          </TableCell>
                          <TableCell className="text-right">{notification.date}</TableCell>
                          <TableCell className="text-right">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              notification.status === 'مُرسل'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                            }`}>
                              {notification.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              notification.type === 'تلقائي'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                                : 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
                            }`}>
                              {notification.type}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">{notification.recipient}</TableCell>
                          <TableCell className="text-right">{notification.title}</TableCell>
                          <TableCell className="font-medium text-right">{notification.id}</TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>

      <CreateNotificationDialog
        isOpen={showCreateNotification}
        onClose={() => setShowCreateNotification(false)}
        onSave={handleCreateNotification}
      />
    </motion.div>
  );
};

export default NotificationsManagement;
