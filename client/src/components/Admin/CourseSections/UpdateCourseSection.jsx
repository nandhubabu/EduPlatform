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
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition text-xs font-bold uppercase tracking-wider"
        >
          <FaArrowLeft className="text-[10px]" />
          <span>Back</span>
        </button>

        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-xl shadow-lg shadow-indigo-600/20">
              <FaLayerGroup />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Update Course Section</h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Modify module name and syllabus title</p>
            </div>
          </div>

          {isFetching ? (
            <div className="py-8 text-center text-slate-500 text-sm font-semibold">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600 mx-auto mb-3" />
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
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Section Name / Module Title
                </label>
                <input
                  type="text"
                  placeholder="Enter section name"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white text-sm font-medium transition duration-150"
                  {...formik.getFieldProps("sectionName")}
                />
                {formik.touched.sectionName && formik.errors.sectionName && (
                  <p className="text-rose-600 text-xs mt-1.5 font-medium">
                    {formik.errors.sectionName}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={mutation.isPending}
                className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-indigo-600/20 transition duration-150 flex items-center justify-center gap-2"
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
