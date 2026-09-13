import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  FaBookOpen,
  FaClock,
  FaTrophy,
  FaPlay,
  FaPause,
  FaRedo,
  FaGraduationCap,
  FaCalendarAlt,
  FaArrowRight,
  FaUser,
  FaLightbulb,
  FaCheckCircle,
  FaFire,
  FaBolt,
  FaStar,
  FaAward,
  FaCompass,
  FaCheck,
  FaLaptopCode,
  FaRocket,
  FaBrain,
} from "react-icons/fa";

const StudentDashboard = ({ user }) => {
  const { userProfile: authProfile } = useSelector((state) => state.auth);
  const currentUser = user || authProfile;

  // Active Tab state for Course Hub
  const [activeTab, setActiveTab] = useState("inProgress");

  // Focus / Pomodoro Timer State
  const [focusTimeLeft, setFocusTimeLeft] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showTimerWidget, setShowTimerWidget] = useState(false);

  // Interactive Deadlines State
  const [deadlines, setDeadlines] = useState([
    {
      id: 1,
      course: "React Masterclass: Next.js & TypeScript",
      assignment: "Production Capstone Architecture",
      dueDate: "Today, 11:59 PM",
      urgency: "urgent", // urgent | warning | normal
      completed: false,
    },
    {
      id: 2,
      course: "Node.js Backend Architecture",
      assignment: "Distributed Auth Microservice",
      dueDate: "Tomorrow, 6:00 PM",
      urgency: "warning",
      completed: false,
    },
    {
      id: 3,
      course: "Full-Stack Data Engineering",
      assignment: "PostgreSQL Index Optimization Lab",
      dueDate: "Friday, 10:00 PM",
      urgency: "normal",
      completed: true,
    },
  ]);

  // Pomodoro Timer Countdown Effect
  useEffect(() => {
    let interval = null;
    if (isTimerRunning && focusTimeLeft > 0) {
      interval = setInterval(() => {
        setFocusTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (focusTimeLeft === 0) {
      setIsTimerRunning(false);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, focusTimeLeft]);

  const toggleTimer = () => setIsTimerRunning(!isTimerRunning);
  const resetTimer = () => {
    setIsTimerRunning(false);
    setFocusTimeLeft(25 * 60);
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const toggleDeadline = (id) => {
    setDeadlines((prev) =>
      prev.map((d) => (d.id === id ? { ...d, completed: !d.completed } : d))
    );
  };

  // Dynamic Greeting based on client local hour
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const studentStats = {
    totalCourses: 5,
    completedCourses: 2,
    inProgressCourses: 3,
    totalHours: 48,
    weeklyGoalHours: 10,
    weeklyHoursCurrent: 7.4,
    certificatesEarned: 2,
    currentStreak: 7,
    xpPoints: 2450,
    nextTierXp: 3000,
    level: 8,
    levelTitle: "Polymath Scholar",
  };

  const streakDays = [
    { day: "Mon", active: true },
    { day: "Tue", active: true },
    { day: "Wed", active: true },
    { day: "Thu", active: true },
    { day: "Fri", active: true },
    { day: "Sat", active: true },
    { day: "Sun", active: true, today: true },
  ];

  const inProgressCourses = [
    {
      id: "course-1",
      title: "Advanced React Development: Next.js 14 & TypeScript",
      category: "Frontend Architecture",
      progress: 78,
      instructor: "Dr. Angela Yu",
      nextLesson: "Custom Hooks & Memory Profiling",
      timeLeft: "2h 30m remaining",
      thumbnail:
        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=600&q=80",
      accentColor: "from-violet-600 to-indigo-600",
      pillColor: "text-violet-400 bg-violet-500/10 border-violet-500/20",
    },
    {
      id: "course-2",
      title: "Node.js Backend Architecture & Microservices",
      category: "Backend Systems",
      progress: 45,
      instructor: "Brad Traversy",
      nextLesson: "Redis Caching & API Rate Limiting",
      timeLeft: "1h 45m remaining",
      thumbnail:
        "https://images.unsplash.com/photo-1627398242454-45a1465c2479?auto=format&fit=crop&w=600&q=80",
      accentColor: "from-cyan-500 to-blue-600",
      pillColor: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    },
    {
      id: "course-3",
      title: "Full-Stack Data Engineering & PostgreSQL Mastery",
      category: "Data & Cloud",
      progress: 24,
      instructor: "Jose Portilla",
      nextLesson: "Partitioning & Complex Analytical Queries",
      timeLeft: "3h 15m remaining",
      thumbnail:
        "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=600&q=80",
      accentColor: "from-emerald-500 to-teal-600",
      pillColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    },
  ];

  const completedCourses = [
    {
      id: "course-comp-1",
      title: "Modern JavaScript (ES2024) Deep Dive & Async Patterns",
      category: "Core Web",
      completedDate: "August 18, 2026",
      credentialId: "EDU-892410-JS",
      thumbnail:
        "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "course-comp-2",
      title: "Tailwind CSS & Modern Responsive Design Systems",
      category: "Design Engineering",
      completedDate: "August 02, 2026",
      credentialId: "EDU-771923-CSS",
      thumbnail:
        "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80",
    },
  ];

  const recommendedCourses = [
    {
      id: "rec-1",
      title: "Generative AI Engineering: LLM Pipelines & Vector DBs",
      category: "AI & ML",
      matchScore: 98,
      duration: "18h total",
      thumbnail:
        "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "rec-2",
      title: "AWS Certified Solutions Architect & DevOps Pipelines",
      category: "Cloud Engineering",
      matchScore: 94,
      duration: "26h total",
      thumbnail:
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    },
  ];

  const achievements = [
    {
      id: 1,
      title: "7-Day Study Streak",
      subtitle: "Unstoppable momentum",
      icon: FaFire,
      color: "text-amber-400 bg-amber-500/10 border-amber-500/30",
    },
    {
      id: 2,
      title: "Fast Learner Honor",
      subtitle: "Completed 2 modules in 48h",
      icon: FaBolt,
      color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
    },
    {
      id: 3,
      title: "Full-Stack Scholar",
      subtitle: "Mastered 5+ key tech stacks",
      icon: FaAward,
      color: "text-violet-400 bg-violet-500/10 border-violet-500/30",
    },
  ];

  const weeklyActivity = [
    { day: "Mon", height: "65%", mins: "55m", label: "React" },
    { day: "Tue", height: "85%", mins: "80m", label: "Node" },
    { day: "Wed", height: "100%", mins: "115m", label: "Full-Stack" },
    { day: "Thu", height: "75%", mins: "70m", label: "SQL" },
    { day: "Fri", height: "60%", mins: "50m", label: "Types" },
    { day: "Sat", height: "90%", mins: "95m", label: "Next.js" },
    { day: "Sun", height: "95%", mins: "105m", label: "Capstone" },
  ];

  const masteredSkills = [
    "React 18",
    "Next.js",
    "TypeScript",
    "TailwindCSS",
    "Express.js",
    "MongoDB",
    "PostgreSQL",
    "REST APIs",
  ];

  return (
    <div className="min-h-screen bg-[#06080e] text-slate-100 font-sans antialiased relative overflow-hidden pb-24">
      {/* ─── AMBIENT AURORA LIGHTING MESH ───────────────────────────────── */}
      <div className="absolute top-0 left-1/4 w-[550px] h-[550px] bg-violet-600/10 rounded-full blur-[130px] pointer-events-none -z-0" />
      <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none -z-0" />
      <div className="absolute bottom-10 left-1/3 w-[600px] h-[600px] bg-emerald-500/8 rounded-full blur-[150px] pointer-events-none -z-0" />

      {/* ─── COMMAND CENTER HERO STRIP ──────────────────────────────────── */}
      <section className="relative z-10 border-b border-slate-800/80 bg-gradient-to-b from-[#0c101d]/90 via-[#0a0e1a]/80 to-transparent backdrop-blur-xl pt-10 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* User Greeting & XP Tier Badge */}
            <div className="space-y-2">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-300 text-xs font-bold uppercase tracking-wider">
                  <FaRocket className="text-violet-400 text-[11px]" />
                  <span>Student Workspace</span>
                </span>

                {/* Level / XP Pill */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/80 text-xs font-semibold text-slate-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-emerald-400 font-bold">Level {studentStats.level}</span>
                  <span className="text-slate-500">&bull;</span>
                  <span className="text-slate-300">{studentStats.levelTitle}</span>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                {getGreeting()},{" "}
                <span className="gradient-text-aurora">
                  {currentUser?.username || "Student"}
                </span>
                !
              </h1>
              <p className="text-slate-400 text-sm max-w-2xl">
                Ready to accelerate your mastery? You are currently on track to reach Level{" "}
                {studentStats.level + 1} this week.
              </p>
            </div>

            {/* Quick Actions & Focus Mode Controls */}
            <div className="flex items-center gap-3 self-start lg:self-auto flex-wrap">
              {/* Pomodoro Focus Launcher Toggle */}
              <button
                onClick={() => setShowTimerWidget(!showTimerWidget)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-xs font-bold transition shadow-lg ${
                  showTimerWidget || isTimerRunning
                    ? "bg-violet-600/20 border-violet-500 text-violet-300 shadow-violet-500/20"
                    : "bg-[#0e1424] hover:bg-slate-800 border-slate-700 text-slate-200"
                }`}
              >
                <FaClock className={isTimerRunning ? "text-violet-400 animate-spin" : "text-violet-400"} />
                <span>{isTimerRunning ? formatTimer(focusTimeLeft) : "Focus Session"}</span>
              </button>

              {/* Streak Pill */}
              <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500/15 to-orange-500/15 border border-amber-500/30 text-amber-400 px-4 py-2.5 rounded-xl text-xs font-black shadow-lg shadow-amber-500/5">
                <FaFire className="text-amber-400 text-sm animate-bounce" />
                <span>{studentStats.currentStreak} Days Streak</span>
              </div>

              {/* Catalog CTA */}
              <Link
                to="/courses"
                className="btn-aurora text-white font-bold text-xs px-5 py-2.5 rounded-xl flex items-center gap-2"
              >
                <FaBookOpen />
                <span>Browse Courses</span>
              </Link>
            </div>
          </div>

          {/* Mini Flame Calendar & XP Progress Bar */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-2 border-t border-slate-800/60 items-center">
            {/* 7-Day Flame Track */}
            <div className="md:col-span-7 flex items-center justify-between bg-[#0e1424]/60 border border-slate-800/80 rounded-2xl p-3 px-4">
              <div className="flex items-center gap-2">
                <FaFire className="text-amber-400 text-sm" />
                <span className="text-xs font-bold text-slate-300">Study Streak:</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                {streakDays.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center gap-1 group"
                    title={`${item.day}: Completed Study Goal`}
                  >
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-xs font-black transition-transform duration-200 group-hover:scale-110 ${
                        item.active
                          ? "bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-md shadow-amber-500/20"
                          : "bg-slate-800/60 text-slate-500 border border-slate-700/50"
                      }`}
                    >
                      <FaFire className={item.active ? "text-xs" : "text-[10px] opacity-40"} />
                    </div>
                    <span
                      className={`text-[10px] font-bold ${
                        item.today ? "text-amber-400 underline decoration-2" : "text-slate-500"
                      }`}
                    >
                      {item.day}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Level XP Progress Meter */}
            <div className="md:col-span-5 bg-[#0e1424]/60 border border-slate-800/80 rounded-2xl p-3 px-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <FaStar className="text-amber-400 text-[11px]" />
                  <span>XP Progress</span>
                </span>
                <span className="text-slate-400 text-[11px] font-semibold">
                  <span className="text-white font-bold">{studentStats.xpPoints}</span> /{" "}
                  {studentStats.nextTierXp} XP
                </span>
              </div>
              <div className="w-full bg-slate-800/90 rounded-full h-2 overflow-hidden relative">
                <div
                  className="bg-gradient-to-r from-violet-500 via-cyan-400 to-emerald-400 h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${(studentStats.xpPoints / studentStats.nextTierXp) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Floating Focus Studio Pomodoro Drawer */}
          {showTimerWidget && (
            <div className="glass-card rounded-2xl p-5 border border-violet-500/30 shadow-2xl animate-fadeIn space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-violet-500/20 text-violet-400 flex items-center justify-center text-sm">
                    <FaClock />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Focus Study Engine (Pomodoro)</h3>
                    <p className="text-[11px] text-slate-400">
                      Block distractions and master high-complexity topics in 25-minute bursts.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleTimer}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                      isTimerRunning
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                        : "bg-emerald-600 hover:bg-emerald-500 text-white"
                    }`}
                  >
                    {isTimerRunning ? <FaPause className="text-[10px]" /> : <FaPlay className="text-[10px]" />}
                    <span>{isTimerRunning ? "Pause" : "Start Session"}</span>
                  </button>
                  <button
                    onClick={resetTimer}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
                    title="Reset to 25:00"
                  >
                    <FaRedo className="text-[11px]" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                <div className="text-3xl font-black font-mono tracking-widest text-violet-300">
                  {formatTimer(focusTimeLeft)}
                </div>
                <div className="text-xs text-slate-400 font-medium">
                  {isTimerRunning ? "Deep focus session running..." : "Timer paused"}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ─── MAIN BENTO HUB ─────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8 relative z-10">
        {/* ─── 1. BENTO TELEMETRY METRIC CARDS ──────────────────────────── */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* Tile 1: Course Velocity with Circular Progress Ring */}
          <div className="glass-card-interactive rounded-2xl p-5 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Active Courses
              </span>
              <div className="w-8 h-8 rounded-lg bg-violet-500/15 text-violet-400 flex items-center justify-center">
                <FaBookOpen className="text-sm" />
              </div>
            </div>

            <div className="flex items-baseline justify-between">
              <div>
                <div className="text-3xl font-black text-white">{studentStats.inProgressCourses}</div>
                <div className="text-[11px] text-violet-300 font-medium mt-0.5">
                  {studentStats.totalCourses} courses enrolled
                </div>
              </div>

              {/* Mini Circular Ring */}
              <div className="relative w-12 h-12 flex items-center justify-center">
                <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-800"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-violet-500"
                    strokeDasharray="60, 100"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute text-[10px] font-black text-white">60%</span>
              </div>
            </div>
            <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
              Next milestone in 3 lessons
            </div>
          </div>

          {/* Tile 2: Learning Hours & Weekly Target Progress */}
          <div className="glass-card-interactive rounded-2xl p-5 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Study Velocity
              </span>
              <div className="w-8 h-8 rounded-lg bg-cyan-500/15 text-cyan-400 flex items-center justify-center">
                <FaClock className="text-sm" />
              </div>
            </div>

            <div>
              <div className="text-3xl font-black text-cyan-400">{studentStats.totalHours}h</div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                {studentStats.weeklyHoursCurrent}h / {studentStats.weeklyGoalHours}h weekly goal
              </div>
            </div>

            <div className="space-y-1 pt-1 border-t border-slate-800/80">
              <div className="w-full bg-slate-800/90 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-cyan-400 h-full rounded-full"
                  style={{
                    width: `${(studentStats.weeklyHoursCurrent / studentStats.weeklyGoalHours) * 100}%`,
                  }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>74% of weekly target</span>
                <span className="text-cyan-300 font-bold">+1.8h vs last week</span>
              </div>
            </div>
          </div>

          {/* Tile 3: Completed Credentials */}
          <div className="glass-card-interactive rounded-2xl p-5 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Certifications
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                <FaCheckCircle className="text-sm" />
              </div>
            </div>

            <div>
              <div className="text-3xl font-black text-emerald-400">
                {studentStats.certificatesEarned}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Verified digital credentials
              </div>
            </div>

            <div className="pt-1 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Shareable to LinkedIn</span>
              <span className="text-emerald-400 font-bold">100% Passed</span>
            </div>
          </div>

          {/* Tile 4: XP & Trophy Cabinet */}
          <div className="glass-card-interactive rounded-2xl p-5 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Achievements
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center">
                <FaTrophy className="text-sm" />
              </div>
            </div>

            <div>
              <div className="text-3xl font-black text-amber-400">8 Badges</div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Top 5% across student cohort
              </div>
            </div>

            <div className="pt-1 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Next: 10-Day Streak</span>
              <span className="text-amber-400 font-bold">+250 XP</span>
            </div>
          </div>
        </section>

        {/* ─── 2. DUAL-COLUMN BENTO WORKSPACE ────────────────────────────── */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT 8 COLS: COURSE HUB & WEEKLY INTENSITY GRAPH */}
          <div className="lg:col-span-8 space-y-8">
            {/* TABBED COURSE MATRIX */}
            <div className="glass-card rounded-3xl overflow-hidden border border-slate-800/90 shadow-2xl">
              {/* Header with Custom Tabs */}
              <div className="p-6 border-b border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white">Course Command Center</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Seamlessly jump into your current syllabus or view completed credentials
                  </p>
                </div>

                {/* Tab buttons */}
                <div className="flex items-center bg-[#0a0e19] p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
                  <button
                    onClick={() => setActiveTab("inProgress")}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                      activeTab === "inProgress"
                        ? "bg-violet-600 text-white shadow-md shadow-violet-600/30"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <span>In Progress</span>
                    <span className="px-1.5 py-0.2 rounded-full bg-black/30 text-[10px]">
                      {inProgressCourses.length}
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab("completed")}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                      activeTab === "completed"
                        ? "bg-violet-600 text-white shadow-md shadow-violet-600/30"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <span>Completed</span>
                    <span className="px-1.5 py-0.2 rounded-full bg-black/30 text-[10px]">
                      {completedCourses.length}
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab("recommended")}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                      activeTab === "recommended"
                        ? "bg-violet-600 text-white shadow-md shadow-violet-600/30"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <FaBrain className="text-amber-400 text-xs" />
                    <span>AI Picks</span>
                  </button>
                </div>
              </div>

              {/* Tab 1: In Progress Courses */}
              {activeTab === "inProgress" && (
                <div className="p-6 space-y-4 divide-y divide-slate-800/60">
                  {inProgressCourses.map((c) => (
                    <div
                      key={c.id}
                      className="pt-4 first:pt-0 group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 transition hover:bg-slate-900/30 p-3 rounded-2xl"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        {/* Thumbnail with interactive hover play icon */}
                        <div className="relative w-24 h-16 sm:w-28 sm:h-18 rounded-xl overflow-hidden bg-slate-800 flex-shrink-0 border border-slate-700/60 group-hover:border-violet-500/40 transition">
                          <img
                            src={c.thumbnail}
                            alt={c.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 flex items-center justify-center transition">
                            <div className="w-8 h-8 rounded-full bg-violet-600/90 text-white flex items-center justify-center shadow-lg shadow-violet-600/40 opacity-0 group-hover:opacity-100 transition-opacity">
                              <FaPlay className="text-[10px] ml-0.5" />
                            </div>
                          </div>
                        </div>

                        {/* Title & metadata */}
                        <div className="min-w-0 space-y-1">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${c.pillColor}`}
                          >
                            {c.category}
                          </span>
                          <h3 className="text-sm font-bold text-white group-hover:text-violet-300 transition truncate">
                            {c.title}
                          </h3>
                          <div className="text-xs text-slate-400 flex items-center gap-2">
                            <span>Instructor: {c.instructor}</span>
                            <span>&bull;</span>
                            <span className="text-violet-400 font-medium truncate">
                              Next: {c.nextLesson}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Progress Meter & Resume Button */}
                      <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end flex-shrink-0">
                        <div className="w-28 sm:w-32 space-y-1.5">
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-400 font-medium">Progress</span>
                            <span className="font-black text-white">{c.progress}%</span>
                          </div>
                          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full rounded-full bg-gradient-to-r ${c.accentColor}`}
                              style={{ width: `${c.progress}%` }}
                            />
                          </div>
                          <p className="text-[10px] text-slate-500 text-right">{c.timeLeft}</p>
                        </div>

                        <Link
                          to="/courses"
                          className="px-4 py-2.5 rounded-xl btn-aurora text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md"
                        >
                          <FaPlay className="text-[10px]" />
                          <span className="hidden sm:inline">Resume</span>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 2: Completed Courses */}
              {activeTab === "completed" && (
                <div className="p-6 space-y-4">
                  {completedCourses.map((c) => (
                    <div
                      key={c.id}
                      className="p-4 rounded-2xl bg-[#0d1222] border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <img
                          src={c.thumbnail}
                          alt={c.title}
                          className="w-20 h-14 rounded-xl object-cover bg-slate-800 flex-shrink-0"
                        />
                        <div className="min-w-0 space-y-1">
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded uppercase">
                            {c.category}
                          </span>
                          <h4 className="text-sm font-bold text-white truncate">{c.title}</h4>
                          <p className="text-xs text-slate-400">
                            Completed on {c.completedDate} &bull; ID:{" "}
                            <span className="text-slate-300 font-mono">{c.credentialId}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button className="px-4 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold hover:bg-emerald-500/25 transition flex items-center gap-1.5">
                          <FaCheckCircle />
                          <span>View Certificate</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 3: Recommended Courses */}
              {activeTab === "recommended" && (
                <div className="p-6 space-y-4">
                  {recommendedCourses.map((c) => (
                    <div
                      key={c.id}
                      className="p-4 rounded-2xl bg-[#0d1222] border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <img
                          src={c.thumbnail}
                          alt={c.title}
                          className="w-20 h-14 rounded-xl object-cover bg-slate-800 flex-shrink-0"
                        />
                        <div className="min-w-0 space-y-1">
                          <span className="text-[10px] font-bold text-violet-400 bg-violet-500/15 border border-violet-500/30 px-2 py-0.5 rounded uppercase">
                            {c.category}
                          </span>
                          <h4 className="text-sm font-bold text-white truncate">{c.title}</h4>
                          <p className="text-xs text-slate-400">
                            Course length: {c.duration} &bull;{" "}
                            <span className="text-amber-400 font-bold">
                              {c.matchScore}% Match for your skills
                            </span>
                          </p>
                        </div>
                      </div>

                      <Link
                        to="/courses"
                        className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition flex items-center gap-1.5"
                      >
                        <span>Explore</span>
                        <FaArrowRight className="text-[10px]" />
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* WEEKLY STUDY INTENSITY & CONCEPTS CHART */}
            <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-6 border border-slate-800/90 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <FaBolt className="text-amber-400 text-sm" />
                    <span>Weekly Learning Intensity & Velocity</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Minutes dedicated to hands-on programming labs and architectural lectures
                  </p>
                </div>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full self-start sm:self-auto">
                  +18% Above Average
                </span>
              </div>

              {/* Dynamic Bar Chart */}
              <div className="h-48 flex items-end justify-between gap-3 pt-6 border-t border-slate-800/80">
                {weeklyActivity.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex-1 flex flex-col items-center gap-2 h-full justify-end group cursor-pointer"
                  >
                    <span className="text-[10px] text-cyan-300 font-mono font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.mins}
                    </span>
                    <div
                      className="w-full bg-gradient-to-t from-violet-600 via-indigo-600 to-cyan-400 rounded-xl group-hover:to-emerald-400 transition-all duration-300 shadow-md group-hover:shadow-cyan-500/25"
                      style={{ height: item.height }}
                    />
                    <span className="text-xs text-slate-400 font-semibold">{item.day}</span>
                  </div>
                ))}
              </div>

              {/* Mastered Skills Tags */}
              <div className="pt-4 border-t border-slate-800/60 space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Skills In Active Rotation:
                </p>
                <div className="flex flex-wrap gap-2">
                  {masteredSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-900/80 border border-slate-800 text-slate-300 hover:border-violet-500/40 hover:text-white transition"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT 4 COLS: INTERACTIVE RADAR, DEADLINES, TROPHIES */}
          <div className="lg:col-span-4 space-y-6">
            {/* STUDY RADAR & UPCOMING DEADLINES */}
            <div className="glass-card rounded-3xl p-6 border border-slate-800/90 shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <FaCalendarAlt className="text-violet-400 text-xs" />
                  <span>Interactive Deadlines</span>
                </h3>
                <span className="text-[11px] text-slate-500">Tap check to complete</span>
              </div>

              <div className="space-y-3">
                {deadlines.map((d) => (
                  <div
                    key={d.id}
                    onClick={() => toggleDeadline(d.id)}
                    className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-start gap-3 ${
                      d.completed
                        ? "bg-slate-900/30 border-slate-800/50 opacity-60"
                        : d.urgency === "urgent"
                        ? "bg-rose-500/10 border-rose-500/30 hover:border-rose-500/50"
                        : d.urgency === "warning"
                        ? "bg-amber-500/10 border-amber-500/30 hover:border-amber-500/50"
                        : "bg-[#0d1324] border-slate-800 hover:border-violet-500/40"
                    }`}
                  >
                    <button
                      className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center border text-[10px] transition ${
                        d.completed
                          ? "bg-emerald-500 border-emerald-500 text-white"
                          : "border-slate-600 hover:border-violet-400 text-transparent"
                      }`}
                    >
                      <FaCheck />
                    </button>

                    <div className="min-w-0 space-y-0.5">
                      <p
                        className={`text-xs font-bold leading-snug ${
                          d.completed ? "line-through text-slate-500" : "text-white"
                        }`}
                      >
                        {d.assignment}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">{d.course}</p>
                      <p
                        className={`text-[10px] font-bold flex items-center gap-1 pt-1 ${
                          d.urgency === "urgent"
                            ? "text-rose-400"
                            : d.urgency === "warning"
                            ? "text-amber-400"
                            : "text-slate-400"
                        }`}
                      >
                        <FaClock className="text-[9px]" />
                        <span>{d.dueDate}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* QUICK LAUNCHPAD / TOOLS */}
            <div className="glass-card rounded-3xl p-6 border border-slate-800/90 shadow-2xl space-y-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Quick Launchpad
              </h3>
              <div className="space-y-2.5">
                <Link
                  to="/courses"
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 hover:bg-violet-900/20 border border-slate-800 hover:border-violet-500/40 text-xs font-semibold text-slate-200 transition group"
                >
                  <span className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-violet-500/15 text-violet-400 flex items-center justify-center">
                      <FaBookOpen />
                    </div>
                    <span>Course Catalog</span>
                  </span>
                  <FaArrowRight className="text-[10px] text-slate-500 group-hover:text-violet-400 group-hover:translate-x-0.5 transition" />
                </Link>

                <Link
                  to="/assessment"
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 hover:bg-amber-900/20 border border-slate-800 hover:border-amber-500/40 text-xs font-semibold text-slate-200 transition group"
                >
                  <span className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center">
                      <FaLightbulb />
                    </div>
                    <span>AI Career Assessment</span>
                  </span>
                  <FaArrowRight className="text-[10px] text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition" />
                </Link>

                <Link
                  to="/settings"
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 hover:bg-cyan-900/20 border border-slate-800 hover:border-cyan-500/40 text-xs font-semibold text-slate-200 transition group"
                >
                  <span className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/15 text-cyan-400 flex items-center justify-center">
                      <FaUser />
                    </div>
                    <span>Profile & Security</span>
                  </span>
                  <FaArrowRight className="text-[10px] text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition" />
                </Link>
              </div>
            </div>

            {/* RECENT TROPHIES */}
            <div className="glass-card rounded-3xl p-6 border border-slate-800/90 shadow-2xl space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <FaTrophy className="text-amber-400 text-xs" />
                <span>Earned Accolades</span>
              </h3>

              <div className="space-y-3">
                {achievements.map((ach) => (
                  <div
                    key={ach.id}
                    className="flex items-center gap-3.5 p-3 rounded-2xl bg-[#0c1122] border border-slate-800/70"
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-base border flex-shrink-0 ${ach.color}`}
                    >
                      <ach.icon />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white">{ach.title}</p>
                      <p className="text-[11px] text-slate-400">{ach.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default StudentDashboard;
