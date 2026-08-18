import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineUser, AiOutlineMail } from "react-icons/ai";
import { RiLockPasswordLine } from "react-icons/ri";
import { FaUserGraduate, FaChalkboardTeacher } from "react-icons/fa";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import AlertMessage from "../Alert/AlertMessage";
import { registerAPI } from "../../reactQuery/user/usersAPI";
import { checkUserAuthStatus, setUserProfile } from "../../redux/slices/authSlice";

// Validation schema using Yup
const validationSchema = Yup.object({
  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  username: Yup.string()
    .min(3, "Username must be at least 3 characters")
    .required("Username is required"),
  role: Yup.string()
    .oneOf(["student", "instructor"], "Please select a valid role")
    .required("Role is required"),
});

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  //react querys
  //mutation
  const mutation = useMutation({ mutationFn: registerAPI });
  
  // Formik setup for form handling
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      username: "",
      role: "student", // Default to student
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        console.log("=== REGISTRATION DEBUG START ===");
        console.log("Registration values being sent:", values);
        console.log("Selected role:", values.role);
        console.log("Role type:", typeof values.role);
        
        const data = await mutation.mutateAsync(values);
        console.log("Registration response from server:", data);
        console.log("Server returned role:", data.role);
        console.log("Server role type:", typeof data.role);
        
        // IMPORTANT: Set user profile immediately after registration
        console.log("Setting user profile in Redux...");
        dispatch(setUserProfile(data));
        
        // Also update auth state from server
        console.log("Checking auth status...");
        await dispatch(checkUserAuthStatus());
        
        console.log("=== REGISTRATION DEBUG END ===");
        
        // Navigate to dashboard after successful registration
        navigate("/dashboard");
      } catch (error) {
        console.log("Registration error:", error);
      }
    },
  });
  
  //get the auth from store
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);

  //Redirect if a user is login
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate("/dashboard");
    }
  }, [isAuthenticated]);

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
            <FaUserGraduate className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            Create Your Account
          </h2>
          <p className="text-slate-400">Join thousands of learners and educators worldwide</p>
        </div>

        {/* Form Container */}
        <div className="bg-white/3 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/5">
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* Alerts */}
            {mutation.isPending && (
              <div className="bg-purple-950/30 border border-purple-500/20 rounded-xl p-4 flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-500 mr-3"></div>
                <span className="text-purple-200">Creating your account...</span>
              </div>
            )}
            
            {mutation.isError && (
              <div className="bg-red-950/30 border border-red-500/20 rounded-xl p-4 flex items-center">
                <div className="h-5 w-5 text-red-400 mr-3">⚠️</div>
                <span className="text-red-200">
                  {mutation.error.response?.data?.message || mutation.error.message}
                </span>
              </div>
            )}
            
            {mutation.isSuccess && (
              <div className="bg-emerald-950/30 border border-emerald-500/20 rounded-xl p-4 flex items-center">
                <div className="h-5 w-5 text-emerald-400 mr-3">✅</div>
                <span className="text-emerald-200">Account created successfully!</span>
              </div>
            )}

            {/* Username Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <AiOutlineUser className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="text"
                  placeholder="Enter your username"
                  className="w-full pl-12 pr-4 py-3 bg-[#090b11] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 transition duration-200"
                  {...formik.getFieldProps("username")}
                />
              </div>
              {formik.touched.username && formik.errors.username && (
                <p className="text-red-400 text-sm flex items-center mt-1">
                  <span className="mr-1">⚠️</span>
                  {formik.errors.username}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <AiOutlineMail className="h-5 w-5 text-slate-500" />
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
              <label className="text-sm font-semibold text-slate-300">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <RiLockPasswordLine className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="password"
                  placeholder="Create a secure password"
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

            {/* Role Selection */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-300">Choose Your Path</label>
              <p className="text-xs text-slate-500 mb-3">
                Currently selected: <span className="font-semibold text-purple-400">{formik.values.role}</span>
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div
                  className={`cursor-pointer rounded-xl p-4 text-center transition-all duration-300 border ${
                    formik.values.role === "student"
                      ? "border-purple-500 bg-purple-500/10 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.2)] transform scale-105"
                      : "border-white/10 bg-[#090b11] text-slate-400 hover:border-purple-500/20"
                  }`}
                  onClick={() => {
                    console.log("Student role selected");
                    formik.setFieldValue("role", "student");
                  }}
                >
                  <div className={`w-10 h-10 mx-auto mb-2 rounded-full flex items-center justify-center ${
                    formik.values.role === "student" ? "bg-purple-500/20 text-purple-300" : "bg-white/5 text-slate-400"
                  }`}>
                    <FaUserGraduate className="text-lg" />
                  </div>
                  <h3 className="font-bold text-sm">Student</h3>
                  <p className="text-xs mt-1 text-slate-400 leading-tight">Learn from expert instructors</p>
                </div>
                
                <div
                  className={`cursor-pointer rounded-xl p-4 text-center transition-all duration-300 border ${
                    formik.values.role === "instructor"
                      ? "border-cyan-500 bg-cyan-500/10 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)] transform scale-105"
                      : "border-white/10 bg-[#090b11] text-slate-400 hover:border-cyan-500/20"
                  }`}
                  onClick={() => {
                    console.log("Instructor role selected");
                    formik.setFieldValue("role", "instructor");
                  }}
                >
                  <div className={`w-10 h-10 mx-auto mb-2 rounded-full flex items-center justify-center ${
                    formik.values.role === "instructor" ? "bg-cyan-500/20 text-cyan-300" : "bg-white/5 text-slate-400"
                  }`}>
                    <FaChalkboardTeacher className="text-lg" />
                  </div>
                  <h3 className="font-bold text-sm">Instructor</h3>
                  <p className="text-xs mt-1 text-slate-400 leading-tight">Share your knowledge with others</p>
                </div>
              </div>
              {formik.touched.role && formik.errors.role && (
                <p className="text-red-400 text-sm flex items-center mt-1">
                  <span className="mr-1">⚠️</span>
                  {formik.errors.role}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold py-3 px-4 rounded-xl hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-[#0a0d14] transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)]"
            >
              {mutation.isPending ? "Creating Account..." : "Create Account"}
            </button>

            {/* Login Link */}
            <div className="text-center pt-4 border-t border-white/5">
              <span className="text-slate-400">Already have an account? </span>
              <Link
                to="/login"
                className="font-semibold text-purple-400 hover:text-purple-300 transition duration-200"
              >
                Sign in here
              </Link>
            </div>
          </form>
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

export default Register;
