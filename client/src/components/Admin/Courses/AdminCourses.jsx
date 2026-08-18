import { useQuery } from "@tanstack/react-query";
import React from "react";
import {
  FaBookOpen,
  FaUser,
  FaUsers,
  FaLayerGroup,
  FaPlus,
  FaArrowLeft,
  FaCalendarAlt,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { getAllCoursesAPI } from "../../../reactQuery/courses/coursesAPI";
import { useSelector } from "react-redux";

const AdminCourses = () => {
  const navigate = useNavigate();
  const { data, error, isLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: getAllCoursesAPI,
  });

  const { userProfile, loading: userLoading } = useSelector((state) => state.auth);

  // Defensive: userProfile or coursesCreated may be undefined
  const userCourses = userProfile?.coursesCreated ?? [];

  // Loading state
  if (userLoading || isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0d14] flex items-center justify-center relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="text-center relative z-10">
          <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-purple-500 mx-auto shadow-[0_0_15px_rgba(168,85,247,0.2)]"></div>
          <p className="text-slate-400 mt-6 text-lg font-medium">Loading your courses...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0d14] flex items-center justify-center relative overflow-hidden px-4">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="bg-white/3 backdrop-blur-xl border border-white/5 p-8 rounded-2xl shadow-2xl w-full max-w-md text-center relative z-10">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-2">Error Loading Courses</h2>
          <p className="text-slate-400 mb-6">
            {error?.response?.data?.message || "Something went wrong while fetching your courses."}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:opacity-90 text-white font-semibold px-6 py-2.5 rounded-xl transition duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0d14] text-slate-100 relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <button
                onClick={() => navigate("/dashboard")}
                className="text-slate-400 hover:text-white transition duration-200 flex items-center space-x-1 text-sm font-medium"
              >
                <FaArrowLeft className="text-xs" />
                <span>Dashboard</span>
              </button>
            </div>
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Manage Your Courses
            </h1>
            <p className="text-slate-400 mt-2">Create, update, and monitor student enrollment across your courses.</p>
          </div>
          <Link
            to="/instructor-add-course"
            className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-cyan-500 hover:opacity-90 text-white font-semibold px-6 py-3.5 rounded-xl transition duration-200 shadow-[0_0_20px_rgba(124,58,237,0.25)] self-start md:self-auto"
          >
            <FaPlus />
            <span>Create Course</span>
          </Link>
        </div>

        {/* Show message if no courses */}
        {userCourses.length === 0 ? (
          <div className="bg-white/3 backdrop-blur-xl border border-white/5 rounded-2xl p-16 text-center shadow-xl">
            <FaBookOpen className="mx-auto text-slate-500 text-6xl mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">No Courses Found</h2>
            <p className="text-slate-400 max-w-md mx-auto mb-8">
              It looks like you haven't created any courses yet. Get started by creating your very first course today.
            </p>
            <Link
              to="/instructor-add-course"
              className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-cyan-500 hover:opacity-90 text-white font-semibold px-6 py-3 rounded-xl transition duration-200"
            >
              <FaPlus />
              <span>Create Course Now</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {userCourses.map((course) => {
              const difficultyLower = course?.difficulty?.toLowerCase() || "";
              const difficultyBadgeClass =
                difficultyLower === "easy"
                  ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
                  : difficultyLower === "medium"
                  ? "bg-purple-500/10 text-purple-300 border-purple-500/20"
                  : "bg-rose-500/10 text-rose-300 border-rose-500/20";

              return (
                <Link
                  key={course._id}
                  to={`/instructor-courses/${course._id}`}
                  className="group bg-white/3 backdrop-blur-xl border border-white/5 hover:border-purple-500/20 hover:shadow-[0_0_30px_rgba(124,58,237,0.15)] rounded-2xl transition duration-300 flex flex-col justify-between overflow-hidden shadow-xl"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="h-12 w-12 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/25 rounded-xl flex items-center justify-center shadow-inner group-hover:scale-110 transition duration-300">
                        <FaBookOpen className="text-purple-400 text-xl" />
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${difficultyBadgeClass}`}>
                        {course?.difficulty ? course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1) : "N/A"}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-purple-300 transition duration-200">
                      {course?.title}
                    </h3>
                    <p className="text-slate-400 text-sm mb-6 line-clamp-2 leading-relaxed">
                      {course?.description || "No description provided."}
                    </p>

                    <div className="space-y-3 pt-4 border-t border-white/5 text-xs text-slate-400">
                      {/* Instructor */}
                      <div className="flex items-center justify-between">
                        <span className="flex items-center space-x-2">
                          <FaUser className="text-slate-500" />
                          <span>Instructor</span>
                        </span>
                        <span className="text-slate-200 font-medium">{course?.user?.username ?? "Unknown"}</span>
                      </div>

                      {/* Total students */}
                      <div className="flex items-center justify-between">
                        <span className="flex items-center space-x-2">
                          <FaUsers className="text-slate-500" />
                          <span>Students Enrolled</span>
                        </span>
                        <span className="text-slate-200 font-semibold">{course?.students?.length ?? 0}</span>
                      </div>

                      {/* Total sections */}
                      <div className="flex items-center justify-between">
                        <span className="flex items-center space-x-2">
                          <FaLayerGroup className="text-slate-500" />
                          <span>Course Sections</span>
                        </span>
                        <span className="text-slate-200 font-semibold">{course?.sections?.length ?? 0} Sections</span>
                      </div>

                      {/* Date Created */}
                      <div className="flex items-center justify-between">
                        <span className="flex items-center space-x-2">
                          <FaCalendarAlt className="text-slate-500" />
                          <span>Created Date</span>
                        </span>
                        <span className="text-slate-300">
                          {course?.createdAt ? new Date(course.createdAt).toLocaleDateString() : "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="px-6 py-4 bg-white/[0.02] border-t border-white/5 flex items-center justify-between group-hover:bg-purple-500/5 transition duration-300">
                    <span className="text-sm font-semibold text-purple-400 group-hover:text-purple-300 transition duration-200">
                      Manage Course
                    </span>
                    <span className="text-xs text-slate-500 group-hover:translate-x-1 transition duration-200">
                      ➔
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCourses;
