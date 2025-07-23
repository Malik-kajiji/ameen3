const Footer = () => {
  return (
    <footer className="bg-card border-t border-border rtl">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-cyan-400 rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">G</span>
              </div>
              <span className="text-xl font-bold text-gradient">ورشة جيم</span>
            </div>
            <p className="text-muted-foreground">
              وجهتك الأولى للرياضة في ليبيا. غير جسمك وعقلك معانا.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">روابط سريعة</h3>
            <div className="space-y-2">
              <a href="#home" className="block text-muted-foreground hover:text-primary transition-colors">الرئيسية</a>
              <a href="#trainers" className="block text-muted-foreground hover:text-primary transition-colors">المدربين</a>
              <a href="#plans" className="block text-muted-foreground hover:text-primary transition-colors">الباقات</a>
              <a href="#contact" className="block text-muted-foreground hover:text-primary transition-colors">تواصل معنا</a>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">أنواع الاشتراكات</h3>
            <div className="space-y-2">
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">اشتراك شهري</a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">3 شهور</a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">6 شهور</a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">سنة كاملة</a>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">معلومات التواصل</h3>
            <div className="space-y-2 text-muted-foreground text-sm">
              <p>طرابلس - شارع الرياضة، ليبيا</p>
              <p>الهاتف: +218 91 234 5678</p>
              <p>الإيميل: info@alwarsha.ly</p>
              <p>الدخول متاح 24 ساعة</p>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-muted-foreground text-sm">
              © 2024 الورشة GYM. جميع الحقوق محفوظة.
            </p>
            <div className="flex space-x-6 space-x-reverse text-sm">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">سياسة الخصوصية</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">الشروط والأحكام</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">الأسئلة الشائعة</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
