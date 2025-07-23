import React from "react";
import icon4 from "../assets/images/icon4.png"; 
const packages1 = [
  {
    title: "الاشتراك الشهري",
    price: "170",
    period: "<b>صالحة 30 يوم</b>",
    benefits: [
      "دخول 24 ساعة",
      "معدات عالمية المستوى",
      "فريق مدربين محترف",
      "جيب صاحبك معاك <b>(يومين)</b>",
      "مرونة في الاشتراك <b>(أسبوع)</b> لمرة واحدة"
    ]
  },
  {
    title: "اشتراك 3 أشهر",
    price: "450",
    period: "<b>صالحة 90 يوم</b>",
    benefits: [
      "دخول 24 ساعة",
      "معدات عالمية المستوى",
      "فريق مدربين محترف",
      "جيب صاحبك معاك <b>(يومين)</b>",
      "مرونة في الاشتراك <b>(10 أيام)</b> 3 فترات كحد أقصى"
    ]
  },
  {
    title: "اشتراك 6 أشهر",
    price: "750",
    period: "<b>صالحة 180 يوم</b>",
    benefits: [
      "دخول 24 ساعة",
      "معدات عالمية المستوى",
      "فريق مدربين محترف",
      "جيب صاحبك معاك <b>(يومين)</b>",
      "مرونة في الاشتراك <b>(أسبوعين)</b> 3 فترات كحد أقصى"
    ]
  },
  {
    title: "الاشتراك السنوي",
    price: "1200",
    period: "<b>صالحة 365 يوم</b>",
    benefits: [
      "دخول 24 ساعة",
      "معدات عالمية المستوى",
      "فريق مدربين محترف",
      "جيب صاحبك معاك <b>(يومين)</b>",
      "مرونة في الاشتراك <b>(شهر)</b> 6 فترات كحد أقصى"
    ]
  }
];

const ordered = [0, 1, 2, 3];

export default function PackagesSection({packages}) {
  return (
    <section id="packages" className="bg-[#111] text-white py-20 px-4 rtl">
      <div className="max-w-[1300px] mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
          <span className="text-[#a02727]">باقات الاشتراك</span> | Subscription packages
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 direction-rtl">
          {packages.map((e,i) => {
            const pkg = e;
            return (
                <div
  key={i}
  className="bg-[#1a1a1a] animate-fade-in-up hover:scale-[1.03] transition-all duration-500 rounded-xl p-6 border border-transparent hover:border-[#a02727] shadow-[0_0_10px_#a0272733]"
>

              
<h3 className="text-white/70 text-lg font-bold mb-2 text-right">{pkg.title}</h3>
<div className="text-4xl font-extrabold text-white mb-2 text-right">{pkg.price} د.ل</div>

                <button className="bg-[#a02727] hover:bg-[#c23333] transition-all duration-300 text-white font-bold py-2 rounded-md w-full mb-4 hover:scale-105">
  اشترك الآن
</button>

                <ul className="space-y-2 text-sm text-white rtl text-right">
  <li className="flex flex-row-reverse items-start gap-2">
    <img src={icon4} alt="✔" className="w-4 h-4 mt-1" />
    <span dangerouslySetInnerHTML={{ __html: `<b>صالحة ${pkg.period} يوم</b>` }} />
  </li>

  {pkg.benefits.map((b, idx) => (
    <li key={idx} className="flex flex-row-reverse items-start gap-2">
      <img src={icon4} alt="✔" className="w-4 h-4 mt-1" />
      <span dangerouslySetInnerHTML={{ __html: b }} />
    </li>
  ))}
</ul>

              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
