import React from 'react';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const ChatBot = ({ theme, language }) => {
  // 🔴 QUAN TRỌNG: Thay link dưới đây bằng link Vercel Chatbot của bạn
  const BASE_URL = "https://hacker-bot.vercel.app/";
  
  // (Tùy chọn) Truyền theme vào URL để chatbot tự đổi màu theo Portfolio
  // Ví dụ kết quả: https://...app?theme=dark
  const chatbotUrl = `${BASE_URL}?theme=${theme}`;

  return (
    <div className={`h-screen flex flex-col ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      
      {/* 1. Thanh Header (Nút quay lại) */}
      <div className={`flex-none px-4 py-3 flex justify-between items-center shadow-sm z-10 border-b ${
        theme === 'dark' ? 'bg-gray-900 border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-900'
      }`}>
        <Link 
          to="/" 
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            theme === 'dark' ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
          }`}
        >
          <ArrowLeft size={20} />
          <span className="font-medium">{language === 'vi' ? 'Quay lại Portfolio' : 'Back to Portfolio'}</span>
        </Link>

        <h1 className="text-lg font-bold hidden sm:block">AI Assistant</h1>

        {/* Nút mở full tab mới (nếu người dùng muốn) */}
        <a 
          href={BASE_URL} 
          target="_blank" 
          rel="noopener noreferrer" 
          className={`p-2 rounded-lg transition-colors ${
            theme === 'dark' ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
          }`}
          title="Open in new tab"
        >
          <ExternalLink size={20} />
        </a>
      </div>

      {/* 2. Khung Iframe chứa Chatbot */}
      <div className="flex-1 w-full relative bg-transparent">
        <iframe 
          src={chatbotUrl}
          title="ChatBot Interface"
          className="absolute inset-0 w-full h-full border-none"
          allow="microphone; camera; clipboard-write" // Cấp quyền nếubot cần (ví dụ voice chat)
        />
      </div>
    </div>
  );
};

export default ChatBot;