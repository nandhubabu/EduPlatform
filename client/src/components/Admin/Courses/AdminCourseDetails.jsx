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
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="text-slate-500 mt-6 text-base font-semibold">Loading course details...</p>
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
          <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Error Loading Course</h2>
          <p className="text-slate-600 mb-6 text-sm">
            {error?.response?.data?.message || "Something went wrong while fetching course details."}
          </p>
          <button
            onClick={() => navigate("/instructor-courses")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2.5 rounded-xl transition duration-150 shadow"
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
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : difficultyLower === "medium"
      ? "bg-amber-50 text-amber-700 border-amber-200"
      : "bg-rose-50 text-rose-700 border-rose-200";

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back navigation */}
        <div className="mb-6 flex justify-start">
          <button
            onClick={() => navigate("/instructor-courses")}
            className="flex items-center text-slate-500 hover:text-slate-900 transition duration-150 text-xs font-bold uppercase tracking-wider"
          >
            <FaArrowLeft className="mr-2 text-[10px]" />
            Back to Courses
          </button>
        </div>

        {/* Main Header Container */}
        <div className="bg-white border border-slate-200 shadow-sm p-8 rounded-3xl mb-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
            <div className="flex items-start space-x-5">
              <div className="h-14 w-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20 mt-1 flex-shrink-0">
                <FaBookOpen className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900 leading-tight tracking-tight">
                  {courseData?.title}
                </h1>
                <div className="flex items-center space-x-3 mt-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${difficultyBadgeClass}`}>
                    {courseData?.difficulty ? courseData.difficulty.charAt(0).toUpperCase() + courseData.difficulty.slice(1) : "N/A"}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    Duration: <strong className="text-slate-800">{courseData?.duration} hours</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-slate-600 text-base leading-relaxed border-t border-slate-100 pt-6 font-normal">
            {courseData?.description || "No description provided."}
          </p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Instructor Info */}
          <div className="bg-white border border-slate-200 shadow-sm p-6 rounded-2xl">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center space-x-2">
              <FaUser className="text-indigo-600" />
              <span>Instructor Profile</span>
            </h3>
            <div className="flex items-center space-x-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="h-10 w-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 font-bold border border-indigo-100">
                {courseData?.user?.username?.charAt(0).toUpperCase() || "I"}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">{courseData?.user?.username || "Unknown"}</p>
                <p className="text-xs text-slate-500 font-medium">Course Creator</p>
              </div>
            </div>
          </div>

          {/* Stats Info */}
          <div className="bg-white border border-slate-200 shadow-sm p-6 rounded-2xl">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center space-x-2">
              <FaLayerGroup className="text-indigo-600" />
              <span>Course Analytics</span>
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center">
                <FaUsers className="mx-auto text-slate-400 text-lg mb-2" />
                <p className="text-2xl font-extrabold text-slate-900">{courseData?.students?.length ?? 0}</p>
                <p className="text-xs text-slate-500 font-medium mt-1">Enrolled Students</p>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center">
                <FaLayerGroup className="mx-auto text-slate-400 text-lg mb-2" />
                <p className="text-2xl font-extrabold text-slate-900">{courseData?.sections?.length ?? 0}</p>
                <p className="text-xs text-slate-500 font-medium mt-1">Total Sections</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action feedback */}
        {(mutation.isPending || mutation.isError || mutation.isSuccess) && (
          <div className="mb-6">
            {mutation.isPending && (
              <div className="bg-indigo-50 border border-indigo-200 text-indigo-900 p-4 rounded-xl flex items-center text-sm font-semibold">
                <FaSpinner className="animate-spin mr-3 text-indigo-600" />
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
        <div className="bg-white border border-slate-200 shadow-sm p-8 rounded-3xl">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Course Management Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              to={`/students-position/${courseId}`}
              className="flex items-center justify-center space-x-2 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 font-bold py-3.5 px-4 rounded-xl transition duration-150 text-sm"
            >
              <FaTrophy className="text-sm" />
              <span>Students Ranking</span>
            </Link>

            <Link
              to={`/instructor-add-course-sections/${courseId}`}
              className="flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl transition duration-150 shadow-md shadow-indigo-600/20 text-sm"
            >
              <FaPlusCircle className="text-sm" />
              <span>Add Course Section</span>
            </Link>

            <Link
              to={`/instructor-course-sections/${courseId}`}
              className="flex items-center justify-center space-x-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold py-3.5 px-4 rounded-xl transition duration-150 text-sm"
            >
              <FaListUl className="text-sm" />
              <span>View Course Sections</span>
            </Link>

            <Link
              to={`/instructor-update-course/${courseId}`}
              className="flex items-center justify-center space-x-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 font-bold py-3.5 px-4 rounded-xl transition duration-150 text-sm"
            >
              <FaEdit className="text-sm" />
              <span>Update Course</span>
            </Link>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100 flex justify-end">
            <button
              onClick={handleDelete}
              className="flex items-center space-x-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold py-3 px-6 rounded-xl transition duration-150 text-sm"
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
