import React, { useState } from "react";
import { FaFilePdf, FaFileExcel, FaEye } from "react-icons/fa";

const SubscriptionHistory = ({allSubs}) => {
  const [filter, setFilter] = useState("all");
  const [selectedSubscription, setSelectedSubscription] = useState(null);

  // console.log(allSubs[0].startDate)

  const subscriptions = [
    {
      type: "اشتراك 3 أشهر",
      from: "2024-12-01",
      to: "2025-03-01",
      price: "450 د.ل",
      status: "active",
    },
    {
      type: "اشتراك شهري",
      from: "2025-03-02",
      to: "2025-04-01",
      price: "170 د.ل",
      status: "ended",
    },
  ];

  const filtered =
    filter === "all" ? allSubs : allSubs.filter((s) => s.status === filter);

  return (
    <div className="bg-[#111] text-white py-10 px-4 md:px-8 min-h-[600px] rtl">
      <div className="max-w-[1300px] mx-auto">
        {/* رأس الجدول وأزرار التحكم */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-xl font-bold">سجل الاشتراكات</h2>

          <div className="flex items-center gap-3">
            <select
              className="bg-[#1a1a1a] border border-[#333] text-sm rounded px-3 py-2 focus:outline-none"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">عرض الكل</option>
              <option value="active">ساري</option>
              <option value="ended">منتهي</option>
            </select>

            <button className="flex items-center gap-2 bg-red-700 hover:bg-red-800 px-4 py-2 rounded text-sm">
              <FaFilePdf /> PDF
            </button>
            <button className="flex items-center gap-2 bg-green-700 hover:bg-green-800 px-4 py-2 rounded text-sm">
              <FaFileExcel /> Excel
            </button>
          </div>
        </div>

        {/* جدول الاشتراكات */}
        <div className="relative overflow-x-auto rounded-lg shadow-lg border border-[#333] bg-[#1a1a1a]">
          <table className="w-full text-sm text-right rtl text-white min-h-[300px]">
            <thead className="text-xs uppercase border-b border-[#444] text-gray-400">
              <tr>
                <th className="px-6 py-4">نوع الباقة</th>
                <th className="px-6 py-4">من</th>
                <th className="px-6 py-4">إلى</th>
                <th className="px-6 py-4">السعر</th>
                <th className="px-6 py-4">الحالة</th>
                <th className="px-6 py-4 text-center">التفاصيل</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222]">
              {filtered.map((sub, index) => (
                <tr key={index} className="hover:bg-[#1f1f1f] transition duration-300">
                  <td className="px-6 py-5 font-bold">{sub.packageName}</td>
                  <td className="px-6 py-5">{new Date(sub.startDate).toLocaleDateString()}</td>
                  <td className="px-6 py-5" >{new Date(sub.endDate).toLocaleDateString()}</td>
                  <td className="px-6 py-5" dir="rtl">{sub.packagePrice} د.ل</td>
                  <td className="px-6 py-5">
                    <span
                      className={`text-xs font-medium px-3 py-1 rounded-full ${
                        (sub.status === "active" || "paused")
                          ? "bg-green-600 text-white"
                          : "bg-gray-600 text-white"
                      }`}
                    >
                      {(sub.status === "active" || "paused") ? "ساري" : "منتهي"}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <button
                      onClick={() => setSelectedSubscription(sub)}
                      className="text-blue-500 hover:underline flex items-center justify-center gap-1"
                    >
                      <FaEye /> عرض
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-500">
                    لا توجد نتائج حالياً.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* نافذة التفاصيل */}
      {selectedSubscription && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-[#1a1a1a] border border-[#333] p-6 rounded-lg w-[90%] max-w-md text-white">
            <h3 className="text-xl font-bold mb-4">تفاصيل الاشتراك</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <span className="text-gray-400">نوع الباقة:</span>{" "}
                {selectedSubscription.packageName}
              </li>
              <li>
                <span className="text-gray-400">الفترة:</span>{" "}
                من {new Date(selectedSubscription.startDate).toLocaleDateString()} إلى {new Date(selectedSubscription.endDate).toLocaleDateString()}
              </li>
              <li>
                <span className="text-gray-400">السعر:</span>{" "}
                {selectedSubscription.packagePrice} د.ل
              </li>
              <li>
                <span className="text-gray-400">الحالة:</span>{" "}
                {(selectedSubscription.status === "active" || selectedSubscription.status === "paused") ? "ساري" : "منتهي"}
              </li>
            </ul>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setSelectedSubscription(null)}
                className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionHistory;
