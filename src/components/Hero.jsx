import { motion as Motion } from 'framer-motion';
import { portfolioData } from '../data/portfolio';

const Hero = ({ onLinkClick, language }) => (
    <section id="hero" className="relative min-h-screen flex flex-col justify-center items-center text-center overflow-hidden bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
        {/* Animated background elements */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob dark:bg-purple-900 dark:opacity-20"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-2000 dark:bg-indigo-900 dark:opacity-20"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-4000 dark:bg-pink-900 dark:opacity-20"></div>
        
        <div className="relative max-w-4xl px-6 z-10">
            <Motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <h1 className="text-5xl md:text-7xl font-display font-extrabold text-slate-900 dark:text-white leading-tight mb-6 tracking-tight">
                    {language === 'vi' ? 'Xin chào, tôi là' : 'Hello, I am'} <br className="md:hidden" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                        {portfolioData.name}
                    </span>
                </h1>
                <p className="text-lg md:text-2xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
                    {portfolioData.title[language]}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <a href="#contact" 
                       onClick={(e) => { e.preventDefault(); onLinkClick('#contact'); }} 
                       className="group relative px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium rounded-full overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/25 active:scale-95">
                        <span className="relative z-10 flex items-center gap-2">
                            {portfolioData.heroButton[language]}
                            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                        </span>
                    </a>
                    <a href="#projects"
                       onClick={(e) => { e.preventDefault(); onLinkClick('#projects'); }}
                       className="px-8 py-4 text-slate-700 dark:text-slate-300 font-medium rounded-full border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300">
                        {language === 'vi' ? 'Xem dự án' : 'View Projects'}
                    </a>
                </div>
            </Motion.div>
        </div>
    </section>
);

export default Hero;
