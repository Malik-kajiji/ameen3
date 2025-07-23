
import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import DashboardHome from '@/components/DashboardHome';
import MembersManagement from '@/components/MembersManagement';
import AddMember from '@/components/AddMember';
import EmployeesManagement from '@/components/EmployeesManagement';
import FinancialManagement from '@/components/FinancialManagement';
import AssetsManagement from '@/components/AssetsManagement';
import ReportsManagement from '@/components/ReportsManagement';
import NotificationsManagement from '@/components/NotificationsManagement';
import PauseRequestsManagement from '@/components/PauseRequestsManagement';
import BiometricManagement from '@/components/BiometricManagement';
import WebsiteManagement from '@/components/WebsiteManagement';
import AdminManagement from '@/components/AdminManagement';
import Settings from '@/components/Settings';
import { Provider } from 'react-redux'
import { store } from '../config/store'
import Alert from '../components/Alert';
import UserState from '../components/UserState';

const Index = () => {
  const [activeView, setActiveView] = useState('dashboard');

  const renderContent = () => {
    switch (activeView) {
      case 'members':
        return <MembersManagement onNavigate={setActiveView} />;
      case 'add-member':
        return <AddMember onNavigate={setActiveView} />;
      case 'employees':
        return <EmployeesManagement />;
      case 'financial':
        return <FinancialManagement />;
      case 'assets':
        return <AssetsManagement />;
      case 'reports':
        return <ReportsManagement />;
      case 'notifications':
        return <NotificationsManagement />;
      case 'pause-requests':
        return <PauseRequestsManagement />;
      case 'biometric':
        return <BiometricManagement />;
      case 'website':
        return <WebsiteManagement />;
      case 'admin':
        return <AdminManagement />;
      case 'settings':
        return <Settings />;
      default:
        return <DashboardHome onNavigate={setActiveView} />;
    }
  };

  return (  
      <DashboardLayout activeView={activeView} onNavigate={setActiveView}>
        {renderContent()}
      </DashboardLayout>
  );
};

export default Index;
