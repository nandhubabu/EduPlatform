import { useMutation, useQuery } from "@tanstack/react-query";
import React from "react";
import {
  FaBookOpen,
  FaUser,
  FaUsers,
  FaLayerGroup,
  FaPlus,
  FaArrowLeft,
  FaTrashAlt,
  FaEdit,
} from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getSingleCourseAPI } from "../../../reactQuery/courses/coursesAPI";
import { deleteSectionAPI } from "../../../reactQuery/courseSections/courseSectionsAPI";
import AlertMessage from "../../Alert/AlertMessage";

const CourseSections = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  // Fetch course details with its embedded sections
  const {
    data: courseData,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => getSingleCourseAPI(courseId),
    enabled: !!courseId,
  });

  // Delete individual section mutation
  const deleteSectionMutation = useMutation({
    mutationFn: deleteSectionAPI,
    onSuccess: () => {
      refetch();
    },
  });

  const handleDeleteSection = (sectionId) => {
    if (window.confirm("Are you sure you want to remove this section?")) {
      deleteSectionMutation.mutate(sectionId);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto" />
          <p className="text-slate-500 text-sm font-semibold">Loading course sections...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-4">
        <div className="bg-white border border-slate-200 p-8 rounded-3xl max-w-md w-full text-center space-y-4 shadow-xl">
          <h2 className="text-xl font-bold text-slate-900">Error Loading Sections</h2>
          <p className="text-slate-600 text-sm">{error?.response?.data?.message || "Failed to load sections"}</p>
          <button
            onClick={() => navigate(`/instructor-courses/${courseId}`)}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold transition shadow"
          >
            Back to Course
          </button>
        </div>
      </div>
    );
  }

  const sections = courseData?.sections || [];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(`/instructor-courses/${courseId}`)}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition text-xs font-bold uppercase tracking-wider"
          >
            <FaArrowLeft className="text-[10px]" />
            <span>Back to Course Details</span>
          </button>

          <Link
            to={`/instructor-add-course-sections/${courseId}`}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition"
          >
            <FaPlus className="text-xs" />
            <span>Add Section</span>
          </Link>
        </div>

        {/* Mutation Alerts */}
        {deleteSectionMutation.isPending && (
          <AlertMessage type="loading" message="Deleting section..." />
        )}
        {deleteSectionMutation.isError && (
          <AlertMessage
            type="error"
            message={deleteSectionMutation.error?.response?.data?.message || "Error deleting section"}
          />
        )}
        {deleteSectionMutation.isSuccess && (
          <AlertMessage type="success" message="Section deleted successfully!" />
        )}

        {/* Course Summary Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-xl flex-shrink-0 shadow-lg shadow-indigo-600/20">
              <FaBookOpen />
            </div>
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Curriculum Manager</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">
                {courseData?.title}
              </h1>
              <p className="text-slate-600 text-sm mt-2 leading-relaxed line-clamp-2 font-normal">
                {courseData?.description}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
              <span className="text-xs text-slate-500 font-medium">Instructor</span>
              <p className="text-sm font-bold text-slate-900 mt-0.5 flex items-center gap-1.5">
                <FaUser className="text-indigo-600 text-xs" />
                <span>{courseData?.user?.username || "You"}</span>
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
              <span className="text-xs text-slate-500 font-medium">Total Sections</span>
              <p className="text-sm font-bold text-slate-900 mt-0.5 flex items-center gap-1.5">
                <FaLayerGroup className="text-indigo-600 text-xs" />
                <span>{sections.length} Lessons</span>
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 col-span-2 sm:col-span-1">
              <span className="text-xs text-slate-500 font-medium">Enrolled Students</span>
              <p className="text-sm font-bold text-slate-900 mt-0.5 flex items-center gap-1.5">
                <FaUsers className="text-emerald-600 text-xs" />
                <span>{courseData?.students?.length || 0} Learners</span>
              </p>
            </div>
          </div>
        </div>

        {/* Sections List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Course Sections ({sections.length})</h2>
            <Link
              to={`/instructor-add-course-sections/${courseId}`}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition"
            >
              + Add Another Section
            </Link>
          </div>

          {sections.length > 0 ? (
            <div className="space-y-3">
              {sections.map((section, idx) => (
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
                        Lesson Module • ID: {section._id?.slice(-6)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Link
                      to={`/update-course-section/${section._id}`}
                      className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                      title="Edit Section"
                    >
                      <FaEdit className="text-xs" />
                    </Link>
                    <button
                      onClick={() => handleDeleteSection(section._id)}
                      className="p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition"
                      title="Delete Section"
                    >
                      <FaTrashAlt className="text-xs" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-4 shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 text-2xl mx-auto">
                <FaLayerGroup />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No sections added yet</h3>
              <p className="text-slate-500 text-xs max-w-sm mx-auto font-medium">
                Break your course into digestible video modules or lessons for your students.
              </p>
              <Link
                to={`/instructor-add-course-sections/${courseId}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition"
              >
                <FaPlus />
                <span>Create Section 1</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseSections;
