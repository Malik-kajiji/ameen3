import React from "react";
import { useNavigate } from "react-router-dom";
import heroImage from "../assets/images/a.png";
import { useDispatch } from "react-redux";
import { alertActions } from '../redux/AlertController'

const Hero = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()

  return (
    <section className="bg-[#1a1a1a] text-white py-20 px-6 md:py-28 rtl">
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* ✅ النصوص والزر */}
        <div className="order-1 md:order-2 text-center md:text-end">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-snug mb-4">
            جي وقــــت التغير <br />
            <span className="text-[#a02727]">شن مزال تستنى ؟</span>
          </h1>
          <p className="text-lg text-white/80 mb-6 leading-loose" dir="rtl" onClick={()=>console.log('dfgfd')}>
          {/* <p className="text-lg text-white/80 mb-6 leading-loose" dir="rtl" onClick={()=>dispatch(alertActions.showAlert({msg:'test',type:'warrning'}))}> */}
            في قلب طرابلس، وتحديدًا في حي المشتل، تلقى "الورشة GYM"… مش بس صالة، بل عالم متكامل للّي يبي يغيّر من نفسه ويعيش تجربة رياضية حقيقية. الجو داخل الورشة
          </p>
          <button
            onClick={() => navigate("/login")}
            className="bg-[#a02727] hover:bg-[#861c1c] text-white px-6 py-3 rounded-md font-bold text-base transition"
          >
            سجل دخولك
          </button>
        </div>

        {/* ✅ الصورة */}
        <div className="order-2 md:order-1 flex justify-center">
          <img
            src={heroImage}
            alt="صورة الورشة"
            className="w-full max-w-lg md:max-w-xl object-contain animate-floating transition-all duration-500 hover:drop-shadow-[0_0_35px_#a02727]"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
