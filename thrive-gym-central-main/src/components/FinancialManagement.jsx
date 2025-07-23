import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Banknote,
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  Edit,
  Receipt
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import CreateInvoiceDialog from './CreateInvoiceDialog';
import { motion } from 'framer-motion';

const fade = { hidden: { opacity: 0, y: 36 }, show: { opacity: 1, y: 0, transition: { type: 'spring', duration: 0.5 } } };
const cardAnim = i => ({
  hidden: { opacity: 0, y: 26, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { delay: i * 0.09 + 0.15, type: 'spring', duration: 0.32 } }
});

const FinancialManagement = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateInvoice, setShowCreateInvoice] = useState(false);

  const monthlyData = [
    { month: 'يناير', income: 45000, expenses: 28000, profit: 17000 },
    { month: 'فبراير', income: 52000, expenses: 31000, profit: 21000 },
    { month: 'مارس', income: 48000, expenses: 29000, profit: 19000 },
    { month: 'أبريل', income: 61000, expenses: 35000, profit: 26000 },
    { month: 'مايو', income: 58000, expenses: 33000, profit: 25000 },
    { month: 'يونيو', income: 67000, expenses: 38000, profit: 29000 }
  ];

  const recentTransactions = [
    {
      id: 'TXN004',
      date: '2024-01-19',
      member: 'فاطمة أحمد',
      type: 'اشتراك سنوي',
      amount: 4500,
      method: 'تحويل',
      status: 'مدفوع'
    }
  ];

  const expenses = [

    {
      id: 'EXP004',
      date: '2024-01-05',
      category: 'إيجار',
      description: 'إيجار المبنى',
      amount: 15000,
      status: 'مدفوع'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'مدفوع':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'معلق':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'متأخر':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'نقدي':
        return <Banknote className="w-4 h-4" />;
      case 'بطاقة':
        return <CreditCard className="w-4 h-4" />;
      default:
        return <DollarSign className="w-4 h-4" />;
    }
  };

  const filteredTransactions = recentTransactions.filter((tran) =>
    tran.member.includes(searchTerm) ||
    tran.id.includes(searchTerm) ||
    tran.type.includes(searchTerm)
  );

  return (
    <motion.div className="space-y-6 rtl" variants={fade} initial="hidden" animate="show">
      <motion.div className="flex justify-between items-center" variants={fade}>
        <div className="text-right">
          <motion.h2 className="text-3xl font-bold tracking-tight" initial={{ x: 24, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>إدارة المالية</motion.h2>
          <motion.p className="text-muted-foreground" initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
            متابعة الإيرادات والمصروفات والتقارير المالية
          </motion.p>
        </div>
        <motion.div initial={{ scale: 0.93, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.18 }}>
          <Button
            className="btn-gradient"
            onClick={() => setShowCreateInvoice(true)}
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.96 }}
          >
            <Plus className="w-4 h-4 ml-2" />
            إنشاء فاتورة جديدة
          </Button>
        </motion.div>
      </motion.div>

      <motion.div className="grid gap-4 md:grid-cols-4">
        {[
          {
            label: 'إجمالي الإيرادات',
            value: '67,500 د.ل',
            trend: '+12.5% من الشهر الماضي',
            color: 'text-green-500',
            icon: TrendingUp,
            bg: 'bg-green-500/10',
            iconColor: 'text-green-500',
          },
          {
            label: 'إجمالي المصروفات',
            value: '38,200 د.ل',
            trend: '+8.3% من الشهر الماضي',
            color: 'text-red-500',
            icon: TrendingDown,
            bg: 'bg-red-500/10',
            iconColor: 'text-red-500',
          },
          {
            label: 'صافي الربح',
            value: '29,300 د.ل',
            trend: '+18.2% من الشهر الماضي',
            color: 'text-primary',
            icon: DollarSign,
            bg: 'bg-primary/10',
            iconColor: 'text-primary',
          },
          {
            label: 'المدفوعات المعلقة',
            value: '2,850 د.ل',
            trend: '5 فواتير معلقة',
            color: 'text-yellow-500',
            icon: Receipt,
            bg: 'bg-yellow-500/10',
            iconColor: 'text-yellow-500',
          },
        ].map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div key={i} variants={cardAnim(i)} initial="hidden" animate="show">
              <Card className="card-gradient shadow-lg hover:shadow-2xl transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="text-right">
                      <p className="text-sm font-medium text-muted-foreground">{card.label}</p>
                      <div className={`text-2xl font-bold ${card.color}`}>{card.value}</div>
                      <p className={`text-xs flex items-center gap-1 ${card.color}`}>
                        <Icon className="w-3 h-3" />
                        {card.trend}
                      </p>
                    </div>
                    <div className={`p-3 rounded-full ${card.bg}`}>
                      <Icon className={`w-6 h-6 ${card.iconColor}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="income">الإيرادات</TabsTrigger>
          <TabsTrigger value="expenses">المصروفات</TabsTrigger>
          <TabsTrigger value="reports">التقارير</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <motion.div className="grid gap-6 md:grid-cols-2">
            <motion.div variants={fade} initial="hidden" animate="show">
              <Card className="card-gradient">
                <CardHeader>
                  <CardTitle className="text-right">تطور الأرباح الشهرية</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="profit" stroke="#ef3953" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div variants={fade} initial="hidden" animate="show">
              <Card className="card-gradient">
                <CardHeader>
                  <CardTitle className="text-right">مقارنة الإيرادات والمصروفات</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="income" fill="#22c55e" name="الإيرادات" />
                      <Bar dataKey="expenses" fill="#ef4444" name="المصروفات" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>

        <TabsContent value="income" className="space-y-6">
          <motion.div variants={fade} initial="hidden" animate="show">
            <Card className="card-gradient">
              <CardHeader>
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <CardTitle>سجل الإيرادات</CardTitle>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                      <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="البحث في المعاملات..."
                        className="pr-10 text-right"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">رقم المعاملة</TableHead>
                      <TableHead className="text-right">التاريخ</TableHead>
                      <TableHead className="text-right">العضو</TableHead>
                      <TableHead className="text-right">النوع</TableHead>
                      <TableHead className="text-right">المبلغ</TableHead>
                      <TableHead className="text-right">طريقة الدفع</TableHead>
                      <TableHead className="text-right">الحالة</TableHead>
                      <TableHead className="text-right">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((transaction, i) => (
                      <motion.tr key={transaction.id} variants={cardAnim(i)} initial="hidden" animate="show">
                        <TableCell className="font-medium text-right">{transaction.id}</TableCell>
                        <TableCell className="text-right">{transaction.date}</TableCell>
                        <TableCell className="text-right">{transaction.member}</TableCell>
                        <TableCell className="text-right">{transaction.type}</TableCell>
                        <TableCell className="text-right font-bold text-green-600">
                          {transaction.amount} د.ل
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center gap-2 justify-end">
                            {getPaymentMethodIcon(transaction.method)}
                            {transaction.method}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className={getStatusColor(transaction.status)}>
                            {transaction.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-6">
          <motion.div variants={fade} initial="hidden" animate="show">
            <Card className="card-gradient">
              <CardHeader>
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <CardTitle>سجل المصروفات</CardTitle>
                  <div className="flex gap-2">
                    <Button className="btn-gradient">
                      <Plus className="w-4 h-4 ml-2" />
                      إضافة مصروف
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">رقم المصروف</TableHead>
                      <TableHead className="text-right">التاريخ</TableHead>
                      <TableHead className="text-right">الفئة</TableHead>
                      <TableHead className="text-right">الوصف</TableHead>
                      <TableHead className="text-right">المبلغ</TableHead>
                      <TableHead className="text-right">الحالة</TableHead>
                      <TableHead className="text-right">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expenses.map((expense, i) => (
                      <motion.tr key={expense.id} variants={cardAnim(i)} initial="hidden" animate="show">
                        <TableCell className="font-medium text-right">{expense.id}</TableCell>
                        <TableCell className="text-right">{expense.date}</TableCell>
                        <TableCell className="text-right">{expense.category}</TableCell>
                        <TableCell className="text-right">{expense.description}</TableCell>
                        <TableCell className="text-right font-bold text-red-600">
                          {expense.amount} د.ل
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className={getStatusColor(expense.status)}>
                            {expense.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <motion.div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: TrendingUp,
                color: 'text-primary',
                title: 'التقرير المالي الشهري',
                desc: 'تقرير شامل عن الأداء المالي للشهر'
              },
              {
                icon: DollarSign,
                color: 'text-green-500',
                title: 'تقرير الإيرادات',
                desc: 'تفصيل الإيرادات حسب المصدر والنوع'
              },
              {
                icon: Receipt,
                color: 'text-blue-500',
                title: 'تقرير المصروفات',
                desc: 'تحليل المصروفات حسب الفئة والتاريخ'
              }
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div key={i} variants={cardAnim(i)} initial="hidden" animate="show">
                  <Card className="card-gradient hover-lift cursor-pointer transition-all duration-200">
                    <CardContent className="p-6 text-center">
                      <Icon className={`w-12 h-12 ${item.color} mx-auto mb-4`} />
                      <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{item.desc}</p>
                      <Button variant="outline" className="w-full">عرض التقرير</Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </TabsContent>
      </Tabs>

      <CreateInvoiceDialog
        isOpen={showCreateInvoice}
        onClose={() => setShowCreateInvoice(false)}
        onSave={(invoice) => {
          console.log('إنشاء فاتورة جديدة:', invoice);
          setShowCreateInvoice(false);
        }}
      />
    </motion.div>
  );
};

export default FinancialManagement;
