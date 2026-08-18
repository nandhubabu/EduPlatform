import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaBookOpen,
  FaGraduationCap,
  FaLightbulb,
  FaSignInAlt,
  FaUserPlus,
  FaBars,
  FaTimes,
} from "react-icons/fa";

export default function PublicNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { to: "/courses", label: "Courses", icon: <FaBookOpen /> },
    { to: "/assessment", label: "Career Explorer", icon: <FaLightbulb /> },
  ];

  const isActive = (path) => location.pathname === path;

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
          background: scrolled
            ? "rgba(10, 13, 20, 0.9)"
            : "rgba(10, 13, 20, 0.4)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: scrolled
            ? "1px solid rgba(168, 85, 247, 0.2)"
            : "1px solid rgba(255,255,255,0.05)",
          boxShadow: scrolled ? "0 4px 30px rgba(0,0,0,0.4)" : "none",
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
          <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}>
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

          {/* Desktop Nav */}
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }} className="nav-desktop">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: 500,
                  textDecoration: "none",
                  color: isActive(link.to) ? "#a855f7" : "#94a3b8",
                  background: isActive(link.to) ? "rgba(168, 85, 247, 0.1)" : "transparent",
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

            <div style={{ width: "1px", height: "24px", background: "rgba(255,255,255,0.1)", margin: "0 8px" }} />

            <Link
              to="/login"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "7px",
                padding: "8px 16px",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: 500,
                textDecoration: "none",
                color: "#94a3b8",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#e2e8f0";
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#94a3b8";
                e.currentTarget.style.background = "transparent";
              }}
            >
              <FaSignInAlt />
              Sign In
            </Link>

            <Link
              to="/register"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "7px",
                padding: "9px 20px",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: 600,
                textDecoration: "none",
                color: "white",
                background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
                transition: "all 0.3s ease",
                boxShadow: "0 0 15px rgba(124, 58, 237, 0.3)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 0 25px rgba(124, 58, 237, 0.6)";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 0 15px rgba(124, 58, 237, 0.3)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <FaUserPlus />
              Get Started
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="nav-mobile-btn"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px",
              padding: "8px",
              color: "#94a3b8",
              cursor: "pointer",
              display: "none",
            }}
          >
            {mobileOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div
            style={{
              padding: "16px 24px",
              borderTop: "1px solid rgba(255,255,255,0.05)",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "12px 16px",
                  borderRadius: "10px",
                  fontSize: "15px",
                  fontWeight: 500,
                  textDecoration: "none",
                  color: "#94a3b8",
                  background: "rgba(255,255,255,0.03)",
                }}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
            <Link
              to="/login"
              onClick={() => setMobileOpen(false)}
              style={{
                display: "flex", alignItems: "center", gap: "10px",
                padding: "12px 16px", borderRadius: "10px",
                fontSize: "15px", fontWeight: 500, textDecoration: "none",
                color: "#94a3b8", background: "rgba(255,255,255,0.03)",
              }}
            >
              <FaSignInAlt /> Sign In
            </Link>
            <Link
              to="/register"
              onClick={() => setMobileOpen(false)}
              style={{
                display: "flex", alignItems: "center", gap: "10px",
                padding: "12px 16px", borderRadius: "10px",
                fontSize: "15px", fontWeight: 600, textDecoration: "none",
                color: "white",
                background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
              }}
            >
              <FaUserPlus /> Get Started Free
            </Link>
          </div>
        )}
      </nav>

      {/* Mobile responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}
