import { useMutation, useQuery } from "@tanstack/react-query";
import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  FaLayerGroup,
  FaBookOpen,
  FaUser,
  FaUsers,
  FaEdit,
  FaTrash,
  FaListUl,
  FaPlusCircle,
  FaTrophy,
  FaArrowLeft,
  FaSpinner,
} from "react-icons/fa";
import {
  deleteCourseAPI,
  getSingleCourseAPI,
} from "../../../reactQuery/courses/coursesAPI";
import AlertMessage from "../../Alert/AlertMessage";

const AdminCourseDetails = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  // query to fetch single course
  const {
    data: courseData,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => getSingleCourseAPI(courseId),
    enabled: !!courseId,
  });

  // delete course mutation
  const mutation = useMutation({
    mutationFn: deleteCourseAPI,
    onSuccess: () => {
      setTimeout(() => {
        navigate("/instructor-courses");
      }, 1500);
    },
  });

  // handle delete
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this course? This action cannot be undone.")) {
      mutation.mutate(courseId);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0d14] flex items-center justify-center relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="text-center relative z-10">
          <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-purple-500 mx-auto shadow-[0_0_15px_rgba(168,85,247,0.2)]"></div>
          <p className="text-slate-400 mt-6 text-lg font-medium">Loading course details...</p>
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
          <h2 className="text-2xl font-bold text-white mb-2">Error Loading Course</h2>
          <p className="text-slate-400 mb-6">
            {error?.response?.data?.message || "Something went wrong while fetching course details."}
          </p>
          <button
            onClick={() => navigate("/instructor-courses")}
            className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:opacity-90 text-white font-semibold px-6 py-2.5 rounded-xl transition duration-200"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  const difficultyLower = courseData?.difficulty?.toLowerCase() || "";
  const difficultyBadgeClass =
    difficultyLower === "easy"
      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
      : difficultyLower === "medium"
      ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
      : "bg-rose-500/10 text-rose-400 border-rose-500/20";

  return (
    <div className="min-h-screen bg-[#0a0d14] text-slate-100 relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Back navigation */}
        <div className="mb-6 flex justify-start">
          <button
            onClick={() => navigate("/instructor-courses")}
            className="flex items-center text-slate-400 hover:text-white transition duration-200 text-sm font-medium"
          >
            <FaArrowLeft className="mr-2 text-xs" />
            Back to Courses
          </button>
        </div>

        {/* Main Header Container */}
        <div className="bg-white/3 backdrop-blur-xl border border-white/5 shadow-2xl p-8 rounded-3xl mb-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
            <div className="flex items-start space-x-5">
              <div className="h-14 w-14 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.3)] mt-1 flex-shrink-0">
                <FaBookOpen className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-white leading-tight">
                  {courseData?.title}
                </h1>
                <div className="flex items-center space-x-3 mt-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${difficultyBadgeClass}`}>
                    {courseData?.difficulty ? courseData.difficulty.charAt(0).toUpperCase() + courseData.difficulty.slice(1) : "N/A"}
                  </span>
                  <span className="text-xs text-slate-400">
                    Duration: <strong className="text-slate-200">{courseData?.duration} hours</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-slate-300 text-base leading-relaxed border-t border-white/5 pt-6">
            {courseData?.description || "No description provided."}
          </p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Instructor Info */}
          <div className="bg-white/3 backdrop-blur-xl border border-white/5 p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
              <FaUser className="text-purple-400" />
              <span>Instructor Profile</span>
            </h3>
            <div className="flex items-center space-x-3 p-4 bg-[#090b11]/40 border border-white/5 rounded-xl">
              <div className="h-10 w-10 bg-purple-500/10 rounded-full flex items-center justify-center text-purple-300 font-semibold border border-purple-500/20">
                {courseData?.user?.username?.charAt(0).toUpperCase() || "I"}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{courseData?.user?.username || "Unknown"}</p>
                <p className="text-xs text-slate-500">Course Creator</p>
              </div>
            </div>
          </div>

          {/* Stats Info */}
          <div className="bg-white/3 backdrop-blur-xl border border-white/5 p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
              <FaLayerGroup className="text-cyan-400" />
              <span>Course Analytics</span>
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-[#090b11]/40 border border-white/5 rounded-xl text-center">
                <FaUsers className="mx-auto text-slate-400 text-lg mb-2" />
                <p className="text-2xl font-bold text-white">{courseData?.students?.length ?? 0}</p>
                <p className="text-xs text-slate-500 mt-1">Enrolled Students</p>
              </div>
              <div className="p-4 bg-[#090b11]/40 border border-white/5 rounded-xl text-center">
                <FaLayerGroup className="mx-auto text-slate-400 text-lg mb-2" />
                <p className="text-2xl font-bold text-white">{courseData?.sections?.length ?? 0}</p>
                <p className="text-xs text-slate-500 mt-1">Total Sections</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action feedback */}
        {(mutation.isPending || mutation.isError || mutation.isSuccess) && (
          <div className="mb-6">
            {mutation.isPending && (
              <div className="bg-purple-950/40 border border-purple-500/20 text-purple-300 p-4 rounded-xl flex items-center">
                <FaSpinner className="animate-spin mr-3 text-purple-400" />
                <span>Deleting course...</span>
              </div>
            )}
            {mutation.isError && (
              <AlertMessage
                type="error"
                message={
                  mutation?.error?.response?.data?.message ||
                  mutation?.error?.message ||
                  "An error occurred while deleting the course."
                }
              />
            )}
            {mutation.isSuccess && (
              <AlertMessage
                type="success"
                message="Course deleted successfully! Redirecting..."
              />
            )}
          </div>
        )}

        {/* Management Actions */}
        <div className="bg-white/3 backdrop-blur-xl border border-white/5 p-8 rounded-3xl">
          <h3 className="text-lg font-bold text-white mb-6">Course Management Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              to={`/students-position/${courseId}`}
              className="flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600/20 to-purple-500/10 hover:from-purple-600/30 border border-purple-500/30 text-purple-300 font-semibold py-3.5 px-4 rounded-xl transition duration-200"
            >
              <FaTrophy className="text-sm" />
              <span>Students Ranking</span>
            </Link>

            <Link
              to={`/instructor-add-course-sections/${courseId}`}
              className="flex items-center justify-center space-x-2 bg-gradient-to-r from-cyan-600/20 to-cyan-500/10 hover:from-cyan-600/30 border border-cyan-500/30 text-cyan-300 font-semibold py-3.5 px-4 rounded-xl transition duration-200"
            >
              <FaPlusCircle className="text-sm" />
              <span>Add Course Section</span>
            </Link>

            <Link
              to={`/instructor-course-sections/${courseId}`}
              className="flex items-center justify-center space-x-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white font-semibold py-3.5 px-4 rounded-xl transition duration-200"
            >
              <FaListUl className="text-sm" />
              <span>View Course Sections</span>
            </Link>

            <Link
              to={`/instructor-update-course/${courseId}`}
              className="flex items-center justify-center space-x-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-300 font-semibold py-3.5 px-4 rounded-xl transition duration-200"
            >
              <FaEdit className="text-sm" />
              <span>Update Course</span>
            </Link>
          </div>

          <div className="mt-6 pt-6 border-t border-white/5 flex justify-end">
            <button
              onClick={handleDelete}
              className="flex items-center space-x-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/25 text-red-400 hover:text-red-300 font-semibold py-3 px-6 rounded-xl transition duration-200"
            >
              <FaTrash className="text-xs" />
              <span>Delete Course</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCourseDetails;
