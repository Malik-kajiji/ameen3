import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Upload, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const plans = [
  { key: 'monthly', name: 'شهرية', price: '170 د.ل', duration: 'شهر واحد' },
  { key: 'quarter', name: '3 أشهر', price: '450 د.ل', duration: '3 أشهر' },
  { key: 'half', name: '6 أشهر', price: '750 د.ل', duration: '6 أشهر' },
  { key: 'yearly', name: 'سنوية', price: '1200 د.ل', duration: '12 شهر' }
];

const AddMember = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
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

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e?.preventDefault?.();
    setIsSubmitted(true);
    if (!formData.name || !formData.phone || !formData.email || !formData.nationality || !formData.nationalId || !formData.plan) {
      return;
    }
    alert('تم إنشاء العضو بنجاح!');
    onNavigate('members');
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };


  const planClass = (key) =>
    formData.plan === key
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

  return (
    <motion.div
      className="space-y-6 rtl"
      initial="hidden"
      animate="visible"
      variants={cardVariant}
    >
      <motion.div variants={cardVariant}>
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => onNavigate('members')}>
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
                <input type="text" className={`w-full px-3 py-2 border ${isSubmitted && !formData.name ? 'border-red-400' : 'border-input'} rounded-md bg-background text-right`} value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-right">رقم الهاتف *</label>
                <input type="tel" className={`w-full px-3 py-2 border ${isSubmitted && !formData.phone ? 'border-red-400' : 'border-input'} rounded-md bg-background text-right`} value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-right">عنوان البريد الإلكتروني *</label>
                <input type="email" className={`w-full px-3 py-2 border ${isSubmitted && !formData.email ? 'border-red-400' : 'border-input'} rounded-md bg-background text-right`} value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-right">الجنسية *</label>
                <input type="text" className={`w-full px-3 py-2 border ${isSubmitted && !formData.nationality ? 'border-red-400' : 'border-input'} rounded-md bg-background text-right`} value={formData.nationality} onChange={(e) => handleInputChange('nationality', e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-right">الرقم الوطني *</label>
                <input type="text" className={`w-full px-3 py-2 border ${isSubmitted && !formData.nationalId ? 'border-red-400' : 'border-input'} rounded-md bg-background text-right`} value={formData.nationalId} onChange={(e) => handleInputChange('nationalId', e.target.value)} required />
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
                <input type="number" className="w-full px-3 py-2 border border-input rounded-md bg-background text-right" value={formData.weight} onChange={(e) => handleInputChange('weight', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-right">الطول (سنتيمتر)</label>
                <input type="number" className="w-full px-3 py-2 border border-input rounded-md bg-background text-right" value={formData.height} onChange={(e) => handleInputChange('height', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-right">المهنة</label>
                <input type="text" className="w-full px-3 py-2 border border-input rounded-md bg-background text-right" value={formData.occupation} onChange={(e) => handleInputChange('occupation', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-right">تاريخ الميلاد</label>
                <input type="date" className="w-full px-3 py-2 border border-input rounded-md bg-background text-right" value={formData.dateOfBirth} onChange={(e) => handleInputChange('dateOfBirth', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-right">المستندات</label>
                <input type="file" multiple className="w-full text-right" onChange={(e) => handleInputChange('documents', e.target.files)} />
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
            <div className="grid gap-4 md:grid-cols-4">
              <AnimatePresence>
                {plans.map((plan, i) => (
                  <motion.div
                    key={plan.key}
                    className={`border rounded-lg p-4 cursor-pointer text-right flex flex-col gap-2 ${planClass(plan.key)}`}
                    onClick={() => handleInputChange('plan', plan.key)}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1, transition: { delay: 0.1 * i } }}
                    whileHover={{ scale: 1.04 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <div className="flex items-center gap-2 justify-between">
                      <span className="font-semibold">{plan.name}</span>
                      {formData.plan === plan.key && <CheckCircle2 className="text-primary w-5 h-5" />}
                    </div>
                    <p className="text-2xl font-bold text-primary">{plan.price}</p>
                    <p className="text-sm text-muted-foreground">{plan.duration}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
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
            !formData.plan
          }
        >
          إنشاء عضو
        </Button>
        <Button variant="outline" onClick={() => onNavigate('members')}>
          إلغاء
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default AddMember;
