import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Wallet, Calendar, TrendingUp } from "lucide-react";

const QuickStats = ({ mainData }) => {
  if (!mainData) return null;

  const stats = [
    {
      title: "إجمالي المستخدمين",
      value: mainData.totalUsers || 0,
      icon: <Users className="h-6 w-6 text-blue-500" />,
      description: "مستخدم مسجل",
    },
    {
      title: "المستخدمون الجدد هذا الأسبوع",
      value: mainData.newUsersThisWeek || 0,
      icon: <Calendar className="h-6 w-6 text-green-500" />,
      description: "مستخدم جديد",
    },
    {
      title: "إجمالي الأرباح هذا الأسبوع",
      value: mainData.totalWeeklyProfits || 0,
      icon: <Wallet className="h-6 w-6 text-purple-500" />,
      description: "دينار ليبي",
    },
    {
      title: "متوسط الحضور",
      value: mainData.averageAttendance || 0,
      icon: <TrendingUp className="h-6 w-6 text-yellow-500" />,
      description: "حضور يومي",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            {stat.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default QuickStats;