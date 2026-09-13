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
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Subtle Background Highlights */}
      <div 
        className="absolute top-[10%] left-[15%] w-[400px] h-[400px] rounded-full bg-indigo-500/5 blur-[100px] pointer-events-none" 
      />
      <div 
        className="absolute bottom-[10%] right-[15%] w-[350px] h-[350px] rounded-full bg-sky-500/5 blur-[100px] pointer-events-none" 
      />

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-md">
            <FaUserGraduate className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-2">
            Create Your Account
          </h2>
          <p className="text-slate-600">Join thousands of learners and educators worldwide</p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-200">
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* Alerts */}
            {mutation.isPending && (
              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600 mr-3"></div>
                <span className="text-indigo-800 text-sm font-semibold">Creating your account...</span>
              </div>
            )}
            
            {mutation.isError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center">
                <div className="h-5 w-5 text-red-500 mr-3">⚠️</div>
                <span className="text-red-700 text-sm font-medium">
                  {mutation.error.response?.data?.message || mutation.error.message}
                </span>
              </div>
            )}
            
            {mutation.isSuccess && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center">
                <div className="h-5 w-5 text-emerald-600 mr-3">✅</div>
                <span className="text-emerald-800 text-sm font-semibold">Account created successfully!</span>
              </div>
            )}

            {/* Username Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <AiOutlineUser className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="Enter your username"
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white focus:ring-1 focus:ring-indigo-600 transition duration-200"
                  {...formik.getFieldProps("username")}
                />
              </div>
              {formik.touched.username && formik.errors.username && (
                <p className="text-red-600 text-sm flex items-center mt-1">
                  <span className="mr-1">⚠️</span>
                  {formik.errors.username}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <AiOutlineMail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white focus:ring-1 focus:ring-indigo-600 transition duration-200"
                  {...formik.getFieldProps("email")}
                />
              </div>
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-600 text-sm flex items-center mt-1">
                  <span className="mr-1">⚠️</span>
                  {formik.errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <RiLockPasswordLine className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  placeholder="Create a secure password"
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white focus:ring-1 focus:ring-indigo-600 transition duration-200"
                  {...formik.getFieldProps("password")}
                />
              </div>
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-600 text-sm flex items-center mt-1">
                  <span className="mr-1">⚠️</span>
                  {formik.errors.password}
                </p>
              )}
            </div>

            {/* Role Selection */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-700">Choose Your Path</label>
              <p className="text-xs text-slate-500 mb-3">
                Currently selected: <span className="font-semibold text-indigo-600 capitalize">{formik.values.role}</span>
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div
                  className={`cursor-pointer rounded-2xl p-4 text-center transition-all duration-200 border ${
                    formik.values.role === "student"
                      ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm"
                      : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300"
                  }`}
                  onClick={() => {
                    formik.setFieldValue("role", "student");
                  }}
                >
                  <div className={`w-10 h-10 mx-auto mb-2 rounded-xl flex items-center justify-center ${
                    formik.values.role === "student" ? "bg-indigo-600 text-white shadow-sm" : "bg-white border border-slate-200 text-slate-500"
                  }`}>
                    <FaUserGraduate className="text-lg" />
                  </div>
                  <h3 className="font-bold text-sm">Student</h3>
                  <p className="text-xs mt-1 text-slate-500 leading-tight">Learn from expert instructors</p>
                </div>
                
                <div
                  className={`cursor-pointer rounded-2xl p-4 text-center transition-all duration-200 border ${
                    formik.values.role === "instructor"
                      ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm"
                      : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300"
                  }`}
                  onClick={() => {
                    formik.setFieldValue("role", "instructor");
                  }}
                >
                  <div className={`w-10 h-10 mx-auto mb-2 rounded-xl flex items-center justify-center ${
                    formik.values.role === "instructor" ? "bg-indigo-600 text-white shadow-sm" : "bg-white border border-slate-200 text-slate-500"
                  }`}>
                    <FaChalkboardTeacher className="text-lg" />
                  </div>
                  <h3 className="font-bold text-sm">Instructor</h3>
                  <p className="text-xs mt-1 text-slate-500 leading-tight">Share your knowledge with others</p>
                </div>
              </div>
              {formik.touched.role && formik.errors.role && (
                <p className="text-red-600 text-sm flex items-center mt-1">
                  <span className="mr-1">⚠️</span>
                  {formik.errors.role}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              {mutation.isPending ? "Creating Account..." : "Create Account"}
            </button>

            {/* Login Link */}
            <div className="text-center pt-4 border-t border-slate-100">
              <span className="text-slate-600">Already have an account? </span>
              <Link
                to="/login"
                className="font-semibold text-indigo-600 hover:text-indigo-700 transition duration-200"
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
