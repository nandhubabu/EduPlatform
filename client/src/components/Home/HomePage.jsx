import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  FaRocket,
  FaBrain,
  FaCode,
  FaUsers,
  FaTrophy,
  FaArrowRight,
  FaPlay,
  FaStar,
  FaCheckCircle,
  FaChartLine,
  FaLaptopCode,
  FaUserGraduate,
} from "react-icons/fa";

/* ─── DATA ─────────────────────────────────────────────────────── */
const stats = [
  { value: "10K+", label: "Students", icon: <FaUsers /> },
  { value: "200+", label: "Courses", icon: <FaLaptopCode /> },
  { value: "95%", label: "Success Rate", icon: <FaTrophy /> },
  { value: "50+", label: "Expert Mentors", icon: <FaUserGraduate /> },
];

const features = [
  {
    icon: <FaBrain />,
    color: "#a855f7",
    glow: "rgba(168,85,247,0.2)",
    title: "AI Career Guidance",
    desc: "Get personalized career recommendations powered by Gemini AI, matched to your unique interests and goals.",
  },
  {
    icon: <FaCode />,
    color: "#06b6d4",
    glow: "rgba(6,182,212,0.2)",
    title: "Hands-On Projects",
    desc: "Build real-world projects that matter. Every course comes with practical assignments you can add to your portfolio.",
  },
  {
    icon: <FaChartLine />,
    color: "#10b981",
    glow: "rgba(16,185,129,0.2)",
    title: "Progress Tracking",
    desc: "Detailed analytics and progress tracking to keep you motivated and on track to hit your goals faster.",
  },
  {
    icon: <FaUsers />,
    color: "#f59e0b",
    glow: "rgba(245,158,11,0.2)",
    title: "Expert Community",
    desc: "Learn alongside industry professionals. Get feedback, mentorship, and support from people who've been there.",
  },
];

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Frontend Developer @ Google",
    avatar: "PS",
    text: "EduPlatform helped me transition from a non-tech background to landing my dream job in 8 months!",
    stars: 5,
  },
  {
    name: "Rahul Mehta",
    role: "Data Scientist @ Flipkart",
    avatar: "RM",
    text: "The career assessment tool was spot-on. It matched me to data science and I haven't looked back.",
    stars: 5,
  },
  {
    name: "Ananya Krishnan",
    role: "UX Designer @ Swiggy",
    avatar: "AK",
    text: "Best platform for structured learning. The projects are real and the mentors are genuinely helpful.",
    stars: 5,
  },
];

/* ─── STYLES ────────────────────────────────────────────────────── */
const s = {
  page: {
    minHeight: "100vh",
    background: "#0a0d14",
    color: "#e2e8f0",
    fontFamily: "'Inter', sans-serif",
    overflowX: "hidden",
  },

  /* Hero */
  hero: {
    position: "relative",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: "120px 24px 80px",
    overflow: "hidden",
  },
  heroBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "6px 16px",
    borderRadius: "999px",
    background: "rgba(168,85,247,0.1)",
    border: "1px solid rgba(168,85,247,0.3)",
    fontSize: "13px",
    fontWeight: 600,
    color: "#a855f7",
    marginBottom: "28px",
    letterSpacing: "0.5px",
  },
  heroTitle: {
    fontSize: "clamp(42px, 6vw, 80px)",
    fontWeight: 900,
    lineHeight: 1.05,
    letterSpacing: "-2px",
    marginBottom: "24px",
    color: "#f1f5f9",
  },
  heroTitleGrad: {
    background: "linear-gradient(135deg, #a855f7 0%, #06b6d4 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  heroSub: {
    fontSize: "clamp(16px, 2vw, 20px)",
    color: "#94a3b8",
    maxWidth: "600px",
    margin: "0 auto 40px",
    lineHeight: 1.7,
  },
  heroBtns: {
    display: "flex",
    gap: "16px",
    justifyContent: "center",
    flexWrap: "wrap",
    marginBottom: "64px",
  },
  btnPrimary: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "14px 32px",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: 700,
    textDecoration: "none",
    color: "white",
    background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
    border: "none",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 0 30px rgba(124,58,237,0.4)",
  },
  btnSecondary: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "14px 32px",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: 600,
    textDecoration: "none",
    color: "#e2e8f0",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },

  /* Stats */
  statsBar: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "1px",
    maxWidth: "900px",
    margin: "0 auto",
    background: "rgba(255,255,255,0.05)",
    borderRadius: "20px",
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.07)",
  },
  statItem: {
    padding: "24px 16px",
    textAlign: "center",
    background: "rgba(10,13,20,0.8)",
    backdropFilter: "blur(10px)",
  },
  statValue: {
    fontSize: "32px",
    fontWeight: 900,
    background: "linear-gradient(135deg, #a855f7, #06b6d4)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    lineHeight: 1,
    marginBottom: "4px",
  },
  statLabel: {
    fontSize: "13px",
    color: "#64748b",
    fontWeight: 500,
  },

  /* Sections */
  section: {
    padding: "100px 24px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  sectionBadge: {
    display: "inline-block",
    padding: "4px 14px",
    borderRadius: "999px",
    background: "rgba(168,85,247,0.1)",
    border: "1px solid rgba(168,85,247,0.25)",
    fontSize: "12px",
    fontWeight: 700,
    color: "#a855f7",
    letterSpacing: "1px",
    textTransform: "uppercase",
    marginBottom: "16px",
  },
  sectionTitle: {
    fontSize: "clamp(28px, 4vw, 44px)",
    fontWeight: 800,
    color: "#f1f5f9",
    lineHeight: 1.2,
    marginBottom: "16px",
    letterSpacing: "-1px",
  },
  sectionSub: {
    fontSize: "17px",
    color: "#64748b",
    maxWidth: "520px",
    lineHeight: 1.7,
  },

  /* Feature cards */
  featureCard: {
    padding: "32px",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.07)",
    transition: "all 0.3s ease",
    cursor: "default",
  },
  featureIcon: {
    width: "52px",
    height: "52px",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "22px",
    marginBottom: "20px",
  },

  /* Testimonials */
  testimonialCard: {
    padding: "28px",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.07)",
    transition: "all 0.3s ease",
  },
  avatar: {
    width: "46px",
    height: "46px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
    fontWeight: 800,
    color: "white",
    flexShrink: 0,
  },

  /* CTA */
  ctaSection: {
    margin: "0 24px 100px",
    borderRadius: "28px",
    padding: "80px 40px",
    textAlign: "center",
    background: "linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(6,182,212,0.1) 100%)",
    border: "1px solid rgba(168,85,247,0.2)",
    position: "relative",
    overflow: "hidden",
  },
};

/* ─── COMPONENT ─────────────────────────────────────────────────── */
const Homepage = () => {
  const { userProfile } = useSelector((state) => state.auth);
  const isStudent = userProfile?.role === "student";

  return (
    <div style={s.page}>

      {/* ── HERO ─────────────────────────────────────── */}
      <section style={s.hero}>
        {/* Background orbs */}
        <div style={{
          position: "absolute", top: "10%", left: "15%", width: "500px", height: "500px",
          borderRadius: "50%", background: "rgba(124,58,237,0.12)", filter: "blur(100px)",
          animation: "float 8s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute", top: "30%", right: "10%", width: "400px", height: "400px",
          borderRadius: "50%", background: "rgba(6,182,212,0.08)", filter: "blur(100px)",
          animation: "float 10s ease-in-out infinite reverse",
        }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: "860px", width: "100%" }}>
          <div style={s.heroBadge}>
            <FaRocket style={{ fontSize: "11px" }} />
            Trusted by 10,000+ learners worldwide
          </div>

          <h1 style={s.heroTitle}>
            Unlock Your<br />
            <span style={s.heroTitleGrad}>Career Potential</span>
          </h1>

          <p style={s.heroSub}>
            Discover your ideal career path with AI-powered assessments, learn from industry experts, and build real projects that get you hired.
          </p>

          <div style={s.heroBtns}>
            <Link
              to="/courses"
              style={s.btnPrimary}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow = "0 0 50px rgba(124,58,237,0.7)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = "0 0 30px rgba(124,58,237,0.4)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <FaRocket /> Explore Courses
            </Link>

            {(isStudent || !userProfile) && (
              <Link
                to="/assessment"
                style={s.btnSecondary}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.borderColor = "rgba(168,85,247,0.4)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                }}
              >
                <FaPlay style={{ fontSize: "12px" }} /> Take Career Assessment
              </Link>
            )}
          </div>

          {/* Stats bar */}
          <div style={s.statsBar}>
            {stats.map((stat, i) => (
              <div key={i} style={s.statItem}>
                <div style={s.statValue}>{stat.value}</div>
                <div style={s.statLabel}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────── */}
      <section style={{ padding: "0 24px 100px", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <div style={s.sectionBadge}>Why EduPlatform</div>
          <h2 style={s.sectionTitle}>Everything you need to<br />launch your career</h2>
          <p style={{ ...s.sectionSub, margin: "0 auto" }}>
            From self-discovery to job-ready skills — we've built a complete ecosystem for your success.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px" }}>
          {features.map((f, i) => (
            <div
              key={i}
              style={s.featureCard}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = f.color + "40";
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow = `0 20px 60px ${f.glow}`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div style={{ ...s.featureIcon, background: f.glow, color: f.color, boxShadow: `0 0 20px ${f.glow}` }}>
                {f.icon}
              </div>
              <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#f1f5f9", marginBottom: "10px" }}>
                {f.title}
              </h3>
              <p style={{ fontSize: "14px", color: "#64748b", lineHeight: 1.7, margin: 0 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────── */}
      <section style={{ padding: "0 24px 100px", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <div style={s.sectionBadge}>Success Stories</div>
          <h2 style={s.sectionTitle}>Learners who made<br />the leap</h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
          {testimonials.map((t, i) => (
            <div
              key={i}
              style={s.testimonialCard}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "rgba(168,85,247,0.25)";
                e.currentTarget.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {/* Stars */}
              <div style={{ display: "flex", gap: "3px", marginBottom: "16px" }}>
                {[...Array(t.stars)].map((_, j) => (
                  <FaStar key={j} style={{ color: "#f59e0b", fontSize: "13px" }} />
                ))}
              </div>
              <p style={{ fontSize: "15px", color: "#94a3b8", lineHeight: 1.7, marginBottom: "20px", fontStyle: "italic" }}>
                "{t.text}"
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={s.avatar}>{t.avatar}</div>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "#f1f5f9" }}>{t.name}</div>
                  <div style={{ fontSize: "12px", color: "#64748b" }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CAREER ASSESSMENT CTA (students only) ─────── */}
      {isStudent && (
        <div style={{ padding: "0 24px 80px", maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{
            borderRadius: "24px",
            padding: "60px 40px",
            textAlign: "center",
            background: "linear-gradient(135deg, rgba(168,85,247,0.1), rgba(6,182,212,0.08))",
            border: "1px solid rgba(168,85,247,0.2)",
          }}>
            <div style={{ fontSize: "48px", marginBottom: "20px" }}>🧠</div>
            <h2 style={{ fontSize: "32px", fontWeight: 800, color: "#f1f5f9", marginBottom: "12px" }}>
              Discover Your Ideal Career Path
            </h2>
            <p style={{ fontSize: "17px", color: "#64748b", maxWidth: "500px", margin: "0 auto 32px", lineHeight: 1.7 }}>
              Take our 60-question O*NET-based career assessment and get AI-powered recommendations tailored to you.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              {["✓ 15 min assessment", "✓ AI-powered results", "✓ Course recommendations"].map((item, i) => (
                <span key={i} style={{ fontSize: "13px", color: "#a855f7", fontWeight: 600 }}>{item}</span>
              ))}
            </div>
            <br />
            <Link
              to="/assessment"
              style={{ ...s.btnPrimary, display: "inline-flex" }}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow = "0 0 50px rgba(124,58,237,0.7)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = "0 0 30px rgba(124,58,237,0.4)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <FaBrain /> Start Your Assessment <FaArrowRight style={{ fontSize: "13px" }} />
            </Link>
          </div>
        </div>
      )}

      {/* ── FINAL CTA (guests only) ───────────────────── */}
      {!userProfile && (
        <div style={{ padding: "0 24px 100px", maxWidth: "1200px", margin: "0 auto" }}>
          <div style={s.ctaSection}>
            {/* BG orb */}
            <div style={{
              position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
              width: "600px", height: "300px",
              background: "radial-gradient(ellipse, rgba(124,58,237,0.15) 0%, transparent 70%)",
              pointerEvents: "none",
            }} />

            <div style={{ position: "relative", zIndex: 1 }}>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 900, color: "#f1f5f9", marginBottom: "16px", letterSpacing: "-1px" }}>
                Ready to start your<br />
                <span style={s.heroTitleGrad}>learning journey?</span>
              </h2>
              <p style={{ fontSize: "18px", color: "#64748b", marginBottom: "40px", maxWidth: "480px", margin: "0 auto 40px" }}>
                Join thousands of students who are already building the careers of their dreams.
              </p>
              <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
                <Link
                  to="/register"
                  style={s.btnPrimary}
                  onMouseEnter={e => {
                    e.currentTarget.style.boxShadow = "0 0 50px rgba(124,58,237,0.7)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.boxShadow = "0 0 30px rgba(124,58,237,0.4)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <FaRocket /> Get Started Free
                </Link>
                <Link
                  to="/courses"
                  style={s.btnSecondary}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                    e.currentTarget.style.borderColor = "rgba(168,85,247,0.4)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                  }}
                >
                  Browse Courses <FaArrowRight style={{ fontSize: "13px" }} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── WELCOME BACK (logged in) ──────────────────── */}
      {userProfile && (
        <div style={{ padding: "0 24px 100px", maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ ...s.ctaSection, background: "linear-gradient(135deg, rgba(16,185,129,0.1), rgba(6,182,212,0.08))", borderColor: "rgba(16,185,129,0.2)" }}>
            <h2 style={{ fontSize: "36px", fontWeight: 800, color: "#f1f5f9", marginBottom: "12px" }}>
              Welcome back, <span style={{ color: "#10b981" }}>{userProfile.username}!</span> 👋
            </h2>
            <p style={{ fontSize: "17px", color: "#64748b", marginBottom: "32px" }}>
              {userProfile.role === "student"
                ? "Continue your learning journey and explore new courses."
                : "Manage your courses and inspire your students."}
            </p>
            <Link to="/courses" style={s.btnPrimary}>
              {userProfile.role === "student" ? "Browse Courses" : "Manage Courses"} <FaArrowRight />
            </Link>
          </div>
        </div>
      )}

      {/* Float animation keyframes */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @media (max-width: 640px) {
          [data-stats] { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  );
};

export default Homepage;
