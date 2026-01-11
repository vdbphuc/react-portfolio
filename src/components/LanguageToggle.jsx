import React from 'react';

const LanguageToggle = ({ language, setLanguage }) => {
    const inactiveClass = "cursor-pointer text-gray-500 dark:text-gray-400";
    const activeClass = "font-bold text-indigo-600 dark:text-indigo-400";
    return (
        <div className="flex space-x-1 items-center bg-gray-100 dark:bg-gray-800 p-1 rounded-full">
            <span onClick={() => setLanguage('vi')} className={`px-2 py-1 transition-colors duration-300 rounded-full ${language === 'vi' ? activeClass : inactiveClass}`}>VI</span>
            <span className="text-gray-300 dark:text-gray-600">|</span>
            <span onClick={() => setLanguage('en')} className={`px-2 py-1 transition-colors duration-300 rounded-full ${language === 'en' ? activeClass : inactiveClass}`}>EN</span>
        </div>
    );
};

export default LanguageToggle;
