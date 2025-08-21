import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Globe, Edit } from 'lucide-react';
import { useWebsite } from '@/hooks/useWebsite';
import { usePackages } from '@/hooks/usePackages';
import { EditAboutDialog } from './EditAboutDialog';
import { EditFeaturesDialog } from './EditFeaturesDialog';
import { EditScheduleDialog } from './EditScheduleDialog';
import { EditPackagesDialog } from './EditPackagesDialog';
import { EditContactDialog } from './EditContactDialog';

const fadeSlide = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.1 * i, duration: 0.5 },
  }),
};

 const WebsiteManagement = () => {
  const { websiteContent, getContent, updateAbout, updateFeatures, updateTrainingDays, updateContact, user } = useWebsite();
  const { packages, getPackages, updatePackages } = usePackages();
  const [activeDialog, setActiveDialog] = useState(null);

  useEffect(() => {
    if (user) {
      getContent();
      getPackages();
    }
  }, [user]); // Only depend on user changes

  const handleDialogChange = (open, type) => {
    if (!open) {
      setActiveDialog(null);
    } else if (user) {
      setActiveDialog(type);
    }
  };

  const handleSave = async (type, data) => {
    switch (type) {
      case 'about':
        await updateAbout(data);
        break;
      case 'features':
        await updateFeatures(data);
        break;
      case 'schedule':
        await updateTrainingDays(data);
        break;
      case 'packages':
        await updatePackages(data);
        break;
      case 'contact':
        await updateContact(data);
        break;
    }
    setActiveDialog(null);
  };

  return (
    <motion.div
      dir="rtl"
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={fadeSlide}
    >
      <motion.div className="flex justify-between items-center" variants={fadeSlide} custom={1}>
        <div className="text-right">
          <h2 className="text-3xl font-bold tracking-tight">إدارة الموقع الإلكتروني</h2>
          <p className="text-muted-foreground">إدارة محتوى الموقع الإلكتروني للنادي الرياضي</p>
        </div>
        <Button className="btn-gradient" asChild>
          <a href="#" target="_blank" rel="noopener noreferrer" tabIndex={-1}>
            <Globe className="w-4 h-4 ml-2" />
            زيارة الموقع
          </a>
        </Button>
      </motion.div>

      <motion.div variants={fadeSlide} custom={2}>
        <Card className="card-gradient">
          <CardHeader>
            <CardTitle className="text-right">إدارة المحتوى</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                {
                  title: 'من نحن',
                  desc: 'معلومات النادي وقصتنا',
                  type: 'about',
                  data: websiteContent?.about
                },
                {
                  title: 'المميزات',
                  desc: 'مميزات وخدمات النادي',
                  type: 'features',
                  data: websiteContent?.features
                },
                {
                  title: 'جدول المدربين',
                  desc: 'جدول الحصص والمدربين',
                  type: 'schedule',
                  data: websiteContent?.trainingDays
                },
                {
                  title: 'باقات الاشتراك',
                  desc: 'الأسعار وتفاصيل الخطط',
                  type: 'packages',
                  data: packages
                },
                {
                  title: 'معلومات الاتصال',
                  desc: 'العنوان وتفاصيل الاتصال',
                  type: 'contact',
                  data: websiteContent?.contact
                }
              ].map((section) => (
                <motion.div
                  key={section.title}
                  className="p-4 border border-border rounded-lg hover:bg-accent transition-colors"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <h3 className="font-semibold mb-2 text-right">{section.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3 text-right">{section.desc}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="cursor-pointer"
                    disabled={!user}
                    onClick={(e) => {
                      e.preventDefault();
                      handleDialogChange(true, section.type);
                    }}
                  >
                    <Edit className="w-4 h-4 ml-2" />
                    تحرير
                  </Button>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {activeDialog === 'about' && (
        <EditAboutDialog
          open={true}
          onOpenChange={(open) => handleDialogChange(open, 'about')}
          initialData={websiteContent?.about}
          onSave={(data) => handleSave('about', data)}
        />
      )}

      {activeDialog === 'features' && (
        <EditFeaturesDialog
          open={true}
          onOpenChange={(open) => handleDialogChange(open, 'features')}
          initialData={websiteContent?.features}
          onSave={(data) => handleSave('features', data)}
        />
      )}

      {activeDialog === 'schedule' && (
        <EditScheduleDialog
          open={true}
          onOpenChange={(open) => handleDialogChange(open, 'schedule')}
          initialData={websiteContent?.trainingDays}
          onSave={(data) => handleSave('schedule', data)}
        />
      )}

      {activeDialog === 'packages' && (
        <EditPackagesDialog
          open={true}
          onOpenChange={(open) => handleDialogChange(open, 'packages')}
          initialData={packages}
          onSave={(data) => {
            updatePackages(data);
            setActiveDialog(null);
          }}
        />
      )}

      {activeDialog === 'contact' && (
        <EditContactDialog
          open={true}
          onOpenChange={(open) => handleDialogChange(open, 'contact')}
          initialData={websiteContent?.contact}
          onSave={(data) => handleSave('contact', data)}
        />
      )}
    </motion.div>
  );
};

export default WebsiteManagement;
export { WebsiteManagement }; // Exporting for use in other components