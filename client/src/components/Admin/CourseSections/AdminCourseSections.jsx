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
      <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto" />
          <p className="text-slate-400 text-sm font-medium">Loading sections catalog...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center px-4">
        <div className="bg-[#0f1524] border border-slate-800 p-8 rounded-2xl max-w-md w-full text-center space-y-4">
          <h2 className="text-xl font-bold text-white">Error Loading Sections</h2>
          <p className="text-slate-400 text-sm">{error?.response?.data?.message || "Failed to load sections"}</p>
          <button
            onClick={() => navigate("/instructor-courses")}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition"
          >
            Go to Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate("/instructor-courses")}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition text-sm font-medium"
          >
            <FaArrowLeft className="text-xs" />
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
        <div className="bg-[#0f1524] border border-slate-800 rounded-3xl p-8 backdrop-blur-xl shadow-2xl flex items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white text-xl shadow-lg shadow-purple-500/20">
              <FaLayerGroup />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white">All Course Sections</h1>
              <p className="text-xs text-slate-400 mt-1">
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
              className="bg-[#0f1524] border border-slate-800 rounded-2xl p-5 flex items-center justify-between gap-4 hover:border-slate-700 transition shadow-lg"
            >
              <div className="flex items-center gap-4 min-w-0">
                <span className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center text-xs font-bold text-slate-300 flex-shrink-0">
                  {idx + 1}
                </span>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-white truncate">
                    {section.sectionName}
                  </h3>
                  <span className="text-xs text-slate-400">
                    ID: {section._id}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <Link
                  to={`/update-course-section/${section._id}`}
                  className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                  title="Edit Section"
                >
                  <FiEdit2 className="text-xs" />
                </Link>
                <button
                  onClick={() => handleDelete(section._id)}
                  className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 transition"
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
