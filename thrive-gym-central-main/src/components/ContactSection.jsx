import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Home, Calendar } from 'lucide-react';

const ContactSection = () => {
  return (
    <section id="contact" className="py-20 bg-background rtl">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
        
          <div className="space-y-8 animate-slide-in-right">
            <div className="text-right">
              <h2 className="text-4xl font-bold mb-4">
                هل أنت مستعد لبدء <span className="text-gradient">رحلتك الرياضية؟</span>
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                قم بزيارة صالة فينيكس اليوم واختبر أفضل منشأة رياضية في ليبيا. 
                فريقنا مستعد لمساعدتك في تحقيق أهدافك الرياضية.
              </p>
            </div>

            <div className="space-y-6">
              <Card className="card-gradient border-primary/10">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4 space-x-reverse">
                    <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                      <Home className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-right">
                      <h3 className="text-lg font-semibold mb-2">قم بزيارة موقعنا</h3>
                      <p className="text-muted-foreground">
                        شارع الرياضة 123، طرابلس، ليبيا<br />
                        بالقرب من المول المركزي، الطابق الأرضي
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-gradient border-primary/10">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4 space-x-reverse">
                    <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-right">
                      <h3 className="text-lg font-semibold mb-2">ساعات العمل</h3>
                      <p className="text-muted-foreground">
                        دخول مفتوح 24/7 لجميع الأعضاء<br />
                        الموظفون متاحون: من 6 صباحاً - 10 مساءً يومياً
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-gradient border-primary/10">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4 space-x-reverse">
                    <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-right">
                      <h3 className="text-lg font-semibold mb-2">تواصل معنا</h3>
                      <p className="text-muted-foreground">
                        الهاتف: +218 21 123 4567<br />
                        البريد الإلكتروني: info@phoenixgym.ly
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="btn-gradient hover:opacity-90">
                احجز جولة
              </Button>
              <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                تواصل معنا
              </Button>
            </div>
          </div>

          <div className="animate-fade-in">
            <Card className="card-gradient border-primary/10 overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-square bg-gradient-to-br from-primary/20 to-cyan-400/20 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-primary/30 rounded-full mx-auto flex items-center justify-center">
                      <Home className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">موقع صالة فينيكس</h3>
                      <p className="text-muted-foreground">الخريطة التفاعلية قادمة قريباً</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
