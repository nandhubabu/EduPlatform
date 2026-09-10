import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  FaSearch,
  FaStar,
  FaUsers,
  FaTrophy,
  FaLaptopCode,
  FaBrain,
  FaChartLine,
  FaCheckCircle,
  FaGraduationCap,
  FaPlay,
  FaAward,
  FaClock,
  FaArrowRight,
  FaGlobe,
  FaShieldAlt,
  FaCertificate,
  FaChalkboardTeacher,
} from "react-icons/fa";
import { getAllCoursesAPI } from "../../reactQuery/courses/coursesAPI";

/* ─── TRUSTED PARTNER LOGOS (Coursera Style) ────────────────────────── */
const PARTNERS = [
  { name: "Google", domain: "google.com" },
  { name: "Meta", domain: "meta.com" },
  { name: "Amazon AWS", domain: "aws.amazon.com" },
  { name: "Stanford", domain: "stanford.edu" },
  { name: "IBM", domain: "ibm.com" },
  { name: "Microsoft", domain: "microsoft.com" },
];

/* ─── POPULAR TOPIC PILLS (Udemy Style) ─────────────────────────────── */
const TOPIC_PILLS = [
  "All Courses",
  "Python",
  "React & Next.js",
  "Data Science",
  "Machine Learning",
  "Cloud & DevOps",
  "Cybersecurity",
  "UI/UX Design",
];

/* ─── CURATED COURSERA & UDEMY HIGHLIGHTS ───────────────────────────── */
const CURATED_COURSES = [
  {
    _id: "curated-1",
    title: "Full-Stack Web Development Bootcamp 2026: React, Node & Next.js",
    instructor: "Dr. Angela Yu & Brad Traversy",
    rating: 4.9,
    reviewsCount: "24,810",
    studentsCount: "142,500",
    hours: 48,
    lectures: 340,
    level: "All Levels",
    badge: "Bestseller",
    badgeColor: "amber",
    price: 19.99,
    originalPrice: 94.99,
    category: "Web Development",
    thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "curated-2",
    title: "Deep Learning & Generative AI Specialization with PyTorch & Gemini",
    instructor: "Andrew Ng & DeepLearning.AI",
    rating: 4.95,
    reviewsCount: "18,400",
    studentsCount: "98,200",
    hours: 36,
    lectures: 190,
    level: "Intermediate",
    badge: "Highest Rated",
    badgeColor: "purple",
    price: 24.99,
    originalPrice: 109.99,
    category: "AI",
    thumbnail: "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "curated-3",
    title: "AWS Certified Solutions Architect & Cloud Engineering Masterclass",
    instructor: "Stephane Maarek",
    rating: 4.85,
    reviewsCount: "31,200",
    studentsCount: "175,000",
    hours: 29,
    lectures: 215,
    level: "All Levels",
    badge: "Hot & New",
    badgeColor: "blue",
    price: 16.99,
    originalPrice: 84.99,
    category: "Cloud",
    thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "curated-4",
    title: "Complete Python for Data Science, Analytics & Machine Learning",
    instructor: "Jose Portilla",
    rating: 4.88,
    reviewsCount: "42,100",
    studentsCount: "210,000",
    hours: 42,
    lectures: 280,
    level: "Beginner",
    badge: "Bestseller",
    badgeColor: "amber",
    price: 18.99,
    originalPrice: 89.99,
    category: "Data Science",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
  },
];

/* ─── TESTIMONIALS (Coursera Learner Outcomes) ───────────────────────── */
const OUTCOMES = [
  {
    name: "Priya Sharma",
    role: "Full Stack Engineer at Google",
    prevRole: "Former Customer Support Specialist",
    text: "EduPlatform completely transformed my trajectory. The structured hands-on projects gave me the confidence to ace technical interviews.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    increase: "+130% Salary Jump",
  },
  {
    name: "Marcus Vance",
    role: "Cloud Architect at Amazon AWS",
    prevRole: "IT Support Technician",
    text: "The AWS and DevOps curriculum is 1-to-1 with actual enterprise architectures. It was more valuable than my 4-year degree.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    increase: "Career Switched in 6 mos",
  },
  {
    name: "Elena Rostova",
    role: "Machine Learning Researcher",
    prevRole: "Junior Analyst",
    text: "The Gemini AI Career Explorer pinpointed exactly which math and coding modules I needed. It saved me hundreds of wasted hours.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    increase: "Published 2 Models",
  },
];

export default function HomePage() {
  const [heroSearch, setHeroSearch] = useState("");
  const [activeTopic, setActiveTopic] = useState("All Courses");
  const navigate = useNavigate();

  // Fetch actual courses from backend
  const { data: dbCourses } = useQuery({
    queryKey: ["courses"],
    queryFn: getAllCoursesAPI,
    staleTime: 60 * 1000,
  });

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/courses?search=${encodeURIComponent(heroSearch.trim())}`);
    } else {
      navigate("/courses");
    }
  };

  const handleTopicClick = (topic) => {
    setActiveTopic(topic);
    if (topic === "All Courses") {
      navigate("/courses");
    } else {
      navigate(`/courses?search=${encodeURIComponent(topic)}`);
    }
  };

  // Combine db courses with curated highlights for rich presentation
  const displayedCourses = dbCourses && dbCourses.length > 0
    ? dbCourses.slice(0, 4).map((c, idx) => ({
        _id: c._id,
        title: c.title,
        instructor: c.user?.username || "EduPlatform Instructor",
        rating: c.rating || 4.8,
        reviewsCount: `${(idx + 1) * 380 + 120}`,
        studentsCount: `${(idx + 1) * 1250 + 500}`,
        hours: c.estimatedHours || 24,
        lectures: c.sections?.length || 18,
        level: c.difficulty || "All Levels",
        badge: idx === 0 ? "Bestseller" : idx === 1 ? "Highest Rated" : "Top Pick",
        badgeColor: idx === 0 ? "amber" : idx === 1 ? "purple" : "blue",
        price: c.price || 0,
        originalPrice: c.price ? (c.price * 3.5).toFixed(2) : 49.99,
        category: c.category || "Technology",
        thumbnail: CURATED_COURSES[idx % CURATED_COURSES.length].thumbnail,
      }))
    : CURATED_COURSES;

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 font-sans antialiased overflow-x-hidden">
      {/* ─── 1. HERO SECTION (Coursera / Udemy High-Impact Billboard) ─── */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
        {/* Subtle background ambient glows */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[130px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Heading & Value Prop */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 text-blue-300 text-xs font-bold tracking-wide uppercase">
                <FaBrain className="text-blue-400" />
                <span>AI-Powered Personalized Learning Pathways</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
                Learn Without Limits. <br className="hidden sm:block" />
                Master <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">In-Demand Skills.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Build job-ready expertise with top industry courses, hands-on portfolio projects, and Gemini AI career guidance trusted by learners worldwide.
              </p>

              {/* Integrated Hero Search (Udemy Standard) */}
              <form
                onSubmit={handleHeroSearch}
                className="max-w-xl mx-auto lg:mx-0 relative flex items-center bg-slate-900/90 border-2 border-slate-700/80 hover:border-blue-500/80 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/20 rounded-2xl p-1.5 shadow-2xl transition-all"
              >
                <div className="pl-4 pr-2 text-slate-400">
                  <FaSearch className="text-lg" />
                </div>
                <input
                  type="text"
                  value={heroSearch}
                  onChange={(e) => setHeroSearch(e.target.value)}
                  placeholder="What skill or career do you want to master?"
                  className="w-full bg-transparent text-white placeholder-slate-400 text-sm sm:text-base focus:outline-none py-2 px-1"
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm px-6 py-3 rounded-xl transition shadow-[0_0_15px_rgba(37,99,235,0.4)] whitespace-nowrap"
                >
                  Search
                </button>
              </form>

              {/* Quick Topic Badges */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1 text-xs text-slate-400">
                <span className="font-semibold text-slate-400">Popular:</span>
                {["Python", "React", "AI & ML", "AWS Cloud", "Career Assessment"].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      if (tag === "Career Assessment") navigate("/assessment");
                      else navigate(`/courses?search=${encodeURIComponent(tag)}`);
                    }}
                    className="px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column: Hero Visual Card (Udemy / Coursera Billboard) */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Card */}
                <div className="bg-gradient-to-br from-slate-900/90 to-[#111624]/90 border border-slate-700/70 rounded-3xl p-6 shadow-2xl backdrop-blur-xl space-y-6">
                  <div className="relative rounded-2xl overflow-hidden aspect-video border border-slate-700">
                    <img
                      src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80"
                      alt="Students learning together"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4">
                      <div>
                        <span className="bg-blue-500 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded">
                          Featured Specialization
                        </span>
                        <h4 className="text-white font-bold text-sm sm:text-base mt-1">
                          Full-Stack & Cloud Architecture Masterclass
                        </h4>
                      </div>
                    </div>
                  </div>

                  {/* Stat Highlights */}
                  <div className="grid grid-cols-3 gap-3 text-center border-t border-slate-800 pt-4">
                    <div>
                      <div className="text-xl font-black text-white">4.9/5</div>
                      <div className="text-[11px] text-slate-400">Rating (12k+)</div>
                    </div>
                    <div className="border-x border-slate-800">
                      <div className="text-xl font-black text-emerald-400">96%</div>
                      <div className="text-[11px] text-slate-400">Job Placement</div>
                    </div>
                    <div>
                      <div className="text-xl font-black text-purple-400">200+</div>
                      <div className="text-[11px] text-slate-400">Active Courses</div>
                    </div>
                  </div>

                  {/* Action Link */}
                  <Link
                    to="/courses"
                    className="w-full py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-95 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition shadow-lg"
                  >
                    <span>Explore All Courses</span>
                    <FaArrowRight className="text-xs" />
                  </Link>
                </div>

                {/* Floating Badge 1 */}
                <div className="absolute -top-4 -left-4 bg-[#141b2d] border border-blue-500/40 rounded-2xl p-3 shadow-xl flex items-center gap-3 animate-bounce-subtle hidden sm:flex">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                    <FaAward className="text-lg" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Certified Skills</div>
                    <div className="text-[10px] text-slate-400">Sharable on LinkedIn</div>
                  </div>
                </div>

                {/* Floating Badge 2 */}
                <div className="absolute -bottom-5 -right-4 bg-[#141b2d] border border-emerald-500/40 rounded-2xl p-3 shadow-xl flex items-center gap-3 hidden sm:flex">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <FaUsers className="text-lg" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">45,000+</div>
                    <div className="text-[10px] text-slate-400">Active Learners</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 2. PARTNERS & TRUST STRIP (Coursera Standard) ──────────────── */}
      <section className="border-y border-slate-800/80 bg-slate-900/40 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-slate-400 mb-6">
            Trusted by learners and engineering teams at world-class companies
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-75">
            {PARTNERS.map((partner) => (
              <div
                key={partner.name}
                className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition font-bold text-lg sm:text-xl tracking-tight"
              >
                <FaGlobe className="text-blue-500/60 text-base" />
                <span>{partner.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 3. SELECTION OF COURSES (Udemy Tabs & Cards Rail) ─────────── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            A broad selection of courses
          </h2>
          <p className="text-slate-400 text-base mt-2">
            Choose from hundreds of online video courses with new additions published every month.
          </p>
        </div>

        {/* Topic Pill Filters (Udemy Standard) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800">
          {TOPIC_PILLS.map((topic) => (
            <button
              key={topic}
              onClick={() => handleTopicClick(topic)}
              className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition ${
                activeTopic === topic
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              {topic}
            </button>
          ))}
        </div>

        {/* Course Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayedCourses.map((course) => (
            <Link
              key={course._id}
              to={`/courses/${course._id}`}
              className="group bg-slate-900/80 border border-slate-800 hover:border-blue-500/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-blue-500/10 transition duration-300 flex flex-col no-underline"
            >
              {/* Thumbnail Container with 16:9 ratio */}
              <div className="relative aspect-video w-full overflow-hidden bg-slate-800">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <div className="w-11 h-11 rounded-full bg-blue-600/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                    <FaPlay className="text-xs ml-0.5" />
                  </div>
                </div>

                {/* Badge (Bestseller, Highest Rated) */}
                {course.badge && (
                  <div className="absolute top-2.5 left-2.5">
                    <span
                      className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow-md ${
                        course.badgeColor === "amber"
                          ? "bg-amber-400 text-slate-950"
                          : course.badgeColor === "purple"
                          ? "bg-purple-600 text-white"
                          : "bg-blue-600 text-white"
                      }`}
                    >
                      {course.badge}
                    </span>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-400 truncate">
                    {course.instructor}
                  </p>

                  {/* Rating row (Udemy Star display) */}
                  <div className="flex items-center gap-1.5 pt-0.5">
                    <span className="text-sm font-black text-amber-400">
                      {course.rating.toFixed(1)}
                    </span>
                    <div className="flex text-amber-400 text-xs">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} />
                      ))}
                    </div>
                    <span className="text-xs text-slate-400">
                      ({course.reviewsCount})
                    </span>
                  </div>

                  {/* Metadata pills */}
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <FaClock className="text-slate-500" />
                      {course.hours} hrs
                    </span>
                    <span>&bull;</span>
                    <span>{course.lectures} lectures</span>
                    <span>&bull;</span>
                    <span className="text-blue-400 font-medium">{course.level}</span>
                  </div>
                </div>

                {/* Price & Action */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-black text-white">
                      {course.price === 0 ? "Free" : `$${course.price}`}
                    </span>
                    {course.originalPrice && (
                      <span className="text-xs text-slate-400 line-through">
                        ${course.originalPrice}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-bold text-blue-400 group-hover:text-blue-300 flex items-center gap-1">
                    <span>View</span>
                    <FaArrowRight className="text-[10px]" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View Catalog Button */}
        <div className="text-center pt-4">
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 transition"
          >
            <span>Browse Full Course Library (200+ Courses)</span>
            <FaArrowRight />
          </Link>
        </div>
      </section>

      {/* ─── 4. COURSERA VALUE PROP ("Why Learn on EduPlatform") ─────────── */}
      <section className="py-20 bg-slate-900/50 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
              The EduPlatform Advantage
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Invest in your career with world-class learning
            </h2>
            <p className="text-slate-400 text-base">
              Designed according to instructional science for maximum skill retention, practical experience, and career advancement.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <FaLaptopCode />,
                title: "Hands-On Projects",
                desc: "Build portfolio-ready applications in React, Node, Python, and AWS with line-by-line guidance.",
                color: "text-blue-400",
                bg: "bg-blue-500/10",
              },
              {
                icon: <FaBrain />,
                title: "Gemini AI Career Navigator",
                desc: "Personalized aptitude assessment accurately maps your strengths to high-paying tech roles.",
                color: "text-purple-400",
                bg: "bg-purple-500/10",
              },
              {
                icon: <FaCertificate />,
                title: "Verified Credentials",
                desc: "Earn verified completion certificates recognized by hiring managers and tech recruiters.",
                color: "text-emerald-400",
                bg: "bg-emerald-500/10",
              },
              {
                icon: <FaShieldAlt />,
                title: "Flexible Lifetime Access",
                desc: "Learn at your own pace on mobile, tablet, or desktop with 24/7 access to curriculum updates.",
                color: "text-amber-400",
                bg: "bg-amber-500/10",
              },
            ].map((card, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#0f1524] border border-slate-800 hover:border-slate-700 transition space-y-4"
              >
                <div className={`w-12 h-12 rounded-xl ${card.bg} ${card.color} flex items-center justify-center text-2xl`}>
                  {card.icon}
                </div>
                <h3 className="text-lg font-bold text-white">{card.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 5. LEARNER OUTCOMES & REVIEWS (Coursera Style) ─────────────── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Real Stories &bull; Real Results
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-1">
              How learning on EduPlatform changes lives
            </h2>
          </div>
          <Link
            to="/assessment"
            className="text-sm font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1.5"
          >
            Take the AI Career Assessment &rarr;
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {OUTCOMES.map((story, i) => (
            <div
              key={i}
              className="bg-[#0f1524] border border-slate-800 p-6 rounded-2xl flex flex-col justify-between space-y-5"
            >
              <div className="space-y-4">
                <div className="flex text-amber-400 text-xs">
                  {[...Array(5)].map((_, s) => (
                    <FaStar key={s} />
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed italic">
                  "{story.text}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center gap-3">
                <img
                  src={story.avatar}
                  alt={story.name}
                  className="w-11 h-11 rounded-full object-cover border border-slate-700"
                />
                <div>
                  <div className="text-sm font-bold text-white">{story.name}</div>
                  <div className="text-xs text-blue-400 font-medium">{story.role}</div>
                  <div className="text-[11px] text-emerald-400 font-semibold">{story.increase}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 6. BECOME AN INSTRUCTOR (Udemy Style CTA) ─────────────────── */}
      <section className="py-16 bg-gradient-to-r from-blue-900/30 via-indigo-900/20 to-purple-900/30 border-y border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-blue-600/20 text-blue-400 mx-auto flex items-center justify-center text-2xl">
            <FaChalkboardTeacher />
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            Become an instructor on EduPlatform
          </h2>
          <p className="text-slate-300 text-base max-w-2xl mx-auto">
            Top instructors teach millions of students on EduPlatform. We provide the platform, course builder, and global audience to help you monetize your expertise.
          </p>
          <div className="pt-2">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-95 text-white font-bold text-sm shadow-xl transition"
            >
              <span>Start Teaching Today</span>
              <FaArrowRight className="text-xs" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── 7. FOOTER (Coursera / Udemy Standard) ──────────────────────── */}
      <footer className="bg-[#080b12] border-t border-slate-800/80 pt-16 pb-12 text-slate-400 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 pb-12 border-b border-slate-800">
            <div className="col-span-2 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white">
                  <FaGraduationCap />
                </div>
                <span className="text-lg font-black text-white">EduPlatform</span>
              </div>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                Empowering learners worldwide through high-impact technical education, project-based curriculum, and AI-driven career guidance.
              </p>
              <div className="text-xs text-slate-400">
                &copy; {new Date().getFullYear()} EduPlatform, Inc. All rights reserved.
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Explore</h4>
              <ul className="space-y-2 text-xs">
                <li><Link to="/courses" className="hover:text-white transition">Course Library</Link></li>
                <li><Link to="/assessment" className="hover:text-white transition">AI Career Explorer</Link></li>
                <li><Link to="/courses?category=AI" className="hover:text-white transition">Artificial Intelligence</Link></li>
                <li><Link to="/courses?category=Web%20Development" className="hover:text-white transition">Web Development</Link></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Community</h4>
              <ul className="space-y-2 text-xs">
                <li><Link to="/register" className="hover:text-white transition">Teach on EduPlatform</Link></li>
                <li><Link to="/login" className="hover:text-white transition">Learner Portal</Link></li>
                <li><Link to="/dashboard" className="hover:text-white transition">My Learning</Link></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Legal & Support</h4>
              <ul className="space-y-2 text-xs">
                <li><a href="#help" className="hover:text-white transition">Help & Support</a></li>
                <li><a href="#terms" className="hover:text-white transition">Terms of Service</a></li>
                <li><a href="#privacy" className="hover:text-white transition">Privacy Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
            <div>
              Designed for optimal accessibility and high-performance learning.
            </div>
            <div className="flex gap-4">
              <span>English (US)</span>
              <span>USD ($)</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
