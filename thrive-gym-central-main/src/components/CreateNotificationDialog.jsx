import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Save, X, Send, Clock } from 'lucide-react';

const CreateNotificationDialog = ({ isOpen, onClose, onSave }) => {
  const [notificationData, setNotificationData] = useState({
    title: '',
    message: '',
    type: 'manual',
    recipients: 'all',
    sendNow: true,
    scheduledDate: '',
    scheduledTime: '',
    priority: 'normal'
  });

  const recipientOptions = [
    { value: 'all', label: 'جميع الأعضاء' },
    { value: 'active', label: 'الأعضاء النشطون' },
    { value: 'expired', label: 'الأعضاء المنتهية صلاحيتهم' },
    { value: 'staff', label: 'الموظفون' },
    { value: 'trainers', label: 'المدربون' },
    { value: 'custom', label: 'مجموعة مخصصة' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'منخفضة', color: 'text-blue-600' },
    { value: 'normal', label: 'عادية', color: 'text-green-600' },
    { value: 'high', label: 'عالية', color: 'text-orange-600' },
    { value: 'urgent', label: 'عاجلة', color: 'text-red-600' }
  ];

  const handleSave = () => {
    const newNotification = {
      id: `NOT-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      ...notificationData,
      createdDate: new Date().toISOString(),
      status: notificationData.sendNow ? 'مُرسل' : 'مجدول',
      recipient: recipientOptions.find(r => r.value === notificationData.recipients)?.label || 'غير محدد'
    };
    onSave(newNotification);
    onClose();
    setNotificationData({
      title: '',
      message: '',
      type: 'manual',
      recipients: 'all',
      sendNow: true,
      scheduledDate: '',
      scheduledTime: '',
      priority: 'normal'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl rtl">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-xl font-bold text-right">إنشاء إشعار جديد</DialogTitle>
            <Button onClick={onClose} variant="ghost" size="sm">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-right">عنوان الإشعار</Label>
              <Input
                id="title"
                value={notificationData.title}
                onChange={(e) => setNotificationData({ ...notificationData, title: e.target.value })}
                className="text-right"
                placeholder="مثل: تذكير انتهاء العضوية"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-right">محتوى الرسالة</Label>
              <Textarea
                id="message"
                value={notificationData.message}
                onChange={(e) => setNotificationData({ ...notificationData, message: e.target.value })}
                className="text-right"
                rows={4}
                placeholder="اكتب محتوى الإشعار هنا..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="recipients" className="text-right">المستقبلون</Label>
              <Select
                value={notificationData.recipients}
                onValueChange={(value) => setNotificationData({ ...notificationData, recipients: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر المستقبلين" />
                </SelectTrigger>
                <SelectContent>
                  {recipientOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority" className="text-right">الأولوية</Label>
              <Select
                value={notificationData.priority}
                onValueChange={(value) => setNotificationData({ ...notificationData, priority: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priorityOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      <span className={option.color}>{option.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2 space-x-reverse">
              <Checkbox
                id="sendNow"
                checked={notificationData.sendNow}
                onCheckedChange={(checked) => setNotificationData({
                  ...notificationData,
                  sendNow: checked
                })}
              />
              <Label htmlFor="sendNow" className="flex items-center gap-2">
                <Send className="w-4 h-4" />
                إرسال فوري
              </Label>
            </div>

            {!notificationData.sendNow && (
              <div className="space-y-4 p-4 border rounded-lg bg-muted/20">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">جدولة الإرسال</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="scheduledDate" className="text-right">التاريخ</Label>
                    <Input
                      id="scheduledDate"
                      type="date"
                      value={notificationData.scheduledDate}
                      onChange={(e) => setNotificationData({
                        ...notificationData,
                        scheduledDate: e.target.value
                      })}
                      className="text-right"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="scheduledTime" className="text-right">الوقت</Label>
                    <Input
                      id="scheduledTime"
                      type="time"
                      value={notificationData.scheduledTime}
                      onChange={(e) => setNotificationData({
                        ...notificationData,
                        scheduledTime: e.target.value
                      })}
                      className="text-right"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2 justify-end pt-4 border-t">
            <Button onClick={onClose} variant="outline">
              إلغاء
            </Button>
            <Button onClick={handleSave} className="btn-gradient">
              {notificationData.sendNow ? (
                <>
                  <Send className="w-4 h-4 ml-2" />
                  إرسال الآن
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 ml-2" />
                  جدولة الإرسال
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNotificationDialog;
