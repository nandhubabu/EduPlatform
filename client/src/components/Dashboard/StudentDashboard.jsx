import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  FaBookOpen,
  FaClock,
  FaTrophy,
  FaChartBar,
  FaPlay,
  FaGraduationCap,
  FaCalendarAlt,
  FaStar,
  FaArrowRight,
  FaUser,
  FaBookmark,
} from "react-icons/fa";

const StudentDashboard = () => {
  const { userProfile } = useSelector((state) => state.auth);

  // Mock data - replace with real data from API
  const studentStats = {
    totalCourses: 5,
    completedCourses: 2,
    inProgressCourses: 3,
    totalHours: 48,
    certificatesEarned: 2,
    currentStreak: 7,
  };

  const recentCourses = [
    {
      id: 1,
      title: "Advanced React Development",
      progress: 75,
      instructor: "John Doe",
      nextLesson: "React Hooks Advanced Patterns",
      timeLeft: "2h 30m",
      thumbnail: "/api/placeholder/300/200",
    },
    {
      id: 2,
      title: "Node.js Backend Mastery",
      progress: 45,
      instructor: "Jane Smith",
      nextLesson: "Express.js Middleware",
      timeLeft: "1h 45m",
      thumbnail: "/api/placeholder/300/200",
    },
    {
      id: 3,
      title: "Database Design Fundamentals",
      progress: 20,
      instructor: "Mike Johnson",
      nextLesson: "SQL Joins and Relations",
      timeLeft: "3h 15m",
      thumbnail: "/api/placeholder/300/200",
    },
  ];

  const achievements = [
    { id: 1, title: "First Course Completed", icon: FaGraduationCap, date: "2024-01-15" },
    { id: 2, title: "7-Day Learning Streak", icon: FaTrophy, date: "2024-01-20" },
    { id: 3, title: "Fast Learner", icon: FaClock, date: "2024-01-18" },
  ];

  const upcomingDeadlines = [
    { id: 1, course: "React Development", assignment: "Final Project", dueDate: "2024-02-01" },
    { id: 2, course: "Node.js Backend", assignment: "API Building", dueDate: "2024-02-05" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {userProfile?.username || "Student"}!
              </h1>
              <p className="text-gray-600 mt-1">Continue your learning journey</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {studentStats.currentStreak} day streak 🔥
              </div>
              <Link
                to="/courses"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
              >
                Browse Courses
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Courses</p>
                <p className="text-3xl font-bold text-gray-900">{studentStats.totalCourses}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <FaBookOpen className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-green-600">{studentStats.completedCourses}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <FaGraduationCap className="text-green-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Learning Hours</p>
                <p className="text-3xl font-bold text-purple-600">{studentStats.totalHours}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <FaClock className="text-purple-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Certificates</p>
                <p className="text-3xl font-bold text-yellow-600">{studentStats.certificatesEarned}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <FaTrophy className="text-yellow-600 text-xl" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Continue Learning */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900">Continue Learning</h2>
                <p className="text-gray-600 text-sm mt-1">Pick up where you left off</p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentCourses.map((course) => (
                    <div
                      key={course.id}
                      className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-200"
                    >
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        <FaBookOpen className="text-gray-500" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{course.title}</h3>
                        <p className="text-sm text-gray-600">by {course.instructor}</p>
                        <p className="text-sm text-blue-600">Next: {course.nextLesson}</p>
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                            <span>Progress</span>
                            <span>{course.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${course.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">{course.timeLeft} left</p>
                        <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center space-x-2">
                          <FaPlay className="text-sm" />
                          <span>Continue</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Learning Progress Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900">Learning Progress</h2>
                <p className="text-gray-600 text-sm mt-1">Your weekly learning activity</p>
              </div>
              <div className="p-6">
                <div className="h-64 flex items-end justify-between space-x-2">
                  {[65, 78, 92, 85, 76, 88, 95].map((height, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div
                        className="bg-blue-600 rounded-t w-full transition-all duration-500"
                        style={{ height: `${height}%` }}
                      ></div>
                      <span className="text-xs text-gray-600 mt-2">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
              </div>
              <div className="p-6 space-y-3">
                <Link
                  to="/courses"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition duration-200"
                >
                  <FaBookOpen className="text-blue-600" />
                  <span className="text-gray-700">Browse All Courses</span>
                  <FaArrowRight className="text-gray-400 ml-auto" />
                </Link>
                <Link
                  to="/student-progress"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition duration-200"
                >
                  <FaChartBar className="text-green-600" />
                  <span className="text-gray-700">View Progress</span>
                  <FaArrowRight className="text-gray-400 ml-auto" />
                </Link>
                <Link
                  to="/certificates"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition duration-200"
                >
                  <FaTrophy className="text-yellow-600" />
                  <span className="text-gray-700">My Certificates</span>
                  <FaArrowRight className="text-gray-400 ml-auto" />
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition duration-200"
                >
                  <FaUser className="text-purple-600" />
                  <span className="text-gray-700">Profile Settings</span>
                  <FaArrowRight className="text-gray-400 ml-auto" />
                </Link>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">Recent Achievements</h3>
              </div>
              <div className="p-6 space-y-4">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className="flex items-center space-x-3">
                    <div className="bg-yellow-100 p-2 rounded-lg">
                      <achievement.icon className="text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{achievement.title}</p>
                      <p className="text-sm text-gray-600">{achievement.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Deadlines */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">Upcoming Deadlines</h3>
              </div>
              <div className="p-6 space-y-4">
                {upcomingDeadlines.map((deadline) => (
                  <div key={deadline.id} className="border-l-4 border-red-400 pl-4">
                    <p className="font-medium text-gray-900">{deadline.assignment}</p>
                    <p className="text-sm text-gray-600">{deadline.course}</p>
                    <p className="text-sm text-red-600 flex items-center mt-1">
                      <FaCalendarAlt className="mr-1" />
                      Due: {deadline.dueDate}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
