import React, { useState, useRef, useEffect } from 'react';
import { 
  FaComments, 
  FaTimes, 
  FaPaperPlane, 
  FaRobot, 
  FaUser,
  FaGraduationCap,
  FaBriefcase,
  FaQuestionCircle,
  FaHome,
  FaBookOpen,
  FaMagic
} from 'react-icons/fa';
import chatbotService from '../../services/chatbotService';

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "👋 Hi! I'm your Career Assistant! I can provide personalized guidance on:",
      isBot: true,
      timestamp: new Date(),
      quickReplies: [
        { text: "🎯 Career Discovery", action: "career" },
        { text: "📚 Learning Paths", action: "courses" },
        { text: "🛠️ Skill Assessment", action: "skills" },
        { text: "💡 Platform Guide", action: "about" }
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getAIResponse = async (userMessage, action = null) => {
    try {
      // Handle special actions first
      if (action) {
        switch (action) {
          case 'redirect_assessment':
            window.location.href = '/assessment';
            return { text: "Redirecting you to the career assessment...", quickReplies: [] };
          
          case 'menu':
            return await chatbotService.sendMessage("Show me the main menu with all available options");
          
          case 'assessment':
            return await chatbotService.sendMessage("Tell me about the career assessment and how it can help me");
          
          case 'courses':
            return await chatbotService.sendMessage("What courses are available and how can they help with my career?");
          
          case 'skills':
            return await chatbotService.sendMessage("I want to develop my skills. What should I focus on?");
          
          case 'about':
            return await chatbotService.sendMessage("Tell me about this platform and what it offers");
          
          case 'career':
            return await chatbotService.sendMessage("I need career guidance and recommendations");
          
          case 'help':
            return await chatbotService.sendMessage("I need help with my career and learning journey");
          
          default:
            return await chatbotService.handleQuickAction(action);
        }
      }
      
      // For regular messages, use AI service
      return await chatbotService.sendMessage(userMessage);
      
    } catch (error) {
      console.error('AI Response Error:', error);
      return {
        text: "I'm experiencing some connectivity issues with my AI brain! 🧠 But I'm still here to help! Try asking me about career assessments, courses, or platform features.",
        quickReplies: [
          { text: "Career Assessment", action: "assessment" },
          { text: "Browse Courses", action: "courses" },
          { text: "Platform Info", action: "about" },
          { text: "Try Again", action: "retry" }
        ]
      };
    }
  };

  const handleSendMessage = async (messageText = null, action = null) => {
    const text = messageText || inputValue.trim();
    if (!text && !action) return;

    // Add user message
    if (text && !action) {
      const userMessage = {
        id: Date.now(),
        text: text,
        isBot: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);
      setInputValue('');
    }

    // Show typing indicator
    setIsTyping(true);

    try {
      // Get AI response
      const aiResponse = await getAIResponse(text, action);
      
      const botMessage = {
        id: Date.now() + 1,
        text: aiResponse.text,
        isBot: true,
        timestamp: new Date(),
        quickReplies: aiResponse.quickReplies || []
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Message handling error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "I'm having some trouble connecting to my AI brain right now! 🤖💭 But I'm still here to help! Try asking about our career assessment, courses, or platform features.",
        isBot: true,
        timestamp: new Date(),
        quickReplies: [
          { text: "Career Assessment", action: "assessment" },
          { text: "Browse Courses", action: "courses" },
          { text: "Platform Info", action: "about" },
          { text: "Try Again", action: "retry" }
        ]
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickReply = (replyText, action) => {
    if (action === 'redirect_assessment') {
      // Navigate to assessment page
      window.location.href = '/assessment';
      return;
    }
    
    if (action === 'menu') {
      handleSendMessage('show main menu', 'start');
      return;
    }

    handleSendMessage(replyText, action);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={() => setIsOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200 border border-indigo-500/20"
            aria-label="Open Career Assistant"
          >
            <FaComments className="text-2xl" />
          </button>
          {/* Tooltip */}
          <div className="absolute bottom-16 right-0 bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-lg">
            Need help? Chat with our assistant!
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-slate-900"></div>
          </div>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[520px] bg-white rounded-3xl shadow-2xl border border-slate-200/90 z-50 flex flex-col overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="bg-slate-50/90 backdrop-blur-md px-5 py-4 flex items-center justify-between border-b border-slate-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-indigo-50 border border-indigo-100 rounded-full flex items-center justify-center">
                <FaRobot className="text-indigo-600 text-xl" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm tracking-tight">Career Assistant</h3>
                <p className="text-xs text-slate-500 font-medium">Always online to help you succeed</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 p-2 rounded-full transition-colors"
            >
              <FaTimes />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 border-b border-slate-100">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[82%] ${message.isBot ? 'order-2' : 'order-1'}`}>
                  <div className={`flex items-start space-x-2 ${message.isBot ? '' : 'flex-row-reverse space-x-reverse'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${message.isBot ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'bg-slate-200 text-slate-700'}`}>
                      {message.isBot ? <FaRobot className="text-xs" /> : <FaUser className="text-xs" />}
                    </div>
                    <div className={`rounded-2xl px-4 py-2.5 ${message.isBot ? 'bg-white border border-slate-200 text-slate-800 shadow-sm' : 'bg-indigo-600 text-white shadow-sm'}`}>
                      <p className="text-sm whitespace-pre-line leading-relaxed">{message.text}</p>
                      <p className={`text-[10px] mt-1 text-right font-medium ${message.isBot ? 'text-slate-400' : 'text-indigo-200'}`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                  
                  {/* Quick Replies */}
                  {message.quickReplies && message.quickReplies.length > 0 && (
                    <div className="mt-3 ml-10 space-y-2">
                      {message.quickReplies.map((reply, index) => (
                        <button
                          key={index}
                          onClick={() => handleQuickReply(reply.text, reply.action)}
                          className="block w-full text-left bg-white hover:bg-indigo-50/70 text-slate-700 hover:text-indigo-600 px-3.5 py-2.5 rounded-xl text-xs font-semibold border border-slate-200 hover:border-indigo-300 shadow-sm transition-all duration-150"
                        >
                          {reply.text}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-2">
                  <div className="w-8 h-8 bg-indigo-50 border border-indigo-100 rounded-full flex items-center justify-center text-indigo-600 shrink-0">
                    <FaRobot className="text-xs" />
                  </div>
                  <div className="bg-white border border-slate-200 shadow-sm rounded-2xl px-4 py-2.5">
                    <div className="flex space-x-1 py-1">
                      <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3.5 bg-white">
            <div className="flex space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-4 py-2.5 focus:outline-none focus:border-indigo-600 focus:bg-white text-sm text-slate-900 placeholder-slate-400 transition"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-full shadow hover:shadow-md transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              >
                <FaPaperPlane className="text-xs" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingChatbot;
