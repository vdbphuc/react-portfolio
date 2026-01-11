import React, { useState, useEffect } from 'react';
import { ArrowLeft, ExternalLink, AlertTriangle, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const ChatBot = ({ theme, language }) => {
  // 🔴 QUAN TRỌNG: Thay link dưới đây bằng link Vercel Chatbot của bạn
  const BASE_URL = "https://hacker-bot.vercel.app/";
  const [isLimitReached, setIsLimitReached] = useState(false);

  // (Tùy chọn) Truyền theme vào URL để chatbot tự đổi màu theo Portfolio
  // Ví dụ kết quả: https://...app?theme=dark
  const chatbotUrl = `${BASE_URL}?theme=${theme}`;

  useEffect(() => {
    const handleMessage = (event) => {
      // Check for the specific message type
      if (event.data && event.data.type === 'LIMIT_REACHED') {
        setIsLimitReached(true);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div className={`h-screen flex flex-col ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>

      {/* 1. Thanh Header (Nút quay lại) */}
      <div className={`flex-none px-4 py-3 flex justify-between items-center shadow-sm z-10 border-b ${theme === 'dark' ? 'bg-gray-900 border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-900'
        }`}>
        <Link
          to="/"
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
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
          className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
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

        {/* 3. Overlay khi hết lượt hỏi */}
        {isLimitReached && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-20">
            <div className={`max-w-md w-full p-6 rounded-2xl shadow-2xl text-center transform transition-all scale-100 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
              }`}>
              <div className="mx-auto w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
              </div>

              <h3 className="text-xl font-bold mb-2">
                {language === 'vi' ? 'Đã hết lượt hỏi hôm nay' : 'Daily Limit Reached'}
              </h3>

              <p className={`mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                {language === 'vi'
                  ? 'Bạn đã sử dụng hết lượt tương tác miễn phí trong ngày. Vui lòng quay lại vào ngày mai hoặc liên hệ trực tiếp với tôi.'
                  : 'You have used all your free interactions for today. Please come back tomorrow or contact me directly.'}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="mailto:phuc821644@gmail.com"
                  className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
                >
                  <Mail size={18} />
                  {language === 'vi' ? 'Gửi Email Liên Hệ' : 'Send Email'}
                </a>
                <Link
                  to="/"
                  className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-medium border transition-colors ${theme === 'dark'
                      ? 'border-gray-600 hover:bg-gray-700 text-gray-200'
                      : 'border-gray-300 hover:bg-gray-50 text-gray-700'
                    }`}
                >
                  {language === 'vi' ? 'Về Trang Chủ' : 'Return Home'}
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBot;