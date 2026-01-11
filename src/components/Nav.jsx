import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';
import { portfolioData } from '../data/portfolio';

const Nav = ({ theme, setTheme, language, setLanguage }) => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleMenuToggle = () => setIsOpen(!isOpen);

    const handleNavLinkClick = (e, targetId) => {
        e.preventDefault();
        setIsOpen(false);

        if (targetId.startsWith('#')) {
            if (location.pathname === '/') {
                const element = document.querySelector(targetId);
                if (element) element.scrollIntoView({ behavior: 'smooth' });
            } else {
                navigate('/');
                setTimeout(() => {
                    const element = document.querySelector(targetId);
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        } else {
            navigate(targetId);
        }
    };

    const navLinks = [
        { href: "#about", label: portfolioData.navLinks.about[language] },
        { href: "#skills", label: portfolioData.navLinks.skills[language] },
        { href: "#projects", label: portfolioData.navLinks.projects[language] },
        { href: "#contact", label: portfolioData.navLinks.contact[language] },
        { href: "/chatbot", label: portfolioData.navLinks.chatbot[language] },
        { href: "/monitor", label: portfolioData.navLinks.monitor[language] },
        { href: "/blog", label: portfolioData.navLinks.blog[language] },

    ];

    return (
        <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50 transition-colors duration-300">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <a href="/" onClick={(e) => handleNavLinkClick(e, '#hero')} className="text-2xl font-bold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">{portfolioData.name}</a>
                <div className="flex items-center space-x-2 sm:space-x-4">
                    <nav className="hidden md:flex space-x-8">
                        {navLinks.map(link => (
                            <a key={link.href} href={link.href} onClick={(e) => handleNavLinkClick(e, link.href)} className={`text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors ${location.pathname === link.href ? 'font-bold text-indigo-600 dark:text-indigo-400' : ''}`}>
                                {link.label}
                            </a>
                        ))}
                    </nav>
                    <ThemeToggle theme={theme} setTheme={setTheme} />
                    <LanguageToggle language={language} setLanguage={setLanguage} />
                    <button onClick={handleMenuToggle} className="md:hidden focus:outline-none text-slate-900 dark:text-white">
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>
            {isOpen && (
                <div className="md:hidden px-6 pb-4 flex flex-col space-y-2 bg-white dark:bg-gray-900 shadow-lg">
                    {navLinks.map(link => (
                        <a key={link.href} href={link.href} onClick={(e) => handleNavLinkClick(e, link.href)} className="block py-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">{link.label}</a>
                    ))}
                </div>
            )}
        </header>
    );
};

export default Nav;
