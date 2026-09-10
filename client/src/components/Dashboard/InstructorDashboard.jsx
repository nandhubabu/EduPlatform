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
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        {/* 1. Header Banner */}
        <div className="bg-[#0f1524]/90 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-2xl shadow-lg shadow-blue-500/20">
              <FaChalkboardTeacher />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-1">
                Instructor Studio
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                Welcome, {currentUser?.username || "Instructor"}
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
              <FaLayerGroup className="text-blue-400" />
              <span>All Courses</span>
            </Link>
            <Link
              to="/instructor-add-course"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold shadow-lg shadow-blue-600/30 transition flex items-center gap-2"
            >
              <FaPlus />
              <span>Create Course</span>
            </Link>
          </div>
        </div>

        {/* 2. Key Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-[#0f1524] border border-slate-800/90 rounded-2xl p-6 relative overflow-hidden group hover:border-slate-700 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Courses</p>
                <p className="text-3xl font-extrabold text-white mt-1">{totalCourses}</p>
                <p className="text-xs text-emerald-400 flex items-center gap-1 mt-2 font-medium">
                  <FaChartLine />
                  <span>Active in catalog</span>
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 text-xl">
                <FaBookOpen />
              </div>
            </div>
          </div>

          <div className="bg-[#0f1524] border border-slate-800/90 rounded-2xl p-6 relative overflow-hidden group hover:border-slate-700 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Enrolled Students</p>
                <p className="text-3xl font-extrabold text-white mt-1">{totalStudents.toLocaleString()}</p>
                <p className="text-xs text-emerald-400 flex items-center gap-1 mt-2 font-medium">
                  <FaChartLine />
                  <span>Growing community</span>
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-xl">
                <FaUsers />
              </div>
            </div>
          </div>

          <div className="bg-[#0f1524] border border-slate-800/90 rounded-2xl p-6 relative overflow-hidden group hover:border-slate-700 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Estimated Revenue</p>
                <p className="text-3xl font-extrabold text-white mt-1">${estimatedRevenue.toLocaleString()}</p>
                <p className="text-xs text-blue-400 flex items-center gap-1 mt-2 font-medium">
                  <FaDollarSign />
                  <span>$49 avg enrollment</span>
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 text-xl">
                <FaDollarSign />
              </div>
            </div>
          </div>

          <div className="bg-[#0f1524] border border-slate-800/90 rounded-2xl p-6 relative overflow-hidden group hover:border-slate-700 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Instructor Rating</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <p className="text-3xl font-extrabold text-white">4.9</p>
                  <div className="flex text-amber-400 text-xs">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-2 font-medium">Top Rated Educator</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 text-xl">
                <FaStar />
              </div>
            </div>
          </div>
        </div>

        {/* 3. Main Content: Courses & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Courses List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#0f1524] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white">My Authored Courses</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Courses currently published or in development</p>
                </div>
                <Link
                  to="/instructor-courses"
                  className="text-xs font-bold text-blue-400 hover:text-blue-300 transition flex items-center gap-1"
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
                            className="p-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition"
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
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition"
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
            <div className="bg-[#0f1524] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Quick Actions</h3>
              <div className="space-y-2">
                <Link
                  to="/instructor-add-course"
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 text-slate-200 text-sm font-medium transition"
                >
                  <span className="flex items-center gap-3">
                    <FaPlus className="text-blue-400" />
                    <span>Create New Course</span>
                  </span>
                  <FaArrowRight className="text-xs text-slate-500" />
                </Link>

                <Link
                  to="/instructor-courses"
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 text-slate-200 text-sm font-medium transition"
                >
                  <span className="flex items-center gap-3">
                    <FaLayerGroup className="text-indigo-400" />
                    <span>Manage Courses</span>
                  </span>
                  <FaArrowRight className="text-xs text-slate-500" />
                </Link>

                <Link
                  to="/courses"
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 text-slate-200 text-sm font-medium transition"
                >
                  <span className="flex items-center gap-3">
                    <FaEye className="text-emerald-400" />
                    <span>Browse Public Catalog</span>
                  </span>
                  <FaArrowRight className="text-xs text-slate-500" />
                </Link>
              </div>
            </div>

            {/* Instructor Tips Box */}
            <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/20 rounded-2xl p-6">
              <h4 className="text-sm font-bold text-white mb-2">Teaching Tip</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Courses structured with 5-7 bite-sized modules and video walkthroughs have a 45% higher student completion rate.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
