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
  FaClipboardCheck,
  FaRedo,
  FaBolt,
  FaLinkedin,
  FaExternalLinkAlt,
  FaQrcode,
  FaPrint,
  FaThumbsUp,
  FaReply,
  FaSearch,
  FaFilter,
  FaCalendarAlt,
  FaCalendarPlus,
  FaFire,
  FaBell,
} from "react-icons/fa";
import { getCourseById } from "../../services/courseService";
import AlertMessage from "../Alert/AlertMessage";
import { getRealCourseById } from "../../data/realCourses";
import chatbotService from "../../services/chatbotService";

// YouTube Video Player Component
const YouTubePlayer = ({ videoId, onProgress, onComplete, onPlayerReady, initialTime = 0 }) => {
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
            onPlayerReady?.(event.target);
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

// Vector QR Code Component for Credential Verification
const VerifiableQrCode = ({ size = 68, certId = "" }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className="bg-white p-1 rounded-lg border border-slate-300 shadow-2xs"
    >
      {/* Finder Patterns */}
      <rect x="5" y="5" width="26" height="26" fill="#0f172a" rx="3" />
      <rect x="9" y="9" width="18" height="18" fill="#ffffff" rx="2" />
      <rect x="13" y="13" width="10" height="10" fill="#0f172a" rx="1" />

      <rect x="69" y="5" width="26" height="26" fill="#0f172a" rx="3" />
      <rect x="73" y="9" width="18" height="18" fill="#ffffff" rx="2" />
      <rect x="77" y="13" width="10" height="10" fill="#0f172a" rx="1" />

      <rect x="5" y="69" width="26" height="26" fill="#0f172a" rx="3" />
      <rect x="9" y="73" width="18" height="18" fill="#ffffff" rx="2" />
      <rect x="13" y="77" width="10" height="10" fill="#0f172a" rx="1" />

      {/* Sync bars */}
      <rect x="36" y="7" width="5" height="5" fill="#0f172a" />
      <rect x="46" y="7" width="5" height="5" fill="#0f172a" />
      <rect x="56" y="7" width="5" height="5" fill="#0f172a" />
      <rect x="7" y="36" width="5" height="5" fill="#0f172a" />
      <rect x="7" y="46" width="5" height="5" fill="#0f172a" />
      <rect x="7" y="56" width="5" height="5" fill="#0f172a" />

      {/* Data blocks */}
      <rect x="38" y="38" width="8" height="8" fill="#4338ca" />
      <rect x="52" y="38" width="6" height="6" fill="#0f172a" />
      <rect x="38" y="52" width="6" height="6" fill="#0f172a" />
      <rect x="50" y="50" width="10" height="10" fill="#4338ca" />
      <rect x="66" y="38" width="6" height="6" fill="#0f172a" />
      <rect x="78" y="44" width="6" height="6" fill="#0f172a" />
      <rect x="40" y="68" width="6" height="6" fill="#0f172a" />
      <rect x="52" y="72" width="8" height="8" fill="#4338ca" />
      <rect x="68" y="68" width="6" height="6" fill="#0f172a" />
      <rect x="80" y="78" width="6" height="6" fill="#0f172a" />
      <rect x="68" y="80" width="8" height="8" fill="#0f172a" />
      <rect x="38" y="82" width="6" height="6" fill="#4338ca" />
    </svg>
  );
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

// Dynamic Knowledge-Check Quiz Generator
const getModuleQuiz = (courseTitle = "", category = "", moduleTitle = "", moduleIndex = 0) => {
  const cTitle = (courseTitle || "").toLowerCase();
  const cat = (category || "").toLowerCase();

  if (
    cTitle.includes("react") ||
    cTitle.includes("frontend") ||
    cTitle.includes("web") ||
    cat.includes("web") ||
    cat.includes("development")
  ) {
    return [
      {
        id: `q-${moduleIndex}-1`,
        question: "In modern frontend architecture, what is the primary benefit of unidirectional data flow?",
        options: [
          "It allows child components to directly mutate parent application state",
          "It ensures predictable state changes by letting data flow down and events bubble up",
          "It eliminates the need for HTTP APIs and databases",
          "It automatically minifies all CSS files during development",
        ],
        correctIndex: 1,
        explanation: "Unidirectional data flow ensures a single source of truth. State flows downward via props, while user events bubble up via callbacks, preventing hidden state mutations and hard-to-track bugs.",
      },
      {
        id: `q-${moduleIndex}-2`,
        question: "When is it appropriate to use `useMemo` or `useCallback` in React?",
        options: [
          "On every single internal helper function and variable without exception",
          "Only when optimizing expensive computations or stabilizing referential equality for dependency arrays",
          "To trigger browser page reloads",
          "To encrypt client-side cookies",
        ],
        correctIndex: 1,
        explanation: "Premature memoization introduces memory overhead and complexity. Only use `useMemo` or `useCallback` when computations are measurably heavy or when function identities prevent re-renders in memoized children.",
      },
      {
        id: `q-${moduleIndex}-3`,
        question: "Which HTTP method should be used for operations that must be idempotent (repeated without side-effects)?",
        options: [
          "POST",
          "PUT / GET",
          "PATCH only",
          "CONNECT",
        ],
        correctIndex: 1,
        explanation: "GET and PUT requests are idempotent: making the same request multiple times produces the exact same server state, unlike POST which typically creates a new record every execution.",
      },
      {
        id: `q-${moduleIndex}-4`,
        question: "What is the primary benefit of component modularity and separation of concerns?",
        options: [
          "It isolates logic into testable units and allows teams to scale without stepping on each other's code",
          "It causes bundle sizes to double",
          "It forces all state to be global",
          "It disables client-side routing",
        ],
        correctIndex: 0,
        explanation: "Modular components are easy to test in isolation, reuse across different pages, and maintain without ripple effects throughout the rest of the application.",
      },
    ];
  }

  if (
    cTitle.includes("python") ||
    cTitle.includes("data") ||
    cTitle.includes("machine") ||
    cTitle.includes("ai") ||
    cat.includes("data") ||
    cat.includes("ai")
  ) {
    return [
      {
        id: `q-${moduleIndex}-1`,
        question: "Which Python data structure is immutable and hashable, making it suitable as a dictionary key?",
        options: [
          "List [1, 2, 3]",
          "Tuple (1, 2, 3)",
          "Set {1, 2, 3}",
          "Dictionary {'k': 'v'}",
        ],
        correctIndex: 1,
        explanation: "Tuples cannot be altered once created (immutable), which ensures their hash value remains constant throughout execution, qualifying them as valid dictionary keys.",
      },
      {
        id: `q-${moduleIndex}-2`,
        question: "Why is vectorized computation in NumPy significantly faster than standard Python `for` loops?",
        options: [
          "It executes operations in highly optimized, pre-compiled C-level loops with continuous memory buffers",
          "It skips data validation and assumes all numbers are zero",
          "It offloads computation to external cloud servers automatically",
          "It compresses the data into zip files before math",
        ],
        correctIndex: 0,
        explanation: "NumPy arrays use contiguous memory blocks and vectorized operations written in C, bypassing Python interpreter overhead and type-checking loops.",
      },
      {
        id: `q-${moduleIndex}-3`,
        question: "When dealing with severe class imbalance in classification, which evaluation metric is preferred over raw Accuracy?",
        options: [
          "Raw Accuracy",
          "F1-Score and Precision-Recall AUC",
          "Number of training iterations only",
          "CPU core count",
        ],
        correctIndex: 1,
        explanation: "A naive model predicting 'negative' 100% of the time achieves 99% accuracy but fails entirely. Precision-Recall AUC and F1-score measure how well minority positive cases are actually identified.",
      },
      {
        id: `q-${moduleIndex}-4`,
        question: "What is the primary goal of k-fold cross-validation?",
        options: [
          "To test model generalization across multiple splits and prevent overfitting to a single test sample",
          "To encrypt model weights",
          "To speed up GPU cooling",
          "To format CSV tables into HTML",
        ],
        correctIndex: 0,
        explanation: "K-fold cross validation trains and evaluates models across k distinct partitions, ensuring the reported performance isn't an artifact of a lucky test split.",
      },
    ];
  }

  if (
    cTitle.includes("cloud") ||
    cTitle.includes("devops") ||
    cTitle.includes("docker") ||
    cTitle.includes("aws") ||
    cat.includes("cloud")
  ) {
    return [
      {
        id: `q-${moduleIndex}-1`,
        question: "What is the architectural distinction between a container and a traditional virtual machine?",
        options: [
          "Containers share the host operating system kernel and isolate user-space, making them lightweight",
          "Containers require dedicated hypervisors and full guest OS installations",
          "Containers cannot run web servers",
          "Virtual machines do not use memory",
        ],
        correctIndex: 0,
        explanation: "Containers share the host kernel while isolating processes via namespaces and cgroups, allowing sub-second startups and minimal resource overhead compared to heavy hypervisor VMs.",
      },
      {
        id: `q-${moduleIndex}-2`,
        question: "What is the core principle behind 'Infrastructure as Code' (IaC)?",
        options: [
          "Manually clicking configuration buttons in web consoles",
          "Declaring, version-controlling, and provisioning environments via reproducible code definitions",
          "Only running apps on local developer laptops",
          "Never documenting server topologies",
        ],
        correctIndex: 1,
        explanation: "IaC enables deterministic, auditable, and automated infrastructure deployments using tools like Terraform or CloudFormation.",
      },
      {
        id: `q-${moduleIndex}-3`,
        question: "In Kubernetes, which controller is responsible for maintaining a declared number of identical pod replicas?",
        options: [
          "Deployment (backed by ReplicaSet)",
          "ConfigMap",
          "Ingress Controller",
          "PersistentVolumeClaim",
        ],
        correctIndex: 0,
        explanation: "A Kubernetes Deployment manages ReplicaSets to ensure the active pod count matches your desired replica target, automatically restarting failed pods.",
      },
      {
        id: `q-${moduleIndex}-4`,
        question: "What is the main goal of automated canary deployments in modern CD pipelines?",
        options: [
          "Routing a small fraction of real production traffic to the new release to detect errors before full rollout",
          "Stopping all servers for 2 hours during an upgrade",
          "Deleting database indexes",
          "Randomly rebooting clusters",
        ],
        correctIndex: 0,
        explanation: "Canary deployments roll out new code to a small cohort (e.g. 5%), monitoring error rates and telemetry before promoting to 100% of users.",
      },
    ];
  }

  // Default / Engineering & Architecture Module Quiz
  return [
    {
      id: `q-${moduleIndex}-1`,
      question: `What is the primary architectural takeaway emphasized in "${moduleTitle || 'this module'}"?`,
      options: [
        "Building modular, decoupled components with explicit interfaces and error boundaries",
        "Writing monolithic 5,000-line files to avoid importing files",
        "Disabling all logging and error monitoring",
        "Ignoring asynchronous state changes",
      ],
      correctIndex: 0,
      explanation: "Decoupling system concerns and wrapping operations in explicit error boundaries ensures systems remain resilient, testable, and scalable over time.",
    },
    {
      id: `q-${moduleIndex}-2`,
      question: "Why should critical user workflows always include defensive error handling?",
      options: [
        "To prevent unexpected network failures or corrupted payloads from crashing the client application",
        "Because it makes the code run in slow motion",
        "It is required by the browser vendor for monetization",
        "It hides all bugs permanently from developers",
      ],
      correctIndex: 0,
      explanation: "Defensive error handling (try/catch blocks, fallback UI, retry logic) gracefully handles real-world connectivity hiccups without degrading user trust.",
    },
    {
      id: `q-${moduleIndex}-3`,
      question: "What is the primary purpose of persistent state synchronization (e.g. localStorage / backend APIs)?",
      options: [
        "Ensuring the learner's progress, notes, and milestones persist across browser refreshes and sessions",
        "Slowing down the page render time",
        "Forcing the user to re-enter their credentials on every page",
        "Disabling cache memory",
      ],
      correctIndex: 0,
      explanation: "State persistence gives users continuity. Refreshing the browser or switching tabs doesn't destroy the learner's progress or notes.",
    },
    {
      id: `q-${moduleIndex}-4`,
      question: "What is the most effective way to validate retention of these concepts?",
      options: [
        "Building a functional project and passing hands-on module knowledge checks",
        "Only reading the titles of the lessons",
        "Skipping all practical exercises",
        "Closing the browser immediately",
      ],
      correctIndex: 0,
      explanation: "Active recall through immediate testing and hands-on coding reinforces neural pathways and delivers genuine comprehension.",
    },
  ];
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

  // Quiz & XP Gamification State
  const [quizAnswers, setQuizAnswers] = useState({});
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);
  const [quizHistory, setQuizHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(`edu_quiz_${courseId}`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [courseXP, setCourseXP] = useState(() => {
    try {
      const saved = localStorage.getItem(`edu_xp_${courseId}`);
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  // Certificate Verification & Credential ID State
  const [certCredentialId] = useState(() => {
    try {
      const saved = localStorage.getItem(`edu_cert_id_${courseId}`);
      if (saved) return saved;
      const rawKey = (courseId || "EDU").slice(-5).toUpperCase();
      const randomCode = Math.random().toString(36).substring(2, 7).toUpperCase();
      const newId = `EDU-2026-${rawKey}-${randomCode}`;
      localStorage.setItem(`edu_cert_id_${courseId}`, newId);
      return newId;
    } catch {
      return "EDU-2026-PLATFORM-89F12";
    }
  });
  const [copiedCertLink, setCopiedCertLink] = useState(false);

  // Video Player instance for interactive seeking
  const [ytPlayer, setYtPlayer] = useState(null);

  // Q&A Community State
  const [qaQuestions, setQaQuestions] = useState(() => {
    const defaultQA = [
      {
        id: "qa-1",
        lessonId: "default-lec",
        lessonTitle: "Core Architectural Foundations",
        author: "Elena Rostova",
        authorInitial: "E",
        date: "2 days ago",
        timestamp: "03:15",
        title: "Best practice for state isolation vs global stores in large modules?",
        body: "When designing modular applications, at what point should state be elevated to a global store versus kept local to component hierarchies?",
        upvotes: 16,
        hasUpvoted: false,
        replies: [
          {
            id: "rep-1",
            author: "EduPlatform Faculty",
            isInstructor: true,
            date: "1 day ago",
            text: "Rule of thumb: keep state co-located as close as possible to the consumers. Only promote state to global contexts when two distant sibling trees need synchronized access without prop drilling.",
            upvotes: 11,
          },
        ],
      },
      {
        id: "qa-2",
        lessonId: "default-lec",
        lessonTitle: "Core Architectural Foundations",
        author: "Marcus Vance",
        authorInitial: "M",
        date: "Yesterday",
        timestamp: "06:40",
        title: "Handling network latency and optimistic mutations gracefully?",
        body: "In video timestamp 06:40, what is the best strategy if an optimistic update fails on the server after UI already updated?",
        upvotes: 9,
        hasUpvoted: false,
        replies: [
          {
            id: "rep-2",
            author: "Senior Architect",
            isInstructor: true,
            date: "14 hours ago",
            text: "Always snapshot previous state before applying the optimistic mutation. In your catch/rollback handler, revert immediately to the snapshot and flash a non-intrusive retry toast.",
            upvotes: 7,
          },
        ],
      },
    ];

    try {
      const saved = localStorage.getItem(`edu_qa_${courseId}`);
      return saved ? JSON.parse(saved) : defaultQA;
    } catch {
      return defaultQA;
    }
  });

  const [qaFilter, setQaFilter] = useState("all");
  const [qaSearch, setQaSearch] = useState("");
  const [isAskingQuestion, setIsAskingQuestion] = useState(false);
  const [newQuestionTitle, setNewQuestionTitle] = useState("");
  const [newQuestionBody, setNewQuestionBody] = useState("");
  const [newQuestionTimestamp, setNewQuestionTimestamp] = useState("");
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem(`edu_qa_${courseId}`, JSON.stringify(qaQuestions));
    } catch {
      // ignore
    }
  }, [courseId, qaQuestions]);

  const handleSeekToTimestamp = (timeStr) => {
    if (!timeStr || !ytPlayer) return;
    const parts = timeStr.split(":").map(Number);
    let seconds = 0;
    if (parts.length === 2) {
      seconds = parts[0] * 60 + parts[1];
    } else if (parts.length === 3) {
      seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
    }
    try {
      ytPlayer.seekTo(seconds, true);
      ytPlayer.playVideo();
    } catch {
      // ignore
    }
  };

  const handleCaptureCurrentTime = () => {
    if (!ytPlayer || !ytPlayer.getCurrentTime) {
      setNewQuestionTimestamp("02:15");
      return;
    }
    try {
      const sec = Math.floor(ytPlayer.getCurrentTime());
      const m = Math.floor(sec / 60);
      const s = Math.floor(sec % 60);
      setNewQuestionTimestamp(`${m}:${s.toString().padStart(2, "0")}`);
    } catch {
      setNewQuestionTimestamp("01:30");
    }
  };

  const handleUpvoteQuestion = (qId) => {
    setQaQuestions((prev) =>
      prev.map((q) => {
        if (q.id === qId) {
          const hasUpvoted = !q.hasUpvoted;
          return {
            ...q,
            hasUpvoted,
            upvotes: hasUpvoted ? q.upvotes + 1 : q.upvotes - 1,
          };
        }
        return q;
      })
    );
  };

  const handlePostQuestion = (e) => {
    e.preventDefault();
    if (!newQuestionTitle.trim() || !newQuestionBody.trim()) return;

    const newQ = {
      id: `qa-${Date.now()}`,
      lessonId: currentLesson?._id,
      lessonTitle: currentLesson?.title,
      author: userProfile?.username || userProfile?.name || "Fellow Learner",
      authorInitial: (userProfile?.username || "You")[0].toUpperCase(),
      date: "Just now",
      timestamp: newQuestionTimestamp.trim() || null,
      title: newQuestionTitle.trim(),
      body: newQuestionBody.trim(),
      upvotes: 1,
      hasUpvoted: true,
      replies: [],
    };

    setQaQuestions((prev) => [newQ, ...prev]);
    setNewQuestionTitle("");
    setNewQuestionBody("");
    setNewQuestionTimestamp("");
    setIsAskingQuestion(false);
  };

  const handlePostReply = (qId) => {
    if (!replyText.trim()) return;

    const newReply = {
      id: `rep-${Date.now()}`,
      author: userProfile?.username || userProfile?.name || "Student Peer",
      isInstructor: false,
      date: "Just now",
      text: replyText.trim(),
      upvotes: 0,
    };

    setQaQuestions((prev) =>
      prev.map((q) => {
        if (q.id === qId) {
          return {
            ...q,
            replies: [...(q.replies || []), newReply],
          };
        }
        return q;
      })
    );

    setReplyText("");
    setActiveReplyId(null);
  };

  const filteredQuestions = useMemo(() => {
    return qaQuestions.filter((q) => {
      const matchesLecture =
        qaFilter === "all" || q.lessonId === currentLesson?._id;
      const matchesSearch =
        !qaSearch.trim() ||
        q.title.toLowerCase().includes(qaSearch.toLowerCase()) ||
        q.body.toLowerCase().includes(qaSearch.toLowerCase());
      return matchesLecture && matchesSearch;
    });
  }, [qaQuestions, qaFilter, qaSearch, currentLesson?._id]);

  const handleAddToLinkedIn = () => {
    const orgName = "EduPlatform";
    const certName = course?.title || "Professional Specialization";
    const certUrl = window.location.href;
    const issueYear = new Date().getFullYear();
    const issueMonth = new Date().getMonth() + 1;

    const linkedInUrl = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(
      certName
    )}&organizationName=${encodeURIComponent(
      orgName
    )}&issueYear=${issueYear}&issueMonth=${issueMonth}&certUrl=${encodeURIComponent(
      certUrl
    )}&certId=${encodeURIComponent(certCredentialId)}`;

    window.open(linkedInUrl, "_blank", "noopener,noreferrer");
  };

  const handleCopyVerificationLink = () => {
    const url = `${window.location.origin}/courses/${courseId}?verified=true&certId=${certCredentialId}`;
    navigator.clipboard.writeText(url);
    setCopiedCertLink(true);
    setTimeout(() => setCopiedCertLink(false), 3000);
  };

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

  // Save Quiz History & XP
  useEffect(() => {
    try {
      localStorage.setItem(`edu_quiz_${courseId}`, JSON.stringify(quizHistory));
    } catch {
      // ignore
    }
  }, [courseId, quizHistory]);

  useEffect(() => {
    try {
      localStorage.setItem(`edu_xp_${courseId}`, courseXP.toString());
    } catch {
      // ignore
    }
  }, [courseId, courseXP]);

  // Reset quiz answers when module switches if not submitted
  useEffect(() => {
    if (!quizHistory[currentModuleIndex]?.passed) {
      setQuizAnswers({});
      setIsQuizSubmitted(false);
    }
  }, [currentModuleIndex, quizHistory]);

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

  const currentModule =
    (modules && modules[currentModuleIndex]) ||
    (modules && modules[0]) || {
      title: "1. Foundations & Architecture",
      lessons: [],
    };
  const currentLessonsList = currentModule?.lessons || [];
  const currentLesson =
    currentLessonsList[currentLessonIndex] ||
    currentLessonsList[0] || {
      _id: "default-lec",
      title: "Course Overview & Learning Strategy",
      type: "video",
      description: "Welcome to EduPlatform. Follow along with our project repositories.",
      content: {
        youtubeId: "SqcY0GlETPk",
        videoUrl: "https://www.youtube.com/watch?v=SqcY0GlETPk",
        textContent: "Welcome to EduPlatform. Follow along with our curriculum.",
      },
    };

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

  // ─── SMART STUDY PLANNER & CALENDAR STATE ────────────────────────────
  const [showPlannerModal, setShowPlannerModal] = useState(false);
  const [plannerSavedToast, setPlannerSavedToast] = useState(false);
  const [plannerSettings, setPlannerSettings] = useState(() => {
    const defaultSettings = {
      weeklyHours: 3,
      preferredDays: ["Mon", "Wed", "Fri"],
      preferredTime: "19:00",
      streakDays: 3,
    };
    try {
      const saved = localStorage.getItem(`edu_planner_${courseId}`);
      return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  const remainingLessonsCount = Math.max(0, totalLessonsCount - completedLessonsCount);
  const estimatedRemainingHours = useMemo(() => {
    if (remainingLessonsCount === 0) return 0;
    return Math.max(0.5, Math.round(remainingLessonsCount * 0.35 * 10) / 10);
  }, [remainingLessonsCount]);

  const projectedGraduationInfo = useMemo(() => {
    if (remainingLessonsCount === 0) {
      return {
        completed: true,
        text: "Curriculum 100% Completed!",
        dateStr: "Course Finished",
        weeksFormatted: "Completed!",
        weeks: 0,
      };
    }
    const weeklyH = plannerSettings.weeklyHours || 3;
    const weeks = Math.max(0.2, estimatedRemainingHours / weeklyH);
    const days = Math.ceil(weeks * 7);
    const targetDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    const dateStr = targetDate.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const weeksFormatted = weeks < 1 ? "Less than 1 week" : `~${Math.round(weeks)} week${Math.round(weeks) > 1 ? "s" : ""}`;

    return {
      completed: false,
      dateStr,
      weeksFormatted,
      days,
      weeks,
    };
  }, [remainingLessonsCount, estimatedRemainingHours, plannerSettings.weeklyHours]);

  const daysPerWeek = plannerSettings.preferredDays?.length || 1;
  const minutesPerSession = Math.round(((plannerSettings.weeklyHours || 3) * 60) / Math.max(1, daysPerWeek));

  const handleUpdatePlanner = (key, value) => {
    setPlannerSettings((prev) => {
      const next = { ...prev, [key]: value };
      try {
        localStorage.setItem(`edu_planner_${courseId}`, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const handleTogglePlannerDay = (day) => {
    const current = plannerSettings.preferredDays || [];
    let updated;
    if (current.includes(day)) {
      if (current.length <= 1) return;
      updated = current.filter((d) => d !== day);
    } else {
      updated = [...current, day];
    }
    handleUpdatePlanner("preferredDays", updated);
  };

  const handleSavePlanner = (e) => {
    if (e) e.preventDefault();
    try {
      localStorage.setItem(`edu_planner_${courseId}`, JSON.stringify(plannerSettings));
    } catch {
      // ignore
    }
    setPlannerSavedToast(true);
    setTimeout(() => setPlannerSavedToast(false), 3000);
  };

  const handleAddToGoogleCalendar = () => {
    const title = `Study: ${course?.title || "EduPlatform Course"}`;
    const details = `Dedicated EduPlatform study session for "${course?.title}".\nTarget Completion: ${projectedGraduationInfo.dateStr}\nRemaining lessons: ${remainingLessonsCount}\nClassroom: ${window.location.href}`;
    const location = "EduPlatform Virtual Classroom";

    const now = new Date();
    const [hours, minutes] = (plannerSettings.preferredTime || "19:00").split(":").map(Number);
    const startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, hours || 19, minutes || 0);
    const endTime = new Date(startTime.getTime() + minutesPerSession * 60 * 1000);

    const pad = (n) => String(n).padStart(2, "0");
    const formatGCal = (d) =>
      `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;

    const startStr = formatGCal(startTime);
    const endStr = formatGCal(endTime);

    const dayMap = { Mon: "MO", Tue: "TU", Wed: "WE", Thu: "TH", Fri: "FR", Sat: "SA", Sun: "SU" };
    const rruleDays = (plannerSettings.preferredDays || []).map((d) => dayMap[d]).filter(Boolean).join(",");
    const recurRule = rruleDays ? `RRULE:FREQ=WEEKLY;BYDAY=${rruleDays}` : "RRULE:FREQ=WEEKLY";

    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      title
    )}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(
      location
    )}&dates=${startStr}/${endStr}&recur=${encodeURIComponent(recurRule)}`;

    window.open(gcalUrl, "_blank", "noopener,noreferrer");
  };

  const handleDownloadIcs = () => {
    const title = `EduPlatform Study: ${course?.title || "Course"}`;
    const description = `Dedicated EduPlatform study session.\\nTarget Completion: ${projectedGraduationInfo.dateStr}\\nCourse: ${course?.title}\\nClassroom URL: ${window.location.href}`;
    const location = "EduPlatform Virtual Classroom";

    const now = new Date();
    const [hours, minutes] = (plannerSettings.preferredTime || "19:00").split(":").map(Number);
    const startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, hours || 19, minutes || 0);
    const endTime = new Date(startTime.getTime() + minutesPerSession * 60 * 1000);

    const pad = (n) => String(n).padStart(2, "0");
    const formatIcs = (d) =>
      `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;

    const dayMap = { Mon: "MO", Tue: "TU", Wed: "WE", Thu: "TH", Fri: "FR", Sat: "SA", Sun: "SU" };
    const rruleDays = (plannerSettings.preferredDays || []).map((d) => dayMap[d]).filter(Boolean).join(",");
    const rruleClause = rruleDays ? `RRULE:FREQ=WEEKLY;BYDAY=${rruleDays}` : "RRULE:FREQ=WEEKLY";

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//EduPlatform//Smart Study Planner//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      `UID:edu-study-${courseId}-${Date.now()}@eduplatform.com`,
      `DTSTAMP:${formatIcs(new Date())}`,
      `DTSTART:${formatIcs(startTime)}`,
      `DTEND:${formatIcs(endTime)}`,
      rruleClause,
      `SUMMARY:${title}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${location}`,
      "STATUS:CONFIRMED",
      "BEGIN:VALARM",
      "TRIGGER:-PT15M",
      "ACTION:DISPLAY",
      "DESCRIPTION:EduPlatform Learning Session in 15 minutes",
      "END:VALARM",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `study-schedule-${(course?.title || "course").slice(0, 18).toLowerCase().replace(/[^a-z0-9]/g, "-")}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleLessonSelect = (modIdx, lesIdx) => {
    setCurrentModuleIndex(modIdx);
    setCurrentLessonIndex(lesIdx);
  };

  const toggleLessonCompletion = (lessonId) => {
    if (!lessonId) return;
    setProgress((prev) => ({
      ...prev,
      [lessonId]: {
        completed: !prev[lessonId]?.completed,
        completedAt: new Date(),
      },
    }));
  };

  const handleNextLesson = () => {
    const lessons = currentModule?.lessons || [];
    if (currentLessonIndex < lessons.length - 1) {
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
      const prevLessons = modules[currentModuleIndex - 1]?.lessons || [];
      setCurrentModuleIndex(currentModuleIndex - 1);
      setCurrentLessonIndex(Math.max(0, prevLessons.length - 1));
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

  // Module Quiz Logic
  const currentQuizQuestions = useMemo(() => {
    return getModuleQuiz(
      course?.title,
      course?.category,
      currentModule?.title,
      currentModuleIndex
    );
  }, [course?.title, course?.category, currentModule?.title, currentModuleIndex]);

  const handleSelectQuizOption = (questionId, optionIndex) => {
    if (isQuizSubmitted) return;
    setQuizAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleSubmitQuiz = () => {
    if (Object.keys(quizAnswers).length < currentQuizQuestions.length) return;

    let correctCount = 0;
    currentQuizQuestions.forEach((q) => {
      if (quizAnswers[q.id] === q.correctIndex) {
        correctCount += 1;
      }
    });

    const percent = Math.round((correctCount / currentQuizQuestions.length) * 100);
    const passed = percent >= 75;

    setIsQuizSubmitted(true);

    const prevPassed = quizHistory[currentModuleIndex]?.passed;
    if (passed && !prevPassed) {
      setCourseXP((prev) => prev + 150);
    }

    setQuizHistory((prev) => ({
      ...prev,
      [currentModuleIndex]: {
        passed,
        score: correctCount,
        total: currentQuizQuestions.length,
        percentage: percent,
        date: new Date().toLocaleDateString(),
      },
    }));
  };

  const handleRetakeQuiz = () => {
    setQuizAnswers({});
    setIsQuizSubmitted(false);
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
          {/* Gamification XP Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-black shadow-2xs">
            <FaBolt className="text-amber-500 text-xs animate-pulse" />
            <span>{courseXP} XP</span>
          </div>

          <Link
            to={`/students-position/${courseId}`}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 text-xs font-bold transition shadow-xs"
            title="Class Leaderboard"
          >
            <FaAward className="text-amber-500" />
            <span>Leaderboard</span>
          </Link>

          {/* Smart Study Planner Button */}
          <button
            type="button"
            onClick={() => setShowPlannerModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 text-xs font-bold transition shadow-xs cursor-pointer"
            title="Smart Study Planner & Schedule"
          >
            <FaCalendarAlt className="text-purple-600 text-xs" />
            <span className="hidden sm:inline">Study Planner</span>
            <span className="sm:hidden">Plan</span>
          </button>

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
                onComplete={() => currentLesson?._id && toggleLessonCompletion(currentLesson._id)}
                onPlayerReady={(p) => setYtPlayer(p)}
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
              <div className="flex items-center border-b border-slate-200 px-4 sm:px-6 bg-slate-50/80 gap-4 sm:gap-6 overflow-x-auto">
                {[
                  { id: "overview", label: "Overview", icon: <FaBookOpen /> },
                  { id: "copilot", label: "AI Copilot", icon: <FaRobot />, badge: "AI" },
                  {
                    id: "quiz",
                    label: "Module Quiz",
                    icon: <FaClipboardCheck />,
                    badge: quizHistory[currentModuleIndex]?.passed ? "Passed" : "Quiz",
                    badgeColor: quizHistory[currentModuleIndex]?.passed
                      ? "bg-emerald-600 text-white"
                      : "bg-indigo-100 text-indigo-700",
                  },
                  { id: "resources", label: "Resources & Files", icon: <FaFolderOpen /> },
                  { id: "notes", label: "Notes", icon: <FaStickyNote /> },
                  { id: "qa", label: "Q&A Forum", icon: <FaQuestionCircle /> },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition whitespace-nowrap relative ${
                      activeTab === tab.id
                        ? "border-indigo-600 text-indigo-600"
                        : "border-transparent text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                    {tab.badge && (
                      <span
                        className={`text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase shadow-xs ${
                          tab.badgeColor || "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                        }`}
                      >
                        {tab.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Tab Body */}
              <div className="p-6">
                {activeTab === "overview" && (
                  <div className="space-y-5">
                    {/* Paced Study Habit Banner */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-purple-50/80 via-indigo-50/50 to-white border border-purple-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center text-lg flex-shrink-0 shadow-xs">
                          <FaCalendarAlt />
                        </div>
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-wider text-purple-700">
                            Paced Study Goal &bull; {plannerSettings.streakDays}-Day Streak 🔥
                          </div>
                          <div className="text-xs sm:text-sm font-bold text-slate-900">
                            Target Graduation: <span className="text-purple-700 font-extrabold">{projectedGraduationInfo.dateStr}</span> ({projectedGraduationInfo.weeksFormatted})
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowPlannerModal(true)}
                        className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5 self-start sm:self-auto cursor-pointer flex-shrink-0"
                      >
                        <FaCalendarPlus className="text-xs" />
                        <span>Adjust Pace &amp; Sync</span>
                      </button>
                    </div>

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

                {/* ─── MODULE KNOWLEDGE-CHECK QUIZ TAB ───────────────────── */}
                {activeTab === "quiz" && (
                  <div className="space-y-6">
                    {/* Quiz Billboard */}
                    <div className="p-6 bg-gradient-to-r from-indigo-50 via-slate-50 to-white rounded-2xl border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
                      <div>
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600">
                          <FaClipboardCheck />
                          <span>Knowledge Check &bull; Module {currentModuleIndex + 1}</span>
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mt-1">
                          {currentModule?.title || "Module Assessment"}
                        </h3>
                        <p className="text-slate-600 text-xs mt-1">
                          Answer all {currentQuizQuestions.length} questions. Score 75% or higher to earn +150 XP and mark this module verified.
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-center shadow-2xs">
                          <span className="text-[10px] uppercase font-bold text-slate-400">Award</span>
                          <div className="text-sm font-black text-amber-600 flex items-center justify-center gap-1">
                            <FaBolt className="text-amber-500 text-xs" />
                            <span>+150 XP</span>
                          </div>
                        </div>

                        {quizHistory[currentModuleIndex]?.passed && (
                          <div className="px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-center shadow-2xs">
                            <span className="text-[10px] uppercase font-bold text-emerald-600">Status</span>
                            <div className="text-sm font-black text-emerald-700 flex items-center justify-center gap-1">
                              <FaCheckCircle className="text-emerald-600 text-xs" />
                              <span>Passed</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Completion Alert Banner */}
                    {isQuizSubmitted && (
                      <div
                        className={`p-4 rounded-2xl border flex items-center justify-between gap-3 animate-fadeIn ${
                          quizHistory[currentModuleIndex]?.passed
                            ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                            : "bg-amber-50 border-amber-200 text-amber-900"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {quizHistory[currentModuleIndex]?.passed ? (
                            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-lg shadow-sm flex-shrink-0">
                              <FaTrophy />
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center text-lg shadow-sm flex-shrink-0">
                              <FaLightbulb />
                            </div>
                          )}
                          <div>
                            <h4 className="font-extrabold text-sm">
                              {quizHistory[currentModuleIndex]?.passed
                                ? "🎉 Outstanding! Module Knowledge-Check Passed"
                                : "Keep going! Review and try again"}
                            </h4>
                            <p className="text-xs mt-0.5 opacity-90">
                              {quizHistory[currentModuleIndex]?.passed
                                ? `You scored ${quizHistory[currentModuleIndex].score} of ${quizHistory[currentModuleIndex].total} (${quizHistory[currentModuleIndex].percentage}%). 150 XP added to your ranking!`
                                : `You scored ${quizHistory[currentModuleIndex]?.score || 0} of ${quizHistory[currentModuleIndex]?.total || currentQuizQuestions.length}. A score of 75% or higher is required to pass.`}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleRetakeQuiz}
                          className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold transition shadow-xs flex items-center gap-1.5 flex-shrink-0 cursor-pointer"
                        >
                          <FaRedo className="text-[10px]" />
                          <span>Retake Quiz</span>
                        </button>
                      </div>
                    )}

                    {/* Question Cards */}
                    <div className="space-y-6">
                      {currentQuizQuestions.map((q, qIdx) => {
                        const isAnswered = quizAnswers[q.id] !== undefined;
                        const selectedOpt = quizAnswers[q.id];
                        const isCorrectAnswer = selectedOpt === q.correctIndex;

                        return (
                          <div
                            key={q.id}
                            className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4 shadow-2xs"
                          >
                            <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
                              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                                Question {qIdx + 1} of {currentQuizQuestions.length}
                              </span>
                              {isQuizSubmitted && (
                                <span
                                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                                    isCorrectAnswer
                                      ? "bg-emerald-100 text-emerald-800"
                                      : "bg-rose-100 text-rose-800"
                                  }`}
                                >
                                  {isCorrectAnswer ? (
                                    <>
                                      <FaCheck className="text-[10px]" /> Correct
                                    </>
                                  ) : (
                                    <>
                                      <FaTimes className="text-[10px]" /> Incorrect
                                    </>
                                  )}
                                </span>
                              )}
                            </div>

                            <p className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                              {q.question}
                            </p>

                            {/* Options List */}
                            <div className="space-y-2.5">
                              {q.options.map((opt, optIdx) => {
                                const letters = ["A", "B", "C", "D"];
                                const isSelected = selectedOpt === optIdx;
                                const isRightChoice = optIdx === q.correctIndex;

                                let optClasses =
                                  "p-3.5 rounded-xl border text-xs sm:text-sm flex items-center justify-between transition cursor-pointer ";

                                if (!isQuizSubmitted) {
                                  if (isSelected) {
                                    optClasses += "border-indigo-600 bg-indigo-50/70 text-indigo-950 font-semibold ring-1 ring-indigo-600 shadow-2xs";
                                  } else {
                                    optClasses += "border-slate-200 bg-slate-50/40 hover:bg-slate-50 hover:border-slate-300 text-slate-700";
                                  }
                                } else {
                                  if (isRightChoice) {
                                    optClasses += "border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold";
                                  } else if (isSelected && !isRightChoice) {
                                    optClasses += "border-rose-500 bg-rose-50 text-rose-950 font-semibold";
                                  } else {
                                    optClasses += "border-slate-100 bg-slate-50/30 text-slate-400 opacity-60";
                                  }
                                }

                                return (
                                  <div
                                    key={optIdx}
                                    onClick={() => handleSelectQuizOption(q.id, optIdx)}
                                    className={optClasses}
                                  >
                                    <div className="flex items-center gap-3">
                                      <span
                                        className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                                          !isQuizSubmitted && isSelected
                                            ? "bg-indigo-600 text-white"
                                            : isQuizSubmitted && isRightChoice
                                            ? "bg-emerald-600 text-white"
                                            : isQuizSubmitted && isSelected && !isRightChoice
                                            ? "bg-rose-600 text-white"
                                            : "bg-slate-200 text-slate-600"
                                        }`}
                                      >
                                        {letters[optIdx]}
                                      </span>
                                      <span className="leading-snug">{opt}</span>
                                    </div>

                                    {isQuizSubmitted && isRightChoice && (
                                      <FaCheck className="text-emerald-600 text-xs flex-shrink-0 ml-2" />
                                    )}
                                    {isQuizSubmitted && isSelected && !isRightChoice && (
                                      <FaTimes className="text-rose-600 text-xs flex-shrink-0 ml-2" />
                                    )}
                                  </div>
                                );
                              })}
                            </div>

                            {/* Explanation Dropdown on Submit */}
                            {isQuizSubmitted && (
                              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed space-y-1">
                                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                  <FaLightbulb className="text-amber-500" />
                                  <span>Explanation:</span>
                                </div>
                                <p>{q.explanation}</p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Quiz Submit Bar */}
                    {!isQuizSubmitted ? (
                      <div className="p-5 bg-white border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                        <div className="text-xs text-slate-500 font-medium">
                          Answered <strong className="text-indigo-600 font-bold">{Object.keys(quizAnswers).length}</strong> of{" "}
                          <strong className="text-slate-800">{currentQuizQuestions.length}</strong> questions
                        </div>
                        <button
                          type="button"
                          disabled={Object.keys(quizAnswers).length < currentQuizQuestions.length}
                          onClick={handleSubmitQuiz}
                          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-indigo-600/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                        >
                          <FaClipboardCheck />
                          <span>Submit Quiz Answers</span>
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-end gap-3">
                        <button
                          type="button"
                          onClick={handleRetakeQuiz}
                          className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold transition shadow-xs flex items-center gap-2 cursor-pointer"
                        >
                          <FaRedo className="text-xs" />
                          <span>Retake Module Quiz</span>
                        </button>
                        {quizHistory[currentModuleIndex]?.passed && currentModuleIndex < modules.length - 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              setCurrentModuleIndex(currentModuleIndex + 1);
                              setCurrentLessonIndex(0);
                              setActiveTab("overview");
                            }}
                            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-md shadow-indigo-600/20 flex items-center gap-2 cursor-pointer"
                          >
                            <span>Advance to Next Module</span>
                            <FaStepForward className="text-[10px]" />
                          </button>
                        )}
                      </div>
                    )}
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

                {/* ─── COMMUNITY Q&A DISCUSSION FORUM ───────────────────── */}
                {activeTab === "qa" && (
                  <div className="space-y-6">
                    {/* Q&A Header & Filter Toolbar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <FaSearch className="text-slate-400 text-xs absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={qaSearch}
                            onChange={(e) => setQaSearch(e.target.value)}
                            placeholder="Search questions in this course..."
                            className="pl-8 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-600 w-52 sm:w-64"
                          />
                        </div>

                        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
                          <button
                            type="button"
                            onClick={() => setQaFilter("all")}
                            className={`px-3 py-1 rounded-lg transition ${
                              qaFilter === "all"
                                ? "bg-white text-indigo-700 shadow-2xs font-bold"
                                : "text-slate-600 hover:text-slate-900"
                            }`}
                          >
                            All Questions
                          </button>
                          <button
                            type="button"
                            onClick={() => setQaFilter("current")}
                            className={`px-3 py-1 rounded-lg transition ${
                              qaFilter === "current"
                                ? "bg-white text-indigo-700 shadow-2xs font-bold"
                                : "text-slate-600 hover:text-slate-900"
                            }`}
                          >
                            This Lecture
                          </button>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsAskingQuestion(!isAskingQuestion)}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto"
                      >
                        <FaQuestionCircle className="text-xs" />
                        <span>{isAskingQuestion ? "Cancel" : "Ask a New Question"}</span>
                      </button>
                    </div>

                    {/* Ask Question Drawer */}
                    {isAskingQuestion && (
                      <form
                        onSubmit={handlePostQuestion}
                        className="p-5 bg-indigo-50/50 border border-indigo-100 rounded-2xl space-y-3 animate-fadeIn shadow-2xs"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-black uppercase tracking-wider text-indigo-900">
                            Post to Lecture Discussion
                          </h4>
                          <button
                            type="button"
                            onClick={handleCaptureCurrentTime}
                            className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-indigo-200 transition cursor-pointer"
                            title="Stamp current video time"
                          >
                            <FaClock className="text-[10px]" />
                            <span>Stamp Current Video Time</span>
                          </button>
                        </div>

                        <input
                          type="text"
                          required
                          value={newQuestionTitle}
                          onChange={(e) => setNewQuestionTitle(e.target.value)}
                          placeholder="What is your question? (e.g. Why did we use useMemo here?)"
                          className="w-full bg-white border border-slate-200 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-indigo-600"
                        />

                        <div className="flex gap-2">
                          <textarea
                            required
                            rows={3}
                            value={newQuestionBody}
                            onChange={(e) => setNewQuestionBody(e.target.value)}
                            placeholder="Provide any details, expected behavior, or error messages..."
                            className="flex-1 bg-white border border-slate-200 p-3 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                          />
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-500 font-medium">Timestamp:</span>
                            <input
                              type="text"
                              value={newQuestionTimestamp}
                              onChange={(e) => setNewQuestionTimestamp(e.target.value)}
                              placeholder="e.g. 03:45 (optional)"
                              className="bg-white border border-slate-200 px-2.5 py-1 rounded-lg text-xs w-32 font-mono text-indigo-700"
                            />
                          </div>

                          <button
                            type="submit"
                            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer"
                          >
                            Publish Question
                          </button>
                        </div>
                      </form>
                    )}

                    {/* Questions Stream */}
                    <div className="space-y-4">
                      {filteredQuestions.length === 0 ? (
                        <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                          <p className="text-sm font-bold text-slate-700">No questions found matching your search</p>
                          <p className="text-xs text-slate-500">Be the first to ask a question for this lesson!</p>
                        </div>
                      ) : (
                        filteredQuestions.map((q) => (
                          <div
                            key={q.id}
                            className="p-5 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-3"
                          >
                            {/* Question Header */}
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                                  {q.authorInitial || q.author[0]}
                                </div>
                                <div>
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className="font-bold text-xs text-slate-900">{q.author}</span>
                                    <span className="text-[10px] text-slate-400">&bull; {q.date}</span>
                                    {q.timestamp && (
                                      <button
                                        type="button"
                                        onClick={() => handleSeekToTimestamp(q.timestamp)}
                                        className="text-[10px] font-mono font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded border border-indigo-200 transition flex items-center gap-1 cursor-pointer"
                                        title={`Jump video to ${q.timestamp}`}
                                      >
                                        <FaPlay className="text-[7px]" />
                                        <span>{q.timestamp}</span>
                                      </button>
                                    )}
                                  </div>
                                  <h4 className="font-bold text-sm text-slate-900 mt-1">{q.title}</h4>
                                </div>
                              </div>

                              {/* Upvote Button */}
                              <button
                                type="button"
                                onClick={() => handleUpvoteQuestion(q.id)}
                                className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                                  q.hasUpvoted
                                    ? "bg-indigo-50 border-indigo-300 text-indigo-700"
                                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                                }`}
                              >
                                <FaThumbsUp className="text-[10px]" />
                                <span>{q.upvotes}</span>
                              </button>
                            </div>

                            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pl-11">
                              {q.body}
                            </p>

                            {/* Replies Thread */}
                            {q.replies && q.replies.length > 0 && (
                              <div className="pl-11 space-y-2.5 pt-2 border-t border-slate-100">
                                {q.replies.map((rep) => (
                                  <div
                                    key={rep.id}
                                    className={`p-3.5 rounded-xl text-xs space-y-1.5 border ${
                                      rep.isInstructor
                                        ? "bg-indigo-50/70 border-indigo-200 text-indigo-950"
                                        : "bg-slate-50 border-slate-200 text-slate-800"
                                    }`}
                                  >
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <span className="font-bold text-slate-900">{rep.author}</span>
                                        {rep.isInstructor && (
                                          <span className="text-[9px] font-black uppercase px-1.5 py-0.2 bg-indigo-600 text-white rounded">
                                            Instructor
                                          </span>
                                        )}
                                        <span className="text-[10px] text-slate-400">&bull; {rep.date}</span>
                                      </div>
                                    </div>
                                    <p className="leading-relaxed">{rep.text}</p>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Reply Input Box */}
                            <div className="pl-11 pt-1 flex items-center gap-2">
                              {activeReplyId === q.id ? (
                                <div className="flex-1 flex gap-2">
                                  <input
                                    type="text"
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    placeholder="Write a helpful response..."
                                    className="flex-1 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handlePostReply(q.id)}
                                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition cursor-pointer"
                                  >
                                    Post
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setActiveReplyId(null)}
                                    className="px-2 py-1.5 text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setActiveReplyId(q.id)}
                                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition cursor-pointer"
                                >
                                  <FaReply className="text-[10px]" />
                                  <span>Reply to thread</span>
                                </button>
                              )}
                            </div>
                          </div>
                        ))
                      )}
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

                  {/* Module Knowledge Quiz Trigger */}
                  <div className="p-2.5 bg-slate-50/70 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentModuleIndex(mIdx);
                        setActiveTab("quiz");
                      }}
                      className={`w-full py-1.5 px-2.5 rounded-xl text-[11px] font-bold flex items-center justify-between transition cursor-pointer ${
                        quizHistory[mIdx]?.passed
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          : "bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 shadow-2xs"
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <FaClipboardCheck
                          className={quizHistory[mIdx]?.passed ? "text-emerald-600" : "text-slate-400"}
                        />
                        <span>{quizHistory[mIdx]?.passed ? "Quiz Passed" : "Take Module Quiz"}</span>
                      </span>
                      <span
                        className={`text-[10px] font-black ${
                          quizHistory[mIdx]?.passed ? "text-emerald-700" : "text-indigo-600"
                        }`}
                      >
                        {quizHistory[mIdx]?.passed
                          ? `✓ ${quizHistory[mIdx].score}/${quizHistory[mIdx].total}`
                          : "+150 XP"}
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        )}
      </div>

      {/* ─── CERTIFICATE OF COMPLETION MODAL (VERIFIABLE CREDENTIAL) ─── */}
      {showCertificateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-3xl w-full p-2 sm:p-3 shadow-2xl relative space-y-4 animate-fadeIn my-auto">
            {/* Modal Close Button */}
            <button
              onClick={() => setShowCertificateModal(false)}
              className="absolute top-4 right-4 z-20 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 transition cursor-pointer"
              title="Close Certificate"
            >
              <FaTimes />
            </button>

            {/* Print-Ready Certificate Card */}
            <div
              id="printable-certificate"
              className="relative p-6 sm:p-10 rounded-2xl bg-gradient-to-b from-[#fdfbf7] via-white to-[#faf7f0] border-4 border-amber-400/80 text-center shadow-inner overflow-hidden"
            >
              {/* Decorative Corner Borders */}
              <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-amber-500 pointer-events-none" />
              <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-amber-500 pointer-events-none" />
              <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-amber-500 pointer-events-none" />
              <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-amber-500 pointer-events-none" />

              {/* Watermark Crest */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-4">
                <FaGraduationCap className="text-[320px] text-indigo-950" />
              </div>

              {/* Header Crest */}
              <div className="space-y-1.5 relative z-10">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-amber-600 text-white flex items-center justify-center text-xl shadow-md">
                    <FaAward />
                  </div>
                  <span className="text-[11px] font-black tracking-widest uppercase text-slate-700">
                    EduPlatform Academic Standards
                  </span>
                </div>
                <div className="text-[10px] font-bold tracking-widest text-indigo-600 uppercase">
                  Verified International Digital Credential
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 tracking-wide mt-2">
                  CERTIFICATE OF COMPLETION
                </h2>
                <p className="text-[11px] text-slate-500 font-medium">
                  This official credential is documented and registered in good standing
                </p>
              </div>

              {/* Recipient & Course Details */}
              <div className="my-6 sm:my-8 space-y-2 relative z-10">
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                  This is proudly presented to
                </p>
                <h3 className="text-2xl sm:text-4xl font-serif font-bold text-slate-950 tracking-tight underline decoration-amber-400 decoration-2 underline-offset-8">
                  {userProfile?.username || userProfile?.name || "Distinguished Scholar"}
                </h3>
                <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed pt-2">
                  for successfully demonstrating professional competency, completing all interactive modules,
                  quizzes, and technical assignments in
                </p>
                <h4 className="text-base sm:text-lg font-bold text-indigo-900 max-w-xl mx-auto py-1">
                  {course.title}
                </h4>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-bold">
                  <span>Honors Standing</span>
                  <span>&bull;</span>
                  <span>100% Curriculum Completed</span>
                </div>
              </div>

              {/* Footer Signatures & QR Verification Strip */}
              <div className="pt-6 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-3 items-center gap-4 relative z-10">
                {/* Instructor Signature */}
                <div className="text-center sm:text-left space-y-1">
                  <div className="font-serif italic text-lg sm:text-xl font-bold text-slate-800 tracking-wide">
                    {course.instructor || course.user?.username || "EduPlatform Faculty"}
                  </div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider border-t border-slate-300 pt-1">
                    Course Instructor &bull; Evaluator
                  </div>
                </div>

                {/* QR Code & Credential Stamp */}
                <div className="flex flex-col items-center justify-center space-y-1">
                  <VerifiableQrCode size={56} certId={certCredentialId} />
                  <span className="text-[9px] font-black uppercase text-indigo-700 tracking-wider">
                    {certCredentialId}
                  </span>
                  <span className="text-[9px] text-slate-400">Scan to Verify</span>
                </div>

                {/* Director Signature & Date */}
                <div className="text-center sm:text-right space-y-1">
                  <div className="font-serif italic text-lg sm:text-xl font-bold text-slate-800 tracking-wide">
                    Dr. Sarah Vance, Ph.D.
                  </div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider border-t border-slate-300 pt-1">
                    Dean of Academic Affairs
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Issued: {new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons Strip */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleAddToLinkedIn}
                  className="px-4 py-2.5 rounded-xl bg-[#0a66c2] hover:bg-[#004182] text-white text-xs font-bold transition flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  <FaLinkedin className="text-sm" />
                  <span>Add to LinkedIn Profile</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyVerificationLink}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 text-xs font-bold transition flex items-center gap-2 cursor-pointer"
                >
                  <FaExternalLinkAlt className="text-[10px]" />
                  <span>{copiedCertLink ? "Copied Link!" : "Copy Verification URL"}</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center gap-2 shadow-md shadow-indigo-600/30 cursor-pointer"
                >
                  <FaPrint className="text-xs" />
                  <span>Print / PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowCertificateModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-bold transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── 5. SMART STUDY PLANNER MODAL ─────────────────────────────── */}
      {showPlannerModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-2xl space-y-6 my-auto animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-purple-500/20 border border-purple-500/30 text-purple-400 flex items-center justify-center text-xl shadow-inner">
                  <FaCalendarAlt />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                    <span>Smart Study Planner</span>
                    <span className="px-2 py-0.5 rounded-md bg-purple-500/20 border border-purple-500/40 text-purple-300 text-[10px] font-bold uppercase tracking-wider">
                      Goal Sync
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">
                    Personalized pacing, projected graduation date, and 1-click calendar sync
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPlannerModal(false)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
                title="Close Planner"
              >
                <FaTimes />
              </button>
            </div>

            {/* Streak & Momentum Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-transparent border border-amber-500/30 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-lg">
                  <FaFire className="animate-bounce" />
                </div>
                <div>
                  <div className="text-xs font-black text-amber-300">
                    {plannerSettings.streakDays}-Day Learning Streak Active!
                  </div>
                  <div className="text-[11px] text-slate-300">
                    Studying consistently increases graduation rates by 3.8x.
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-bold text-amber-400 bg-amber-500/20 px-2.5 py-1 rounded-lg border border-amber-500/30">
                  +50 Streak XP
                </span>
              </div>
            </div>

            {/* Projection Billboard */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-center space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Target Graduation
                </div>
                <div className="text-sm sm:text-base font-black text-purple-400">
                  {projectedGraduationInfo.dateStr}
                </div>
                <div className="text-[11px] text-slate-400 font-medium">
                  {projectedGraduationInfo.weeksFormatted}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-center space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Remaining Content
                </div>
                <div className="text-base sm:text-lg font-black text-emerald-400">
                  {estimatedRemainingHours} Hours
                </div>
                <div className="text-[11px] text-slate-400 font-medium">
                  {remainingLessonsCount} lessons left
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-center space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Session Commitment
                </div>
                <div className="text-base sm:text-lg font-black text-amber-400">
                  ~{minutesPerSession} mins
                </div>
                <div className="text-[11px] text-slate-400 font-medium">
                  per study day
                </div>
              </div>
            </div>

            {/* Weekly Pace Selector */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-200">
                  Weekly Study Commitment
                </label>
                <span className="text-xs font-black text-purple-400 bg-purple-500/20 px-2.5 py-0.5 rounded-lg border border-purple-500/30">
                  {plannerSettings.weeklyHours} hours / week
                </span>
              </div>

              {/* Preset Pace Chips */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "Steady", hours: 1.5, desc: "Relaxed pace" },
                  { label: "Balanced", hours: 3, desc: "Recommended" },
                  { label: "Sprint", hours: 6, desc: "Fast completion" },
                ].map((preset) => {
                  const isSelected = plannerSettings.weeklyHours === preset.hours;
                  return (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => handleUpdatePlanner("weeklyHours", preset.hours)}
                      className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                        isSelected
                          ? "bg-purple-600/30 border-purple-500 text-white shadow-sm"
                          : "bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span>{preset.label}</span>
                        <span className="text-[11px] opacity-80">{preset.hours}h/wk</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{preset.desc}</div>
                    </button>
                  );
                })}
              </div>

              {/* Custom Slider */}
              <div className="pt-2">
                <input
                  type="range"
                  min="1"
                  max="12"
                  step="0.5"
                  value={plannerSettings.weeklyHours}
                  onChange={(e) => handleUpdatePlanner("weeklyHours", parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-medium px-1 mt-1">
                  <span>1 hr/wk</span>
                  <span>4 hrs/wk</span>
                  <span>8 hrs/wk</span>
                  <span>12 hrs/wk</span>
                </div>
              </div>
            </div>

            {/* Study Days & Preferred Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {/* Preferred Days */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-200">
                  Target Study Days
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => {
                    const isSelected = plannerSettings.preferredDays?.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => handleTogglePlannerDay(day)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                          isSelected
                            ? "bg-purple-600 text-white shadow-xs"
                            : "bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700"
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Reminder Time */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <FaBell className="text-purple-400 text-xs" />
                  <span>Session Reminder Time</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    value={plannerSettings.preferredTime || "19:00"}
                    onChange={(e) => handleUpdatePlanner("preferredTime", e.target.value)}
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-purple-500"
                  />
                  <button
                    type="button"
                    onClick={handleSavePlanner}
                    className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition cursor-pointer flex-shrink-0"
                  >
                    {plannerSavedToast ? "Saved!" : "Save"}
                  </button>
                </div>
              </div>
            </div>

            {/* Calendar Export & Sync Actions Strip */}
            <div className="border-t border-slate-800 pt-5 space-y-3">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Sync with your calendar app
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleAddToGoogleCalendar}
                  className="px-4 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center justify-center gap-2.5 shadow-lg shadow-blue-600/20 cursor-pointer"
                >
                  <FaCalendarPlus className="text-sm" />
                  <span>Add to Google Calendar</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadIcs}
                  className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white text-xs font-bold transition flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  <FaDownload className="text-xs" />
                  <span>Download .ics (Apple / Outlook)</span>
                </button>
              </div>

              {plannerSavedToast && (
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold text-center animate-in fade-in duration-150">
                  ✓ Study plan and calendar preferences updated successfully!
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
