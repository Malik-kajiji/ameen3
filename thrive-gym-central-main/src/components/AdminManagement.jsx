import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Filter, Plus, Edit, Trash2, Shield, Key, UserCheck, AlertTriangle } from 'lucide-react';

const AdminManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('admins');

  const adminUsers = [
    {
      id: 'ADM-001',
      name: 'أحمد حسن',
      email: 'ahmed@powerfit.ly',
      role: 'مدير عام',
      permissions: ['الكل'],
      lastLogin: '2024-01-20 09:30',
      status: 'نشط',
      createdDate: '2024-01-01'
    },
    {
      id: 'ADM-003',
      name: 'عمر سالم',
      email: 'omar.support@powerfit.ly',
      role: 'دعم فني',
      permissions: ['الأعضاء', 'الممتلكات'],
      lastLogin: '2024-01-18 14:20',
      status: 'غير نشط',
      createdDate: '2024-01-15'
    }
  ];

  const systemLogs = [
    {
      id: 'LOG-001',
      user: 'أحمد حسن',
      action: 'تسجيل دخول',
      details: 'تسجيل دخول ناجح من 192.168.1.100',
      timestamp: '2024-01-20 09:30:15',
      severity: 'معلومة'
    },
    {
      id: 'LOG-002',
      user: 'سارة علي',
      action: 'إنشاء عضو',
      details: 'تم إنشاء عضو جديد: خالد سالم (GM005)',
      timestamp: '2024-01-20 08:45:22',
      severity: 'معلومة'
    },
    {
      id: 'LOG-003',
      user: 'النظام',
      action: 'محاولة دخول فاشلة',
      details: 'محاولات دخول متعددة فاشلة من 192.168.1.250',
      timestamp: '2024-01-20 07:15:33',
      severity: 'تحذير'
    },
    {
      id: 'LOG-004',
      user: 'أحمد حسن',
      action: 'تغيير الإعدادات',
      details: 'تم تحديث إعدادات الأمان',
      timestamp: '2024-01-19 17:30:45',
      severity: 'حرج'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'نشط':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'غير نشط':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'معلومة':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'تحذير':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'حرج':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-6 rtl">
      <div className="flex justify-between items-center">
        <div className="text-right">
          <h2 className="text-3xl font-bold tracking-tight">إدارة النظام والمشرفين</h2>
          <p className="text-muted-foreground">إدارة مستخدمي النظام والأمان</p>
        </div>
        <Button className="btn-gradient">
          <Plus className="w-4 h-4 ml-2" />
          إضافة مشرف جديد
        </Button>
      </div>

      
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="card-gradient">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">
                  {adminUsers.filter(u => u.status === 'نشط').length}
                </div>
                <p className="text-xs text-muted-foreground">المشرفون النشطون</p>
              </div>
              <UserCheck className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="card-gradient">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="text-right">
                <div className="text-2xl font-bold text-green-500">1</div>
                <p className="text-xs text-muted-foreground">المديرون العامون</p>
              </div>
              <Shield className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="card-gradient">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="text-right">
                <div className="text-2xl font-bold text-yellow-500">3</div>
                <p className="text-xs text-muted-foreground">دخول اليوم</p>
              </div>
              <Key className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="card-gradient">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="text-right">
                <div className="text-2xl font-bold text-red-500">1</div>
                <p className="text-xs text-muted-foreground">تنبيهات الأمان</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      
      <div className="flex space-x-1 space-x-reverse bg-muted p-1 rounded-lg w-fit">
        {[
          { key: 'admins', label: 'المشرفون' },
          { key: 'permissions', label: 'الصلاحيات' },
          { key: 'logs', label: 'سجل النشاط' },
          { key: 'security', label: 'الأمان' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'admins' && (
        <Card className="card-gradient">
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <CardTitle>مستخدمو النظام</CardTitle>
              <div className="flex gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <input
                    type="text"
                    placeholder="البحث في المشرفين..."
                    className="w-full pr-10 pl-4 py-2 border border-input rounded-md bg-background text-right"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">الاسم</TableHead>
                    <TableHead className="text-right">البريد الإلكتروني</TableHead>
                    <TableHead className="text-right">الدور</TableHead>
                    <TableHead className="text-right">آخر دخول</TableHead>
                    <TableHead className="text-right">الحالة</TableHead>
                    <TableHead className="text-right">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adminUsers.map((admin) => (
                    <TableRow key={admin.id}>
                      <TableCell className="font-medium text-right">{admin.name}</TableCell>
                      <TableCell className="text-right">{admin.email}</TableCell>
                      <TableCell className="text-right">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          admin.role === 'مدير عام' 
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
                            : admin.role === 'مدير'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                        }`}>
                          {admin.role}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">{admin.lastLogin}</TableCell>
                      <TableCell className="text-right">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(admin.status)}`}>
                          {admin.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
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
      )}

      {activeTab === 'permissions' && (
        <Card className="card-gradient">
          <CardHeader>
            <CardTitle>صلاحيات الأدوار</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {['مدير عام', 'مدير', 'دعم فني'].map((role) => (
                <div key={role} className="p-4 border border-border rounded-lg">
                  <h3 className="font-semibold text-lg mb-4 text-right">{role}</h3>
                  <div className="grid gap-3 md:grid-cols-3">
                    {['الأعضاء', 'الموظفون', 'المالية', 'الممتلكات', 'التقارير', 'الإشعارات', 'البصمة', 'الموقع', 'المشرفون'].map((permission) => (
                      <div key={permission} className="flex items-center space-x-2 space-x-reverse">
                        <input
                          type="checkbox"
                          id={`${role}-${permission}`}
                          className="rounded border-gray-300"
                          defaultChecked={role === 'مدير عام' || (role === 'مدير' && ['الأعضاء', 'المالية', 'التقارير'].includes(permission)) || (role === 'دعم فني' && ['الأعضاء', 'الممتلكات'].includes(permission))}
                        />
                        <label htmlFor={`${role}-${permission}`} className="text-sm">
                          {permission}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'logs' && (
        <Card className="card-gradient">
          <CardHeader>
            <CardTitle>سجل نشاط النظام</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">المستخدم</TableHead>
                    <TableHead className="text-right">الإجراء</TableHead>
                    <TableHead className="text-right">التفاصيل</TableHead>
                    <TableHead className="text-right">التوقيت</TableHead>
                    <TableHead className="text-right">المستوى</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {systemLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium text-right">{log.user}</TableCell>
                      <TableCell className="text-right">{log.action}</TableCell>
                      <TableCell className="max-w-64 truncate text-right">{log.details}</TableCell>
                      <TableCell className="text-right">{log.timestamp}</TableCell>
                      <TableCell className="text-right">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(log.severity)}`}>
                          {log.severity}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'security' && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="card-gradient">
            <CardHeader>
              <CardTitle>إعدادات الأمان</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-right">
                  <p className="font-medium">المصادقة الثنائية</p>
                  <p className="text-sm text-muted-foreground">تطلب المصادقة الثنائية لجميع المشرفين</p>
                </div>
                <Button variant="outline" size="sm">مُفعّل</Button>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-right">
                  <p className="font-medium">انتهاء الجلسة</p>
                  <p className="text-sm text-muted-foreground">خروج تلقائي بعد عدم النشاط</p>
                </div>
                <select className="px-3 py-2 border border-input rounded-md bg-background">
                  <option value="30">30 دقيقة</option>
                  <option value="60">ساعة واحدة</option>
                  <option value="120">ساعتان</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-right">
                  <p className="font-medium">سياسة كلمة المرور</p>
                  <p className="text-sm text-muted-foreground">الحد الأدنى لمتطلبات كلمة المرور</p>
                </div>
                <Button variant="outline" size="sm">تكوين</Button>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-right">
                  <p className="font-medium">قيود عنوان IP</p>
                  <p className="text-sm text-muted-foreground">تحديد الوصول حسب عنوان IP</p>
                </div>
                <Button variant="outline" size="sm">إدارة</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="card-gradient">
            <CardHeader>
              <CardTitle>أحداث الأمان الأخيرة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <div className="text-right">
                      <p className="font-medium">محاولات دخول فاشلة</p>
                      <p className="text-sm text-muted-foreground">5 محاولات من IP غير معروف</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">منذ ساعتين</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <Key className="w-5 h-5 text-yellow-500" />
                    <div className="text-right">
                      <p className="font-medium">تغيير كلمة المرور</p>
                      <p className="text-sm text-muted-foreground">سارة علي قامت بتحديث كلمة المرور</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">منذ يوم</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <Shield className="w-5 h-5 text-green-500" />
                    <div className="text-right">
                      <p className="font-medium">تفعيل المصادقة الثنائية</p>
                      <p className="text-sm text-muted-foreground">عمر سالم فعّل المصادقة الثنائية</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">منذ 3 أيام</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminManagement;
