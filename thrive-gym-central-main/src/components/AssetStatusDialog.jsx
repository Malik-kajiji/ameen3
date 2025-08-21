import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings } from 'lucide-react';

const AssetStatusDialog = ({ asset, isOpen, onClose, onSave }) => {
  const [status, setStatus] = useState(asset?.status || 'جيد');

  if (!asset) return null;

  const handleSave = async () => {
    try {
      await onSave({
        status
      });
      onClose();
    } catch (err) {
      console.error('Error updating asset status:', err);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md rtl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-right">
            تحديث حالة الأصل: {asset.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-right block">الحالة الحالية</label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="اختر الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ممتاز">ممتاز</SelectItem>
                <SelectItem value="جيد">جيد</SelectItem>
                <SelectItem value="يحتاج صيانة">يحتاج صيانة</SelectItem>
                <SelectItem value="تالف">تالف</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button onClick={onClose} variant="outline">إلغاء</Button>
          <Button onClick={handleSave} className="btn-gradient">
            <Settings className="w-4 h-4 ml-2" />
            حفظ التغييرات
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssetStatusDialog;