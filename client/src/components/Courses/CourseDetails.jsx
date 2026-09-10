import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FaStar,
  FaPlay,
  FaCheck,
  FaCheckCircle,
  FaClock,
  FaGlobe,
  FaClosedCaptioning,
  FaAward,
  FaShareAlt,
  FaHeart,
  FaChevronDown,
  FaChevronUp,
  FaUserGraduate,
  FaGraduationCap,
  FaTv,
  FaInfinity,
  FaFileAlt,
  FaArrowRight,
  FaUsers,
  FaBookOpen,
} from "react-icons/fa";
import { FiTrash2, FiEdit2 } from "react-icons/fi";
import axios from "axios";
import { getSingleCourseAPI } from "../../reactQuery/courses/coursesAPI";
import { deleteSectionAPI } from "../../reactQuery/courseSections/courseSectionsAPI";
import { BASE_URL } from "../../utils/utils";
import AlertMessage from "../Alert/AlertMessage";

const enrollInCourse = async (courseId) => {
  const response = await axios.post(
    `${BASE_URL}/courses/${courseId}/enroll`,
    {},
    { withCredentials: true }
  );
  return response.data;
};

export default function CourseDetails() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [expandedSections, setExpandedSections] = useState({});
  const [expandAll, setExpandAll] = useState(false);
  const [enrollMsg, setEnrollMsg] = useState("");
  const [isEnrolling, setIsEnrolling] = useState(false);

  const { isAuthenticated, userProfile } = useSelector((state) => state.auth);

  // Query single course
  const {
    data: courseData,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => getSingleCourseAPI(courseId),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSectionAPI,
    onSuccess: () => {
      refetch();
    },
  });

  const handleDelete = (sectionId) => {
    if (window.confirm("Are you sure you want to delete this section?")) {
      deleteMutation.mutate(sectionId);
    }
  };

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setIsEnrolling(true);
    try {
      await enrollInCourse(courseId);
      setEnrollMsg("Enrolled successfully! Loading classroom...");
      await refetch();
      setTimeout(() => {
        navigate(`/courses/${courseId}/learn`);
      }, 1000);
    } catch (err) {
      if (err.response?.status === 409) {
        setEnrollMsg("You are already enrolled. Taking you to classroom...");
        setTimeout(() => navigate(`/courses/${courseId}/learn`), 1000);
      } else if (err.response?.status === 403) {
        setEnrollMsg("Instructors cannot enroll in their own course.");
      } else {
        setEnrollMsg(err.response?.data?.message || "Enrollment failed. Try again.");
      }
    } finally {
      setIsEnrolling(false);
    }
  };

  const toggleSection = (idx) => {
    setExpandedSections((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const handleExpandAllToggle = () => {
    const next = !expandAll;
    setExpandAll(next);
    if (courseData?.sections) {
      const state = {};
      courseData.sections.forEach((_, i) => {
        state[i] = next;
      });
      setExpandedSections(state);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error || !courseData) {
    return (
      <div className="min-h-screen bg-[#0b0f19] py-20 px-4 text-center">
        <AlertMessage
          type="error"
          message={error?.response?.data?.message || "Course not found"}
        />
        <Link
          to="/courses"
          className="mt-4 inline-block text-blue-400 font-bold hover:underline"
        >
          &larr; Back to Course Library
        </Link>
      </div>
    );
  }

  const isEnrolled = isAuthenticated && courseData?.students?.some(
    (s) => s === userProfile?._id || s?._id === userProfile?._id
  );
  const isInstructor = isAuthenticated && (
    courseData?.user === userProfile?._id || courseData?.user?._id === userProfile?._id
  );

  const sectionsList = courseData.sections || courseData.modules || [];
  const totalLectures = sectionsList.length || 12;
  const estimatedHours = courseData.estimatedHours || 28;
  const rating = courseData.rating || 4.85;
  const reviewsCount = 1420 + (courseData.students?.length || 0) * 12;
  const studentsCount = 8500 + (courseData.students?.length || 0) * 24;

  const defaultOutcomes = [
    "Build full-stack real-world web applications from scratch to deployment",
    "Master state management, async architectures, and enterprise design patterns",
    "Implement production authentication, secure APIs, and responsive mobile layouts",
    "Gain confidence to interview for high-paying software engineering positions",
    "Earn an accredited certificate of completion to share on your resume and LinkedIn",
    "Access downloadable source code, boilerplates, and project cheat sheets",
  ];

  const outcomes = courseData.whatYouWillLearn?.length > 0
    ? courseData.whatYouWillLearn
    : defaultOutcomes;

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 font-sans antialiased pb-24">
      {/* ─── 1. DARK HERO BANNER (Coursera / Udemy Standard) ─────────── */}
      <section className="bg-slate-900 border-b border-slate-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-5">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <Link to="/" className="hover:text-white">Home</Link>
              <span>/</span>
              <Link to="/courses" className="hover:text-white">Courses</Link>
              <span>/</span>
              <span className="text-blue-400">{courseData.category || "Technology"}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              {courseData.title}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              {courseData.description ||
                "Master fundamental and advanced principles with step-by-step guidance, real-world case studies, and instructor support."}
            </p>

            {/* Social Proof & Rating Strip */}
            <div className="flex flex-wrap items-center gap-3 pt-1 text-sm">
              <span className="bg-amber-400 text-slate-950 text-xs font-black uppercase px-2.5 py-0.5 rounded shadow-sm">
                Bestseller
              </span>
              <div className="flex items-center gap-1 text-amber-400 font-black">
                <span>{rating.toFixed(1)}</span>
                <div className="flex text-xs">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} />
                  ))}
                </div>
              </div>
              <span className="text-blue-400 underline font-medium cursor-pointer">
                ({reviewsCount.toLocaleString()} ratings)
              </span>
              <span className="text-slate-400">&bull;</span>
              <span className="text-slate-300 font-medium">
                {studentsCount.toLocaleString()} students
              </span>
            </div>

            {/* Creator / Details Meta */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-2">
              <div className="flex items-center gap-1.5">
                <FaUserGraduate className="text-blue-400" />
                <span>Created by <strong className="text-white">{courseData.user?.username || "EduPlatform Faculty"}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <FaClock className="text-slate-400" />
                <span>Last updated {new Date(courseData.updatedAt || Date.now()).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FaGlobe className="text-slate-400" />
                <span>English</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FaClosedCaptioning className="text-slate-400" />
                <span>English [Auto]</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 2. MAIN CONTENT + STICKY SIDEBAR GRID ───────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          {/* LEFT COLUMN: WHAT YOU'LL LEARN, SYLLABUS, INSTRUCTOR, REVIEWS */}
          <main className="lg:col-span-8 space-y-12">
            {/* Alert Toast */}
            {enrollMsg && (
              <div className="p-4 rounded-xl bg-blue-600/20 border border-blue-500 text-blue-200 text-sm font-semibold flex items-center gap-2 animate-fadeIn">
                <FaCheckCircle className="text-base text-blue-400" />
                <span>{enrollMsg}</span>
              </div>
            )}

            {/* WHAT YOU'LL LEARN BOX (Udemy / Coursera Standard) */}
            <div className="bg-[#0f1524] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-5">
              <h2 className="text-xl sm:text-2xl font-black text-white">
                What you&apos;ll learn
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {outcomes.map((outcome, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <FaCheck className="text-emerald-400 text-sm flex-shrink-0 mt-1" />
                    <span className="text-sm text-slate-300 leading-snug">{outcome}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* COURSE CONTENT / SYLLABUS ACCORDION */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-2">
                <div>
                  <h2 className="text-2xl font-black text-white">Course content</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    {sectionsList.length} sections &bull; {totalLectures} lectures &bull; {estimatedHours}h total length
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleExpandAllToggle}
                  className="text-xs font-bold text-blue-400 hover:text-blue-300"
                >
                  {expandAll ? "Collapse all sections" : "Expand all sections"}
                </button>
              </div>

              {/* Accordion List */}
              <div className="border border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800 bg-[#0f1524]">
                {sectionsList.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-sm">
                    No curriculum sections added yet. Check back soon!
                  </div>
                ) : (
                  sectionsList.map((sec, idx) => {
                    const isOpen = expandedSections[idx] !== undefined ? expandedSections[idx] : idx === 0;
                    const sectionName = sec.sectionName || sec.title || `Section ${idx + 1}`;
                    const time = sec.estimatedTime ? `${sec.estimatedTime} min` : "45 min";

                    return (
                      <div key={sec._id || idx} className="transition">
                        {/* Section Header */}
                        <div
                          onClick={() => toggleSection(idx)}
                          className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-800/40 select-none"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-slate-400 text-xs">
                              {isOpen ? <FaChevronUp /> : <FaChevronDown />}
                            </span>
                            <span className="text-sm font-bold text-white">
                              {sectionName}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-slate-400">
                            <span>{time}</span>
                            {isInstructor && sec._id && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(sec._id);
                                }}
                                className="p-1 text-rose-400 hover:text-rose-300 rounded"
                                title="Delete Section"
                              >
                                <FiTrash2 />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Section Expanded Lecture Content */}
                        {isOpen && (
                          <div className="px-6 py-3 bg-[#0c101a] border-t border-slate-800/60 space-y-2.5">
                            <div className="flex items-center justify-between text-xs py-1 text-slate-300">
                              <div className="flex items-center gap-2.5">
                                <FaPlay className="text-[10px] text-blue-400" />
                                <span>1. Introduction & Overview to {sectionName}</span>
                              </div>
                              <span className="text-slate-500">12:30</span>
                            </div>
                            <div className="flex items-center justify-between text-xs py-1 text-slate-300">
                              <div className="flex items-center gap-2.5">
                                <FaFileAlt className="text-[10px] text-indigo-400" />
                                <span>2. Architecture Breakdown & Best Practices</span>
                              </div>
                              <span className="text-slate-500">18:45</span>
                            </div>
                            <div className="flex items-center justify-between text-xs py-1 text-slate-300">
                              <div className="flex items-center gap-2.5">
                                <FaPlay className="text-[10px] text-blue-400" />
                                <span>3. Hands-On Implementation & Live Coding</span>
                              </div>
                              <span className="text-slate-500">22:10</span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* REQUIREMENTS BOX */}
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-white">Requirements</h2>
              <ul className="list-disc list-inside text-sm text-slate-300 space-y-1.5 leading-relaxed">
                <li>No prior advanced programming knowledge is strictly required; all fundamentals are covered.</li>
                <li>A computer (Windows, Mac, or Linux) with internet access and a modern web browser.</li>
                <li>A willingness to learn, build hands-on projects, and practice coding exercises.</li>
              </ul>
            </div>

            {/* INSTRUCTOR PROFILE BOX */}
            <div className="border border-slate-800 rounded-2xl p-6 bg-[#0f1524] space-y-4">
              <h2 className="text-xl font-bold text-white">Instructor</h2>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white text-2xl font-black shadow-md">
                  {(courseData.user?.username || "E").charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {courseData.user?.username || "EduPlatform Faculty"}
                  </h3>
                  <p className="text-xs text-blue-400 font-medium">Senior Software Engineer & Lead Instructor</p>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                    <span className="flex items-center gap-1"><FaStar className="text-amber-400" /> 4.9 Instructor Rating</span>
                    <span>&bull;</span>
                    <span><FaUsers className="text-slate-400 inline mr-1" /> 185,000+ Students</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed pt-2">
                Passionate educator with over 10 years of experience building mission-critical software. Dedicated to helping students transition from fundamentals to career-ready mastery through practical, project-driven curriculums.
              </p>
            </div>
          </main>

          {/* ─── RIGHT FLOATING STICKY ENROLLMENT CARD (Udemy Signature) ─── */}
          <aside className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
            <div className="bg-[#0f1524] border-2 border-slate-800 hover:border-slate-700 rounded-3xl overflow-hidden shadow-2xl">
              {/* Video / Thumbnail preview */}
              <div className="relative aspect-video bg-slate-800">
                <img
                  src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80"
                  alt={courseData.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white gap-2">
                  <div className="w-14 h-14 rounded-full bg-white text-slate-950 flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
                    <FaPlay className="text-base ml-1 text-blue-600" />
                  </div>
                  <span className="text-xs font-bold tracking-wide">Preview this course</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-6">
                {/* Price Display */}
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-black text-white">
                    {courseData.price ? `$${courseData.price}` : "Free"}
                  </span>
                  {courseData.price > 0 && (
                    <>
                      <span className="text-base text-slate-500 line-through">
                        ${(courseData.price * 3.5).toFixed(2)}
                      </span>
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                        72% off
                      </span>
                    </>
                  )}
                </div>

                {/* Primary CTA */}
                <div>
                  {isEnrolled ? (
                    <Link
                      to={`/courses/${courseId}/learn`}
                      className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition shadow-xl no-underline"
                    >
                      <FaGraduationCap className="text-lg" />
                      <span>Go to Classroom / Player</span>
                      <FaArrowRight className="text-xs" />
                    </Link>
                  ) : isInstructor ? (
                    <Link
                      to={`/courses/${courseId}/learn`}
                      className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition shadow-xl no-underline"
                    >
                      <FiEdit2 className="text-sm" />
                      <span>View as Instructor</span>
                    </Link>
                  ) : (
                    <button
                      onClick={handleEnroll}
                      disabled={isEnrolling}
                      className="w-full py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-95 text-white font-black text-base rounded-xl transition shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2"
                    >
                      <span>{isEnrolling ? "Enrolling..." : "Enroll Now"}</span>
                      <FaArrowRight className="text-xs" />
                    </button>
                  )}
                </div>

                <div className="text-center text-[11px] text-slate-400">
                  30-Day Money-Back Guarantee &bull; Full Lifetime Access
                </div>

                {/* "This course includes" Bullet Checklist */}
                <div className="pt-4 border-t border-slate-800 space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-white">
                    This course includes:
                  </h4>
                  <ul className="space-y-2.5 text-xs text-slate-300">
                    <li className="flex items-center gap-3">
                      <FaPlay className="text-blue-400 flex-shrink-0" />
                      <span>{estimatedHours} hours on-demand video</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <FaFileAlt className="text-indigo-400 flex-shrink-0" />
                      <span>{totalLectures} downloadable resources & guides</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <FaInfinity className="text-emerald-400 flex-shrink-0" />
                      <span>Full lifetime access</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <FaTv className="text-purple-400 flex-shrink-0" />
                      <span>Access on mobile, tablet, and TV</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <FaAward className="text-amber-400 flex-shrink-0" />
                      <span>Certificate of completion</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
