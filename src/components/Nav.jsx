import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Menu, X, Sparkles, Activity } from 'lucide-react';
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

    const isAdmin = !!localStorage.getItem("adminToken");

    const navLinks = [
        { href: "#about", label: portfolioData.navLinks.about[language] },
        { href: "#skills", label: portfolioData.navLinks.skills[language] },
        { href: "#projects", label: portfolioData.navLinks.projects[language] },
        { href: "#certificates", label: portfolioData.navLinks.certificates[language] },
        { href: "#contact", label: portfolioData.navLinks.contact[language] },
    ];

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'py-3' : 'py-6'}`}>
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <div className={`flex items-center justify-between rounded-3xl glass-3d-card px-6 py-3.5 transition-all duration-500 ${
                    scrolled 
                    ? 'shadow-xl shadow-indigo-500/10 border-indigo-500/30 dark:border-indigo-500/20' 
                    : 'border-slate-200/60 dark:border-slate-800/60'
                }`}>
                    {/* Brand Logo with 3D Dot */}
                    <a 
                        href="/" 
                        onClick={(e) => handleNavLinkClick(e, '#hero')} 
                        className="group flex items-center gap-2 text-xl font-display font-black tracking-tight text-slate-900 dark:text-white transition-transform hover:scale-105"
                    >
                        <span>{portfolioData.name.split(' ')[0]}</span>
                        <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 shadow-md shadow-indigo-500/50 animate-pulse" />
                    </a>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-1.5">
                        {navLinks.map(link => (
                            <a 
                                key={link.href} 
                                href={link.href} 
                                onClick={(e) => handleNavLinkClick(e, link.href)}
                                className="relative px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all rounded-xl hover:bg-indigo-50/60 dark:hover:bg-indigo-950/40"
                            >
                                {link.label}
                            </a>
                        ))}

                        {/* Special AI Assistant Link */}
                        <Link 
                            to="/chatbot" 
                            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-purple-600 dark:text-purple-300 bg-purple-500/10 border border-purple-500/30 rounded-xl hover:bg-purple-500/20 transition-all shadow-sm"
                        >
                            <Sparkles size={14} className="animate-spin text-purple-500" style={{ animationDuration: '4s' }} />
                            <span>AI Chat</span>
                        </Link>

                        {/* Admin System Monitor Link */}
                        {isAdmin && (
                            <Link 
                                to="/monitor" 
                                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-xl hover:bg-emerald-500/20 transition-all"
                            >
                                <Activity size={14} className="animate-pulse" />
                                <span>Monitor</span>
                            </Link>
                        )}
                    </nav>

                    {/* Controls & Mobile Toggle */}
                    <div className="flex items-center space-x-2">
                        <ThemeToggle theme={theme} setTheme={setTheme} />
                        <LanguageToggle language={language} setLanguage={setLanguage} />
                        <button 
                            onClick={handleMenuToggle} 
                            className="md:hidden p-2 rounded-2xl glass-3d-card focus:outline-none text-slate-900 dark:text-white transition-transform active:scale-95"
                        >
                            {isOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <Motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        className="absolute top-full left-0 right-0 mt-3 px-6 md:hidden z-50"
                    >
                        <div className="rounded-3xl glass-3d-card p-5 shadow-2xl flex flex-col space-y-2 border border-slate-200/80 dark:border-slate-800/80">
                            {navLinks.map(link => (
                                <a 
                                    key={link.href} 
                                    href={link.href} 
                                    onClick={(e) => handleNavLinkClick(e, link.href)}
                                    className="px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50/80 dark:hover:bg-indigo-950/60 rounded-2xl transition-colors"
                                >
                                    {link.label}
                                </a>
                            ))}
                            <Link 
                                to="/chatbot" 
                                onClick={() => setIsOpen(false)}
                                className="px-4 py-3 text-sm font-bold text-purple-600 dark:text-purple-300 bg-purple-500/15 border border-purple-500/30 rounded-2xl flex items-center gap-2"
                            >
                                <Sparkles size={16} />
                                <span>AI Assistant</span>
                            </Link>
                        </div>
                    </Motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Nav;
