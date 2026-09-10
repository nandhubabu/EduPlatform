import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FaEdit, FaArrowLeft, FaLayerGroup } from "react-icons/fa";
import AlertMessage from "../../Alert/AlertMessage";
import {
  getSingleSectionAPI,
  updateSectionAPI,
} from "../../../reactQuery/courseSections/courseSectionsAPI";

const validationSchema = Yup.object({
  sectionName: Yup.string().trim().required("Section name is required"),
});

const UpdateCourseSection = () => {
  const navigate = useNavigate();
  const { sectionId } = useParams();

  // Fetch current section details
  const { data: sectionDetails, isLoading: isFetching } = useQuery({
    queryKey: ["course-section", sectionId],
    queryFn: () => getSingleSectionAPI(sectionId),
    enabled: !!sectionId,
  });

  // Update section mutation
  const mutation = useMutation({
    mutationFn: updateSectionAPI,
    onSuccess: () => {
      setTimeout(() => {
        navigate(-1);
      }, 1000);
    },
  });

  const formik = useFormik({
    initialValues: {
      sectionName: sectionDetails?.sectionName || "",
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values) => {
      mutation.mutate({
        sectionId,
        sectionName: values.sectionName,
      });
    },
  });

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full relative z-10 space-y-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition text-sm font-medium"
        >
          <FaArrowLeft className="text-xs" />
          <span>Back</span>
        </button>

        <div className="bg-[#0f1524] border border-slate-800 rounded-3xl p-8 backdrop-blur-xl shadow-2xl space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white text-xl shadow-md">
              <FaLayerGroup />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Update Course Section</h1>
              <p className="text-xs text-slate-400 mt-0.5">Modify module name and syllabus title</p>
            </div>
          </div>

          {isFetching ? (
            <div className="py-8 text-center text-slate-400 text-sm">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto mb-3" />
              Loading section details...
            </div>
          ) : (
            <form onSubmit={formik.handleSubmit} className="space-y-4">
              {mutation.isPending && (
                <AlertMessage type="loading" message="Saving changes..." />
              )}
              {mutation.isError && (
                <AlertMessage
                  type="error"
                  message={
                    mutation?.error?.response?.data?.message ||
                    mutation?.error?.message ||
                    "Failed to update section"
                  }
                />
              )}
              {mutation.isSuccess && (
                <AlertMessage
                  type="success"
                  message="Section updated successfully! Returning..."
                />
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Section Name / Module Title
                </label>
                <input
                  type="text"
                  placeholder="Enter section name"
                  className="w-full px-4 py-3 bg-slate-900/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition"
                  {...formik.getFieldProps("sectionName")}
                />
                {formik.touched.sectionName && formik.errors.sectionName && (
                  <p className="text-rose-400 text-xs mt-1.5 font-medium">
                    {formik.errors.sectionName}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={mutation.isPending}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2"
              >
                <FaEdit className="text-xs" />
                <span>{mutation.isPending ? "Updating..." : "Update Section"}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdateCourseSection;
