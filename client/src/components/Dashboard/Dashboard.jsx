import React from "react";
import { useSelector } from "react-redux";
import StudentDashboard from "./StudentDashboardNew";
import InstructorDashboard from "./InstructorDashboardNew";

const Dashboard = () => {
  const { userProfile, isAuthenticated, loading } = useSelector((state) => state.auth);

  // Debug logging to help identify the issue
  console.log("Dashboard Debug Info:", {
    userProfile,
    role: userProfile?.role,
    isAuthenticated,
    loading,
    timestamp: new Date().toISOString()
  });

  // Additional specific role check debug
  console.log("Role check details:", {
    roleValue: userProfile?.role,
    roleType: typeof userProfile?.role,
    isExactlyInstructor: userProfile?.role === "instructor",
    isExactlyStudent: userProfile?.role === "student"
  });

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0d14] flex items-center justify-center relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="text-center relative z-10">
          <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-purple-500 mx-auto shadow-[0_0_15px_rgba(168,85,247,0.2)]"></div>
          <p className="text-slate-400 mt-6 text-lg font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0d14] flex items-center justify-center relative overflow-hidden px-4">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="bg-white/3 backdrop-blur-xl border border-white/5 p-8 rounded-2xl shadow-2xl w-full max-w-sm text-center relative z-10">
          <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
          <p className="text-slate-400 mb-8">Please log in to access your dashboard.</p>
          <a
            href="/login"
            className="inline-block bg-gradient-to-r from-purple-600 to-cyan-500 hover:opacity-90 text-white font-semibold px-6 py-3 rounded-xl shadow-[0_0_15px_rgba(124,58,237,0.3)] transition duration-200"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  // Route to appropriate dashboard based on user role
  console.log("Checking user role for dashboard routing:", {
    userRole: userProfile?.role,
    userProfile: userProfile,
    willShowInstructorDashboard: userProfile?.role === "instructor"
  });
  
  if (userProfile?.role === "instructor") {
    console.log("Rendering InstructorDashboard");
    return <InstructorDashboard />;
  } else {
    console.log("Rendering StudentDashboard for role:", userProfile?.role);
    return <StudentDashboard />;
  }
};

export default Dashboard;
