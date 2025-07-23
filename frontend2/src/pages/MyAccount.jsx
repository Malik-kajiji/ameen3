import React, { useState } from "react";
import Navbar from "../components/LoginNavBar";
import Footer from "../components/Footer";
import ChartsSection from "../components/ChartsSection";
import SubscriptionHistory from "../components/SubscriptionHistory";
import { useSelector } from "react-redux";
import { useMyAccount } from "../hooks/useMyAccount";

export default function MyAccount() {
  const { sendStopRequest,changeData,allSubs,currentSub,attendanceChartData } = useMyAccount()
  const leftDays = Math.floor((new Date(currentSub?.endDate) - new Date()) / 1000 / 60 / 60 / 24)
  const [showModal, setShowModal] = useState(false);
  const [showPauseModal, setShowPauseModal] = useState(false);
  const user = useSelector(state => state.userController.user)
  const [stopRequestInputs,setStopRequestInputs] = useState({
    startDate:'',
    endDate:'',
    reason:''
  })

   const [changeDataInputs,setChangeDataInputs] = useState({
    phone:'',
    email:'',
    password:''
  })

  const handleChangeData = (e) => {
    const { name,value } = e.target
    setStopRequestInputs(prev => ({...prev,[name]:value}))
  }

  const handleChangeUserDataInput = (e) => {
    const { name,value } = e.target
    setChangeDataInputs(prev => ({...prev,[name]:value}))
  }

  const handleSendStopRequest = (e) => {
    e.preventDefault()
    const { startDate,endDate,reason } = stopRequestInputs
    sendStopRequest(startDate,endDate,reason,setShowPauseModal)
  }

  const handleChangeUserData = (e) => {
    e.preventDefault()
    const { phone,email,password } = changeDataInputs
    changeData(phone,email,password,setShowModal)
  }

  return (
    <div className="bg-[#111] min-h-screen text-white rtl">
      <Navbar />

      <div className="max-w-[1300px] mx-auto py-16 px-6 grid md:grid-cols-3 gap-8">
        {/* معلومات المشترك */}
        <div className="md:col-span-1">
          <div className="bg-[#1a1a1a] text-white p-6 rounded-xl shadow-lg h-full transition-transform duration-300 hover:scale-105">
            <h2 className="text-2xl font-bold mb-4 text-[#a02727] text-right">معلومات المشترك</h2>
            <ul className="space-y-3 text-sm leading-7 text-right">
              <li dir='rtl'><span className="font-semibold text-gray-300">الاسم:</span> {user?.username}</li>
              <li><span className="font-semibold text-gray-300">رقم الهاتف:</span> {user?.phoneNumber}</li>
              <li dir='rtl'><span className="font-semibold text-gray-300" >البريد الإلكتروني:</span> {user?.email}</li>
              <li><span className="font-semibold text-gray-300">رقم المشترك:</span> {user?.userNumber}</li>
            </ul>
          </div>
        </div>

        {/* الطلبات والمعلومات الإضافية */}
        <div className="md:col-span-2 flex flex-col gap-6">
          {/* كرت طلب الإيقاف */}
          <div className="bg-[#1a1a1a] p-5 rounded-xl shadow-md text-right transition-all duration-300 hover:ring-2 hover:ring-[#a02727]">
            <h3 className="text-xl font-bold mb-3 text-white">طلب إيقاف مؤقت</h3>
            <p className="text-sm text-gray-400 mb-4">يمكنك تقديم طلب لإيقاف الاشتراك بشكل مؤقت وسيتم مراجعته من قبل الإدارة.</p>
            <button
              onClick={() => setShowPauseModal(true)}
              className="bg-[#a02727] hover:bg-red-700 text-white py-2 px-4 rounded-md transition"
            >
              طلب الإيقاف
            </button>
          </div>

          {/* كرت تعديل البيانات */}
          <div className="bg-[#1a1a1a] p-5 rounded-xl shadow-md text-right transition-all duration-300 hover:ring-2 hover:ring-[#a02727]">
            <h3 className="text-xl font-bold mb-3 text-white">تعديل المعلومات الشخصية</h3>
            <p className="text-sm text-gray-400 mb-4">يتم تعديل رقم الهاتف أو البريد الإلكتروني فقط، ويجب إدخال كلمة المرور للتأكيد.</p>
            <button
              className="bg-[#a02727] hover:bg-red-700 text-white py-2 px-4 rounded-md transition"
              onClick={() => setShowModal(true)}
            >
              تعديل البيانات
            </button>
          </div>

          {/* كرت تفاصيل الاشتراك */}
          <div className="bg-[#1a1a1a] text-white p-6 rounded-xl shadow-md text-right border border-[#a02727] transition-transform duration-300 hover:scale-105">
            <h3 className="text-2xl font-bold mb-4 text-[#a02727]">تفاصيل الاشتراك</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-semibold text-gray-300">نوع الباقة:</p>
                <p className="text-white">{currentSub?.packageName}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-300">حالة الاشتراك:</p>
                <p className="text-green-400">
                  {currentSub?.status === 'active' && 'ساري'}
                  {currentSub?.status === 'paused' && 'متوقف'}
                  {currentSub?.status === 'ended' && 'منتهي'} 
                </p>
              </div>
              <div>
                <p className="font-semibold text-gray-300">رصيد الأيام المتبقية:</p>
                <p className="text-white">{leftDays} يوم</p>
              </div>
              <div>
                <p className="font-semibold text-gray-300">رصيد الإيقاف المؤقت:</p>
                <p className="text-white">{currentSub?.allowedPauseDays - currentSub?.usedPausedDays} أيام</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* المودال: تعديل البيانات */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-[#1a1a1a] p-6 rounded-xl w-[90%] max-w-md">
            <h2 className="text-xl font-bold mb-4 text-white text-right">تعديل البيانات</h2>
            <form className="space-y-4 text-right">
              <div>
                <label className="block text-sm text-white mb-1">رقم الهاتف</label>
                <input
                  type="text"
                  placeholder="أدخل رقم الهاتف"
                  className="w-full p-2 rounded-md bg-[#222] text-white border border-gray-500"
                  name='phone'
                  value={changeDataInputs.phone}
                  onChange={handleChangeUserDataInput}
                />
              </div>
              <div>
                <label className="block text-sm text-white mb-1">البريد الإلكتروني</label>
                <input
                  type="email"
                  placeholder="أدخل البريد الإلكتروني"
                  className="w-full p-2 rounded-md bg-[#222] text-white border border-gray-500"
                  name='email'
                  value={changeDataInputs.email}
                  onChange={handleChangeUserDataInput}
                />
              </div>
              <div>
                <label className="block text-sm text-white mb-1">كلمة المرور الحالية <span className="text-red-500">*</span></label>
                <input
                  type="password"
                  placeholder="أدخل كلمة المرور لتأكيد التعديل"
                  required
                  className="w-full p-2 rounded-md bg-[#222] text-white border border-gray-500"
                  name='password'
                  value={changeDataInputs.password}
                  onChange={handleChangeUserDataInput}
                />
              </div>
              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="text-gray-300 hover:text-white"
                >
                  إلغاء
                </button>
                <button className="bg-[#a02727] hover:bg-red-700 text-white py-2 px-4 rounded-md" onClick={handleChangeUserData}>
                  حفظ التغييرات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* المودال: طلب الإيقاف */}
      {showPauseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-[#1a1a1a] p-6 rounded-xl w-[90%] max-w-md text-right">
            <h2 className="text-xl font-bold mb-4 text-white">طلب إيقاف مؤقت</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm text-white mb-1">تاريخ البداية</label>
                <input
                  type="date"
                  className="w-full p-2 rounded-md bg-[#222] text-white border border-gray-500"
                  name='startDate'
                  value={stopRequestInputs.startDate}
                  onChange={handleChangeData}
                />
              </div>
              <div>
                <label className="block text-sm text-white mb-1">تاريخ النهاية</label>
                <input
                  type="date"
                  className="w-full p-2 rounded-md bg-[#222] text-white border border-gray-500"
                  name='endDate'
                  value={stopRequestInputs.endDate}
                  onChange={handleChangeData}
                />
              </div>
              <div>
                <label className="block text-sm text-white mb-1">السبب (اختياري)</label>
                <textarea
                  rows="3"
                  placeholder="اكتب سبب الإيقاف إن وُجد..."
                  className="w-full p-2 rounded-md bg-[#222] text-white border border-gray-500"
                  name='reason'
                  value={stopRequestInputs.reason}
                  onChange={handleChangeData}
                ></textarea>
              </div>
              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={() => setShowPauseModal(false)}
                  className="text-gray-300 hover:text-white"
                >
                  إلغاء
                </button>
                <button className="bg-[#a02727] hover:bg-red-700 text-white py-2 px-4 rounded-md" onClick={handleSendStopRequest}>
                  إرسال الطلب
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <ChartsSection currentSub={currentSub} leftDays={leftDays} attendanceChartData={attendanceChartData}/>
      <SubscriptionHistory allSubs={allSubs} />
      <Footer />
    </div>
  );
}
