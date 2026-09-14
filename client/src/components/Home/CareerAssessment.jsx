import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  FaGraduationCap, 
  FaLaptopCode, 
  FaBrain, 
  FaChartLine, 
  FaCertificate,
  FaBriefcase,
  FaRocket,
  FaSpinner,
  FaCheckCircle,
  FaBookOpen,
  FaExternalLinkAlt,
  FaArrowRight,
  FaArrowLeft,
  FaLightbulb,
  FaAward,
  FaUserGraduate,
  FaCheck,
  FaStar,
  FaRedo,
  FaCompass,
  FaThLarge
} from 'react-icons/fa';
import { generatePersonalizedQuestions } from '../../services/aiAssessmentService';

// Predefined questions for interest and knowledge assessment
const predefinedQuestions = {
  interest: [
    {
      id: 1,
      question: "Which type of activities do you enjoy most?",
      options: [
        { text: "Building websites and applications", category: "technology" },
        { text: "Creating art and designs", category: "creative" },
        { text: "Analyzing data and solving problems", category: "analytical" },
        { text: "Teaching and helping others", category: "education" },
        { text: "Managing projects and teams", category: "business" }
      ]
    },
    {
      id: 2,
      question: "What motivates you the most?",
      options: [
        { text: "Innovation and creating new things", category: "technology" },
        { text: "Self-expression and creativity", category: "creative" },
        { text: "Finding patterns and insights", category: "analytical" },
        { text: "Making a positive impact on others", category: "education" },
        { text: "Leading and achieving goals", category: "business" }
      ]
    },
    {
      id: 3,
      question: "In your free time, you prefer to:",
      options: [
        { text: "Learn new programming languages or tools", category: "technology" },
        { text: "Draw, design, or create content", category: "creative" },
        { text: "Read research papers or solve puzzles", category: "analytical" },
        { text: "Volunteer or mentor others", category: "education" },
        { text: "Read business books or network", category: "business" }
      ]
    },
    {
      id: 4,
      question: "Which environment do you thrive in?",
      options: [
        { text: "Tech startups and innovation labs", category: "technology" },
        { text: "Creative studios and design agencies", category: "creative" },
        { text: "Research institutions and data centers", category: "analytical" },
        { text: "Schools and training centers", category: "education" },
        { text: "Corporate offices and boardrooms", category: "business" }
      ]
    },
    {
      id: 5,
      question: "What type of problems do you enjoy solving?",
      options: [
        { text: "Technical challenges and coding problems", category: "technology" },
        { text: "Design challenges and visual problems", category: "creative" },
        { text: "Mathematical and logical problems", category: "analytical" },
        { text: "Learning and knowledge transfer problems", category: "education" },
        { text: "Strategic and organizational problems", category: "business" }
      ]
    },
    {
      id: 6,
      question: "Which tools do you find most interesting?",
      options: [
        { text: "Programming IDEs and development tools", category: "technology" },
        { text: "Design software and creative tools", category: "creative" },
        { text: "Statistical software and data tools", category: "analytical" },
        { text: "Learning management systems", category: "education" },
        { text: "Project management and CRM tools", category: "business" }
      ]
    },
    {
      id: 7,
      question: "What type of content do you consume most?",
      options: [
        { text: "Tech blogs and programming tutorials", category: "technology" },
        { text: "Art galleries and design inspiration", category: "creative" },
        { text: "Scientific journals and data reports", category: "analytical" },
        { text: "Educational podcasts and courses", category: "education" },
        { text: "Business news and case studies", category: "business" }
      ]
    },
    {
      id: 8,
      question: "How do you prefer to work?",
      options: [
        { text: "Building and coding independently", category: "technology" },
        { text: "Brainstorming and creating collaboratively", category: "creative" },
        { text: "Researching and analyzing systematically", category: "analytical" },
        { text: "Teaching and guiding others", category: "education" },
        { text: "Planning and executing strategies", category: "business" }
      ]
    },
    {
      id: 9,
      question: "What gives you the most satisfaction?",
      options: [
        { text: "Seeing your code work perfectly", category: "technology" },
        { text: "Creating something beautiful", category: "creative" },
        { text: "Discovering new insights from data", category: "analytical" },
        { text: "Helping someone learn something new", category: "education" },
        { text: "Achieving business objectives", category: "business" }
      ]
    },
    {
      id: 10,
      question: "Which career path excites you most?",
      options: [
        { text: "Software development and engineering", category: "technology" },
        { text: "Graphic design and content creation", category: "creative" },
        { text: "Data science and research", category: "analytical" },
        { text: "Teaching and training", category: "education" },
        { text: "Management and entrepreneurship", category: "business" }
      ]
    }
  ],
  knowledge: [
    {
      id: 11,
      question: "What is HTML primarily used for?",
      options: [
        { text: "Creating the structure of web pages", correct: true },
        { text: "Styling web pages", correct: false },
        { text: "Adding interactivity to web pages", correct: false },
        { text: "Managing databases", correct: false }
      ]
    },
    {
      id: 12,
      question: "Which of these is a programming language?",
      options: [
        { text: "HTML", correct: false },
        { text: "CSS", correct: false },
        { text: "JavaScript", correct: true },
        { text: "HTTP", correct: false }
      ]
    },
    {
      id: 13,
      question: "What does CSS stand for?",
      options: [
        { text: "Computer Style Sheets", correct: false },
        { text: "Cascading Style Sheets", correct: true },
        { text: "Creative Style System", correct: false },
        { text: "Coded Style Syntax", correct: false }
      ]
    },
    {
      id: 14,
      question: "What is the purpose of a database?",
      options: [
        { text: "To create user interfaces", correct: false },
        { text: "To store and organize data", correct: true },
        { text: "To style web pages", correct: false },
        { text: "To handle user authentication only", correct: false }
      ]
    },
    {
      id: 15,
      question: "Which of these is used for version control?",
      options: [
        { text: "Git", correct: true },
        { text: "HTML", correct: false },
        { text: "CSS", correct: false },
        { text: "SQL", correct: false }
      ]
    }
  ]
};

// Career recommendations based on interests
const careerRecommendations = {
  technology: {
    title: "Technology & Development",
    description: "You have a strong aptitude for technology and programming!",
    suggestedRole: "Software Developer",
    industry: "Technology",
    certifications: [
      {
        name: "AWS Certified Solutions Architect",
        provider: "Amazon Web Services",
        link: "https://aws.amazon.com/certification/certified-solutions-architect-associate/",
        level: "Associate"
      },
      {
        name: "Microsoft Azure Fundamentals",
        provider: "Microsoft",
        link: "https://docs.microsoft.com/en-us/learn/certifications/azure-fundamentals/",
        level: "Fundamental"
      },
      {
        name: "Google Cloud Professional",
        provider: "Google Cloud",
        link: "https://cloud.google.com/certification/cloud-engineer",
        level: "Professional"
      },
      {
        name: "Cisco CCNA (Networking)",
        provider: "Cisco",
        link: "https://www.cisco.com/c/en/us/training-events/training-certifications/certifications/associate/ccna.html",
        level: "Associate"
      },
      {
        name: "Oracle Java SE Programmer",
        provider: "Oracle",
        link: "https://education.oracle.com/java-se-11-developer/pexam_1Z0-819",
        level: "Professional"
      }
    ],
    courses: [
      {
        name: "Full Stack Web Development Bootcamp",
        provider: "Udemy/Coursera",
        duration: "12-16 weeks",
        type: "Comprehensive"
      },
      {
        name: "Cisco Networking Academy",
        provider: "Cisco",
        duration: "6-12 months",
        type: "Professional Training"
      },
      {
        name: "Microsoft Learn for Developers",
        provider: "Microsoft",
        duration: "Self-paced",
        type: "Free Online"
      },
      {
        name: "Google Developer Training",
        provider: "Google",
        duration: "Various",
        type: "Specialized"
      },
      {
        name: "IBM SkillsBuild",
        provider: "IBM",
        duration: "Flexible",
        type: "Professional Development"
      },
      {
        name: "AWS Cloud Computing Fundamentals",
        provider: "Amazon Web Services",
        duration: "4-6 weeks",
        type: "Free Tier"
      },
      {
        name: "Meta Front-End Developer Certificate",
        provider: "Meta (Facebook)",
        duration: "7 months",
        type: "Professional Certificate"
      },
      {
        name: "Google IT Support Certificate",
        provider: "Google",
        duration: "3-6 months",
        type: "Entry Level"
      },
      {
        name: "Oracle Cloud Infrastructure Foundations",
        provider: "Oracle",
        duration: "Self-paced",
        type: "Free Training"
      },
      {
        name: "Salesforce Trailhead",
        provider: "Salesforce",
        duration: "Self-paced",
        type: "Free Learning"
      },
      {
        name: "GitHub Learning Lab",
        provider: "GitHub",
        duration: "Self-paced",
        type: "Free Interactive"
      },
      {
        name: "Red Hat Enterprise Linux",
        provider: "Red Hat",
        duration: "Various",
        type: "Open Source Training"
      }
    ],
    jobs: [
      "Software Developer",
      "Web Developer",
      "Mobile App Developer",
      "DevOps Engineer",
      "Cloud Architect",
      "Cybersecurity Specialist",
      "Network Engineer",
      "Database Administrator"
    ],
    icon: FaLaptopCode,
    color: "blue"
  },
  creative: {
    title: "Creative & Design",
    description: "You have excellent creative and design thinking skills!",
    suggestedRole: "UI/UX Designer",
    industry: "Design & Creative",
    certifications: [
      {
        name: "Adobe Certified Expert (ACE)",
        provider: "Adobe",
        link: "https://www.adobe.com/training/certification.html",
        level: "Expert"
      },
      {
        name: "Google UX Design Certificate",
        provider: "Google",
        link: "https://www.coursera.org/professional-certificates/google-ux-design",
        level: "Professional"
      },
      {
        name: "HubSpot Content Marketing",
        provider: "HubSpot",
        link: "https://academy.hubspot.com/courses/content-marketing",
        level: "Intermediate"
      },
      {
        name: "Figma Academy Certification",
        provider: "Figma",
        link: "https://www.figma.com/academy/",
        level: "Beginner to Advanced"
      },
      {
        name: "Canva Design School",
        provider: "Canva",
        link: "https://www.canva.com/designschool/",
        level: "All Levels"
      }
    ],
    courses: [
      {
        name: "UI/UX Design Specialization",
        provider: "Coursera/CalArts",
        duration: "4-6 months",
        type: "University Level"
      },
      {
        name: "Adobe Creative Suite Masterclass",
        provider: "Adobe/Udemy",
        duration: "8-12 weeks",
        type: "Hands-on Training"
      },
      {
        name: "Google Digital Marketing Course",
        provider: "Google",
        duration: "3-6 months",
        type: "Free Professional"
      },
      {
        name: "Interaction Design Foundation",
        provider: "IxDF",
        duration: "Self-paced",
        type: "Academic"
      },
      {
        name: "Meta Social Media Marketing Certificate",
        provider: "Meta (Facebook)",
        duration: "4-6 months",
        type: "Professional Certificate"
      },
      {
        name: "Google Creative Certification",
        provider: "Google Skillshop",
        duration: "Self-paced",
        type: "Free Certification"
      },
      {
        name: "HubSpot Academy Design Courses",
        provider: "HubSpot",
        duration: "Self-paced",
        type: "Free Training"
      },
      {
        name: "Microsoft Design Fundamentals",
        provider: "Microsoft Learn",
        duration: "Self-paced",
        type: "Free Online"
      },
      {
        name: "Salesforce UX Design",
        provider: "Salesforce Trailhead",
        duration: "Self-paced",
        type: "Free Learning Path"
      },
      {
        name: "IBM Design Thinking",
        provider: "IBM",
        duration: "2-4 weeks",
        type: "Free Course"
      },
      {
        name: "Figma Academy",
        provider: "Figma",
        duration: "Self-paced",
        type: "Free Interactive"
      },
      {
        name: "Sketch for Beginners",
        provider: "Sketch",
        duration: "Self-paced",
        type: "Free Resources"
      }
    ],
    jobs: [
      "UI/UX Designer",
      "Graphic Designer",
      "Digital Marketing Specialist",
      "Content Creator",
      "Video Editor",
      "Brand Designer",
      "Motion Graphics Designer",
      "Creative Director"
    ],
    icon: FaBrain,
    color: "purple"
  },
  analytical: {
    title: "Data & Analytics",
    description: "You excel at analytical thinking and problem-solving!",
    suggestedRole: "Data Scientist",
    industry: "Data & Analytics",
    certifications: [
      {
        name: "Google Data Analytics Certificate",
        provider: "Google",
        link: "https://www.coursera.org/professional-certificates/google-data-analytics",
        level: "Professional"
      },
      {
        name: "Microsoft Certified: Azure Data Scientist",
        provider: "Microsoft",
        link: "https://docs.microsoft.com/en-us/learn/certifications/azure-data-scientist/",
        level: "Associate"
      },
      {
        name: "IBM Data Science Professional",
        provider: "IBM",
        link: "https://www.coursera.org/professional-certificates/ibm-data-science",
        level: "Professional"
      },
      {
        name: "SAS Certified Specialist",
        provider: "SAS",
        link: "https://www.sas.com/en_us/certification.html",
        level: "Specialist"
      },
      {
        name: "Tableau Desktop Specialist",
        provider: "Tableau",
        link: "https://www.tableau.com/learn/certification/desktop-specialist",
        level: "Specialist"
      }
    ],
    courses: [
      {
        name: "IBM Data Science Professional Certificate",
        provider: "IBM/Coursera",
        duration: "6-12 months",
        type: "Professional Certification"
      },
      {
        name: "Microsoft Azure Data Fundamentals",
        provider: "Microsoft",
        duration: "2-4 weeks",
        type: "Foundation Course"
      },
      {
        name: "Google Analytics Academy",
        provider: "Google",
        duration: "Self-paced",
        type: "Free Professional"
      },
      {
        name: "SAS Programming Fundamentals",
        provider: "SAS",
        duration: "3-6 months",
        type: "Professional Training"
      },
      {
        name: "AWS Machine Learning Specialty",
        provider: "Amazon Web Services",
        duration: "Self-paced",
        type: "Cloud Training"
      },
      {
        name: "Oracle Database 19c Fundamentals",
        provider: "Oracle",
        duration: "Self-paced",
        type: "Free Training"
      },
      {
        name: "Cisco Data Center Unified Computing",
        provider: "Cisco",
        duration: "3-6 months",
        type: "Professional Training"
      },
      {
        name: "Salesforce Analytics Cloud",
        provider: "Salesforce Trailhead",
        duration: "Self-paced",
        type: "Free Learning"
      },
      {
        name: "Red Hat Data Analytics",
        provider: "Red Hat",
        duration: "Various",
        type: "Open Source Training"
      },
      {
        name: "Meta Marketing Analytics",
        provider: "Meta (Facebook)",
        duration: "4-6 months",
        type: "Professional Certificate"
      },
      {
        name: "GitHub Advanced Security",
        provider: "GitHub",
        duration: "Self-paced",
        type: "Free Training"
      },
      {
        name: "HubSpot Analytics Academy",
        provider: "HubSpot",
        duration: "Self-paced",
        type: "Free Certification"
      }
    ],
    jobs: [
      "Data Scientist",
      "Data Analyst",
      "Business Analyst",
      "Machine Learning Engineer",
      "Research Scientist",
      "Statistician",
      "Business Intelligence Analyst",
      "Quantitative Analyst"
    ],
    icon: FaChartLine,
    color: "green"
  },
  education: {
    title: "Education & Training",
    description: "You have a natural talent for teaching and helping others learn!",
    suggestedRole: "Online Instructor",
    industry: "Education Technology",
    certifications: [
      {
        name: "Google for Education Certified Trainer",
        provider: "Google",
        link: "https://edu.google.com/teacher-center/certifications/",
        level: "Professional"
      },
      {
        name: "Microsoft Certified Educator",
        provider: "Microsoft",
        link: "https://docs.microsoft.com/en-us/learn/certifications/microsoft-certified-educator/",
        level: "Educator"
      },
      {
        name: "Adobe Certified Instructor",
        provider: "Adobe",
        link: "https://www.adobe.com/training/instructor-led-training.html",
        level: "Instructor"
      },
      {
        name: "Coursera Teaching Online Certificate",
        provider: "Coursera",
        link: "https://www.coursera.org/learn/teach-online",
        level: "Teaching"
      },
      {
        name: "EdX Course Creator Certificate",
        provider: "edX",
        link: "https://www.edx.org/course/creating-an-online-course",
        level: "Creator"
      }
    ],
    courses: [
      {
        name: "Google for Education Fundamentals",
        provider: "Google",
        duration: "4-8 weeks",
        type: "Free Professional"
      },
      {
        name: "Microsoft Educator Community",
        provider: "Microsoft",
        duration: "Self-paced",
        type: "Professional Development"
      },
      {
        name: "Instructional Design Masterclass",
        provider: "Various Providers",
        duration: "8-12 weeks",
        type: "Specialized Training"
      },
      {
        name: "Online Teaching Certification",
        provider: "University Partners",
        duration: "3-6 months",
        type: "Academic Certificate"
      },
      {
        name: "IBM SkillsBuild Educator Resources",
        provider: "IBM",
        duration: "Self-paced",
        type: "Free Training"
      },
      {
        name: "Cisco Networking Academy Instructor Training",
        provider: "Cisco",
        duration: "3-6 months",
        type: "Professional Training"
      },
      {
        name: "Oracle Academy Teaching Resources",
        provider: "Oracle",
        duration: "Self-paced",
        type: "Free Educational"
      },
      {
        name: "AWS Educate Program",
        provider: "Amazon Web Services",
        duration: "Self-paced",
        type: "Cloud Education"
      },
      {
        name: "Salesforce for Education",
        provider: "Salesforce",
        duration: "Self-paced",
        type: "Free Platform Training"
      },
      {
        name: "Meta Education Programs",
        provider: "Meta (Facebook)",
        duration: "Various",
        type: "Digital Literacy"
      },
      {
        name: "HubSpot Academy for Educators",
        provider: "HubSpot",
        duration: "Self-paced",
        type: "Free Certification"
      },
      {
        name: "Adobe Creative Educator Level",
        provider: "Adobe",
        duration: "Self-paced",
        type: "Teaching Certification"
      }
    ],
    jobs: [
      "Online Instructor",
      "Instructional Designer",
      "Training Specialist",
      "Educational Consultant",
      "Learning Experience Designer",
      "Corporate Trainer",
      "Curriculum Developer",
      "EdTech Specialist"
    ],
    icon: FaGraduationCap,
    color: "indigo"
  },
  business: {
    title: "Business & Management",
    description: "You have strong leadership and business acumen!",
    suggestedRole: "Project Manager",
    industry: "Business & Consulting",
    certifications: [
      {
        name: "Project Management Professional (PMP)",
        provider: "PMI",
        link: "https://www.pmi.org/certifications/project-management-pmp",
        level: "Professional"
      },
      {
        name: "Google Project Management Certificate",
        provider: "Google",
        link: "https://www.coursera.org/professional-certificates/google-project-management",
        level: "Professional"
      },
      {
        name: "Microsoft Office Specialist",
        provider: "Microsoft",
        link: "https://www.microsoft.com/en-us/learning/mos-certification.aspx",
        level: "Specialist"
      },
      {
        name: "Salesforce Administrator",
        provider: "Salesforce",
        link: "https://trailhead.salesforce.com/credentials/administrator",
        level: "Administrator"
      },
      {
        name: "HubSpot Inbound Marketing",
        provider: "HubSpot",
        link: "https://academy.hubspot.com/courses/inbound-marketing",
        level: "Marketing"
      }
    ],
    courses: [
      {
        name: "Google Project Management Professional",
        provider: "Google/Coursera",
        duration: "3-6 months",
        type: "Professional Certificate"
      },
      {
        name: "Microsoft Business Applications",
        provider: "Microsoft",
        duration: "2-4 months",
        type: "Business Training"
      },
      {
        name: "Salesforce Trailhead",
        provider: "Salesforce",
        duration: "Self-paced",
        type: "Professional Platform"
      },
      {
        name: "MBA Essentials",
        provider: "Various Universities",
        duration: "6-12 months",
        type: "Executive Education"
      },
      {
        name: "IBM Business Analytics",
        provider: "IBM",
        duration: "4-6 months",
        type: "Professional Training"
      },
      {
        name: "Oracle Business Intelligence",
        provider: "Oracle",
        duration: "Self-paced",
        type: "Free Training"
      },
      {
        name: "Cisco Sales Training",
        provider: "Cisco",
        duration: "3-6 months",
        type: "Professional Development"
      },
      {
        name: "AWS Business Professional",
        provider: "Amazon Web Services",
        duration: "Self-paced",
        type: "Cloud Business"
      },
      {
        name: "Meta Marketing Science",
        provider: "Meta (Facebook)",
        duration: "6-8 weeks",
        type: "Marketing Certification"
      },
      {
        name: "HubSpot Academy Complete",
        provider: "HubSpot",
        duration: "Self-paced",
        type: "Free All-in-One"
      },
      {
        name: "Red Hat Business Value",
        provider: "Red Hat",
        duration: "Various",
        type: "Open Source Business"
      },
      {
        name: "GitHub for Teams",
        provider: "GitHub",
        duration: "Self-paced",
        type: "Free Collaboration"
      }
    ],
    jobs: [
      "Project Manager",
      "Business Analyst",
      "Digital Marketing Manager",
      "Product Manager",
      "Entrepreneur",
      "Management Consultant",
      "Operations Manager",
      "Business Development Manager"
    ],
    icon: FaBriefcase,
    color: "amber"
  }
};

const CareerAssessment = ({ onClose }) => {
  const navigate = useNavigate();
  const handleClose = onClose || (() => {
    if (localStorage.getItem('token') || localStorage.getItem('userInfo')) {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  });
  const [currentStep, setCurrentStep] = useState('education');
  const [educationLevel, setEducationLevel] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [interestScores, setInterestScores] = useState({});
  const [knowledgeScore, setKnowledgeScore] = useState(0);
  const [aiQuestions, setAiQuestions] = useState([]);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [results, setResults] = useState(null);
  const [previousResult, setPreviousResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [usedQuestionTopics, setUsedQuestionTopics] = useState(new Set());
  const [questionHistory, setQuestionHistory] = useState([]);
  const [questionHashes, setQuestionHashes] = useState(new Set());

  useEffect(() => {
    // Check for previous assessment results on load
    const loadSavedResult = async () => {
      try {
        const assessmentService = await import('../../services/assessmentService');
        const data = await assessmentService.default.getLatestAssessmentResult();
        if (data?.result) {
          setPreviousResult(data.result);
        }
      } catch (err) {
        console.log('No prior assessment found:', err);
      }
    };
    loadSavedResult();
  }, []);

  const viewPreviousResult = () => {
    if (previousResult) {
      setResults(previousResult);
      setCurrentStep('results');
    }
  };

  const handleEducationSubmit = () => {
    if (educationLevel) {
      setCurrentStep('assessment');
    }
  };

  const handleAnswerSelect = (answer) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    // For interest questions (1-10)
    if (currentQuestion < 10) {
      const newScores = { ...interestScores };
      const category = answer.category;
      newScores[category] = (newScores[category] || 0) + 1;
      setInterestScores(newScores);
    }
    // For knowledge questions (11-15)
    else if (currentQuestion < 15) {
      if (answer.correct) {
        setKnowledgeScore(prev => prev + 1);
      }
    }

    // Move to next question or generate AI questions
    if (currentQuestion < 14) {
      setCurrentQuestion(prev => prev + 1);
    } else if (currentQuestion === 14) {
      // Generate first AI question based on all 15 previous answers
      generateNextAIQuestion(newAnswers, 0);
    } else if (currentQuestion >= 15 && currentQuestion < 34) {
      // Generate next AI question based on all previous answers
      generateNextAIQuestion(newAnswers, currentQuestion - 14);
    } else {
      calculateResults(newAnswers);
    }
  };

  const generateNextAIQuestion = async (allAnswers, questionIndex) => {
    setIsGeneratingAI(true);
    
    try {
      // Create user profile for AI service
      const userProfile = { 
        educationLevel,
        currentQuestionIndex: questionIndex + 16,
        totalAnswers: allAnswers.length
      };

      // Create question history context to avoid duplicates
      const questionHistoryContext = questionHistory.map((q, i) => 
        `Q${i + 16}: "${q}"`
      ).join('\n');

      // Generate the next AI question based on all previous responses
      const nextQuestion = await generateSinglePersonalizedQuestion(
        userProfile, 
        interestScores, 
        knowledgeScore, 
        allAnswers,
        questionIndex,
        questionHistoryContext,
        Array.from(usedQuestionTopics)
      );
      
      if (nextQuestion && !isQuestionSimilar(nextQuestion.question, questionHistory)) {
        const questionHash = generateQuestionHash(nextQuestion.question);
        
        // Check if we've seen this exact question before
        if (!questionHashes.has(questionHash)) {
          const newAiQuestions = [...aiQuestions, nextQuestion];
          setAiQuestions(newAiQuestions);
          setCurrentQuestion(15 + questionIndex);
          
          // Track question history and hash
          setQuestionHistory(prev => [...prev, nextQuestion.question]);
          setQuestionHashes(prev => new Set([...prev, questionHash]));
          
          // Track used topics to avoid repetition
          const questionTopic = extractQuestionTopic(nextQuestion.question);
          setUsedQuestionTopics(prev => new Set([...prev, questionTopic]));
        } else {
          // Question hash exists, generate a unique fallback
          console.log('Duplicate question hash detected, generating fallback');
          generateUniqueFallback(questionIndex, allAnswers);
        }
      } else {
        // Question is similar, generate fallback
        console.log('Similar question detected, generating fallback');
        generateUniqueFallback(questionIndex, allAnswers);
      }
    } catch (error) {
      console.error('Error generating AI question:', error);
      generateUniqueFallback(questionIndex, allAnswers);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Generate a unique fallback question with multiple attempts
  const generateUniqueFallback = (questionIndex, allAnswers) => {
    const dominantInterest = Object.keys(interestScores).reduce((a, b) => 
      interestScores[a] > interestScores[b] ? a : b
    );
    
    let attempts = 0;
    let fallbackQuestion = null;
    let questionHash = null;
    
    // Try up to 5 times to generate a unique question
    while (attempts < 5) {
      fallbackQuestion = generateUniqueMockQuestion(dominantInterest, questionIndex + attempts, Array.from(usedQuestionTopics));
      questionHash = generateQuestionHash(fallbackQuestion.question);
      
      if (!questionHashes.has(questionHash) && !isQuestionSimilar(fallbackQuestion.question, questionHistory)) {
        break;
      }
      attempts++;
    }
    
    // If we still couldn't generate unique question, force uniqueness by adding identifier
    if (attempts >= 5 || questionHashes.has(questionHash)) {
      fallbackQuestion.question = `${fallbackQuestion.question} (Question ${questionIndex + 16})`;
      questionHash = generateQuestionHash(fallbackQuestion.question);
    }
    
    const newAiQuestions = [...aiQuestions, fallbackQuestion];
    setAiQuestions(newAiQuestions);
    setCurrentQuestion(15 + questionIndex);
    
    // Track fallback question
    setQuestionHistory(prev => [...prev, fallbackQuestion.question]);
    setQuestionHashes(prev => new Set([...prev, questionHash]));
    const questionTopic = extractQuestionTopic(fallbackQuestion.question);
    setUsedQuestionTopics(prev => new Set([...prev, questionTopic]));
  };

  // Enhanced check for question similarity with better duplicate detection
  const isQuestionSimilar = (newQuestion, history) => {
    if (!newQuestion || history.length === 0) return false;
    
    const newQuestionNormalized = newQuestion.toLowerCase()
      .replace(/[^\w\s]/g, '') // Remove punctuation
      .trim();
    
    // Extract key phrases (2-3 word combinations)
    const newQuestionWords = newQuestionNormalized.split(/\s+/);
    const newKeyPhrases = [];
    
    // Generate 2-word and 3-word phrases
    for (let i = 0; i < newQuestionWords.length - 1; i++) {
      if (newQuestionWords[i].length > 2 && newQuestionWords[i + 1].length > 2) {
        newKeyPhrases.push(`${newQuestionWords[i]} ${newQuestionWords[i + 1]}`);
      }
      if (i < newQuestionWords.length - 2 && newQuestionWords[i + 2].length > 2) {
        newKeyPhrases.push(`${newQuestionWords[i]} ${newQuestionWords[i + 1]} ${newQuestionWords[i + 2]}`);
      }
    }
    
    // Get significant words (exclude common question words)
    const commonWords = ['what', 'which', 'how', 'would', 'prefer', 'most', 'best', 'like', 'want', 
                        'you', 'your', 'the', 'and', 'or', 'but', 'with', 'for', 'are', 'is', 'do', 'does'];
    const significantWords = newQuestionWords.filter(word => 
      word.length > 3 && !commonWords.includes(word)
    );

    return history.some(existingQuestion => {
      const existingNormalized = existingQuestion.toLowerCase()
        .replace(/[^\w\s]/g, '')
        .trim();
      
      // Check for exact matches first
      if (newQuestionNormalized === existingNormalized) {
        return true;
      }
      
      // Check for phrase overlaps
      const existingWords = existingNormalized.split(/\s+/);
      const phraseMatches = newKeyPhrases.filter(phrase => 
        existingNormalized.includes(phrase)
      ).length;
      
      // If more than 2 key phrases match, it's too similar
      if (phraseMatches > 2) {
        return true;
      }
      
      // Check significant word overlap
      const matchingWords = significantWords.filter(word => 
        existingWords.some(existing => 
          existing.includes(word) || word.includes(existing) || 
          (word.length > 4 && existing.length > 4 && word.substring(0, 4) === existing.substring(0, 4))
        )
      );
      
      // If more than 50% of significant words match, consider it similar
      const similarity = significantWords.length > 0 ? matchingWords.length / significantWords.length : 0;
      return similarity > 0.5;
    });
  };

  // Simple hash function for question content
  const generateQuestionHash = (question) => {
    return question.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ')
      .filter(word => word.length > 3)
      .sort()
      .join('');
  };

  // Extract main topic from question for tracking
  const extractQuestionTopic = (question) => {
    const topicKeywords = {
      'work_environment': ['environment', 'workplace', 'office', 'remote', 'team'],
      'technology_tools': ['technology', 'tools', 'programming', 'coding', 'software'],
      'career_goals': ['career', 'goals', 'future', 'aspiration', 'growth'],
      'learning_style': ['learn', 'education', 'training', 'skill', 'development'],
      'project_types': ['project', 'work', 'task', 'challenge', 'problem'],
      'collaboration': ['team', 'collaborate', 'communication', 'group', 'social'],
      'innovation': ['innovation', 'creativity', 'new', 'unique', 'original'],
      'leadership': ['leadership', 'manage', 'lead', 'guide', 'mentor'],
      'technical_depth': ['technical', 'advanced', 'complex', 'expert', 'specialist'],
      'industry_focus': ['industry', 'sector', 'market', 'business', 'company']
    };

    for (const [topic, keywords] of Object.entries(topicKeywords)) {
      if (keywords.some(keyword => question.toLowerCase().includes(keyword))) {
        return topic;
      }
    }
    
    return `topic_${Math.random().toString(36).substring(7)}`;
  };

  // Generate a single AI question based on all previous responses
  const generateSinglePersonalizedQuestion = async (userProfile, interestScores, knowledgeScore, allAnswers, questionIndex, questionHistoryContext = '', usedTopics = []) => {
    try {
      // Use AI service to generate one question at a time
      const singleQuestion = await generatePersonalizedQuestions(
        userProfile, 
        interestScores, 
        knowledgeScore, 
        allAnswers,
        1, // Generate only 1 question
        questionIndex,
        questionHistoryContext,
        usedTopics
      );
      
      return singleQuestion[0]; // Return the first (and only) question
    } catch (error) {
      console.error('Error generating single AI question:', error);
      return null;
    }
  };

  // Generate a unique mock question that hasn't been used before
  const generateUniqueMockQuestion = (dominantInterest, questionIndex, usedTopics) => {
    // Define unique question categories to ensure variety
    const questionCategories = [
      "work_environment", "team_dynamics", "project_types", "skill_development", 
      "career_goals", "learning_style", "problem_solving", "innovation_approach",
      "communication_style", "leadership_interest", "technical_focus", "industry_preference",
      "work_life_balance", "risk_tolerance", "client_interaction", "creativity_level",
      "mentoring_interest", "global_perspective", "quality_focus", "time_management"
    ];

    // Filter out used topics to ensure uniqueness
    const availableCategories = questionCategories.filter(cat => !usedTopics.includes(cat));
    
    // If all categories are used, create hybrid categories
    const categoryToUse = availableCategories.length > 0 
      ? availableCategories[questionIndex % availableCategories.length]
      : `hybrid_${questionCategories[questionIndex % questionCategories.length]}_${Math.random().toString(36).substring(7)}`;

    const questionSets = {
      technology: {
        work_environment: {
          question: "What type of tech work environment motivates you most?",
          options: [
            { text: "Fast-paced startup with cutting-edge projects", category: "technology" },
            { text: "Established company with stable, long-term projects", category: "technology" },
            { text: "Remote-first company with flexible schedules", category: "technology" },
            { text: "Consulting firm working with diverse clients", category: "technology" }
          ]
        },
        team_dynamics: {
          question: "How do you prefer to collaborate on technical projects?",
          options: [
            { text: "Leading a small, agile development team", category: "technology" },
            { text: "Contributing as a specialist in a larger team", category: "technology" },
            { text: "Pair programming with senior developers", category: "technology" },
            { text: "Working independently with periodic check-ins", category: "technology" }
          ]
        },
        project_types: {
          question: "Which type of technology project excites you most?",
          options: [
            { text: "Building AI/ML applications that solve real problems", category: "technology" },
            { text: "Creating user-friendly mobile apps", category: "technology" },
            { text: "Developing secure, scalable backend systems", category: "technology" },
            { text: "Designing innovative web interfaces", category: "technology" }
          ]
        },
        skill_development: {
          question: "How do you prefer to advance your technical skills?",
          options: [
            { text: "Contributing to open-source projects", category: "technology" },
            { text: "Taking structured online courses and certifications", category: "technology" },
            { text: "Attending tech conferences and workshops", category: "technology" },
            { text: "Learning through challenging work projects", category: "technology" }
          ]
        },
        career_goals: {
          question: "Where do you see your tech career in 5 years?",
          options: [
            { text: "Technical architect designing system solutions", category: "technology" },
            { text: "Engineering manager leading development teams", category: "technology" },
            { text: "Principal engineer specializing in advanced tech", category: "technology" },
            { text: "CTO of a growing technology company", category: "technology" }
          ]
        },
        problem_solving: {
          question: "What type of technical challenges energize you?",
          options: [
            { text: "Optimizing performance and scalability issues", category: "technology" },
            { text: "Debugging complex system integration problems", category: "technology" },
            { text: "Designing elegant solutions to user problems", category: "technology" },
            { text: "Building robust security and data protection", category: "technology" }
          ]
        },
        innovation_approach: {
          question: "How do you approach technological innovation?",
          options: [
            { text: "Experimenting with bleeding-edge technologies", category: "technology" },
            { text: "Improving existing solutions incrementally", category: "technology" },
            { text: "Combining proven technologies in new ways", category: "technology" },
            { text: "Focusing on user-centered innovation", category: "technology" }
          ]
        },
        technical_focus: {
          question: "Which technical specialization path interests you?",
          options: [
            { text: "Frontend development with modern frameworks", category: "technology" },
            { text: "Backend systems and database architecture", category: "technology" },
            { text: "DevOps and cloud infrastructure management", category: "technology" },
            { text: "Mobile development for iOS and Android", category: "technology" }
          ]
        },
        learning_style: {
          question: "How do you learn new programming concepts best?",
          options: [
            { text: "Building real projects from scratch", category: "technology" },
            { text: "Following structured tutorials and courses", category: "technology" },
            { text: "Reading documentation and source code", category: "technology" },
            { text: "Collaborating with experienced developers", category: "technology" }
          ]
        },
        industry_preference: {
          question: "Which tech industry sector appeals to you most?",
          options: [
            { text: "FinTech and financial services", category: "technology" },
            { text: "HealthTech and medical applications", category: "technology" },
            { text: "EdTech and learning platforms", category: "technology" },
            { text: "Gaming and entertainment technology", category: "technology" }
          ]
        }
      },
      // Add similar comprehensive sets for other interests...
      creative: {
        work_environment: {
          question: "What creative work environment inspires you most?",
          options: [
            { text: "Design studio with collaborative creative spaces", category: "creative" },
            { text: "Agency with diverse client projects", category: "creative" },
            { text: "In-house design team for a specific brand", category: "creative" },
            { text: "Freelance setup with complete creative freedom", category: "creative" }
          ]
        },
        project_types: {
          question: "Which creative project type energizes you most?",
          options: [
            { text: "Brand identity design for new startups", category: "creative" },
            { text: "User interface design for apps and websites", category: "creative" },
            { text: "Marketing campaigns with visual storytelling", category: "creative" },
            { text: "Motion graphics and video content creation", category: "creative" }
          ]
        }
      },
      analytical: {
        work_environment: {
          question: "What type of data work environment suits you best?",
          options: [
            { text: "Research lab with academic freedom", category: "analytical" },
            { text: "Corporate analytics team with business impact", category: "analytical" },
            { text: "Consulting firm solving diverse data problems", category: "analytical" },
            { text: "Tech company with big data and ML challenges", category: "analytical" }
          ]
        },
        problem_solving: {
          question: "What type of analytical problems fascinate you?",
          options: [
            { text: "Predicting market trends and customer behavior", category: "analytical" },
            { text: "Optimizing operations and reducing costs", category: "analytical" },
            { text: "Discovering patterns in complex datasets", category: "analytical" },
            { text: "Building recommendation and decision systems", category: "analytical" }
          ]
        }
      },
      education: {
        work_environment: {
          question: "What educational environment energizes you most?",
          options: [
            { text: "Online platform reaching global learners", category: "education" },
            { text: "Corporate training and professional development", category: "education" },
            { text: "University or academic institution", category: "education" },
            { text: "Educational technology startup", category: "education" }
          ]
        },
        teaching_style: {
          question: "What teaching approach feels most natural to you?",
          options: [
            { text: "Interactive workshops with hands-on activities", category: "education" },
            { text: "Structured courses with clear learning paths", category: "education" },
            { text: "One-on-one mentoring and personalized guidance", category: "education" },
            { text: "Community-based learning with peer interaction", category: "education" }
          ]
        }
      },
      business: {
        work_environment: {
          question: "What business environment appeals to you most?",
          options: [
            { text: "High-growth startup with equity opportunities", category: "business" },
            { text: "Fortune 500 company with structured career paths", category: "business" },
            { text: "Consulting firm with diverse industry exposure", category: "business" },
            { text: "Non-profit organization with social impact", category: "business" }
          ]
        },
        leadership_style: {
          question: "What leadership approach resonates with you?",
          options: [
            { text: "Collaborative leader building consensus", category: "business" },
            { text: "Visionary leader driving innovation", category: "business" },
            { text: "Results-oriented leader focused on execution", category: "business" },
            { text: "Servant leader developing team members", category: "business" }
          ]
        }
      }
    };

    // Get the category questions, create fallback if needed
    const categoryQuestions = questionSets[dominantInterest] || questionSets.technology;
    let selectedQuestion;

    if (categoryQuestions[categoryToUse]) {
      selectedQuestion = categoryQuestions[categoryToUse];
    } else {
      // Create a unique fallback question
      selectedQuestion = {
        question: `What aspect of ${dominantInterest} work interests you most at this stage? (Question ${questionIndex + 1})`,
        options: [
          { text: `Foundational ${dominantInterest} skills and concepts`, category: dominantInterest },
          { text: `Advanced ${dominantInterest} techniques and methods`, category: dominantInterest },
          { text: `Leadership and team aspects of ${dominantInterest}`, category: dominantInterest },
          { text: `Innovation and future trends in ${dominantInterest}`, category: dominantInterest }
        ]
      };
    }

    return {
      id: 16 + questionIndex,
      question: selectedQuestion.question,
      options: selectedQuestion.options
    };
  };

  const calculateResults = async (allAnswers) => {
    setIsLoading(true);
    
    // Calculate dominant interest
    const dominantInterest = Object.keys(interestScores).reduce((a, b) => 
      interestScores[a] > interestScores[b] ? a : b
    );

    const recommendation = careerRecommendations[dominantInterest];
    
    const assessmentResults = {
      dominantInterest,
      recommendation,
      knowledgeScore,
      totalQuestions: 35,
      educationLevel,
      interestScores,
      completedAt: new Date().toISOString(),
      allAnswers: allAnswers || answers
    };

    setResults(assessmentResults);
    
    // Save results to localStorage for dashboard
    await saveAssessmentResults(assessmentResults);
    
    setCurrentStep('results');
    setIsLoading(false);
  };

  // Save assessment results to localStorage and update user profile
  const saveAssessmentResults = async (results) => {
    try {
      // Save to localStorage for immediate access
      const existingResults = JSON.parse(localStorage.getItem('assessmentResults') || '[]');
      const updatedResults = [results, ...existingResults.slice(0, 4)]; // Keep last 5 results
      localStorage.setItem('assessmentResults', JSON.stringify(updatedResults));
      localStorage.setItem('latestAssessmentResult', JSON.stringify(results));

      // Save to backend/database
      try {
        const assessmentService = await import('../../services/assessmentService');
        await assessmentService.default.saveAssessmentResult(results);
        console.log('Assessment results saved to backend successfully');
      } catch (backendError) {
        console.warn('Failed to save to backend, but localStorage save successful:', backendError);
      }
      
      console.log('Assessment results saved successfully');
    } catch (error) {
      console.error('Error saving assessment results:', error);
    }
  };

  // Fallback function for mock questions when AI service is unavailable
  const generateMockQuestions = (dominantInterest) => {
    const questionSets = {
      technology: [
        {
          question: "Which programming paradigm interests you most?",
          options: [
            { text: "Object-Oriented Programming (OOP)", category: "technology" },
            { text: "Functional Programming", category: "technology" },
            { text: "Procedural Programming", category: "technology" },
            { text: "Event-Driven Programming", category: "technology" }
          ]
        },
        {
          question: "What type of technology projects would you like to work on?",
          options: [
            { text: "E-commerce platforms and online stores", category: "technology" },
            { text: "Social media and communication apps", category: "technology" },
            { text: "Educational and learning platforms", category: "technology" },
            { text: "Gaming and entertainment software", category: "technology" }
          ]
        },
        {
          question: "Which development environment appeals to you?",
          options: [
            { text: "Frontend with modern frameworks like React/Vue", category: "technology" },
            { text: "Backend with APIs and databases", category: "technology" },
            { text: "Mobile app development for iOS/Android", category: "technology" },
            { text: "DevOps and cloud infrastructure", category: "technology" }
          ]
        },
        {
          question: "What motivates you in technology work?",
          options: [
            { text: "Building innovative solutions", category: "technology" },
            { text: "Solving complex technical challenges", category: "technology" },
            { text: "Creating user-friendly experiences", category: "technology" },
            { text: "Optimizing performance and efficiency", category: "technology" }
          ]
        },
        {
          question: "Which technology trend excites you most?",
          options: [
            { text: "Artificial Intelligence and Machine Learning", category: "technology" },
            { text: "Blockchain and Cryptocurrency", category: "technology" },
            { text: "Internet of Things (IoT)", category: "technology" },
            { text: "Augmented/Virtual Reality", category: "technology" }
          ]
        }
      ],
      creative: [
        {
          question: "Which design principle is most important to you?",
          options: [
            { text: "Visual aesthetics and beauty", category: "creative" },
            { text: "User experience and usability", category: "creative" },
            { text: "Brand consistency and identity", category: "creative" },
            { text: "Innovative and unique concepts", category: "creative" }
          ]
        },
        {
          question: "What type of creative projects inspire you?",
          options: [
            { text: "Website and app interface design", category: "creative" },
            { text: "Brand identity and logo design", category: "creative" },
            { text: "Digital marketing campaigns", category: "creative" },
            { text: "Video content and animations", category: "creative" }
          ]
        },
        {
          question: "Which creative tool would you most like to master?",
          options: [
            { text: "Adobe Creative Suite (Photoshop, Illustrator)", category: "creative" },
            { text: "Figma for UI/UX design", category: "creative" },
            { text: "Video editing software (Premiere, After Effects)", category: "creative" },
            { text: "3D modeling and animation tools", category: "creative" }
          ]
        },
        {
          question: "What drives your creative process?",
          options: [
            { text: "Solving visual communication problems", category: "creative" },
            { text: "Expressing artistic vision", category: "creative" },
            { text: "Creating emotional connections", category: "creative" },
            { text: "Following design trends and innovation", category: "creative" }
          ]
        },
        {
          question: "Which creative career path appeals most to you?",
          options: [
            { text: "Freelance designer with diverse clients", category: "creative" },
            { text: "In-house designer for a specific brand", category: "creative" },
            { text: "Creative director leading design teams", category: "creative" },
            { text: "Design consultant for multiple companies", category: "creative" }
          ]
        }
      ],
      analytical: [
        {
          question: "What type of data analysis interests you most?",
          options: [
            { text: "Predictive analytics and forecasting", category: "analytical" },
            { text: "Pattern recognition and insights", category: "analytical" },
            { text: "Statistical modeling and testing", category: "analytical" },
            { text: "Data visualization and reporting", category: "analytical" }
          ]
        },
        {
          question: "Which analytical tool would you like to specialize in?",
          options: [
            { text: "Python for data science and ML", category: "analytical" },
            { text: "R for statistical analysis", category: "analytical" },
            { text: "SQL for database analysis", category: "analytical" },
            { text: "Tableau/Power BI for visualization", category: "analytical" }
          ]
        },
        {
          question: "What type of problems do you enjoy solving with data?",
          options: [
            { text: "Business optimization and efficiency", category: "analytical" },
            { text: "Customer behavior and market research", category: "analytical" },
            { text: "Scientific research and discovery", category: "analytical" },
            { text: "Risk assessment and fraud detection", category: "analytical" }
          ]
        },
        {
          question: "Which industry would you like to apply analytics to?",
          options: [
            { text: "Healthcare and medical research", category: "analytical" },
            { text: "Finance and investment", category: "analytical" },
            { text: "Technology and software", category: "analytical" },
            { text: "Retail and e-commerce", category: "analytical" }
          ]
        },
        {
          question: "What aspect of data work excites you most?",
          options: [
            { text: "Discovering hidden insights in data", category: "analytical" },
            { text: "Building automated analysis systems", category: "analytical" },
            { text: "Presenting findings to stakeholders", category: "analytical" },
            { text: "Improving decision-making processes", category: "analytical" }
          ]
        }
      ],
      education: [
        {
          question: "What teaching method do you find most effective?",
          options: [
            { text: "Interactive hands-on workshops", category: "education" },
            { text: "Structured lectures with clear examples", category: "education" },
            { text: "Project-based collaborative learning", category: "education" },
            { text: "One-on-one mentoring and guidance", category: "education" }
          ]
        },
        {
          question: "Which subject area would you most like to teach?",
          options: [
            { text: "Technology and programming skills", category: "education" },
            { text: "Creative arts and design", category: "education" },
            { text: "Business and entrepreneurship", category: "education" },
            { text: "Personal development and soft skills", category: "education" }
          ]
        },
        {
          question: "What type of educational content would you create?",
          options: [
            { text: "Online video courses and tutorials", category: "education" },
            { text: "Interactive learning platforms", category: "education" },
            { text: "Written guides and documentation", category: "education" },
            { text: "Live workshops and webinars", category: "education" }
          ]
        },
        {
          question: "Who would be your ideal students?",
          options: [
            { text: "Complete beginners starting their journey", category: "education" },
            { text: "Professionals seeking skill advancement", category: "education" },
            { text: "Students preparing for careers", category: "education" },
            { text: "Entrepreneurs building businesses", category: "education" }
          ]
        },
        {
          question: "What motivates you most about teaching?",
          options: [
            { text: "Seeing students achieve their goals", category: "education" },
            { text: "Sharing knowledge and expertise", category: "education" },
            { text: "Building learning communities", category: "education" },
            { text: "Continuously learning and improving", category: "education" }
          ]
        }
      ],
      business: [
        {
          question: "Which business area interests you most?",
          options: [
            { text: "Strategic planning and growth", category: "business" },
            { text: "Operations and process improvement", category: "business" },
            { text: "Marketing and customer acquisition", category: "business" },
            { text: "Finance and investment decisions", category: "business" }
          ]
        },
        {
          question: "What type of business environment appeals to you?",
          options: [
            { text: "Fast-paced startups with high growth", category: "business" },
            { text: "Established corporations with resources", category: "business" },
            { text: "Consulting firms with diverse clients", category: "business" },
            { text: "Non-profit organizations with social impact", category: "business" }
          ]
        },
        {
          question: "Which business skill would you like to develop?",
          options: [
            { text: "Leadership and team management", category: "business" },
            { text: "Digital marketing and online presence", category: "business" },
            { text: "Financial analysis and budgeting", category: "business" },
            { text: "Project management and execution", category: "business" }
          ]
        },
        {
          question: "What business challenge excites you most?",
          options: [
            { text: "Launching new products or services", category: "business" },
            { text: "Entering new markets and regions", category: "business" },
            { text: "Improving customer satisfaction", category: "business" },
            { text: "Optimizing costs and efficiency", category: "business" }
          ]
        },
        {
          question: "What's your ideal business role?",
          options: [
            { text: "CEO or founder of your own company", category: "business" },
            { text: "Manager leading a specialized team", category: "business" },
            { text: "Consultant advising multiple businesses", category: "business" },
            { text: "Specialist focusing on your expertise", category: "business" }
          ]
        }
      ]
    };

    // Get the base questions for the dominant interest
    const baseQuestions = questionSets[dominantInterest] || questionSets.technology;
    
    // Create additional diverse questions to reach 20
    const additionalQuestions = [
      {
        question: "How do you prefer to stay updated with industry trends?",
        options: [
          { text: "Reading industry publications and blogs", category: dominantInterest },
          { text: "Attending conferences and networking events", category: dominantInterest },
          { text: "Taking online courses and certifications", category: dominantInterest },
          { text: "Following thought leaders on social media", category: dominantInterest }
        ]
      },
      {
        question: "What work schedule suits you best?",
        options: [
          { text: "Traditional 9-5 office hours", category: dominantInterest },
          { text: "Flexible hours with remote work", category: dominantInterest },
          { text: "Project-based with varied schedules", category: dominantInterest },
          { text: "Intensive periods with breaks between", category: dominantInterest }
        ]
      },
      {
        question: "How important is work-life balance to you?",
        options: [
          { text: "Essential - clear boundaries needed", category: dominantInterest },
          { text: "Important but flexible when needed", category: dominantInterest },
          { text: "Moderate - depends on the project", category: dominantInterest },
          { text: "Career growth takes priority", category: dominantInterest }
        ]
      },
      {
        question: "What size team do you work best with?",
        options: [
          { text: "Solo work with occasional collaboration", category: dominantInterest },
          { text: "Small team of 3-5 people", category: dominantInterest },
          { text: "Medium team of 6-15 people", category: dominantInterest },
          { text: "Large team with specialized roles", category: dominantInterest }
        ]
      },
      {
        question: "How do you handle challenging deadlines?",
        options: [
          { text: "Plan early and work steadily", category: dominantInterest },
          { text: "Break down into manageable tasks", category: dominantInterest },
          { text: "Focus intensively when needed", category: dominantInterest },
          { text: "Collaborate and delegate effectively", category: dominantInterest }
        ]
      },
      {
        question: "What type of feedback helps you grow most?",
        options: [
          { text: "Regular check-ins and guidance", category: dominantInterest },
          { text: "Detailed performance reviews", category: dominantInterest },
          { text: "Peer feedback and collaboration", category: dominantInterest },
          { text: "Self-assessment and reflection", category: dominantInterest }
        ]
      },
      {
        question: "Which achievement would make you most proud?",
        options: [
          { text: "Leading a successful project", category: dominantInterest },
          { text: "Mentoring someone to success", category: dominantInterest },
          { text: "Innovating a new solution", category: dominantInterest },
          { text: "Building a lasting impact", category: dominantInterest }
        ]
      },
      {
        question: "How do you approach learning new skills?",
        options: [
          { text: "Structured courses and tutorials", category: dominantInterest },
          { text: "Hands-on experimentation", category: dominantInterest },
          { text: "Learning from mentors", category: dominantInterest },
          { text: "Reading and research", category: dominantInterest }
        ]
      },
      {
        question: "What motivates you to excel in your work?",
        options: [
          { text: "Personal growth and mastery", category: dominantInterest },
          { text: "Recognition and achievement", category: dominantInterest },
          { text: "Making a positive impact", category: dominantInterest },
          { text: "Financial success and stability", category: dominantInterest }
        ]
      },
      {
        question: "Where do you see yourself in 5 years?",
        options: [
          { text: "Expert specialist in your field", category: dominantInterest },
          { text: "Leader managing teams and projects", category: dominantInterest },
          { text: "Entrepreneur with your own business", category: dominantInterest },
          { text: "Consultant helping multiple organizations", category: dominantInterest }
        ]
      },
      {
        question: "What type of workplace culture do you thrive in?",
        options: [
          { text: "Innovative and fast-paced", category: dominantInterest },
          { text: "Collaborative and supportive", category: dominantInterest },
          { text: "Results-oriented and competitive", category: dominantInterest },
          { text: "Balanced and people-focused", category: dominantInterest }
        ]
      },
      {
        question: "How do you prefer to communicate with colleagues?",
        options: [
          { text: "Face-to-face meetings and discussions", category: dominantInterest },
          { text: "Digital tools and platforms", category: dominantInterest },
          { text: "Written documentation and emails", category: dominantInterest },
          { text: "Quick check-ins and updates", category: dominantInterest }
        ]
      },
      {
        question: "What type of projects energize you most?",
        options: [
          { text: "Long-term strategic initiatives", category: dominantInterest },
          { text: "Short-term high-impact projects", category: dominantInterest },
          { text: "Continuous improvement efforts", category: dominantInterest },
          { text: "Crisis resolution and problem-solving", category: dominantInterest }
        ]
      },
      {
        question: "How important is creativity in your ideal job?",
        options: [
          { text: "Essential - need creative freedom", category: dominantInterest },
          { text: "Important - want some creative input", category: dominantInterest },
          { text: "Moderate - occasional creative tasks", category: dominantInterest },
          { text: "Less important - prefer structured work", category: dominantInterest }
        ]
      },
      {
        question: "What would make you change jobs?",
        options: [
          { text: "Better learning and growth opportunities", category: dominantInterest },
          { text: "Higher compensation and benefits", category: dominantInterest },
          { text: "More interesting and challenging work", category: dominantInterest },
          { text: "Better work-life balance", category: dominantInterest }
        ]
      }
    ];

    // Combine and select 20 questions
    const allQuestions = [...baseQuestions, ...additionalQuestions];
    const selectedQuestions = allQuestions.slice(0, 20);

    // Add IDs to the questions
    return selectedQuestions.map((q, index) => ({
      id: 16 + index,
      question: q.question,
      options: q.options
    }));
  };



  const resetAssessment = () => {
    setCurrentStep('education');
    setEducationLevel('');
    setCurrentQuestion(0);
    setAnswers([]);
    setInterestScores({});
    setKnowledgeScore(0);
    setAiQuestions([]);
    setUsedQuestionTopics(new Set());
    setQuestionHistory([]);
    setQuestionHashes(new Set());
    setResults(null);
  };

  const getCurrentQuestion = () => {
    if (currentQuestion < 10) {
      return predefinedQuestions.interest[currentQuestion];
    } else if (currentQuestion < 15) {
      return predefinedQuestions.knowledge[currentQuestion - 10];
    } else {
      return aiQuestions[currentQuestion - 15];
    }
  };

  const getProgressPercentage = () => {
    if (currentStep === 'education') return 10;
    if (currentStep === 'assessment') return 20 + (currentQuestion / 35) * 70;
    return 100;
  };

  const categoryMap = {
    technology: "Web Development",
    creative: "Design & UI/UX",
    analytical: "Data Science",
    business: "Business & Tech",
    education: "Business & Tech"
  };

  const colorClasses = {
    blue: 'bg-blue-50/90 text-blue-950 border-blue-200',
    purple: 'bg-purple-50/90 text-purple-950 border-purple-200',
    green: 'bg-emerald-50/90 text-emerald-950 border-emerald-200',
    indigo: 'bg-indigo-50/90 text-indigo-950 border-indigo-200',
    amber: 'bg-amber-50/90 text-amber-950 border-amber-200'
  };

  // Common Header Banner rendered on every page step
  const renderHeaderBanner = () => (
    <div className="bg-white border-b border-slate-200 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-4">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link to="/" className="hover:text-indigo-600 transition">Home</Link>
          <span>/</span>
          <span className="text-slate-800">AI Career Explorer</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold tracking-wide uppercase">
              <FaBrain className="text-indigo-600 text-xs" />
              <span>AI Career Guidance & Aptitude Discovery</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight mt-2">
              AI Career Explorer & Aptitude Discovery
            </h1>
            <p className="text-slate-600 text-sm sm:text-base mt-1.5 max-w-2xl leading-relaxed">
              Uncover your natural cognitive strengths, test core programming readiness, and let adaptive Gemini AI synthesize a custom career roadmap with matching EduPlatform courses.
            </p>
          </div>

          {/* Quick Highlights / Badges */}
          <div className="flex flex-wrap md:flex-col items-start gap-2 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-xs text-slate-600 self-start shrink-0">
            <div className="flex items-center gap-2 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>35 Curated & Adaptive Questions</span>
            </div>
            <div className="flex items-center gap-2 font-medium">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              <span>~8–10 Minutes Completion</span>
            </div>
            <div className="flex items-center gap-2 font-medium">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span>Personalized Course Roadmap</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Common Stepper Progress Tracker
  const renderStepper = () => (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            Assessment Progress
          </span>
          <span className="text-slate-300">•</span>
          <span className="text-xs font-semibold text-slate-600">
            {currentStep === 'education' && "Stage 1: Background & Education Profile"}
            {currentStep === 'assessment' && (
              currentQuestion < 10 ? "Stage 2: Natural Passions & Interest Discovery" :
              currentQuestion < 15 ? "Stage 3: Foundational Technical Literacy" :
              "Stage 4: Adaptive Gemini AI Deep Dive"
            )}
            {currentStep === 'results' && "Stage 5: Career Report & Custom Learning Roadmap"}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {currentStep === 'assessment' && (
            <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
              Question {currentQuestion + 1} of 35
            </span>
          )}
          <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
            {Math.round(getProgressPercentage())}%
          </span>
        </div>
      </div>

      {/* Progress Bar Track */}
      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden p-0.5 border border-slate-200/60">
        <div
          className="bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 h-full rounded-full transition-all duration-300 shadow-xs"
          style={{ width: `${getProgressPercentage()}%` }}
        />
      </div>

      {/* Visual Milestones */}
      <div className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-slate-100 text-[11px] font-semibold text-slate-500">
        <div className={`flex items-center gap-1.5 ${currentStep === 'education' ? 'text-indigo-600 font-bold' : (currentStep === 'assessment' || currentStep === 'results') ? 'text-emerald-600' : ''}`}>
          <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] ${
            currentStep === 'education' ? 'bg-indigo-600 text-white font-bold' :
            (currentStep === 'assessment' || currentStep === 'results') ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600'
          }`}>
            {(currentStep === 'assessment' || currentStep === 'results') ? '✓' : '1'}
          </span>
          <span className="hidden sm:inline">1. Education</span>
        </div>

        <div className={`flex items-center gap-1.5 ${currentStep === 'assessment' && currentQuestion < 10 ? 'text-indigo-600 font-bold' : (currentStep === 'assessment' && currentQuestion >= 10) || currentStep === 'results' ? 'text-emerald-600' : ''}`}>
          <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] ${
            currentStep === 'assessment' && currentQuestion < 10 ? 'bg-indigo-600 text-white font-bold' :
            ((currentStep === 'assessment' && currentQuestion >= 10) || currentStep === 'results') ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600'
          }`}>
            {((currentStep === 'assessment' && currentQuestion >= 10) || currentStep === 'results') ? '✓' : '2'}
          </span>
          <span className="hidden sm:inline">2. Interests (10)</span>
        </div>

        <div className={`flex items-center gap-1.5 ${currentStep === 'assessment' && currentQuestion >= 10 && currentQuestion < 15 ? 'text-indigo-600 font-bold' : (currentStep === 'assessment' && currentQuestion >= 15) || currentStep === 'results' ? 'text-emerald-600' : ''}`}>
          <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] ${
            currentStep === 'assessment' && currentQuestion >= 10 && currentQuestion < 15 ? 'bg-indigo-600 text-white font-bold' :
            ((currentStep === 'assessment' && currentQuestion >= 15) || currentStep === 'results') ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600'
          }`}>
            {((currentStep === 'assessment' && currentQuestion >= 15) || currentStep === 'results') ? '✓' : '3'}
          </span>
          <span className="hidden sm:inline">3. Knowledge (5)</span>
        </div>

        <div className={`flex items-center gap-1.5 ${currentStep === 'assessment' && currentQuestion >= 15 ? 'text-indigo-600 font-bold' : currentStep === 'results' ? 'text-emerald-600' : ''}`}>
          <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] ${
            currentStep === 'assessment' && currentQuestion >= 15 ? 'bg-indigo-600 text-white font-bold' :
            currentStep === 'results' ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600'
          }`}>
            {currentStep === 'results' ? '✓' : '4'}
          </span>
          <span className="hidden sm:inline">4. AI Deep Dive (20)</span>
        </div>
      </div>
    </div>
  );

  // 1. STEP: EDUCATION BACKGROUND SELECTION
  if (currentStep === 'education') {
    return (
      <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans antialiased pb-24">
        {renderHeaderBanner()}

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          {renderStepper()}

          {/* Previous Result Banner if Available */}
          {previousResult && (
            <div className="mb-8 p-5 bg-gradient-to-r from-indigo-50 via-purple-50 to-blue-50 border border-indigo-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-lg shrink-0 shadow-md">
                  <FaAward />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Previous Career Report on File</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    You have an existing assessment recommendation for <span className="font-semibold text-indigo-700">{previousResult.recommendation?.title || previousResult.dominantInterest}</span>.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                <button
                  onClick={viewPreviousResult}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
                >
                  View Saved Report
                </button>
              </div>
            </div>
          )}

          {/* Education Selection Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-10 mb-8">
            <div className="text-center max-w-xl mx-auto mb-8">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-4 text-3xl shadow-xs">
                <FaUserGraduate />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-2">
                What is your current background?
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Select your current level so our adaptive AI can calibrate question difficulty and tailor career suggestions specifically to your stage.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {[
                { value: 'school', label: 'High School Student', desc: 'Exploring early tech interests, future college majors, and coding foundations.', icon: '🎓' },
                { value: 'secondary', label: 'Higher Secondary Student', desc: 'Preparing for higher education degrees and technical specializations.', icon: '📚' },
                { value: 'undergraduate', label: 'Undergraduate / College Student', desc: 'Targeting industry-ready skill sets, high-paying tech internships, and graduate roles.', icon: '🎯' },
                { value: 'professional', label: 'Working Professional / Career Switcher', desc: 'Upskilling or transitioning into high-demand engineering, cloud, or AI careers.', icon: '💼' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setEducationLevel(option.value)}
                  className={`p-5 rounded-2xl border-2 transition-all duration-200 text-left flex items-start space-x-4 cursor-pointer ${
                    educationLevel === option.value
                      ? 'border-indigo-600 bg-indigo-50/60 shadow-md ring-2 ring-indigo-500/20'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/80 bg-white'
                  }`}
                >
                  <span className="text-3xl p-2.5 bg-white rounded-xl shadow-xs border border-slate-100 shrink-0">{option.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-sm sm:text-base">{option.label}</span>
                      {educationLevel === option.value && (
                        <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] shrink-0">
                          <FaCheck />
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{option.desc}</p>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-100">
              <button
                onClick={handleClose}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 transition flex items-center gap-1.5"
              >
                <FaArrowLeft className="text-[10px]" />
                <span>Return to Dashboard</span>
              </button>
              <button
                onClick={handleEducationSubmit}
                disabled={!educationLevel}
                className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-indigo-500/20 flex items-center justify-center gap-2"
              >
                <span>Begin Career Assessment</span>
                <FaArrowRight className="text-xs" />
              </button>
            </div>
          </div>

          {/* Value Props Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg mb-3">
                <FaCompass />
              </div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">Adaptive AI Profiling</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Evaluates your cognitive passions and problem-solving preferences to suggest matching industries.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg mb-3">
                <FaChartLine />
              </div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">Industry Demand Calibration</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Aligns your natural strengths with high-growth technology sectors like Cloud, Full-Stack, and AI.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-lg mb-3">
                <FaBookOpen />
              </div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">EduPlatform Integration</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Connects directly to courses, certificates, and learning tracks available right on our platform.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. IN-PAGE AI LOADING OR COMPUTING STATE
  if (isGeneratingAI || isLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans antialiased pb-24">
        {renderHeaderBanner()}

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          {renderStepper()}

          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-10 sm:p-14 text-center max-w-2xl mx-auto my-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 animate-pulse"></div>
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-5 shadow-xs">
              <FaSpinner className="text-3xl text-indigo-600 animate-spin" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2 tracking-tight">
              {isLoading ? "Synthesizing Career Recommendations" : "AI Crafting Next Questions"}
            </h3>
            <p className="text-slate-600 text-sm max-w-md mx-auto leading-relaxed">
              {isLoading 
                ? "Gemini AI is analyzing your answers, technical readiness, and computing your personalized career roadmap..."
                : "Gemini AI is analyzing your responses and generating personalized adaptive questions tailored to your profile..."}
            </p>
            <div className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-indigo-700 bg-indigo-50 px-4 py-2 rounded-full border border-indigo-100">
              <FaBrain className="text-indigo-600 text-xs animate-bounce" />
              <span>Calibrating with current industry tech benchmarks</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. STEP: RESULTS AND PERSONALIZED CAREER REPORT
  if (currentStep === 'results' && results) {
    const { recommendation } = results;
    const IconComponent = recommendation?.icon || FaBriefcase;

    return (
      <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans antialiased pb-24">
        {renderHeaderBanner()}

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
          {renderStepper()}

          {/* Success Notification Banner */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-5 shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-3xl shrink-0 shadow-md">
              <FaCheckCircle />
            </div>
            <div className="text-center sm:text-left">
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Assessment Complete
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-0.5">
                Your Personalized Tech Career Roadmap
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                We've evaluated your responses across interest, technical knowledge, and AI profiling to identify your top match.
              </p>
            </div>
          </div>

          {/* Dominant Career Recommendation Billboard */}
          <div className={`rounded-3xl p-6 sm:p-10 border-2 shadow-md ${colorClasses[recommendation.color] || 'bg-indigo-50 border-indigo-200 text-indigo-900'}`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-current/15">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-3xl shrink-0">
                  <IconComponent />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white text-xs font-black uppercase tracking-wider mb-1.5 shadow-xs">
                    <FaStar className="text-amber-500 text-[11px]" />
                    <span>Top Career Match</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black tracking-tight">{recommendation.title}</h3>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  to={`/courses?category=${encodeURIComponent(categoryMap[results.dominantInterest] || 'Web Development')}`}
                  className="px-6 py-3 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition shadow-md flex items-center gap-2"
                >
                  <FaBookOpen />
                  <span>Browse Matching Courses</span>
                </Link>
              </div>
            </div>

            <p className="text-base sm:text-lg mt-6 leading-relaxed opacity-90">
              {recommendation.description}
            </p>

            {/* Certifications & Target Roles */}
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              {/* Certifications */}
              <div className="bg-white rounded-2xl p-6 shadow-xs border border-white/60">
                <h4 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <FaCertificate className="text-amber-500" />
                  <span>Recommended Industry Certifications</span>
                </h4>
                <div className="space-y-3">
                  {recommendation.certifications.map((cert, index) => (
                    <div key={index} className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80 flex items-center justify-between gap-3">
                      <div>
                        <h5 className="font-bold text-slate-900 text-sm">{cert.name}</h5>
                        <p className="text-xs text-slate-500 mt-0.5">{cert.provider} • {cert.level}</p>
                      </div>
                      <a
                        href={cert.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition shrink-0 flex items-center gap-1 shadow-xs"
                      >
                        <span>View</span>
                        <FaExternalLinkAlt className="text-[10px]" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* Target Roles */}
              <div className="bg-white rounded-2xl p-6 shadow-xs border border-white/60">
                <h4 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <FaBriefcase className="text-indigo-600" />
                  <span>High-Demand Industry Roles</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {recommendation.jobs.map((job, index) => (
                    <div key={index} className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-bold text-slate-800">
                      <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0"></span>
                      <span>{job}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recommended Course Modules */}
            <div className="mt-8 bg-white rounded-2xl p-6 shadow-xs border border-white/60">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <FaBookOpen className="text-indigo-600" />
                  <span>Recommended Curriculum & Tech Modules</span>
                </h4>
                <Link
                  to="/courses"
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition"
                >
                  View Full Catalog &rarr;
                </Link>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {recommendation.courses.map((course, index) => (
                  <div key={index} className="bg-gradient-to-br from-slate-50 to-indigo-50/40 rounded-xl p-4 border border-slate-200/80">
                    <h5 className="font-bold text-slate-900 text-sm mb-1.5">{course.name}</h5>
                    <div className="flex flex-wrap gap-2 text-[11px] text-slate-600">
                      <span className="bg-white px-2 py-0.5 rounded-md border border-slate-200">
                        Provider: {course.provider}
                      </span>
                      <span className="bg-white px-2 py-0.5 rounded-md border border-slate-200">
                        Duration: {course.duration}
                      </span>
                      <span className="bg-indigo-100 text-indigo-800 font-semibold px-2 py-0.5 rounded-md">
                        {course.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Assessment Scorecard */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
            <h4 className="text-base font-bold text-slate-900 mb-6">Assessment Scorecard & Metrics</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-center">
                <div className="text-3xl font-black text-indigo-600">{results.totalQuestions || 35}</div>
                <div className="text-xs font-bold text-slate-600 mt-1">Questions Answered</div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-center">
                <div className="text-3xl font-black text-emerald-600">{results.knowledgeScore}/5</div>
                <div className="text-xs font-bold text-slate-600 mt-1">Technical Readiness Score</div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100 text-center">
                <div className="text-2xl font-black text-amber-600 capitalize">
                  {results.educationLevel || 'Undergraduate'}
                </div>
                <div className="text-xs font-bold text-slate-600 mt-1">Education Profile</div>
              </div>
            </div>
          </div>

          {/* Bottom Actions Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs">
            <button
              onClick={resetAssessment}
              className="w-full sm:w-auto px-6 py-3 border border-slate-300 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <FaRedo />
              <span>Retake Assessment</span>
            </button>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <Link
                to="/dashboard"
                className="w-full sm:w-auto px-6 py-3 border border-indigo-200 bg-indigo-50 text-indigo-700 font-bold text-xs rounded-xl hover:bg-indigo-100 transition text-center"
              >
                Go to My Dashboard
              </Link>
              <Link
                to={`/courses?category=${encodeURIComponent(categoryMap[results.dominantInterest] || 'Web Development')}`}
                className="w-full sm:w-auto px-8 py-3 bg-indigo-600 text-white font-bold text-xs rounded-xl hover:bg-indigo-700 transition shadow-sm text-center flex items-center justify-center gap-2"
              >
                <span>Explore Matching Courses</span>
                <FaArrowRight className="text-[10px]" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 4. STEP: ACTIVE QUESTION ANSWERING
  const question = getCurrentQuestion();
  if (!question) {
    return (
      <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans antialiased pb-24">
        {renderHeaderBanner()}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          {renderStepper()}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-12 text-center max-w-lg mx-auto">
            <FaSpinner className="text-3xl text-indigo-600 animate-spin mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-800">Preparing next question...</h3>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans antialiased pb-24">
      {renderHeaderBanner()}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {renderStepper()}

        {/* Question Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-10 mb-8">
          {/* Question Stage Indicator */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 text-lg shrink-0">
                {currentQuestion < 10 && <FaBrain />}
                {currentQuestion >= 10 && currentQuestion < 15 && <FaLaptopCode className="text-emerald-600" />}
                {currentQuestion >= 15 && <FaRocket className="text-violet-600" />}
              </div>
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                  {currentQuestion < 10 ? 'Phase 1: Interest Discovery' : 
                   currentQuestion < 15 ? 'Phase 2: Knowledge Assessment' : 
                   'Phase 3: Adaptive Gemini AI'}
                </div>
                <div className="text-xs text-slate-500">
                  {currentQuestion < 10 ? 'Discovering your work preferences & natural affinities' :
                   currentQuestion < 15 ? 'Checking foundational tech & coding literacy' :
                   'Dynamic questions generated specifically based on your answers'}
                </div>
              </div>
            </div>

            <div className="text-xs font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
              #{currentQuestion + 1}
            </div>
          </div>

          {/* Question Statement */}
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-8 leading-snug tracking-tight">
            {question.question}
          </h2>

          {/* Options */}
          <div className="space-y-3.5 mb-8">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                className="w-full p-4 sm:p-5 text-left border-2 border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/40 rounded-2xl transition-all duration-200 group flex items-center justify-between shadow-xs hover:shadow-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <div className="flex items-center gap-4">
                  <span className="w-9 h-9 rounded-xl border-2 border-slate-200 group-hover:border-indigo-600 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center text-sm font-bold text-slate-600 transition-colors shrink-0">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="font-semibold text-slate-800 text-sm sm:text-base group-hover:text-slate-900 leading-relaxed">
                    {option.text}
                  </span>
                </div>
                <FaArrowRight className="text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition text-xs shrink-0 ml-3" />
              </button>
            ))}
          </div>

          {/* Question Card Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-slate-100 text-xs text-slate-500">
            <button
              onClick={handleClose}
              className="text-slate-500 hover:text-slate-800 font-semibold transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <FaArrowLeft className="text-[10px]" />
              <span>Exit to Dashboard</span>
            </button>
            <span className="italic self-end sm:self-auto text-slate-400">
              {currentQuestion < 10 ? 'Select the option that most resonates with your passions' :
               currentQuestion < 15 ? 'Select the best answer based on your knowledge' :
               'Personalized AI question based on your previous responses'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerAssessment;
