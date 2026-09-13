import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import {
  FaBookOpen,
  FaUsers,
  FaDollarSign,
  FaChartLine,
  FaPlus,
  FaEdit,
  FaEye,
  FaStar,
  FaLayerGroup,
  FaArrowRight,
  FaChalkboardTeacher,
} from "react-icons/fa";
import { getAllCoursesAPI } from "../../reactQuery/courses/coursesAPI";

// Clean component that accepts `user` directly from parent Dashboard
const InstructorDashboard = ({ user }) => {
  // Fallback to Redux store only if user prop is missing
  const storeUser = useSelector((state) => state.auth?.userProfile);
  const currentUser = user || storeUser;

  // Fetch all courses to calculate live instructor metrics
  const { data: allCourses = [], isLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: getAllCoursesAPI,
  });

  // Filter courses owned by this instructor
  const instructorId = currentUser?._id;
  const instructorCourses = allCourses.filter(
    (c) =>
      c?.user === instructorId ||
      c?.user?._id === instructorId ||
      currentUser?.coursesCreated?.some((cc) => (typeof cc === "string" ? cc === c._id : cc?._id === c._id))
  );

  // Compute live metrics
  const totalCourses = instructorCourses.length || currentUser?.coursesCreated?.length || 0;
  const totalStudents = instructorCourses.reduce(
    (acc, c) => acc + (c?.students?.length || 0),
    0
  );
  const estimatedRevenue = totalStudents * 49; // Standard course price baseline

  return (
    <div className="min-h-screen bg-[#06080e] text-slate-100 py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[130px] pointer-events-none -z-0" />
      <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        {/* 1. Header Banner */}
        <div className="glass-card rounded-3xl p-8 border border-slate-800/90 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white text-2xl shadow-lg shadow-violet-500/25">
              <FaChalkboardTeacher />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-300 text-xs font-bold uppercase tracking-wider mb-1">
                Instructor Studio
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                Welcome, <span className="gradient-text-aurora">{currentUser?.username || "Instructor"}</span>
              </h1>
              <p className="text-slate-400 text-sm mt-0.5">
                Manage your curriculum, track learner performance, and publish new courses.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/instructor-courses"
              className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-sm font-semibold transition flex items-center gap-2"
            >
              <FaLayerGroup className="text-violet-400" />
              <span>All Courses</span>
            </Link>
            <Link
              to="/instructor-add-course"
              className="px-5 py-2.5 rounded-xl btn-aurora text-white text-sm font-bold shadow-lg shadow-violet-600/30 transition flex items-center gap-2"
            >
              <FaPlus />
              <span>Create Course</span>
            </Link>
          </div>
        </div>

        {/* 2. Key Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="glass-card-interactive rounded-2xl p-6 relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Courses</p>
                <p className="text-3xl font-black text-white mt-1">{totalCourses}</p>
                <p className="text-xs text-emerald-400 flex items-center gap-1 mt-2 font-medium">
                  <FaChartLine />
                  <span>Active in catalog</span>
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-400 text-xl">
                <FaBookOpen />
              </div>
            </div>
          </div>

          <div className="glass-card-interactive rounded-2xl p-6 relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Enrolled Students</p>
                <p className="text-3xl font-black text-white mt-1">{totalStudents.toLocaleString()}</p>
                <p className="text-xs text-emerald-400 flex items-center gap-1 mt-2 font-medium">
                  <FaChartLine />
                  <span>Growing community</span>
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xl">
                <FaUsers />
              </div>
            </div>
          </div>

          <div className="glass-card-interactive rounded-2xl p-6 relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Estimated Revenue</p>
                <p className="text-3xl font-black text-white mt-1">${estimatedRevenue.toLocaleString()}</p>
                <p className="text-xs text-cyan-400 flex items-center gap-1 mt-2 font-medium">
                  <FaDollarSign />
                  <span>$49 avg enrollment</span>
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 text-xl">
                <FaDollarSign />
              </div>
            </div>
          </div>

          <div className="glass-card-interactive rounded-2xl p-6 relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Instructor Rating</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <p className="text-3xl font-black text-white">4.9</p>
                  <div className="flex text-amber-400 text-xs">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-2 font-medium">Top Rated Educator</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-400 text-xl">
                <FaStar />
              </div>
            </div>
          </div>
        </div>

        {/* 3. Main Content: Courses & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Courses List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card rounded-3xl border border-slate-800/90 overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white">My Authored Courses</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Courses currently published or in development</p>
                </div>
                <Link
                  to="/instructor-courses"
                  className="text-xs font-bold text-violet-400 hover:text-violet-300 transition flex items-center gap-1"
                >
                  <span>Manage All</span>
                  <FaArrowRight className="text-[10px]" />
                </Link>
              </div>

              <div className="p-6">
                {isLoading ? (
                  <div className="py-12 text-center text-slate-400 text-sm">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto mb-3" />
                    Loading your courses...
                  </div>
                ) : instructorCourses.length > 0 ? (
                  <div className="space-y-4">
                    {instructorCourses.slice(0, 5).map((course) => (
                      <div
                        key={course._id}
                        className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-700 transition"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="w-14 h-14 rounded-lg bg-slate-800 flex items-center justify-center text-blue-400 flex-shrink-0 text-xl overflow-hidden">
                            <FaBookOpen />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-sm font-bold text-white truncate hover:text-blue-400 transition">
                              <Link to={`/instructor-courses/${course._id}`}>{course.title}</Link>
                            </h3>
                            <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                              <span className="flex items-center gap-1 text-slate-300">
                                <FaUsers className="text-blue-400 text-[10px]" />
                                {course.students?.length || 0} students
                              </span>
                              <span>•</span>
                              <span className="capitalize text-emerald-400 font-medium">
                                {course.difficulty || "Beginner"}
                              </span>
                              <span>•</span>
                              <span>{course.duration || 12}h total</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Link
                            to={`/instructor-courses/${course._id}`}
                            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                            title="View Course Details"
                          >
                            <FaEye className="text-xs" />
                          </Link>
                          <Link
                            to={`/instructor-update-course/${course._id}`}
                            className="p-2 rounded-lg bg-violet-500/10 hover:bg-violet-500/20 text-violet-400 transition"
                            title="Edit Course"
                          >
                            <FaEdit className="text-xs" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-center text-slate-400 text-2xl mx-auto">
                      <FaBookOpen />
                    </div>
                    <h3 className="text-base font-bold text-white">No courses created yet</h3>
                    <p className="text-slate-400 text-xs max-w-sm mx-auto">
                      Start sharing your expertise by creating your very first course curriculum.
                    </p>
                    <Link
                      to="/instructor-add-course"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl btn-aurora text-white text-xs font-bold shadow-lg shadow-violet-600/30 transition"
                    >
                      <FaPlus />
                      <span>Create Your First Course</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Studio Tools */}
          <div className="space-y-6">
            <div className="glass-card rounded-3xl border border-slate-800/90 p-6 shadow-2xl space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Quick Actions</h3>
              <div className="space-y-2.5">
                <Link
                  to="/instructor-add-course"
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 hover:bg-violet-900/20 border border-slate-800 hover:border-violet-500/40 text-slate-200 text-xs font-semibold transition group"
                >
                  <span className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-violet-500/15 text-violet-400 flex items-center justify-center">
                      <FaPlus />
                    </div>
                    <span>Create New Course</span>
                  </span>
                  <FaArrowRight className="text-[10px] text-slate-500 group-hover:text-violet-400 group-hover:translate-x-0.5 transition" />
                </Link>

                <Link
                  to="/instructor-courses"
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 hover:bg-indigo-900/20 border border-slate-800 hover:border-indigo-500/40 text-slate-200 text-xs font-semibold transition group"
                >
                  <span className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/15 text-indigo-400 flex items-center justify-center">
                      <FaLayerGroup />
                    </div>
                    <span>Manage Courses</span>
                  </span>
                  <FaArrowRight className="text-[10px] text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition" />
                </Link>

                <Link
                  to="/courses"
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 hover:bg-emerald-900/20 border border-slate-800 hover:border-emerald-500/40 text-slate-200 text-xs font-semibold transition group"
                >
                  <span className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                      <FaEye />
                    </div>
                    <span>Browse Public Catalog</span>
                  </span>
                  <FaArrowRight className="text-[10px] text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition" />
                </Link>
              </div>
            </div>

            {/* Instructor Tips Box */}
            <div className="glass-card rounded-3xl border border-violet-500/25 p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-full blur-2xl pointer-events-none" />
              <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-violet-400" />
                <span>Teaching Pro Tip</span>
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Courses structured with 5-7 bite-sized modules and video walkthroughs achieve a 45% higher student completion rate and better student reviews.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
