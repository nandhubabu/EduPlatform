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
        enabled ? 'text-indigo-600' : 'text-slate-300'
      } text-3xl transition-all duration-200 ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 cursor-pointer'
      } focus:outline-none`}
    >
      {enabled ? <FaToggleOn /> : <FaToggleOff />}
    </button>
  );

  // Tab navigation
  const tabs = [
    { id: 'profile', label: 'Profile', icon: FaUser },
    { id: 'career', label: 'Career Exploration', icon: FaRocket },
    { id: 'interests', label: 'Skills & Interests', icon: FaLightbulb },
    { id: 'notifications', label: 'Notifications', icon: FaBell },
    { id: 'appearance', label: 'Appearance', icon: FaPalette },
    { id: 'privacy', label: 'Privacy & Security', icon: FaShieldAlt },
    { id: 'learning', label: 'Learning', icon: FaDesktop },
    { id: 'localization', label: 'Language & Region', icon: FaGlobe },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
            Account Settings
          </h1>
          <p className="text-slate-500 font-medium text-base">Customize your learning experience and preferences</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-1/4">
            <div className="bg-white border border-slate-200 shadow-sm p-4 rounded-2xl sticky top-20">
              <nav className="space-y-1.5">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left font-semibold text-sm transition-all duration-150 ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                      }`}
                    >
                      <Icon className={`text-base ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:w-3/4">
            <div className="bg-white border border-slate-200 shadow-sm p-6 sm:p-8 rounded-3xl">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                    <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-100 mr-3.5">
                      <FaUser className="text-indigo-600 text-lg" />
                    </div>
                    Profile Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={settings.profile.firstName}
                        onChange={(e) => handleSettingChange('profile', 'firstName', e.target.value)}
                        className="w-full p-3 bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:bg-white focus:outline-none rounded-xl font-medium text-sm transition duration-150"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={settings.profile.lastName}
                        onChange={(e) => handleSettingChange('profile', 'lastName', e.target.value)}
                        className="w-full p-3 bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:bg-white focus:outline-none rounded-xl font-medium text-sm transition duration-150"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={settings.profile.email}
                        onChange={(e) => handleSettingChange('profile', 'email', e.target.value)}
                        className="w-full p-3 bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:bg-white focus:outline-none rounded-xl font-medium text-sm transition duration-150"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={settings.profile.phone}
                        onChange={(e) => handleSettingChange('profile', 'phone', e.target.value)}
                        className="w-full p-3 bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:bg-white focus:outline-none rounded-xl font-medium text-sm transition duration-150"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Career Exploration Tab */}
              {activeTab === 'career' && (
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                    <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-100 mr-3.5">
                      <FaRocket className="text-indigo-600 text-lg" />
                    </div>
                    Career Exploration
                  </h2>
                  <div className="space-y-6">
                    <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl">
                      <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-4">Experience Level</h3>
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
                              className={`p-4 rounded-xl border-2 transition-all duration-150 text-left ${
                                isSelected
                                  ? 'border-indigo-600 bg-white text-indigo-900 shadow-md ring-2 ring-indigo-600/10'
                                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                              }`}
                            >
                              <div className="font-bold text-slate-900">{level.label}</div>
                              <div className={`text-xs mt-1 font-medium ${isSelected ? 'text-indigo-600' : 'text-slate-500'}`}>{level.desc}</div>
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
                  <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                    <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 mr-3.5">
                      <FaLightbulb className="text-amber-600 text-lg" />
                    </div>
                    Skills & Interests
                  </h2>
                  <div className="space-y-6">
                    <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl">
                      <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-4">Learning Style</h3>
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
                              className={`p-4 rounded-xl border-2 transition-all duration-150 text-left ${
                                isSelected
                                  ? 'border-indigo-600 bg-white text-indigo-900 shadow-md ring-2 ring-indigo-600/10'
                                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                              }`}
                            >
                              <div className="font-bold text-slate-900">{style.label}</div>
                              <div className={`text-xs mt-1 font-medium ${isSelected ? 'text-indigo-600' : 'text-slate-500'}`}>{style.desc}</div>
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
                  <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                    <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 mr-3.5">
                      <FaBell className="text-rose-600 text-lg" />
                    </div>
                    Notification Preferences
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-5 bg-slate-50 border border-slate-200 rounded-2xl">
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">Email Notifications</h3>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">Receive notifications and digest updates via email</p>
                      </div>
                      <Toggle
                        enabled={settings.notifications.emailNotifications}
                        onChange={(value) => handleSettingChange('notifications', 'emailNotifications', value)}
                      />
                    </div>
                    <div className="flex items-center justify-between p-5 bg-slate-50 border border-slate-200 rounded-2xl">
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">Push Notifications</h3>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">Receive immediate push notifications in your browser</p>
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
                  <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                    <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 mr-3.5">
                      <FaPalette className="text-emerald-600 text-lg" />
                    </div>
                    Appearance & Theme
                  </h2>
                  <div className="space-y-6">
                    <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl">
                      <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-4">Theme</h3>
                      <div className="grid grid-cols-3 gap-4">
                        {[
                          { value: 'light', label: 'Light (Active)', icon: FaSun },
                          { value: 'dark', label: 'Dark', icon: FaMoon },
                          { value: 'auto', label: 'System', icon: FaDesktop }
                        ].map((theme) => {
                          const Icon = theme.icon;
                          const isSelected = settings.appearance.theme === theme.value || theme.value === 'light';
                          return (
                            <button
                              key={theme.value}
                              type="button"
                              onClick={() => handleSettingChange('appearance', 'theme', theme.value)}
                              className={`p-5 rounded-xl border-2 transition-all duration-150 flex flex-col items-center justify-center ${
                                isSelected
                                  ? 'border-indigo-600 bg-white text-indigo-900 shadow-md ring-2 ring-indigo-600/10'
                                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                              }`}
                            >
                              <Icon className={`text-2xl mb-2 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                              <span className="font-bold text-sm text-slate-900">{theme.label}</span>
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
                  <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                    <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-100 mr-3.5">
                      <FaShieldAlt className="text-indigo-600 text-lg" />
                    </div>
                    Privacy & Security
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-5 bg-slate-50 border border-slate-200 rounded-2xl">
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">Two-Factor Authentication</h3>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">Add an extra verification layer to your account</p>
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
                  <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                    <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-200 mr-3.5">
                      <FaDesktop className="text-sky-600 text-lg" />
                    </div>
                    Learning Preferences
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-5 bg-slate-50 border border-slate-200 rounded-2xl">
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">Autoplay Next Lecture</h3>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">Automatically advance to the next lesson</p>
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
                  <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                    <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-200 mr-3.5">
                      <FaGlobe className="text-teal-600 text-lg" />
                    </div>
                    Language & Region
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                        Preferred Language
                      </label>
                      <select
                        value={settings.localization.language}
                        onChange={(e) => handleSettingChange('localization', 'language', e.target.value)}
                        className="w-full p-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:border-indigo-600 focus:bg-white focus:outline-none cursor-pointer font-medium text-sm transition duration-150"
                      >
                        <option value="en">English (US)</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button Section */}
              <div className="mt-8 pt-6 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    {saveMessage && (
                      <p className={`text-sm font-semibold ${saveMessage.includes('Error') ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {saveMessage}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={handleSaveSettings}
                    disabled={isLoading}
                    className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-600/20 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-sm"
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
