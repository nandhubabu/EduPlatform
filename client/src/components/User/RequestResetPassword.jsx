import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { forgotPasswordAPI } from "../../reactQuery/user/usersAPI";
import { FiMail, FiLock } from "react-icons/fi";
import AlertMessage from "../Alert/AlertMessage";

// Validation schema using Yup
const validationSchema = Yup.object({
  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),
});

const RequestResetPassword = () => {
  const mutation = useMutation({ mutationFn: forgotPasswordAPI });
  
  // Formik setup for form handling
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log("values", values);
      mutation.mutate(values.email);
    },
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-600/20">
            <FiMail className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">
            Reset Password
          </h2>
          <p className="text-slate-500 font-medium text-sm">Enter your email to request a secure reset link</p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-200/80">
          {/* Alerts */}
          {mutation.isPending && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 flex items-center mb-6 text-sm">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600 mr-3"></div>
              <span className="text-indigo-800 font-semibold">Sending email...</span>
            </div>
          )}

          {mutation.isError && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-center mb-6 text-sm">
              <div className="h-5 w-5 text-rose-500 mr-3 flex-shrink-0">⚠️</div>
              <span className="text-rose-700 font-medium">
                {mutation.error.response?.data?.message || mutation.error.message || "Failed to send reset link"}
              </span>
            </div>
          )}

          {mutation.isSuccess && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center mb-6 text-sm">
              <div className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0">✅</div>
              <span className="text-emerald-800 font-semibold">Reset email sent! Please check your inbox.</span>
            </div>
          )}

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <FiMail />
                </div>
                <input
                  type="email"
                  id="email"
                  placeholder="name@example.com"
                  {...formik.getFieldProps("email")}
                  className="w-full pl-10 pr-3.5 py-3 bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:bg-white focus:outline-none rounded-xl font-medium text-sm transition duration-150"
                />
              </div>
              {formik.touched.email && formik.errors.email && (
                <div className="text-rose-600 text-xs mt-1.5 font-medium ml-1">
                  {formik.errors.email}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-600/20 transition duration-150 font-bold text-sm"
            >
              Send Reset Password Email
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RequestResetPassword;
