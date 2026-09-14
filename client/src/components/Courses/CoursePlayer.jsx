import React, { useState, useEffect, useMemo, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import {
  FaPlay,
  FaPause,
  FaBook,
  FaBookOpen,
  FaCheckCircle,
  FaClock,
  FaDownload,
  FaStepForward,
  FaStepBackward,
  FaList,
  FaStickyNote,
  FaGraduationCap,
  FaArrowLeft,
  FaAward,
  FaQuestionCircle,
  FaCode,
  FaChevronDown,
  FaChevronUp,
  FaCheck,
  FaFolderOpen,
  FaTimes,
  FaRobot,
  FaPaperPlane,
  FaLightbulb,
  FaCopy,
  FaTrashAlt,
  FaMagic,
} from "react-icons/fa";
import { getCourseById } from "../../services/courseService";
import AlertMessage from "../Alert/AlertMessage";
import { getRealCourseById } from "../../data/realCourses";
import chatbotService from "../../services/chatbotService";

// YouTube Video Player Component
const YouTubePlayer = ({ videoId, onProgress, onComplete, initialTime = 0 }) => {
  const [player, setPlayer] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(initialTime);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    let checkInterval;
    if (!window.YT) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      document.body.appendChild(script);

      window.onYouTubeIframeAPIReady = initializePlayer;
    } else {
      initializePlayer();
    }

    return () => {
      if (checkInterval) clearInterval(checkInterval);
      if (player && player.destroy) {
        player.destroy();
      }
    };
  }, [videoId]);

  const initializePlayer = () => {
    if (!window.YT || !window.YT.Player) return;
    try {
      const newPlayer = new window.YT.Player("youtube-player", {
        height: "100%",
        width: "100%",
        videoId: videoId || "SqcY0GlETPk",
        playerVars: {
          autoplay: 0,
          controls: 1,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          start: Math.floor(initialTime),
        },
        events: {
          onReady: (event) => {
            setPlayer(event.target);
            setIsReady(true);
            setDuration(event.target.getDuration());
          },
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              setIsPlaying(true);
            } else if (event.data === window.YT.PlayerState.PAUSED) {
              setIsPlaying(false);
            } else if (event.data === window.YT.PlayerState.ENDED) {
              setIsPlaying(false);
              onComplete?.();
            }
          },
        },
      });
    } catch {
      // ignore
    }
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
      <div id="youtube-player" className="w-full h-full" />
    </div>
  );
};

// Helper for parsing **bold** styling
const parseBold = (str) => {
  if (!str) return "";
  const parts = str.split(/(\*\*.*?\*\*)/g);
  return parts.map((seg, i) => {
    if (seg.startsWith("**") && seg.endsWith("**")) {
      return (
        <strong key={i} className="font-bold text-slate-900">
          {seg.slice(2, -2)}
        </strong>
      );
    }
    return seg;
  });
};

// Rich Markdown / Code Message Formatter for AI Copilot
const CopilotMessageBody = ({ content, onCopyCode, copiedCodeId }) => {
  if (!content) return null;

  // Split by ``` code blocks
  const segments = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-3 text-xs sm:text-sm text-slate-800 leading-relaxed font-sans">
      {segments.map((segment, sIdx) => {
        if (segment.startsWith("```") && segment.endsWith("```")) {
          const lines = segment.slice(3, -3).trim().split("\n");
          const lang = lines[0]?.trim() || "";
          const code = (lang ? lines.slice(1) : lines).join("\n");
          const blockId = `code-${sIdx}`;
          const isCopied = copiedCodeId === blockId;

          return (
            <div
              key={sIdx}
              className="my-3 rounded-xl overflow-hidden bg-slate-950 text-slate-100 border border-slate-800 shadow-md"
            >
              <div className="flex items-center justify-between px-3.5 py-2 bg-slate-900 border-b border-slate-800 text-[11px] text-slate-400">
                <span className="font-mono font-semibold uppercase text-indigo-400">
                  {lang || "code"}
                </span>
                <button
                  type="button"
                  onClick={() => onCopyCode(code, blockId)}
                  className="flex items-center gap-1.5 text-slate-400 hover:text-white transition px-2 py-0.5 rounded hover:bg-slate-800 cursor-pointer"
                >
                  <FaCopy className="text-xs" />
                  <span>{isCopied ? "Copied!" : "Copy code"}</span>
                </button>
              </div>
              <pre className="p-4 font-mono text-xs overflow-x-auto text-emerald-300 leading-normal">
                <code>{code}</code>
              </pre>
            </div>
          );
        }

        const lines = segment.split("\n");
        return (
          <div key={sIdx} className="space-y-2">
            {lines.map((line, lIdx) => {
              const trimmed = line.trim();
              if (!trimmed) return null;

              if (trimmed.startsWith("### ")) {
                return (
                  <h4 key={lIdx} className="text-sm font-black text-slate-900 pt-2 pb-0.5">
                    {trimmed.replace("### ", "")}
                  </h4>
                );
              }

              if (trimmed.startsWith("## ")) {
                return (
                  <h3 key={lIdx} className="text-base font-black text-slate-900 pt-2 pb-0.5">
                    {trimmed.replace("## ", "")}
                  </h3>
                );
              }

              if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
                return (
                  <div key={lIdx} className="flex items-start gap-2 pl-2">
                    <span className="text-indigo-600 font-bold mt-0.5">&bull;</span>
                    <span className="text-slate-700">{parseBold(trimmed.slice(2))}</span>
                  </div>
                );
              }

              if (trimmed.startsWith("> ")) {
                return (
                  <div
                    key={lIdx}
                    className="p-3 my-1.5 rounded-xl bg-indigo-50/80 border-l-4 border-indigo-600 text-indigo-950 font-medium text-xs"
                  >
                    {parseBold(trimmed.replace("> ", ""))}
                  </div>
                );
              }

              return (
                <p key={lIdx} className="text-slate-700">
                  {parseBold(trimmed)}
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default function CoursePlayer() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { userProfile } = useSelector((state) => state.auth || {});

  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [progress, setProgress] = useState(() => {
    try {
      const saved = localStorage.getItem(`edu_progress_${courseId}`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [showSidebar, setShowSidebar] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [notes, setNotes] = useState("");
  const [savedNotes, setSavedNotes] = useState(() => {
    try {
      const saved = localStorage.getItem(`edu_notes_${courseId}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  // Copilot State
  const [copilotMessages, setCopilotMessages] = useState(() => [
    {
      id: "welcome",
      isBot: true,
      text: "👋 Hi! I'm your **AI Lecture Copilot**. I'm actively following along with this lesson. Ask me anything, or tap one of the quick prompts below!",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [copilotInput, setCopilotInput] = useState("");
  const [isCopilotLoading, setIsCopilotLoading] = useState(false);
  const [copiedCodeId, setCopiedCodeId] = useState(null);
  const copilotChatEndRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem(`edu_progress_${courseId}`, JSON.stringify(progress));
    } catch {
      // ignore
    }
  }, [courseId, progress]);

  useEffect(() => {
    try {
      localStorage.setItem(`edu_notes_${courseId}`, JSON.stringify(savedNotes));
    } catch {
      // ignore
    }
  }, [courseId, savedNotes]);

  // Auto-scroll copilot messages
  useEffect(() => {
    if (activeTab === "copilot" && copilotChatEndRef.current) {
      copilotChatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [copilotMessages, activeTab, isCopilotLoading]);

  // Fetch course
  const { data: courseData, isLoading, error } = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => getCourseById(courseId),
    enabled: !!courseId,
    retry: false,
  });

  const fallbackCourse = getRealCourseById(courseId);
  const course = courseData || fallbackCourse;

  // Normalize curriculum to always have playable modules and lessons
  const modules = useMemo(() => {
    if (course?.modules && course.modules.length > 0) {
      return course.modules;
    }
    if (course?.sections && course.sections.length > 0) {
      return course.sections.map((sec, sIdx) => ({
        _id: sec._id || `sec-${sIdx}`,
        title: `${sIdx + 1}. ${sec.sectionName || `Section ${sIdx + 1}`}`,
        lessons: (sec.lectures && sec.lectures.length > 0)
          ? sec.lectures.map((lec, lIdx) => ({
              _id: `${sec._id || sIdx}-lec-${lIdx}`,
              title: lec.title || `Lecture ${lIdx + 1}`,
              type: "video",
              description: `Comprehensive video lecture covering ${lec.title || `Lecture ${lIdx + 1}`}.`,
              content: {
                videoUrl: "https://www.youtube.com/watch?v=SqcY0GlETPk",
                youtubeId: "SqcY0GlETPk",
                videoDuration: 900,
                textContent: `Welcome to ${lec.title || `Lecture ${lIdx + 1}`}. In this lesson, we break down core architectural principles, analyze best practices, and work through hands-on code examples.`,
              },
            }))
          : [
              {
                _id: `${sec._id || sIdx}-lec-0`,
                title: `${sec.sectionName || `Lesson 1`} - Core Concepts`,
                type: "video",
                description: `Comprehensive instruction and walkthrough for ${sec.sectionName || `Section ${sIdx + 1}`}.`,
                content: {
                  videoUrl: "https://www.youtube.com/watch?v=SqcY0GlETPk",
                  youtubeId: "SqcY0GlETPk",
                  videoDuration: (sec.estimatedTime || 20) * 60,
                  textContent: `Welcome to ${sec.sectionName || `Section ${sIdx + 1}`}. Review the code breakdown and key principles covered in this module.`,
                },
              },
            ],
      }));
    }
    // Default fallback curriculum
    return [
      {
        _id: "mod-intro",
        title: "1. Course Introduction & Foundations",
        lessons: [
          {
            _id: "les-1",
            title: "Course Overview & Learning Strategy",
            type: "video",
            description: "High-level orientation of all projects and competencies we will master.",
            content: {
              videoUrl: "https://www.youtube.com/watch?v=SqcY0GlETPk",
              youtubeId: "SqcY0GlETPk",
              videoDuration: 600,
              textContent: "Welcome to EduPlatform. Follow along with our project repositories.",
            },
          },
          {
            _id: "les-2",
            title: "Environment Setup & Architecture Design",
            type: "text",
            description: "Setting up your developer workstation and project configurations.",
            content: {
              textContent: "Make sure you have Node.js 18+ and VS Code installed with standard extensions.",
            },
          },
        ],
      },
      {
        _id: "mod-core",
        title: "2. Deep Dive & Core Implementation",
        lessons: [
          {
            _id: "les-3",
            title: "Hands-on Practical Architecture",
            type: "video",
            description: "Building production-grade modules step by step.",
            content: {
              videoUrl: "https://www.youtube.com/watch?v=SqcY0GlETPk",
              youtubeId: "SqcY0GlETPk",
              videoDuration: 1200,
              textContent: "Follow along closely as we structure our state and data flow.",
            },
          },
        ],
      },
    ];
  }, [course]);

  const currentModule = modules[currentModuleIndex] || modules[0];
  const currentLesson = currentModule?.lessons?.[currentLessonIndex] || currentModule?.lessons?.[0];

  // Calculate total lessons and completion stats
  const totalLessonsCount = useMemo(() => {
    return modules.reduce((total, m) => total + (m.lessons?.length || 0), 0);
  }, [modules]);

  const completedLessonsCount = useMemo(() => {
    return Object.values(progress).filter((p) => p?.completed).length;
  }, [progress]);

  const progressPercent = totalLessonsCount > 0
    ? Math.round((completedLessonsCount / totalLessonsCount) * 100)
    : 0;

  const handleLessonSelect = (modIdx, lesIdx) => {
    setCurrentModuleIndex(modIdx);
    setCurrentLessonIndex(lesIdx);
  };

  const toggleLessonCompletion = (lessonId) => {
    setProgress((prev) => ({
      ...prev,
      [lessonId]: {
        completed: !prev[lessonId]?.completed,
        completedAt: new Date(),
      },
    }));
  };

  const handleNextLesson = () => {
    if (currentLessonIndex < currentModule.lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
    } else if (currentModuleIndex < modules.length - 1) {
      setCurrentModuleIndex(currentModuleIndex + 1);
      setCurrentLessonIndex(0);
    }
  };

  const handlePrevLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
    } else if (currentModuleIndex > 0) {
      setCurrentModuleIndex(currentModuleIndex - 1);
      setCurrentLessonIndex(modules[currentModuleIndex - 1].lessons.length - 1);
    }
  };

  const handleSaveNote = () => {
    if (!notes.trim()) return;
    setSavedNotes((prev) => [
      ...prev,
      {
        id: Date.now(),
        lessonTitle: currentLesson?.title,
        text: notes.trim(),
        date: new Date().toLocaleTimeString(),
      },
    ]);
    setNotes("");
  };

  // AI Copilot Actions
  const handleSendCopilotMessage = async (customQuery) => {
    const query = (customQuery || copilotInput).trim();
    if (!query || isCopilotLoading) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      isBot: false,
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setCopilotMessages((prev) => [...prev, userMsg]);
    if (!customQuery) setCopilotInput("");
    setIsCopilotLoading(true);

    try {
      const response = await chatbotService.askLectureCopilot({
        courseTitle: course?.title,
        moduleTitle: currentModule?.title,
        lessonTitle: currentLesson?.title,
        lessonDescription: currentLesson?.description,
        query,
        history: copilotMessages,
      });

      const botMsg = {
        id: `bot-${Date.now()}`,
        isBot: true,
        text: response.text,
        source: response.source,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setCopilotMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("Copilot error:", err);
      setCopilotMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          isBot: true,
          text: "I experienced a brief connection hiccup. Review the key lecture takeaways and test the module in your local editor!",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsCopilotLoading(false);
    }
  };

  const handleCopyCode = (code, blockId) => {
    try {
      navigator.clipboard.writeText(code);
      setCopiedCodeId(blockId);
      setTimeout(() => setCopiedCodeId(null), 2500);
    } catch {
      // ignore
    }
  };

  const handleClearCopilotChat = () => {
    setCopilotMessages([
      {
        id: "welcome-reset",
        isBot: true,
        text: `Conversation cleared. How can I assist you with **${currentLesson?.title || "this lesson"}**?`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  if (isLoading && !fallbackCourse) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (!course && (error || !courseData)) {
    return (
      <div className="min-h-screen bg-[#f8fafc] py-20 px-4 text-center">
        <AlertMessage type="error" message="Unable to load course classroom" />
        <Link to="/courses" className="mt-4 inline-block text-indigo-600 font-bold hover:underline">
          &larr; Return to Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans antialiased">
      {/* ─── 1. UDEMY / COURSERA TOP CLASSROOM BAR ────────────────────── */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 sm:px-6 h-16 flex items-center justify-between gap-4 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            to={`/courses/${courseId}`}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition flex-shrink-0"
            title="Back to Course Details"
          >
            <FaArrowLeft className="text-xs" />
          </Link>

          <div className="min-w-0">
            <h1 className="text-sm sm:text-base font-bold text-slate-900 truncate">
              {course.title}
            </h1>
            <p className="text-[11px] text-slate-500 font-medium truncate hidden sm:block">
              {currentModule?.title} &bull; {currentLesson?.title}
            </p>
          </div>
        </div>

        {/* Progress, Leaderboard, Certificate & Sidebar Toggle */}
        <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
          <Link
            to={`/students-position/${courseId}`}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 text-xs font-bold transition shadow-xs"
            title="Class Leaderboard"
          >
            <FaAward className="text-amber-500" />
            <span>Leaderboard</span>
          </Link>

          {progressPercent === 100 && (
            <button
              onClick={() => setShowCertificateModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition shadow-sm animate-bounce"
            >
              <FaGraduationCap className="text-sm" />
              <span>Certificate</span>
            </button>
          )}

          {/* Progress Widget (Udemy Style) */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="w-28 sm:w-32 bg-slate-100 border border-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-xs font-bold text-slate-700">
              {progressPercent}%
            </span>
          </div>

          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 text-xs font-bold transition"
          >
            <FaList />
            <span className="hidden md:inline">{showSidebar ? "Hide Curriculum" : "Show Curriculum"}</span>
          </button>
        </div>
      </header>

      {/* ─── 2. MAIN WORKSPACE (Split Screen Dual-Column) ─────────────── */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT COLUMN: VIDEO PLAYER + LECTURE TABS */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Video Player Box */}
          <div className="max-w-5xl mx-auto space-y-4">
            {currentLesson?.type === "video" ? (
              <YouTubePlayer
                videoId={currentLesson?.content?.youtubeId || "SqcY0GlETPk"}
                onComplete={() => toggleLessonCompletion(currentLesson._id)}
              />
            ) : (
              <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-8 space-y-4 min-h-[360px] flex flex-col justify-center">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center text-xl">
                  <FaBook />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">{currentLesson?.title}</h2>
                <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-line font-normal">
                  {currentLesson?.content?.textContent || currentLesson?.description}
                </div>
              </div>
            )}

            {/* Navigation & Completion Bar below Video */}
            <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevLesson}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <FaStepBackward className="text-[10px]" />
                  <span>Previous</span>
                </button>
                <button
                  onClick={handleNextLesson}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <span>Next</span>
                  <FaStepForward className="text-[10px]" />
                </button>
              </div>

              <button
                onClick={() => toggleLessonCompletion(currentLesson?._id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
                  progress[currentLesson?._id]?.completed
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-300"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20"
                }`}
              >
                <FaCheck />
                <span>
                  {progress[currentLesson?._id]?.completed
                    ? "Completed"
                    : "Mark as Completed"}
                </span>
              </button>
            </div>

            {/* UDEMY / COURSERA TABBED CONTENT BAR */}
            <div className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden">
              {/* Tab Header Navigation */}
              <div className="flex items-center border-b border-slate-200 px-4 sm:px-6 bg-slate-50/80 gap-6">
                {[
                  { id: "overview", label: "Overview", icon: <FaBookOpen /> },
                  { id: "copilot", label: "AI Copilot", icon: <FaRobot />, badge: "AI" },
                  { id: "resources", label: "Resources & Files", icon: <FaFolderOpen /> },
                  { id: "notes", label: "Notes", icon: <FaStickyNote /> },
                  { id: "qa", label: "Q&A Forum", icon: <FaQuestionCircle /> },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition relative ${
                      activeTab === tab.id
                        ? "border-indigo-600 text-indigo-600"
                        : "border-transparent text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                    {tab.badge && (
                      <span className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase shadow-xs">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Tab Body */}
              <div className="p-6">
                {activeTab === "overview" && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-slate-900">{currentLesson?.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {currentLesson?.description ||
                        "In this lesson, we break down core design principles and build functional components with best engineering practices."}
                    </p>
                    <div className="pt-3 border-t border-slate-100 flex items-center gap-6 text-xs text-slate-500 font-medium">
                      <span>Instructor: <strong className="text-slate-800">{course.user?.username || "Lead Faculty"}</strong></span>
                      <span>Skill Level: <strong className="text-indigo-600">{course.difficulty || "All Levels"}</strong></span>
                      <span>Estimated Time: <strong className="text-slate-800">20 mins</strong></span>
                    </div>
                  </div>
                )}

                {/* ─── AI COPILOT TAB ──────────────────────────────────── */}
                {activeTab === "copilot" && (
                  <div className="space-y-5">
                    {/* Active Context Bar */}
                    <div className="p-3.5 bg-gradient-to-r from-indigo-50 via-purple-50 to-white rounded-2xl border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                          <FaRobot className="text-sm" />
                        </div>
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                            Active Lecture Companion
                          </div>
                          <div className="text-xs font-bold text-slate-900 line-clamp-1">
                            {currentLesson?.title || "Current Lecture"}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleClearCopilotChat}
                        className="text-[11px] text-slate-500 hover:text-rose-600 flex items-center gap-1 font-semibold transition self-start sm:self-auto cursor-pointer"
                        title="Clear conversation"
                      >
                        <FaTrashAlt className="text-[10px]" />
                        <span>Clear Chat</span>
                      </button>
                    </div>

                    {/* Quick Prompt Chips */}
                    <div className="space-y-1.5">
                      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                        <FaMagic className="text-indigo-500 text-[10px]" />
                        <span>Quick Questions &amp; Prompts</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {[
                          {
                            label: "📋 Summarize this lecture",
                            prompt: "Summarize the key concepts and core takeaways from this lecture in clear bullet points.",
                          },
                          {
                            label: "💡 Explain key concepts",
                            prompt: "Explain the main mechanics and architecture of this lesson in simple terms.",
                          },
                          {
                            label: "💻 Code example",
                            prompt: "Provide a clean, production-ready code implementation illustrating this lesson.",
                          },
                          {
                            label: "🧠 Quiz my understanding",
                            prompt: "Ask me 2 practical questions to test my understanding of this topic, with explanations.",
                          },
                          {
                            label: "🚀 Industry use cases",
                            prompt: "How do modern tech companies apply this exact pattern in real-world production projects?",
                          },
                        ].map((chip, idx) => (
                          <button
                            key={idx}
                            type="button"
                            disabled={isCopilotLoading}
                            onClick={() => handleSendCopilotMessage(chip.prompt)}
                            className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:border-indigo-300 text-slate-700 hover:text-indigo-700 border border-slate-200 transition shadow-2xs disabled:opacity-50 cursor-pointer"
                          >
                            {chip.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Chat Messages Stream */}
                    <div className="space-y-3.5 max-h-[420px] overflow-y-auto pr-1">
                      {copilotMessages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex gap-3 ${msg.isBot ? "items-start" : "items-start justify-end"}`}
                        >
                          {msg.isBot && (
                            <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 text-xs shadow-xs mt-1">
                              <FaRobot />
                            </div>
                          )}

                          <div
                            className={`max-w-[85%] rounded-2xl p-4 shadow-2xs ${
                              msg.isBot
                                ? "bg-white border border-slate-200 text-slate-800"
                                : "bg-indigo-600 text-white"
                            }`}
                          >
                            {msg.isBot ? (
                              <CopilotMessageBody
                                content={msg.text}
                                onCopyCode={handleCopyCode}
                                copiedCodeId={copiedCodeId}
                              />
                            ) : (
                              <p className="text-xs sm:text-sm font-medium leading-relaxed whitespace-pre-wrap">
                                {msg.text}
                              </p>
                            )}
                            <div
                              className={`text-[10px] mt-2 font-medium flex items-center justify-end gap-1 ${
                                msg.isBot ? "text-slate-400" : "text-indigo-200"
                              }`}
                            >
                              <span>{msg.timestamp}</span>
                            </div>
                          </div>

                          {!msg.isBot && (
                            <div className="w-7 h-7 rounded-xl bg-slate-900 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold shadow-xs mt-1">
                              {(userProfile?.username || "You")[0].toUpperCase()}
                            </div>
                          )}
                        </div>
                      ))}

                      {/* Loading Typing Indicator */}
                      {isCopilotLoading && (
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 text-xs shadow-xs">
                            <FaRobot />
                          </div>
                          <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 text-xs text-indigo-600 font-semibold flex items-center gap-2 shadow-2xs">
                            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
                            <span>AI Copilot is analyzing lecture context...</span>
                          </div>
                        </div>
                      )}
                      <div ref={copilotChatEndRef} />
                    </div>

                    {/* Chat Input Bar */}
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSendCopilotMessage();
                      }}
                      className="flex items-center gap-2 pt-2 border-t border-slate-100"
                    >
                      <input
                        type="text"
                        value={copilotInput}
                        onChange={(e) => setCopilotInput(e.target.value)}
                        placeholder={`Ask a question about ${currentLesson?.title || "this lesson"}...`}
                        disabled={isCopilotLoading}
                        className="flex-1 bg-slate-50 border border-slate-200 text-slate-900 px-4 py-3 rounded-2xl text-xs sm:text-sm focus:outline-none focus:border-indigo-600 focus:bg-white transition disabled:opacity-60"
                      />
                      <button
                        type="submit"
                        disabled={!copilotInput.trim() || isCopilotLoading}
                        className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-md shadow-indigo-600/20 transition flex items-center gap-2 disabled:opacity-40 cursor-pointer"
                      >
                        <FaPaperPlane className="text-xs" />
                        <span className="hidden sm:inline">Send</span>
                      </button>
                    </form>
                  </div>
                )}

                {activeTab === "resources" && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-slate-900">Lecture Downloads & References</h3>
                    <div className="space-y-2">
                      <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5 text-slate-800">
                          <FaCode className="text-indigo-600 text-sm" />
                          <span className="font-semibold">Starter Project Code & Architecture (.zip)</span>
                        </div>
                        <span className="text-indigo-600 font-bold hover:underline cursor-pointer">
                          Download (4.2 MB)
                        </span>
                      </div>
                      <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5 text-slate-800">
                          <FaDownload className="text-indigo-600 text-sm" />
                          <span className="font-semibold">Cheat Sheet & API Quick Reference (.pdf)</span>
                        </div>
                        <span className="text-indigo-600 font-bold hover:underline cursor-pointer">
                          Download (1.1 MB)
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "notes" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Type a personal note for this lesson..."
                        rows={3}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 p-3 rounded-xl text-xs focus:outline-none focus:border-indigo-600 focus:bg-white"
                      />
                      <button
                        onClick={handleSaveNote}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow transition"
                      >
                        Save Note
                      </button>
                    </div>

                    {savedNotes.length > 0 && (
                      <div className="space-y-2 pt-2 border-t border-slate-100">
                        <h4 className="text-xs font-bold text-slate-500 uppercase">Your Saved Notes</h4>
                        {savedNotes.map((n) => (
                          <div key={n.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                            <div className="flex justify-between text-slate-500 text-[10px]">
                              <span className="font-bold text-indigo-600">{n.lessonTitle}</span>
                              <span>{n.date}</span>
                            </div>
                            <p className="text-slate-800">{n.text}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "qa" && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-900">Questions & Discussions</h3>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-[10px] text-white">
                          A
                        </div>
                        <span className="font-bold text-slate-800">Alex Tan</span>
                        <span className="text-slate-500">2 days ago</span>
                      </div>
                      <p className="text-slate-700">
                        Is it better to handle state normalization on the client or let backend handle response shaping?
                      </p>
                      <div className="pl-4 border-l-2 border-slate-200 text-slate-600 text-[11px] pt-1">
                        <strong className="text-indigo-600">Instructor:</strong> Whenever possible, keep payload formats consistent from your REST/GraphQL layer to minimize client transformations!
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* RIGHT COLUMN: COLLAPSIBLE CURRICULUM DRAWER (Udemy Standard) */}
        {showSidebar && (
          <aside className="w-80 lg:w-96 bg-white border-l border-slate-200 flex flex-col h-full flex-shrink-0 shadow-sm">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Course Content</h3>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                  {completedLessonsCount} of {totalLessonsCount} completed ({progressPercent}%)
                </p>
              </div>
            </div>

            {/* Curriculum Accordion */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {modules.map((mod, mIdx) => (
                <div key={mod._id || mIdx}>
                  <div className="p-3.5 bg-slate-50 font-bold text-xs text-slate-800 flex items-center justify-between border-b border-slate-100">
                    <span className="line-clamp-1">{mod.title}</span>
                    <span className="text-[10px] text-slate-500 font-medium flex-shrink-0 ml-2">
                      {mod.lessons?.length || 0} items
                    </span>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {mod.lessons?.map((les, lIdx) => {
                      const isCurrent = currentModuleIndex === mIdx && currentLessonIndex === lIdx;
                      const isDone = progress[les._id]?.completed;

                      return (
                        <div
                          key={les._id || lIdx}
                          onClick={() => handleLessonSelect(mIdx, lIdx)}
                          className={`p-3 text-xs flex items-start gap-3 cursor-pointer transition ${
                            isCurrent
                              ? "bg-indigo-50 border-l-4 border-indigo-600 text-indigo-950"
                              : "hover:bg-slate-50 text-slate-700"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={!!isDone}
                            onChange={(e) => {
                              e.stopPropagation();
                              toggleLessonCompletion(les._id);
                            }}
                            className="mt-0.5 rounded text-indigo-600 focus:ring-0 cursor-pointer"
                          />

                          <div className="flex-1 min-w-0">
                            <p className={`font-semibold line-clamp-2 ${isCurrent ? "text-indigo-900 font-bold" : ""}`}>
                              {les.title}
                            </p>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                              {les.type === "video" ? (
                                <FaPlay className="text-[8px] text-indigo-600" />
                              ) : (
                                <FaBook className="text-[8px] text-indigo-500" />
                              )}
                              <span>{les.type === "video" ? "15:00" : "Reading"}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </aside>
        )}
      </div>

      {/* CERTIFICATE OF COMPLETION MODAL */}
      {showCertificateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-8 shadow-2xl relative space-y-6 animate-fadeIn">
            <button
              onClick={() => setShowCertificateModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-100 transition cursor-pointer"
            >
              <FaTimes />
            </button>

            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-amber-500 text-white flex items-center justify-center text-3xl mx-auto shadow-lg">
                <FaGraduationCap />
              </div>
              <span className="text-xs font-black tracking-wider uppercase text-indigo-600">
                Official EduPlatform Certificate
              </span>
              <h2 className="text-2xl font-black text-slate-900">Certificate of Completion</h2>
              <p className="text-xs text-slate-500">
                This verified credential confirms full mastery of all course lectures, practical projects, and milestones.
              </p>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-3">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Awarded to</p>
              <h3 className="text-xl font-black text-slate-900">
                {userProfile?.username || userProfile?.name || "Student Graduate"}
              </h3>
              <p className="text-xs text-slate-500">for successfully completing</p>
              <h4 className="text-sm font-bold text-indigo-700">
                {course.title}
              </h4>
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                <span>Instructor: <strong>{course.instructor || course.user?.username || "EduPlatform Faculty"}</strong></span>
                <span>Date: <strong>{new Date().toLocaleDateString()}</strong></span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  window.print();
                }}
                className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <FaDownload className="text-xs" />
                <span>Download / Print Certificate</span>
              </button>
              <button
                onClick={() => setShowCertificateModal(false)}
                className="px-5 py-3 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
