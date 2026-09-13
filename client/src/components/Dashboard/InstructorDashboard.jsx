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
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Subtle Background Highlights */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[130px] pointer-events-none -z-0" />
      <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-sky-500/5 rounded-full blur-[140px] pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        {/* 1. Header Banner */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-2xl shadow-md">
              <FaChalkboardTeacher />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-1">
                Instructor Studio
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                Welcome, <span className="text-indigo-600">{currentUser?.username || "Instructor"}</span>
              </h1>
              <p className="text-slate-600 text-sm mt-0.5">
                Manage your curriculum, track learner performance, and publish new courses.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/instructor-courses"
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-sm font-semibold transition flex items-center gap-2"
            >
              <FaLayerGroup className="text-indigo-600" />
              <span>All Courses</span>
            </Link>
            <Link
              to="/instructor-add-course"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-sm transition flex items-center gap-2"
            >
              <FaPlus />
              <span>Create Course</span>
            </Link>
          </div>
        </div>

        {/* 2. Key Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="glass-card-interactive rounded-2xl p-6 relative overflow-hidden group bg-white border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Courses</p>
                <p className="text-3xl font-black text-slate-900 mt-1">{totalCourses}</p>
                <p className="text-xs text-emerald-600 flex items-center gap-1 mt-2 font-medium">
                  <FaChartLine />
                  <span>Active in catalog</span>
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 text-xl">
                <FaBookOpen />
              </div>
            </div>
          </div>

          <div className="glass-card-interactive rounded-2xl p-6 relative overflow-hidden group bg-white border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Enrolled Students</p>
                <p className="text-3xl font-black text-slate-900 mt-1">{totalStudents.toLocaleString()}</p>
                <p className="text-xs text-emerald-600 flex items-center gap-1 mt-2 font-medium">
                  <FaChartLine />
                  <span>Growing community</span>
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 text-xl">
                <FaUsers />
              </div>
            </div>
          </div>

          <div className="glass-card-interactive rounded-2xl p-6 relative overflow-hidden group bg-white border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Estimated Revenue</p>
                <p className="text-3xl font-black text-slate-900 mt-1">${estimatedRevenue.toLocaleString()}</p>
                <p className="text-xs text-sky-600 flex items-center gap-1 mt-2 font-medium">
                  <FaDollarSign />
                  <span>$49 avg enrollment</span>
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 text-xl">
                <FaDollarSign />
              </div>
            </div>
          </div>

          <div className="glass-card-interactive rounded-2xl p-6 relative overflow-hidden group bg-white border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Instructor Rating</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <p className="text-3xl font-black text-slate-900">4.9</p>
                  <div className="flex text-amber-400 text-xs">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-2 font-medium">Top Rated Educator</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 text-xl">
                <FaStar />
              </div>
            </div>
          </div>
        </div>

        {/* 3. Main Content: Courses & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Courses List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">My Authored Courses</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Courses currently published or in development</p>
                </div>
                <Link
                  to="/instructor-courses"
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition flex items-center gap-1"
                >
                  <span>Manage All</span>
                  <FaArrowRight className="text-[10px]" />
                </Link>
              </div>

              <div className="p-6">
                {isLoading ? (
                  <div className="py-12 text-center text-slate-500 text-sm">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600 mx-auto mb-3" />
                    Loading your courses...
                  </div>
                ) : instructorCourses.length > 0 ? (
                  <div className="space-y-4">
                    {instructorCourses.slice(0, 5).map((course) => (
                      <div
                        key={course._id}
                        className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-indigo-300 transition"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="w-14 h-14 rounded-lg bg-slate-100 flex items-center justify-center text-indigo-600 flex-shrink-0 text-xl overflow-hidden">
                            <FaBookOpen />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-sm font-bold text-slate-900 truncate hover:text-indigo-600 transition">
                              <Link to={`/instructor-courses/${course._id}`}>{course.title}</Link>
                            </h3>
                            <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                              <span className="flex items-center gap-1 text-slate-700">
                                <FaUsers className="text-indigo-600 text-[10px]" />
                                {course.students?.length || 0} students
                              </span>
                              <span>•</span>
                              <span className="capitalize text-emerald-700 font-medium">
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
                            className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition"
                            title="View Course Details"
                          >
                            <FaEye className="text-xs" />
                          </Link>
                          <Link
                            to={`/instructor-update-course/${course._id}`}
                            className="p-2 rounded-lg bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-700 transition"
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
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 text-2xl mx-auto">
                      <FaBookOpen />
                    </div>
                    <h3 className="text-base font-bold text-slate-900">No courses created yet</h3>
                    <p className="text-slate-500 text-xs max-w-sm mx-auto">
                      Start sharing your expertise by creating your very first course curriculum.
                    </p>
                    <Link
                      to="/instructor-add-course"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition"
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
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Quick Actions</h3>
              <div className="space-y-2.5">
                <Link
                  to="/instructor-add-course"
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-slate-800 hover:text-indigo-700 text-xs font-semibold transition group"
                >
                  <span className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                      <FaPlus />
                    </div>
                    <span>Create New Course</span>
                  </span>
                  <FaArrowRight className="text-[10px] text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition" />
                </Link>

                <Link
                  to="/instructor-courses"
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-slate-800 hover:text-indigo-700 text-xs font-semibold transition group"
                >
                  <span className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                      <FaLayerGroup />
                    </div>
                    <span>Manage Courses</span>
                  </span>
                  <FaArrowRight className="text-[10px] text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition" />
                </Link>

                <Link
                  to="/courses"
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 text-slate-800 hover:text-emerald-800 text-xs font-semibold transition group"
                >
                  <span className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <FaEye />
                    </div>
                    <span>Browse Public Catalog</span>
                  </span>
                  <FaArrowRight className="text-[10px] text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition" />
                </Link>
              </div>
            </div>

            {/* Instructor Tips Box */}
            <div className="bg-white rounded-3xl border border-indigo-100 p-6 shadow-sm relative overflow-hidden">
              <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-600" />
                <span>Teaching Pro Tip</span>
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
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
