import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Edit, Save, X } from 'lucide-react';
import useFinancial from '@/hooks/useFinancial';
import useEmployees from '@/hooks/useEmployees';


const EmployeeDetailsDialog = ({ employee, isOpen, onClose, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedEmployee, setEditedEmployee] = useState(employee);
  const [newAttendanceDate, setNewAttendanceDate] = useState('');
  const [newAttendanceHours, setNewAttendanceHours] = useState('8');
  const [newAttendanceStatus, setNewAttendanceStatus] = useState('حضر');
  
  const {
    getEmployeeAttendance,
    createAttendance,
    updateAttendance,
    paySalary,
    getSalaryHistory,
    attendanceRecords,
    salaryHistory
  } = useEmployees();

  useEffect(() => {
    if (employee?.id) {
      getEmployeeAttendance(employee.id);
      getSalaryHistory(employee.id);
    }
  }, [employee?.id]);

  const { createInvoice } = useFinancial();

  const handleSave = () => {
    if (editedEmployee) {
      onSave(editedEmployee);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedEmployee(employee);
    setIsEditing(false);
  };

  if (!employee) return null;


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>

      <DialogContent
        dir="rtl"
        className="rtl max-w-4xl max-h-[90vh] overflow-y-auto text-right"
      >
        <DialogHeader>
          <div className="flex items-center justify-between rtl:flex-row-reverse">
            <div className="flex gap-2 rtl:flex-row-reverse rtl:space-x-reverse">
              {isEditing ? (
                <>
                  <Button
                    onClick={handleSave}
                    size="sm"
                    className="btn-gradient flex items-center gap-1 rtl:flex-row-reverse rtl:space-x-reverse"
                  >
                    <Save className="w-4 h-4" />
                    حفظ
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 rtl:flex-row-reverse rtl:space-x-reverse"
                  >
                    <X className="w-4 h-4" />
                    إلغاء
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 rtl:flex-row-reverse rtl:space-x-reverse"
                >
                  <Edit className="w-4 h-4" />
                  تعديل
                </Button>
              )}
            </div>

            <DialogTitle className="text-xl font-bold whitespace-nowrap">
              ملف الموظف: {employee.name}
            </DialogTitle>
          </div>
        </DialogHeader>

        <Tabs defaultValue="info" className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="info">المعلومات الأساسية</TabsTrigger>
            <TabsTrigger value="attendance">سجل الحضور</TabsTrigger>
            <TabsTrigger value="salary">تاريخ الرواتب</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4 mt-4">

            <div className="grid md:grid-cols-2 gap-4 rtl:grid-flow-dense">
              <div className="space-y-2 order-1">
                <Label htmlFor="name">الاسم الكامل</Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={editedEmployee?.name || ''}
                    onChange={(e) =>
                      setEditedEmployee((prev) =>
                        prev ? { ...prev, name: e.target.value } : null
                      )
                    }
                  />
                ) : (
                  <div className="p-2 border rounded">{employee.name}</div>
                )}
              </div>

              <div className="space-y-2 order-2">
                <Label htmlFor="role">المنصب</Label>
                {isEditing ? (
                  <Select
                    value={editedEmployee?.role || ''}
                    onValueChange={(value) =>
                      setEditedEmployee((prev) =>
                        prev ? { ...prev, role: value } : null
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المنصب" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="مدرب">مدرب</SelectItem>
                      <SelectItem value="موظف استقبال">موظف استقبال</SelectItem>
                      <SelectItem value="عامل نظافة">عامل نظافة</SelectItem>
                      <SelectItem value="مدير">مدير</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="p-2 border rounded">{employee.role}</div>
                )}
              </div>

              <div className="space-y-2 order-3">
                <Label htmlFor="phone">رقم الهاتف</Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    value={editedEmployee?.phone || ''}
                    onChange={(e) =>
                      setEditedEmployee((prev) =>
                        prev ? { ...prev, phone: e.target.value } : null
                      )
                    }
                  />
                ) : (
                  <div className="p-2 border rounded">{employee.phone}</div>
                )}
              </div>

              <div className="space-y-2 order-4">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                {isEditing ? (
                  <Input
                    id="email"
                    type="email"
                    value={editedEmployee?.email || ''}
                    onChange={(e) =>
                      setEditedEmployee((prev) =>
                        prev ? { ...prev, email: e.target.value } : null
                      )
                    }
                  />
                ) : (
                  <div className="p-2 border rounded">{employee.email}</div>
                )}
              </div>

              <div className="space-y-2 order-5">
                <Label htmlFor="salary">الراتب</Label>
                {isEditing ? (
                  <Input
                    id="salary"
                    value={editedEmployee?.salary || ''}
                    onChange={(e) =>
                      setEditedEmployee((prev) =>
                        prev ? { ...prev, salary: e.target.value } : null
                      )
                    }
                  />
                ) : (
                  <div className="p-2 border rounded">{employee.salary}</div>
                )}
              </div>

              <div className="space-y-2 order-6">
                <Label htmlFor="status">الحالة</Label>
                {isEditing ? (
                  <Select
                    value={editedEmployee?.status || ''}
                    onValueChange={(value) =>
                      setEditedEmployee((prev) =>
                        prev ? { ...prev, status: value } : null
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الحالة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="نشط">نشط</SelectItem>
                      <SelectItem value="معطل">معطل</SelectItem>
                      <SelectItem value="في إجازة">في إجازة</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge
                    variant={employee.status === 'نشط' ? 'default' : 'secondary'}
                    className="px-3 py-1"
                  >
                    {employee.status}
                  </Badge>
                )}
              </div>

              <div className="space-y-2 md:col-span-2 order-7">
                <Label htmlFor="address">العنوان</Label>
                {isEditing ? (
                  <Textarea
                    id="address"
                    rows={2}
                    value={editedEmployee?.address || ''}
                    onChange={(e) =>
                      setEditedEmployee((prev) =>
                        prev ? { ...prev, address: e.target.value } : null
                      )
                    }
                  />
                ) : (
                  <div className="p-2 border rounded">
                    {employee.address || 'غير محدد'}
                  </div>
                )}
              </div>

              <div className="space-y-2 md:col-span-2 order-8">
                <Label htmlFor="notes">ملاحظات</Label>
                {isEditing ? (
                  <Textarea
                    id="notes"
                    rows={3}
                    value={editedEmployee?.notes || ''}
                    onChange={(e) =>
                      setEditedEmployee((prev) =>
                        prev ? { ...prev, notes: e.target.value } : null
                      )
                    }
                  />
                ) : (
                  <div className="p-2 border rounded min-h-[80px]">
                    {employee.notes || 'لا توجد ملاحظات'}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>


          <TabsContent value="attendance" className="mt-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>سجل الحضور</CardTitle>
                <div className="flex gap-2">
                  <input
                    type="date"
                    className="px-3 py-2 border border-input rounded-md bg-background"
                    value={newAttendanceDate}
                    onChange={(e) => setNewAttendanceDate(e.target.value)}
                  />
                  <input
                    type="number"
                    className="w-20 px-3 py-2 border border-input rounded-md bg-background"
                    value={newAttendanceHours}
                    onChange={(e) => setNewAttendanceHours(e.target.value)}
                    min="0"
                    max="24"
                  />
                  <Select value={newAttendanceStatus} onValueChange={setNewAttendanceStatus}>
                    <SelectTrigger className="w-[100px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="حضر">حضر</SelectItem>
                      <SelectItem value="غائب">غائب</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    className="btn-gradient"
                    onClick={async () => {
                      await createAttendance(
                        employee.id,
                        newAttendanceDate,
                        newAttendanceStatus,
                        parseInt(newAttendanceHours)
                      );
                      setNewAttendanceDate('');
                      setNewAttendanceHours('8');
                      setNewAttendanceStatus('حضر');
                    }}
                  >
                    إضافة
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {attendanceRecords.map((record) => (
                  <div
                    key={record._id}
                    className="flex items-center justify-between p-3 border rounded rtl:flex-row-reverse"
                  >
                    <div>
                      <div className="font-medium">
                        {new Date(record.date).toLocaleDateString('ar-EG')}
                      </div>
                      {isEditing ? (
                        <input
                          type="number"
                          className="w-20 mt-1 px-2 py-1 border border-input rounded-md bg-background"
                          value={record.hours}
                          onChange={(e) => {
                            updateAttendance(record._id, record.status, parseInt(e.target.value));
                          }}
                          min="0"
                          max="24"
                        />
                      ) : (
                        <div className="text-sm text-muted-foreground">
                          {record.hours} ساعات
                        </div>
                      )}
                    </div>
                    {isEditing ? (
                      <Select
                        value={record.status}
                        onValueChange={(value) => {
                          updateAttendance(record._id, value, record.hours);
                        }}
                      >
                        <SelectTrigger className="w-[100px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="حضر">حضر</SelectItem>
                          <SelectItem value="غائب">غائب</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge variant={record.status === 'حضر' ? 'default' : 'destructive'}>
                        {record.status}
                      </Badge>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="salary" className="mt-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>تاريخ الرواتب</CardTitle>
                <Button
                  className="btn-gradient"
                  onClick={async () => {
                    const date = new Date().toISOString().split('T')[0];
                    const month = new Date().toLocaleDateString('ar-EG', { month: 'long', year: 'numeric' });
                    
                    await paySalary(
                      employee.id,
                      employee.salary,
                      month,
                      date,
                      `راتب شهر ${month}`
                    );
                  }}
                >
                  دفع راتب هذا الشهر
                </Button>
              </CardHeader>
              <CardContent className="space-y-2">
                {salaryHistory.map((record) => (
                  <div
                    key={record._id}
                    className="flex items-center justify-between p-3 border rounded rtl:flex-row-reverse"
                  >
                    <div>
                      <div className="font-medium">{record.month}</div>
                      <div className="text-sm text-muted-foreground">
                        تاريخ الدفع: {new Date(record.date).toLocaleDateString('ar-EG')}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 rtl:flex-row-reverse rtl:space-x-reverse">
                      <span className="font-bold text-green-600">{record.amount} د.ل</span>
                      <Badge variant="default">{record.status}</Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeDetailsDialog;
