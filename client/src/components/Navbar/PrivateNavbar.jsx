import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FaGraduationCap,
  FaSearch,
  FaBookOpen,
  FaLightbulb,
  FaThLarge,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaPlusCircle,
  FaLayerGroup,
  FaChevronDown,
  FaLaptopCode,
  FaBrain,
  FaDatabase,
  FaCloud,
  FaShieldAlt,
  FaBriefcase,
} from "react-icons/fa";
import { logout } from "../../redux/slices/authSlice";

const CATEGORIES = [
  { name: "Web Development", icon: <FaLaptopCode />, param: "Web Development" },
  { name: "AI & Machine Learning", icon: <FaBrain />, param: "AI" },
  { name: "Data Science", icon: <FaDatabase />, param: "Data Science" },
  { name: "Cloud & DevOps", icon: <FaCloud />, param: "Cloud" },
  { name: "Cybersecurity", icon: <FaShieldAlt />, param: "Security" },
  { name: "Business & Tech", icon: <FaBriefcase />, param: "Business" },
];

export default function PrivateNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);
  const catRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userProfile } = useSelector((state) => state.auth);
  const isInstructor = userProfile?.role === "instructor";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (catRef.current && !catRef.current.contains(event.target)) {
        setCatOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
    setCatOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
    } catch {
      // ignore
    }
    navigate("/login");
  };

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

  const username = userProfile?.username || userProfile?.name || "Student";
  const userInitial = username.charAt(0).toUpperCase();

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
          {/* Logo & Explore */}
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

            {/* Explore Categories (Desktop) */}
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

          {/* Central Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-md relative items-center mx-2"
          >
            <div className="relative w-full">
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for anything..."
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

          {/* Right Navigation & Profile */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              to="/courses"
              className="text-sm font-medium text-slate-300 hover:text-white transition flex items-center gap-1.5"
            >
              <FaBookOpen className="text-blue-400 text-xs" />
              <span>Courses</span>
            </Link>

            {/* Udemy-style My Learning */}
            <Link
              to="/dashboard"
              className="text-sm font-medium text-slate-300 hover:text-white transition flex items-center gap-1.5"
            >
              <FaThLarge className="text-indigo-400 text-xs" />
              <span>My Learning</span>
            </Link>

            <Link
              to="/assessment"
              className="text-sm font-medium text-slate-300 hover:text-white transition flex items-center gap-1.5"
            >
              <FaLightbulb className="text-amber-400 text-xs" />
              <span>Career Explorer</span>
            </Link>

            {isInstructor && (
              <Link
                to="/instructor-add-course"
                className="text-xs font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-lg hover:bg-emerald-500/20 transition flex items-center gap-1.5"
              >
                <FaPlusCircle />
                <span>Add Course</span>
              </Link>
            )}

            {/* User Avatar Menu */}
            <div className="relative ml-2" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-800/80 border border-slate-700/80 transition focus:outline-none"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">
                  {userInitial}
                </div>
                <FaChevronDown className="text-slate-400 text-xs mr-1" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-[#111726] border border-slate-700/90 rounded-2xl shadow-2xl py-2 z-50 animate-fadeIn">
                  <div className="px-4 py-3 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-base">
                        {userInitial}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white truncate">{username}</p>
                        <p className="text-xs text-slate-400 truncate">{userProfile?.email}</p>
                        <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300">
                          {userProfile?.role || "Student"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-800/60 transition"
                    >
                      <FaThLarge className="text-blue-400 text-sm" />
                      <div>
                        <div className="font-semibold">My Learning Dashboard</div>
                        <div className="text-xs text-slate-400">View enrolled courses & progress</div>
                      </div>
                    </Link>

                    {isInstructor && (
                      <Link
                        to="/instructor-courses"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-800/60 transition"
                      >
                        <FaLayerGroup className="text-purple-400 text-sm" />
                        <div>
                          <div className="font-semibold">Instructor Dashboard</div>
                          <div className="text-xs text-slate-400">Manage created courses</div>
                        </div>
                      </Link>
                    )}

                    <Link
                      to="/settings"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-800/60 transition"
                    >
                      <FaCog className="text-slate-400 text-sm" />
                      <span className="font-medium">Account Settings</span>
                    </Link>
                  </div>

                  <div className="h-[1px] bg-slate-800 my-1" />

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-400 hover:bg-rose-500/10 transition text-left"
                  >
                    <FaSignOutAlt className="text-sm" />
                    <span className="font-medium">Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white bg-slate-800/60 border border-slate-700/60 focus:outline-none"
              aria-label="Toggle Navigation"
            >
              {mobileOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div className="lg:hidden bg-[#0d1322] border-t border-slate-800 px-5 py-4 space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold">
                {userInitial}
              </div>
              <div className="min-w-0">
                <p className="text-white font-bold truncate">{username}</p>
                <p className="text-xs text-slate-400 truncate">{userProfile?.email}</p>
              </div>
            </div>

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
                to="/dashboard"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800"
              >
                <FaThLarge className="text-blue-400" />
                My Learning Dashboard
              </Link>
              <Link
                to="/courses"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800"
              >
                <FaBookOpen className="text-indigo-400" />
                Explore Courses
              </Link>
              <Link
                to="/assessment"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800"
              >
                <FaLightbulb className="text-amber-400" />
                Career AI Explorer
              </Link>
              {isInstructor && (
                <Link
                  to="/instructor-courses"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-emerald-300 hover:bg-slate-800"
                >
                  <FaLayerGroup className="text-emerald-400" />
                  Instructor Dashboard
                </Link>
              )}
              <Link
                to="/settings"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800"
              >
                <FaCog className="text-slate-400" />
                Account Settings
              </Link>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-sm font-semibold transition"
              >
                <FaSignOutAlt />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </nav>
      {/* Spacer */}
      <div className="h-18" />
    </>
  );
}
