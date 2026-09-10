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
  FaChalkboardTeacher,
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
            ? "bg-[#0b0f19]/95 backdrop-blur-md border-b border-slate-800 shadow-xl"
            : "bg-[#0b0f19]/80 backdrop-blur-sm border-b border-slate-800/60"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-3">
          {/* Logo & Categories */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2.5 no-underline group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.35)] group-hover:scale-105 transition-transform">
                <FaGraduationCap className="text-white text-xl" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-white flex items-center">
                  Edu<span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Platform</span>
                </span>
                <span className="text-[10px] text-slate-400 -mt-1 font-medium tracking-wide uppercase">
                  Coursera &bull; Udemy Experience
                </span>
              </div>
            </Link>

            {/* Explore / Categories Dropdown (Desktop) */}
            <div className="relative hidden lg:block" ref={catRef}>
              <button
                type="button"
                onClick={() => setCatOpen(!catOpen)}
                className="flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-slate-200 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700/70 rounded-lg transition"
              >
                <span>Explore</span>
                <FaChevronDown className={`text-xs text-slate-400 transition-transform ${catOpen ? "rotate-180" : ""}`} />
              </button>

              {catOpen && (
                <div className="absolute left-0 mt-2 w-72 bg-[#111726] border border-slate-700/80 rounded-xl shadow-2xl py-2 z-50 animate-fadeIn">
                  <div className="px-3 py-2 border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Browse Categories
                  </div>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.name}
                      onClick={() => handleCategoryClick(cat.param)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-blue-600/15 transition text-left"
                    >
                      <span className="text-blue-400 text-base">{cat.icon}</span>
                      <span className="font-medium">{cat.name}</span>
                    </button>
                  ))}
                  <div className="p-2 border-t border-slate-800">
                    <Link
                      to="/courses"
                      className="block text-center text-xs font-semibold text-blue-400 hover:text-blue-300 py-1"
                    >
                      View All Courses &rarr;
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Central Search Bar (Udemy / Coursera style) */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-lg relative items-center mx-2"
          >
            <div className="relative w-full">
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="What do you want to learn? (e.g. React, Python, AI...)"
                className="w-full pl-10 pr-4 py-2 bg-slate-900/90 border border-slate-700 text-slate-100 placeholder-slate-400 text-sm rounded-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  <FaTimes className="text-xs" />
                </button>
              )}
            </div>
          </form>

          {/* Right Navigation Links & Auth Buttons */}
          <div className="hidden lg:flex items-center gap-5">
            <Link
              to="/courses"
              className="text-sm font-medium text-slate-300 hover:text-white transition flex items-center gap-1.5"
            >
              <FaBookOpen className="text-blue-400 text-xs" />
              <span>Courses</span>
            </Link>

            <Link
              to="/assessment"
              className="text-sm font-medium text-slate-300 hover:text-white transition flex items-center gap-1.5"
            >
              <FaLightbulb className="text-amber-400 text-xs" />
              <span>Career Explorer</span>
            </Link>

            <div className="h-5 w-[1px] bg-slate-800" />

            <Link
              to="/login"
              className="text-sm font-semibold text-slate-200 hover:text-white px-3.5 py-1.5 rounded-lg hover:bg-slate-800/70 border border-slate-700/80 transition"
            >
              Log in
            </Link>

            <Link
              to="/register"
              className="text-sm font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-95 px-4 py-2 rounded-lg shadow-[0_0_15px_rgba(79,70,229,0.3)] transition"
            >
              Join for Free
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white bg-slate-800/60 border border-slate-700/60 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileOpen && (
          <div className="lg:hidden bg-[#0d1322] border-t border-slate-800 px-5 py-4 space-y-4">
            <form onSubmit={handleSearchSubmit} className="relative">
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses..."
                className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 text-white placeholder-slate-400 text-sm rounded-lg focus:outline-none focus:border-blue-500"
              />
            </form>

            <div className="space-y-1">
              <Link
                to="/courses"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800"
              >
                <FaBookOpen className="text-blue-400" />
                All Courses
              </Link>
              <Link
                to="/assessment"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800"
              >
                <FaLightbulb className="text-amber-400" />
                Career AI Explorer
              </Link>
            </div>

            <div className="pt-2 border-t border-slate-800 space-y-2">
              <p className="text-xs font-semibold uppercase text-slate-400 px-1">Top Categories</p>
              <div className="grid grid-cols-2 gap-1.5">
                {CATEGORIES.slice(0, 4).map((c) => (
                  <button
                    key={c.name}
                    onClick={() => handleCategoryClick(c.param)}
                    className="flex items-center gap-2 p-2 rounded-lg text-xs text-slate-300 hover:bg-slate-800 text-left"
                  >
                    <span className="text-blue-400">{c.icon}</span>
                    <span className="truncate">{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex gap-2">
              <Link
                to="/login"
                className="flex-1 text-center py-2 text-sm font-semibold text-slate-200 bg-slate-800/80 border border-slate-700 rounded-lg hover:bg-slate-800"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="flex-1 text-center py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500"
              >
                Join for Free
              </Link>
            </div>
          </div>
        )}
      </nav>
      {/* Spacer */}
      <div className="h-18" />
    </>
  );
}
