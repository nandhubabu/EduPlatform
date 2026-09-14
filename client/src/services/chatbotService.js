import { BASE_URL } from '../utils/utils';

const API_BASE_URL = BASE_URL;

class ChatbotService {
  constructor() {
    this.conversationHistory = [];
  }

  async sendMessage(message) {
    try {
      const response = await fetch(`${API_BASE_URL}/chatbot/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          conversationHistory: this.conversationHistory.slice(-10) // Send last 10 messages for context
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        // Add to conversation history
        this.addToHistory(message, false);
        this.addToHistory(data.data.response, true);
        
        return {
          text: data.data.response,
          quickReplies: data.data.quickReplies || []
        };
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Chatbot service error:', error);
      return this.getFallbackResponse();
    }
  }

  async getCareerAdvice(interests, experience, goals) {
    try {
      const response = await fetch(`${API_BASE_URL}/chatbot/career-advice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          interests,
          experience,
          goals
        })
      });

      const data = await response.json();
      
      if (data.success) {
        return data.data.advice;
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Career advice error:', error);
      return "I'd be happy to help with career advice! Consider taking our career assessment to get personalized recommendations.";
    }
  }

  async getCourseRecommendations(careerGoal, currentSkills) {
    try {
      const response = await fetch(`${API_BASE_URL}/chatbot/course-recommendations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          careerGoal,
          currentSkills
        })
      });

      const data = await response.json();
      
      if (data.success) {
        return data.data.recommendations;
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Course recommendations error:', error);
      return "Browse our course catalog to find learning paths that match your career goals!";
    }
  }

  addToHistory(message, isBot) {
    this.conversationHistory.push({
      text: message,
      isBot: isBot,
      timestamp: new Date()
    });

    // Keep only last 20 messages to manage memory
    if (this.conversationHistory.length > 20) {
      this.conversationHistory = this.conversationHistory.slice(-20);
    }
  }

  clearHistory() {
    this.conversationHistory = [];
  }

  getFallbackResponse() {
    return {
      text: "I'm here to help you with career guidance and learning! While I connect to my AI brain, I can assist you with career assessments, course recommendations, skill development, and platform navigation. What would you like to explore?",
      quickReplies: [
        { text: "Career Assessment", action: "assessment" },
        { text: "Browse Courses", action: "courses" },
        { text: "Skills Development", action: "skills" },
        { text: "Platform Help", action: "about" }
      ]
    };
  }

  // Lecture Copilot for interactive in-course assistance
  async askLectureCopilot({ courseTitle, moduleTitle, lessonTitle, lessonDescription, query, history = [] }) {
    const contextualPrompt = `You are an expert AI teaching assistant for EduPlatform. 
Course: "${courseTitle || 'Software Development'}"
Module: "${moduleTitle || 'General'}"
Lecture: "${lessonTitle || 'Core Concepts'}"
Lecture Overview: "${lessonDescription || 'In this lesson, we study foundational concepts and practical implementations.'}"

Student Question / Prompt:
"${query}"

Provide a concise, encouraging, educational answer using Markdown, bullet points, and code formatting where appropriate.`;

    try {
      const response = await fetch(`${API_BASE_URL}/chatbot/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: contextualPrompt,
          conversationHistory: history.slice(-6).map((h) => ({
            role: h.isBot ? 'model' : 'user',
            text: h.text,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success && data.data?.response) {
        return {
          text: data.data.response,
          source: 'ai',
        };
      }
      throw new Error('Fallback needed');
    } catch (err) {
      console.info('Using local Copilot assistant engine for lecture response');
      return {
        text: this.generateLectureFallback({ courseTitle, lessonTitle, lessonDescription, query }),
        source: 'local',
      };
    }
  }

  generateLectureFallback({ courseTitle, lessonTitle, lessonDescription, query }) {
    const q = (query || '').toLowerCase();
    const lTitle = lessonTitle || 'this lecture';
    const cTitle = courseTitle || 'this course';

    if (q.includes('summar') || q.includes('recap') || q.includes('overview')) {
      return `### 📋 Lecture Summary: ${lTitle}\n\nHere are the core takeaways from this session:\n\n- **Primary Objective:** Master the architectural foundations and practical patterns covered in *${cTitle}*.\n- **Key Mechanics:** ${lessonDescription || 'Step-by-step breakdown of core APIs, lifecycle management, and reliable data flow.'}\n- **Best Practice:** Keep components modular, isolate side-effects, and maintain clean separation of concerns.\n\n*Pro-tip: Try applying this immediately in your sandbox or project repository before advancing to the next section!*`;
    }

    if (q.includes('code') || q.includes('example') || q.includes('syntax')) {
      return `### 💻 Practical Implementation Example\n\nHere is a clean pattern illustrating **${lTitle}**:\n\n\`\`\`javascript\n// Production pattern for ${lTitle}\nexport async function executeModuleWorkflow(config = {}) {\n  try {\n    const response = await fetch('/api/resource', {\n      headers: { 'Content-Type': 'application/json' },\n      ...config\n    });\n    if (!response.ok) throw new Error('Action failed');\n    return await response.json();\n  } catch (err) {\n    console.error('Workflow error:', err.message);\n    return { success: false, fallback: true };\n  }\n}\n\`\`\`\n\nNotice the explicit error handling and default parameters to guard against runtime exceptions!`;
    }

    if (q.includes('quiz') || q.includes('test') || q.includes('question')) {
      return `### 🧠 Quick Knowledge Check for ${lTitle}\n\n**Question 1:** What is the primary advantage of breaking this functionality into discrete, reusable modules?\n> *Answer:* It dramatically simplifies automated testing, isolates bugs, and allows multiple team members to work concurrently without merge conflicts.\n\n**Question 2:** What potential pitfall should you guard against when handling asynchronous state?\n> *Answer:* Unhandled promise rejections and race conditions when multiple fast updates occur. Always maintain clean loading & error boundaries.`;
    }

    if (q.includes('job') || q.includes('industry') || q.includes('interview') || q.includes('real')) {
      return `### 🚀 Industry Application & Career Relevance\n\nIn modern tech companies (from agile startups to enterprise tech leaders):\n\n1. **Interview Expectation:** Tech leads often test whether candidates understand *why* ${lTitle} is architected this way rather than just memorizing syntax.\n2. **Production Use Case:** Clean patterns in *${cTitle}* reduce tech debt and make codebases easier to onboard junior engineers into.\n3. **Portfolio Tip:** Highlight your implementation of this concept in your GitHub README with performance benchmarks or test coverage badges!`;
    }

    return `### 💡 Insight on "${lTitle}"\n\nGreat question regarding **${lTitle}** in *${cTitle}*!\n\nWhen working through this concept:\n1. **Understand the Core Flow:** Trace how data enters the system, transforms, and produces output.\n2. **Isolate Edge Cases:** Always check for null values, network dropouts, or unexpected payloads.\n3. **Experiment Actively:** Open your local editor and tweak the parameters to observe how the behavior changes.\n\nFeel free to ask me for a code sample, summary, or practice quiz anytime!`;
  }

  // Enhanced quick action handlers
  async handleQuickAction(action, context = {}) {
    switch (action) {
      case 'career_confusion':
        return await this.sendMessage("I'm confused about my career direction and need guidance on finding the right path.");
      
      case 'skill_assessment':
        return await this.sendMessage("I want to assess my current skills and identify areas for improvement.");
      
      case 'course_selection':
        return await this.sendMessage("I need help choosing the right courses for my career goals.");
      
      case 'job_search':
        return await this.sendMessage("I need advice on job searching and career transition strategies.");
      
      case 'personalized_courses':
        if (context.careerGoal) {
          const recommendations = await this.getCourseRecommendations(context.careerGoal, context.skills);
          return {
            text: recommendations,
            quickReplies: [
              { text: "Browse Courses", action: "courses" },
              { text: "Take Assessment", action: "assessment" },
              { text: "More Info", action: "about" }
            ]
          };
        }
        return await this.sendMessage("What specific career or skill area are you interested in learning about?");
      
      default:
        return this.getFallbackResponse();
    }
  }
}

export default new ChatbotService();

