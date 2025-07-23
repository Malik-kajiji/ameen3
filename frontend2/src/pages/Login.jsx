import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/LoginNavBar";
import Footer from "../components/Footer";
import useLogin from '../hooks/useLogin'
import { useDispatch } from "react-redux";
import { alertActions } from "../redux/AlertController";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useLogin()
  const [emailInput,setEmailInput] = useState('')
  const [passwordInput,setPasswordInput] = useState('')
  const dispatch = useDispatch()


  const handleLogin = async (e) => {
    e.preventDefault()
    if(emailInput === '' || passwordInput === ''){
      dispatch(alertActions.showAlert({msg:'تأكد من ملئ الحقول',type:'warrning'}))
    }else {
      login(emailInput,passwordInput)
    }
  }

  return (
    <div className="min-h-screen bg-[#111] text-white flex flex-col justify-between">
      <Navbar />

      <div className="flex-grow flex items-center justify-center px-4">
        <div className="bg-[#1a1a1a] w-full max-w-md rounded-2xl shadow-lg p-8 space-y-6">
          <h2 className="text-center text-3xl font-bold text-[#a02727]">
            تسجيل الدخول لحسابك
          </h2>

          <form className="space-y-4">
            <div>
              <label htmlFor="email" className="block mb-1 text-sm">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                id="email"
                placeholder="example@email.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-[#222] text-white border border-gray-600 focus:ring-2 focus:ring-[#a02727] outline-none"
              />
            </div>

            <div>
              <label htmlFor="password" className="block mb-1 text-sm">
                كلمة المرور
              </label>
              <input
                type="password"
                id="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2 rounded-md bg-[#222] text-white border border-gray-600 focus:ring-2 focus:ring-[#a02727] outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                className="accent-[#a02727]"
              />
              <label htmlFor="remember" className="text-sm">
                تذكرني
              </label>
            </div>

            <button
              onClick={handleLogin}
              type="submit"
              className="w-full py-2 bg-[#a02727] hover:bg-[#c23333] rounded-md text-white font-semibold transition duration-200"
            >
              تسجيل الدخول
            </button>
          </form>

          <button
            onClick={() => navigate("/")}
            className="w-full py-2 border border-[#a02727] text-[#a02727] hover:bg-[#a02727] hover:text-white rounded-md font-medium transition duration-200"
          >
            العودة إلى الرئيسية
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
