
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, Save, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const AddEmployeeDialog = ({ isOpen, onClose, onSave }) => {
  const [employeeData, setEmployeeData] = useState({
    name: '',
    role: '',
    phone: '',
    email: '',
    salary: '',
    status: 'نشط',
    joinDate: new Date(),
    address: '',
    emergencyContact: '',
    notes: ''
  });

  const handleSave = () => {
    const newEmployee = {
      id: `EMP${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      ...employeeData,
      joinDate: format(employeeData.joinDate, 'yyyy-MM-dd')
    };
    onSave(newEmployee);
    onClose();
    setEmployeeData({
      name: '',
      role: '',
      phone: '',
      email: '',
      salary: '',
      status: 'نشط',
      joinDate: new Date(),
      address: '',
      emergencyContact: '',
      notes: ''
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rtl">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-xl font-bold text-right">إضافة موظف جديد</DialogTitle>
            <Button onClick={onClose} variant="ghost" size="sm">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-right">الاسم الكامل</Label>
              <Input
                id="name"
                value={employeeData.name}
                onChange={(e) => setEmployeeData({ ...employeeData, name: e.target.value })}
                className="text-right"
                placeholder="الاسم الكامل"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role" className="text-right">المنصب</Label>
              <Select
                value={employeeData.role}
                onValueChange={(value) => setEmployeeData({ ...employeeData, role: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر المنصب" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="مدرب">مدرب</SelectItem>
                  <SelectItem value="موظف استقبال">موظف استقبال</SelectItem>
                  <SelectItem value="مدير">مدير</SelectItem>
                  <SelectItem value="محاسب">محاسب</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-right">رقم الهاتف</Label>
              <Input
                id="phone"
                value={employeeData.phone}
                onChange={(e) => setEmployeeData({ ...employeeData, phone: e.target.value })}
                className="text-right"
                placeholder="+218 XX XXX XXXX"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-right">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                value={employeeData.email}
                onChange={(e) => setEmployeeData({ ...employeeData, email: e.target.value })}
                className="text-right"
                placeholder="@gmail.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="salary" className="text-right">الراتب</Label>
              <Input
                id="salary"
                value={employeeData.salary}
                onChange={(e) => setEmployeeData({ ...employeeData, salary: e.target.value })}
                className="text-right"
                placeholder="مثل: 100 د.ل"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-right">تاريخ التوظيف</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-right font-normal",
                      !employeeData.joinDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="ml-2 h-4 w-4" />
                    {employeeData.joinDate
                      ? format(employeeData.joinDate, "yyyy-MM-dd")
                      : "اختر التاريخ"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={employeeData.joinDate}
                    onSelect={(date) => setEmployeeData({ ...employeeData, joinDate: date || new Date() })}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="text-right">الحالة</Label>
              <Select
                value={employeeData.status}
                onValueChange={(value) => setEmployeeData({ ...employeeData, status: value })}
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyContact" className="text-right">جهة الاتصال الطارئة</Label>
              <Input
                id="emergencyContact"
                value={employeeData.emergencyContact}
                onChange={(e) => setEmployeeData({ ...employeeData, emergencyContact: e.target.value })}
                className="text-right"
                placeholder="+218 XX XXX XXXX"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="text-right">العنوان</Label>
            <Textarea
              id="address"
              value={employeeData.address}
              onChange={(e) => setEmployeeData({ ...employeeData, address: e.target.value })}
              className="text-right"
              rows={2}
              placeholder="العنوان الكامل..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-right">ملاحظات</Label>
            <Textarea
              id="notes"
              value={employeeData.notes}
              onChange={(e) => setEmployeeData({ ...employeeData, notes: e.target.value })}
              className="text-right"
              rows={3}
              placeholder="ملاحظات إضافية..."
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button onClick={onClose} variant="outline">
              إلغاء
            </Button>
            <Button onClick={handleSave} className="btn-gradient">
              <Save className="w-4 h-4 ml-2" />
              حفظ الموظف
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddEmployeeDialog;
