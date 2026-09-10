import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import React from "react";
import { FaMedal, FaArrowLeft, FaTrophy, FaUserGraduate } from "react-icons/fa";
import { getAllUsersAPI } from "../../reactQuery/user/usersAPI";
import AlertMessage from "../Alert/AlertMessage";

const StudentsRanking = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["students-ranking", courseId],
    queryFn: () => getAllUsersAPI(courseId),
    enabled: !!courseId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto" />
          <p className="text-slate-400 text-sm font-medium">Loading student rankings...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center px-4">
        <div className="bg-[#0f1524] border border-slate-800 p-8 rounded-2xl max-w-md w-full text-center space-y-4">
          <h2 className="text-xl font-bold text-white">Error Loading Rankings</h2>
          <p className="text-slate-400 text-sm">{error?.response?.data?.message || "Failed to load student rankings"}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const students = Array.isArray(data) ? data : [];

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        {/* Navigation */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition text-sm font-medium"
        >
          <FaArrowLeft className="text-xs" />
          <span>Back to Course Details</span>
        </button>

        {/* Header Banner */}
        <div className="bg-[#0f1524] border border-slate-800 rounded-3xl p-8 backdrop-blur-xl shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-white text-2xl shadow-lg shadow-amber-500/20">
              <FaTrophy />
            </div>
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Learner Leaderboard</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5">
                Student Progress Rankings
              </h1>
              <p className="text-slate-400 text-xs mt-1">
                Real-time completion leaderboard for enrolled students
              </p>
            </div>
          </div>
          <div className="px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
            <span className="text-xs text-slate-400">Total Ranked</span>
            <p className="text-lg font-bold text-white">{students.length}</p>
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
                ? "bg-amber-400/10 border-amber-400/30 text-amber-400"
                : isSilver
                ? "bg-slate-300/10 border-slate-300/30 text-slate-300"
                : isBronze
                ? "bg-amber-700/10 border-amber-700/30 text-amber-600"
                : "bg-slate-800/80 border-slate-700/80 text-slate-400";

              return (
                <div
                  key={student?.id || student?._id || index}
                  className="bg-[#0f1524] border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-700 transition shadow-lg"
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
                        <h3 className="text-sm font-bold text-white truncate">
                          {student.username || "Anonymous Learner"}
                        </h3>
                        {isGold && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                            1st Place
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Joined {student?.dateJoined ? new Date(student.dateJoined).toLocaleDateString() : "Recently"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 justify-between sm:justify-end">
                    <div className="text-right">
                      <div className="flex items-baseline gap-1 sm:justify-end">
                        <span className="text-base font-extrabold text-blue-400">
                          {student.progressPercentage || 0}%
                        </span>
                        <span className="text-xs text-slate-400 font-medium">complete</span>
                      </div>
                      <span className="text-xs text-slate-500">
                        {student?.sectionsCompleted || 0} of {student?.totalSections || 0} sections
                      </span>
                    </div>

                    <div className="w-24 bg-slate-800 rounded-full h-2 overflow-hidden flex-shrink-0">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(student.progressPercentage || 0, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-[#0f1524] border border-slate-800 rounded-3xl p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-center text-slate-400 text-2xl mx-auto">
              <FaUserGraduate />
            </div>
            <h3 className="text-lg font-bold text-white">No ranked students yet</h3>
            <p className="text-slate-400 text-xs max-w-sm mx-auto">
              As soon as enrolled learners complete curriculum sections, their progress and rankings will appear here automatically.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentsRanking;
