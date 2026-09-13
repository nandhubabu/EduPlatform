import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { FaBookOpen, FaArrowLeft, FaClock, FaSpinner } from "react-icons/fa";
import AlertMessage from "../../Alert/AlertMessage";
import { addCourseAPI } from "../../../reactQuery/courses/coursesAPI";

// Validation schema using Yup
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

const AddCourse = () => {
  const navigate = useNavigate();
  
  // React query mutation
  const mutation = useMutation({
    mutationFn: addCourseAPI,
    onSuccess: () => {
      // Automatically redirect after a short delay to let user see success message
      setTimeout(() => {
        navigate("/instructor-courses");
      }, 1500);
    },
  });

  // Formik setup for form handling
  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      difficulty: "",
      duration: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const formattedValues = {
        ...values,
        duration: Number(values.duration),
      };
      mutation.mutate(formattedValues);
    },
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-xl">
        {/* Back link */}
        <div className="mb-6 flex justify-start">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-slate-500 hover:text-slate-900 transition duration-150 text-xs font-bold uppercase tracking-wider"
          >
            <FaArrowLeft className="mr-2 text-[10px]" />
            Back to Courses
          </button>
        </div>

        {/* Form Card */}
        <div className="bg-white border border-slate-200 shadow-xl p-8 sm:p-10 rounded-3xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="h-14 w-14 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-indigo-600/20 mb-4">
              <FaBookOpen className="text-white text-2xl" />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Create New Course
            </h1>
            <p className="text-slate-500 mt-2 text-sm font-medium leading-relaxed">
              Design a new curriculum and help your students follow their learning journey.
            </p>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* Alert messages */}
            {mutation.isPending && (
              <div className="bg-indigo-50 border border-indigo-200 text-indigo-900 p-4 rounded-xl flex items-center text-sm font-semibold">
                <FaSpinner className="animate-spin mr-3 text-indigo-600" />
                <span>Creating your course...</span>
              </div>
            )}
            
            {mutation.isError && (
              <AlertMessage
                type="error"
                message={
                  mutation?.error?.response?.data?.message ||
                  mutation?.error?.message ||
                  "Something went wrong while creating the course."
                }
              />
            )}
            
            {mutation.isSuccess && (
              <AlertMessage
                type="success"
                message="Course created successfully! Redirecting to course catalog..."
              />
            )}

            {/* Title Input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2" htmlFor="title">
                Course Title *
              </label>
              <input
                id="title"
                type="text"
                placeholder="e.g. Introduction to Python Programming"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:bg-white focus:outline-none transition duration-150 font-medium text-sm"
                {...formik.getFieldProps("title")}
              />
              {formik.touched.title && formik.errors.title && (
                <p className="text-rose-600 text-xs mt-1.5 font-medium">{formik.errors.title}</p>
              )}
            </div>

            {/* Description Input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2" htmlFor="description">
                Course Description *
              </label>
              <textarea
                id="description"
                placeholder="Provide a comprehensive description of the syllabus, target audience, and key learning outcomes..."
                rows="4"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:bg-white focus:outline-none transition duration-150 resize-none font-medium text-sm"
                {...formik.getFieldProps("description")}
              />
              {formik.touched.description && formik.errors.description && (
                <p className="text-rose-600 text-xs mt-1.5 font-medium">{formik.errors.description}</p>
              )}
            </div>

            {/* Difficulty and Duration Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Difficulty Select */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2" htmlFor="difficulty">
                  Difficulty Level *
                </label>
                <select
                  id="difficulty"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:border-indigo-600 focus:bg-white focus:outline-none transition duration-150 font-medium text-sm cursor-pointer"
                  {...formik.getFieldProps("difficulty")}
                >
                  <option value="">Select difficulty</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
                {formik.touched.difficulty && formik.errors.difficulty && (
                  <p className="text-rose-600 text-xs mt-1.5 font-medium">{formik.errors.difficulty}</p>
                )}
              </div>

              {/* Duration Input */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2" htmlFor="duration">
                  Duration (hours) *
                </label>
                <div className="relative">
                  <input
                    id="duration"
                    type="number"
                    min="1"
                    max="1000"
                    placeholder="e.g. 24"
                    className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:bg-white focus:outline-none transition duration-150 font-medium text-sm"
                    {...formik.getFieldProps("duration")}
                  />
                  <div className="absolute right-3 top-3.5 text-slate-400 pointer-events-none">
                    <FaClock className="text-sm" />
                  </div>
                </div>
                {formik.touched.duration && formik.errors.duration && (
                  <p className="text-rose-600 text-xs mt-1.5 font-medium">{formik.errors.duration}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={mutation.isPending || !formik.isValid}
                className="h-12 w-full flex items-center justify-center py-2 px-4 text-white font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 shadow-lg shadow-indigo-600/20 text-sm"
              >
                {mutation.isPending ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    <span>Creating Course...</span>
                  </>
                ) : (
                  <span>Create Course</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCourse;
