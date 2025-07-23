import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home";
import LoginPage from "./pages/Login";
import MyAccount from "./pages/MyAccount";
import Alert from './components/Alert';

function App() {
  return (
    <>
      <Alert />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/myaccount" element={<MyAccount />} />
      </Routes>
    </>
  );
}

export default App;
