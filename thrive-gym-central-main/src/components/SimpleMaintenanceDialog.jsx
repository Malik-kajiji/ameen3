import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Wrench } from 'lucide-react';

const SimpleMaintenanceDialog = ({ asset, isOpen, onClose, onSave }) => {
  const [cost, setCost] = useState('');

  if (!asset) return null;

  const handleSave = async () => {
    try {
      await onSave({
        cost: parseFloat(cost.replace(/[^\d.-]/g, '')) || 0,
        maintenanceDate: new Date().toISOString()
      });
      onClose();
    } catch (err) {
      console.error('Error saving maintenance:', err);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md rtl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-right">
            تسجيل تكلفة الصيانة: {asset.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-right">تكلفة الصيانة</Label>
            <Input 
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              className="text-right"
              placeholder="0.00 د.ل"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button onClick={onClose} variant="outline">إلغاء</Button>
          <Button onClick={handleSave} className="btn-gradient">
            <Wrench className="w-4 h-4 ml-2" />
            حفظ
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SimpleMaintenanceDialog;