import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';
import { portfolioData } from '../data/portfolio';

const Nav = ({ theme, setTheme, language, setLanguage }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
        { href: "#certificates", label: portfolioData.navLinks.certificates[language] },
        { href: "#contact", label: portfolioData.navLinks.contact[language] },
    ];

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'py-2' : 'py-6'}`}>
            <div className={`mx-auto max-w-5xl px-6 transition-all duration-300`}>
                <div className={`flex items-center justify-between rounded-full border border-slate-200/50 dark:border-slate-700/50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md px-6 py-3 shadow-sm transition-all duration-300 ${scrolled ? 'shadow-md shadow-indigo-500/5' : ''}`}>
                    <a href="/" onClick={(e) => handleNavLinkClick(e, '#hero')} className="text-xl font-display font-bold text-slate-900 dark:text-white transition-colors">
                        {portfolioData.name.split(' ')[0]}<span className="text-indigo-600 dark:text-indigo-400">.</span>
                    </a>

                    <nav className="hidden md:flex items-center space-x-1">
                        {navLinks.map(link => (
                            <a key={link.href} href={link.href} onClick={(e) => handleNavLinkClick(e, link.href)}
                                className="relative px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                                {link.label}
                            </a>
                        ))}
                    </nav>

                    <div className="flex items-center space-x-2">
                        <ThemeToggle theme={theme} setTheme={setTheme} />
                        <LanguageToggle language={language} setLanguage={setLanguage} />
                        <button onClick={handleMenuToggle} className="md:hidden p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none text-slate-900 dark:text-white transition-colors">
                            {isOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <Motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-full left-0 right-0 mt-2 px-6 md:hidden"
                    >
                        <div className="rounded-2xl border border-slate-200/50 dark:border-slate-700/50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-4 shadow-xl flex flex-col space-y-1">
                            {navLinks.map(link => (
                                <a key={link.href} href={link.href} onClick={(e) => handleNavLinkClick(e, link.href)}
                                    className="px-4 py-3 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl transition-colors">
                                    {link.label}
                                </a>
                            ))}
                        </div>
                    </Motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Nav;
