import { useState } from 'react';
import {
  Card, CardContent, CardHeader, CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Tabs, TabsContent, TabsList, TabsTrigger,
} from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

import {
  Building,
  Users,
  Bell,
  Shield,
  Database,
  Globe,
  Mail,
  Phone,
  MapPin,
  Clock,
  DollarSign,
  Save,
  Download,
  Upload,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Settings = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('general');

  const [generalSettings, setGeneralSettings] = useState({
    gymName: 'صالة فينيكس للياقة البدنية',
    gymNameEn: 'Phoenix Fitness Gym',
    description: 'أفضل صالة رياضية في ليبيا مع أحدث المعدات وأفضل الكوادر.',
    phone: '+218 91 234 5678',
    email: 'info@phoenixgym.ly',
    address: 'طرابلس – حي الأندلس – شارع الجمهورية',
    website: 'www.phoenixgym.ly',
    workingHours: { start: '06:00', end: '23:00' },
    currency: 'LYD',
    timezone: 'Africa/Tripoli',
  });


  const [membershipSettings, setMembershipSettings] = useState({
    autoRenewal: true,
    gracePeriod: 7,
    lateFee: 50,
    discounts: { student: 15, family: 20, annual: 10 },
    memberIdPrefix: 'GM',
    defaultPlan: 'شهري',
  });


  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    expiryReminder: 3,
    paymentReminder: 1,
    maintenanceAlerts: true,
    newMemberWelcome: true,
  });


  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordPolicy: 'متوسط',
    backupFrequency: 'يومي',
    auditLog: true,
  });


  const [systemSettings, setSystemSettings] = useState({
    language: 'ar',
    theme: 'auto',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    autoBackup: true,
    debugMode: false,
  });

  const handleSaveSettings = (category) => {
    toast({
      title: 'تم الحفظ',
      description: `تم حفظ إعدادات ${category} بنجاح.`,
    });
  };

  const handleExportSettings = () => {
    toast({
      title: 'تم تصدير الإعدادات',
      description: 'تم حفظ نسخة من جميع الإعدادات.',
    });
  };

  const handleImportSettings = () => {
    toast({
      title: 'تم الاستيراد',
      description: 'تم استيراد جميع الإعدادات بنجاح.',
    });
  };

  return (

    <div className="space-y-6" dir="rtl">

      <div className="flex flex-row-reverse justify-between items-center">
        <div className="text-right">
          <h2 className="text-3xl font-bold tracking-tight">إعدادات النظام</h2>
          <p className="text-muted-foreground">تحكم كامل في إعدادات وإدارة صالة فينيكس</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportSettings} className="flex-row-reverse">
            <Download className="w-4 h-4 ms-2" />
            تصدير الإعدادات
          </Button>
          <Button variant="outline" onClick={handleImportSettings} className="flex-row-reverse">
            <Upload className="w-4 h-4 ms-2" />
            استيراد الإعدادات
          </Button>
        </div>
      </div>


      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general" className="flex flex-row-reverse items-center gap-2">
            <Building className="w-4 h-4" />
            بيانات الصالة
          </TabsTrigger>
          <TabsTrigger value="membership" className="flex flex-row-reverse items-center gap-2">
            <Users className="w-4 h-4" />
            العضوية
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex flex-row-reverse items-center gap-2">
            <Bell className="w-4 h-4" />
            الإشعارات
          </TabsTrigger>
          <TabsTrigger value="security" className="flex flex-row-reverse items-center gap-2">
            <Shield className="w-4 h-4" />
            الأمان
          </TabsTrigger>
          <TabsTrigger value="system" className="flex flex-row-reverse items-center gap-2">
            <Database className="w-4 h-4" />
            النظام
          </TabsTrigger>
        </TabsList>

 
        <TabsContent value="general" className="space-y-6">
          <Card className="card-gradient">
            <CardHeader>
              <CardTitle className="flex flex-row-reverse items-center gap-2">
                <Building className="w-5 h-5" />
                بيانات الصالة
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="gymName">اسم الصالة (عربي)</Label>
                  <Input
                    id="gymName"
                    value={generalSettings.gymName}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, gymName: e.target.value })}
                    className="text-right"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gymNameEn">اسم الصالة (إنجليزي)</Label>
                  <Input
                    id="gymNameEn"
                    value={generalSettings.gymNameEn}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, gymNameEn: e.target.value })}
                    className="text-left"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">وصف الصالة</Label>
                <Textarea
                  id="description"
                  rows={3}
                  value={generalSettings.description}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, description: e.target.value })}
                  className="text-right"
                />
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">
                    <Phone className="w-4 h-4 inline" /> رقم الهاتف
                  </Label>
                  <Input
                    id="phone"
                    value={generalSettings.phone}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, phone: e.target.value })}
                    className="text-right"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">
                    <Mail className="w-4 h-4 inline" /> البريد الإلكتروني
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={generalSettings.email}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, email: e.target.value })}
                    className="text-left"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">
                  <MapPin className="w-4 h-4 inline" /> العنوان
                </Label>
                <Input
                  id="address"
                  value={generalSettings.address}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, address: e.target.value })}
                  className="text-right"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="website">
                    <Globe className="w-4 h-4 inline" /> الموقع الإلكتروني
                  </Label>
                  <Input
                    id="website"
                    value={generalSettings.website}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, website: e.target.value })}
                    className="text-left"
                    dir="ltr"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">
                    <DollarSign className="w-4 h-4 inline" /> العملة
                  </Label>
                  <Select
                    value={generalSettings.currency}
                    onValueChange={(value) => setGeneralSettings({ ...generalSettings, currency: value })}
                  >
                    <SelectTrigger dir="rtl"><SelectValue /></SelectTrigger>
                    <SelectContent dir="rtl">
                      <SelectItem value="LYD">دينار ليبي</SelectItem>
                      <SelectItem value="USD">دولار أمريكي</SelectItem>
                      <SelectItem value="EUR">يورو</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">
                    <Clock className="w-4 h-4 inline" /> المنطقة الزمنية
                  </Label>
                  <Select
                    value={generalSettings.timezone}
                    onValueChange={(value) => setGeneralSettings({ ...generalSettings, timezone: value })}
                  >
                    <SelectTrigger dir="rtl"><SelectValue /></SelectTrigger>
                    <SelectContent dir="rtl">
                      <SelectItem value="Africa/Tripoli">طرابلس</SelectItem>
                      <SelectItem value="Africa/Cairo">القاهرة</SelectItem>
                      <SelectItem value="Europe/London">لندن</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <Label className="text-lg font-semibold">ساعات العمل</Label>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="startTime">من الساعة</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={generalSettings.workingHours.start}
                      onChange={(e) => setGeneralSettings({
                        ...generalSettings,
                        workingHours: { ...generalSettings.workingHours, start: e.target.value },
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endTime">إلى الساعة</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={generalSettings.workingHours.end}
                      onChange={(e) => setGeneralSettings({
                        ...generalSettings,
                        workingHours: { ...generalSettings.workingHours, end: e.target.value },
                      })}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSaveSettings('بيانات الصالة')} className="btn-gradient flex-row-reverse">
                  <Save className="w-4 h-4 ms-2" />
                  حفظ البيانات
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="membership" className="space-y-6">
          <Card className="card-gradient">
            <CardHeader>
              <CardTitle className="flex flex-row-reverse items-center gap-2">
                <Users className="w-5 h-5" />
                إعدادات العضوية
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between flex-row-reverse">
                <div className="text-right">
                  <Label>التجديد التلقائي للعضوية</Label>
                  <p className="text-xs text-muted-foreground">سيتم تجديد العضوية تلقائيًا عند الانتهاء.</p>
                </div>
                <Switch
                  checked={membershipSettings.autoRenewal}
                  onCheckedChange={(checked) => setMembershipSettings({ ...membershipSettings, autoRenewal: checked })}
                />
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="gracePeriod">فترة السماح (بالأيام)</Label>
                  <Input
                    id="gracePeriod"
                    type="number"
                    value={membershipSettings.gracePeriod}
                    onChange={(e) => setMembershipSettings({
                      ...membershipSettings,
                      gracePeriod: parseInt(e.target.value, 10),
                    })}
                    className="text-right"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lateFee">رسوم التأخير (د.ل)</Label>
                  <Input
                    id="lateFee"
                    type="number"
                    value={membershipSettings.lateFee}
                    onChange={(e) => setMembershipSettings({
                      ...membershipSettings,
                      lateFee: parseInt(e.target.value, 10),
                    })}
                    className="text-right"
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <Label className="text-lg font-semibold">الخصومات (%)</Label>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="studentDiscount">خصم الطلاب</Label>
                    <Input
                      id="studentDiscount"
                      type="number"
                      value={membershipSettings.discounts.student}
                      onChange={(e) => setMembershipSettings({
                        ...membershipSettings,
                        discounts: {
                          ...membershipSettings.discounts,
                          student: parseInt(e.target.value, 10),
                        },
                      })}
                      className="text-right"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="familyDiscount">خصم العائلة</Label>
                    <Input
                      id="familyDiscount"
                      type="number"
                      value={membershipSettings.discounts.family}
                      onChange={(e) => setMembershipSettings({
                        ...membershipSettings,
                        discounts: {
                          ...membershipSettings.discounts,
                          family: parseInt(e.target.value, 10),
                        },
                      })}
                      className="text-right"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="annualDiscount">خصم الاشتراك السنوي</Label>
                    <Input
                      id="annualDiscount"
                      type="number"
                      value={membershipSettings.discounts.annual}
                      onChange={(e) => setMembershipSettings({
                        ...membershipSettings,
                        discounts: {
                          ...membershipSettings.discounts,
                          annual: parseInt(e.target.value, 10),
                        },
                      })}
                      className="text-right"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="memberIdPrefix">بادئة رقم العضو</Label>
                  <Input
                    id="memberIdPrefix"
                    value={membershipSettings.memberIdPrefix}
                    onChange={(e) => setMembershipSettings({
                      ...membershipSettings,
                      memberIdPrefix: e.target.value,
                    })}
                    className="text-right"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="defaultPlan">الخطة الافتراضية</Label>
                  <Select
                    value={membershipSettings.defaultPlan}
                    onValueChange={(value) => setMembershipSettings({
                      ...membershipSettings,
                      defaultPlan: value,
                    })}
                  >
                    <SelectTrigger dir="rtl"><SelectValue /></SelectTrigger>
                    <SelectContent dir="rtl">
                      <SelectItem value="شهري">شهري</SelectItem>
                      <SelectItem value="ربع سنوي">ربع سنوي</SelectItem>
                      <SelectItem value="نصف سنوي">نصف سنوي</SelectItem>
                      <SelectItem value="سنوي">سنوي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSaveSettings('العضوية')} className="btn-gradient flex-row-reverse">
                  <Save className="w-4 h-4 ms-2" />
                  حفظ الإعدادات
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="card-gradient">
            <CardHeader>
              <CardTitle className="flex flex-row-reverse items-center gap-2">
                <Bell className="w-5 h-5" />
                إعدادات الإشعارات
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between flex-row-reverse">
                <div className="text-right">
                  <Label>إشعارات البريد الإلكتروني</Label>
                  <p className="text-xs text-muted-foreground">إرسال تنبيهات عبر البريد للأعضاء.</p>
                </div>
                <Switch
                  checked={notificationSettings.emailNotifications}
                  onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, emailNotifications: checked })}
                />
              </div>

              <div className="flex items-center justify-between flex-row-reverse">
                <div className="text-right">
                  <Label>إشعارات SMS</Label>
                  <p className="text-xs text-muted-foreground">إرسال رسائل نصية للتنبيهات المهمة.</p>
                </div>
                <Switch
                  checked={notificationSettings.smsNotifications}
                  onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, smsNotifications: checked })}
                />
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="expiryReminder">تنبيه انتهاء العضوية (بالأيام)</Label>
                  <Input
                    id="expiryReminder"
                    type="number"
                    value={notificationSettings.expiryReminder}
                    onChange={(e) => setNotificationSettings({ ...notificationSettings, expiryReminder: parseInt(e.target.value, 10) })}
                    className="text-right"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paymentReminder">تذكير الدفع (بالأيام)</Label>
                  <Input
                    id="paymentReminder"
                    type="number"
                    value={notificationSettings.paymentReminder}
                    onChange={(e) => setNotificationSettings({ ...notificationSettings, paymentReminder: parseInt(e.target.value, 10) })}
                    className="text-right"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between flex-row-reverse">
                <Label>تنبيهات الصيانة</Label>
                <Switch
                  checked={notificationSettings.maintenanceAlerts}
                  onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, maintenanceAlerts: checked })}
                />
              </div>
              <div className="flex items-center justify-between flex-row-reverse">
                <Label>رسالة ترحيبية للعضو الجديد</Label>
                <Switch
                  checked={notificationSettings.newMemberWelcome}
                  onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, newMemberWelcome: checked })}
                />
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSaveSettings('الإشعارات')} className="btn-gradient flex-row-reverse">
                  <Save className="w-4 h-4 ms-2" />
                  حفظ الإعدادات
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="card-gradient">
            <CardHeader>
              <CardTitle className="flex flex-row-reverse items-center gap-2">
                <Shield className="w-5 h-5" />
                إعدادات الأمان
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between flex-row-reverse">
                <Label>تفعيل التحقق بخطوتين (2FA)</Label>
                <Switch
                  checked={securitySettings.twoFactorAuth}
                  onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, twoFactorAuth: checked })}
                />
              </div>

              <div className="flex items-center justify-between flex-row-reverse">
                <Label>مدة الجلسة (دقائق)</Label>
                <Input
                  type="number"
                  value={securitySettings.sessionTimeout}
                  onChange={(e) => setSecuritySettings({ ...securitySettings, sessionTimeout: parseInt(e.target.value, 10) })}
                  className="w-24 text-right"
                />
              </div>

              <div className="flex items-center justify-between flex-row-reverse">
                <Label>سياسة كلمة المرور</Label>
                <Select
                  value={securitySettings.passwordPolicy}
                  onValueChange={(value) => setSecuritySettings({ ...securitySettings, passwordPolicy: value })}
                >
                  <SelectTrigger dir="rtl"><SelectValue /></SelectTrigger>
                  <SelectContent dir="rtl">
                    <SelectItem value="بسيط">بسيط</SelectItem>
                    <SelectItem value="متوسط">متوسط</SelectItem>
                    <SelectItem value="معقد">معقد</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between flex-row-reverse">
                <Label>تكرار النسخ الاحتياطي</Label>
                <Select
                  value={securitySettings.backupFrequency}
                  onValueChange={(value) => setSecuritySettings({ ...securitySettings, backupFrequency: value })}
                >
                  <SelectTrigger dir="rtl"><SelectValue /></SelectTrigger>
                  <SelectContent dir="rtl">
                    <SelectItem value="يومي">يومي</SelectItem>
                    <SelectItem value="أسبوعي">أسبوعي</SelectItem>
                    <SelectItem value="شهري">شهري</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between flex-row-reverse">
                <Label>تفعيل سجل النشاطات</Label>
                <Switch
                  checked={securitySettings.auditLog}
                  onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, auditLog: checked })}
                />
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSaveSettings('الأمان')} className="btn-gradient flex-row-reverse">
                  <Save className="w-4 h-4 ms-2" />
                  حفظ الإعدادات
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card className="card-gradient">
            <CardHeader>
              <CardTitle className="flex flex-row-reverse items-center gap-2">
                <Database className="w-5 h-5" />
                إعدادات النظام
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between flex-row-reverse">
                <Label>لغة النظام</Label>
                <Select
                  value={systemSettings.language}
                  onValueChange={(value) => setSystemSettings({ ...systemSettings, language: value })}
                >
                  <SelectTrigger dir="rtl"><SelectValue /></SelectTrigger>
                  <SelectContent dir="rtl">
                    <SelectItem value="ar">العربية</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between flex-row-reverse">
                <Label>سمة الواجهة</Label>
                <Select
                  value={systemSettings.theme}
                  onValueChange={(value) => setSystemSettings({ ...systemSettings, theme: value })}
                >
                  <SelectTrigger dir="rtl"><SelectValue /></SelectTrigger>
                  <SelectContent dir="rtl">
                    <SelectItem value="auto">تلقائي</SelectItem>
                    <SelectItem value="light">فاتح</SelectItem>
                    <SelectItem value="dark">داكن</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between flex-row-reverse">
                <Label>تنسيق التاريخ</Label>
                <Select
                  value={systemSettings.dateFormat}
                  onValueChange={(value) => setSystemSettings({ ...systemSettings, dateFormat: value })}
                >
                  <SelectTrigger dir="rtl"><SelectValue /></SelectTrigger>
                  <SelectContent dir="rtl">
                    <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between flex-row-reverse">
                <Label>تنسيق الوقت</Label>
                <Select
                  value={systemSettings.timeFormat}
                  onValueChange={(value) => setSystemSettings({ ...systemSettings, timeFormat: value })}
                >
                  <SelectTrigger dir="rtl"><SelectValue /></SelectTrigger>
                  <SelectContent dir="rtl">
                    <SelectItem value="24h">24 ساعة</SelectItem>
                    <SelectItem value="12h">12 ساعة</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between flex-row-reverse">
                <Label>تفعيل النسخ الاحتياطي التلقائي</Label>
                <Switch
                  checked={systemSettings.autoBackup}
                  onCheckedChange={(checked) => setSystemSettings({ ...systemSettings, autoBackup: checked })}
                />
              </div>

              <div className="flex items-center justify-between flex-row-reverse">
                <Label>تفعيل وضع التطوير (Debug Mode)</Label>
                <Switch
                  checked={systemSettings.debugMode}
                  onCheckedChange={(checked) => setSystemSettings({ ...systemSettings, debugMode: checked })}
                />
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSaveSettings('النظام')} className="btn-gradient flex-row-reverse">
                  <Save className="w-4 h-4 ms-2" />
                  حفظ الإعدادات
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
