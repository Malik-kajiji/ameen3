import React from "react";

const timeSlots = [
  { label: "الفترة الصباحية", time: "(03:30 - 08:30)" },
  { label: "الفترة المسائية", time: "(08:30 - 10:30)" },
  { label: "الفترة الليلية", time: "(10:30 - 02:00)" },
];

const coachesSchedule = {
  "السبت": ["محمود شعبان", "محمد الساعدي", "عبد الرؤوف أعمار"],
  "الأحد": ["طه انديشة", "علي النبيع", "عبد الرؤوف أعمار"],
  "الإثنين": ["محمود شعبان", "محمد الساعدي", "عبد الرؤوف أعمار"],
  "الثلاثاء": ["طه انديشة", "علي النبيع", "عبد الرؤوف أعمار"],
  "الأربعاء": ["محمود شعبان", "محمد الساعدي", "عبد الرؤوف أعمار"],
  "الخميس": ["طه انديشة", "علي النبيع", "عبد الرؤوف أعمار"]
};

export default function CoachesSchedule({trainingDays}) {
  let updatedDays = {}
  trainingDays.forEach(e => {
    updatedDays[e.day] = [e.firstShift,e.secondShift,e.thirdShift]
  })

  return (
    <section id="coaches" className="bg-[#111] text-white py-20 px-4 rtl">
      <div className="max-w-[1300px] mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-10">
          <span className="text-[#a02727]">جدول المدربين</span> | Coaches' schedule
        </h2>

        <div className="overflow-x-auto rounded-xl">
          <table className="w-full border-separate border-spacing-3 min-w-[750px]" dir="rtl">
            <thead>
              <tr>
                <th className="bg-[#a02727] text-white px-4 py-3 rounded-md whitespace-nowrap">
                  الأيام / الفترة
                </th>
                {timeSlots.map((slot, i) => (
                  <th
                    key={i}
                    className={`${slot.label === "الفترة الليلية" ? "bg-black" : "bg-[#a02727]"} text-white px-4 py-3 rounded-md whitespace-nowrap`}
                  >
                    {slot.label}
                    <div className="text-xs text-white/70">{slot.time}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(updatedDays).map(([day, coaches], index) => (
                <tr key={index} className="text-center">
                  <td className="bg-[#333] text-white font-bold px-4 py-3 rounded-md whitespace-nowrap">
                    {day}
                  </td>
                  {coaches.map((coach, i) => (
                    <td
                      key={i}
                      className="bg-[#eee] text-black font-semibold px-4 py-3 rounded-md whitespace-nowrap transition duration-300 transform hover:scale-105 hover:bg-[#a02727] hover:text-white hover:shadow-[0_0_12px_#a02727]"
                    >
                      <button
                        className="w-full"
                        onClick={() => window.location.href = "/"}
                      >
                        {coach}
                      </button>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
