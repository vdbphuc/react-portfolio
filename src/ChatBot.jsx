import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, Sparkles, User, Bot } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const ChatBot = ({ theme, language }) => {
  const API_URL = import.meta.env.VITE_API_URL || "https://distributors-marshall-accepted-athens.trycloudflare.com/api/status";
  const chatUrl = API_URL.replace("/api/status", "/api/chat");

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: language === 'vi'
        ? 'Xin chào! Tôi là **AI Assistant** đại diện cho anh **Phúc Vũ**.\n\nTôi có thể trả lời các câu hỏi về thông tin cá nhân, kinh nghiệm, kỹ năng, các chứng chỉ của anh Phúc, cũng như trạng thái hoạt động thực tế của máy chủ này. Bạn muốn hỏi gì?'
        : 'Hello! I am the **AI Assistant** representing **Phuc Vu**.\n\nI can help you with details about Phuc\'s background, projects, skills, certifications, and the live status of this infrastructure. How can I help you today?'
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    // Add user message to UI
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      // Build history excluding the greeting message
      const history = messages.slice(1).map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await fetch(chatUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: userMessage,
          history: history
        })
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

  return (
    <div className={`h-screen flex flex-col pt-16 ${theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'}`}>

      {/* Top Navigation Bar */}
      <div className={`flex-none px-6 py-4 flex justify-between items-center border-b backdrop-blur-md z-10 transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-200'
        }`}>
        <Link
          to="/"
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-semibold text-sm ${theme === 'dark' ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-600'
            }`}
        >
          <ArrowLeft size={16} />
          <span>{language === 'vi' ? 'Quay lại Portfolio' : 'Back to Portfolio'}</span>
        </Link>
        <div className="flex items-center gap-2">
          <Sparkles className="text-indigo-500 animate-pulse" size={20} />
          <h1 className="text-base font-bold tracking-tight">AI Portfolio Assistant</h1>
        </div>
        <div className="w-20 hidden sm:block"></div> {/* Spacer to center the title */}
      </div>

      {/* Main Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8 max-w-4xl w-full mx-auto space-y-6 scrollbar-thin">
        {messages.map((msg, index) => (
          <Motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex gap-3.5 max-w-[85%] md:max-w-[80%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
          >
            {/* Avatar */}
            <div className={`w-8.5 h-8.5 rounded-full flex-shrink-0 flex items-center justify-center shadow-sm ${msg.role === 'user'
                ? 'bg-indigo-600 text-white'
                : (theme === 'dark' ? 'bg-slate-800 text-indigo-400 border border-slate-700' : 'bg-indigo-50 text-indigo-600 border border-indigo-100')
              }`}>
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>

            {/* Bubble content */}
            <div className={`p-4 rounded-2xl shadow-sm text-sm border leading-relaxed ${msg.role === 'user'
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white border-indigo-500 rounded-tr-none'
                : (theme === 'dark'
                  ? 'bg-slate-850 border-slate-800 text-slate-100 rounded-tl-none'
                  : 'bg-white border-slate-200 text-slate-800 rounded-tl-none')
              }`}>
              <div className="prose dark:prose-invert max-w-none text-inherit font-sans break-words">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {msg.content}
                </ReactMarkdown>
              </div>
            </div>
          </Motion.div>
        ))}

        {/* Loading Bubble */}
        {isLoading && (
          <Motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3.5 max-w-[80%]"
          >
            <div className={`w-8.5 h-8.5 rounded-full flex-shrink-0 flex items-center justify-center shadow-sm ${theme === 'dark' ? 'bg-slate-800 text-indigo-400 border border-slate-700' : 'bg-indigo-50 text-indigo-600 border border-indigo-100'
              }`}>
              <Bot size={16} />
            </div>
            <div className={`p-4 rounded-2xl shadow-sm border rounded-tl-none ${theme === 'dark' ? 'bg-slate-850 border-slate-800' : 'bg-white border-slate-200'
              }`}>
              <div className="flex items-center gap-1.5 py-1 px-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </Motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Message Area */}
      <div className={`flex-none py-4 px-4 border-t backdrop-blur-md transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-900/50 border-slate-850' : 'bg-white/50 border-slate-200'
        }`}>
        <form onSubmit={handleSubmit} className="max-w-4xl w-full mx-auto relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={language === 'vi' ? 'Hỏi trợ lý ảo về Phúc Vũ hoặc hệ thống...' : 'Ask the AI about Phuc Vu or the infrastructure...'}
            disabled={isLoading}
            className={`w-full py-3.5 pl-4 pr-14 rounded-2xl border text-sm font-medium transition-all shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${theme === 'dark'
                ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-500 focus:border-indigo-500'
                : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:border-indigo-500'
              }`}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 px-3.5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-600/30 text-white rounded-xl transition-all shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/35"
          >
            <Send size={16} />
          </button>
        </form>
      </div>

    </div>
  );
};

export default ChatBot;