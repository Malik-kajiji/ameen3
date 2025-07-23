import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  UserPlus, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Dumbbell,
  CreditCard
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import useHomePage from '../hooks/useHomePage';

const DashboardHome = ({ onNavigate }) => {
  const {
    mainData,
    timeframeData,
    selectedTimeframe,
    changeTimeframe,
    loading,
    error
  } = useHomePage()
  const [selectedPeriod, setSelectedPeriod] = useState('هذا الشهر');

  const monthlyRevenue = [
    { month: 'يناير', revenue: 45000, members: 120 },
    { month: 'فبراير', revenue: 52000, members: 135 },
    { month: 'مارس', revenue: 48000, members: 128 },
    { month: 'أبريل', revenue: 61000, members: 155 },
    { month: 'مايو', revenue: 58000, members: 148 },
    { month: 'يونيو', revenue: 67000, members: 168 }
  ];

  const membershipTypes = [
    { name: 'شهري', value: 45, color: '#ef3953' },
    { name: 'ربع سنوي', value: 30, color: '#1c2530' },
    { name: 'نصف سنوي', value: 15, color: '#FA812F' },
    { name: 'سنوي', value: 10, color: '#FAB12F' }
  ];

  const weeklyAttendance = [
    { day: 'السبت', attendance: 85 },
    { day: 'الأحد', attendance: 92 },
    { day: 'الاثنين', attendance: 78 },
    { day: 'الثلاثاء', attendance: 88 },
    { day: 'الأربعاء', attendance: 95 },
    { day: 'الخميس', attendance: 82 },
    { day: 'الجمعة', attendance: 76 }
  ];

  const recentActivities = [
    { id: 1, type: 'عضو جديد', description: 'انضم أحمد علي إلى العضوية الشهرية', time: 'منذ 5 دقائق', icon: UserPlus, color: 'text-green-500' },
    { id: 2, type: 'دفعة', description: 'تم استلام دفعة 500 د.ل من سارة محمد', time: 'منذ 15 دقيقة', icon: DollarSign, color: 'text-blue-500' },
    { id: 3, type: 'تنبيه', description: 'عضوية عمر سالم تنتهي خلال 3 أيام', time: 'منذ 30 دقيقة', icon: AlertTriangle, color: 'text-orange-500' },
    { id: 4, type: 'صيانة', description: 'تم إكمال صيانة جهاز الجري رقم 5', time: 'منذ ساعة', icon: CheckCircle, color: 'text-green-500' }
  ];

  const quickStats = [
    {
      title: 'إجمالي الأعضاء',
      value: '168',
      change: '+12',
      changeType: 'increase',
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      title: 'الإيرادات الشهرية',
      value: '67,500 د.ل',
      change: '+8.5%',
      changeType: 'increase',
      icon: DollarSign,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      title: 'معدل الحضور',
      value: '85%',
      change: '+3.2%',
      changeType: 'increase',
      icon: Activity,
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      title: 'العضويات المنتهية',
      value: '8',
      change: '-2',
      changeType: 'decrease',
      icon: AlertTriangle,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10'
    }
  ];

  return (
    <div className="space-y-6 rtl">

      <div className="flex justify-between items-center">
        <div className="text-right">
          <h2 className="text-3xl font-bold tracking-tight">لوحة التحكم الرئيسية</h2>
          <p className="text-muted-foreground">نظرة عامة على أداء صالة فينيكس</p>
        </div>
        <div className="flex gap-2">
          {['هذا الأسبوع', 'هذا الشهر', 'هذا العام'].map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod(period)}
              className={selectedPeriod === period ? 'btn-gradient' : ''}
            >
              {period}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {quickStats.map((stat, index) => (
          <Card key={index} className="card-gradient hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="text-right">
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <h3 className="text-2xl font-bold">{stat.value}</h3>
                    <span className={`text-sm font-medium ${
                      stat.changeType === 'increase' ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">

        <Card className="card-gradient">
          <CardHeader>
            <CardTitle className="text-right">الإيرادات الشهرية</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#ef3953" 
                  strokeWidth={3}
                  dot={{ fill: '#ef3953', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="card-gradient">
          <CardHeader>
            <CardTitle className="text-right">توزيع أنواع العضوية</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={membershipTypes}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {membershipTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">

        <Card className="md:col-span-2 card-gradient">
          <CardHeader>
            <CardTitle className="text-right">معدل الحضور الأسبوعي</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weeklyAttendance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="attendance" fill="#ef3953" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="card-gradient">
          <CardHeader>
            <CardTitle className="text-right">الأنشطة الأخيرة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <div className={`p-2 rounded-full bg-background ${activity.color}`}>
                  <activity.icon className="w-4 h-4" />
                </div>
                <div className="flex-1 text-right">
                  <p className="text-sm font-medium">{activity.type}</p>
                  <p className="text-xs text-muted-foreground">{activity.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="card-gradient">
        <CardHeader>
          <CardTitle className="text-right">الإجراءات السريعة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button 
              className="h-20 flex flex-col gap-2 btn-gradient hover:opacity-90"
              onClick={() => onNavigate?.('add-member')}
            >
              <UserPlus className="w-6 h-6" />
              <span>إضافة عضو جديد</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col gap-2 hover:bg-accent"
              onClick={() => onNavigate?.('financial')}
            >
              <CreditCard className="w-6 h-6" />
              <span>إدارة المدفوعات</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col gap-2 hover:bg-accent"
              onClick={() => onNavigate?.('reports')}
            >
              <Target className="w-6 h-6" />
              <span>إنشاء تقرير</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col gap-2 hover:bg-accent"
              onClick={() => onNavigate?.('assets')}
            >
              <Dumbbell className="w-6 h-6" />
              <span>إدارة المعدات</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardHome;
