import { useMutation, useQuery } from "@tanstack/react-query";
import React from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { FaArrowLeft, FaLayerGroup } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import {
  deleteSectionAPI,
  getAllCourseSectionsAPI,
} from "../../../reactQuery/courseSections/courseSectionsAPI";
import AlertMessage from "../../Alert/AlertMessage";

const AdminCourseSections = () => {
  const navigate = useNavigate();
  const { data = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: ["course-sections"],
    queryFn: () => getAllCourseSectionsAPI(),
  });

  // Delete mutation
  const mutation = useMutation({
    mutationFn: deleteSectionAPI,
    onSuccess: () => {
      refetch();
    },
  });

  const handleDelete = (sectionId) => {
    if (window.confirm("Are you sure you want to delete this section?")) {
      mutation.mutate(sectionId);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto" />
          <p className="text-slate-500 text-sm font-semibold">Loading sections catalog...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-4">
        <div className="bg-white border border-slate-200 p-8 rounded-3xl max-w-md w-full text-center space-y-4 shadow-xl">
          <h2 className="text-xl font-bold text-slate-900">Error Loading Sections</h2>
          <p className="text-slate-600 text-sm">{error?.response?.data?.message || "Failed to load sections"}</p>
          <button
            onClick={() => navigate("/instructor-courses")}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold transition shadow"
          >
            Go to Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate("/instructor-courses")}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition text-xs font-bold uppercase tracking-wider"
          >
            <FaArrowLeft className="text-[10px]" />
            <span>Back to Instructor Courses</span>
          </button>
        </div>

        {/* Mutation Feedback */}
        {mutation.isPending && (
          <AlertMessage type="loading" message="Deleting section..." />
        )}
        {mutation.isError && (
          <AlertMessage
            type="error"
            message={mutation.error?.response?.data?.message || "Error deleting section"}
          />
        )}
        {mutation.isSuccess && (
          <AlertMessage type="success" message="Section removed successfully!" />
        )}

        {/* Header */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-xl shadow-lg shadow-indigo-600/20">
              <FaLayerGroup />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">All Course Sections</h1>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Overview of all lesson units registered in the system ({data?.length || 0} total)
              </p>
            </div>
          </div>
        </div>

        {/* Section List */}
        <div className="space-y-3">
          {data?.map((section, idx) => (
            <div
              key={section._id}
              className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between gap-4 hover:border-indigo-300 shadow-sm transition"
            >
              <div className="flex items-center gap-4 min-w-0">
                <span className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-700 flex-shrink-0">
                  {idx + 1}
                </span>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-slate-900 truncate">
                    {section.sectionName}
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">
                    ID: {section._id}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <Link
                  to={`/update-course-section/${section._id}`}
                  className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                  title="Edit Section"
                >
                  <FiEdit2 className="text-xs" />
                </Link>
                <button
                  onClick={() => handleDelete(section._id)}
                  className="p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition"
                  title="Delete Section"
                >
                  <FiTrash2 className="text-xs" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminCourseSections;
