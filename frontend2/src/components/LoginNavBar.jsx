import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/logo1.png";
import { useSelector } from "react-redux";

const Navbar = () => {
  const user = useSelector(state => state.userController.user)
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const linkRefs = useRef([]);
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { label: "الرئيسية", target: "top" },
    { label: "مميزاتنا", target: "features" },
    { label: "جدول المدربين", target: "coaches" },
    { label: "باقات الاشتراك", target: "packages" },
  ];

  useEffect(() => {
    const current = linkRefs.current[activeIndex];
    if (current && current.offsetLeft && current.offsetWidth) {
      const { offsetLeft, offsetWidth } = current;
      setIndicatorStyle({
        left: offsetLeft + offsetWidth / 2 - 3 + "px",
      });
    }
  }, [activeIndex, menuOpen]);

  const scrollToId = (id, index) => {
    if (id === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const section = document.getElementById(id);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
    setActiveIndex(index);
    setMenuOpen(false);
  };

  return (
    <header className="bg-[#1a1a1a] py-6 px-8 rtl sticky top-0 z-50 shadow-md">
      <div className="max-w-[1300px] mx-auto flex items-center justify-start gap-8">
        {/* الروابط والزر */}
        <div className="hidden md:flex items-center gap-8 relative order-2">
          <ul className="flex gap-8 list-none p-0 m-0 relative">
            {links.map((link, index) => (
              <li key={index}>
                <button
                  ref={(el) => (linkRefs.current[index] = el)}
                  className={`text-white font-bold text-lg pb-2 cursor-pointer ${
                    activeIndex === index ? "text-[#a02727]" : ""
                  }`}
                  onClick={() => navigate("/")}
                >
                  {link.label}
                </button>
              </li>
            ))}
            <div
              className="absolute bottom-0 w-[6px] h-[6px] bg-[#a02727] rounded-full transition-all duration-300 md:block hidden"
              style={indicatorStyle}
            />
          </ul>

          {user?
            <button
              onClick={() => navigate("/myaccount")}
              className="bg-[#a02727] hover:bg-[#c03030] text-white px-6 py-3 text-base rounded-md font-bold text-sm"
            >
              حسابي
            </button>
          :
            <button
              onClick={() => navigate("/login")}
              className="bg-[#a02727] hover:bg-[#c03030] text-white px-6 py-3 text-base rounded-md font-bold text-sm"
            >
              تسجيل الدخول
            </button>
          }
        </div>

        {/* الشعار */}
        <a href="#" className="order-1 me-auto">
          <img src={logo} alt="Logo" className="h-[50px]" />
        </a>

        {/* زر الموبايل */}
        <div className="md:hidden order-3">
          <button className="text-white" onClick={() => setMenuOpen(!menuOpen)}>
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* القائمة المنسدلة للموبايل */}
      {menuOpen && (
        <div className="md:hidden mt-3 space-y-3 text-white text-sm font-medium">
          {links.map((link, index) => (
            <button
              key={index}
              onClick={() => scrollToId(link.target, index)}
              className={`block w-full text-right px-4 ${
                activeIndex === index ? "text-[#a02727]" : ""
              }`}
            >
              {link.label}
            </button>
          ))}
          {user?
            <button
              onClick={() => navigate("/myaccount")}
              className="block w-full text-right px-4 bg-[#a02727] hover:bg-[#c03030] text-white py-2 rounded-md font-bold"
            >
              حسابي
            </button>
          :
            <button
              onClick={() => navigate("/login")}
              className="block w-full text-right px-4 bg-[#a02727] hover:bg-[#c03030] text-white py-2 rounded-md font-bold"
            >
              تسجيل الدخول
            </button>
          }
        </div>
      )}
    </header>
  );
};

export default Navbar;
