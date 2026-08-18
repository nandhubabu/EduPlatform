import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FaEdit, FaArrowLeft, FaSpinner, FaClock } from "react-icons/fa";
import AlertMessage from "../../Alert/AlertMessage";
import {
  getSingleCourseAPI,
  updateCourseAPI,
} from "../../../reactQuery/courses/coursesAPI";

// Validation schema
const validationSchema = Yup.object({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters")
    .required("Title is required"),
  description: Yup.string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters")
    .required("Description is required"),
  difficulty: Yup.string()
    .oneOf(["easy", "medium", "hard"], "Please select a valid difficulty")
    .required("Difficulty is required"),
  duration: Yup.number()
    .positive("Duration must be a positive number")
    .integer("Duration must be a whole number")
    .min(1, "Duration must be at least 1 hour")
    .max(1000, "Duration must be less than 1000 hours")
    .required("Duration is required"),
});

const UpdateCourse = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();

  // Fetch course data
  const {
    data: courseDetails,
    error: fetchError,
    isLoading: isFetching,
  } = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => getSingleCourseAPI(courseId),
    enabled: !!courseId,
  });

  // Update mutation
  const mutation = useMutation({
    mutationFn: updateCourseAPI,
    onSuccess: () => {
      // Redirect to the course details page after success
      setTimeout(() => {
        navigate(`/instructor-courses/${courseId}`);
      }, 1500);
    },
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      title: courseDetails?.title || "",
      description: courseDetails?.description || "",
      difficulty: courseDetails?.difficulty || "",
      duration: courseDetails?.duration || "",
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values) => {
      const courseData = {
        ...values,
        courseId,
        duration: Number(values.duration),
      };
      mutation.mutate(courseData);
    },
  });

  // Loading state
  if (isFetching) {
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
  if (fetchError) {
    return (
      <div className="min-h-screen bg-[#0a0d14] flex items-center justify-center relative overflow-hidden px-4">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="bg-white/3 backdrop-blur-xl border border-white/5 p-8 rounded-2xl shadow-2xl w-full max-w-md text-center relative z-10">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-2">Error Loading Course</h2>
          <p className="text-slate-400 mb-6">
            {fetchError?.response?.data?.message || "Unable to load course details."}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:opacity-90 text-white font-semibold px-6 py-2.5 rounded-xl transition duration-200"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0d14] text-slate-100 relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-xl relative z-10">
        {/* Back link */}
        <div className="mb-6 flex justify-start">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-slate-400 hover:text-white transition duration-200 text-sm font-medium"
          >
            <FaArrowLeft className="mr-2" />
            Back
          </button>
        </div>

        {/* Form Card */}
        <div className="bg-white/3 backdrop-blur-xl border border-white/5 shadow-2xl p-8 sm:p-10 rounded-3xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="h-14 w-14 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(124,58,237,0.3)] mb-4">
              <FaEdit className="text-white text-2xl" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Update Course
            </h1>
            <p className="text-slate-400 mt-2 text-sm leading-relaxed">
              Modify course details, descriptions, difficulty, and duration settings.
            </p>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* Alert Messages */}
            {mutation.isPending && (
              <div className="bg-purple-950/40 border border-purple-500/20 text-purple-300 p-4 rounded-xl flex items-center">
                <FaSpinner className="animate-spin mr-3 text-purple-400" />
                <span>Updating course...</span>
              </div>
            )}
            
            {mutation.isError && (
              <AlertMessage
                type="error"
                message={
                  mutation?.error?.response?.data?.message ||
                  mutation?.error?.message ||
                  "An error occurred while updating the course."
                }
              />
            )}
            
            {mutation.isSuccess && (
              <AlertMessage
                type="success"
                message="Course updated successfully! Redirecting to course details..."
              />
            )}

            {/* Title Input */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2" htmlFor="title">
                Course Title *
              </label>
              <input
                id="title"
                type="text"
                placeholder="Enter course title"
                className="w-full px-4 py-3 bg-[#090b11] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 focus:outline-none transition-all duration-200"
                {...formik.getFieldProps("title")}
              />
              {formik.touched.title && formik.errors.title && (
                <p className="text-red-400 text-xs mt-1.5">{formik.errors.title}</p>
              )}
            </div>

            {/* Description Input */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2" htmlFor="description">
                Course Description *
              </label>
              <textarea
                id="description"
                placeholder="Enter course description"
                rows="4"
                className="w-full px-4 py-3 bg-[#090b11] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 focus:outline-none transition-all duration-200 resize-none"
                {...formik.getFieldProps("description")}
              />
              {formik.touched.description && formik.errors.description && (
                <p className="text-red-400 text-xs mt-1.5">{formik.errors.description}</p>
              )}
            </div>

            {/* Difficulty and Duration Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Difficulty Select */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2" htmlFor="difficulty">
                  Difficulty Level *
                </label>
                <select
                  id="difficulty"
                  className="w-full px-4 py-3 bg-[#090b11] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 focus:outline-none transition-all duration-200"
                  {...formik.getFieldProps("difficulty")}
                >
                  <option value="" className="bg-[#0a0d14]">Select difficulty</option>
                  <option value="easy" className="bg-[#0a0d14]">Easy</option>
                  <option value="medium" className="bg-[#0a0d14]">Medium</option>
                  <option value="hard" className="bg-[#0a0d14]">Hard</option>
                </select>
                {formik.touched.difficulty && formik.errors.difficulty && (
                  <p className="text-red-400 text-xs mt-1.5">{formik.errors.difficulty}</p>
                )}
              </div>

              {/* Duration Input */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2" htmlFor="duration">
                  Duration (hours) *
                </label>
                <div className="relative">
                  <input
                    id="duration"
                    type="number"
                    min="1"
                    max="1000"
                    placeholder="Enter duration in hours"
                    className="w-full pl-4 pr-10 py-3 bg-[#090b11] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 focus:outline-none transition-all duration-200"
                    {...formik.getFieldProps("duration")}
                  />
                  <div className="absolute right-3 top-3.5 text-slate-500 pointer-events-none">
                    <FaClock className="text-sm" />
                  </div>
                </div>
                {formik.touched.duration && formik.errors.duration && (
                  <p className="text-red-400 text-xs mt-1.5">{formik.errors.duration}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={mutation.isPending || !formik.isValid}
                className="h-12 w-full flex items-center justify-center py-2 px-4 text-white font-semibold rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-[0_0_20px_rgba(124,58,237,0.25)] focus:ring-1 focus:ring-purple-500/20 focus:outline-none"
              >
                {mutation.isPending ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <span>Update Course</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateCourse;
