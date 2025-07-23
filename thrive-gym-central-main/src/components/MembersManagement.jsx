import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Filter, Download, Plus, Edit, Eye, Trash2 } from 'lucide-react';
import MemberDetailsDialog from './MemberDetailsDialog';
import EditMemberDialog from './EditMemberDialog';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion'; 

const MembersManagement = ({ onNavigate }) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const [members, setMembers] = useState([
    {
      id: 'GM001',
      name: 'أحمد علي حسن',
      status: 'نشط',
      plan: 'شهري',
      joinDate: '2024-01-15',
      expiryDate: '2024-12-15',
      phone: '+218 91 234 5678',
      email: 'ahmed.ali@email.com',
      address: 'طرابلس، حي الأندلس، شارع الجمهورية',
      emergencyContact: '+218 92 345 6789',
      age: 28,
      gender: 'ذكر'
    },
    {
      id: 'GM002',
      name: 'سارة محمد سالم',
      status: 'متوقف',
      plan: '6 أشهر',
      joinDate: '2024-02-01',
      expiryDate: '2024-08-01',
      phone: '+218 92 345 6789',
      email: 'sara.mohammed@email.com',
      address: 'بنغازي، حي الفويهات، شارع التحرير',
      emergencyContact: '+218 93 456 7890',
      age: 24,
      gender: 'أنثى'
    },

    {
      id: 'GM003',
      name: 'عمر عبدالله منصور',
      status: 'منتهي',
      plan: '3 أشهر',
      joinDate: '2023-12-01',
      expiryDate: '2024-03-01',
      phone: '+218 93 456 7890',
      email: 'omar.abdullah@email.com',
      address: 'مصراتة، حي الكورنيش، شارع الشط',
      emergencyContact: '+218 94 567 8901',
      age: 32,
      gender: 'ذكر'
    },
    {
      id: 'GM004',
      name: 'فاطمة حسن علي',
      status: 'نشط',
      plan: 'سنوي',
      joinDate: '2024-01-01',
      expiryDate: '2025-01-01',
      phone: '+218 94 567 8901',
      email: 'fatima.hassan@email.com',
      address: 'سبها، حي المطار، شارع الوحدة',
      emergencyContact: '+218 95 678 9012',
      age: 26,
      gender: 'أنثى'
    },
    {
      id: 'GM005',
      name: 'خالد سالم عمر',
      status: 'نشط',
      plan: 'شهري',
      joinDate: '2024-03-10',
      expiryDate: '2024-04-10',
      phone: '+218 95 678 9012',
      email: 'khalid.salem@email.com',
      address: 'الزاوية، حي النصر، شارع الجلاء',
      emergencyContact: '+218 96 789 0123',
      age: 30,
      gender: 'ذكر'
    }
  ]);

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

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDetails = (member) => {
    setSelectedMember(member);
    setShowDetailsDialog(true);
  };

  const handleEditMember = (member) => {
    setSelectedMember(member);
    setShowEditDialog(true);
  };

  const handleSaveMember = (updatedMember) => {
    setMembers(prev => prev.map(member =>
      member.id === updatedMember.id ? updatedMember : member
    ));
    toast({
      title: "تم التحديث بنجاح",
      description: `تم تحديث بيانات ${updatedMember.name} بنجاح`,
    });
  };

  const handleDeleteMember = (memberId) => {
    const member = members.find(m => m.id === memberId);
    if (member) {
      setMembers(prev => prev.filter(m => m.id !== memberId));
      toast({
        title: "تم الحذف بنجاح",
        description: `تم حذف العضو ${member.name} من النظام`,
      });
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
            onClick={() => onNavigate?.('add-member')}
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
                        <TableCell className="text-right">{member.plan}</TableCell>
                        <TableCell className="text-right">{member.joinDate}</TableCell>
                        <TableCell className="text-right">{member.expiryDate}</TableCell>
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
