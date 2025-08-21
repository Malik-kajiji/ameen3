import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import NotFound from "./pages/NotFound";
import RedirectToDashboard from "@/components/RedirectToDashboard";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardHome from "@/components/DashboardHome";
import EmployeesManagement from "@/components/EmployeesManagement";
import FinancialManagement from "@/components/FinancialManagement";
import AssetsManagement from "@/components/AssetsManagement";
import PauseRequestsManagement from "@/components/PauseRequestsManagement";
import MembersManagement from "@/components/MembersManagement";
import NotificationsManagement from "@/components/NotificationsManagement";
import TrainersSection from "@/components/TrainersSection";
import { WebsiteManagement } from "@/components/WebsiteManagement";
import Settings from "@/components/Settings";
import AdminManagement from "@/components/AdminManagement";
import BiometricManagement from "@/components/BiometricManagement";
import AddMember from "@/components/AddMember";
import ReportsManagement from "@/components/ReportsManagement";
import DashboardLayout from "@/components/DashboardLayout";
import Alert from "./components/Alert";
import UserState from "./components/UserState";
import { Provider } from "react-redux";
import { store } from "./config/store";
import Login from "./pages/Login";


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Alert />
        <BrowserRouter>
        <UserState />
          <Routes>

            <Route path="/" element={<RedirectToDashboard />} />
            <Route path="login" element={<Login />} />

            <Route element={<ProtectedRoute />}>
              <Route path="dashboard" element={<DashboardLayout />}>
                <Route index element={<DashboardHome />} />
                <Route path="employees" element={<EmployeesManagement />} />
                <Route path="financial" element={<FinancialManagement />} />
                <Route path="assets" element={<AssetsManagement />} />
                <Route path="pause-requests" element={<PauseRequestsManagement />} />
                <Route path="members" element={<MembersManagement />} />
                <Route path="add-member" element={<AddMember />} />
                <Route path="notifications" element={<NotificationsManagement />} />
                <Route path="biometric" element={<BiometricManagement />} />
                <Route path="reports" element={<ReportsManagement />} />
                <Route path="website" element={<WebsiteManagement />} />
                <Route path="admin" element={<AdminManagement />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Route>



            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;
