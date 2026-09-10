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
  const lectures = course?.sections?.length || course?.modules?.length || 16;
  const instructorName = course?.user?.username || "EduPlatform Expert";
  const thumbnail = course?.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80";

  if (viewMode === "list") {
    return (
      <Link
        to={`/courses/${course._id}`}
        className="group bg-[#0f1524] border border-slate-800 hover:border-blue-500/50 rounded-2xl p-4 transition-all duration-200 flex flex-col sm:flex-row gap-5 no-underline shadow-md hover:shadow-xl hover:shadow-blue-500/5"
      >
        <div className="relative aspect-video sm:w-60 flex-shrink-0 rounded-xl overflow-hidden bg-slate-800">
          <img
            src={thumbnail}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 flex items-center justify-center transition-colors">
            <div className="w-10 h-10 rounded-full bg-blue-600/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <FaPlay className="text-xs ml-0.5" />
            </div>
          </div>
          {isRecommended && (
            <div className="absolute top-2 left-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 px-2 py-0.5 rounded text-[10px] font-black uppercase">
              AI Pick
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col justify-between space-y-2">
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
                {course.category || "General"}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {course.difficulty || "All Levels"}
              </span>
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors mt-1.5 line-clamp-1">
              {course.title}
            </h3>
            <p className="text-xs text-slate-400 line-clamp-2 mt-1">
              {course.description || "Master core concepts with hands-on practice, code walkthroughs, and real-world projects."}
            </p>
            <p className="text-xs text-slate-300 font-medium mt-1">
              Instructor: <span className="text-slate-200">{instructorName}</span>
            </p>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-amber-400 text-xs font-black">
                <span>{rating.toFixed(1)}</span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} />
                  ))}
                </div>
                <span className="text-slate-400 font-normal">({reviewsCount})</span>
              </div>
              <span className="text-slate-500">&bull;</span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <FaClock className="text-slate-500" />
                {hours} hrs &bull; {lectures} lectures
              </span>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-lg font-black text-white">
                {course.price ? `$${course.price}` : "Free"}
              </span>
              <button
                onClick={handleEnroll}
                disabled={isEnrolling || isEnrolled}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  isEnrolled
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                    : isInstructor
                    ? "bg-indigo-500/15 text-indigo-400 border border-indigo-500/30"
                    : "bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30"
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
      className="group bg-[#0f1524] border border-slate-800 hover:border-blue-500/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 flex flex-col no-underline"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-slate-800">
        <img
          src={thumbnail}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-blue-600/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
            <FaPlay className="text-xs ml-0.5" />
          </div>
        </div>

        {isRecommended ? (
          <div className="absolute top-2.5 left-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 px-2 py-0.5 rounded text-[10px] font-black uppercase shadow-md flex items-center gap-1">
            <FaBrain />
            <span>AI Pick</span>
          </div>
        ) : (
          <div className="absolute top-2.5 left-2.5 bg-amber-400 text-slate-950 px-2 py-0.5 rounded text-[10px] font-black uppercase shadow-md">
            Bestseller
          </div>
        )}

        <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[10px] font-semibold">
          {course.difficulty || "All Levels"}
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          <div className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">
            {course.category || "General"}
          </div>
          <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
            {course.title}
          </h3>
          <p className="text-xs text-slate-400 truncate">
            {instructorName}
          </p>

          <div className="flex items-center gap-1.5 pt-0.5">
            <span className="text-sm font-black text-amber-400">
              {rating.toFixed(1)}
            </span>
            <div className="flex text-amber-400 text-xs">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} />
              ))}
            </div>
            <span className="text-xs text-slate-400">
              ({reviewsCount})
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
            <span className="flex items-center gap-1">
              <FaClock className="text-slate-500" />
              {hours} hrs
            </span>
            <span>&bull;</span>
            <span>{lectures} lectures</span>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-black text-white">
              {course.price ? `$${course.price}` : "Free"}
            </span>
            {course.price > 0 && (
              <span className="text-xs text-slate-500 line-through">
                ${(course.price * 3).toFixed(2)}
              </span>
            )}
          </div>

          <button
            onClick={handleEnroll}
            disabled={isEnrolling || isEnrolled}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
              isEnrolled
                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                : isInstructor
                ? "bg-indigo-500/15 text-indigo-400 border border-indigo-500/30"
                : "bg-blue-600 hover:bg-blue-500 text-white"
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
    if (!coursesData || !Array.isArray(coursesData)) return [];

    let result = [...coursesData];

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
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 font-sans antialiased pb-20">
      {/* ─── HEADER BANNER (Udemy / Coursera Catalog Header) ─────────── */}
      <div className="bg-gradient-to-b from-slate-900 to-[#0b0f19] border-b border-slate-800 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-blue-400">
                {selectedCategory ? `${selectedCategory} Courses` : "Explore All Courses"}
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-1">
                {selectedCategory || "Skill-Building Online Courses"}
              </h1>
              <p className="text-slate-400 text-sm mt-1 max-w-2xl">
                Explore comprehensive curriculum with industry veterans. Gain practical experience and shareable certifications.
              </p>
            </div>

            {/* AI Recommendation Banner Pill */}
            <Link
              to="/assessment"
              className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-purple-500/30 text-purple-300 text-xs font-bold hover:border-purple-500/60 transition shadow-lg self-start md:self-auto"
            >
              <FaBrain className="text-sm text-purple-400" />
              <span>Take AI Career Assessment to get personalized picks &rarr;</span>
            </Link>
          </div>

          {/* Toast Alert Message */}
          {enrollmentMessage && (
            <div className="p-3 rounded-xl bg-blue-600/20 border border-blue-500 text-blue-200 text-sm font-semibold flex items-center gap-2 animate-fadeIn">
              <FaCheckCircle />
              <span>{enrollmentMessage}</span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Top Controls Bar: Search summary, sort, view mode */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs font-bold text-slate-200"
            >
              <FaSlidersH />
              <span>Filters</span>
            </button>
            <span className="text-sm font-bold text-slate-300">
              Showing <span className="text-white">{filteredCourses.length}</span> courses
              {searchQuery && <span> for &ldquo;{searchQuery}&rdquo;</span>}
            </span>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-semibold hidden sm:inline">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-slate-200 text-xs font-bold rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500"
              >
                <option value="popular">Most Popular</option>
                <option value="highest-rated">Highest Rated</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            {/* Grid / List View Toggle */}
            <div className="flex items-center bg-slate-900 border border-slate-700 rounded-xl p-0.5">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg text-xs transition ${
                  viewMode === "grid" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                }`}
                aria-label="Grid View"
              >
                <FaThLarge />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-lg text-xs transition ${
                  viewMode === "list" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
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
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
                <FaFilter className="text-blue-400 text-xs" />
                <span>Filters</span>
              </span>
              {(selectedCategory || selectedDifficulty || selectedRating || priceFilter !== "all" || searchQuery) && (
                <button
                  onClick={clearFilters}
                  className="text-xs font-bold text-blue-400 hover:text-blue-300"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-300">Category</h4>
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(selectedCategory === cat ? "" : cat)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-left transition ${
                      selectedCategory === cat
                        ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 font-bold"
                        : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                    }`}
                  >
                    <span>{cat}</span>
                    {selectedCategory === cat && <FaCheckCircle className="text-xs text-blue-400" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Ratings Filter */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-300">Ratings</h4>
              <div className="space-y-1.5">
                {RATINGS_FILTER.map((rf) => (
                  <button
                    key={rf.label}
                    onClick={() => setSelectedRating(selectedRating === rf.min ? null : rf.min)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                      selectedRating === rf.min
                        ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 font-bold"
                        : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-amber-400">
                      <div className="flex text-xs">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} />
                        ))}
                      </div>
                      <span className="text-slate-300">{rf.label}</span>
                    </div>
                    {selectedRating === rf.min && <FaCheckCircle className="text-xs text-blue-400" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Level Filter */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-300">Level</h4>
              <div className="space-y-1.5">
                {LEVELS.map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setSelectedDifficulty(selectedDifficulty === lvl ? "" : lvl)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                      selectedDifficulty === lvl
                        ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 font-bold"
                        : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                    }`}
                  >
                    <span>{lvl}</span>
                    {selectedDifficulty === lvl && <FaCheckCircle className="text-xs text-blue-400" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-300">Price</h4>
              <div className="grid grid-cols-3 gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                {["all", "free", "paid"].map((p) => (
                  <button
                    key={p}
                    onClick={() => setPriceFilter(p)}
                    className={`py-1.5 text-xs font-bold uppercase rounded-lg transition ${
                      priceFilter === p
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-slate-400 hover:text-white"
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
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto" />
                <p className="text-slate-400 text-sm">Loading course library...</p>
              </div>
            ) : isError ? (
              <AlertMessage
                type="error"
                message={error?.response?.data?.message || "Failed to load courses"}
              />
            ) : filteredCourses.length === 0 ? (
              <div className="bg-[#0f1524] border border-slate-800 rounded-3xl p-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto text-2xl">
                  <FaSearch />
                </div>
                <h3 className="text-xl font-bold text-white">No matching courses found</h3>
                <p className="text-slate-400 text-sm max-w-md mx-auto">
                  Try adjusting your search terms or clearing some filters to explore our full curriculum.
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition"
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
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-xs bg-[#0f1524] h-full p-6 shadow-2xl overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <span className="text-base font-bold text-white">Filter Courses</span>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <FaTimes size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase text-slate-400">Category</h4>
              <div className="space-y-1">
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setSelectedCategory(selectedCategory === c ? "" : c);
                      setMobileFilterOpen(false);
                    }}
                    className="w-full text-left p-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800"
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-800">
              <h4 className="text-xs font-bold uppercase text-slate-400">Level</h4>
              <div className="space-y-1">
                {LEVELS.map((l) => (
                  <button
                    key={l}
                    onClick={() => {
                      setSelectedDifficulty(selectedDifficulty === l ? "" : l);
                      setMobileFilterOpen(false);
                    }}
                    className="w-full text-left p-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800"
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <button
                onClick={() => {
                  clearFilters();
                  setMobileFilterOpen(false);
                }}
                className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
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
