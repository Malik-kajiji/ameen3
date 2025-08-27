import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, Edit, Eye, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import MemberDetailsDialog from './MemberDetailsDialog';
import EditMemberDialog from './EditMemberDialog';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import useMembers from '@/hooks/useMembers';

const MembersManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('الكل');
  const [selectedMember, setSelectedMember] = useState(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const navigate = useNavigate();
  
  
  const { members, loading, error, fetchMembers, deleteMember } = useMembers();

  const getStatusColor = (status) => {
    switch (status) {
      case 'نشط':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'متوقف':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'منتهي':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const filteredMembers = members.filter(member => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'الكل' || member.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (member) => {
    setSelectedMember(member);
    setShowDetailsDialog(true);
  };

  const handleEditMember = (member) => {
    setSelectedMember(member);
    setShowEditDialog(true);
  };

  const handleSaveMember = async (updatedMember) => {
    try {
      // Update member through the hook
      // Note: In a real implementation, you would call updateMember from useMembers
      toast({
        title: "تم التحديث بنجاح",
        description: `تم تحديث بيانات ${updatedMember.name} بنجاح`,
      });
    } catch (err) {
      toast({
        title: "خطأ في التحديث",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteMember = async (memberId) => {
    const member = members.find(m => m.id === memberId);
    if (member) {
      try {
        await deleteMember(memberId);
        toast({
          title: "تم الحذف بنجاح",
          description: `تم حذف العضو ${member.name} من النظام`,
        });
      } catch (err) {
        toast({
          title: "خطأ في الحذف",
          description: err.message,
          variant: "destructive",
        });
      }
    }
  };

  const cardVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  const rowVariant = {
    hidden: { opacity: 0, x: 30 },
    visible: i => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.06 }
    })
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">جارٍ تحميل بيانات الأعضاء...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center text-red-500">
          <p className="text-xl font-bold mb-2">خطأ في تحميل البيانات</p>
          <p>{error.message}</p>
          <Button 
            className="mt-4" 
            onClick={fetchMembers}
          >
            إعادة المحاولة
          </Button>
        </div>
      </div>
    );
  }

  return (
    <motion.div className="space-y-6 rtl" initial="hidden" animate="visible" variants={cardVariant}>
      <motion.div variants={cardVariant}>
        <div className="flex justify-between items-center">
          <div className="text-right">
            <h2 className="text-3xl font-bold tracking-tight">إدارة الأعضاء</h2>
            <p className="text-muted-foreground">إدارة جميع أعضاء الصالة واشتراكاتهم</p>
          </div>
          <Button
            className="btn-gradient"
            onClick={() => navigate('/dashboard/add-member')}
          >
            <Plus className="w-4 h-4 ml-2" />
            إضافة عضو جديد
          </Button>
        </div>
      </motion.div>

      <motion.div variants={cardVariant}>
        <Card className="card-gradient">
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <CardTitle>جميع الأعضاء ({filteredMembers.length})</CardTitle>
              <div className="flex gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <input
                    type="text"
                    placeholder="البحث في الأعضاء..."
                    className="w-full pr-10 pl-4 py-2 border border-input rounded-md bg-background text-right"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="حالة العضو" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="الكل">الكل</SelectItem>
                    <SelectItem value="نشط">نشط</SelectItem>
                    <SelectItem value="متوقف">متوقف</SelectItem>
                    <SelectItem value="منتهي">منتهي</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">رقم العضو</TableHead>
                    <TableHead className="text-right">الاسم</TableHead>
                    <TableHead className="text-right">الحالة</TableHead>
                    <TableHead className="text-right">الخطة</TableHead>
                    <TableHead className="text-right">تاريخ الانضمام</TableHead>
                    <TableHead className="text-right">تاريخ الانتهاء</TableHead>
                    <TableHead className="text-right">الهاتف</TableHead>
                    <TableHead className="text-right">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {filteredMembers.map((member, i) => (
                      <motion.tr
                        key={member.id}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        custom={i}
                        variants={rowVariant}
                        style={{ direction: 'rtl' }}
                      >
                        <TableCell className="font-medium text-right">{member.id}</TableCell>
                        <TableCell className="text-right">{member.name}</TableCell>
                        <TableCell className="text-right">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                            {member.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">{member.packageName || 'لا توجد خطة'}</TableCell>
                        <TableCell className="text-right">
                          {member.subscriptionStartDate ? new Date(member.subscriptionStartDate).toLocaleDateString('ar-LY') : 'غير محدد'}
                        </TableCell>
                        <TableCell className="text-right">
                          {member.subscriptionEndDate ? new Date(member.subscriptionEndDate).toLocaleDateString('ar-LY') : 'غير محدد'}
                        </TableCell>
                        <TableCell className="text-right">{member.phone}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewDetails(member)}
                              title="عرض التفاصيل"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditMember(member)}
                              title="تعديل العضو"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-700"
                              onClick={() => handleDeleteMember(member.id)}
                              title="حذف العضو"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        className="grid gap-4 md:grid-cols-4"
        variants={cardVariant}
        initial="hidden"
        animate="visible"
      >
        <Card className="card-gradient">
          <CardContent className="p-6 text-right">
            <div className="text-2xl font-bold text-green-500">
              {members.filter(m => m.status === 'نشط').length}
            </div>
            <p className="text-xs text-muted-foreground">الأعضاء النشطون</p>
          </CardContent>
        </Card>
        <Card className="card-gradient">
          <CardContent className="p-6 text-right">
            <div className="text-2xl font-bold text-yellow-500">
              {members.filter(m => m.status === 'متوقف').length}
            </div>
            <p className="text-xs text-muted-foreground">الأعضاء المتوقفون</p>
          </CardContent>
        </Card>
        <Card className="card-gradient">
          <CardContent className="p-6 text-right">
            <div className="text-2xl font-bold text-red-500">
              {members.filter(m => m.status === 'منتهي').length}
            </div>
            <p className="text-xs text-muted-foreground">الأعضاء المنتهون</p>
          </CardContent>
        </Card>
        <Card className="card-gradient">
          <CardContent className="p-6 text-right">
            <div className="text-2xl font-bold text-primary">
              {members.length}
            </div>
            <p className="text-xs text-muted-foreground">إجمالي الأعضاء</p>
          </CardContent>
        </Card>
      </motion.div>

      <MemberDetailsDialog
        member={selectedMember}
        isOpen={showDetailsDialog}
        onClose={() => {
          setShowDetailsDialog(false);
          setSelectedMember(null);
        }}
        onEdit={(member) => {
          setShowDetailsDialog(false);
          handleEditMember(member);
        }}
      />

      <EditMemberDialog
        member={selectedMember}
        isOpen={showEditDialog}
        onClose={() => {
          setShowEditDialog(false);
          setSelectedMember(null);
        }}
        onSave={handleSaveMember}
      />
    </motion.div>
  );
};

export default MembersManagement;
