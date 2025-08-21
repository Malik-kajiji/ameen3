import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Wrench, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import useAssets from '@/hooks/useAssets';

const AssetMaintenanceDialog = ({ asset, isOpen, onClose, onSave }) => {
  const [maintenanceType, setMaintenanceType] = useState('');
  const [scheduledDate, setScheduledDate] = useState();
  const [technician, setTechnician] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('متوسط');
  const [estimatedCost, setEstimatedCost] = useState('');
  const [notes, setNotes] = useState('');

  // Use the assets hook
  const { getMaintenanceLogs, addMaintenanceLog } = useAssets();

  const [maintenanceHistory, setMaintenanceHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  if (!asset) return null;

  // Fetch maintenance history when asset changes
  useEffect(() => {
    const fetchMaintenanceHistory = async () => {
      if (asset && asset.id) {
        try {
          setLoading(true);
          const history = await getMaintenanceLogs(asset.id);
          setMaintenanceHistory(history);
        } catch (err) {
          console.error('Error fetching maintenance history:', err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchMaintenanceHistory();
  }, [asset, getMaintenanceLogs]);

  const handleSave = async () => {
    try {
      const maintenanceData = {
        maintenanceType,
        description,
        maintenanceDate: scheduledDate || new Date(),
        cost: parseFloat(estimatedCost.replace(/[^\d.-]/g, '')) || 0
      };
      
      await addMaintenanceLog(asset.id, maintenanceData);
      onSave(maintenanceData);
      onClose();
    } catch (err) {
      console.error('Error adding maintenance log:', err);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rtl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-right">
            جدولة صيانة: {asset.name}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
          <Card>
            <CardHeader>
              <CardTitle className="text-right">معلومات الأصل</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between"><span className="text-right">الاس: {asset.name}</span></div>
              <div className="flex justify-between"><span className="text-right">الفئة: {asset.category}</span></div>
              <div className="flex justify-between items-center">
                <span className="text-right">الحالة:</span>
                <Badge className={asset.status === 'ممتاز' ? 'bg-green-500' : asset.status === 'جيد' ? 'bg-blue-500' : 'bg-yellow-500'}>{asset.status}</Badge>
              </div>
              <div className="flex justify-between"><span className="text-right">آخر صيانة: {asset.lastMaintenance}</span></div>
              <div className="flex justify-between"><span className="text-right">الصيانة التالية: {asset.nextMaintenance}</span></div>
            </CardContent>
          </Card>

        
          <Card>
            <CardHeader>
              <CardTitle className="text-right">جدولة صيانة جديدة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-right">نوع الصيانة</Label>
                <Select value={maintenanceType} onValueChange={setMaintenanceType}>
                  <SelectTrigger><SelectValue placeholder="اختر نوع الصيانة" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="صيانة دورية">صيانة دورية</SelectItem>
                    <SelectItem value="إصلاح عطل">إصلاح عطل</SelectItem>
                    <SelectItem value="استبدال قطع">استبدال قطع</SelectItem>
                    <SelectItem value="فحص شامل">فحص شامل</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-right">التاريخ المجدول</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-right">
                      <CalendarIcon className="ml-2 h-4 w-4" />
                      {scheduledDate ? format(scheduledDate, 'PPP', { locale: ar }) : 'اختر التاريخ'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={scheduledDate} onSelect={setScheduledDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label className="text-right">الفني المسؤول</Label>
                <Select value={technician} onValueChange={setTechnician}>
                  <SelectTrigger><SelectValue placeholder="اختر الفني" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="أحمد التقني">أحمد التقني</SelectItem>
                    <SelectItem value="محمد الفني">محمد الفني</SelectItem>
                    <SelectItem value="سارة المهندسة">سارة المهندسة</SelectItem>
                    <SelectItem value="فني خارجي">فني خارجي</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-right">الأولوية</Label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="عالي">عالي</SelectItem>
                    <SelectItem value="متوسط">متوسط</SelectItem>
                    <SelectItem value="منخفض">منخفض</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-right">التكلفة المتوقعة</Label>
                <Input value={estimatedCost} onChange={(e) => setEstimatedCost(e.target.value)} className="text-right" placeholder="0.00 د.ل" />
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-right">تفاصيل الصيانة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-right">وصف العمل المطلوب</Label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} className="text-right" rows={3} placeholder="وصف تفصيلي للصيانة المطلوبة..." />
              </div>
              <div className="space-y-2">
                <Label className="text-right">ملاحظات إضافية</Label>
                <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="text-right" rows={2} placeholder="أي ملاحظات أو تعليمات خاصة..." />
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-right">تاريخ الصيانة</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="space-y-3">
                  {maintenanceHistory.map((m, index) => (
                    <div key={index} className="flex justify-between items-center p-3 border rounded">
                      <div className="text-right flex-1">
                        <div className="font-medium">{m.maintenanceType}</div>
                        <div className="text-sm text-muted-foreground">{m.maintenanceDate}</div>
                        <div className="text-sm text-muted-foreground">{m.description}</div>
                      </div>
                      <div className="text-left">
                        <div className="font-bold text-green-600">{m.cost} د.ل</div>
                        <Badge variant="default"><CheckCircle className="w-3 h-3 ml-1" />مكتملة</Badge>
                      </div>
                    </div>
                  ))}
                  {maintenanceHistory.length === 0 && (
                    <div className="text-center text-muted-foreground py-4">
                      لا توجد سجلات صيانة سابقة
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-2">
          <Button onClick={onClose} variant="outline">إلغاء</Button>
          <Button onClick={handleSave} className="btn-gradient"><Wrench className="w-4 h-4 ml-2" />جدولة الصيانة</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssetMaintenanceDialog;
