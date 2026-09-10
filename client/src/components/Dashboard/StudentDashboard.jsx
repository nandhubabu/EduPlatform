import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  FaBookOpen,
  FaClock,
  FaTrophy,
  FaPlay,
  FaGraduationCap,
  FaCalendarAlt,
  FaArrowRight,
  FaUser,
  FaLightbulb,
  FaCheckCircle,
  FaFire,
} from "react-icons/fa";

const StudentDashboard = ({ user }) => {
  const { userProfile: authProfile } = useSelector((state) => state.auth);
  const currentUser = user || authProfile;

  const studentStats = {
    totalCourses: 5,
    completedCourses: 2,
    inProgressCourses: 3,
    totalHours: 48,
    certificatesEarned: 2,
    currentStreak: 7,
  };

  const recentCourses = [
    {
      id: "course-1",
      title: "Advanced React Development: Next.js & TypeScript",
      progress: 75,
      instructor: "Dr. Angela Yu",
      nextLesson: "Custom Hooks & Memory Profiling",
      timeLeft: "2h 30m",
      thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "course-2",
      title: "Node.js Backend Architecture & Microservices",
      progress: 45,
      instructor: "Brad Traversy",
      nextLesson: "Express Middleware & Rate Limiting",
      timeLeft: "1h 45m",
      thumbnail: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "course-3",
      title: "Full-Stack Data Engineering & PostgreSQL Mastery",
      progress: 20,
      instructor: "Jose Portilla",
      nextLesson: "Complex Joins & Query Optimization",
      timeLeft: "3h 15m",
      thumbnail: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=400&q=80",
    },
  ];

  const achievements = [
    { id: 1, title: "First Course Completed", icon: FaGraduationCap, date: "Aug 15, 2026" },
    { id: 2, title: "7-Day Learning Streak", icon: FaTrophy, date: "Aug 20, 2026" },
    { id: 3, title: "Fast Learner Award", icon: FaClock, date: "Aug 28, 2026" },
  ];

  const upcomingDeadlines = [
    { id: 1, course: "React Masterclass", assignment: "Production Capstone Project", dueDate: "Tomorrow, 11:59 PM" },
    { id: 2, course: "Node.js Architecture", assignment: "Authentication Microservice", dueDate: "Friday, 6:00 PM" },
  ];

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 font-sans antialiased pb-20">
      {/* ─── HEADER BANNER ───────────────────────────────────────────── */}
      <div className="bg-[#0e1322] border-b border-slate-800 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Student Workspace
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
              Welcome back, {currentUser?.username || "Student"}!
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">
              Track your learning progress, resume active lectures, and manage achievements.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/25 text-amber-400 px-3.5 py-1.5 rounded-full text-xs font-bold">
              <FaFire />
              <span>{studentStats.currentStreak} Day Streak</span>
            </div>
            <Link
              to="/courses"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow-md shadow-blue-600/20"
            >
              Explore Courses
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* ─── STATS OVERVIEW CARDS ───────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-[#0f1524] border border-slate-800 rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Enrolled Courses</span>
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <FaBookOpen className="text-sm" />
              </div>
            </div>
            <div className="text-2xl font-black text-white">{studentStats.totalCourses}</div>
            <div className="text-[11px] text-slate-500">{studentStats.inProgressCourses} currently in progress</div>
          </div>

          <div className="bg-[#0f1524] border border-slate-800 rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Completed</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <FaCheckCircle className="text-sm" />
              </div>
            </div>
            <div className="text-2xl font-black text-emerald-400">{studentStats.completedCourses}</div>
            <div className="text-[11px] text-slate-500">40% of curriculum complete</div>
          </div>

          <div className="bg-[#0f1524] border border-slate-800 rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Learning Hours</span>
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <FaClock className="text-sm" />
              </div>
            </div>
            <div className="text-2xl font-black text-purple-400">{studentStats.totalHours}h</div>
            <div className="text-[11px] text-slate-500">Avg 6.8 hours / week</div>
          </div>

          <div className="bg-[#0f1524] border border-slate-800 rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Certificates</span>
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <FaTrophy className="text-sm" />
              </div>
            </div>
            <div className="text-2xl font-black text-amber-400">{studentStats.certificatesEarned}</div>
            <div className="text-[11px] text-slate-500">Ready for resume/LinkedIn</div>
          </div>
        </div>

        {/* ─── 2-COLUMN MAIN + SIDEBAR LAYOUT ─────────────────────────── */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Main Left Column (Continue Learning + Weekly Progress) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Continue Learning */}
            <div className="bg-[#0f1524] border border-slate-800 rounded-2xl overflow-hidden">
              <div className="p-5 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white">Continue Learning</h2>
                  <p className="text-xs text-slate-400">Jump directly back into your recent lessons</p>
                </div>
                <Link to="/courses" className="text-xs font-bold text-blue-400 hover:text-blue-300">
                  View All &rarr;
                </Link>
              </div>

              <div className="divide-y divide-slate-800 p-2">
                {recentCourses.map((c) => (
                  <div
                    key={c.id}
                    className="p-4 rounded-xl hover:bg-slate-800/40 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <img
                        src={c.thumbnail}
                        alt={c.title}
                        className="w-20 h-14 rounded-lg object-cover bg-slate-800 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-white truncate">{c.title}</h3>
                        <p className="text-xs text-slate-400">Instructor: {c.instructor}</p>
                        <p className="text-xs text-blue-400 font-medium truncate mt-0.5">
                          Next: {c.nextLesson}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end flex-shrink-0">
                      <div className="w-24 sm:w-28 space-y-1">
                        <div className="flex justify-between text-[11px] text-slate-400">
                          <span>Progress</span>
                          <span className="font-bold text-white">{c.progress}%</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-blue-500 h-full rounded-full"
                            style={{ width: `${c.progress}%` }}
                          />
                        </div>
                      </div>

                      <Link
                        to="/courses"
                        className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition flex items-center justify-center"
                        title="Continue"
                      >
                        <FaPlay className="text-xs ml-0.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Weekly Learning Activity */}
            <div className="bg-[#0f1524] border border-slate-800 rounded-2xl p-6 space-y-4">
              <div>
                <h3 className="text-lg font-bold text-white">Weekly Learning Activity</h3>
                <p className="text-xs text-slate-400">Minutes spent mastering technical concepts</p>
              </div>

              <div className="h-44 flex items-end justify-between gap-3 pt-4 border-t border-slate-800">
                {[
                  { day: "Mon", val: 65, min: "45m" },
                  { day: "Tue", val: 80, min: "70m" },
                  { day: "Wed", val: 95, min: "90m" },
                  { day: "Thu", val: 85, min: "75m" },
                  { day: "Fri", val: 70, min: "55m" },
                  { day: "Sat", val: 90, min: "80m" },
                  { day: "Sun", val: 100, min: "110m" },
                ].map((item, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <span className="text-[10px] text-blue-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.min}
                    </span>
                    <div
                      className="w-full bg-gradient-to-t from-blue-600 to-indigo-500 rounded-lg group-hover:from-blue-500 group-hover:to-cyan-400 transition-all duration-300"
                      style={{ height: `${item.val}%` }}
                    />
                    <span className="text-xs text-slate-400 font-medium">{item.day}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Right Column (Quick Actions, Achievements, Deadlines) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Quick Actions with Correct Paths */}
            <div className="bg-[#0f1524] border border-slate-800 rounded-2xl p-5 space-y-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Quick Actions</h3>
              <div className="space-y-2">
                <Link
                  to="/courses"
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 text-xs font-semibold text-slate-200 transition"
                >
                  <FaBookOpen className="text-blue-400" />
                  <span>Browse Course Catalog</span>
                  <FaArrowRight className="text-[10px] text-slate-500 ml-auto" />
                </Link>

                <Link
                  to="/assessment"
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 text-xs font-semibold text-slate-200 transition"
                >
                  <FaLightbulb className="text-amber-400" />
                  <span>AI Career Assessment</span>
                  <FaArrowRight className="text-[10px] text-slate-500 ml-auto" />
                </Link>

                <Link
                  to="/settings"
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 text-xs font-semibold text-slate-200 transition"
                >
                  <FaUser className="text-purple-400" />
                  <span>Profile & Security Settings</span>
                  <FaArrowRight className="text-[10px] text-slate-500 ml-auto" />
                </Link>
              </div>
            </div>

            {/* Recent Achievements */}
            <div className="bg-[#0f1524] border border-slate-800 rounded-2xl p-5 space-y-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Recent Achievements</h3>
              <div className="space-y-3">
                {achievements.map((ach) => (
                  <div key={ach.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/60">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center text-sm">
                      <ach.icon />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{ach.title}</p>
                      <p className="text-[10px] text-slate-400">{ach.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Deadlines */}
            <div className="bg-[#0f1524] border border-slate-800 rounded-2xl p-5 space-y-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Upcoming Deadlines</h3>
              <div className="space-y-2.5">
                {upcomingDeadlines.map((d) => (
                  <div key={d.id} className="p-3 rounded-xl bg-slate-900/40 border-l-4 border-blue-500 border-slate-800/60 space-y-1">
                    <p className="text-xs font-bold text-white">{d.assignment}</p>
                    <p className="text-[11px] text-slate-400">{d.course}</p>
                    <p className="text-[10px] text-blue-400 flex items-center gap-1 font-semibold">
                      <FaCalendarAlt />
                      <span>{d.dueDate}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
