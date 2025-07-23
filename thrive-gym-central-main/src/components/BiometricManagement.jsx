import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Fingerprint, 
  Shield, 
  Users, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Settings,
  Download,
  Upload,
  Scan,
  UserCheck,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const fade = { hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { type: 'spring', duration: 0.55 } } };
const cardAnim = i => ({
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { delay: i * 0.07 + 0.17, type: 'spring', duration: 0.42 } }
});
const tabAnim = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.3 } }, exit: { opacity: 0, transition: { duration: 0.1 } } };

const BiometricManagement = () => {
  const [activeTab, setActiveTab] = useState('devices');

  const devices = [
    {
      id: 'DEV-002', 
      name: 'جهاز منطقة الأوزان',
      type: 'card',
      status: 'نشط',
      location: 'منطقة الأوزان',
      lastSync: '2024-01-20 14:25',
      usersCount: 98
    },
    {
      id: 'DEV-003',
      name: 'جهاز صالة الكارديو',
      type: 'fingerprint',
      status: 'غير متصل',
      location: 'صالة الكارديو',
      lastSync: '2024-01-19 16:45',
      usersCount: 87
    }
  ];

  const accessLogs = [
    {
      id: 'LOG-002',
      memberName: 'فاطمة علي',
      memberId: 'GM045',
      device: 'جهاز منطقة الأوزان',
      timestamp: '2024-01-20 08:25:43',
      status: 'نجح',
      method: 'بطاقة ممغنطة'
    },
    {
      id: 'LOG-003',
      memberName: 'سارة حسن',
      memberId: 'GM078',
      device: 'بوابة المدخل الرئيسي',
      timestamp: '2024-01-20 08:20:12',
      status: 'فشل',
      method: 'بصمة الإصبع'
    }
  ];

  const stats = [
    { label: 'إجمالي الأجهزة', value: '3', change: '0', trend: 'stable', icon: Fingerprint },
    { label: 'الأجهزة النشطة', value: '2', change: '0', trend: 'stable', icon: CheckCircle },
    { label: 'المستخدمين المسجلين', value: '310', change: '+5', trend: 'up', icon: Users },
    { label: 'محاولات الوصول اليوم', value: '247', change: '+12', trend: 'up', icon: Activity }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'نشط':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'غير متصل':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'نجح':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'فشل':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getMethodIcon = (method) => {
    switch (method) {
      case 'بصمة الإصبع':
        return <Fingerprint className="w-4 h-4" />;
      case 'بطاقة ممغنطة':
        return <Shield className="w-4 h-4" />;
      default:
        return <Scan className="w-4 h-4" />;
    }
  };

  return (
    <motion.div variants={fade} initial="hidden" animate="show" className="space-y-6 rtl">
      <motion.div variants={fade} className="flex justify-between items-center">
        <div className="text-right">
          <motion.h2 className="text-3xl font-bold tracking-tight" initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>إدارة البصمة والدخول</motion.h2>
          <motion.p className="text-muted-foreground" initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.08 }}>مراقبة أجهزة البصمة وسجلات الدخول</motion.p>
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.93 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.16 }}>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="w-4 h-4 ml-2" />
              تصدير السجلات
            </Button>
            <Button variant="outline">
              <Upload className="w-4 h-4 ml-2" />
              مزامنة الأجهزة
            </Button>
          </div>
        </motion.div>
      </motion.div>

      <motion.div className="grid gap-4 grid-cols-1 md:grid-cols-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div key={i} variants={cardAnim(i)} initial="hidden" animate="show">
              <Card className="card-gradient shadow-md shadow-black/5">
                <CardContent className="p-6 text-right">
                  <div className="flex items-center justify-between">
                    <Icon className="w-8 h-8 text-primary" />
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{stat.value}</div>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                      <div className="flex items-center mt-1 justify-end">
                        <span className={`text-sm ${
                          stat.trend === 'up' ? 'text-green-500' : 
                          stat.trend === 'down' ? 'text-red-500' : 'text-gray-500'
                        }`}>
                          {stat.change}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

    
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex space-x-1 space-x-reverse bg-muted p-1 rounded-lg w-fit">
        {[
          { key: 'devices', label: 'الأجهزة', icon: Fingerprint },
          { key: 'logs', label: 'سجلات الدخول', icon: Clock },
          { key: 'users', label: 'إدارة المستخدمين', icon: Users }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                activeTab === tab.key
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </motion.div>

      <AnimatePresence mode="wait">
        {activeTab === 'devices' && (
          <motion.div
            key="tab-devices"
            variants={tabAnim}
            initial="hidden"
            animate="show"
            exit="exit"
          >
            <Card className="card-gradient">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-right">الأجهزة المسجلة ({devices.length})</CardTitle>
                  <Button className="btn-gradient">
                    <Settings className="w-4 h-4 ml-2" />
                    إضافة جهاز جديد
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">رقم الجهاز</TableHead>
                        <TableHead className="text-right">اسم الجهاز</TableHead>
                        <TableHead className="text-right">النوع</TableHead>
                        <TableHead className="text-right">الموقع</TableHead>
                        <TableHead className="text-right">الحالة</TableHead>
                        <TableHead className="text-right">آخر مزامنة</TableHead>
                        <TableHead className="text-right">عدد المستخدمين</TableHead>
                        <TableHead className="text-right">الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {devices.map((device) => (
                        <TableRow key={device.id}>
                          <TableCell className="font-medium text-right">{device.id}</TableCell>
                          <TableCell className="text-right">{device.name}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center gap-2 justify-end">
                              {device.type === 'fingerprint' ? (
                                <Fingerprint className="w-4 h-4" />
                              ) : (
                                <Shield className="w-4 h-4" />
                              )}
                              {device.type === 'fingerprint' ? 'بصمة الإصبع' : 'بطاقة ممغنطة'}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">{device.location}</TableCell>
                          <TableCell className="text-right">
                            <Badge className={getStatusColor(device.status)}>{device.status}</Badge>
                          </TableCell>
                          <TableCell className="text-right text-sm text-muted-foreground">
                            {device.lastSync}
                          </TableCell>
                          <TableCell className="text-right">{device.usersCount}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-1 justify-end">
                              <Button variant="outline" size="sm">
                                <Settings className="w-4 h-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <UserCheck className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {activeTab === 'logs' && (
          <motion.div
            key="tab-logs"
            variants={tabAnim}
            initial="hidden"
            animate="show"
            exit="exit"
          >
            <Card className="card-gradient">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-right">سجلات الدخول الأخيرة ({accessLogs.length})</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Clock className="w-4 h-4 ml-2" />
                      فلترة حسب التاريخ
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 ml-2" />
                      تصدير
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">رقم العضو</TableHead>
                        <TableHead className="text-right">اسم العضو</TableHead>
                        <TableHead className="text-right">الجهاز</TableHead>
                        <TableHead className="text-right">طريقة الدخول</TableHead>
                        <TableHead className="text-right">التوقيت</TableHead>
                        <TableHead className="text-right">الحالة</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {accessLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="font-medium text-right">{log.memberId}</TableCell>
                          <TableCell className="text-right">{log.memberName}</TableCell>
                          <TableCell className="text-right">{log.device}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center gap-2 justify-end">
                              {getMethodIcon(log.method)}
                              {log.method}
                            </div>
                          </TableCell>
                          <TableCell className="text-right text-sm text-muted-foreground">
                            {log.timestamp}
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge className={getStatusColor(log.status)}>{log.status}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {activeTab === 'users' && (
          <motion.div
            key="tab-users"
            variants={tabAnim}
            initial="hidden"
            animate="show"
            exit="exit"
          >
            <Card className="card-gradient">
              <CardHeader>
                <CardTitle className="text-right">إدارة بصمات المستخدمين</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Scan className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">إدارة بصمات الأعضاء</h3>
                  <p className="text-muted-foreground mb-4">
                    يمكنك إضافة أو تعديل أو حذف بصمات الأعضاء من هنا
                  </p>
                  <div className="flex gap-2 justify-center">
                    <Button className="btn-gradient">
                      <UserCheck className="w-4 h-4 ml-2" />
                      تسجيل بصمة جديدة
                    </Button>
                    <Button variant="outline">
                      <Users className="w-4 h-4 ml-2" />
                      إدارة البصمات الموجودة
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default BiometricManagement;
