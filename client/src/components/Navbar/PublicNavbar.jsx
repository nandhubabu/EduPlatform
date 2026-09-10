import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaGraduationCap,
  FaSearch,
  FaTimes,
  FaBars,
  FaChevronDown,
  FaLightbulb,
  FaBookOpen,
  FaLaptopCode,
  FaBrain,
  FaDatabase,
  FaCloud,
  FaShieldAlt,
  FaBriefcase,
} from "react-icons/fa";

const CATEGORIES = [
  { name: "Web Development", icon: <FaLaptopCode />, param: "Web Development" },
  { name: "AI & Machine Learning", icon: <FaBrain />, param: "AI" },
  { name: "Data Science", icon: <FaDatabase />, param: "Data Science" },
  { name: "Cloud & DevOps", icon: <FaCloud />, param: "Cloud" },
  { name: "Cybersecurity", icon: <FaShieldAlt />, param: "Security" },
  { name: "Business & Tech", icon: <FaBriefcase />, param: "Business" },
];

export default function PublicNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const catRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (catRef.current && !catRef.current.contains(e.target)) {
        setCatOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setCatOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/courses");
    }
  };

  const handleCategoryClick = (categoryParam) => {
    setCatOpen(false);
    navigate(`/courses?category=${encodeURIComponent(categoryParam)}`);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#0b0f19]/95 backdrop-blur-lg border-b border-slate-800 shadow-2xl"
            : "bg-[#0b0f19]/85 backdrop-blur-md border-b border-slate-800/60"
        }`}
      >
        {/* Spacious container with generous height & padding */}
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 h-20 flex items-center justify-between gap-6 lg:gap-8">
          {/* 1. Left: Brand Logo & Explore Dropdown */}
          <div className="flex items-center gap-6 flex-shrink-0">
            <Link to="/" className="flex items-center gap-3 no-underline group py-1">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-[0_0_25px_rgba(79,70,229,0.4)] group-hover:scale-105 transition-transform duration-200">
                <FaGraduationCap className="text-white text-2xl" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                Edu<span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Platform</span>
              </span>
            </Link>

            {/* Explore Mega-Menu Button */}
            <div className="relative hidden xl:block" ref={catRef}>
              <button
                type="button"
                onClick={() => setCatOpen(!catOpen)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-slate-200 hover:text-white bg-slate-800/70 hover:bg-slate-800 border border-slate-700/80 rounded-xl transition"
              >
                <span>Explore</span>
                <FaChevronDown className={`text-xs text-slate-400 transition-transform duration-200 ${catOpen ? "rotate-180 text-blue-400" : ""}`} />
              </button>

              {catOpen && (
                <div className="absolute left-0 mt-3 w-80 bg-[#111726] border border-slate-700/90 rounded-2xl shadow-2xl py-3 z-50 animate-fadeIn">
                  <div className="px-5 py-2 border-b border-slate-800 text-[11px] font-black uppercase tracking-widest text-slate-400">
                    Explore Categories
                  </div>
                  <div className="p-2 space-y-1">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.name}
                        onClick={() => handleCategoryClick(cat.param)}
                        className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-blue-600/20 transition text-left font-medium"
                      >
                        <span className="text-blue-400 text-lg">{cat.icon}</span>
                        <span>{cat.name}</span>
                      </button>
                    ))}
                  </div>
                  <div className="px-4 pt-2 border-t border-slate-800">
                    <Link
                      to="/courses"
                      className="block text-center text-xs font-bold text-blue-400 hover:text-blue-300 py-1.5"
                    >
                      Browse Entire Library (200+ Courses) &rarr;
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 2. Center: Large, Spacious Search Bar (Udemy / Coursera Style) */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-2xl relative items-center"
          >
            <div className="relative w-full">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="What do you want to learn? (e.g. React, Python, Cloud, AI...)"
                className="w-full h-12 pl-12 pr-10 bg-slate-900/90 border border-slate-700/90 hover:border-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 text-slate-100 placeholder-slate-400 text-sm rounded-full shadow-inner transition duration-200 outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1"
                >
                  <FaTimes className="text-xs" />
                </button>
              )}
            </div>
          </form>

          {/* 3. Right: Clear, Airy Navigation Links & CTAs */}
          <div className="hidden lg:flex items-center gap-6 flex-shrink-0">
            <Link
              to="/courses"
              className="text-sm font-semibold text-slate-300 hover:text-white transition flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-800/40"
            >
              <FaBookOpen className="text-blue-400 text-sm" />
              <span>Courses</span>
            </Link>

            <Link
              to="/assessment"
              className="text-sm font-semibold text-slate-300 hover:text-white transition flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-800/40"
            >
              <FaLightbulb className="text-amber-400 text-sm" />
              <span>Career Explorer</span>
            </Link>

            <div className="h-6 w-[1px] bg-slate-800" />

            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm font-bold text-slate-200 hover:text-white px-5 py-2.5 rounded-xl hover:bg-slate-800/80 border border-slate-700/80 transition shadow-sm"
              >
                Log in
              </Link>

              <Link
                to="/register"
                className="text-sm font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-95 px-6 py-2.5 rounded-xl shadow-lg shadow-blue-600/25 transition"
              >
                Join for Free
              </Link>
            </div>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex lg:hidden items-center gap-3">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2.5 rounded-xl text-slate-300 hover:text-white bg-slate-800/80 border border-slate-700 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div className="lg:hidden bg-[#0d1322] border-t border-slate-800 px-6 py-5 space-y-5 animate-fadeIn">
            <form onSubmit={handleSearchSubmit} className="relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses, skills, instructors..."
                className="w-full h-11 pl-11 pr-4 bg-slate-900 border border-slate-700 text-white placeholder-slate-400 text-sm rounded-xl focus:outline-none focus:border-blue-500"
              />
            </form>

            <div className="space-y-2">
              <Link
                to="/courses"
                className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold text-slate-200 hover:bg-slate-800"
              >
                <FaBookOpen className="text-blue-400 text-base" />
                <span>All Courses Library</span>
              </Link>
              <Link
                to="/assessment"
                className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold text-slate-200 hover:bg-slate-800"
              >
                <FaLightbulb className="text-amber-400 text-base" />
                <span>AI Career Explorer</span>
              </Link>
            </div>

            <div className="pt-3 border-t border-slate-800 space-y-2.5">
              <p className="text-xs font-black uppercase text-slate-400 tracking-wider px-2">Top Categories</p>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => handleCategoryClick(c.param)}
                    className="flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 text-left bg-slate-900/50 border border-slate-800/80"
                  >
                    <span className="text-blue-400">{c.icon}</span>
                    <span className="truncate">{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex gap-3">
              <Link
                to="/login"
                className="flex-1 text-center py-3 text-sm font-bold text-slate-200 bg-slate-800 border border-slate-700 rounded-xl hover:bg-slate-750"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="flex-1 text-center py-3 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-500 shadow-md"
              >
                Join for Free
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Spacious Spacer (80px) to prevent any content overlap */}
      <div className="h-20 w-full" />
    </>
  );
}
