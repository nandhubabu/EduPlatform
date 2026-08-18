import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  FaPlay,
  FaPause,
  FaBook,
  FaCheckCircle,
  FaClock,
  FaDownload,
  FaExpand,
  FaCompress,
  FaVolumeUp,
  FaVolumeOff,
  FaStepForward,
  FaStepBackward,
  FaList,
  FaStickyNote,
  FaGraduationCap
} from 'react-icons/fa';
import { getCourseById } from '../../services/courseService';
import AlertMessage from '../Alert/AlertMessage';

// YouTube Video Player Component
const YouTubePlayer = ({ videoId, onProgress, onComplete, initialTime = 0 }) => {
  const [player, setPlayer] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(initialTime);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    // Load YouTube IFrame API
    if (!window.YT) {
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      document.body.appendChild(script);

      window.onYouTubeIframeAPIReady = initializePlayer;
    } else {
      initializePlayer();
    }

    return () => {
      if (player) {
        player.destroy();
      }
    };
  }, [videoId]);

  const initializePlayer = () => {
    const newPlayer = new window.YT.Player('youtube-player', {
      height: '100%',
      width: '100%',
      videoId: videoId,
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
            startProgressTracking(event.target);
          } else if (event.data === window.YT.PlayerState.PAUSED) {
            setIsPlaying(false);
          } else if (event.data === window.YT.PlayerState.ENDED) {
            setIsPlaying(false);
            onComplete?.();
          }
        },
      },
    });
  };

  const startProgressTracking = (playerInstance) => {
    const trackProgress = () => {
      if (playerInstance && isPlaying) {
        const time = playerInstance.getCurrentTime();
        setCurrentTime(time);
        onProgress?.(time);
        
        // Continue tracking if still playing
        if (playerInstance.getPlayerState() === window.YT.PlayerState.PLAYING) {
          setTimeout(trackProgress, 1000);
        }
      }
    };
    trackProgress();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!videoId) {
    return (
      <div className="aspect-video bg-white/5 border border-white/5 rounded-xl flex items-center justify-center">
        <p className="text-slate-400">No video available</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="aspect-video bg-black rounded-xl overflow-hidden border border-white/10 shadow-2xl">
        <div id="youtube-player" className="w-full h-full"></div>
      </div>
      
      {/* Custom Progress Bar */}
      {isReady && duration > 0 && (
        <div className="mt-4 flex items-center space-x-3 text-sm text-slate-400">
          <span>{formatTime(currentTime)}</span>
          <div className="flex-1 bg-white/10 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-cyan-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            ></div>
          </div>
          <span>{formatTime(duration)}</span>
        </div>
      )}
    </div>
  );
};

// Text Content Viewer
const TextContentViewer = ({ content, title }) => {
  return (
    <div className="prose prose-invert max-w-none">
      <div className="bg-white/3 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-xl">
        <h2 className="text-2xl font-bold mb-4 text-white">{title}</h2>
        <div className="text-slate-300 leading-relaxed">
          {content.htmlContent ? (
            <div dangerouslySetInnerHTML={{ __html: content.htmlContent }} />
          ) : (
            <div className="whitespace-pre-wrap">{content.textContent}</div>
          )}
        </div>
        
        {content.notes && (
          <div className="mt-6 p-4 bg-purple-500/10 border-l-4 border-purple-500 rounded-r-xl border-t border-r border-b border-white/5">
            <h4 className="font-semibold text-purple-300 mb-2 flex items-center">
              <FaStickyNote className="mr-2 text-purple-400" />
              Notes
            </h4>
            <p className="text-slate-300">{content.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Course Sidebar with Module/Lesson Navigation
const CourseSidebar = ({ course, currentLesson, onLessonSelect, progress = {} }) => {
  const [expandedModules, setExpandedModules] = useState(new Set([0])); // First module expanded by default

  const toggleModule = (moduleIndex) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleIndex)) {
      newExpanded.delete(moduleIndex);
    } else {
      newExpanded.add(moduleIndex);
    }
    setExpandedModules(newExpanded);
  };

  const getLessonIcon = (lesson) => {
    if (progress[lesson._id]?.completed) {
      return <FaCheckCircle className="text-emerald-400 flex-shrink-0" />;
    }
    
    switch (lesson.type) {
      case 'video':
        return <FaPlay className="text-rose-400 flex-shrink-0" />;
      case 'text':
        return <FaBook className="text-cyan-400 flex-shrink-0" />;
      default:
        return <FaBook className="text-slate-400 flex-shrink-0" />;
    }
  };

  const getTotalLessons = () => {
    return course.modules?.reduce((total, module) => total + (module.lessons?.length || 0), 0) || 0;
  };

  const getCompletedLessons = () => {
    let completed = 0;
    course.modules?.forEach(module => {
      module.lessons?.forEach(lesson => {
        if (progress[lesson._id]?.completed) completed++;
      });
    });
    return completed;
  };

  return (
    <div className="bg-white/3 backdrop-blur-xl border border-white/5 rounded-2xl shadow-xl h-full overflow-hidden flex flex-col">
      <div className="p-5 border-b border-white/5">
        <h3 className="font-bold text-lg text-white flex items-center">
          <FaList className="mr-2 text-purple-400" />
          Course Content
        </h3>
        <div className="mt-2 text-sm text-slate-400">
          {getCompletedLessons()}/{getTotalLessons()} lessons completed
        </div>
        <div className="mt-3 w-full bg-white/10 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-purple-500 to-cyan-400 h-2 rounded-full transition-all duration-300"
            style={{ width: `${getTotalLessons() > 0 ? (getCompletedLessons() / getTotalLessons()) * 100 : 0}%` }}
          ></div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {course.modules?.map((module, moduleIndex) => (
          <div key={moduleIndex} className="border-b border-white/5">
            <button
              onClick={() => toggleModule(moduleIndex)}
              className="w-full p-4 text-left hover:bg-white/5 flex items-center justify-between transition duration-200"
            >
              <div>
                <h4 className="font-semibold text-white text-sm md:text-base">{module.title}</h4>
                <p className="text-xs text-slate-400 mt-1">
                  {module.lessons?.length || 0} lessons
                </p>
              </div>
              <FaStepForward 
                className={`transform transition-transform text-slate-400 ${
                  expandedModules.has(moduleIndex) ? 'rotate-90 text-purple-400' : ''
                }`} 
              />
            </button>

            {expandedModules.has(moduleIndex) && (
              <div className="pb-2 bg-[#090b11]/30">
                {module.lessons?.map((lesson, lessonIndex) => (
                  <button
                    key={lessonIndex}
                    onClick={() => onLessonSelect(moduleIndex, lessonIndex, lesson)}
                    className={`w-full p-3 pl-6 text-left hover:bg-white/5 flex items-center space-x-3 transition duration-200 ${
                      currentLesson?.title === lesson.title ? 'bg-purple-500/10 border-r-4 border-purple-500' : ''
                    }`}
                  >
                    {getLessonIcon(lesson)}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-200 text-sm truncate">{lesson.title}</p>
                      {lesson.content?.videoDuration && (
                        <p className="text-xs text-slate-400 flex items-center mt-1">
                          <FaClock className="mr-1 text-slate-500" />
                          {Math.ceil(lesson.content.videoDuration / 60)} min
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Main Course Player Component
const CoursePlayer = () => {
  const { courseId } = useParams();
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [progress, setProgress] = useState({});
  const [showSidebar, setShowSidebar] = useState(true);

  const { data: course, isLoading, error } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => getCourseById(courseId),
    enabled: !!courseId,
  });

  const currentLesson = course?.modules?.[currentModuleIndex]?.lessons?.[currentLessonIndex];

  const handleLessonSelect = (moduleIndex, lessonIndex, lesson) => {
    setCurrentModuleIndex(moduleIndex);
    setCurrentLessonIndex(lessonIndex);
  };

  const handleVideoProgress = (time) => {
    // Update video progress in state/database
    console.log(`Video progress: ${time} seconds`);
  };

  const handleLessonComplete = () => {
    if (currentLesson) {
      setProgress(prev => ({
        ...prev,
        [currentLesson._id]: { completed: true, completedAt: new Date() }
      }));
      
      // Auto-advance to next lesson
      const currentModule = course.modules[currentModuleIndex];
      if (currentLessonIndex < currentModule.lessons.length - 1) {
        setCurrentLessonIndex(currentLessonIndex + 1);
      } else if (currentModuleIndex < course.modules.length - 1) {
        setCurrentModuleIndex(currentModuleIndex + 1);
        setCurrentLessonIndex(0);
      }
    }
  };

  const extractYouTubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0d14] flex items-center justify-center relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="text-center relative z-10">
          <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-purple-500 mx-auto shadow-[0_0_15px_rgba(168,85,247,0.2)]"></div>
          <p className="text-slate-400 mt-6 text-lg font-medium">Loading course content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0d14] flex items-center justify-center relative overflow-hidden px-4">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="bg-white/3 backdrop-blur-xl border border-white/5 p-8 rounded-2xl shadow-2xl w-full max-w-sm text-center relative z-10">
          <h2 className="text-2xl font-bold text-white mb-4">Error</h2>
          <p className="text-slate-400 mb-8">{error?.response?.data?.message || "Failed to load course content"}</p>
          <button
            onClick={() => window.history.back()}
            className="inline-block bg-gradient-to-r from-purple-600 to-cyan-500 hover:opacity-90 text-white font-semibold px-6 py-3 rounded-xl shadow-[0_0_15px_rgba(124,58,237,0.3)] transition duration-200"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!course || !course.modules || course.modules.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0d14] flex items-center justify-center relative overflow-hidden px-4">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="bg-white/3 backdrop-blur-xl border border-white/5 p-8 rounded-2xl shadow-2xl w-full max-w-md text-center relative z-10">
          <FaGraduationCap className="mx-auto text-6xl text-purple-400 mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Course Content Not Available</h2>
          <p className="text-slate-400 mb-6">This course is still being prepared. Please check back later.</p>
          <button
            onClick={() => window.history.back()}
            className="inline-block bg-gradient-to-r from-purple-600 to-cyan-500 hover:opacity-90 text-white font-semibold px-6 py-3 rounded-xl shadow-[0_0_15px_rgba(124,58,237,0.3)] transition duration-200"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0d14] text-slate-100 py-8 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10 animate-fadeIn">
        {/* Course Header */}
        <div className="bg-white/3 backdrop-blur-xl border border-white/5 rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{course.title}</h1>
              <p className="text-slate-400 text-sm md:text-base">{course.description}</p>
            </div>
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="md:hidden bg-gradient-to-r from-purple-600 to-cyan-500 text-white p-3 rounded-xl shadow-lg border border-white/10 transition duration-200"
            >
              <FaList />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {currentLesson && (
              <div className="bg-white/3 backdrop-blur-xl border border-white/5 rounded-2xl shadow-2xl overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl md:text-2xl font-bold text-white mb-4">
                    {currentLesson.title}
                  </h2>
                  
                  {currentLesson.description && (
                    <p className="text-slate-400 text-sm md:text-base mb-6">{currentLesson.description}</p>
                  )}
                </div>

                {/* Content based on lesson type */}
                {currentLesson.type === 'video' && currentLesson.content?.videoUrl && (
                  <div className="px-6 pb-6">
                    <YouTubePlayer
                      videoId={currentLesson.content.youtubeId || extractYouTubeId(currentLesson.content.videoUrl)}
                      onProgress={handleVideoProgress}
                      onComplete={handleLessonComplete}
                      initialTime={progress[currentLesson._id]?.watchTime || 0}
                    />
                  </div>
                )}

                {currentLesson.type === 'text' && (
                  <div className="px-6 pb-6">
                    <TextContentViewer 
                      content={currentLesson.content}
                      title={currentLesson.title}
                    />
                  </div>
                )}

                {/* Lesson Actions */}
                <div className="px-6 pb-6 flex items-center justify-between border-t border-white/5 pt-6">
                  <button
                    onClick={handleLessonComplete}
                    disabled={progress[currentLesson._id]?.completed}
                    className={`px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 transition-all duration-200 ${
                      progress[currentLesson._id]?.completed
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-[0_0_15px_rgba(124,58,237,0.3)] hover:opacity-90'
                    }`}
                  >
                    <FaCheckCircle />
                    <span>
                      {progress[currentLesson._id]?.completed ? 'Completed' : 'Mark as Complete'}
                    </span>
                  </button>

                  {currentLesson.content?.transcript && (
                    <button className="px-4 py-2 border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 rounded-xl flex items-center space-x-2 transition duration-200">
                      <FaDownload />
                      <span>Transcript</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className={`${showSidebar ? 'block' : 'hidden'} lg:block`}>
            <CourseSidebar
              course={course}
              currentLesson={currentLesson}
              onLessonSelect={handleLessonSelect}
              progress={progress}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePlayer;
