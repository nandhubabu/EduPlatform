import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  FaBookOpen,
  FaUsers,
  FaDollarSign,
  FaChartLine,
  FaPlus,
  FaEdit,
  FaEye,
  FaStar,
  FaGraduationCap,
  FaCalendarAlt,
  FaBell,
  FaArrowRight,
  FaComments,
  FaDownload,
} from "react-icons/fa";

const InstructorDashboard = () => {
  const { userProfile } = useSelector((state) => state.auth);

  // Mock data - replace with real data from API
  const instructorStats = {
    totalCourses: 8,
    totalStudents: 2847,
    totalRevenue: 15420,
    averageRating: 4.8,
    monthlyGrowth: 12.5,
    completionRate: 78,
  };

  const recentCourses = [
    {
      id: 1,
      title: "Advanced React Development",
      students: 342,
      rating: 4.9,
      revenue: 3240,
      status: "Published",
      lastUpdated: "2024-01-20",
      thumbnail: "/api/placeholder/300/200",
    },
    {
      id: 2,
      title: "Node.js Backend Mastery",
      students: 298,
      rating: 4.7,
      revenue: 2890,
      status: "Published",
      lastUpdated: "2024-01-18",
      thumbnail: "/api/placeholder/300/200",
    },
    {
      id: 3,
      title: "Database Design Fundamentals",
      students: 156,
      rating: 4.6,
      revenue: 1560,
      status: "Draft",
      lastUpdated: "2024-01-15",
      thumbnail: "/api/placeholder/300/200",
    },
  ];

  const recentActivity = [
    { id: 1, type: "enrollment", message: "25 new students enrolled in React Development", time: "2 hours ago" },
    { id: 2, type: "review", message: "New 5-star review on Node.js course", time: "4 hours ago" },
    { id: 3, type: "completion", message: "15 students completed Database Design course", time: "6 hours ago" },
    { id: 4, type: "question", message: "3 new questions in React Development Q&A", time: "8 hours ago" },
  ];

  const monthlyEarnings = [
    { month: "Jan", amount: 2400 },
    { month: "Feb", amount: 2800 },
    { month: "Mar", amount: 3200 },
    { month: "Apr", amount: 2900 },
    { month: "May", amount: 3400 },
    { month: "Jun", amount: 3800 },
  ];

  const topPerformingCourses = [
    { name: "Advanced React Development", students: 342, revenue: 3240, growth: "+15%" },
    { name: "Node.js Backend Mastery", students: 298, revenue: 2890, growth: "+12%" },
    { name: "Database Design Fundamentals", students: 156, revenue: 1560, growth: "+8%" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Instructor Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Hello {userProfile?.username || "Instructor"}, here's your teaching overview
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition duration-200">
                <FaDownload />
                <span>Export Data</span>
              </button>
              <Link
                to="/instructor-add-course"
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
              >
                <FaPlus />
                <span>Create Course</span>
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
                <p className="text-3xl font-bold text-gray-900">{instructorStats.totalCourses}</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <FaChartLine className="mr-1" />
                  +2 this month
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <FaBookOpen className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-3xl font-bold text-gray-900">{instructorStats.totalStudents.toLocaleString()}</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <FaChartLine className="mr-1" />
                  +{instructorStats.monthlyGrowth}% this month
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <FaUsers className="text-green-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900">${instructorStats.totalRevenue.toLocaleString()}</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <FaChartLine className="mr-1" />
                  +$2,340 this month
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <FaDollarSign className="text-yellow-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Rating</p>
                <p className="text-3xl font-bold text-gray-900">{instructorStats.averageRating}</p>
                <div className="flex items-center mt-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`text-sm ${
                        i < Math.floor(instructorStats.averageRating)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <FaStar className="text-purple-600 text-xl" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* My Courses */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">My Courses</h2>
                    <p className="text-gray-600 text-sm mt-1">Manage and track your courses</p>
                  </div>
                  <Link
                    to="/instructor-courses"
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    View All
                  </Link>
                </div>
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
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-gray-900">{course.title}</h3>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              course.status === "Published"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {course.status}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                          <span className="flex items-center">
                            <FaUsers className="mr-1" />
                            {course.students} students
                          </span>
                          <span className="flex items-center">
                            <FaStar className="mr-1 text-yellow-400" />
                            {course.rating}
                          </span>
                          <span className="flex items-center">
                            <FaDollarSign className="mr-1" />
                            ${course.revenue}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Last updated: {course.lastUpdated}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition duration-200">
                          <FaEye />
                        </button>
                        <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition duration-200">
                          <FaEdit />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Revenue Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900">Monthly Revenue</h2>
                <p className="text-gray-600 text-sm mt-1">Your earnings over the last 6 months</p>
              </div>
              <div className="p-6">
                <div className="h-64 flex items-end justify-between space-x-4">
                  {monthlyEarnings.map((data, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div
                        className="bg-gradient-to-t from-blue-600 to-blue-400 rounded-t w-full transition-all duration-500"
                        style={{ height: `${(data.amount / 4000) * 100}%` }}
                      ></div>
                      <span className="text-xs text-gray-600 mt-2">{data.month}</span>
                      <span className="text-xs font-semibold text-gray-900">${data.amount}</span>
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
                  to="/instructor-add-course"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition duration-200"
                >
                  <FaPlus className="text-blue-600" />
                  <span className="text-gray-700">Create New Course</span>
                  <FaArrowRight className="text-gray-400 ml-auto" />
                </Link>
                <Link
                  to="/instructor-courses"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition duration-200"
                >
                  <FaBookOpen className="text-green-600" />
                  <span className="text-gray-700">Manage Courses</span>
                  <FaArrowRight className="text-gray-400 ml-auto" />
                </Link>
                <Link
                  to="/analytics"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition duration-200"
                >
                  <FaChartLine className="text-purple-600" />
                  <span className="text-gray-700">View Analytics</span>
                  <FaArrowRight className="text-gray-400 ml-auto" />
                </Link>
                <Link
                  to="/students"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition duration-200"
                >
                  <FaUsers className="text-yellow-600" />
                  <span className="text-gray-700">Student Management</span>
                  <FaArrowRight className="text-gray-400 ml-auto" />
                </Link>
              </div>
            </div>

            {/* Top Performing Courses */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">Top Performing</h3>
              </div>
              <div className="p-6 space-y-4">
                {topPerformingCourses.map((course, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">{course.name}</p>
                      <div className="flex items-center space-x-3 text-xs text-gray-600 mt-1">
                        <span>{course.students} students</span>
                        <span>${course.revenue}</span>
                      </div>
                    </div>
                    <span className="text-green-600 text-sm font-medium">{course.growth}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              </div>
              <div className="p-6 space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${
                      activity.type === 'enrollment' ? 'bg-blue-100' :
                      activity.type === 'review' ? 'bg-yellow-100' :
                      activity.type === 'completion' ? 'bg-green-100' : 'bg-purple-100'
                    }`}>
                      {activity.type === 'enrollment' && <FaUsers className="text-blue-600 text-sm" />}
                      {activity.type === 'review' && <FaStar className="text-yellow-600 text-sm" />}
                      {activity.type === 'completion' && <FaGraduationCap className="text-green-600 text-sm" />}
                      {activity.type === 'question' && <FaComments className="text-purple-600 text-sm" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
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

export default InstructorDashboard;
