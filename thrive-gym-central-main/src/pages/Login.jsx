import { useEffect, useState } from "react";
import '../styles/login.scss'
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom'
import useLogin from "../hooks/useLogin";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate()
  const user = useSelector(state => state.userController.user)
  const { ownerLogin } = useLogin()

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await ownerLogin(username, password);
    } catch (err) {
      setError("اسم المستخدم أو كلمة المرور غير صحيحة");
    }
  };


  useEffect(()=> {
    if(user){
      navigate('/')
    }
  },[user])
  return (
    <form className="login-form" onSubmit={handleLogin}>
      
      <input
        className="login-input"
        type="text"
        placeholder="اسم المستخدم"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        className="login-input"
        type="password"
        placeholder="كلمة المرور"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="login-button" type="submit">دخول</button>
      {error && <p className="login-error">{error}</p>}
    </form>
  );
}
