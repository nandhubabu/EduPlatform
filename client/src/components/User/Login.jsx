import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AiOutlineEye, AiOutlineMail } from "react-icons/ai";
import { RiLockPasswordLine } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { loginAPI } from "../../reactQuery/user/usersAPI";
import AlertMessage from "../Alert/AlertMessage";
import { useDispatch } from "react-redux";
import { FiMail, FiLock } from "react-icons/fi";
import { checkUserAuthStatus, setUserProfile } from "../../redux/slices/authSlice";

// Validation schema using Yup
const validationSchema = Yup.object({
  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //---mutation
  const mutation = useMutation({ mutationFn: loginAPI });
  // Formik setup for form handling
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const data = await mutation.mutateAsync(values);
        console.log("Login successful:", data);
        
        // IMPORTANT: Set user profile immediately after login
        dispatch(setUserProfile(data));
        
        // Also update auth state from server
        await dispatch(checkUserAuthStatus());
        
        // Always navigate to dashboard - it will route based on role
        navigate("/dashboard");
      } catch (error) {
        console.log("Login error:", error);
      }
    },
  });

  return (
    <div className="min-h-screen bg-[#0a0d14] text-[#e2e8f0] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Orbs */}
      <div 
        className="absolute top-[10%] left-[15%] w-[400px] h-[400px] rounded-full bg-purple-600/10 blur-[100px] pointer-events-none" 
        style={{ animation: "float 8s ease-in-out infinite" }}
      />
      <div 
        className="absolute bottom-[10%] right-[15%] w-[350px] h-[350px] rounded-full bg-cyan-500/8 blur-[100px] pointer-events-none" 
        style={{ animation: "float 10s ease-in-out infinite reverse" }}
      />

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-2xl flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(124,58,237,0.4)]">
            <FiLock className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            Welcome Back
          </h2>
          <p className="text-slate-400">Continue your learning journey</p>
        </div>

        {/* Form Container */}
        <div className="bg-white/3 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/5">
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* Alerts */}
            {mutation.isPending && (
              <div className="bg-purple-950/30 border border-purple-500/20 rounded-xl p-4 flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-500 mr-3"></div>
                <span className="text-purple-200">Signing you in...</span>
              </div>
            )}

            {mutation.isError && (
              <div className="bg-red-950/30 border border-red-500/20 rounded-xl p-4 flex items-center">
                <div className="h-5 w-5 text-red-400 mr-3">⚠️</div>
                <span className="text-red-200">
                  {mutation.error.response?.data?.message || "Login failed"}
                </span>
              </div>
            )}

            {mutation.isSuccess && (
              <div className="bg-emerald-950/30 border border-emerald-500/20 rounded-xl p-4 flex items-center">
                <div className="h-5 w-5 text-emerald-400 mr-3">✅</div>
                <span className="text-emerald-200">Login successful! Redirecting...</span>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full pl-12 pr-4 py-3 bg-[#090b11] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 transition duration-200"
                  {...formik.getFieldProps("email")}
                />
              </div>
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-400 text-sm flex items-center mt-1">
                  <span className="mr-1">⚠️</span>
                  {formik.errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-slate-300">Password</label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-purple-400 hover:text-purple-300 transition duration-200 font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-4 py-3 bg-[#090b11] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 transition duration-200"
                  {...formik.getFieldProps("password")}
                />
              </div>
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-400 text-sm flex items-center mt-1">
                  <span className="mr-1">⚠️</span>
                  {formik.errors.password}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold py-3 px-4 rounded-xl hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-[#0a0d14] transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)]"
            >
              {mutation.isPending ? "Signing In..." : "Sign In"}
            </button>

            {/* Register Link */}
            <div className="text-center pt-4 border-t border-white/5">
              <span className="text-slate-400">New to our platform? </span>
              <Link
                to="/register"
                className="font-semibold text-purple-400 hover:text-purple-300 transition duration-200"
              >
                Create an account
              </Link>
            </div>
          </form>
        </div>

        {/* Features */}
        <div className="text-center space-y-3">
          <p className="text-sm text-slate-500">Join over 10,000+ learners worldwide</p>
          <div className="flex justify-center space-x-6 text-xs text-slate-500">
            <span>✓ Expert-led courses</span>
            <span>✓ Progress tracking</span>
            <span>✓ Certificates</span>
          </div>
        </div>
      </div>
      
      {/* Float animation keyframes */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
      `}</style>
    </div>
  );
};

export default Login;
