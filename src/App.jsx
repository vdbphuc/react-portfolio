import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ChatBot from './ChatBot'; // Assuming ChatBot is still in src/
import Nav from './components/Nav';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import MonitorPage from './pages/MonitorPage';
import BlogPage from './pages/BlogPage';
import BlogPostDetail from './pages/BlogPostDetail';

export default function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // Lưu tham số token từ URL vào localStorage để xác thực với API
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("admin");
    if (token) {
      localStorage.setItem("adminToken", token);
      // Xóa query parameter trên thanh địa chỉ cho đẹp
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const isAdmin = !!localStorage.getItem("adminToken");

  return (
    <Router>
      <div className="bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-200 font-sans antialiased transition-colors duration-300 min-h-screen flex flex-col">
        <Nav theme={theme} setTheme={setTheme} language={language} setLanguage={setLanguage} />
        <Routes>
          <Route path="/" element={<HomePage language={language} />} />
          <Route 
            path="/monitor" 
            element={isAdmin ? <MonitorPage /> : <Navigate to="/" replace />} 
          />
          {/* <Route path="/chatbot" element={<ChatBot theme={theme} language={language} />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:id" element={<BlogPostDetail />} /> */}
        </Routes>
        <Footer language={language} />
      </div>
    </Router>
  );
}