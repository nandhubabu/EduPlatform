import React from "react";
import { FaTrophy, FaClock, FaUserGraduate } from "react-icons/fa";
import { GiMoneyStack } from "react-icons/gi";
import { BiBookReader } from "react-icons/bi";

const CourseChallengeAnnouncement = () => {
  return (
    <div className="max-w-2xl mx-auto p-8 bg-white/3 backdrop-blur-xl border border-white/5 rounded-2xl shadow-2xl text-slate-100 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col items-center text-center relative z-10">
        <FaTrophy className="text-8xl text-amber-400 mb-4 drop-shadow-[0_0_15px_rgba(245,158,11,0.3)] animate-bounce" style={{ animationDuration: '3s' }} />
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
          Win $100 and Exciting Rewards!
        </h2>
        <p className="text-slate-300">
          Be the first to complete our{" "}
          <span className="font-semibold text-purple-300">
            Fullstack Web Development Course (MERN)
          </span>{" "}
          and win amazing prizes!
        </p>
      </div>

      <div className="flex justify-around items-center mt-8 mb-6 relative z-10">
        <div className="flex flex-col items-center group">
          <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 mb-2 transition-transform duration-300 group-hover:scale-110">
            <GiMoneyStack className="text-4xl text-emerald-400" />
          </div>
          <span className="text-sm font-medium text-slate-300">$100 Cash Prize</span>
        </div>
        <div className="flex flex-col items-center group">
          <div className="p-3 bg-purple-500/10 rounded-2xl border border-purple-500/20 mb-2 transition-transform duration-300 group-hover:scale-110">
            <BiBookReader className="text-4xl text-purple-400" />
          </div>
          <span className="text-sm font-medium text-slate-300">1 Free Course</span>
        </div>
        <div className="flex flex-col items-center group">
          <div className="p-3 bg-rose-500/10 rounded-2xl border border-rose-500/20 mb-2 transition-transform duration-300 group-hover:scale-110">
            <FaUserGraduate className="text-4xl text-rose-400" />
          </div>
          <span className="text-sm font-medium text-slate-300">3 Days Live Support</span>
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-900/10 to-cyan-900/10 border border-purple-500/20 p-5 rounded-xl my-4 text-center relative z-10">
        <h3 className="font-semibold mb-2 flex items-center justify-center text-slate-200">
          <FaClock className="text-purple-400 mr-2 text-2xl" />
          Challenge Duration: <strong className="ml-1 text-cyan-300">3 Months</strong>
        </h3>
        <p className="text-sm text-slate-400">Accelerate your learning and be the first to conquer the course!</p>
      </div>

      <div className="mt-6 text-center relative z-10">
        <p className="italic text-xs text-slate-500">
          Note: The winner will be interviewed to assess understanding.
        </p>
        <button className="mt-4 px-8 py-3 bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-full font-bold hover:from-purple-700 hover:to-cyan-600 transition-all duration-200 shadow-lg border border-white/10 transform hover:scale-[1.03]">
          Start Now
        </button>
      </div>
    </div>
  );
};

export default CourseChallengeAnnouncement;
