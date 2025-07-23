import React from "react";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function ChartsSection({currentSub,leftDays,attendanceChartData}) {
  const percentageCompleted = Math.round(((currentSub?.packagePeriod - leftDays) / currentSub?.packagePeriod) * 100);

  const radialData = [
    {
      name: "Progress",
      uv: Math.round((leftDays / currentSub?.packagePeriod) * 100),
      fill: "#a02727",
    },
  ];

  const attendanceData = [
    { day: "السبت", value: 1 },
    { day: "الأحد", value: 1 },
    { day: "الإثنين", value: 1 },
    { day: "الثلاثاء", value: 0 },
    { day: "الأربعاء", value: 1 },
    { day: "الخميس", value: 1 },
    { day: "الجمعة", value: 0 },
  ];

  return (
    <div className="max-w-[1300px] mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-6 my-12 text-white">
      {/* عدد الأيام المتبقية */}
      <div className="bg-[#1a1a1a] p-6 rounded-xl shadow-lg flex flex-col items-center text-center transition transform hover:scale-105 duration-500 ease-in-out">
        <h3 className="text-base font-semibold mb-4 animate-fade-in">عدد الأيام المتبقية</h3>
        <div className="relative w-[100px] h-[100px] animate-bounce-slow">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="75%"
              outerRadius="100%"
              barSize={10}
              data={radialData}
              startAngle={90}
              endAngle={-270}
            >
              <RadialBar minAngle={15} clockWise dataKey="uv" background />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-md font-bold text-white animate-pulse">{leftDays} يوم</span>
          </div>
        </div>
      </div>

      {/* شريط رصيد الإيقاف المؤقت */}
      <div className="bg-[#1a1a1a] p-6 rounded-xl shadow-lg flex flex-col justify-center transition duration-500 ease-in-out hover:shadow-xl">
        <h3 className="text-base font-semibold mb-4 animate-fade-in">رصيد الإيقاف المؤقت</h3>
        <div className="w-full bg-gray-700 rounded-full h-5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-[#a02727] to-[#c23333] h-5 rounded-full transition-all duration-700 ease-in-out animate-grow"
            style={{ width: `${(currentSub?.usedPausedDays / currentSub?.allowedPauseDays) * 100}%` }}
          ></div>
        </div>
        <p className="text-sm mt-2 text-right font-bold">{currentSub?.usedPausedDays} / {currentSub?.allowedPauseDays} يوم</p>
      </div>

      {/* نسبة الإكمال */}
      <div className="bg-[#1a1a1a] p-6 rounded-xl shadow-lg flex flex-col items-center transition hover:scale-105 duration-500">
        <h3 className="text-base font-semibold mb-4 animate-fade-in">نسبة إكمال الاشتراك</h3>
        <div className="relative w-[100px] h-[100px]">
          <svg className="w-full h-full">
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="#333"
              strokeWidth="10"
              fill="none"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="#a02727"
              strokeWidth="10"
              strokeDasharray={`${percentageCompleted * 2.83} ${283 - percentageCompleted * 2.83}`}
              strokeLinecap="round"
              fill="none"
              transform="rotate(-90 50 50)"
            />
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dy=".3em"
              className="text-white font-bold text-lg animate-fade-in"
              style={{'fill':'white'}}
            >
              {percentageCompleted}%
            </text>
          </svg>
        </div>
      </div>

      {/* رسم تفاعلي يغطي كامل الصف */}
      <div className="bg-[#1a1a1a] p-6 rounded-xl shadow-lg col-span-1 md:col-span-3 mt-6">
        <h3 className="text-base font-semibold mb-4">رسم بياني شامل لنشاط الأسبوع</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={attendanceChartData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a02727" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#a02727" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="day" stroke="#ccc" />
            <Tooltip />
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#a02727"
              fillOpacity={1}
              fill="url(#colorUv)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}