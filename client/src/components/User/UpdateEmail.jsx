import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { updateEmailAPI } from "../../reactQuery/user/usersAPI";
import AlertMessage from "../Alert/AlertMessage";
import { FiMail } from "react-icons/fi";

// Validation schema using Yup
const validationSchema = Yup.object({
  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),
});

const AddEmailComponent = () => {
  //---mutation
  const mutation = useMutation({ mutationFn: updateEmailAPI });

  // Formik setup for form handling
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      mutation.mutate(values.email);
    },
  });

  return (
    <div className="min-h-screen bg-[#0a0d14] text-[#e2e8f0] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Orbs */}
      <div 
        className="absolute top-[10%] left-[15%] w-[400px] h-[400px] rounded-full bg-purple-600/10 blur-[100px] pointer-events-none" 
      />
      <div 
        className="absolute bottom-[10%] right-[15%] w-[350px] h-[350px] rounded-full bg-cyan-500/8 blur-[100px] pointer-events-none" 
      />

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-2xl flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(124,58,237,0.4)]">
            <FiMail className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            Add Your Email
          </h2>
          <p className="text-slate-400">Update or link a new email to your profile</p>
        </div>

        {/* Form Container */}
        <div className="bg-white/3 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/5">
          {/* Show messages */}
          {/* success */}
          {mutation.isSuccess && (
            <div className="bg-emerald-950/30 border border-emerald-500/20 rounded-xl p-4 flex items-center mb-6">
              <div className="h-5 w-5 text-emerald-400 mr-3">✅</div>
              <span className="text-emerald-200">Email updated successfully</span>
            </div>
          )}
          {/* error */}
          {mutation.isError && (
            <div className="bg-red-950/30 border border-red-500/20 rounded-xl p-4 flex items-center mb-6">
              <div className="h-5 w-5 text-red-400 mr-3">⚠️</div>
              <span className="text-red-200">
                {mutation.error.response?.data?.message || mutation.error.message || "Failed to update email"}
              </span>
            </div>
          )}
          {/* isPending */}
          {mutation.isPending && (
            <div className="bg-purple-950/30 border border-purple-500/20 rounded-xl p-4 flex items-center mb-6">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-500 mr-3"></div>
              <span className="text-purple-200">Updating email...</span>
            </div>
          )}

          {/* form */}
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <FiMail />
                </div>
                <input
                  type="email"
                  id="email"
                  placeholder="name@example.com"
                  {...formik.getFieldProps("email")}
                  className="w-full pl-10 pr-3 py-3 bg-[#090b11] border border-white/10 text-white placeholder-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none rounded-xl transition duration-200"
                />
              </div>
              {formik.touched.email && formik.errors.email && (
                <div className="text-red-400 text-xs mt-1.5 font-medium ml-1">
                  {formik.errors.email}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-cyan-500 hover:opacity-90 text-white rounded-xl shadow-[0_0_20px_rgba(124,58,237,0.3)] transition duration-200 font-bold text-sm"
            >
              Add Email
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEmailComponent;
