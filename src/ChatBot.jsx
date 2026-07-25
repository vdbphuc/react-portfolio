import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Send, Bot, User, ArrowLeft, Sparkles, Zap } from 'lucide-react';
import { motion as Motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const API_URL = import.meta.env.VITE_API_URL || 'https://monitor-api.bida.asia/api/status';

const ChatBot = ({ theme, language }) => {
  const chatUrl = API_URL.replace("/api/status", "/api/chat");

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: language === 'vi'
        ? `Xin chào! Tôi là **AI Assistant** đại diện cho anh **Phúc Vũ** (Software Engineer & Scrum Master).\n\nTôi có thể trả lời mọi thắc mắc về kinh nghiệm viễn thông IMS, chứng chỉ CKAD / PSM I, hệ thống K3s Kubernetes, hoặc trạng thái máy chủ thời gian thực. Bạn muốn khám phá điều gì?`
        : `Hello! I am the **AI Assistant** representing **Phuc Vu** (Software Engineer & Scrum Master).\n\nI can help you with details about Phuc's IMS Telecom expertise, CKAD / PSM I certifications, K3s Kubernetes infrastructure, or live system health. How can I assist you today?`
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const quickPrompts = [
    { label: language === 'vi' ? '📊 Trạng thái máy chủ K3s' : '📊 Live Server Status', query: language === 'vi' ? 'Cho tôi biết trạng thái thời gian thực của máy chủ và các website?' : 'What is the live status of the server and websites?' },
    { label: language === 'vi' ? '📜 Chứng chỉ CKAD & PSM I' : '📜 CKAD & PSM I Certs', query: language === 'vi' ? 'Anh Phúc có các chứng chỉ quốc tế nào nổi bật?' : 'What certified credentials does Phuc hold?' },
    { label: language === 'vi' ? '⚡ Kinh nghiệm IMS & Erlang' : '⚡ IMS & Telecom Stack', query: language === 'vi' ? 'Kinh nghiệm của anh Phúc về hệ thống viễn thông IMS và Erlang như thế nào?' : "Tell me about Phuc's experience with IMS Telecom systems and Erlang." }
  ];

  const handleSendQuery = async (queryText) => {
    if (!queryText.trim() || isLoading) return;

    setInput('');
    setIsLoading(true);
    setMessages(prev => [...prev, { role: 'user', content: queryText }]);

    try {
      const history = messages.slice(1).map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await fetch(chatUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: queryText, history: history })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: result.response }]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: language === 'vi'
            ? '⚠️ Đã xảy ra lỗi kết nối với máy chủ. Vui lòng thử lại sau.'
            : '⚠️ An error occurred while connecting to the server. Please try again later.'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSendQuery(input);
  };

  return (
    <div className={`min-h-screen flex flex-col pt-20 bg-grid-pattern ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>

      {/* 3D Ambient Glow */}
      <div className="absolute top-20 left-1/3 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none animate-float-3d" />

      {/* Top Header Navigation Bar */}
      <div className="flex-none max-w-5xl w-full mx-auto px-4 sm:px-6 pt-2 pb-4 z-20">
        <div className="glass-3d-card rounded-3xl p-4 flex justify-between items-center border border-slate-200/80 dark:border-slate-800/80 shadow-lg">
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2 rounded-2xl glass-3d-card transition-all font-bold text-xs sm:text-sm hover:scale-105 text-slate-700 dark:text-slate-200"
          >
            <ArrowLeft size={16} />
            <span>{language === 'vi' ? 'Quay lại Portfolio' : 'Back to Portfolio'}</span>
          </Link>

          <div className="flex items-center gap-2.5">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <Sparkles className="text-purple-500 animate-pulse" size={20} />
            <h1 className="text-sm sm:text-base font-extrabold tracking-tight">AI Portfolio Assistant</h1>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-2xl glass-3d-card border border-emerald-500/30 text-emerald-400">
            <Zap size={14} className="text-emerald-400" />
            <span>Gemini AI</span>
          </div>
        </div>
      </div>

      {/* Main Chat Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 md:px-8 max-w-5xl w-full mx-auto space-y-6 scrollbar-thin z-10">
        {messages.map((msg, index) => (
          <Motion.div
            key={index}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={`flex gap-3.5 max-w-[90%] md:max-w-[82%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
          >
            {/* Avatar */}
            <div className={`w-9 h-9 rounded-2xl flex-shrink-0 flex items-center justify-center shadow-md ${
              msg.role === 'user'
                ? 'bg-gradient-to-tr from-indigo-600 to-purple-600 text-white'
                : 'glass-3d-card text-purple-400 border border-purple-500/30'
            }`}>
              {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
            </div>

            {/* Bubble Content */}
            <div className={`p-4 sm:p-5 rounded-3xl shadow-lg text-sm border leading-relaxed ${
              msg.role === 'user'
                ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-purple-700 text-white border-indigo-500/50 rounded-tr-none'
                : 'glass-3d-card border-slate-200/80 dark:border-slate-800/80 text-slate-800 dark:text-slate-100 rounded-tl-none'
            }`}>
              <div className="prose dark:prose-invert max-w-none text-inherit font-sans break-words text-sm sm:text-base">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {msg.content}
                </ReactMarkdown>
              </div>
            </div>
          </Motion.div>
        ))}

        {/* Loading Indicator Bubble */}
        {isLoading && (
          <Motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3.5 max-w-[80%]"
          >
            <div className="w-9 h-9 rounded-2xl flex-shrink-0 flex items-center justify-center shadow-md glass-3d-card text-purple-400 border border-purple-500/30">
              <Bot size={18} />
            </div>
            <div className="p-4 rounded-3xl glass-3d-card border border-purple-500/30 rounded-tl-none">
              <div className="flex items-center gap-2 py-1 px-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </Motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompt Chips & Input Form */}
      <div className="flex-none pb-6 px-4 max-w-5xl w-full mx-auto z-20 space-y-3">
        {/* Quick Suggestion Chips */}
        {messages.length < 5 && (
          <div className="flex flex-wrap gap-2 justify-center">
            {quickPrompts.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendQuery(chip.query)}
                disabled={isLoading}
                className="px-3.5 py-1.5 rounded-2xl glass-3d-card border border-purple-500/20 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-purple-500 dark:hover:text-purple-400 hover:border-purple-500/40 transition-all hover:scale-105 active:scale-95 shadow-sm"
              >
                {chip.label}
              </button>
            ))}
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={language === 'vi' ? 'Hỏi trợ lý ảo về Phúc Vũ hoặc trạng thái máy chủ...' : 'Ask AI about Phuc Vu or live infrastructure...'}
            disabled={isLoading}
            className="w-full py-4 pl-5 pr-14 rounded-3xl glass-3d-card border border-slate-300 dark:border-slate-800 text-sm font-medium transition-all shadow-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2.5 p-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-40 text-white rounded-2xl transition-all shadow-md shadow-purple-500/30 hover:scale-105 active:scale-95 flex items-center justify-center"
          >
            <Send size={18} />
          </button>
        </form>
      </div>

    </div>
  );
};

export default ChatBot;
