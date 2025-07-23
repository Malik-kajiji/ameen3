import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import About from "../components/About";
import Features from "../components/Features";
import CoachesSchedule from "../components/CoachesSchedule";
import Packages from "../components/Packages";
import Footer from "../components/Footer";
import SpeedDial from "../components/SpeedDial";
import { useHomePage } from '../hooks/useHomePage'

const HomePage = () => {
  const { trainingDays,packages } = useHomePage()

  return (
    <>
      <Navbar />
      <Hero />
      <div className="h-20 w-full bg-[#1a1a1a] flex justify-center items-center">
        <div className="w-[80%] h-[1px] bg-[#a02727] animate-pulse"></div>
      </div>
      <About />
      <div id="features"><Features /></div>
      <div id="coaches"><CoachesSchedule trainingDays={trainingDays} /></div>
      <div id="packages"><Packages packages={packages}/></div>
      <Footer />
      <SpeedDial />
    </>
  );
};

export default HomePage;

