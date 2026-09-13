import React from "react";
import { FaTrophy, FaClock, FaUserGraduate } from "react-icons/fa";
import { GiMoneyStack } from "react-icons/gi";
import { BiBookReader } from "react-icons/bi";

const CourseChallengeAnnouncement = () => {
  return (
    <div className="max-w-2xl mx-auto p-8 bg-white border border-slate-200 rounded-3xl shadow-sm text-slate-900 relative overflow-hidden">
      <div className="flex flex-col items-center text-center relative z-10">
        <FaTrophy className="text-8xl text-amber-500 mb-4 animate-bounce drop-shadow" style={{ animationDuration: '3s' }} />
        <h2 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">
          Win $100 and Exciting Rewards!
        </h2>
        <p className="text-slate-600 font-medium text-sm">
          Be the first to complete our{" "}
          <span className="font-bold text-indigo-600">
            Fullstack Web Development Course (MERN)
          </span>{" "}
          and win amazing prizes!
        </p>
      </div>

      <div className="flex justify-around items-center mt-8 mb-6 relative z-10">
        <div className="flex flex-col items-center group">
          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 mb-2 transition-transform duration-200 group-hover:scale-105">
            <GiMoneyStack className="text-4xl text-emerald-600" />
          </div>
          <span className="text-xs font-bold text-slate-700">$100 Cash Prize</span>
        </div>
        <div className="flex flex-col items-center group">
          <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 mb-2 transition-transform duration-200 group-hover:scale-105">
            <BiBookReader className="text-4xl text-indigo-600" />
          </div>
          <span className="text-xs font-bold text-slate-700">1 Free Course</span>
        </div>
        <div className="flex flex-col items-center group">
          <div className="p-3 bg-rose-50 rounded-2xl border border-rose-200 mb-2 transition-transform duration-200 group-hover:scale-105">
            <FaUserGraduate className="text-4xl text-rose-600" />
          </div>
          <span className="text-xs font-bold text-slate-700">3 Days Live Support</span>
        </div>
      </div>

      <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl my-4 text-center relative z-10">
        <h3 className="font-bold mb-1 flex items-center justify-center text-slate-900 text-sm">
          <FaClock className="text-indigo-600 mr-2 text-xl" />
          Challenge Duration: <strong className="ml-1 text-indigo-600">3 Months</strong>
        </h3>
        <p className="text-xs text-slate-500 font-medium">Accelerate your learning and be the first to conquer the course!</p>
      </div>

      <div className="mt-6 text-center relative z-10">
        <p className="italic text-xs text-slate-400">
          Note: The winner will be interviewed to assess understanding.
        </p>
        <button className="mt-4 px-8 py-3 bg-indigo-600 text-white rounded-full font-bold hover:bg-indigo-700 transition duration-150 shadow-lg shadow-indigo-600/20 text-sm">
          Start Now
        </button>
      </div>
    </div>
  );
};

export default CourseChallengeAnnouncement;
