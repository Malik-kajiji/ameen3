
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, User, LogIn } from 'lucide-react';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const PhoenixLogo = () => (
    <div className="w-8 h-8 relative">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <path
          d="M50 10 L70 30 L70 50 L85 35 L85 65 L70 80 L70 60 L50 80 L30 60 L30 80 L15 65 L15 35 L30 50 L30 30 L50 10 Z"
          fill="#ef3953"
          className="drop-shadow-sm"
        />
        <path
          d="M50 20 L60 30 L60 45 L50 55 L40 45 L40 30 L50 20 Z"
          fill="#1c2530"
          opacity="0.3"
        />
      </svg>
    </div>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border rtl">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2 space-x-reverse">
            <PhoenixLogo />
            <div className="flex flex-col text-right">
              <span className="text-lg font-bold text-gradient">صالة فينيكس</span>
              <span className="text-xs text-muted-foreground">Phoenix Gym</span>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-8 space-x-reverse">
            <a href="#home" className="text-foreground hover:text-primary transition-colors">الرئيسية</a>
            <a href="#trainers" className="text-foreground hover:text-primary transition-colors">المدربون</a>
            <a href="#plans" className="text-fore ground hover:text-primary transition-colors">الخطط</a>
            <a href="#contact" className="text-foreground hover:text-primary transition-colors">تواصل معنا</a>
          </div>

          <div className="hidden md:flex items-center space-x-4 space-x-reverse">
            <Button variant="ghost" size="sm">
              <LogIn className="w-4 h-4 ml-2" />
              تسجيل الدخول
            </Button>
            <Button size="sm" className="btn-gradient hover:opacity-90">
              <User className="w-4 h-4 ml-2" />
              إنشاء حساب
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>

        {isOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col space-y-4 text-right">
              <a href="#home" className="text-foreground hover:text-primary transition-colors">الرئيسية</a>
              <a href="#trainers" className="text-foreground hover:text-primary transition-colors">المدربون</a>
              <a href="#plans" className="text-foreground hover:text-primary transition-colors">الخطط</a>
              <a href="#contact" className="text-foreground hover:text-primary transition-colors">تواصل معنا</a>
              <div className="flex flex-col space-y-2 pt-4 border-t border-border">
                <Button variant="ghost" size="sm">
                  <LogIn className="w-4 h-4 ml-2" />
                  تسجيل الدخول
                </Button>
                <Button size="sm" className="btn-gradient hover:opacity-90">
                  <User className="w-4 h-4 ml-2" />
                  إنشاء حساب
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
