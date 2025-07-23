import { useState } from 'react';
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


const EmployeeDetailsDialog = ({ employee, isOpen, onClose, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedEmployee, setEditedEmployee] = useState(employee);

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

  const attendanceHistory = [
    { date: '2024‑01‑15', status: 'حضر', hours: '8 ساعات' },
    { date: '2024‑01‑14', status: 'حضر', hours: '8 ساعات' },
    { date: '2024‑01‑13', status: 'غائب', hours: '0 ساعات' },
    { date: '2024‑01‑12', status: 'حضر', hours: '7 ساعات' },
  ];

  const salaryHistory = [
    { month: 'يناير 2024', amount: '800 د.ل', status: 'مدفوع', date: '2024‑01‑31' },
    { month: 'ديسمبر 2023', amount: '800 د.ل', status: 'مدفوع', date: '2023‑12‑31' },
    { month: 'نوفمبر 2023', amount: '750 د.ل', status: 'مدفوع', date: '2023‑11‑30' },
  ];

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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="info">المعلومات الأساسية</TabsTrigger>
            <TabsTrigger value="attendance">سجل الحضور</TabsTrigger>
            <TabsTrigger value="salary">تاريخ الرواتب</TabsTrigger>
            <TabsTrigger value="performance">التقييم</TabsTrigger>
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
              <CardHeader>
                <CardTitle>سجل الحضور</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {attendanceHistory.map((record, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 border rounded rtl:flex-row-reverse"
                  >
                    <div>
                      <div className="font-medium">{record.date}</div>
                      <div className="text-sm text-muted-foreground">{record.hours}</div>
                    </div>
                    <Badge variant={record.status === 'حضر' ? 'default' : 'destructive'}>
                      {record.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="salary" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>تاريخ الرواتب</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {salaryHistory.map((record, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 border rounded rtl:flex-row-reverse"
                  >
                    <div>
                      <div className="font-medium">{record.month}</div>
                      <div className="text-sm text-muted-foreground">
                        تاريخ الدفع: {record.date}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 rtl:flex-row-reverse rtl:space-x-reverse">
                      <span className="font-bold text-green-600">{record.amount}</span>
                      <Badge variant="default">{record.status}</Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>تقييم الأداء</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>التقييم العام</Label>
                    <div className="flex items-center justify-end gap-2 rtl:flex-row-reverse rtl:space-x-reverse mt-1">
                      <span className="text-2xl font-bold text-green-600">4.5</span>
                      <span className="text-sm text-muted-foreground">من 5</span>
                    </div>
                  </div>
                  <div>
                    <Label>عدد التقييمات</Label>
                    <div className="text-2xl font-bold text-primary mt-1">12</div>
                  </div>
                </div>

                {[
                  { label: 'الالتزام', value: 4, color: 'bg-green-500' },
                  { label: 'جودة العمل', value: 5, color: 'bg-green-500' },
                  { label: 'التعاون', value: 3, color: 'bg-yellow-500' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span>{item.label}</span>
                    <div className="flex items-center gap-2 rtl:flex-row-reverse rtl:space-x-reverse">
                      <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-2 ${item.color} rounded-full`}
                          style={{ width: `${(item.value / 5) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm">{item.value}/5</span>
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
