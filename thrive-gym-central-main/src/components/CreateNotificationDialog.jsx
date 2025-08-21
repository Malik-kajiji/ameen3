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
import useNotifications from '@/hooks/useNotifications';
import { useToast } from '@/hooks/use-toast';

const CreateNotificationDialog = ({ isOpen, onClose, onSave }) => {
  const { verifyPhoneNumber } = useNotifications();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    recipient: '',
    recipientPhone: '',
    type: 'يدوي',
    scheduledDate: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // If it's not a scheduled notification, verify the phone number
      if (formData.type !== 'مجدول') {
        const verificationResult = await verifyPhoneNumber(formData.recipientPhone);
        formData.recipient = verificationResult.username;
      }

      // Add scheduled date if type is مجدول
      const notificationData = {
        ...formData,
        scheduledDate: formData.type === 'مجدول' ? new Date(formData.scheduledDate).toISOString() : null
      };

      await onSave(notificationData);
      onClose();
      setFormData({
        title: '',
        message: '',
        recipient: '',
        recipientPhone: '',
        type: 'يدوي',
        scheduledDate: ''
      });
    } catch (error) {
      toast({
        title: 'خطأ',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneBlur = async () => {
    if (formData.recipientPhone && formData.type !== 'مجدول') {
      try {
        const result = await verifyPhoneNumber(formData.recipientPhone);
        setFormData(prev => ({
          ...prev,
          recipient: result.username
        }));
        toast({
          title: 'تم العثور على المستخدم',
          description: `سيتم إرسال الإشعار إلى ${result.username}`
        });
      } catch (error) {
        toast({
          title: 'خطأ',
          description: error.message,
          variant: 'destructive'
        });
        setFormData(prev => ({
          ...prev,
          recipientPhone: '',
          recipient: ''
        }));
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>إنشاء إشعار جديد</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">عنوان الإشعار</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="text-right"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">نص الإشعار</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
              className="text-right"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">نوع الإشعار</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="يدوي">يدوي</SelectItem>
                <SelectItem value="مجدول">مجدول</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.type === 'مجدول' ? (
            <div className="space-y-2">
              <Label htmlFor="scheduledDate">موعد الإرسال</Label>
              <Input
                id="scheduledDate"
                type="datetime-local"
                value={formData.scheduledDate}
                onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                required
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="phone">رقم الهاتف</Label>
              <Input
                id="phone"
                value={formData.recipientPhone}
                onChange={(e) => setFormData({ ...formData, recipientPhone: e.target.value })}
                onBlur={handlePhoneBlur}
                placeholder="+218 91 234 5678"
                required
                className="text-right"
              />
              {formData.recipient && (
                <p className="text-sm text-muted-foreground">
                  سيتم إرسال الإشعار إلى: {formData.recipient}
                </p>
              )}
            </div>
          )}

          <div className="flex justify-end space-x-2 space-x-reverse">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              إلغاء
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'جاري الإنشاء...' : 'إنشاء'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNotificationDialog;
