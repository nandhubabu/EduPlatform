const API_BASE_URL = 'http://localhost:5000/api/v1';

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
