import { useQuery } from "@tanstack/react-query";
import React, { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  FaSearch,
  FaFilter,
  FaStar,
  FaClock,
  FaPlay,
  FaCheckCircle,
  FaBrain,
  FaGraduationCap,
  FaTimes,
  FaSlidersH,
  FaThLarge,
  FaList,
  FaArrowRight,
  FaDollarSign,
  FaTag,
} from "react-icons/fa";
import { getAllCoursesAPI } from "../../reactQuery/courses/coursesAPI";
import { BASE_URL } from "../../utils/utils";
import AlertMessage from "../Alert/AlertMessage";
import { REAL_COURSES } from "../../data/realCourses";

const CATEGORIES = [
  "Web Development",
  "AI & Machine Learning",
  "Data Science",
  "Cloud & DevOps",
  "Cybersecurity",
  "Mobile Development",
  "Design & UI/UX",
  "Business & Tech",
];

const LEVELS = ["All Levels", "Beginner", "Intermediate", "Advanced"];

const RATINGS_FILTER = [
  { label: "4.5 & up", min: 4.5 },
  { label: "4.0 & up", min: 4.0 },
  { label: "3.5 & up", min: 3.5 },
];

const fetchPersonalizedRecommendations = async () => {
  const response = await axios.get(`${BASE_URL}/courses/recommendations/personalized`, {
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

/* ─── UDEMY / COURSERA COURSE CARD COMPONENT ───────────────────────── */
const CourseCard = ({ course, isRecommended = false, onEnroll, currentUser, viewMode = "grid" }) => {
  const [isEnrolling, setIsEnrolling] = useState(false);

  const isEnrolled = currentUser && course?.students?.some(
    (s) => s === currentUser._id || s?._id === currentUser._id
  );
  const isInstructor = currentUser && (
    course?.user === currentUser._id || course?.user?._id === currentUser._id
  );

  const handleEnroll = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isEnrolled || isInstructor) return;

    setIsEnrolling(true);
    try {
      await onEnroll(course._id);
    } catch (err) {
      console.error("Enrollment failed:", err);
    } finally {
      setIsEnrolling(false);
    }
  };

  const rating = course?.rating || 4.8;
  const reviewsCount = course?.reviewsCount || (course?.students?.length ? course.students.length * 7 + 42 : 180);
  const hours = course?.estimatedHours || 24;
  const lectures = course?.lectures || course?.sections?.length || course?.modules?.length || 16;
  const instructorName = course?.instructor || course?.user?.username || "EduPlatform Expert";
  const thumbnail = course?.thumbnail?.url || (typeof course?.thumbnail === 'string' ? course?.thumbnail : "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80");

  if (viewMode === "list") {
    return (
      <Link
        to={`/courses/${course._id}`}
        className="group bg-white border border-slate-200 hover:border-indigo-300 rounded-2xl p-4 transition-all duration-200 flex flex-col sm:flex-row gap-5 no-underline shadow-sm hover:shadow-lg hover:shadow-indigo-500/5"
      >
        <div className="relative aspect-video sm:w-60 flex-shrink-0 rounded-xl overflow-hidden bg-slate-100">
          <img
            src={thumbnail}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent flex items-center justify-center transition-colors">
            <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
              <FaPlay className="text-xs ml-0.5" />
            </div>
          </div>
          {isRecommended && (
            <div className="absolute top-2 left-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-2 py-0.5 rounded text-[10px] font-black uppercase shadow-sm">
              AI Pick
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col justify-between space-y-2">
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                {course.category || "General"}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {course.difficulty || "All Levels"}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mt-1.5 line-clamp-1">
              {course.title}
            </h3>
            <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
              {course.description || "Master core concepts with hands-on practice, code walkthroughs, and real-world projects."}
            </p>
            <p className="text-xs text-slate-600 font-medium mt-1.5">
              Instructor: <span className="text-slate-900 font-semibold">{instructorName}</span>
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-amber-500 text-xs font-black">
                <span>{rating.toFixed(1)}</span>
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} />
                  ))}
                </div>
                <span className="text-slate-500 font-normal">({reviewsCount})</span>
              </div>
              <span className="text-slate-300">&bull;</span>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <FaClock className="text-slate-400" />
                {hours} hrs &bull; {lectures} lectures
              </span>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-lg font-black text-slate-900">
                {course.price ? `$${course.price}` : "Free"}
              </span>
              <button
                onClick={handleEnroll}
                disabled={isEnrolling || isEnrolled}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  isEnrolled
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-300"
                    : isInstructor
                    ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                }`}
              >
                {isEnrolled ? (
                  <>
                    <FaCheckCircle />
                    <span>Enrolled</span>
                  </>
                ) : isInstructor ? (
                  <span>My Course</span>
                ) : (
                  <span>Enroll</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Grid view (Udemy Card Style)
  return (
    <Link
      to={`/courses/${course._id}`}
      className="group bg-white border border-slate-200 hover:border-indigo-300 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 flex flex-col no-underline"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
        <img
          src={thumbnail}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent transition-colors flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
            <FaPlay className="text-xs ml-0.5" />
          </div>
        </div>

        {isRecommended ? (
          <div className="absolute top-2.5 left-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-2.5 py-0.5 rounded text-[10px] font-black uppercase shadow-sm flex items-center gap-1">
            <FaBrain />
            <span>AI Pick</span>
          </div>
        ) : (
          <div className="absolute top-2.5 left-2.5 bg-indigo-600 text-white px-2.5 py-0.5 rounded text-[10px] font-bold uppercase shadow-sm">
            Featured
          </div>
        )}

        <div className="absolute bottom-2 right-2 bg-slate-900/80 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[10px] font-semibold">
          {course.difficulty || "All Levels"}
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          <div className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
            {course.category || "General"}
          </div>
          <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug">
            {course.title}
          </h3>
          <p className="text-xs text-slate-500 truncate">
            {instructorName}
          </p>

          <div className="flex items-center gap-1.5 pt-0.5">
            <span className="text-sm font-black text-amber-500">
              {rating.toFixed(1)}
            </span>
            <div className="flex text-amber-400 text-xs">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} />
              ))}
            </div>
            <span className="text-xs text-slate-500">
              ({reviewsCount})
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1">
            <span className="flex items-center gap-1">
              <FaClock className="text-slate-400" />
              {hours} hrs
            </span>
            <span>&bull;</span>
            <span>{lectures} lectures</span>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-black text-slate-900">
              {course.price ? `$${course.price}` : "Free"}
            </span>
            {course.price > 0 && (
              <span className="text-xs text-slate-400 line-through">
                ${(course.price * 3).toFixed(2)}
              </span>
            )}
          </div>

          <button
            onClick={handleEnroll}
            disabled={isEnrolling || isEnrolled}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
              isEnrolled
                ? "bg-emerald-50 text-emerald-700 border border-emerald-300"
                : isInstructor
                ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
            }`}
          >
            {isEnrolled ? (
              <>
                <FaCheckCircle />
                <span>Enrolled</span>
              </>
            ) : isInstructor ? (
              <span>My Course</span>
            ) : (
              <span>Enroll</span>
            )}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default function Courses() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [selectedRating, setSelectedRating] = useState(null);
  const [priceFilter, setPriceFilter] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [viewMode, setViewMode] = useState("grid");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [enrollmentMessage, setEnrollmentMessage] = useState("");

  const { isAuthenticated, userProfile } = useSelector((state) => state.auth);

  // Sync URL params
  useEffect(() => {
    const s = searchParams.get("search");
    const c = searchParams.get("category");
    if (s !== null) setSearchQuery(s);
    if (c !== null) setSelectedCategory(c);
  }, [searchParams]);

  // Query for all courses
  const {
    data: coursesData,
    error,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["courses"],
    queryFn: getAllCoursesAPI,
    staleTime: 30 * 1000,
  });

  // Query recommendations
  const { data: recommendationsData } = useQuery({
    queryKey: ["personalizedRecommendations"],
    queryFn: fetchPersonalizedRecommendations,
    enabled: !!isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });

  const handleEnrollment = async (courseId) => {
    if (!isAuthenticated) {
      setEnrollmentMessage("Please log in to enroll in courses");
      return;
    }

    try {
      await enrollInCourse(courseId);
      setEnrollmentMessage("Successfully enrolled! Check your learning dashboard.");
      refetch();
    } catch (err) {
      if (err.response?.status === 409) {
        setEnrollmentMessage("You are already enrolled in this course!");
      } else if (err.response?.status === 403) {
        setEnrollmentMessage("Instructors cannot enroll in their own courses.");
      } else {
        setEnrollmentMessage(err.response?.data?.message || "Enrollment failed. Please try again.");
      }
    }
    setTimeout(() => setEnrollmentMessage(""), 4000);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedDifficulty("");
    setSelectedRating(null);
    setPriceFilter("all");
    setSearchParams({});
  };

  // Filter & Sort computation
  const filteredCourses = useMemo(() => {
    const rawCourses = coursesData && Array.isArray(coursesData) && coursesData.length > 0
      ? coursesData
      : REAL_COURSES;

    let result = [...rawCourses];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.title?.toLowerCase().includes(q) ||
          c.description?.toLowerCase().includes(q) ||
          c.category?.toLowerCase().includes(q) ||
          c.user?.username?.toLowerCase().includes(q)
      );
    }

    if (selectedCategory) {
      result = result.filter(
        (c) => c.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (selectedDifficulty && selectedDifficulty !== "All Levels") {
      result = result.filter(
        (c) => c.difficulty?.toLowerCase() === selectedDifficulty.toLowerCase()
      );
    }

    if (selectedRating) {
      result = result.filter((c) => (c.rating || 4.8) >= selectedRating);
    }

    if (priceFilter === "free") {
      result = result.filter((c) => !c.price || c.price === 0);
    } else if (priceFilter === "paid") {
      result = result.filter((c) => c.price > 0);
    }

    // Sort
    if (sortBy === "popular") {
      result.sort((a, b) => (b.students?.length || 0) - (a.students?.length || 0));
    } else if (sortBy === "highest-rated") {
      result.sort((a, b) => (b.rating || 4.8) - (a.rating || 4.8));
    } else if (sortBy === "newest") {
      result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    } else if (sortBy === "price-low") {
      result.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === "price-high") {
      result.sort((a, b) => (b.price || 0) - (a.price || 0));
    }

    return result;
  }, [coursesData, searchQuery, selectedCategory, selectedDifficulty, selectedRating, priceFilter, sortBy]);

  const recommendedList = recommendationsData?.recommendedCourses || [];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans antialiased pb-20">
      {/* ─── HEADER BANNER (Clean Modern Light Catalog Billboard) ─────────── */}
      <div className="bg-white border-b border-slate-200 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                {selectedCategory ? `${selectedCategory} Courses` : "Explore All Courses"}
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1">
                {selectedCategory || "Skill-Building Online Courses"}
              </h1>
              <p className="text-slate-600 text-sm mt-1 max-w-2xl">
                Explore comprehensive curriculum taught by industry veterans. Gain hands-on project experience and verifiable certificates.
              </p>
            </div>

            {/* AI Recommendation Banner Pill */}
            <Link
              to="/assessment"
              className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold hover:bg-indigo-100 hover:border-indigo-300 transition shadow-sm self-start md:self-auto"
            >
              <FaBrain className="text-sm text-indigo-600" />
              <span>Take AI Career Assessment to get personalized picks &rarr;</span>
            </Link>
          </div>

          {/* Toast Alert Message */}
          {enrollmentMessage && (
            <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-800 text-sm font-semibold flex items-center gap-2 animate-fadeIn">
              <FaCheckCircle className="text-indigo-600" />
              <span>{enrollmentMessage}</span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Top Controls Bar: Search summary, sort, view mode */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-sm"
            >
              <FaSlidersH />
              <span>Filters</span>
            </button>
            <span className="text-sm font-bold text-slate-600">
              Showing <span className="text-slate-900 font-extrabold">{filteredCourses.length}</span> courses
              {searchQuery && <span> for &ldquo;{searchQuery}&rdquo;</span>}
            </span>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-semibold hidden sm:inline">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-slate-200 text-slate-800 text-xs font-bold rounded-xl px-3 py-2 shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              >
                <option value="popular">Most Popular</option>
                <option value="highest-rated">Highest Rated</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            {/* Grid / List View Toggle */}
            <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl p-0.5">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg text-xs transition ${
                  viewMode === "grid" ? "bg-white text-indigo-600 shadow-sm font-bold" : "text-slate-500 hover:text-slate-900"
                }`}
                aria-label="Grid View"
              >
                <FaThLarge />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-lg text-xs transition ${
                  viewMode === "list" ? "bg-white text-indigo-600 shadow-sm font-bold" : "text-slate-500 hover:text-slate-900"
                }`}
                aria-label="List View"
              >
                <FaList />
              </button>
            </div>
          </div>
        </div>

        {/* ─── 2-COLUMN LAYOUT (Udemy / Coursera Standard) ───────────── */}
        <div className="grid lg:grid-cols-12 gap-8 pt-8 items-start">
          {/* LEFT SIDEBAR: FILTERS */}
          <aside className="hidden lg:block lg:col-span-3 space-y-6 sticky top-24">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <FaFilter className="text-indigo-600 text-xs" />
                <span>Filters</span>
              </span>
              {(selectedCategory || selectedDifficulty || selectedRating || priceFilter !== "all" || searchQuery) && (
                <button
                  onClick={clearFilters}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">Category</h4>
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(selectedCategory === cat ? "" : cat)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-left transition ${
                      selectedCategory === cat
                        ? "bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    <span>{cat}</span>
                    {selectedCategory === cat && <FaCheckCircle className="text-xs text-indigo-600" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Ratings Filter */}
            <div className="space-y-3 pt-4 border-t border-slate-200">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">Ratings</h4>
              <div className="space-y-1.5">
                {RATINGS_FILTER.map((rf) => (
                  <button
                    key={rf.label}
                    onClick={() => setSelectedRating(selectedRating === rf.min ? null : rf.min)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
                      selectedRating === rf.min
                        ? "bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-amber-500">
                      <div className="flex text-xs text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} />
                        ))}
                      </div>
                      <span className="text-slate-700 font-medium">{rf.label}</span>
                    </div>
                    {selectedRating === rf.min && <FaCheckCircle className="text-xs text-indigo-600" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Level Filter */}
            <div className="space-y-3 pt-4 border-t border-slate-200">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">Level</h4>
              <div className="space-y-1.5">
                {LEVELS.map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setSelectedDifficulty(selectedDifficulty === lvl ? "" : lvl)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
                      selectedDifficulty === lvl
                        ? "bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    <span>{lvl}</span>
                    {selectedDifficulty === lvl && <FaCheckCircle className="text-xs text-indigo-600" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="space-y-3 pt-4 border-t border-slate-200">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">Price</h4>
              <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                {["all", "free", "paid"].map((p) => (
                  <button
                    key={p}
                    onClick={() => setPriceFilter(p)}
                    className={`py-1.5 text-xs font-bold uppercase rounded-lg transition ${
                      priceFilter === p
                        ? "bg-white text-indigo-600 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* RIGHT MAIN CATALOG */}
          <main className="lg:col-span-9 space-y-8">
            {isLoading ? (
              <div className="py-20 text-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto" />
                <p className="text-slate-500 text-sm">Loading course library...</p>
              </div>
            ) : isError ? (
              <AlertMessage
                type="error"
                message={error?.response?.data?.message || "Failed to load courses"}
              />
            ) : filteredCourses.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-4 shadow-sm">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto text-2xl">
                  <FaSearch />
                </div>
                <h3 className="text-xl font-bold text-slate-900">No matching courses found</h3>
                <p className="text-slate-600 text-sm max-w-md mx-auto">
                  Try adjusting your search terms or clearing some filters to explore our full curriculum.
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid sm:grid-cols-2 xl:grid-cols-3 gap-6"
                    : "space-y-4"
                }
              >
                {filteredCourses.map((course) => (
                  <CourseCard
                    key={course._id}
                    course={course}
                    isRecommended={recommendedList.some((r) => r._id === course._id)}
                    onEnroll={handleEnrollment}
                    currentUser={userProfile}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* MOBILE FILTERS DRAWER */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-xs bg-white h-full p-6 shadow-2xl overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <span className="text-base font-bold text-slate-900">Filter Courses</span>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <FaTimes size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase text-slate-700">Category</h4>
              <div className="space-y-1">
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setSelectedCategory(selectedCategory === c ? "" : c);
                      setMobileFilterOpen(false);
                    }}
                    className="w-full text-left p-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100"
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-200">
              <h4 className="text-xs font-bold uppercase text-slate-700">Level</h4>
              <div className="space-y-1">
                {LEVELS.map((l) => (
                  <button
                    key={l}
                    onClick={() => {
                      setSelectedDifficulty(selectedDifficulty === l ? "" : l);
                      setMobileFilterOpen(false);
                    }}
                    className="w-full text-left p-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100"
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <button
                onClick={() => {
                  clearFilters();
                  setMobileFilterOpen(false);
                }}
                className="w-full py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
