import React from "react";
import logo2 from "../assets/images/logo2.png";
import icon_f from "../assets/images/icon_f.png";
import icon_i from "../assets/images/icon_i.png";
import icon_t from "../assets/images/icon_t.png";
import icon_m from "../assets/images/icon_m.png";


export default function Footer() {
    return (
      <footer className="bg-[#a02727] text-white py-8 px-4 rtl">
        <div className="max-w-[1300px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* الشعار */}
          <div className="w-32">
            <img src={logo2} alt="الورشة GYM" className="w-full" />
          </div>
  
          {/* الروابط */}
          {/* الروابط */}
<div className="flex flex-wrap gap-6 text-sm text-white/80 justify-center">
  <a href="#features" className="hover:text-white transition">ميزتنا</a>
  <a href="#coaches" className="hover:text-white transition">جدول المدربين</a>
  <a href="#packages" className="hover:text-white transition">باقات الاشتراك</a>
</div>

  
          {/* أيقونات التواصل */}
          <div className="flex gap-4">
            <a href="#"><img src={icon_f} alt="Facebook" className="w-5 hover:scale-125 transition duration-300" /></a>
            <a href="#"><img src={icon_i} alt="Instagram" className="w-5 hover:scale-125 transition duration-300" /></a>
            <a href="#"><img src={icon_t} alt="TikTok" className="w-5 hover:scale-125 transition duration-300" /></a>
            <a href="#"><img src={icon_m} alt="Map" className="w-5 hover:scale-125 transition duration-300" /></a>
          </div>
        </div>
      </footer>
    );
  }
  