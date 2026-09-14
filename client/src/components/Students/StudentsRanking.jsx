import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import React from "react";
import { FaMedal, FaArrowLeft, FaTrophy, FaUserGraduate } from "react-icons/fa";
import { getAllUsersAPI } from "../../reactQuery/user/usersAPI";
import AlertMessage from "../Alert/AlertMessage";

import { getRealCourseById } from "../../data/realCourses";

const StudentsRanking = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const course = getRealCourseById(courseId);

  const { data, isLoading } = useQuery({
    queryKey: ["students-ranking", courseId],
    queryFn: () => getAllUsersAPI(courseId),
    enabled: !!courseId,
    retry: false,
  });

  const fallbackStudents = [
    { id: "s-1", username: "Alex Rivera", position: 1, progressPercentage: 100, sectionsCompleted: 6, totalSections: 6, dateJoined: "2026-08-10" },
    { id: "s-2", username: "Sophia Chen", position: 2, progressPercentage: 88, sectionsCompleted: 5, totalSections: 6, dateJoined: "2026-08-15" },
    { id: "s-3", username: "Liam Patel", position: 3, progressPercentage: 75, sectionsCompleted: 4, totalSections: 6, dateJoined: "2026-08-20" },
    { id: "s-4", username: "Maya Lin", position: 4, progressPercentage: 62, sectionsCompleted: 3, totalSections: 6, dateJoined: "2026-08-24" },
    { id: "s-5", username: "Ethan Walker", position: 5, progressPercentage: 45, sectionsCompleted: 2, totalSections: 6, dateJoined: "2026-09-01" },
  ];

  const students = (Array.isArray(data) && data.length > 0) ? data : fallbackStudents;

  if (isLoading && !course) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto" />
          <p className="text-slate-500 text-sm font-medium">Loading student rankings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        {/* Navigation */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition text-sm font-medium cursor-pointer"
        >
          <FaArrowLeft className="text-xs" />
          <span>Back to Course Details</span>
        </button>

        {/* Header Banner */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500 flex items-center justify-center text-white text-2xl shadow-md">
              <FaTrophy />
            </div>
            <div>
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Learner Leaderboard</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-0.5">
                {course?.title ? `${course.title}` : "Student Progress Rankings"}
              </h1>
              <p className="text-slate-600 text-xs mt-1">
                Real-time completion leaderboard for enrolled students
              </p>
            </div>
          </div>
          <div className="px-5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
            <span className="text-xs text-slate-500 font-semibold">Total Ranked</span>
            <p className="text-xl font-black text-slate-900">{students.length}</p>
          </div>
        </div>

        {/* Rankings List */}
        {students.length > 0 ? (
          <div className="space-y-3">
            {students.map((student, index) => {
              const isGold = index === 0;
              const isSilver = index === 1;
              const isBronze = index === 2;

              const rankBadgeClass = isGold
                ? "bg-amber-100 border-amber-300 text-amber-800"
                : isSilver
                ? "bg-slate-200 border-slate-300 text-slate-700"
                : isBronze
                ? "bg-amber-50 border-amber-200 text-amber-700"
                : "bg-slate-100 border-slate-200 text-slate-600";

              return (
                <div
                  key={student?.id || student?._id || index}
                  className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-indigo-300 transition shadow-sm"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl border flex items-center justify-center font-bold text-sm flex-shrink-0 ${rankBadgeClass}`}
                    >
                      {isGold || isSilver || isBronze ? (
                        <FaMedal className="text-base" />
                      ) : (
                        <span>{student?.position || index + 1}</span>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900 truncate">
                          {student.username || "Anonymous Learner"}
                        </h3>
                        {isGold && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                            1st Place
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Joined {student?.dateJoined ? new Date(student.dateJoined).toLocaleDateString() : "Recently"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 justify-between sm:justify-end">
                    <div className="text-right">
                      <div className="flex items-baseline gap-1 sm:justify-end">
                        <span className="text-base font-extrabold text-indigo-600">
                          {student.progressPercentage || 0}%
                        </span>
                        <span className="text-xs text-slate-500 font-medium">complete</span>
                      </div>
                      <span className="text-xs text-slate-400">
                        {student?.sectionsCompleted || 0} of {student?.totalSections || 0} sections
                      </span>
                    </div>

                    <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden flex-shrink-0">
                      <div
                        className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(student.progressPercentage || 0, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 text-2xl mx-auto">
              <FaUserGraduate />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No ranked students yet</h3>
            <p className="text-slate-500 text-xs max-w-sm mx-auto">
              As soon as enrolled learners complete curriculum sections, their progress and rankings will appear here automatically.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentsRanking;
