import { useQuery } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";
import {
  FaBookOpen,
  FaUser,
  FaUsers,
  FaLayerGroup,
  FaStar,
  FaCalendarAlt,
  FaSearch,
  FaFilter,
  FaBrain,
  FaHeart,
  FaGraduationCap,
  FaChevronDown,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";
import { getAllCoursesAPI } from "../../reactQuery/courses/coursesAPI";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import AlertMessage from "../Alert/AlertMessage";

// Course API functions
import axios from 'axios';
import { BASE_URL } from "../../utils/utils";

const fetchPersonalizedRecommendations = async () => {
  const response = await axios.get(`${BASE_URL}/courses/recommendations/personalized`, {
    withCredentials: true,
  });
  return response.data;
};

const searchCourses = async (query, filters = {}) => {
  const params = new URLSearchParams({
    query: query || "",
    ...filters,
  });
  
  const response = await axios.get(`${BASE_URL}/courses/search?${params}`, {
    withCredentials: true,
  });
  return response.data;
};

const enrollInCourse = async (courseId) => {
  const response = await axios.post(`${BASE_URL}/courses/${courseId}/enroll`, {}, {
    withCredentials: true,
  });
  return response.data;
};

const CourseCard = ({ course, isRecommended = false, onEnroll, currentUser }) => {
  const [isEnrolling, setIsEnrolling] = useState(false);

  // Check if user is already enrolled
  const isEnrolled = currentUser && course?.students?.includes(currentUser._id);
  const isInstructor = currentUser && course?.user?._id === currentUser._id;

  const handleEnroll = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isEnrolled || isInstructor) return;
    
    setIsEnrolling(true);
    try {
      await onEnroll(course._id);
    } catch (error) {
      console.error('Enrollment failed:', error);
    } finally {
      setIsEnrolling(false);
    }
  };

  return (
    <Link
      to={`/courses/${course._id}`}
      className="no-underline transform hover:scale-[1.02] transition duration-300 relative group"
    >
      {isRecommended && (
        <div className="absolute -top-2 -right-2 z-10">
          <div className="bg-gradient-to-r from-yellow-500 to-amber-500 text-[#0a0d14] px-3 py-1 rounded-full text-xs font-black flex items-center shadow-[0_0_15px_rgba(234,179,8,0.4)]">
            <FaBrain className="mr-1 animate-pulse" />
            AI Pick
          </div>
        </div>
      )}
      
      <div className={`backdrop-blur-xl border rounded-2xl overflow-hidden transition-all duration-300 ${
        isRecommended 
          ? 'bg-yellow-500/5 border-yellow-500/30 shadow-[0_0_30px_rgba(234,179,8,0.1)] hover:border-yellow-500/50' 
          : 'bg-white/3 border-white/5 hover:border-purple-500/20 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] shadow-xl'
      }`}>
        <div className="p-6">
          <div className="text-center">
            <div className={`mx-auto w-16 h-16 rounded-xl flex items-center justify-center mb-4 ${
              isRecommended ? 'bg-yellow-500/10 text-yellow-400' : 'bg-purple-500/10 text-purple-400'
            }`}>
              <FaBookOpen className="text-3xl" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-white group-hover:text-purple-400 transition-colors line-clamp-1">
              {course?.title}
            </h3>
            <p className="text-slate-400 text-sm mb-4 line-clamp-3">{course.description}</p>
          </div>
          
          <div className="text-sm space-y-3 pt-2 border-t border-white/5">
            {/* Instructor */}
            <div className="flex items-center justify-between">
              <span className="flex items-center space-x-2 text-slate-300">
                <FaUser className="text-purple-400 text-xs" />
                <span className="text-xs">{course?.user?.username}</span>
              </span>
              <span className="text-cyan-300 font-medium text-xs bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded">
                {course?.difficulty || course?.level}
              </span>
            </div>
            
            {/* Total students and estimated hours */}
            <div className="flex items-center justify-between">
              <span className="flex items-center space-x-2 text-slate-300">
                <FaUsers className="text-purple-400 text-xs" />
                <span className="text-xs">{course?.students?.length || 0} Students</span>
              </span>
              {course?.estimatedHours && (
                <span className="flex items-center space-x-1 text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded">
                  <FaClock className="text-xs" />
                  <span className="text-xs">{course.estimatedHours}h</span>
                </span>
              )}
            </div>
            
            {/* Category and price */}
            <div className="flex items-center justify-between">
              {course?.category ? (
                <span className="text-purple-300 font-medium text-xs bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded">
                  {course.category}
                </span>
              ) : (
                <div />
              )}
              {course?.price !== undefined && (
                <span className="text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded text-xs">
                  {course.price === 0 ? 'Free' : `$${course.price}`}
                </span>
              )}
            </div>
            
            {/* Total modules and rating */}
            <div className="flex items-center justify-between">
              <span className="flex items-center space-x-2 text-slate-300">
                <FaLayerGroup className="text-purple-400 text-xs" />
                <span className="text-xs">{course?.modules?.length || course?.sections?.length || 0} Modules</span>
              </span>
              {course?.rating > 0 && (
                <span className="flex items-center space-x-1 text-slate-300">
                  <FaStar className="text-yellow-500 text-xs" />
                  <span className="text-xs font-semibold">{course.rating.toFixed(1)}</span>
                </span>
              )}
            </div>

            {/* Enroll button */}
            <div className="pt-4 border-t border-white/5">
              {isInstructor ? (
                <div className="w-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 py-2 px-4 rounded-lg flex items-center justify-center space-x-2 text-sm font-semibold">
                  <FaGraduationCap />
                  <span>Your Course</span>
                </div>
              ) : isEnrolled ? (
                <div className="w-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 py-2 px-4 rounded-lg flex items-center justify-center space-x-2 text-sm font-semibold">
                  <FaCheckCircle />
                  <span>Enrolled</span>
                </div>
              ) : (
                <button
                  onClick={handleEnroll}
                  disabled={isEnrolling}
                  className="w-full bg-gradient-to-r from-purple-600 to-cyan-500 text-white py-2 px-4 rounded-lg hover:from-purple-700 hover:to-cyan-600 transition duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 text-sm font-semibold shadow-[0_0_15px_rgba(124,58,237,0.3)]"
                >
                  {isEnrolling ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Enrolling...</span>
                    </>
                  ) : (
                    <>
                      <FaGraduationCap />
                      <span>Enroll Now</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

const Courses = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showRecommendations, setShowRecommendations] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [enrollmentMessage, setEnrollmentMessage] = useState("");

  const { isAuthenticated, userProfile } = useSelector((state) => state.auth);
  const isLoggedIn = isAuthenticated;

  // Query for all courses
  const { data: coursesData, error, isLoading, isError } = useQuery({
    queryKey: ["courses"],
    queryFn: getAllCoursesAPI,
    staleTime: 0,
    cacheTime: 0,
  });

  // Query for personalized recommendations (only if logged in)
  const { data: recommendationsData, isLoading: isLoadingRecommendations } = useQuery({
    queryKey: ["personalizedRecommendations"],
    queryFn: fetchPersonalizedRecommendations,
    enabled: !!isLoggedIn,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Query for search results
  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ["courseSearch", searchQuery, selectedDifficulty, selectedCategory],
    queryFn: () => searchCourses(searchQuery, {
      difficulty: selectedDifficulty,
      category: selectedCategory,
      userInterests: isLoggedIn ? "true" : "false"
    }),
    enabled: !!(searchQuery?.length > 0 || selectedDifficulty || selectedCategory),
    staleTime: 30 * 1000, // 30 seconds
  });

  const handleEnrollment = async (courseId) => {
    if (!isLoggedIn) {
      setEnrollmentMessage("Please log in to enroll in courses");
      return;
    }

    try {
      await enrollInCourse(courseId);
      setEnrollmentMessage("Successfully enrolled! Check your dashboard.");
    } catch (error) {
      console.error('Enrollment error:', error);
      
      // Handle specific error cases
      if (error.response?.status === 409) {
        setEnrollmentMessage("You are already enrolled in this course!");
      } else if (error.response?.status === 403) {
        setEnrollmentMessage("Instructors cannot enroll in their own courses.");
      } else {
        setEnrollmentMessage(error.response?.data?.message || error.message || "Enrollment failed. Please try again.");
      }
    }

    // Clear message after 3 seconds
    setTimeout(() => setEnrollmentMessage(""), 3000);
  };

  // Determine which data to display
  const displayData = searchResults?.courses || coursesData;
  const recommendedCourses = recommendationsData?.recommendedCourses || [];
  const hasAssessment = recommendationsData?.hasAssessment;

  // Show loading
  if (isLoading) {
    return <AlertMessage type="loading" message="Loading courses..." />;
  }

  // Show error
  if (isError) {
    return (
      <AlertMessage
        type="error"
        message={error?.response?.data?.message || error?.message}
      />
    );
  }

  const categories = [
    'Web Development', 'Data Science', 'Digital Marketing', 'Design', 
    'Business', 'Cloud Computing', 'Mobile Development', 'AI/Machine Learning',
    'Cybersecurity', 'DevOps'
  ];

  return (
    <div className="min-h-screen bg-[#0a0d14] text-slate-100 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background orbs */}
      <div style={{
        position: "absolute", top: "5%", left: "10%", width: "400px", height: "400px",
        borderRadius: "50%", background: "rgba(124,58,237,0.08)", filter: "blur(100px)",
        pointerEvents: "none"
      }} />
      <div style={{
        position: "absolute", top: "50%", right: "5%", width: "450px", height: "450px",
        borderRadius: "50%", background: "rgba(6,182,212,0.05)", filter: "blur(120px)",
        pointerEvents: "none"
      }} />

      {/* Header */}
      <div className="text-center mb-12 relative z-10">
        <h2 className="text-4xl sm:text-5xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
          Explore Our Courses
        </h2>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
          Discover courses tailored to your career goals and interests
        </p>
      </div>

      {/* Enrollment Message */}
      {enrollmentMessage && (
        <div className={`mb-6 p-4 rounded-xl border text-center font-medium relative z-10 ${
          enrollmentMessage.includes('Successfully') 
            ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/20' 
            : 'bg-red-950/40 text-red-300 border-red-500/20'
        }`}>
          {enrollmentMessage}
        </div>
      )}

      {/* Search and Filters */}
      <div className="mb-12 bg-white/3 backdrop-blur-xl border border-white/5 rounded-2xl shadow-2xl p-6 relative z-10">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {/* Search Input */}
          <div className="flex-1 relative w-full">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[#090b11] border border-white/10 text-white placeholder-slate-500 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition duration-200"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-5 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-slate-200 rounded-xl transition duration-200 w-full md:w-auto justify-center"
          >
            <FaFilter />
            <span>Filters</span>
            <FaChevronDown className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-white/5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Difficulty Filter */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Difficulty Level
                </label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full p-2.5 bg-[#090b11] border border-white/10 text-slate-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
                >
                  <option value="">All Levels</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2.5 bg-[#090b11] border border-white/10 text-slate-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* AI Recommendations Section */}
      {isLoggedIn && showRecommendations && recommendedCourses.length > 0 && (
        <div className="mb-12 relative z-10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-extrabold text-white flex items-center">
              <FaBrain className="text-yellow-500 mr-3 animate-pulse" />
              AI-Powered Recommendations
            </h3>
            <button
              onClick={() => setShowRecommendations(false)}
              className="text-slate-400 hover:text-slate-200 text-sm font-semibold transition duration-200"
            >
              Hide
            </button>
          </div>
          
          {recommendationsData?.aiRecommendations && (
            <div className="bg-[#7c3aed]/5 border border-[#7c3aed]/20 p-5 rounded-2xl mb-8 shadow-[0_0_20px_rgba(124,58,237,0.05)]">
              <h4 className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-2 flex items-center gap-2">
                <FaBrain className="text-purple-400" />
                AI Insights:
              </h4>
              <p className="text-slate-300 text-sm leading-relaxed">{recommendationsData.aiRecommendations}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedCourses.map((course) => (
              <CourseCard
                key={course._id}
                course={course}
                isRecommended={true}
                onEnroll={handleEnrollment}
                currentUser={userProfile}
              />
            ))}
          </div>
        </div>
      )}

      {/* Assessment CTA for non-assessed users */}
      {isLoggedIn && !hasAssessment && (
        <div className="mb-12 bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-500/30 text-white rounded-2xl p-8 text-center backdrop-blur-xl relative overflow-hidden shadow-[0_0_30px_rgba(168,85,247,0.15)] z-10">
          <FaHeart className="mx-auto text-4xl mb-4 text-pink-400 animate-pulse" />
          <h3 className="text-2xl font-black mb-2 text-white">Get Personalized Course Recommendations!</h3>
          <p className="mb-6 text-slate-300 text-sm max-w-xl mx-auto">Take our career assessment to discover courses perfectly matched to your interests and goals.</p>
          <Link
            to="/dashboard"
            className="inline-flex items-center space-x-2 bg-white text-[#0a0d14] px-6 py-3 rounded-xl font-bold hover:bg-slate-100 transition duration-200 shadow-lg"
          >
            <FaBrain />
            <span>Take Assessment</span>
          </Link>
        </div>
      )}

      {/* All Courses Section */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-extrabold text-white">
            {searchQuery || selectedDifficulty || selectedCategory ? 'Search Results' : 'All Courses'}
          </h3>
          <p className="text-slate-400 text-sm">
            {displayData?.length || 0} courses found
          </p>
        </div>

        {/* Loading State */}
        {(isSearching && (searchQuery || selectedDifficulty || selectedCategory)) && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
            <p className="mt-4 text-slate-400">Searching courses...</p>
          </div>
        )}

        {/* No Courses Found */}
        {displayData && displayData.length === 0 && (
          <div className="text-center py-16">
            <FaBookOpen className="mx-auto text-6xl text-slate-600 mb-4" />
            <h4 className="text-xl font-bold text-slate-300 mb-2">No courses found</h4>
            <p className="text-slate-500 text-sm">Try adjusting your search criteria or browse all courses.</p>
          </div>
        )}

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayData?.map((course) => (
            <CourseCard
              key={course._id}
              course={course}
              onEnroll={handleEnrollment}
              currentUser={userProfile}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Courses;
