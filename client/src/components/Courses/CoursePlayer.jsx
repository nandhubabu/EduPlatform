import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
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
} from "react-icons/fa";
import { getCourseById } from "../../services/courseService";
import AlertMessage from "../Alert/AlertMessage";

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

export default function CoursePlayer() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [progress, setProgress] = useState({});
  const [showSidebar, setShowSidebar] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [notes, setNotes] = useState("");
  const [savedNotes, setSavedNotes] = useState([]);

  // Fetch course
  const { data: course, isLoading, error } = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => getCourseById(courseId),
    enabled: !!courseId,
  });

  // Normalize curriculum to always have playable modules and lessons
  const modules = useMemo(() => {
    if (course?.modules && course.modules.length > 0) {
      return course.modules;
    }
    if (course?.sections && course.sections.length > 0) {
      return [
        {
          _id: "mod-sections",
          title: "Core Curriculum Sections",
          lessons: course.sections.map((sec, idx) => ({
            _id: sec._id || `sec-${idx}`,
            title: sec.sectionName || `Section ${idx + 1}`,
            type: "video",
            description: `Comprehensive instruction and hands-on walkthrough for ${sec.sectionName || `Section ${idx + 1}`}.`,
            content: {
              videoUrl: "https://www.youtube.com/watch?v=SqcY0GlETPk",
              youtubeId: "SqcY0GlETPk",
              videoDuration: (sec.estimatedTime || 20) * 60,
              textContent: `Welcome to ${sec.sectionName || `Lesson ${idx + 1}`}. Review the code breakdown and key principles covered in this module.`,
            },
          })),
        },
      ];
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#080b12] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-[#080b12] py-20 px-4 text-center">
        <AlertMessage type="error" message="Unable to load course classroom" />
        <Link to="/courses" className="mt-4 inline-block text-blue-400 font-bold hover:underline">
          &larr; Return to Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080b12] text-slate-100 flex flex-col font-sans antialiased">
      {/* ─── 1. UDEMY / COURSERA TOP CLASSROOM BAR ────────────────────── */}
      <header className="bg-[#0e1322] border-b border-slate-800 px-4 sm:px-6 h-16 flex items-center justify-between gap-4 sticky top-0 z-40">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            to={`/courses/${courseId}`}
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition flex-shrink-0"
            title="Back to Course Details"
          >
            <FaArrowLeft className="text-xs" />
          </Link>

          <div className="min-w-0">
            <h1 className="text-sm sm:text-base font-bold text-white truncate">
              {course.title}
            </h1>
            <p className="text-[11px] text-slate-400 truncate hidden sm:block">
              {currentModule?.title} &bull; {currentLesson?.title}
            </p>
          </div>
        </div>

        {/* Progress & Sidebar Toggle */}
        <div className="flex items-center gap-4 flex-shrink-0">
          {/* Progress Widget (Udemy Style) */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="w-32 bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-emerald-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-xs font-bold text-slate-300">
              {progressPercent}% Complete
            </span>
          </div>

          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 text-xs font-bold transition"
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
              <div className="bg-[#0f1524] border border-slate-800 rounded-2xl p-8 space-y-4 min-h-[360px] flex flex-col justify-center">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center text-xl">
                  <FaBook />
                </div>
                <h2 className="text-2xl font-bold text-white">{currentLesson?.title}</h2>
                <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                  {currentLesson?.content?.textContent || currentLesson?.description}
                </div>
              </div>
            )}

            {/* Navigation & Completion Bar below Video */}
            <div className="bg-[#0e1422] border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevLesson}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <FaStepBackward className="text-[10px]" />
                  <span>Previous</span>
                </button>
                <button
                  onClick={handleNextLesson}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <span>Next</span>
                  <FaStepForward className="text-[10px]" />
                </button>
              </div>

              <button
                onClick={() => toggleLessonCompletion(currentLesson?._id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
                  progress[currentLesson?._id]?.completed
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    : "bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30"
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
            <div className="bg-[#0e1422] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              {/* Tab Header Navigation */}
              <div className="flex items-center border-b border-slate-800 px-4 sm:px-6 bg-[#0c101a] gap-6">
                {[
                  { id: "overview", label: "Overview", icon: <FaBookOpen /> },
                  { id: "resources", label: "Resources & Files", icon: <FaFolderOpen /> },
                  { id: "notes", label: "Notes", icon: <FaStickyNote /> },
                  { id: "qa", label: "Q&A Forum", icon: <FaQuestionCircle /> },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition ${
                      activeTab === tab.id
                        ? "border-blue-500 text-white"
                        : "border-transparent text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Tab Body */}
              <div className="p-6">
                {activeTab === "overview" && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-white">{currentLesson?.title}</h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {currentLesson?.description ||
                        "In this lesson, we break down core design principles and build functional components with best engineering practices."}
                    </p>
                    <div className="pt-3 border-t border-slate-800/80 flex items-center gap-6 text-xs text-slate-400">
                      <span>Instructor: <strong className="text-slate-200">{course.user?.username || "Lead Faculty"}</strong></span>
                      <span>Skill Level: <strong className="text-blue-400">{course.difficulty || "All Levels"}</strong></span>
                      <span>Estimated Time: <strong className="text-slate-200">20 mins</strong></span>
                    </div>
                  </div>
                )}

                {activeTab === "resources" && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-white">Lecture Downloads & References</h3>
                    <div className="space-y-2">
                      <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5 text-slate-200">
                          <FaCode className="text-blue-400 text-sm" />
                          <span className="font-semibold">Starter Project Code & Architecture (.zip)</span>
                        </div>
                        <span className="text-blue-400 font-bold hover:underline cursor-pointer">
                          Download (4.2 MB)
                        </span>
                      </div>
                      <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5 text-slate-200">
                          <FaDownload className="text-indigo-400 text-sm" />
                          <span className="font-semibold">Cheat Sheet & API Quick Reference (.pdf)</span>
                        </div>
                        <span className="text-blue-400 font-bold hover:underline cursor-pointer">
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
                        className="w-full bg-slate-900 border border-slate-700 text-slate-100 p-3 rounded-xl text-xs focus:outline-none focus:border-blue-500"
                      />
                      <button
                        onClick={handleSaveNote}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg transition"
                      >
                        Save Note
                      </button>
                    </div>

                    {savedNotes.length > 0 && (
                      <div className="space-y-2 pt-2 border-t border-slate-800">
                        <h4 className="text-xs font-bold text-slate-400 uppercase">Your Saved Notes</h4>
                        {savedNotes.map((n) => (
                          <div key={n.id} className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-xs space-y-1">
                            <div className="flex justify-between text-slate-400 text-[10px]">
                              <span className="font-bold text-blue-400">{n.lessonTitle}</span>
                              <span>{n.date}</span>
                            </div>
                            <p className="text-slate-200">{n.text}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "qa" && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-white">Questions & Discussions</h3>
                    <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 text-xs space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center font-bold text-[10px] text-white">
                          A
                        </div>
                        <span className="font-bold text-slate-200">Alex Tan</span>
                        <span className="text-slate-500">2 days ago</span>
                      </div>
                      <p className="text-slate-300">
                        Is it better to handle state normalization on the client or let backend handle response shaping?
                      </p>
                      <div className="pl-4 border-l-2 border-slate-800 text-slate-400 text-[11px] pt-1">
                        <strong className="text-blue-400">Instructor:</strong> Whenever possible, keep payload formats consistent from your REST/GraphQL layer to minimize client transformations!
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
          <aside className="w-80 lg:w-96 bg-[#0c101a] border-l border-slate-800 flex flex-col h-full flex-shrink-0">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-white">Course Content</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {completedLessonsCount} of {totalLessonsCount} completed ({progressPercent}%)
                </p>
              </div>
            </div>

            {/* Curriculum Accordion */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-800/80">
              {modules.map((mod, mIdx) => (
                <div key={mod._id || mIdx}>
                  <div className="p-3.5 bg-slate-900/60 font-bold text-xs text-slate-200 flex items-center justify-between">
                    <span className="line-clamp-1">{mod.title}</span>
                    <span className="text-[10px] text-slate-400 flex-shrink-0 ml-2">
                      {mod.lessons?.length || 0} items
                    </span>
                  </div>

                  <div className="divide-y divide-slate-800/40">
                    {mod.lessons?.map((les, lIdx) => {
                      const isCurrent = currentModuleIndex === mIdx && currentLessonIndex === lIdx;
                      const isDone = progress[les._id]?.completed;

                      return (
                        <div
                          key={les._id || lIdx}
                          onClick={() => handleLessonSelect(mIdx, lIdx)}
                          className={`p-3 text-xs flex items-start gap-3 cursor-pointer transition ${
                            isCurrent
                              ? "bg-blue-600/15 border-l-4 border-blue-500 text-white"
                              : "hover:bg-slate-800/40 text-slate-300"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={!!isDone}
                            onChange={(e) => {
                              e.stopPropagation();
                              toggleLessonCompletion(les._id);
                            }}
                            className="mt-0.5 rounded text-blue-600 focus:ring-0 cursor-pointer"
                          />

                          <div className="flex-1 min-w-0">
                            <p className={`font-semibold line-clamp-2 ${isCurrent ? "text-blue-300" : ""}`}>
                              {les.title}
                            </p>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                              {les.type === "video" ? (
                                <FaPlay className="text-[8px] text-blue-400" />
                              ) : (
                                <FaBook className="text-[8px] text-indigo-400" />
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
    </div>
  );
}
