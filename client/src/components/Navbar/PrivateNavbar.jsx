import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FaGraduationCap,
  FaBookOpen,
  FaLightbulb,
  FaThLarge,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaUserCircle,
  FaPlusCircle,
  FaLayerGroup,
  FaChevronDown,
} from "react-icons/fa";
import { logout } from "../../redux/slices/authSlice";

export default function PrivateNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userProfile } = useSelector((state) => state.auth);
  const isInstructor = userProfile?.role === "instructor";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
    } catch {
      // ignore
    }
    navigate("/login");
  };

  const navLinks = [
    { to: "/dashboard", label: "Dashboard", icon: <FaThLarge /> },
    { to: "/courses", label: "Courses", icon: <FaBookOpen /> },
    { to: "/assessment", label: "Career Explorer", icon: <FaLightbulb /> },
    ...(isInstructor
      ? [
          { to: "/instructor-add-course", label: "Add Course", icon: <FaPlusCircle /> },
          { to: "/instructor-courses", label: "My Courses", icon: <FaLayerGroup /> },
        ]
      : []),
  ];

  const isActive = (path) => location.pathname === path;

  const username = userProfile?.username || userProfile?.name || "Student";
  const userInitial = username.charAt(0).toUpperCase();

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          transition: "all 0.3s ease",
          background: scrolled ? "rgba(10, 13, 20, 0.95)" : "rgba(10, 13, 20, 0.75)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: scrolled
            ? "1px solid rgba(168, 85, 247, 0.2)"
            : "1px solid rgba(255, 255, 255, 0.07)",
          boxShadow: scrolled ? "0 4px 30px rgba(0,0,0,0.5)" : "none",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "68px",
          }}
        >
          {/* Logo */}
          <Link
            to="/"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <div
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 20px rgba(124, 58, 237, 0.4)",
              }}
            >
              <FaGraduationCap style={{ color: "white", fontSize: "18px" }} />
            </div>
            <span
              style={{
                fontSize: "20px",
                fontWeight: 800,
                background: "linear-gradient(135deg, #a855f7, #06b6d4)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                letterSpacing: "-0.5px",
              }}
            >
              EduPlatform
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  padding: "8px 14px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: 500,
                  textDecoration: "none",
                  color: isActive(link.to) ? "#a855f7" : "#94a3b8",
                  background: isActive(link.to) ? "rgba(168, 85, 247, 0.12)" : "transparent",
                  border: isActive(link.to) ? "1px solid rgba(168, 85, 247, 0.25)" : "1px solid transparent",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  if (!isActive(link.to)) {
                    e.currentTarget.style.color = "#e2e8f0";
                    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(link.to)) {
                    e.currentTarget.style.color = "#94a3b8";
                    e.currentTarget.style.background = "transparent";
                  }
                }}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Action Profile & Menu */}
          <div className="hidden md:flex items-center gap-3">
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition text-slate-200 focus:outline-none"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-cyan-500 flex items-center justify-center text-white text-sm font-bold shadow-[0_0_10px_rgba(147,51,234,0.3)]">
                  {userInitial}
                </div>
                <span className="text-sm font-medium text-slate-200 max-w-[120px] truncate">
                  {username}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-semibold uppercase">
                  {userProfile?.role || "user"}
                </span>
                <FaChevronDown className="text-slate-400 text-xs ml-1" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[#111624] border border-purple-500/20 rounded-xl shadow-2xl py-2 z-50 animate-fadeIn">
                  <div className="px-4 py-2 border-b border-white/5">
                    <p className="text-sm font-semibold text-white">{username}</p>
                    <p className="text-xs text-slate-400 truncate">{userProfile?.email}</p>
                  </div>
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-purple-600/10 transition"
                  >
                    <FaThLarge className="text-purple-400 text-xs" />
                    Dashboard
                  </Link>
                  <Link
                    to="/settings"
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-purple-600/10 transition"
                  >
                    <FaCog className="text-cyan-400 text-xs" />
                    Settings
                  </Link>
                  <div className="h-[1px] bg-white/5 my-1" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-400 hover:bg-rose-500/10 transition text-left"
                  >
                    <FaSignOutAlt className="text-rose-400 text-xs" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileOpen((prev) => !prev)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 focus:outline-none"
              aria-label="Toggle Navigation"
            >
              {mobileOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div className="md:hidden bg-[#0e1320] border-t border-white/10 px-5 py-4 space-y-3">
            <div className="flex items-center gap-3 pb-3 border-b border-white/5">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-cyan-500 flex items-center justify-center text-white font-bold">
                {userInitial}
              </div>
              <div>
                <p className="text-white font-medium">{username}</p>
                <p className="text-xs text-slate-400">{userProfile?.email}</p>
              </div>
            </div>

            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                    isActive(link.to)
                      ? "bg-purple-600/20 text-purple-300"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
              <Link
                to="/settings"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white transition"
              >
                <FaCog />
                Settings
              </Link>
            </div>

            <div className="pt-2 border-t border-white/5">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-sm font-medium transition"
              >
                <FaSignOutAlt />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </nav>
      {/* Spacer to prevent content from hiding under fixed navbar */}
      <div style={{ height: "68px" }} />
    </>
  );
}
