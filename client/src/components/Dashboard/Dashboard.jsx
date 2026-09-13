import React from "react";
import { useSelector } from "react-redux";
import StudentDashboard from "./StudentDashboard";
import InstructorDashboard from "./InstructorDashboard";

const Dashboard = () => {
  const { userProfile, isAuthenticated, loading } = useSelector((state) => state.auth);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#06080e] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-violet-500 mx-auto" />
          <p className="text-slate-400 text-sm font-medium">Loading your learning workspace...</p>
        </div>
      </div>
    );
  }

  // Not authenticated state
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#06080e] flex items-center justify-center px-4">
        <div className="glass-card border border-slate-800/90 p-8 rounded-3xl shadow-2xl w-full max-w-sm text-center space-y-4">
          <h2 className="text-2xl font-black text-white">Access Required</h2>
          <p className="text-slate-400 text-sm">Please log in to view your enrolled courses and progress.</p>
          <a
            href="/login"
            className="inline-block w-full py-3 rounded-xl btn-aurora text-white font-bold text-sm shadow-lg shadow-violet-600/30 transition"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  // Render role-specific dashboard with clean user prop
  if (userProfile?.role === "instructor") {
    return <InstructorDashboard user={userProfile} />;
  }

  return <StudentDashboard user={userProfile} />;
};

export default Dashboard;
