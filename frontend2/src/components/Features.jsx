import React from "react";
import icon1 from "../assets/images/icon1.png";
import icon2 from "../assets/images/icon2.png";
import icon3 from "../assets/images/icon3.png";


const features = [
  {
    title: "معدات حديثة",
    description:
      "جهزنا صالتنا بأحدث الأجهزة والمعدات الرياضية لضمان تجربة تدريب آمنة وفعالة، ومواكبة لأحدث تقنيات اللياقة البدنية.",
    icon: icon1,
  },
  {
    title: "متاحة على مدار الساعة",
    description:
      "نوفر لك حرية التمرين في أي وقت يناسبك، حيث تظل الصالة مفتوحة 24 ساعة / 7 أيام في الأسبوع، لتناسب جميع الجداول اليومية.",
    icon: icon2,
  },
  {
    title: "اشتراكات مرنة",
    description:
      "نوفر خطط اشتراك متنوعة ومرنة (شهري، ربع سنوي، نصف سنوي، سنوي) مع إمكانية الإيقاف المؤقت حسب الحاجة لتناسب أسلوب حياتك.",
    icon: icon3,
  },
];

export default function Features() {
  return (
    <section id="features" className="bg-[#111] dark:bg-[#111] py-20 px-6 rtl">
      <div className="max-w-[1300px] mx-auto text-center mb-16">
        <h2 className="text-white text-3xl md:text-4xl font-extrabold">
          <span className="text-white">ميزاتنا</span> | <span className="text-[#a02727]">Our Features</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-[1300px] mx-auto">
        {features.map((item, index) => (
          <div
            key={index}
            className="group bg-[#1a1a1a] hover:bg-[#a02727] transition-all duration-300 rounded-xl p-8 text-center shadow-md hover:shadow-[0_0_25px_#a02727] hover:scale-105 relative"
          >
            <img
              src={item.icon}
              alt={item.title}
              className="w-16 h-16 mx-auto mb-6 transition-transform duration-500 group-hover:scale-110"
            />
            <h3 className="text-white text-xl font-bold mb-3">{item.title}</h3>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">{item.description}</p>

            <button className="mt-4 bg-white text-[#a02727] font-bold py-2 px-4 rounded-md text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              تسجيل الدخول
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
