// AI Service for generating personalized assessment questions using Gemini AI
// This service handles the integration with Google's Gemini AI API

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

/**
 * Generate personalized questions based on user's education level, interests, and knowledge level
 * @param {Object} userProfile - User's education level and demographic info
 * @param {Array} interestScores - Scores for different interest categories
 * @param {number} knowledgeScore - Score from knowledge assessment (0-5)
 * @param {Array} previousAnswers - All previous answers from the user
 * @param {number} numQuestions - Number of questions to generate (default: 20)
 * @param {number} currentQuestionIndex - Index of current question for progressive generation
 * @returns {Promise<Array>} Array of personalized questions
 */
export const generatePersonalizedQuestions = async (
  userProfile, 
  interestScores, 
  knowledgeScore, 
  previousAnswers, 
  numQuestions = 20,
  currentQuestionIndex = 0
) => {
  try {
    // Find the dominant interest category
    const dominantInterest = Object.keys(interestScores).reduce((a, b) => 
      interestScores[a] > interestScores[b] ? a : b
    );

    // Create context from previous answers for progressive generation
    const progressiveContext = buildProgressiveContext(previousAnswers, currentQuestionIndex);

    // Create a detailed prompt for Gemini AI
    const prompt = numQuestions === 1 
      ? createSingleQuestionPrompt(userProfile, dominantInterest, knowledgeScore, interestScores, progressiveContext, currentQuestionIndex)
      : createBatchPrompt(userProfile, dominantInterest, knowledgeScore, interestScores, numQuestions);

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 1,
          topP: 1,
          maxOutputTokens: 2048,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini AI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.candidates[0].content.parts[0].text;

    // Parse the AI response to extract questions
    return parseAIQuestions(aiResponse, dominantInterest, numQuestions, currentQuestionIndex);

  } catch (error) {
    console.error('Error generating AI questions:', error);
    // Fallback to predefined questions if AI fails
    return generateFallbackQuestions(dominantInterest, userProfile.educationLevel, numQuestions, currentQuestionIndex);
  }
};

/**
 * Build progressive context from previous answers
 */
const buildProgressiveContext = (previousAnswers, currentQuestionIndex) => {
  if (!previousAnswers || previousAnswers.length === 0) {
    return "This is the first AI-generated question.";
  }

  let context = `Based on ${previousAnswers.length} previous responses:\n`;
  
  // Add detailed analysis of answer patterns
  const categories = {};
  previousAnswers.forEach(answer => {
    if (answer.category) {
      categories[answer.category] = (categories[answer.category] || 0) + 1;
    }
  });

  // Get top preferences
  const sortedCategories = Object.entries(categories)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

  if (sortedCategories.length > 0) {
    context += `- Primary preference trends: ${sortedCategories.map(([cat, count]) => `${cat} (${count} choices)`).join(', ')}\n`;
  }

  // Add recent answer context (last 3-5 answers)
  const recentAnswers = previousAnswers.slice(-5);
  context += `- Recent choices: ${recentAnswers.map((a, i) => `Q${previousAnswers.length - recentAnswers.length + i + 1}: "${a.text}"`).join(', ')}\n`;
  
  // Add progression context
  context += `- Current AI question: ${currentQuestionIndex + 1}/20\n`;
  context += `- Question should be ${currentQuestionIndex < 5 ? 'foundational' : currentQuestionIndex < 10 ? 'intermediate' : currentQuestionIndex < 15 ? 'advanced' : 'highly specialized'}\n`;
  
  // Add specific guidance based on question number
  if (currentQuestionIndex < 5) {
    context += `- Focus on: Basic preferences and general direction\n`;
  } else if (currentQuestionIndex < 10) {
    context += `- Focus on: Specific skills and working styles\n`;
  } else if (currentQuestionIndex < 15) {
    context += `- Focus on: Career specialization and advanced preferences\n`;
  } else {
    context += `- Focus on: Industry specifics and professional development\n`;
  }
  
  return context;
};

/**
 * Create prompt for single question generation (progressive)
 */
const createSingleQuestionPrompt = (userProfile, dominantInterest, knowledgeScore, interestScores, progressiveContext, questionIndex) => {
  const educationContext = getEducationContext(userProfile.educationLevel);
  const knowledgeLevel = getKnowledgeLevel(knowledgeScore);

  // Create unique focus areas for each question to avoid repetition
  const focusAreas = [
    "work environment preferences and team dynamics",
    "specific technical skills and tools",
    "career progression and leadership aspirations",
    "project types and problem-solving approaches",
    "learning style and professional development",
    "industry specialization and market focus",
    "innovation vs stability preferences",
    "communication and collaboration style",
    "risk tolerance and entrepreneurial interest",
    "work-life balance and flexibility needs",
    "technology adoption and trend following",
    "mentoring and knowledge sharing preferences",
    "client interaction and service orientation",
    "creativity vs analytical balance",
    "long-term career vision and goals",
    "professional values and ethics",
    "networking and community involvement",
    "resource management and budgeting",
    "quality vs speed preferences",
    "global vs local market interest"
  ];

  const currentFocus = focusAreas[questionIndex % focusAreas.length];

  return `
You are a career counseling expert creating a highly specific, unique assessment question. This is question ${questionIndex + 1} out of 20 AI-generated questions.

Student Profile:
- Education Level: ${userProfile.educationLevel} (${educationContext})
- Dominant Interest: ${dominantInterest}
- Knowledge Level: ${knowledgeLevel} (scored ${knowledgeScore}/5)

Progressive Context:
${progressiveContext}

CRITICAL REQUIREMENTS FOR UNIQUENESS:
1. This question MUST focus specifically on: ${currentFocus}
2. Question ${questionIndex + 1} should be COMPLETELY DIFFERENT from previous questions
3. Build upon the specific patterns shown in their previous responses
4. Use their dominant interest (${dominantInterest}) as context but focus on the specific area above
5. Question should be detailed and scenario-based, not generic
6. AVOID these common question patterns: "What type of...", "Which of the following...", "How would you prefer..."
7. Create SPECIFIC situational questions with detailed contexts
8. Each question must explore a UNIQUE aspect not covered before

PREVIOUS QUESTIONS TO AVOID SIMILARITY:
${progressiveContext}

Question Uniqueness Seed: ${Math.random().toString(36).substring(7)}_${questionIndex}_${Date.now()}

Format your response as JSON:
{
  "question": "A detailed, scenario-based question specifically about ${currentFocus} in the context of ${dominantInterest}",
  "options": [
    {"text": "Option A with specific scenario details", "category": "${dominantInterest}"},
    {"text": "Option B with different approach/scenario", "category": "${dominantInterest}"},
    {"text": "Option C with alternative perspective", "category": "${dominantInterest}"},
    {"text": "Option D with contrasting viewpoint", "category": "alternative"}
  ]
}

 EXAMPLE FORMAT (DO NOT COPY):
If focusing on "work environment preferences" for technology interest:
"You're offered three ${dominantInterest} roles with different work settings. Which appeals most to you?"

Make this question highly specific to ${currentFocus} and completely unique from any previous questions.
`;
};

/**
 * Create prompt for batch question generation
 */
const createBatchPrompt = (userProfile, dominantInterest, knowledgeScore, interestScores, numQuestions) => {
  const educationContext = getEducationContext(userProfile.educationLevel);
  const knowledgeLevel = getKnowledgeLevel(knowledgeScore);
  const interestProfile = createInterestProfile(interestScores);

  return `
You are a career counseling expert creating personalized assessment questions for a student. Based on the following profile, generate exactly ${numQuestions} multiple-choice questions to help determine their ideal career path and learning recommendations.

Student Profile:
- Education Level: ${userProfile.educationLevel} (${educationContext})
- Dominant Interest: ${dominantInterest}
- Knowledge Level: ${knowledgeLevel} (scored ${knowledgeScore}/5 on basic tech questions)
- Interest Distribution: ${interestProfile}

Requirements:
1. Generate exactly ${numQuestions} questions numbered 1-${numQuestions}
2. Each question should have exactly 4 options (A, B, C, D)
3. Questions should be progressive - starting basic and becoming more specific
4. Focus on ${dominantInterest} but include some cross-domain options
5. Consider their ${userProfile.educationLevel} level for complexity

Format as JSON array:
[
  {
    "question": "Question text here",
    "options": [
      {"text": "Option A", "category": "${dominantInterest}"},
      {"text": "Option B", "category": "${dominantInterest}"},
      {"text": "Option C", "category": "${dominantInterest}"},
      {"text": "Option D", "category": "alternative"}
    ]
  }
]

Make questions that help identify specific career specializations within ${dominantInterest}.
`;
};

/**
 * Create a detailed prompt for Gemini AI based on user assessment data
 */
const createAssessmentPrompt = (userProfile, dominantInterest, knowledgeScore, interestScores) => {
  const educationContext = getEducationContext(userProfile.educationLevel);
  const knowledgeLevel = getKnowledgeLevel(knowledgeScore);
  const interestProfile = createInterestProfile(interestScores);

  return `
You are a career counseling expert creating personalized assessment questions for a student. Based on the following profile, generate exactly 20 multiple-choice questions to help determine their ideal career path and learning recommendations.

Student Profile:
- Education Level: ${userProfile.educationLevel} (${educationContext})
- Dominant Interest: ${dominantInterest}
- Knowledge Level: ${knowledgeLevel} (scored ${knowledgeScore}/5 on basic tech questions)
- Interest Distribution: ${interestProfile}

Requirements:
1. Generate exactly 20 questions numbered 1-20
2. Each question should have exactly 4 options (A, B, C, D)
3. Questions should be progressive - starting basic and becoming more specific
4. Focus on the dominant interest "${dominantInterest}" but include some cross-domain questions
5. Consider their education level when choosing vocabulary and concepts
6. Include questions about:
   - Specific skills they want to develop
   - Learning preferences and styles
   - Career goals and aspirations
   - Technology preferences
   - Work environment preferences
   - Problem-solving approaches
   - Collaboration vs individual work
   - Long-term career vision

Format each question exactly like this:
Question 1: [Question text here]
A) [Option A]
B) [Option B] 
C) [Option C]
D) [Option D]
Category: [technology/creative/analytical/education/business]

Make questions engaging, relevant, and age-appropriate for their education level. Ensure questions help identify specific sub-areas within their dominant interest.
`;
};

/**
 * Parse AI response and convert to structured question format
 */
const parseAIQuestions = (aiResponse, dominantInterest, numQuestions = 20, currentQuestionIndex = 0) => {
  try {
    // Try to parse as JSON first (new format)
    const cleanResponse = aiResponse.replace(/```json|```/g, '').trim();
    const jsonData = JSON.parse(cleanResponse);
    
    // Handle both single question and array of questions
    const questionsArray = Array.isArray(jsonData) ? jsonData : [jsonData];
    
    return questionsArray.map((q, index) => ({
      id: 16 + currentQuestionIndex + index,
      question: q.question,
      options: q.options.map((option, optIndex) => ({
        id: optIndex,
        text: option.text,
        category: option.category || dominantInterest
      }))
    }));
    
  } catch (jsonError) {
    console.log('JSON parsing failed, trying legacy text parsing...');
    
    // Fallback to legacy text parsing
    const questions = [];
    const questionBlocks = aiResponse.split(/Question \d+:/).slice(1);

    questionBlocks.forEach((block, index) => {
      if (index >= numQuestions) return; // Limit to requested number

      const lines = block.trim().split('\n').filter(line => line.trim());
      if (lines.length < 5) return; // Skip malformed questions

      const questionText = lines[0].trim();
      const options = [];
      let category = dominantInterest; // Default category

      lines.forEach(line => {
        const trimmed = line.trim();
        if (trimmed.match(/^[A-D]\)/)) {
          options.push({
            id: options.length,
            text: trimmed.substring(2).trim(),
            category: dominantInterest
          });
        } else if (trimmed.startsWith('Category:')) {
          category = trimmed.substring(9).trim().toLowerCase();
        }
      });

      if (options.length === 4) {
        questions.push({
          id: 16 + currentQuestionIndex + index,
          question: questionText,
          options: options.map(opt => ({ ...opt, category }))
        });
      }
    });

    // If we don't have enough questions for batch generation, fill with fallback
    if (numQuestions > 1) {
      while (questions.length < numQuestions) {
        const fallbackQuestions = generateFallbackQuestions(dominantInterest, 'general', numQuestions - questions.length, currentQuestionIndex + questions.length);
        questions.push(...fallbackQuestions.slice(0, numQuestions - questions.length));
      }
    }

    return questions.slice(0, numQuestions);
  }
};

/**
 * Generate fallback questions if AI service fails
 */
const generateFallbackQuestions = (dominantInterest, educationLevel, numQuestions = 20, startIndex = 0) => {
  const fallbackQuestions = {
    technology: [
      {
        id: 16,
        question: "Which type of technology project excites you most?",
        options: [
          { text: "Building mobile apps", category: "technology" },
          { text: "Creating websites", category: "technology" },
          { text: "Developing games", category: "technology" },
          { text: "Working with databases", category: "technology" }
        ]
      },
      {
        id: 17,
        question: "What programming approach do you prefer?",
        options: [
          { text: "Visual drag-and-drop tools", category: "technology" },
          { text: "Writing code from scratch", category: "technology" },
          { text: "Using frameworks and libraries", category: "technology" },
          { text: "Configuring existing systems", category: "technology" }
        ]
      }
    ],
    creative: [
      {
        id: 16,
        question: "Which creative medium interests you most?",
        options: [
          { text: "Digital art and illustration", category: "creative" },
          { text: "Video production and editing", category: "creative" },
          { text: "Web design and UI/UX", category: "creative" },
          { text: "Photography and visual storytelling", category: "creative" }
        ]
      }
    ],
    analytical: [
      {
        id: 16,
        question: "What type of data work appeals to you?",
        options: [
          { text: "Finding patterns in large datasets", category: "analytical" },
          { text: "Creating visualizations and reports", category: "analytical" },
          { text: "Building predictive models", category: "analytical" },
          { text: "Conducting statistical analysis", category: "analytical" }
        ]
      }
    ],
    education: [
      {
        id: 16,
        question: "How do you prefer to share knowledge?",
        options: [
          { text: "Creating online courses", category: "education" },
          { text: "One-on-one mentoring", category: "education" },
          { text: "Writing educational content", category: "education" },
          { text: "Leading workshops and seminars", category: "education" }
        ]
      }
    ],
    business: [
      {
        id: 16,
        question: "Which business area interests you most?",
        options: [
          { text: "Digital marketing and growth", category: "business" },
          { text: "Project management", category: "business" },
          { text: "Product development", category: "business" },
          { text: "Strategic planning", category: "business" }
        ]
      }
    ]
  };

  // Generate more questions to reach 20
  const baseQuestions = fallbackQuestions[dominantInterest] || fallbackQuestions.technology;
  const questions = [...baseQuestions];

  // Add generic questions to reach 20
  const genericQuestions = [
    {
      question: "What motivates you to learn new skills?",
      options: [
        { text: "Career advancement", category: dominantInterest },
        { text: "Personal satisfaction", category: dominantInterest },
        { text: "Solving real-world problems", category: dominantInterest },
        { text: "Creative expression", category: dominantInterest }
      ]
    },
    {
      question: "How do you prefer to work?",
      options: [
        { text: "Independently with minimal supervision", category: dominantInterest },
        { text: "In small collaborative teams", category: dominantInterest },
        { text: "Leading large projects", category: dominantInterest },
        { text: "Following structured processes", category: dominantInterest }
      ]
    }
  ];

  genericQuestions.forEach((q, index) => {
    if (questions.length < 20) {
      questions.push({
        id: 18 + index,
        ...q
      });
    }
  });

  // Map questions and update IDs based on startIndex
  const questionsWithUpdatedIds = questions.map((q, index) => ({
    ...q,
    id: 16 + startIndex + index
  }));

  return questionsWithUpdatedIds.slice(0, numQuestions);
};

/**
 * Helper functions
 */
const getEducationContext = (level) => {
  const contexts = {
    school: "High school student exploring career options",
    secondary: "Higher secondary student preparing for college",
    undergraduate: "College student building foundational skills",
    professional: "Working professional seeking career advancement"
  };
  return contexts[level] || "Student exploring career options";
};

const getKnowledgeLevel = (score) => {
  if (score >= 4) return "Advanced - Strong technical foundation";
  if (score >= 3) return "Intermediate - Good basic understanding";
  if (score >= 2) return "Beginner - Some exposure to concepts";
  return "Novice - New to technical concepts";
};

const createInterestProfile = (scores) => {
  return Object.entries(scores)
    .map(([category, score]) => `${category}: ${score}/10`)
    .join(', ');
};

export default {
  generatePersonalizedQuestions
};
