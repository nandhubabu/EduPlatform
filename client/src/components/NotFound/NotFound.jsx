import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaCompass, FaHome, FaBookOpen, FaArrowLeft } from "react-icons/fa";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white flex items-center justify-center px-4 py-16 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-xl w-full text-center relative z-10 space-y-8">
        {/* Large stylized badge */}
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-slate-800/80 border border-slate-700/60 shadow-2xl mb-2">
          <FaCompass className="text-4xl text-blue-400 animate-pulse" />
        </div>

        <div>
          <h1 className="text-8xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
            404
          </h1>
          <h2 className="text-2xl font-bold text-slate-100 mt-2">
            Page Not Found
          </h2>
          <p className="text-slate-400 text-sm md:text-base mt-3 max-w-md mx-auto leading-relaxed">
            The link you followed might be broken, or the page may have been relocated. Let's get you back on track!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-sm font-semibold transition"
          >
            <FaArrowLeft className="text-xs" />
            <span>Go Back</span>
          </button>

          <Link
            to="/"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold shadow-lg shadow-blue-600/30 transition"
          >
            <FaHome className="text-sm" />
            <span>Return Home</span>
          </Link>

          <Link
            to="/courses"
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-sm font-semibold transition"
          >
            <FaBookOpen className="text-sm text-blue-400" />
            <span>Browse Courses</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
