import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChatBot from './ChatBot'; // Assuming ChatBot is still in src/
import Nav from './components/Nav';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import MonitorPage from './pages/MonitorPage';

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

  return (
    <Router>
      <div className="bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-200 font-sans antialiased transition-colors duration-300 min-h-screen flex flex-col">
        <Nav theme={theme} setTheme={setTheme} language={language} setLanguage={setLanguage} />
        <Routes>
          <Route path="/" element={<HomePage language={language} />} />
          <Route path="/chatbot" element={<ChatBot theme={theme} language={language} />} />
          <Route path="/monitor" element={<MonitorPage />} />
        </Routes>
        <Footer language={language} />
      </div>
    </Router>
  );
}