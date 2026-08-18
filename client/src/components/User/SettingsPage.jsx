import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  FaUser,
  FaBell,
  FaPalette,
  FaShieldAlt,
  FaGlobe,
  FaSave,
  FaToggleOn,
  FaToggleOff,
  FaDesktop,
  FaMoon,
  FaSun,
  FaRocket,
  FaLightbulb
} from 'react-icons/fa';

const Settings = () => {
  const { userProfile } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // Settings state
  const [settings, setSettings] = useState({
    // Profile settings
    profile: {
      firstName: userProfile?.name?.split(' ')[0] || '',
      lastName: userProfile?.name?.split(' ')[1] || '',
      email: userProfile?.email || '',
      phone: '',
      bio: '',
      location: '',
      timezone: 'UTC',
    },
    // Notification settings
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      courseUpdates: true,
      assignmentReminders: true,
      promotionalEmails: false,
      weeklyDigest: true,
      instantMessages: true,
    },
    // Career Exploration
    career: {
      careerGoals: [],
      experienceLevel: 'beginner',
      interestedRoles: [],
      salaryExpectation: '',
      workPreference: 'hybrid',
      availableToStart: 'immediately',
      willingToRelocate: false,
      preferredWorkSchedule: 'full-time',
    },
    // Skills & Interests
    interests: {
      technicalSkills: [],
      softSkills: [],
      learningStyle: 'visual',
      careerInterests: [],
      industryInterests: [],
      skillAssessmentCompleted: false,
      strengthsIdentified: [],
      areasForImprovement: [],
    },
    // Theme & Appearance
    appearance: {
      theme: 'dark',
      primaryColor: 'purple',
      fontSize: 'medium',
      compactMode: false,
      animationsEnabled: true,
      highContrast: false,
    },
    // Privacy & Security
    privacy: {
      profileVisibility: 'public',
      showProgress: true,
      showAchievements: true,
      twoFactorAuth: false,
      loginAlerts: true,
      dataSharing: false,
    },
    // Learning preferences
    learning: {
      autoplay: true,
      playbackSpeed: '1x',
      subtitles: false,
      downloadQuality: 'medium',
      offlineMode: false,
      reminderTime: '18:00',
      dailyGoal: 30,
    },
    // Language & Region
    localization: {
      language: 'en',
      dateFormat: 'MM/DD/YYYY',
      timeFormat: '12h',
      currency: 'USD',
      region: 'US',
    }
  });

  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      setSettings(prev => ({ ...prev, ...JSON.parse(savedSettings) }));
    }
  }, []);

  // Handle setting changes
  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  // Save settings
  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      localStorage.setItem('userSettings', JSON.stringify(settings));
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSaveMessage('Settings saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      setSaveMessage('Error saving settings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle component
  const Toggle = ({ enabled, onChange, disabled = false }) => (
    <button
      onClick={() => !disabled && onChange(!enabled)}
      disabled={disabled}
      type="button"
      className={`${
        enabled ? 'text-cyan-400' : 'text-slate-600'
      } text-2xl transition-all duration-200 ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110 cursor-pointer'
      } focus:outline-none`}
    >
      {enabled ? <FaToggleOn /> : <FaToggleOff />}
    </button>
  );

  // Tab navigation
  const tabs = [
    { id: 'profile', label: 'Profile', icon: FaUser, color: 'text-purple-400 bg-purple-500/10' },
    { id: 'career', label: 'Career Exploration', icon: FaRocket, color: 'text-cyan-400 bg-cyan-500/10' },
    { id: 'interests', label: 'Skills & Interests', icon: FaLightbulb, color: 'text-amber-400 bg-amber-500/10' },
    { id: 'notifications', label: 'Notifications', icon: FaBell, color: 'text-rose-400 bg-rose-500/10' },
    { id: 'appearance', label: 'Appearance', icon: FaPalette, color: 'text-emerald-400 bg-emerald-500/10' },
    { id: 'privacy', label: 'Privacy & Security', icon: FaShieldAlt, color: 'text-indigo-400 bg-indigo-500/10' },
    { id: 'learning', label: 'Learning', icon: FaDesktop, color: 'text-sky-400 bg-sky-500/10' },
    { id: 'localization', label: 'Language & Region', icon: FaGlobe, color: 'text-teal-400 bg-teal-500/10' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0d14] text-slate-100 relative overflow-hidden py-12">
      {/* Floating background neon glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="mb-10 max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            Settings
          </h1>
          <p className="text-slate-400 text-lg">Customize your learning experience and preferences</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
          {/* Sidebar Navigation */}
          <div className="lg:w-1/4">
            <div className="bg-white/3 backdrop-blur-xl border border-white/5 shadow-2xl p-6 rounded-2xl">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl text-left transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-[0_0_20px_rgba(124,58,237,0.35)]'
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Icon className={`text-lg ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span className="font-semibold text-sm tracking-wide">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:w-3/4">
            <div className="bg-white/3 backdrop-blur-xl border border-white/5 shadow-2xl p-8 rounded-2xl">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-8 flex items-center">
                    <div className="p-2 rounded-lg bg-purple-500/10 mr-3.5">
                      <FaUser className="text-purple-400 text-xl" />
                    </div>
                    Profile Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={settings.profile.firstName}
                        onChange={(e) => handleSettingChange('profile', 'firstName', e.target.value)}
                        className="w-full p-3 bg-[#090b11] border border-white/10 text-white placeholder-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none rounded-lg transition duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={settings.profile.lastName}
                        onChange={(e) => handleSettingChange('profile', 'lastName', e.target.value)}
                        className="w-full p-3 bg-[#090b11] border border-white/10 text-white placeholder-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none rounded-lg transition duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={settings.profile.email}
                        onChange={(e) => handleSettingChange('profile', 'email', e.target.value)}
                        className="w-full p-3 bg-[#090b11] border border-white/10 text-white placeholder-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none rounded-lg transition duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={settings.profile.phone}
                        onChange={(e) => handleSettingChange('profile', 'phone', e.target.value)}
                        className="w-full p-3 bg-[#090b11] border border-white/10 text-white placeholder-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none rounded-lg transition duration-200"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Career Exploration Tab */}
              {activeTab === 'career' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-8 flex items-center">
                    <div className="p-2 rounded-lg bg-cyan-500/10 mr-3.5">
                      <FaRocket className="text-cyan-400 text-xl" />
                    </div>
                    Career Exploration
                  </h2>
                  <div className="space-y-6">
                    <div className="bg-[#090b11]/40 border border-white/5 p-6 rounded-xl">
                      <h3 className="font-semibold text-white text-base mb-4">Experience Level</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                          { value: 'beginner', label: 'Beginner', desc: 'New to the field' },
                          { value: 'intermediate', label: 'Intermediate', desc: '1-3 years experience' },
                          { value: 'advanced', label: 'Advanced', desc: '3+ years experience' }
                        ].map((level) => {
                          const isSelected = settings.career.experienceLevel === level.value;
                          return (
                            <button
                              key={level.value}
                              type="button"
                              onClick={() => handleSettingChange('career', 'experienceLevel', level.value)}
                              className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                                isSelected
                                  ? 'border-purple-500 bg-purple-500/10 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                                  : 'border-white/10 bg-[#090b11] text-slate-400 hover:border-purple-500/20 hover:text-slate-200'
                              }`}
                            >
                              <div className="font-semibold text-white">{level.label}</div>
                              <div className={`text-sm mt-1 ${isSelected ? 'text-purple-400' : 'text-slate-500'}`}>{level.desc}</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Skills & Interests Tab */}
              {activeTab === 'interests' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-8 flex items-center">
                    <div className="p-2 rounded-lg bg-amber-500/10 mr-3.5">
                      <FaLightbulb className="text-amber-400 text-xl" />
                    </div>
                    Skills & Interests
                  </h2>
                  <div className="space-y-6">
                    <div className="bg-[#090b11]/40 border border-white/5 p-6 rounded-xl">
                      <h3 className="font-semibold text-white text-base mb-4">Learning Style</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                          { value: 'visual', label: 'Visual', desc: 'Images & visuals' },
                          { value: 'auditory', label: 'Auditory', desc: 'Audio & listening' },
                          { value: 'kinesthetic', label: 'Hands-on', desc: 'Learn by doing' },
                          { value: 'reading', label: 'Reading', desc: 'Text & manuals' }
                        ].map((style) => {
                          const isSelected = settings.interests.learningStyle === style.value;
                          return (
                            <button
                              key={style.value}
                              type="button"
                              onClick={() => handleSettingChange('interests', 'learningStyle', style.value)}
                              className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                                isSelected
                                  ? 'border-cyan-500 bg-cyan-500/10 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                                  : 'border-white/10 bg-[#090b11] text-slate-400 hover:border-cyan-500/20 hover:text-slate-200'
                              }`}
                            >
                              <div className="font-semibold text-white">{style.label}</div>
                              <div className={`text-sm mt-1 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`}>{style.desc}</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-8 flex items-center">
                    <div className="p-2 rounded-lg bg-rose-500/10 mr-3.5">
                      <FaBell className="text-rose-400 text-xl" />
                    </div>
                    Notification Preferences
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-5 bg-[#090b11]/40 border border-white/5 rounded-xl">
                      <div>
                        <h3 className="font-semibold text-white">Email Notifications</h3>
                        <p className="text-sm text-slate-400 mt-1">Receive notifications via email</p>
                      </div>
                      <Toggle
                        enabled={settings.notifications.emailNotifications}
                        onChange={(value) => handleSettingChange('notifications', 'emailNotifications', value)}
                      />
                    </div>
                    <div className="flex items-center justify-between p-5 bg-[#090b11]/40 border border-white/5 rounded-xl">
                      <div>
                        <h3 className="font-semibold text-white">Push Notifications</h3>
                        <p className="text-sm text-slate-400 mt-1">Receive push notifications in browser</p>
                      </div>
                      <Toggle
                        enabled={settings.notifications.pushNotifications}
                        onChange={(value) => handleSettingChange('notifications', 'pushNotifications', value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Appearance Tab */}
              {activeTab === 'appearance' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-8 flex items-center">
                    <div className="p-2 rounded-lg bg-emerald-500/10 mr-3.5">
                      <FaPalette className="text-emerald-400 text-xl" />
                    </div>
                    Appearance & Theme
                  </h2>
                  <div className="space-y-6">
                    <div className="bg-[#090b11]/40 border border-white/5 p-6 rounded-xl">
                      <h3 className="font-semibold text-white text-base mb-4">Theme</h3>
                      <div className="grid grid-cols-3 gap-4">
                        {[
                          { value: 'light', label: 'Light', icon: FaSun },
                          { value: 'dark', label: 'Dark', icon: FaMoon },
                          { value: 'auto', label: 'Auto', icon: FaDesktop }
                        ].map((theme) => {
                          const Icon = theme.icon;
                          const isSelected = settings.appearance.theme === theme.value;
                          return (
                            <button
                              key={theme.value}
                              type="button"
                              onClick={() => handleSettingChange('appearance', 'theme', theme.value)}
                              className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center justify-center ${
                                isSelected
                                  ? 'border-purple-500 bg-purple-500/10 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                                  : 'border-white/10 bg-[#090b11] text-slate-400 hover:border-purple-500/20 hover:text-slate-200'
                              }`}
                            >
                              <Icon className={`text-2xl mb-2.5 ${isSelected ? 'text-purple-400' : 'text-slate-400'}`} />
                              <span className="font-semibold text-sm">{theme.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Privacy Tab */}
              {activeTab === 'privacy' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-8 flex items-center">
                    <div className="p-2 rounded-lg bg-indigo-500/10 mr-3.5">
                      <FaShieldAlt className="text-indigo-400 text-xl" />
                    </div>
                    Privacy & Security
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-5 bg-[#090b11]/40 border border-white/5 rounded-xl">
                      <div>
                        <h3 className="font-semibold text-white">Two-Factor Authentication</h3>
                        <p className="text-sm text-slate-400 mt-1">Add an extra layer of security to your account</p>
                      </div>
                      <Toggle
                        enabled={settings.privacy.twoFactorAuth}
                        onChange={(value) => handleSettingChange('privacy', 'twoFactorAuth', value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Learning Tab */}
              {activeTab === 'learning' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-8 flex items-center">
                    <div className="p-2 rounded-lg bg-sky-500/10 mr-3.5">
                      <FaDesktop className="text-sky-400 text-xl" />
                    </div>
                    Learning Preferences
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-5 bg-[#090b11]/40 border border-white/5 rounded-xl">
                      <div>
                        <h3 className="font-semibold text-white">Autoplay Videos</h3>
                        <p className="text-sm text-slate-400 mt-1">Automatically play next video in the series</p>
                      </div>
                      <Toggle
                        enabled={settings.learning.autoplay}
                        onChange={(value) => handleSettingChange('learning', 'autoplay', value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Localization Tab */}
              {activeTab === 'localization' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-8 flex items-center">
                    <div className="p-2 rounded-lg bg-teal-500/10 mr-3.5">
                      <FaGlobe className="text-teal-400 text-xl" />
                    </div>
                    Language & Region
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-3">
                        Language
                      </label>
                      <select
                        value={settings.localization.language}
                        onChange={(e) => handleSettingChange('localization', 'language', e.target.value)}
                        className="w-full p-3 bg-[#090b11] border border-white/10 text-white rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none cursor-pointer"
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button Section */}
              <div className="mt-10 pt-6 border-t border-white/5">
                <div className="flex items-center justify-between">
                  <div>
                    {saveMessage && (
                      <p className={`text-sm font-medium ${saveMessage.includes('Error') ? 'text-red-400 font-semibold' : 'text-emerald-400 font-semibold'}`}>
                        {saveMessage}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={handleSaveSettings}
                    disabled={isLoading}
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-500 hover:opacity-90 text-white rounded-xl shadow-[0_0_20px_rgba(124,58,237,0.3)] transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm"
                  >
                    <FaSave className="text-sm" />
                    <span>{isLoading ? 'Saving...' : 'Save Settings'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
