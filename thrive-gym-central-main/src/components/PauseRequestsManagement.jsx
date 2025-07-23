import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Filter, Check, X, Clock, PauseCircle, AlertTriangle, CheckSquare, XSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

const PauseRequestDetailsDialog = ({ open, onClose, request, getStatusColor }) => {
  if (!open || !request) return null;
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-background rounded-xl max-w-lg w-full p-6 shadow-xl border border-border text-right"
          initial={{ scale: 0.88, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.96, opacity: 0, y: 20 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">تفاصيل طلب الإيقاف</h3>
            <Button variant="ghost" onClick={onClose}>إغلاق</Button>
          </div>
          <div className="space-y-3">
            <div><b>رقم الطلب:</b> {request.id}</div>
            <div><b>اسم العضو:</b> {request.member} <span className="text-sm text-muted-foreground">({request.memberId})</span></div>
            <div><b>السبب:</b> {request.reason}</div>
            <div><b>تاريخ الطلب:</b> {request.requestDate}</div>
            <div><b>تاريخ بدء الإيقاف:</b> {request.startDate}</div>
            <div><b>تاريخ نهاية الإيقاف:</b> {request.endDate}</div>
            <div><b>المدة:</b> {request.duration}</div>
            <div><b>الحالة:</b> <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>{request.status}</span></div>
            <div><b>الأيام المتبقية:</b> {request.remainingDays} يوم</div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const PauseRequestsManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRequests, setSelectedRequests] = useState([]);

  const [showDetails, setShowDetails] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(null);

  const [pauseRequests, setPauseRequests] = useState([
    {
      id: 'PR-001',
      member: 'أحمد علي حسن',
      memberId: 'GM001',
      reason: 'سفر للخارج للعمل',
      requestDate: '2024-01-10',
      startDate: '2024-01-15',
      endDate: '2024-02-15',
      duration: '30 يوم',
      status: 'معلق',
      remainingDays: '245'
    },
    {
      id: 'PR-004',
      member: 'فاطمة حسن علي',
      memberId: 'GM004',
      reason: 'حمل',
      requestDate: '2024-01-14',
      startDate: '2024-01-20',
      endDate: '2024-04-20',
      duration: '90 يوم',
      status: 'معلق',
      remainingDays: '276'
    },
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'موافق':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'معلق':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'مرفوض':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const filteredRequests = pauseRequests.filter(request => {
    const matchesSearch =
      request.member.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingRequests = filteredRequests.filter(r => r.status === 'معلق');

  const handleSelectRequest = (requestId) => {
    setSelectedRequests(prev =>
      prev.includes(requestId)
        ? prev.filter(id => id !== requestId)
        : [...prev, requestId]
    );
  };

  const handleSelectAll = () => {
    if (selectedRequests.length === pendingRequests.length) {
      setSelectedRequests([]);
    } else {
      setSelectedRequests(pendingRequests.map(r => r.id));
    }
  };

  const handleBulkApprove = () => {
    const approvedRequests = selectedRequests.length;
    setPauseRequests(prev =>
      prev.map(request =>
        selectedRequests.includes(request.id)
          ? { ...request, status: 'موافق' }
          : request
      )
    );
    setSelectedRequests([]);
    toast({
      title: "تم الموافقة بنجاح",
      description: `تم الموافقة على ${approvedRequests} طلب إيقاف`,
    });
  };

  const handleBulkReject = () => {
    const rejectedRequests = selectedRequests.length;
    setPauseRequests(prev =>
      prev.map(request =>
        selectedRequests.includes(request.id)
          ? { ...request, status: 'مرفوض' }
          : request
      )
    );
    setSelectedRequests([]);
    toast({
      title: "تم الرفض بنجاح",
      description: `تم رفض ${rejectedRequests} طلب إيقاف`,
    });
  };

  const handleApprove = (id) => {
    setPauseRequests(prev =>
      prev.map(request =>
        request.id === id ? { ...request, status: 'موافق' } : request
      )
    );
    toast({
      title: "تم الموافقة",
      description: "تم الموافقة على طلب الإيقاف",
    });
  };

  const handleReject = (id) => {
    setPauseRequests(prev =>
      prev.map(request =>
        request.id === id ? { ...request, status: 'مرفوض' } : request
      )
    );
    toast({
      title: "تم الرفض",
      description: "تم رفض طلب الإيقاف",
    });
  };

  const fade = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.33, type: 'spring' } },
  };
  const cardFade = i => ({
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { delay: i * 0.09 + 0.07, duration: 0.27, type: 'spring' } },
  });

  return (
    <motion.div className="space-y-6 rtl" variants={fade} initial="hidden" animate="show">
      <motion.div variants={fade}>
        <div className="flex justify-between items-center">
          <div className="text-right">
            <h2 className="text-3xl font-bold tracking-tight">إدارة طلبات الإيقاف</h2>
            <p className="text-muted-foreground">إدارة طلبات إيقاف اشتراكات الأعضاء</p>
          </div>
          {selectedRequests.length > 0 && (
            <motion.div className="flex gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Button
                onClick={handleBulkApprove}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                <CheckSquare className="w-4 h-4 ml-2" />
                موافقة على المحدد ({selectedRequests.length})
              </Button>
              <Button
                onClick={handleBulkReject}
                variant="destructive"
              >
                <XSquare className="w-4 h-4 ml-2" />
                رفض المحدد ({selectedRequests.length})
              </Button>
            </motion.div>
          )}
        </div>
      </motion.div>

      <motion.div className="grid gap-4 md:grid-cols-4" initial="hidden" animate="show">
        {[
          {
            value: pauseRequests.filter(r => r.status === 'معلق').length,
            label: 'طلبات معلقة',
            color: 'text-yellow-500',
            icon: <Clock className="w-8 h-8 text-yellow-500" />,
          },
          {
            value: pauseRequests.filter(r => r.status === 'موافق').length,
            label: 'موافق عليها',
            color: 'text-green-500',
            icon: <Check className="w-8 h-8 text-green-500" />,
          },
          {
            value: pauseRequests.filter(r => r.status === 'مرفوض').length,
            label: 'مرفوضة',
            color: 'text-red-500',
            icon: <X className="w-8 h-8 text-red-500" />,
          },
          {
            value: pauseRequests.length,
            label: 'إجمالي الطلبات',
            color: 'text-primary',
            icon: <PauseCircle className="w-8 h-8 text-primary" />,
          },
        ].map((item, i) => (
          <motion.div key={i} variants={cardFade(i)} initial="hidden" animate="show">
            <Card className="card-gradient">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${item.color}`}>{item.value}</div>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                  </div>
                  {item.icon}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <motion.div variants={fade}>
        <Card className="card-gradient">
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <CardTitle className="text-right">طلبات الإيقاف ({filteredRequests.length})</CardTitle>
              <div className="flex gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <input
                    type="text"
                    placeholder="البحث في الطلبات..."
                    className="w-full pr-10 pl-4 py-2 border border-input rounded-md bg-background text-right"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-input rounded-md bg-background text-right"
                >
                  <option value="all">جميع الحالات</option>
                  <option value="معلق">معلق</option>
                  <option value="موافق">موافق</option>
                  <option value="مرفوض">مرفوض</option>
                </select>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <AnimatePresence>
              <motion.div
                key={filteredRequests.length}
                variants={fade}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0, y: 30, transition: { duration: 0.15 } }}
              >
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right w-12">
                          <Checkbox
                            checked={selectedRequests.length === pendingRequests.length && pendingRequests.length > 0}
                            onCheckedChange={handleSelectAll}
                          />
                        </TableHead>
                        <TableHead className="text-right">رقم الطلب</TableHead>
                        <TableHead className="text-right">العضو</TableHead>
                        <TableHead className="text-right">السبب</TableHead>
                        <TableHead className="text-right">تاريخ الطلب</TableHead>
                        <TableHead className="text-right">المدة</TableHead>
                        <TableHead className="text-right">الأيام المتبقية</TableHead>
                        <TableHead className="text-right">الحالة</TableHead>
                        <TableHead className="text-right">الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <AnimatePresence>
                        {filteredRequests.map((request, i) => (
                          <motion.tr
                            key={request.id}
                            variants={cardFade(i)}
                            initial="hidden"
                            animate="show"
                            exit="hidden"
                          >
                            <TableCell className="text-right">
                              {request.status === 'معلق' && (
                                <Checkbox
                                  checked={selectedRequests.includes(request.id)}
                                  onCheckedChange={() => handleSelectRequest(request.id)}
                                />
                              )}
                            </TableCell>
                            <TableCell className="font-medium text-right">{request.id}</TableCell>
                            <TableCell className="text-right">
                              <div>
                                <p className="font-medium">{request.member}</p>
                                <p className="text-sm text-muted-foreground">{request.memberId}</p>
                              </div>
                            </TableCell>
                            <TableCell className="max-w-48 text-right">
                              <p className="truncate" title={request.reason}>{request.reason}</p>
                            </TableCell>
                            <TableCell className="text-right">{request.requestDate}</TableCell>
                            <TableCell className="text-right">{request.duration}</TableCell>
                            <TableCell className="text-right">{request.remainingDays} يوم</TableCell>
                            <TableCell className="text-right">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                                {request.status}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex gap-2 justify-end">
                                {request.status === 'معلق' && (
                                  <>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleApprove(request.id)}
                                      className="text-green-600 hover:text-green-700"
                                    >
                                      <Check className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleReject(request.id)}
                                      className="text-red-600 hover:text-red-700"
                                    >
                                      <X className="w-4 h-4" />
                                    </Button>
                                  </>
                                )}

                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setCurrentRequest(request);
                                    setShowDetails(true);
                                  }}
                                >
                                  عرض التفاصيل
                                </Button>
                              </div>
                            </TableCell>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </TableBody>
                  </Table>
                </div>
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div className="grid gap-4 md:grid-cols-3" initial="hidden" animate="show">
        {[
          {
            icon: <AlertTriangle className="w-8 h-8 text-yellow-500" />,
            title: 'مراجعة المعلق',
            desc: 'مراجعة جميع طلبات الإيقاف المعلقة',
          },
          {
            icon: <PauseCircle className="w-8 h-8 text-blue-500" />,
            title: 'الإيقافات النشطة',
            desc: 'عرض العضويات الموقوفة حالياً',
          },
          {
            icon: <Clock className="w-8 h-8 text-green-500" />,
            title: 'الاستئناف قريباً',
            desc: 'العضويات التي ستستأنف هذا الأسبوع',
          },
        ].map((action, i) => (
          <motion.div
            key={action.title}
            variants={cardFade(i)}
            initial="hidden"
            animate="show"
            whileHover={{ scale: 1.03 }}
          >
            <Card className="card-gradient cursor-pointer hover:bg-accent transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 space-x-reverse">
                  {action.icon}
                  <div className="text-right">
                    <h3 className="font-semibold">{action.title}</h3>
                    <p className="text-sm text-muted-foreground">{action.desc}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <PauseRequestDetailsDialog
        open={showDetails}
        onClose={() => setShowDetails(false)}
        request={currentRequest}
        getStatusColor={getStatusColor}
      />

    </motion.div>
  );
};

export default PauseRequestsManagement;
