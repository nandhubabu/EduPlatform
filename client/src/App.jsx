import { BrowserRouter, Route, Routes } from "react-router-dom";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

// Redux
import { checkUserAuthStatus } from "./redux/slices/authSlice";

// Route Guards
import AuthRoute from "./components/AuthRoute/AuthRoute";
import InstructorRoutes from "./components/AuthRoute/InstructorRoutes";

// Navigation & Global
import PublicNavbar from "./components/Navbar/PublicNavbar";
import PrivateNavbar from "./components/Navbar/PrivateNavbar";
import FloatingChatbot from "./components/Chatbot/FloatingChatbot";

// Public Pages
import Homepage from "./components/Home/HomePage";
import Courses from "./components/Courses/Courses";
import CourseDetails from "./components/Courses/CourseDetails";
import CareerAssessment from "./components/Home/CareerAssessment";
import NotFound from "./components/NotFound/NotFound";

// Auth & Account Pages
import Login from "./components/User/Login";
import Register from "./components/User/Register";
import RequestResetPassword from "./components/User/RequestResetPassword";
import ResetPassword from "./components/User/ResetPassword";
import Settings from "./components/User/SettingsPage";

// Student & Learning Pages
import Dashboard from "./components/Dashboard/Dashboard";
import CoursePlayer from "./components/Courses/CoursePlayer";
import StudentsRanking from "./components/Students/StudentsRanking";

// Instructor Studio & Course Management
import AdminCourses from "./components/Admin/Courses/AdminCourses";
import AdminCourseDetails from "./components/Admin/Courses/AdminCourseDetails";
import AddCourse from "./components/Admin/Courses/AddCourse";
import UpdateCourse from "./components/Admin/Courses/UpdateCourse";
import CourseSections from "./components/Admin/Courses/CourseSections";
import AdminCourseSections from "./components/Admin/CourseSections/AdminCourseSections";
import AddCourseSection from "./components/Admin/CourseSections/AddCourseSection";
import UpdateCourseSection from "./components/Admin/CourseSections/UpdateCourseSection";

export default function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    // Check user auth session once when app mounts
    dispatch(checkUserAuthStatus());
  }, [dispatch]);

  // Public navbar for guests, rich private navbar for authenticated users
  const NavbarComponent = isAuthenticated ? PrivateNavbar : PublicNavbar;

  return (
    <BrowserRouter>
      <NavbarComponent />
      <Routes>
        {/* =========================================
            1. PUBLIC CATALOG & DISCOVERY
           ========================================= */}
        <Route path="/" element={<Homepage />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:courseId" element={<CourseDetails />} />
        <Route path="/assessment" element={<CareerAssessment />} />

        {/* =========================================
            2. AUTHENTICATION & RECOVERY
           ========================================= */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<RequestResetPassword />} />
        <Route path="/reset-password/:resetToken" element={<ResetPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* =========================================
            3. PROTECTED LEARNER ROUTES
           ========================================= */}
        <Route
          path="/dashboard"
          element={
            <AuthRoute>
              <Dashboard />
            </AuthRoute>
          }
        />
        <Route
          path="/courses/:courseId/learn"
          element={
            <AuthRoute>
              <CoursePlayer />
            </AuthRoute>
          }
        />
        <Route
          path="/courses/:courseId/player"
          element={
            <AuthRoute>
              <CoursePlayer />
            </AuthRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <AuthRoute>
              <Settings />
            </AuthRoute>
          }
        />
        <Route
          path="/students-position/:courseId"
          element={
            <AuthRoute>
              <StudentsRanking />
            </AuthRoute>
          }
        />

        {/* =========================================
            4. PROTECTED INSTRUCTOR STUDIO ROUTES
           ========================================= */}
        {/* Course Catalog Management */}
        <Route
          path="/instructor-courses"
          element={
            <InstructorRoutes>
              <AdminCourses />
            </InstructorRoutes>
          }
        />
        <Route
          path="/instructor/courses"
          element={
            <InstructorRoutes>
              <AdminCourses />
            </InstructorRoutes>
          }
        />
        <Route
          path="/admin-courses"
          element={
            <InstructorRoutes>
              <AdminCourses />
            </InstructorRoutes>
          }
        />

        {/* Course Creation */}
        <Route
          path="/instructor-add-course"
          element={
            <InstructorRoutes>
              <AddCourse />
            </InstructorRoutes>
          }
        />
        <Route
          path="/instructor/courses/add"
          element={
            <InstructorRoutes>
              <AddCourse />
            </InstructorRoutes>
          }
        />

        {/* Course Details */}
        <Route
          path="/instructor-courses/:courseId"
          element={
            <InstructorRoutes>
              <AdminCourseDetails />
            </InstructorRoutes>
          }
        />
        <Route
          path="/instructor/courses/:courseId"
          element={
            <InstructorRoutes>
              <AdminCourseDetails />
            </InstructorRoutes>
          }
        />

        {/* Course Update */}
        <Route
          path="/instructor-update-course/:courseId"
          element={
            <InstructorRoutes>
              <UpdateCourse />
            </InstructorRoutes>
          }
        />
        <Route
          path="/instructor/courses/:courseId/edit"
          element={
            <InstructorRoutes>
              <UpdateCourse />
            </InstructorRoutes>
          }
        />

        {/* Course Sections Management */}
        <Route
          path="/instructor-course-sections"
          element={
            <InstructorRoutes>
              <AdminCourseSections />
            </InstructorRoutes>
          }
        />
        <Route
          path="/instructor/sections"
          element={
            <InstructorRoutes>
              <AdminCourseSections />
            </InstructorRoutes>
          }
        />
        <Route
          path="/instructor-course-sections/:courseId"
          element={
            <InstructorRoutes>
              <CourseSections />
            </InstructorRoutes>
          }
        />
        <Route
          path="/instructor/courses/:courseId/sections"
          element={
            <InstructorRoutes>
              <CourseSections />
            </InstructorRoutes>
          }
        />
        <Route
          path="/instructor-add-course-sections/:courseId"
          element={
            <InstructorRoutes>
              <AddCourseSection />
            </InstructorRoutes>
          }
        />
        <Route
          path="/instructor/courses/:courseId/sections/add"
          element={
            <InstructorRoutes>
              <AddCourseSection />
            </InstructorRoutes>
          }
        />
        <Route
          path="/update-course-section/:sectionId"
          element={
            <InstructorRoutes>
              <UpdateCourseSection />
            </InstructorRoutes>
          }
        />
        <Route
          path="/instructor/sections/:sectionId/edit"
          element={
            <InstructorRoutes>
              <UpdateCourseSection />
            </InstructorRoutes>
          }
        />

        {/* =========================================
            5. CATCH-ALL 404 NOT FOUND
           ========================================= */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <FloatingChatbot />
    </BrowserRouter>
  );
}
