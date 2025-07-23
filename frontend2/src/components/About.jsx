import React from "react";
import aboutImage from "../assets/images/b.png";

const About = () => {
  return (
    <section className="bg-[#1a1a1a] text-white py-20 px-6 rtl">
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* ✅ النص والعنوان على اليسار */}
        <div className="order-1 text-center md:text-end md:order-1">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 text-[#a02727]">
            مرحّب بيك في عالم الورشة
          </h2>
          <p className="text-lg leading-loose text-gray-800 dark:text-gray-300" dir="rtl">
            في قلب طرابلس، وتحديدًا في حي المشتل، تلقى "الورشة GYM"… مش بس صالة، بل عالم متكامل للّي يبي يغيّر من نفسه ويعيش تجربة رياضية حقيقية.
            الجو داخل الورشة مختلف – تحس بالحماس من أول ما تدخل، وتشوف الاهتمام بكل تفصيل: من نظافة المكان، لتنوع المعدات، لتنظيم الوقت وحتى طريقة التعامل.
            نخدمو 24 ساعة في اليوم، لأننا نعرفوا إن كل واحد عنده توقيته الخاص، ومعنا، التمرين ما يكونش مرتبط بالساعة.
          </p>
        </div>

        {/* ✅ الصورة على اليمين مع حركة وإضاءة */}
        <div className="order-2 md:order-2 flex justify-end">
        <img
  src={aboutImage}
  alt="نبذة عن الورشة"
  className="w-full max-w-md md:max-w-lg rounded-lg object-contain animate-floating transition-all duration-300 hover:filter hover:drop-shadow-[0_0_20px_#a02727]"
/>

        </div>
      </div>
    </section>
  );
};

export default About;
