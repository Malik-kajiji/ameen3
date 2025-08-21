import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { User, CreditCard, Edit, Phone } from 'lucide-react';

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
                      <span className="font-medium">غير محدد</span>
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
                      <span className="font-medium">{member.city || 'غير محدد'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">جهة اتصال الطوارئ:</span>
                      <span className="font-medium">غير محدد</span>
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
                      <span className="font-medium">{member.packageName || 'لا توجد خطة'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">تاريخ الانضمام:</span>
                      <span className="font-medium">
                        {member.createdAt ? new Date(member.createdAt).toLocaleDateString('ar-LY') : 'غير محدد'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">تاريخ الانتهاء:</span>
                      <span className="font-medium">
                        {member.subscriptionEndDate ? new Date(member.subscriptionEndDate).toLocaleDateString('ar-LY') : 'غير محدد'}
                      </span>
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
                    {member.subscriptions && member.subscriptions.length > 0 ? (
                      member.subscriptions.map((sub) => (
                        <div key={sub.id} className="border rounded-lg p-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-right">
                            <div>
                              <span className="text-sm text-muted-foreground">الخطة</span>
                              <p className="font-medium">{sub.packageName}</p>
                            </div>
                            <div>
                              <span className="text-sm text-muted-foreground">المدة</span>
                              <p className="font-medium">
                                {sub.startDate ? new Date(sub.startDate).toLocaleDateString('ar-LY') : 'غير محدد'} - 
                                {sub.endDate ? new Date(sub.endDate).toLocaleDateString('ar-LY') : 'غير محدد'}
                              </p>
                            </div>
                            <div>
                              <span className="text-sm text-muted-foreground">المبلغ</span>
                              <p className="font-medium">{sub.packagePrice || 'غير محدد'} د.ل</p>
                            </div>
                            <div>
                              <span className="text-sm text-muted-foreground">الحالة</span>
                              <Badge className={sub.status === 'active' ? 'bg-green-100 text-green-800' : 
                                              sub.status === 'paused' ? 'bg-yellow-100 text-yellow-800' : 
                                              'bg-red-100 text-red-800'}>
                                {sub.status === 'active' ? 'نشط' : sub.status === 'paused' ? 'متوقف' : 'منتهي'}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground">لا توجد اشتراكات سابقة</p>
                    )}
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
                  <div className="text-center text-muted-foreground">
                    <p>لا توجد بيانات إيقاف متاحة</p>
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
                  <div className="text-center text-muted-foreground">
                    <p>لا توجد بيانات نشاط متاحة</p>
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
