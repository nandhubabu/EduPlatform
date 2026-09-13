import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { resetPasswordAPI } from "../../reactQuery/user/usersAPI";
import { useParams } from "react-router-dom";
import { FiLock } from "react-icons/fi";

// Validation schema using Yup
const validationSchema = Yup.object({
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

const ResetPassword = () => {
  //get the token
  const { resetToken } = useParams();
  const mutation = useMutation({ mutationFn: resetPasswordAPI });
  
  // Formik setup for form handling
  const formik = useFormik({
    initialValues: {
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const data = {
        password: values.password,
        resetToken,
      };
      mutation.mutate(data);
    },
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-600/20">
            <FiLock className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">
            Reset Password
          </h2>
          <p className="text-slate-500 font-medium text-sm">Choose a new strong password</p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-200/80">
          {/* Alerts */}
          {mutation.isPending && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 flex items-center mb-6 text-sm">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600 mr-3"></div>
              <span className="text-indigo-800 font-semibold">Updating password...</span>
            </div>
          )}

          {mutation.isError && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-center mb-6 text-sm">
              <div className="h-5 w-5 text-rose-500 mr-3 flex-shrink-0">⚠️</div>
              <span className="text-rose-700 font-medium">
                {mutation.error.response?.data?.message || mutation.error.message || "Failed to reset password"}
              </span>
            </div>
          )}

          {mutation.isSuccess && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center mb-6 text-sm">
              <div className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0">✅</div>
              <span className="text-emerald-800 font-semibold">Password reset successful! You can now log in.</span>
            </div>
          )}

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <FiLock />
                </div>
                <input
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  {...formik.getFieldProps("password")}
                  className="w-full pl-10 pr-3.5 py-3 bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:bg-white focus:outline-none rounded-xl font-medium text-sm transition duration-150"
                />
              </div>
              {formik.touched.password && formik.errors.password && (
                <div className="text-rose-600 text-xs mt-1.5 font-medium ml-1">
                  {formik.errors.password}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-600/20 transition duration-150 font-bold text-sm"
            >
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
