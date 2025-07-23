import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { User, CreditCard, Edit, Phone } from 'lucide-react';

const subscriptionHistory = [
  { id: 1, plan: 'شهري', startDate: '2024-01-15', endDate: '2024-02-15', amount: '150 د.ل', status: 'مكتمل' },
  { id: 2, plan: 'شهري', startDate: '2023-12-15', endDate: '2024-01-15', amount: '150 د.ل', status: 'مكتمل' },
  { id: 3, plan: '3 أشهر', startDate: '2023-09-15', endDate: '2023-12-15', amount: '400 د.ل', status: 'مكتمل' },
];

const pauseHistory = [
  { id: 1, reason: 'سفر للخارج', startDate: '2023-11-01', endDate: '2023-11-30', duration: '30 يوم', status: 'مكتمل' },
  { id: 2, reason: 'أسباب طبية', startDate: '2023-08-15', endDate: '2023-09-01', duration: '17 يوم', status: 'مكتمل' },
];

const getStatusColor = (status) => {
  switch (status) {
    case 'نشط': return 'bg-green-100 text-green-800';
    case 'متوقف': return 'bg-yellow-100 text-yellow-800';
    case 'منتهي': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const MemberDetailsDialog = ({ member, isOpen, onClose, onEdit }) => {
  if (!member) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rtl">
        <DialogHeader>
          <DialogTitle className="text-right text-2xl">تفاصيل العضو</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">

          <Card className="card-gradient">
            <CardContent className="p-6">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="text-right flex-1 min-w-[180px]">
                  <h2 className="text-2xl font-bold">{member.name}</h2>
                  <p className="text-muted-foreground">رقم العضو: {member.id}</p>
                  <Badge className={`mt-2 ${getStatusColor(member.status)}`}>
                    {member.status}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => onEdit(member)} className="btn-gradient">
                    <Edit className="w-4 h-4 ml-2" />
                    تعديل البيانات
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="info">المعلومات الأساسية</TabsTrigger>
              <TabsTrigger value="subscription">تاريخ الاشتراكات</TabsTrigger>
              <TabsTrigger value="pause">تاريخ الإيقاف</TabsTrigger>
              <TabsTrigger value="activity">النشاط الأخير</TabsTrigger>
            </TabsList>

            <TabsContent value="info">
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="card-gradient">
                  <CardHeader>
                    <CardTitle className="text-right flex items-center">
                      <User className="w-5 h-5 ml-2" />
                      المعلومات الشخصية
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">الاسم الكامل:</span>
                      <span className="font-medium">{member.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">العمر:</span>
                      <span className="font-medium">{member.age || 'غير محدد'} سنة</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">الجنس:</span>
                      <span className="font-medium">{member.gender || 'غير محدد'}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="card-gradient">
                  <CardHeader>
                    <CardTitle className="text-right flex items-center">
                      <Phone className="w-5 h-5 ml-2" />
                      معلومات الاتصال
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">رقم الهاتف:</span>
                      <span className="font-medium">{member.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">البريد الإلكتروني:</span>
                      <span className="font-medium">{member.email || 'غير محدد'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">العنوان:</span>
                      <span className="font-medium">{member.address || 'غير محدد'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">جهة اتصال الطوارئ:</span>
                      <span className="font-medium">{member.emergencyContact || 'غير محدد'}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="card-gradient md:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-right flex items-center">
                      <CreditCard className="w-5 h-5 ml-2" />
                      معلومات الاشتراك
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">الخطة الحالية:</span>
                      <span className="font-medium">{member.plan}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">تاريخ الانضمام:</span>
                      <span className="font-medium">{member.joinDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">تاريخ الانتهاء:</span>
                      <span className="font-medium">{member.expiryDate}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="subscription">
              <Card className="card-gradient">
                <CardHeader>
                  <CardTitle className="text-right">تاريخ الاشتراكات</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {subscriptionHistory.map((sub) => (
                      <div key={sub.id} className="border rounded-lg p-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-right">
                          <div>
                            <span className="text-sm text-muted-foreground">الخطة</span>
                            <p className="font-medium">{sub.plan}</p>
                          </div>
                          <div>
                            <span className="text-sm text-muted-foreground">المدة</span>
                            <p className="font-medium">{sub.startDate} - {sub.endDate}</p>
                          </div>
                          <div>
                            <span className="text-sm text-muted-foreground">المبلغ</span>
                            <p className="font-medium">{sub.amount}</p>
                          </div>
                          <div>
                            <span className="text-sm text-muted-foreground">الحالة</span>
                            <Badge className="bg-green-100 text-green-800">{sub.status}</Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pause">
              <Card className="card-gradient">
                <CardHeader>
                  <CardTitle className="text-right">تاريخ الإيقاف</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pauseHistory.map((pause) => (
                      <div key={pause.id} className="border rounded-lg p-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-right">
                          <div>
                            <span className="text-sm text-muted-foreground">السبب</span>
                            <p className="font-medium">{pause.reason}</p>
                          </div>
                          <div>
                            <span className="text-sm text-muted-foreground">من - إلى</span>
                            <p className="font-medium">{pause.startDate} - {pause.endDate}</p>
                          </div>
                          <div>
                            <span className="text-sm text-muted-foreground">المدة</span>
                            <p className="font-medium">{pause.duration}</p>
                          </div>
                          <div>
                            <span className="text-sm text-muted-foreground">الحالة</span>
                            <Badge className="bg-green-100 text-green-800">{pause.status}</Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity">
              <Card className="card-gradient">
                <CardHeader>
                  <CardTitle className="text-right">النشاط الأخير</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 space-x-reverse">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="text-right">
                        <p className="font-medium">دخول إلى الصالة</p>
                        <p className="text-sm text-muted-foreground">اليوم - 10:30 صباحاً</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 space-x-reverse">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="text-right">
                        <p className="font-medium">تجديد الاشتراك</p>
                        <p className="text-sm text-muted-foreground">أمس - 2:15 مساءً</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 space-x-reverse">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <div className="text-right">
                        <p className="font-medium">تحديث المعلومات الشخصية</p>
                        <p className="text-sm text-muted-foreground">منذ 3 أيام - 4:45 مساءً</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MemberDetailsDialog;
