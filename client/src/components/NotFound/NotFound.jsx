import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaCompass, FaHome, FaBookOpen, FaArrowLeft } from "react-icons/fa";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex items-center justify-center px-4 py-16 relative overflow-hidden">
      {/* Subtle background ambient glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-xl w-full text-center relative z-10 space-y-8">
        {/* Large stylized badge */}
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-white border border-slate-200 shadow-xl mb-2">
          <FaCompass className="text-4xl text-indigo-600 animate-pulse" />
        </div>

        <div>
          <h1 className="text-8xl font-black tracking-tight text-slate-900">
            404
          </h1>
          <h2 className="text-2xl font-bold text-slate-800 mt-2">
            Page Not Found
          </h2>
          <p className="text-slate-600 text-sm md:text-base mt-3 max-w-md mx-auto leading-relaxed">
            The link you followed might be broken, or the page may have been relocated. Let&apos;s get you back on track!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-sm font-semibold shadow-sm transition"
          >
            <FaArrowLeft className="text-xs" />
            <span>Go Back</span>
          </button>

          <Link
            to="/"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-sm transition"
          >
            <FaHome className="text-sm" />
            <span>Return Home</span>
          </Link>

          <Link
            to="/courses"
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-sm font-semibold shadow-sm transition"
          >
            <FaBookOpen className="text-sm text-indigo-600" />
            <span>Browse Courses</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
