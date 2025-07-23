import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

const CreateInvoiceDialog = ({ isOpen, onClose, onSave }) => {
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [dueDate, setDueDate] = useState();
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState([
    { id: '1', description: '', quantity: 1, price: 0, total: 0 }
  ]);

  const addItem = () => {
    const newItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      price: 0,
      total: 0
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id, field, value) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'price') {
          updatedItem.total = updatedItem.quantity * updatedItem.price;
        }
        return updatedItem;
      }
      return item;
    }));
  };

  const totalAmount = items.reduce((sum, item) => sum + item.total, 0);

  const handleSave = () => {
    const invoice = {
      customerName,
      customerEmail,
      customerPhone,
      dueDate,
      notes,
      items,
      totalAmount,
      createdAt: new Date(),
      status: 'مرسلة'
    };
    onSave(invoice);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rtl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-right">إنشاء فاتورة جديدة</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-right">بيانات العميل</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName" className="text-right">اسم العميل</Label>
                  <Input
                    id="customerName"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="text-right"
                    placeholder="أدخل اسم العميل"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerEmail" className="text-right">البريد الإلكتروني</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="text-right"
                    placeholder="أدخل البريد الإلكتروني"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerPhone" className="text-right">رقم الهاتف</Label>
                  <Input
                    id="customerPhone"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="text-right"
                    placeholder="أدخل رقم الهاتف"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-right">تاريخ الاستحقاق</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-right"
                      >
                        <CalendarIcon className="ml-2 h-4 w-4" />
                        {dueDate ? format(dueDate, 'PPP', { locale: ar }) : 'اختر تاريخ الاستحقاق'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dueDate}
                        onSelect={setDueDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-right">بنود الفاتورة</CardTitle>
                <Button onClick={addItem} variant="outline" size="sm">
                  <Plus className="w-4 h-4 ml-2" />
                  إضافة بند
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={item.id} className="grid grid-cols-12 gap-2 items-end">
                    <div className="col-span-4">
                      <Label className="text-right">الوصف</Label>
                      <Input
                        value={item.description}
                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                        className="text-right"
                        placeholder="وصف البند"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label className="text-right">الكمية</Label>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                        className="text-right"
                        min="1"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label className="text-right">السعر</Label>
                      <Input
                        type="number"
                        value={item.price}
                        onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                        className="text-right"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label className="text-right">الإجمالي</Label>
                      <div className="p-2 border rounded text-right bg-muted">
                        {item.total.toFixed(2)} د.ل
                      </div>
                    </div>
                    <div className="col-span-2">
                      {items.length > 1 && (
                        <Button
                          onClick={() => removeItem(item.id)}
                          variant="destructive"
                          size="sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-right">المجموع الكلي:</span>
                  <span className="text-2xl font-bold text-primary">{totalAmount.toFixed(2)} د.ل</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-right">ملاحظات</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="text-right"
                placeholder="ملاحظات إضافية..."
                rows={3}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button onClick={onClose} variant="outline">
              إلغاء
            </Button>
            <Button onClick={handleSave} className="btn-gradient">
              إنشاء الفاتورة
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateInvoiceDialog;
