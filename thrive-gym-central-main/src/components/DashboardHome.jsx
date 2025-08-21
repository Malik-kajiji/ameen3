import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { alertActions } from '../redux/AlertController';
import useHomePage from "@/hooks/useHomePage";
import QuickStats from "@/components/QuickStats";
import ProfitChart from "@/components/charts/ProfitChart";
import PackageChart from "@/components/charts/PackageChart";
import AttendanceChart from "@/components/charts/AttendanceChart";

const DashboardHome = ({ onNavigate }) => {
  const dispatch = useDispatch();

  const {
    mainData,
    timeframeData,
    selectedTimeframe,
    changeTimeframe,
    loading,
    error,
    admin
  } = useHomePage();

  console.log("Main Data:", mainData);

  // Error handling
  useEffect(() => {
    if (error) {
      dispatch(alertActions.showAlert({ msg: error.message, type: "error" }));
    }
  }, [error, dispatch]);

  // Mapping for Arabic labels
  const reverseMapping = {
    week: "هذا الأسبوع",
    month: "هذا الشهر",
    year: "هذا العام"
  };

  const selectedPeriod = reverseMapping[selectedTimeframe];

  const handleTimeframeClick = (label) => {
    const mapping = {
      "هذا الأسبوع": "week",
      "هذا الشهر": "month",
      "هذا العام": "year"
    };
    changeTimeframe(mapping[label]);
  };

  return (
    <div className="dashboard-home">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">لوحة التحكم</h1>
        <div className="flex gap-2">
          {["هذا الأسبوع", "هذا الشهر", "هذا العام"].map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? "default" : "outline"}
              size="sm"
              onClick={() => handleTimeframeClick(period)}
              className={selectedPeriod === period ? "btn-gradient" : ""}
            >
              {period}
            </Button>
          ))}
        </div>
      </div>

      {/* Loading state */}
      {(loading || !admin) && (
        <div className="text-center py-10 text-muted-foreground">
          {loading ? "جارٍ تحميل البيانات..." : "جارٍ تسجيل الدخول كمسؤول..."}
        </div>
      )}

      {/* Content */}
      {!loading && admin && (
        <div className="space-y-8">
          {/* Quick Stats */}
          <QuickStats mainData={mainData} />

          {/* Profit Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ProfitChart 
              data={timeframeData?.profitByTimeUnit || mainData?.profitByDay || []} 
              title="الأرباح حسب اليوم" 
            />
            
            {/* Package Chart */}
            <PackageChart 
              data={mainData?.packagePercentage || []} 
              title="نسبة أنواع الاشتراكات" 
            />
          </div>

          {/* Attendance Chart */}
          <AttendanceChart 
            data={timeframeData?.attendanceByTimeUnit || mainData?.attendanceByDay || []} 
            title="الحضور حسب اليوم" 
          />

          {/* Membership Types */}
          <div className="bg-gray-900 p-6 rounded-xl">
            <h2 className="mb-4 text-white">أنواع الاشتراكات</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {mainData?.packagePercentage?.map((pkg, idx) => (
                <div key={idx} className="p-4 bg-gray-800 rounded-lg">
                  <h3 className="text-lg font-semibold text-white">{pkg.packageName}</h3>
                  <div className="mt-2">
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${pkg.percentage}%` }}
                      ></div>
                    </div>
                    <p className="text-right text-sm text-gray-300 mt-1">{pkg.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activities - Simplified */}
          <div className="bg-gray-900 p-6 rounded-xl">
            <h2 className="mb-4 text-white">ملخص البيانات</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-800 rounded-lg">
                <h3 className="text-lg font-semibold text-white">إجمالي الاشتراكات المنتهية</h3>
                <p className="text-2xl font-bold text-yellow-400">
                  {mainData?.endedSubscriptionsThisMonth || timeframeData?.endedSubscriptionsInTimeframe || 0}
                </p>
              </div>
              <div className="p-4 bg-gray-800 rounded-lg">
                <h3 className="text-lg font-semibold text-white">إجمالي المستخدمين</h3>
                <p className="text-2xl font-bold text-green-400">
                  {mainData?.totalUsers || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardHome;
