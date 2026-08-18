const API_BASE_URL = 'http://localhost:5000/api/v1';

class AssessmentService {
  async saveAssessmentResult(assessmentData) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/assessment/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(assessmentData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error saving assessment result:', error);
      throw error;
    }
  }

  async getAssessmentResults() {
    try {
      const response = await fetch(`${API_BASE_URL}/users/assessment/results`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (!response.ok) {
        if (response.status === 401) {
          // User not authenticated, return empty results
          return { results: [], count: 0 };
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching assessment results:', error);
      // Fallback to localStorage for non-authenticated users
      try {
        const localResults = JSON.parse(localStorage.getItem('assessmentResults') || '[]');
        return { results: localResults, count: localResults.length };
      } catch (localError) {
        console.error('Error reading from localStorage:', localError);
        return { results: [], count: 0 };
      }
    }
  }

  async getLatestAssessmentResult() {
    try {
      const response = await fetch(`${API_BASE_URL}/users/assessment/latest`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (!response.ok) {
        if (response.status === 401) {
          // User not authenticated, check localStorage
          const localResult = JSON.parse(localStorage.getItem('latestAssessmentResult') || 'null');
          return { result: localResult };
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching latest assessment result:', error);
      // Fallback to localStorage
      try {
        const localResult = JSON.parse(localStorage.getItem('latestAssessmentResult') || 'null');
        return { result: localResult };
      } catch (localError) {
        console.error('Error reading from localStorage:', localError);
        return { result: null };
      }
    }
  }

  getInterestAreaInfo(code) {
    const interestAreas = {
      R: {
        name: "Realistic",
        description: "Building, fixing, working with your hands",
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200"
      },
      I: {
        name: "Investigative", 
        description: "Researching, analyzing, solving problems",
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200"
      },
      A: {
        name: "Artistic",
        description: "Creating, designing, expressing ideas",
        color: "text-purple-600",
        bgColor: "bg-purple-50",
        borderColor: "border-purple-200"
      },
      S: {
        name: "Social",
        description: "Helping, teaching, caring for others",
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        borderColor: "border-orange-200"
      },
      E: {
        name: "Enterprising",
        description: "Leading, managing, selling, organizing",
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200"
      },
      C: {
        name: "Conventional",
        description: "Organizing, following procedures, attention to detail",
        color: "text-indigo-600",
        bgColor: "bg-indigo-50",
        borderColor: "border-indigo-200"
      }
    };

    return interestAreas[code] || {
      name: "Unknown",
      description: "Interest area not found",
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-200"
    };
  }

  formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}

export default new AssessmentService();
