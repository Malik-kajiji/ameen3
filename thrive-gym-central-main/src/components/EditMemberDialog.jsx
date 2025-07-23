import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';


const memberSchema = z.object({
  name: z.string().min(2, 'الاسم يجب أن يكون على الأقل حرفين'),
  phone: z.string().min(10, 'رقم الهاتف غير صحيح'),
  email: z.string().email('البريد الإلكتروني غير صحيح').optional().or(z.literal('')),
  address: z.string().optional(),
  emergencyContact: z.string().optional(),
  age: z.number().min(16, 'العمر يجب أن يكون 16 سنة على الأقل').max(100, 'العمر غير صحيح').optional(),
  gender: z.string().optional(),
  status: z.enum(['نشط', 'متوقف', 'منتهي']),
  plan: z.string().min(1, 'يجب اختيار خطة الاشتراك'),
});

const EditMemberDialog = ({ member, isOpen, onClose, onSave }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      address: '',
      emergencyContact: '',
      age: undefined,
      gender: '',
      status: 'نشط',
      plan: '',
    },
  });

  useEffect(() => {
    if (member) {
      form.reset({
        name: member.name,
        phone: member.phone,
        email: member.email || '',
        address: member.address || '',
        emergencyContact: member.emergencyContact || '',
        age: member.age,
        gender: member.gender || '',
        status: member.status,
        plan: member.plan,
      });
    }
  }, [member, form]);

  const onSubmit = async (data) => {
    if (!member) return;

    setIsLoading(true);
    try {
      const updatedMember = {
        ...member,
        name: data.name,
        phone: data.phone,
        email: data.email,
        address: data.address,
        emergencyContact: data.emergencyContact,
        age: data.age,
        gender: data.gender,
        status: data.status,
        plan: data.plan,
      };

      onSave(updatedMember);
      toast({
        title: "تم التحديث بنجاح",
        description: "تم تحديث بيانات العضو بنجاح",
      });
      onClose();
    } catch (error) {
      toast({
        title: "خطأ في التحديث",
        description: "حدث خطأ أثناء تحديث البيانات",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  if (!member) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rtl">
        <DialogHeader>
          <DialogTitle className="text-right text-xl">تعديل بيانات العضو</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-right">الاسم الكامل *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="أدخل الاسم الكامل" className="text-right" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-right">رقم الهاتف *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="+218 91 234 5678" className="text-right" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-right">البريد الإلكتروني</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" placeholder="example@email.com" className="text-right" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-right">العمر</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number" 
                        placeholder="25" 
                        className="text-right"
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-right">الجنس</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="text-right">
                          <SelectValue placeholder="اختر الجنس" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ذكر">ذكر</SelectItem>
                        <SelectItem value="أنثى">أنثى</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-right">حالة العضوية *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="text-right">
                          <SelectValue placeholder="اختر الحالة" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="نشط">نشط</SelectItem>
                        <SelectItem value="متوقف">متوقف</SelectItem>
                        <SelectItem value="منتهي">منتهي</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="plan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-right">خطة الاشتراك *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="text-right">
                          <SelectValue placeholder="اختر الخطة" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="شهري">شهري</SelectItem>
                        <SelectItem value="3 أشهر">3 أشهر</SelectItem>
                        <SelectItem value="6 أشهر">6 أشهر</SelectItem>
                        <SelectItem value="سنوي">سنوي</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="emergencyContact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-right">جهة اتصال الطوارئ</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="+218 92 345 6789" className="text-right" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-right">العنوان</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="أدخل العنوان الكامل" className="text-right" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={handleClose}>
                إلغاء
              </Button>
              <Button type="submit" disabled={isLoading} className="btn-gradient">
                {isLoading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditMemberDialog;
