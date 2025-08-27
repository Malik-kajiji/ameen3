import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

const AddExpenseDialog = ({ isOpen, onClose, onSave }) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [status, setStatus] = useState('pending');
  const [paymentMethod, setPaymentMethod] = useState('cash');

  const handleSave = () => {
    const expense = {
      amount: parseFloat(amount),
      category,
      description,
      date,
      status,
      paymentMethod
    };
    onSave(expense);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rtl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-right">إضافة مصروف جديد</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-right">المبلغ</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-right"
                placeholder="أدخل المبلغ"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-right">الفئة</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الفئة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rent">إيجار</SelectItem>
                  <SelectItem value="utilities">مرافق</SelectItem>
                  <SelectItem value="salaries">رواتب</SelectItem>
                  <SelectItem value="maintenance">صيانة</SelectItem>
                  <SelectItem value="other">أخرى</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-right">الحالة</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paid">مدفوع</SelectItem>
                  <SelectItem value="pending">معلق</SelectItem>
                  <SelectItem value="overdue">متأخر</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-right">طريقة الدفع</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر طريقة الدفع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">نقدي</SelectItem>
                  <SelectItem value="card">بطاقة</SelectItem>
                  <SelectItem value="bank_transfer">تحويل بنكي</SelectItem>
                  <SelectItem value="other">أخرى</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-right">التاريخ</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-right"
                  >
                    <CalendarIcon className="ml-2 h-4 w-4" />
                    {date ? format(date, 'PPP', { locale: ar }) : 'اختر التاريخ'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-right">الوصف</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="text-right"
              placeholder="وصف المصروف"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button onClick={onClose} variant="outline">
              إلغاء
            </Button>
            <Button onClick={handleSave} className="btn-gradient">
              حفظ
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddExpenseDialog;