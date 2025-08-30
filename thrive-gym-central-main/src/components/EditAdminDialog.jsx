import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save } from 'lucide-react';

const EditAdminDialog = ({ isOpen, onClose, onSave, admin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    status: ''
  });

  useEffect(() => {
    if (admin) {
      setFormData({
        name: admin.name || '',
        email: admin.email || '',
        role: admin.role || '',
        status: admin.status || ''
      });
    }
  }, [admin]);

  const handleSave = () => {
    onSave({ ...formData, _id: admin._id });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md rtl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-right">تعديل بيانات المشرف</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-right">الاسم</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="text-right"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-right">البريد الإلكتروني</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="text-right"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-right">الدور</Label>
            <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
              <SelectTrigger>
                <SelectValue placeholder="اختر الدور" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="مدير عام">مدير عام</SelectItem>
                <SelectItem value="مدير">مدير</SelectItem>
                <SelectItem value="دعم فني">دعم فني</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-right">الحالة</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue placeholder="اختر الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="نشط">نشط</SelectItem>
                <SelectItem value="غير نشط">غير نشط</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 justify-end">
            <Button onClick={onClose} variant="outline">
              إلغاء
            </Button>
            <Button onClick={handleSave} className="btn-gradient">
              <Save className="w-4 h-4 ml-2" />
              حفظ التغييرات
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditAdminDialog;