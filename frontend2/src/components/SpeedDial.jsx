import React, { useEffect, useRef, useState } from "react";
import icon7 from "../assets/images/icon7.png";
import icon6 from "../assets/images/icon6.png";
import icon5 from "../assets/images/icon5.png";
import icon8 from "../assets/images/icon8.png";

export default function SpeedDial() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  const scrollToId = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={menuRef} className="fixed end-6 bottom-6 z-50">
      <div
        className={`flex flex-col items-center mb-4 space-y-3 transition-all duration-500 ease-in-out ${
          isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 pointer-events-none translate-y-4"
        }`}
      >
        {/* زر: ميزتنا */}
        <div className="relative group">
          <button
            onClick={() => scrollToId("features")}
            className="w-[60px] h-[60px] bg-white rounded-full shadow-lg hover:scale-110 transition"
          >
            <img src={icon7} alt="features" className="w-6 mx-auto" />
          </button>
          <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black text-white text-xs px-3 py-1 rounded opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300">
            ميزتنا
          </span>
        </div>

        {/* زر: جدول المدربين */}
        <div className="relative group">
          <button
            onClick={() => scrollToId("coaches")}
            className="w-[60px] h-[60px] bg-white rounded-full shadow-lg hover:scale-110 transition"
          >
            <img src={icon6} alt="coaches" className="w-6 mx-auto" />
          </button>
          <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black text-white text-xs px-3 py-1 rounded opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300">
            جدول المدربين
          </span>
        </div>

        {/* زر: باقات الاشتراك */}
        <div className="relative group">
          <button
            onClick={() => scrollToId("packages")}
            className="w-[60px] h-[60px] bg-white rounded-full shadow-lg hover:scale-110 transition"
          >
            <img src={icon5} alt="packages" className="w-6 mx-auto" />
          </button>
          <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black text-white text-xs px-3 py-1 rounded opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300">
            باقات الاشتراك
          </span>
        </div>

        {/* زر: العودة للأعلى */}
        <div className="relative group">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="w-[60px] h-[60px] bg-white rounded-full shadow-lg hover:scale-110 transition"
          >
            <img src={icon8} alt="top" className="w-6 mx-auto" />
          </button>
          <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black text-white text-xs px-3 py-1 rounded opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300">
            إلى الأعلى
          </span>
        </div>
      </div>

      {/* زر الفتح والإغلاق */}
      <button
        onClick={toggleMenu}
        type="button"
        className="flex items-center justify-center text-white bg-[#a02727] rounded-full w-[60px] h-[60px] hover:bg-red-800 focus:ring-4 focus:ring-red-300 focus:outline-none"
      >
        <svg
          className={`w-6 h-6 transition-transform duration-300 ${
            isOpen ? "rotate-45" : "rotate-0"
          }`}
          fill="none"
          viewBox="0 0 18 18"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 1v16M1 9h16"
          />
        </svg>
        <span className="sr-only">فتح القائمة</span>
      </button>
    </div>
  );
}