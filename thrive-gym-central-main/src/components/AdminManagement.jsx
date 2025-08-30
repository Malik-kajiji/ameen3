import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Filter, Plus, Edit, Trash2, Shield, UserCheck } from 'lucide-react';
import { useAdmin } from '@/hooks/useAdmin';
import AddAdminDialog from './AddAdminDialog';
import EditAdminDialog from './EditAdminDialog';

const AdminManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('admins');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const { admins, getAdmins, createAdmin, updateAdmin, deleteAdmin } = useAdmin();

  useEffect(() => {
    getAdmins();
  }, []);

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
        <Button className="btn-gradient" onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="w-4 h-4 ml-2" />
          إضافة مشرف جديد
        </Button>
      </div>

      
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="card-gradient">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">
                  {admins.filter(u => u.status === 'نشط').length}
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
                <div className="text-2xl font-bold text-green-500">
                  {admins.filter(u => u.role === 'مدير عام').length}
                </div>
                <p className="text-xs text-muted-foreground">المديرون العامون</p>
              </div>
              <Shield className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      
      <div className="flex space-x-1 space-x-reverse bg-muted p-1 rounded-lg w-fit">
        {[
          { key: 'admins', label: 'المشرفون' },
          { key: 'permissions', label: 'الصلاحيات' }
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
              <div className="relative flex-1 sm:w-64">
                <input
                  type="text"
                  placeholder="البحث في المشرفين..."
                  className="w-full px-4 py-2 border border-input rounded-md bg-background text-right"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
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
                  {admins.map((admin) => (
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
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedAdmin(admin);
                              setIsEditDialogOpen(true);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => deleteAdmin(admin._id)}
                          >
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

      <AddAdminDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={async (data) => {
          const success = await createAdmin(data);
          if (success) {
            setIsAddDialogOpen(false);
          }
        }}
      />

      <EditAdminDialog
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setSelectedAdmin(null);
        }}
        onSave={async (data) => {
          const success = await updateAdmin(data);
          if (success) {
            setIsEditDialogOpen(false);
            setSelectedAdmin(null);
          }
        }}
        admin={selectedAdmin}
      />
    </div>
  );
};

export default AdminManagement;
