import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Filter, Download, Plus, Edit, Eye, Trash2, Calendar } from 'lucide-react';
import EmployeeDetailsDialog from './EmployeeDetailsDialog';
import AddEmployeeDialog from './AddEmployeeDialog';
import AttendanceCalendar from './AttendanceCalendar';
import { motion } from 'framer-motion';

const fade = { hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { type: 'spring', duration: 0.4 } } };
const cardAnim = i => ({
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { delay: i * 0.07 + 0.11, type: 'spring', duration: 0.36 } }
});

const EmployeesManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [showAttendance, setShowAttendance] = useState(false);
  const [attendanceEmployee, setAttendanceEmployee] = useState(null);

  const [employees, setEmployees] = useState([
    {
      id: 'EMP001',
      name: 'أحمد حسن',
      role: 'مدرب',
      phone: '+218 91 234 5678',
      email: 'ahmed@powerfit.ly',
      salary: '800 د.ل',
      status: 'نشط',
      joinDate: '2024-01-15',
      address: 'طرابلس - حي الأندلس',
      emergencyContact: '+218 92 123 4567',
      notes: 'مدرب محترف مع خبرة 5 سنوات'
    },
    {
      id: 'EMP002',
      name: 'سارة علي',
      role: 'موظفة استقبال',
      phone: '+218 92 345 6789',
      email: 'sara@powerfit.ly',
      salary: '600 د.ل',
      status: 'نشط',
      joinDate: '2024-02-01',
      address: 'طرابلس - حي النصر',
      emergencyContact: '+218 93 234 5678',
      notes: 'موظفة مجتهدة ومتعاونة'
    },
    {
      id: 'EMP003',
      name: 'عمر سالم',
      role: 'عامل نظافة',
      phone: '+218 93 456 7890',
      email: 'omar@powerfit.ly',
      salary: '400 د.ل',
      status: 'نشط',
      joinDate: '2024-01-20',
      address: 'طرابلس - حي الدهماني',
      emergencyContact: '+218 94 345 6789',
      notes: 'عامل مخلص ومنضبط'
    }
  ]);

  if (showAttendance && attendanceEmployee) {
    return (
      <motion.div className="space-y-6 rtl" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex justify-between items-center">
          <Button 
            onClick={() => {
              setShowAttendance(false);
              setAttendanceEmployee(null);
            }}
            variant="outline"
          >
            العودة لقائمة الموظفين
          </Button>
        </div>
        <AttendanceCalendar 
          employeeId={attendanceEmployee.id}
          employeeName={attendanceEmployee.name}
        />
      </motion.div>
    );
  }

  const filteredEmployees = employees.filter(emp =>
    (emp.name && emp.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (emp.id && emp.id.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (emp.role && emp.role.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSaveEmployee = (updatedEmployee) => {
    setEmployees(prev =>
      prev.map(emp => (emp.id === updatedEmployee.id ? updatedEmployee : emp))
    );
    setIsDetailsDialogOpen(false);
    setSelectedEmployee(null);
  };

  const handleAddEmployee = (newEmployee) => {
    setEmployees([...employees, newEmployee]);
    setIsAddDialogOpen(false);
  };

  const handleDeleteEmployee = (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الموظف؟')) {
      setEmployees(prev => prev.filter(emp => emp.id !== id));
    }
  };

  const handleViewEmployee = (employee) => {
    setSelectedEmployee(employee);
    setIsDetailsDialogOpen(true);
  };

  const handleViewAttendance = (employee) => {
    setAttendanceEmployee(employee);
    setShowAttendance(true);
  };

  return (
    <motion.div variants={fade} initial="hidden" animate="show" className="space-y-6 rtl">

      <motion.div variants={fade} className="flex justify-between items-center">
        <div className="text-right">
          <motion.h2 className="text-3xl font-bold tracking-tight"
            initial={{ x: 32, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            إدارة الموظفين
          </motion.h2>
          <motion.p className="text-muted-foreground"
            initial={{ y: 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.09 }}
          >
            إدارة موظفي الصالة ومعلوماتهم
          </motion.p>
        </div>
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.16 }}>
          <Button 
            className="btn-gradient"
            onClick={() => setIsAddDialogOpen(true)}
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="w-4 h-4 ml-2" />
            إضافة موظف جديد
          </Button>
        </motion.div>
      </motion.div>

      <motion.div variants={fade} initial="hidden" animate="show">
        <Card className="card-gradient shadow-lg hover:shadow-2xl transition-all duration-200">
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <CardTitle>جميع الموظفين ({filteredEmployees.length})</CardTitle>
              <div className="flex gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <input
                    type="text"
                    placeholder="البحث في الموظفين..."
                    className="w-full pr-10 pl-4 py-2 border border-input rounded-md bg-background text-right"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">رقم الموظف</TableHead>
                    <TableHead className="text-right">الاسم</TableHead>
                    <TableHead className="text-right">المنصب</TableHead>
                    <TableHead className="text-right">الهاتف</TableHead>
                    <TableHead className="text-right">البريد الإلكتروني</TableHead>
                    <TableHead className="text-right">الراتب</TableHead>
                    <TableHead className="text-right">الحالة</TableHead>
                    <TableHead className="text-right">تاريخ التوظيف</TableHead>
                    <TableHead className="text-right">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.map((employee, i) => (
                    <motion.tr key={employee.id} variants={cardAnim(i)} initial="hidden" animate="show">
                      <TableCell className="font-medium text-right">{employee.id}</TableCell>
                      <TableCell className="text-right">{employee.name}</TableCell>
                      <TableCell className="text-right">{employee.role}</TableCell>
                      <TableCell className="text-right">{employee.phone}</TableCell>
                      <TableCell className="text-right">{employee.email}</TableCell>
                      <TableCell className="text-right">{employee.salary}</TableCell>
                      <TableCell className="text-right">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                          {employee.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">{employee.joinDate}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleViewEmployee(employee)}
                            title="عرض التفاصيل"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleViewAttendance(employee)}
                            title="سجل الحضور"
                          >
                            <Calendar className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleViewEmployee(employee)}
                            title="تعديل"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-red-500 hover:text-red-700"
                            title="حذف"
                            onClick={() => handleDeleteEmployee(employee.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div className="grid gap-4 md:grid-cols-3">
        {[
          {
            value: employees.filter(e => e.status === 'نشط').length,
            label: 'الموظفون النشطون',
            color: 'text-green-500'
          },
          {
            value: employees.reduce((sum, emp) => sum + parseInt(emp.salary.replace(/[^\d]/g, '')), 0) + ' د.ل',
            label: 'إجمالي الرواتب الشهرية',
            color: 'text-primary'
          },
          {
            value: [...new Set(employees.map(e => e.role))].length,
            label: 'الأقسام',
            color: 'text-blue-500'
          }
        ].map((stat, i) => (
          <motion.div key={i} variants={cardAnim(i)} initial="hidden" animate="show">
            <Card className="card-gradient shadow hover:shadow-lg transition-all duration-200">
              <CardContent className="p-6 text-right">
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <EmployeeDetailsDialog
        employee={selectedEmployee}
        isOpen={isDetailsDialogOpen}
        onClose={() => {
          setIsDetailsDialogOpen(false);
          setSelectedEmployee(null);
        }}
        onSave={handleSaveEmployee}
      />

      <AddEmployeeDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSave={handleAddEmployee}
      />
    </motion.div>
  );
};

export default EmployeesManagement;
