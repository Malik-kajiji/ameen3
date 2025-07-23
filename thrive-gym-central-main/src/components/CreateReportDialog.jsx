import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import { CalendarIcon, Save, X, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

const CreateReportDialog = ({ isOpen, onClose, onSave }) => {
  const [reportData, setReportData] = useState({
    title: '',
    type: '',
    description: '',
    dateRange: {
      from: undefined,
      to: undefined
    },
    filters: [],
    includeCharts: true,
    includeDetails: true,
    format: 'PDF',
    schedule: {
      enabled: false,
      frequency: 'monthly',
      dayOfMonth: 1,
      dayOfWeek: 'monday',
      time: '09:00'
    }
  });

  const reportTypes = [
    { value: 'membership', label: 'تقرير العضوية' },
    { value: 'financial', label: 'التقرير المالي' },
    { value: 'equipment', label: 'استخدام المعدات' },
    { value: 'employee', label: 'أداء الموظفين' },
    { value: 'attendance', label: 'تقرير الحضور' },
    { value: 'revenue', label: 'تقرير الإيرادات' },
    { value: 'custom', label: 'تقرير مخصص' }
  ];

  const availableFilters = [
    'الأعضاء النشطون',
    'الأعضاء المعلقون',
    'العضوية الذهبية',
    'العضوية الفضية',
    'الدفع النقدي',
    'الدفع بالبطاقة',
    'المدربون',
    'موظفو الاستقبال'
  ];

  const handleSave = () => {
    const newReport = {
      id: `RPT-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      ...reportData,
      createdDate: new Date().toISOString(),
      status: 'مجدول',
      lastGenerated: null
    };
    onSave(newReport);
    onClose();

    setReportData({
      title: '',
      type: '',
      description: '',
      dateRange: { from: undefined, to: undefined },
      filters: [],
      includeCharts: true,
      includeDetails: true,
      format: 'PDF',
      schedule: {
        enabled: false,
        frequency: 'monthly',
        dayOfMonth: 1,
        dayOfWeek: 'monday',
        time: '09:00'
      }
    });
  };

  const toggleFilter = (filter) => {
    setReportData(prev => ({
      ...prev,
      filters: prev.filters.includes(filter)
        ? prev.filters.filter(f => f !== filter)
        : [...prev.filters, filter]
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rtl">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-xl font-bold text-right">إنشاء تقرير جديد</DialogTitle>
            <Button onClick={onClose} variant="ghost" size="sm">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-right">المعلومات الأساسية</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-right">عنوان التقرير</Label>
                <Input
                  id="title"
                  value={reportData.title}
                  onChange={(e) => setReportData({...reportData, title: e.target.value})}
                  className="text-right"
                  placeholder="مثل: تقرير العضوية الشهري"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type" className="text-right">نوع التقرير</Label>
                <Select
                  value={reportData.type}
                  onValueChange={(value) => setReportData({...reportData, type: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر نوع التقرير" />
                  </SelectTrigger>
                  <SelectContent>
                    {reportTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-right">الوصف</Label>
              <Textarea
                id="description"
                value={reportData.description}
                onChange={(e) => setReportData({...reportData, description: e.target.value})}
                className="text-right"
                rows={3}
                placeholder="وصف مختصر للتقرير..."
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-right">فترة التقرير</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-right">من تاريخ</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-right font-normal",
                        !reportData.dateRange.from && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="ml-2 h-4 w-4" />
                      {reportData.dateRange.from ? format(reportData.dateRange.from, "yyyy-MM-dd") : "اختر التاريخ"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={reportData.dateRange.from}
                      onSelect={(date) => setReportData({
                        ...reportData,
                        dateRange: { ...reportData.dateRange, from: date }
                      })}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label className="text-right">إلى تاريخ</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-right font-normal",
                        !reportData.dateRange.to && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="ml-2 h-4 w-4" />
                      {reportData.dateRange.to ? format(reportData.dateRange.to, "yyyy-MM-dd") : "اختر التاريخ"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={reportData.dateRange.to}
                      onSelect={(date) => setReportData({
                        ...reportData,
                        dateRange: { ...reportData.dateRange, to: date }
                      })}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-right">المرشحات</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {availableFilters.map(filter => (
                <div key={filter} className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox
                    id={filter}
                    checked={reportData.filters.includes(filter)}
                    onCheckedChange={() => toggleFilter(filter)}
                  />
                  <Label htmlFor={filter} className="text-sm cursor-pointer">
                    {filter}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-right">خيارات التقرير</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox
                    id="includeCharts"
                    checked={reportData.includeCharts}
                    onCheckedChange={(checked) => setReportData({
                      ...reportData,
                      includeCharts: !!checked
                    })}
                  />
                  <Label htmlFor="includeCharts">تضمين الرسوم البيانية</Label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox
                    id="includeDetails"
                    checked={reportData.includeDetails}
                    onCheckedChange={(checked) => setReportData({
                      ...reportData,
                      includeDetails: !!checked
                    })}
                  />
                  <Label htmlFor="includeDetails">تضمين التفاصيل</Label>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="format" className="text-right">تنسيق التقرير</Label>
                <Select
                  value={reportData.format}
                  onValueChange={(value) => setReportData({...reportData, format: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PDF">PDF</SelectItem>
                    <SelectItem value="Excel">Excel</SelectItem>
                    <SelectItem value="Word">Word</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2 space-x-reverse">
              <Checkbox
                id="scheduleEnabled"
                checked={reportData.schedule.enabled}
                onCheckedChange={(checked) => setReportData({
                  ...reportData,
                  schedule: { ...reportData.schedule, enabled: !!checked }
                })}
              />
              <Label htmlFor="scheduleEnabled" className="text-lg font-semibold">
                جدولة التقرير
              </Label>
            </div>
            {reportData.schedule.enabled && (
              <div className="space-y-4 p-4 border rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-right">التكرار</Label>
                    <Select
                      value={reportData.schedule.frequency}
                      onValueChange={(value) => setReportData({
                        ...reportData,
                        schedule: { ...reportData.schedule, frequency: value }
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">يومي</SelectItem>
                        <SelectItem value="weekly">أسبوعي</SelectItem>
                        <SelectItem value="monthly">شهري</SelectItem>
                        <SelectItem value="yearly">سنوي</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {reportData.schedule.frequency === 'monthly' && (
                    <div className="space-y-2">
                      <Label className="text-right">يوم من الشهر</Label>
                      <Input
                        type="number"
                        min="1"
                        max="31"
                        value={reportData.schedule.dayOfMonth}
                        onChange={(e) => setReportData({
                          ...reportData,
                          schedule: { ...reportData.schedule, dayOfMonth: parseInt(e.target.value) }
                        })}
                        className="text-right"
                      />
                    </div>
                  )}
                  {reportData.schedule.frequency === 'weekly' && (
                    <div className="space-y-2">
                      <Label className="text-right">يوم الأسبوع</Label>
                      <Select
                        value={reportData.schedule.dayOfWeek}
                        onValueChange={(value) => setReportData({
                          ...reportData,
                          schedule: { ...reportData.schedule, dayOfWeek: value }
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monday">الاثنين</SelectItem>
                          <SelectItem value="tuesday">الثلاثاء</SelectItem>
                          <SelectItem value="wednesday">الأربعاء</SelectItem>
                          <SelectItem value="thursday">الخميس</SelectItem>
                          <SelectItem value="friday">الجمعة</SelectItem>
                          <SelectItem value="saturday">السبت</SelectItem>
                          <SelectItem value="sunday">الأحد</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label className="text-right">الوقت</Label>
                    <Input
                      type="time"
                      value={reportData.schedule.time}
                      onChange={(e) => setReportData({
                        ...reportData,
                        schedule: { ...reportData.schedule, time: e.target.value }
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
              <Save className="w-4 h-4 ml-2" />
              {reportData.schedule.enabled ? 'حفظ وجدولة' : 'إنشاء التقرير'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateReportDialog;
