import { BrowserRouter, Route, Routes } from "react-router-dom";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

// Components
import Dashboard from "./components/Dashboard/Dashboard"; // Now uncommented
import Register from "./components/User/Register";
import Login from "./components/User/Login";
import Homepage from "./components/Home/HomePage";
import Courses from "./components/Courses/Courses";
import CoursePlayer from "./components/Courses/CoursePlayer";
import TestCourses from "./components/Courses/TestCourses";
import Settings from "./components/User/SettingsPage";
import ONetCareerAssessment from "./components/Home/ONetCareerAssessment";
import FloatingChatbot from "./components/Chatbot/FloatingChatbot";

// Navigation Components
import PublicNavbar from "./components/Navbar/PublicNavbar";
import PrivateNavbar from "./components/Navbar/PrivateNavbarNew";
import InstructorNavbar from "./components/Navbar/InstructorNavbar";

// Route Protection
import AuthRoute from "./components/AuthRoute/AuthRoute";
import InstructorRoutes from "./components/AuthRoute/InstructorRoutes";

// Admin Components
import AddCourse from "./components/Admin/Courses/AddCourse";
import AdminCourses from "./components/Admin/Courses/AdminCourses";
import UpdateCourse from "./components/Admin/Courses/UpdateCourse";

// Redux
import { checkUserAuthStatus } from "./redux/slices/authSlice";

export default function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, userProfile } = useSelector((state) => state.auth);

  useEffect(() => {
    // Only check auth status when the app loads
    dispatch(checkUserAuthStatus());
  }, [dispatch]);

  // Determine which navbar to render based on user role
  const getNavbarComponent = () => {
    if (!isAuthenticated) return PublicNavbar;

    switch (userProfile?.role) {
      case "instructor":
      case "student":
        return PrivateNavbar;
      default:
        return PublicNavbar;
    }
  };

  const NavbarComponent = getNavbarComponent();

  return (
    <BrowserRouter>
      <NavbarComponent />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Homepage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/test-courses" element={<TestCourses />} />
        <Route path="/assessment" element={<ONetCareerAssessment />} />
        
        {/* Course Player - protected */}
        <Route
          path="/courses/:courseId"
          element={
            <AuthRoute>
              <CoursePlayer />
            </AuthRoute>
          }
        />
        
        {/* Settings route - protected */}
        <Route
          path="/settings"
          element={
            <AuthRoute>
              <Settings />
            </AuthRoute>
          }
        />

        {/* Dashboard route - now enabled */}
        <Route
          path="/dashboard"
          element={
            <AuthRoute>
              <Dashboard />
            </AuthRoute>
          }
        />

        {/* Instructor Protected Routes */}
        <Route
          path="/instructor-add-course"
          element={
            <InstructorRoutes>
              <AddCourse />
            </InstructorRoutes>
          }
        />
        <Route
          path="/instructor-courses"
          element={
            <InstructorRoutes>
              <AdminCourses />
            </InstructorRoutes>
          }
        />
        <Route
          path="/instructor-update-course/:courseId"
          element={
            <InstructorRoutes>
              <UpdateCourse />
            </InstructorRoutes>
          }
        />
      </Routes>
      <FloatingChatbot />
    </BrowserRouter>
  );
}
