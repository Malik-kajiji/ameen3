import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Upload, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import useMembers from '@/hooks/useMembers';
import useFinancial from '@/hooks/useFinancial';
import { useNavigate } from 'react-router-dom';

const AddMember = () => {
  const { toast } = useToast();
  const { createMember, packages, loading: membersLoading, fetchPackages } = useMembers();
  const { createInvoice } = useFinancial();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    nationality: '',
    nationalId: '',
    password: '',
    weight: '',
    height: '',
    occupation: '',
    dateOfBirth: '',
    fingerprint: '',
    documents: null,
    plan: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch packages when component mounts
  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  // Validation functions
  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^09\d{8}$/;
    return phoneRegex.test(phone);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateAge = (dateOfBirth) => {
    if (!dateOfBirth) return false;
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age >= 16;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    setIsSubmitted(true);
    
    // Validate required fields
    if (!formData.name || !formData.phone || !formData.email || !formData.nationality || !formData.nationalId || !formData.password || !formData.plan) {
      toast({
        title: "خطأ في الإدخال",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    // Validate phone number format
    if (!validatePhoneNumber(formData.phone)) {
      toast({
        title: "خطأ في رقم الهاتف",
        description: "يجب أن يبدأ رقم الهاتف بـ 09 ويتكون من 10 أرقام",
        variant: "destructive",
      });
      return;
    }

    // Validate email format
    if (!validateEmail(formData.email)) {
      toast({
        title: "خطأ في البريد الإلكتروني",
        description: "يرجى إدخال بريد إلكتروني صحيح",
        variant: "destructive",
      });
      return;
    }

    // Validate age
    if (!validateAge(formData.dateOfBirth)) {
      toast({
        title: "خطأ في العمر",
        description: "يجب أن يكون عمر العضو 16 سنة أو أكثر",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setLoading(true);
      
      // Map form data to API format
      const memberData = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        nationality: formData.nationality,
        nationalId: formData.nationalId,
        password: formData.password,
        weight: formData.weight,
        height: formData.height,
        occupation: formData.occupation,
        dateOfBirth: formData.dateOfBirth,
        plan: formData.plan, // This is now the package title from database
        city: formData.nationality,
        gender: 'male' // Default to male, could be added to form later
      };
      
      // Create the member
      const newMember = await createMember(memberData);
      
      // Find the selected package to get its price
      const selectedPackage = packages.find(pkg => pkg.title === formData.plan);
      
      // Create an invoice for the package payment
      if (selectedPackage) {
        await createInvoice({
          amount: selectedPackage.price,
          source: 'subscription',
          note: `اشتراك ${selectedPackage.title} - ${selectedPackage.period} يوم`,
          date: new Date(),
          userId: newMember._id,
          packageId: selectedPackage._id
        });
      }
      
      toast({
        title: "تم إنشاء العضو بنجاح",
        description: `تم إنشاء عضو جديد باسم ${formData.name}`,
      });
      
      // Reset form
      setFormData({
        name: '',
        phone: '',
        email: '',
        nationality: '',
        nationalId: '',
        weight: '',
        height: '',
        occupation: '',
        dateOfBirth: '',
        fingerprint: '',
        documents: null,
        plan: ''
      });
      
      // Navigate to members page
      navigate('/dashboard/members');
    } catch (err) {
      toast({
        title: "خطأ في إنشاء العضو",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const planClass = (packageTitle) =>
    formData.plan === packageTitle
      ? "border-primary bg-primary/10 ring-2 ring-primary"
      : "border-border hover:bg-accent transition-colors";

  const cardVariant = {
    hidden: { opacity: 0, y: 32 },
    visible: (i = 1) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15 }
    })
  };

  // Format package data for display
  const formatPackageForDisplay = (pkg) => {
    // Convert period from days to more readable format
    let duration = '';
    if (pkg.period === 30) {
      duration = 'شهر واحد';
    } else if (pkg.period === 90) {
      duration = '3 أشهر';
    } else if (pkg.period === 180) {
      duration = '6 أشهر';
    } else if (pkg.period === 365) {
      duration = '12 شهر';
    } else {
      duration = `${pkg.period} يوم`;
    }
    
    // Format price
    const price = `${pkg.price} د.ل`;
    
    return {
      title: pkg.title,
      price,
      duration
    };
  };

  return (
    <motion.div
      className="space-y-6 rtl"
      initial="hidden"
      animate="visible"
      variants={cardVariant}
    >
      <motion.div variants={cardVariant}>
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate('/dashboard/members')}>
            <ArrowRight className="w-4 h-4 ml-2" />
            العودة إلى الأعضاء
          </Button>
          <div className="text-right">
            <h2 className="text-3xl font-bold tracking-tight">إضافة عضو جديد</h2>
            <p className="text-muted-foreground">إنشاء عضوية جديدة في الصالة</p>
          </div>
        </div>
      </motion.div>

      <motion.div className="grid gap-6 md:grid-cols-2" variants={cardVariant}>
        
        <motion.div variants={cardVariant} custom={0}>
          <Card className="card-gradient">
            <CardHeader>
              <CardTitle className="text-right">المعلومات المطلوبة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
             
              <div>
                <label className="block text-sm font-medium mb-2 text-right">الاسم الكامل *</label>
                <input 
                  type="text" 
                  className={`w-full px-3 py-2 border ${isSubmitted && !formData.name ? 'border-red-400' : 'border-input'} rounded-md bg-background text-right`} 
                  value={formData.name} 
                  onChange={(e) => handleInputChange('name', e.target.value)} 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-right">رقم الهاتف *</label>
                <input
                  type="tel"
                  className={`w-full px-3 py-2 border ${isSubmitted && (!formData.phone || !validatePhoneNumber(formData.phone)) ? 'border-red-400' : 'border-input'} rounded-md bg-background text-right`}
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="09XXXXXXXX"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-right">عنوان البريد الإلكتروني *</label>
                <input
                  type="email"
                  className={`w-full px-3 py-2 border ${isSubmitted && (!formData.email || !validateEmail(formData.email)) ? 'border-red-400' : 'border-input'} rounded-md bg-background text-right`}
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="example@domain.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-right">الجنسية *</label>
                <input 
                  type="text" 
                  className={`w-full px-3 py-2 border ${isSubmitted && !formData.nationality ? 'border-red-400' : 'border-input'} rounded-md bg-background text-right`} 
                  value={formData.nationality} 
                  onChange={(e) => handleInputChange('nationality', e.target.value)} 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-right">الرقم الوطني *</label>
                <input 
                  type="text" 
                  className={`w-full px-3 py-2 border ${isSubmitted && !formData.nationalId ? 'border-red-400' : 'border-input'} rounded-md bg-background text-right`} 
                  value={formData.nationalId} 
                  onChange={(e) => handleInputChange('nationalId', e.target.value)} 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-right">كلمة المرور *</label>
                <input
                  type="password"
                  className={`w-full px-3 py-2 border ${isSubmitted && !formData.password ? 'border-red-400' : 'border-input'} rounded-md bg-background text-right`}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-right">البصمة *</label>
                <Button variant="outline" className="w-full" disabled>
                  <Upload className="w-4 h-4 ml-2" />
                  مسح البصمة (تفعيل لاحقًا)
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={cardVariant} custom={1}>
          <Card className="card-gradient">
            <CardHeader>
              <CardTitle className="text-right">المعلومات الاختيارية</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-right">الوزن (كيلوغرام)</label>
                <input 
                  type="number" 
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-right" 
                  value={formData.weight} 
                  onChange={(e) => handleInputChange('weight', e.target.value)} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-right">الطول (سنتيمتر)</label>
                <input 
                  type="number" 
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-right" 
                  value={formData.height} 
                  onChange={(e) => handleInputChange('height', e.target.value)} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-right">المهنة</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-right" 
                  value={formData.occupation} 
                  onChange={(e) => handleInputChange('occupation', e.target.value)} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-right">تاريخ الميلاد</label>
                <input
                  type="date"
                  className={`w-full px-3 py-2 border ${isSubmitted && !validateAge(formData.dateOfBirth) ? 'border-red-400' : 'border-input'} rounded-md bg-background text-right`}
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-right">المستندات</label>
                <input 
                  type="file" 
                  multiple 
                  className="w-full text-right" 
                  onChange={(e) => handleInputChange('documents', e.target.files)} 
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div variants={cardVariant} custom={2}>
        <Card className="card-gradient">
          <CardHeader>
            <CardTitle className="text-right">خطة الاشتراك *</CardTitle>
          </CardHeader>
          <CardContent>
            {membersLoading ? (
              <div className="text-center py-4 text-muted-foreground">
                جارٍ تحميل الخطط...
              </div>
            ) : packages.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                لا توجد خطط متاحة
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-4">
                <AnimatePresence>
                  {packages.map((pkg, i) => {
                    const displayPackage = formatPackageForDisplay(pkg);
                    return (
                      <motion.div
                        key={pkg._id}
                        className={`border rounded-lg p-4 cursor-pointer text-right flex flex-col gap-2 ${planClass(pkg.title)}`}
                        onClick={() => handleInputChange('plan', pkg.title)}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1, transition: { delay: 0.1 * i } }}
                        whileHover={{ scale: 1.04 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                      >
                        <div className="flex items-center gap-2 justify-between">
                          <span className="font-semibold">{displayPackage.title}</span>
                          {formData.plan === pkg.title && <CheckCircle2 className="text-primary w-5 h-5" />}
                        </div>
                        <p className="text-2xl font-bold text-primary">{displayPackage.price}</p>
                        <p className="text-sm text-muted-foreground">{displayPackage.duration}</p>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
            {isSubmitted && !formData.plan && <div className="text-red-500 text-sm mt-2 text-right">اختر خطة اشتراك</div>}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div className="flex gap-4" variants={cardVariant} custom={3}>
        <Button
          onClick={handleSubmit}
          className="btn-gradient"
          disabled={
            !formData.name ||
            !formData.phone ||
            !formData.email ||
            !formData.nationality ||
            !formData.nationalId ||
            !formData.password ||
            !formData.plan ||
            loading ||
            membersLoading
          }
        >
          {loading ? 'جاري الإنشاء...' : 'إنشاء عضو'}
        </Button>
        <Button variant="outline" onClick={() => navigate('/dashboard/members')}>
          إلغاء
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default AddMember;
