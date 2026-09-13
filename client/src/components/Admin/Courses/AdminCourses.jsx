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
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="text-slate-500 mt-6 text-base font-semibold">Loading your courses...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-4">
        <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-xl w-full max-w-md text-center">
          <div className="text-rose-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Error Loading Courses</h2>
          <p className="text-slate-600 mb-6 text-sm">
            {error?.response?.data?.message || "Something went wrong while fetching your courses."}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2.5 rounded-xl transition duration-150 shadow"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <button
                onClick={() => navigate("/dashboard")}
                className="text-slate-500 hover:text-slate-900 transition duration-150 flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider"
              >
                <FaArrowLeft className="text-[10px]" />
                <span>Dashboard</span>
              </button>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Manage Your Courses
            </h1>
            <p className="text-slate-500 font-medium text-base mt-1">Create, update, and monitor student enrollment across your courses.</p>
          </div>
          <Link
            to="/instructor-add-course"
            className="inline-flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3.5 rounded-xl transition duration-150 shadow-lg shadow-indigo-600/20 self-start md:self-auto text-sm"
          >
            <FaPlus />
            <span>Create Course</span>
          </Link>
        </div>

        {/* Show message if no courses */}
        {userCourses.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center shadow-sm">
            <FaBookOpen className="mx-auto text-slate-300 text-6xl mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">No Courses Found</h2>
            <p className="text-slate-500 max-w-md mx-auto mb-8 font-medium text-sm">
              It looks like you haven't created any courses yet. Get started by creating your very first course today.
            </p>
            <Link
              to="/instructor-add-course"
              className="inline-flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl transition duration-150 shadow-md shadow-indigo-600/20 text-sm"
            >
              <FaPlus />
              <span>Create Course Now</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userCourses.map((course) => {
              const difficultyLower = course?.difficulty?.toLowerCase() || "";
              const difficultyBadgeClass =
                difficultyLower === "easy"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : difficultyLower === "medium"
                  ? "bg-amber-50 text-amber-700 border-amber-200"
                  : "bg-rose-50 text-rose-700 border-rose-200";

              return (
                <Link
                  key={course._id}
                  to={`/instructor-courses/${course._id}`}
                  className="group bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-lg rounded-2xl transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-sm"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="h-12 w-12 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition duration-200">
                        <FaBookOpen className="text-indigo-600 text-xl" />
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${difficultyBadgeClass}`}>
                        {course?.difficulty ? course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1) : "N/A"}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-1 group-hover:text-indigo-600 transition duration-150">
                      {course?.title}
                    </h3>
                    <p className="text-slate-600 text-sm mb-6 line-clamp-2 leading-relaxed">
                      {course?.description || "No description provided."}
                    </p>

                    <div className="space-y-2.5 pt-4 border-t border-slate-100 text-xs text-slate-500 font-medium">
                      {/* Instructor */}
                      <div className="flex items-center justify-between">
                        <span className="flex items-center space-x-2">
                          <FaUser className="text-slate-400" />
                          <span>Instructor</span>
                        </span>
                        <span className="text-slate-800 font-semibold">{course?.user?.username ?? "Unknown"}</span>
                      </div>

                      {/* Total students */}
                      <div className="flex items-center justify-between">
                        <span className="flex items-center space-x-2">
                          <FaUsers className="text-slate-400" />
                          <span>Students Enrolled</span>
                        </span>
                        <span className="text-slate-800 font-semibold">{course?.students?.length ?? 0}</span>
                      </div>

                      {/* Total sections */}
                      <div className="flex items-center justify-between">
                        <span className="flex items-center space-x-2">
                          <FaLayerGroup className="text-slate-400" />
                          <span>Course Sections</span>
                        </span>
                        <span className="text-slate-800 font-semibold">{course?.sections?.length ?? 0} Sections</span>
                      </div>

                      {/* Date Created */}
                      <div className="flex items-center justify-between">
                        <span className="flex items-center space-x-2">
                          <FaCalendarAlt className="text-slate-400" />
                          <span>Created Date</span>
                        </span>
                        <span className="text-slate-600">
                          {course?.createdAt ? new Date(course.createdAt).toLocaleDateString() : "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between group-hover:bg-indigo-50/50 transition duration-150">
                    <span className="text-xs font-bold text-indigo-600">
                      Manage Course
                    </span>
                    <span className="text-xs text-slate-400 group-hover:translate-x-1 group-hover:text-indigo-600 transition duration-150">
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
