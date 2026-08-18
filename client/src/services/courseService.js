// Course Service API functions
import { BASE_URL } from '../utils/utils';
import axios from 'axios';

// Fetch all courses
export const getAllCourses = async () => {
  const response = await axios.get(`${BASE_URL}/courses`, {
    withCredentials: true,
  });
  return response.data;
};

// Get course by ID
export const getCourseById = async (courseId) => {
  const response = await axios.get(`${BASE_URL}/courses/${courseId}`, {
    withCredentials: true,
  });
  return response.data;
};

// Get personalized course recommendations
export const getPersonalizedRecommendations = async () => {
  const response = await axios.get(`${BASE_URL}/courses/recommendations/personalized`, {
    withCredentials: true,
  });
  return response.data;
};

// Search courses with filters
export const searchCourses = async (searchParams = {}) => {
  const params = new URLSearchParams();
  
  Object.entries(searchParams).forEach(([key, value]) => {
    if (value && value !== "") {
      params.append(key, value);
    }
  });

  const response = await axios.get(`${BASE_URL}/courses/search?${params}`, {
    withCredentials: true,
  });
  return response.data;
};

// Enroll in a course
// Enroll in a course
export const enrollInCourse = async (courseId) => {
  const response = await axios.post(`${BASE_URL}/courses/${courseId}/enroll`, {}, {
    withCredentials: true,
  });
  return response.data;
};

// Get user's enrolled courses
export const getEnrolledCourses = async () => {
  const response = await axios.get(`${BASE_URL}/courses/user/enrolled`, {
    withCredentials: true,
  });
  return response.data;
};

// Create a new course (instructor only)
export const createCourse = async (courseData) => {
  const response = await axios.post(`${BASE_URL}/courses`, courseData, {
    withCredentials: true,
  });
  return response.data;
};

// Update a course (instructor only)
export const updateCourse = async (courseId, courseData) => {
  const response = await axios.put(`${BASE_URL}/courses/${courseId}`, courseData, {
    withCredentials: true,
  });
  return response.data;
};

// Delete a course (instructor only)
export const deleteCourse = async (courseId) => {
  const response = await axios.delete(`${BASE_URL}/courses/${courseId}`, {
    withCredentials: true,
  });
  return response.data;
};

// Course categories for filtering
export const COURSE_CATEGORIES = [
  'Web Development',
  'Data Science', 
  'Digital Marketing',
  'Design',
  'Business',
  'Cloud Computing',
  'Mobile Development',
  'AI/Machine Learning',
  'Cybersecurity',
  'DevOps',
  'Other'
];

// Difficulty levels
export const DIFFICULTY_LEVELS = [
  'Beginner',
  'Intermediate', 
  'Advanced'
];

// Interest area to course category mapping
export const INTEREST_COURSE_MAPPING = {
  'Realistic': ['Web Development', 'Cloud Computing', 'DevOps', 'Cybersecurity'],
  'Investigative': ['Data Science', 'AI/Machine Learning', 'Cybersecurity', 'Web Development'],
  'Artistic': ['Design', 'Digital Marketing', 'Web Development'],
  'Social': ['Digital Marketing', 'Business', 'Design'],
  'Enterprising': ['Business', 'Digital Marketing', 'Cybersecurity'],
  'Conventional': ['Business', 'Data Science', 'DevOps', 'Cloud Computing']
};

// Helper function to get recommended categories based on assessment
export const getRecommendedCategories = (topInterests = []) => {
  const categories = new Set();
  
  topInterests.forEach(interest => {
    if (INTEREST_COURSE_MAPPING[interest]) {
      INTEREST_COURSE_MAPPING[interest].forEach(category => {
        categories.add(category);
      });
    }
  });
  
  return Array.from(categories);
};

// Helper function to calculate course relevance score
export const calculateCourseRelevance = (course, userInterests = []) => {
  if (!userInterests.length) return 0;
  
  let score = 0;
  const courseText = `${course.title} ${course.description} ${course.category}`.toLowerCase();
  const recommendedCategories = getRecommendedCategories(userInterests);
  
  // Check category match
  if (recommendedCategories.includes(course.category)) {
    score += 3;
  }
  
  // Check keyword matches
  userInterests.forEach(interest => {
    if (courseText.includes(interest.toLowerCase())) {
      score += 2;
    }
  });
  
  // Check skill-related keywords
  const skillKeywords = ['programming', 'design', 'marketing', 'business', 'data', 'analytics'];
  skillKeywords.forEach(keyword => {
    if (courseText.includes(keyword)) {
      score += 1;
    }
  });
  
  return score;
};
