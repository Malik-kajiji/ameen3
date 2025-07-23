import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Calendar, Users, Home } from 'lucide-react';

const HeroSection = () => {
  return (
    <section id="home" className="hero-gradient min-h-screen flex items-center pt-16 rtl">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          <div className="space-y-8 animate-slide-in-left">

            <Card className="card-gradient p-4 border-primary/20 animate-pulse-glow">
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <span className="text-primary font-semibold">🔥 عرض خاص!</span>
                <span className="text-sm text-muted-foreground">باقة 3 شهور - وفر 15%</span>
              </div>
            </Card>

            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight text-right">
                غير حياتك
                <span className="text-gradient block">جسمك وعقلك</span>
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed text-right">
                انضم لصالة الورشة – أفضل وجهة للياقة في ليبيا. معدات حديثة، مدربين محترفين، وباقات اشتراك مرنة تناسب هدفك.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-start sm:justify-start">
              <Button size="lg" className="btn-gradient hover:opacity-90 text-lg px-8 py-3">
                ابدا رحلتك الآن
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-3 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                شاهد الباقات
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground">مشترك نشط</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">10+</div>
                <div className="text-sm text-muted-foreground">مدرب معتمد</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">24/7</div>
                <div className="text-sm text-muted-foreground">دخول متاح</div>
              </div>
            </div>
          </div>

          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 gap-6">
              <Card className="card-gradient p-6 border-primary/10 hover:border-primary/30 transition-all">
                <div className="flex items-start space-x-4 space-x-reverse">
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Home className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-right">معدات حديثة</h3>
                    <p className="text-muted-foreground text-right">أحدث أجهزة الكارديو والقوة من أفضل الشركات العالمية</p>
                  </div>
                </div>
              </Card>

              <Card className="card-gradient p-6 border-primary/10 hover:border-primary/30 transition-all">
                <div className="flex items-start space-x-4 space-x-reverse">
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-right">مدربين خبرة</h3>
                    <p className="text-muted-foreground text-right">فريق معتمد لمساعدتك في تحقيق أهدافك الرياضية</p>
                  </div>
                </div>
              </Card>

              <Card className="card-gradient p-6 border-primary/10 hover:border-primary/30 transition-all">
                <div className="flex items-start space-x-4 space-x-reverse">
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-right">باقات مرنة</h3>
                    <p className="text-muted-foreground text-right">من شهري إلى سنوي، مع إمكانية الإيقاف وجيب صاحبك معاك</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
