import { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  DollarSign, 
  Settings, 
  Bell, 
  FileText, 
  Shield, 
  Database,
  Menu,
  X,
  Calendar,
  Activity,
  PauseCircle,
  ChevronDown,
  ChevronLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const PhoenixLogo = ({ size = 'default' }) => {

  const dimensions = size === 'small' ? 'w-8 h-8' : 'w-12 h-12';
  return (
    <img
      src="/Phoenix.svg"
      alt="شعار صالة فينيكس"
      className={`${dimensions} object-contain drop-shadow-md select-none`}
      draggable={false}
    />
  );
};

const DashboardLayout = ({ children, activeView = 'dashboard', onNavigate }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState(['members', 'operations']);

  const navigationSections = [
    {
      title: 'نظرة عامة',
      key: 'overview',
      items: [
        { name: 'لوحة التحكم', icon: LayoutDashboard, href: 'dashboard' }
      ]
    },
    {
      title: 'إدارة الأعضاء',
      key: 'members',
      items: [
        { name: 'الأعضاء', icon: Users, href: 'members' },
        { name: 'إضافة عضو', icon: UserPlus, href: 'add-member' },
        { name: 'طلبات الإيقاف', icon: PauseCircle, href: 'pause-requests' }
      ]
    },
    {
      title: 'العمليات',
      key: 'operations',
      items: [
        { name: 'الموظفون', icon: Users, href: 'employees' },
        { name: 'المالية', icon: DollarSign, href: 'financial' },
        { name: 'الأصول', icon: Database, href: 'assets' }
      ]
    },
    {
      title: 'التحليلات والتقارير',
      key: 'analytics',
      items: [
        { name: 'التقارير', icon: FileText, href: 'reports' },
        { name: 'البيومترية', icon: Activity, href: 'biometric' }
      ]
    },
    {
      title: 'إدارة النظام',
      key: 'system',
      items: [
        { name: 'الإشعارات', icon: Bell, href: 'notifications' },
        { name: 'إدارة الموقع', icon: Calendar, href: 'website' },
        { name: 'إدارة المديرين', icon: Shield, href: 'admin' },
        { name: 'الإعدادات', icon: Settings, href: 'settings' }
      ]
    }
  ];

  const handleNavClick = (href) => {
    if (onNavigate) {
      onNavigate(href);
    }
    setMobileMenuOpen(false);
  };

  const toggleSection = (sectionKey) => {
    setExpandedSections(prev => 
      prev.includes(sectionKey) 
        ? prev.filter(key => key !== sectionKey)
        : [...prev, sectionKey]
    );
  };

  const renderNavigationItems = (items, isCollapsed) => (
    <ul className="space-y-1">
      {items.map((item) => (
        <li key={item.name}>
          <button
            onClick={() => handleNavClick(item.href)}
            className={`w-full flex items-center space-x-3 space-x-reverse px-3 py-2 rounded-lg text-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-200 group ${
              activeView === item.href ? 'bg-accent text-accent-foreground shadow-sm' : ''
            }`}
          >
            <item.icon className={`w-4 h-4 flex-shrink-0 ${activeView === item.href ? 'text-primary' : 'group-hover:text-primary'} transition-colors`} />
            {!isCollapsed && <span className="text-sm font-medium truncate">{item.name}</span>}
            {activeView === item.href && !isCollapsed && (
              <div className="w-2 h-2 bg-primary rounded-full mr-auto animate-pulse" />
            )}
          </button>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="min-h-screen bg-background flex w-full rtl">

      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 phone:block md:hidden backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div className={`hidden md:flex ${sidebarOpen ? 'w-72' : 'w-16'} transition-all duration-300 bg-card/50 backdrop-blur-md border-l border-border/50 flex-col shadow-lg`}>
        <div className="p-4 border-b border-border/50">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div className="flex items-center space-x-3 space-x-reverse animate-fade-in">
                <PhoenixLogo />
                <div className="flex flex-col text-right">
                  <span className="text-lg font-bold text-gradient">صالة فينيكس</span>
                  <span className="text-xs text-muted-foreground font-medium">نظام الإدارة</span>
                </div>
              </div>
            )}
            {!sidebarOpen && (
              <PhoenixLogo size="small" />
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-accent/50 transition-colors"
            >
              {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          {navigationSections.map((section) => (
            <div key={section.key} className="mb-6">
              {sidebarOpen && (
                <button
                  onClick={() => toggleSection(section.key)}
                  className="w-full flex items-center justify-between px-2 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors group"
                >
                  <span className="group-hover:text-primary transition-colors">{section.title}</span>
                  {expandedSections.includes(section.key) ? 
                    <ChevronDown className="w-3 h-3 group-hover:text-primary transition-colors" /> : 
                    <ChevronLeft className="w-3 h-3 group-hover:text-primary transition-colors" />
                  }
                </button>
              )}
              {(sidebarOpen && expandedSections.includes(section.key)) || !sidebarOpen ? (
                <div className={sidebarOpen ? "mt-2 animate-fade-in" : ""}>
                  {renderNavigationItems(section.items, !sidebarOpen)}
                </div>
              ) : null}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-border/50">
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="w-10 h-10 bg-gradient-to-br from-custom-red to-custom-dark-blue rounded-full flex items-center justify-center shadow-md">
              <span className="text-white text-sm font-bold">م</span>
            </div>
            {sidebarOpen && (
              <div className="animate-fade-in text-right">
                <p className="text-sm font-semibold">مستخدم مدير</p>
                <p className="text-xs text-muted-foreground">مدير عام</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={`fixed inset-y-0 right-0 z-50 w-72 bg-card/95 backdrop-blur-lg border-l border-border/50 flex flex-col transform transition-transform duration-300 md:hidden shadow-2xl ${
        mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="p-4 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 space-x-reverse">
              <PhoenixLogo />
              <div className="flex flex-col text-right">
                <span className="phone-text-base font-bold text-gradient">صالة فينيكس</span>
                <span className="phone-text-xs text-muted-foreground font-medium">نظام الإدارة</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 hover:bg-accent/50"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          {navigationSections.map((section) => (
            <div key={section.key} className="mb-6">
              <button
                onClick={() => toggleSection(section.key)}
                className="w-full flex items-center justify-between px-2 py-2 phone-text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors group"
              >
                <span className="group-hover:text-primary transition-colors">{section.title}</span>
                {expandedSections.includes(section.key) ? 
                  <ChevronDown className="w-3 h-3 group-hover:text-primary transition-colors" /> : 
                  <ChevronLeft className="w-3 h-3 group-hover:text-primary transition-colors" />
                }
              </button>
              {expandedSections.includes(section.key) && (
                <div className="mt-2">
                  <ul className="space-y-1">
                    {section.items.map((item) => (
                      <li key={item.name}>
                        <button
                          onClick={() => handleNavClick(item.href)}
                          className={`w-full flex items-center space-x-3 space-x-reverse px-3 py-2 rounded-lg text-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-200 group ${
                            activeView === item.href ? 'bg-accent text-accent-foreground shadow-sm' : ''
                          }`}
                        >
                          <item.icon className={`w-4 h-4 flex-shrink-0 ${activeView === item.href ? 'text-primary' : 'group-hover:text-primary'} transition-colors`} />
                          <span className="phone-text-sm font-medium truncate">{item.name}</span>
                          {activeView === item.href && (
                            <div className="w-2 h-2 bg-primary rounded-full mr-auto animate-pulse" />
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-border/50">
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="w-10 h-10 bg-gradient-to-br from-custom-red to-custom-dark-blue rounded-full flex items-center justify-center shadow-md">
              <span className="text-white text-sm font-bold">م</span>
            </div>
            <div className="text-right">
              <p className="phone-text-sm font-semibold">مستخدم مدير</p>
              <p className="phone-text-xs text-muted-foreground">مدير عام</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-card/30 backdrop-blur-md border-b border-border/50 p-4 phone-p-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 space-x-reverse">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden p-2 hover:bg-accent/50"
              >
                <Menu className="w-4 h-4" />
              </Button>
              <div className="flex items-center space-x-2 space-x-reverse">
                <div className="hidden phone:block">
                  <PhoenixLogo size="small" />
                </div>
                <h1 className="phone-text-lg md:text-2xl font-bold truncate bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  إدارة صالة فينيكس
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse phone-space-x-1">
              <Button variant="ghost" size="sm" className="phone-p-2 hover:bg-accent/50 relative">
                <Bell className="w-4 h-4" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse" />
              </Button>
              <Button variant="ghost" size="sm" className="phone-p-2 hidden phone:inline-flex hover:bg-accent/50">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 phone-p-4 overflow-auto bg-gradient-to-br from-background to-accent/5">
          <div className="max-w-full animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
