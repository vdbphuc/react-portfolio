import { motion as Motion } from 'framer-motion';
import { Download, Sparkles, ShieldCheck, Cpu, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { portfolioData } from '../data/portfolio';
import cvFile from '../CV/MY CV.pdf';

const Hero = ({ onLinkClick, language }) => (
    <section id="hero" className="w-full relative min-h-screen flex flex-col justify-center items-center text-center overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-500 pt-28 pb-16 bg-grid-pattern">
        {/* 3D Floating Background Orbs */}
        <div className="absolute top-12 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse-glow pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float-delayed pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-72 h-72 bg-cyan-500/15 rounded-full blur-3xl animate-float-3d pointer-events-none" />

        <div className="relative max-w-5xl px-6 z-10 perspective-1000">
            <Motion.div 
                initial={{ opacity: 0, y: 30, rotateX: 10 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="transform-style-3d flex flex-col items-center"
            >
                {/* 3D Availability Pill Badge */}
                <Motion.div 
                    whileHover={{ scale: 1.05, rotateY: 5 }}
                    className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass-3d-card border border-emerald-500/30 text-xs md:text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-8 shadow-lg shadow-emerald-500/10 cursor-default"
                >
                    <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    <span>{language === 'vi' ? 'Sẵn sàng nhận cơ hội & Dự án mới' : 'Available for New Opportunities & Projects'}</span>
                </Motion.div>

                {/* 3D Main Heading with Gradient Accent */}
                <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-extrabold text-slate-900 dark:text-white leading-tight mb-6 tracking-tight">
                    {language === 'vi' ? 'Xin chào, tôi là' : 'Hello, I am'} <br className="md:hidden" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 drop-shadow-sm">
                        {portfolioData.name}
                    </span>
                </h1>

                {/* Subtitle */}
                <p className="text-base md:text-2xl text-slate-600 dark:text-slate-300 mb-10 max-w-3xl mx-auto font-light leading-relaxed">
                    {portfolioData.title[language]}
                </p>

                {/* 3D Floating Stat Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl mb-12 transform-style-3d">
                    <Motion.div 
                        whileHover={{ y: -8, rotateX: 6, rotateY: -6, z: 20 }}
                        className="glass-3d-card p-4 rounded-2xl flex flex-col items-center justify-center card-3d border border-indigo-500/20"
                    >
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-2 shadow-inner">
                            <Cpu size={22} />
                        </div>
                        <span className="text-xl font-bold text-slate-900 dark:text-white">4+ {language === 'vi' ? 'Năm' : 'Years'}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Software Engineer</span>
                    </Motion.div>

                    <Motion.div 
                        whileHover={{ y: -8, rotateX: 6, rotateY: 0, z: 20 }}
                        className="glass-3d-card p-4 rounded-2xl flex flex-col items-center justify-center card-3d border border-purple-500/20"
                    >
                        <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center mb-2 shadow-inner">
                            <ShieldCheck size={22} />
                        </div>
                        <span className="text-xl font-bold text-slate-900 dark:text-white">CKAD & PSM I</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Certified K8s & Scrum</span>
                    </Motion.div>

                    <Motion.div 
                        whileHover={{ y: -8, rotateX: 6, rotateY: 6, z: 20 }}
                        className="glass-3d-card p-4 rounded-2xl flex flex-col items-center justify-center card-3d border border-pink-500/20"
                    >
                        <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-500 flex items-center justify-center mb-2 shadow-inner">
                            <Sparkles size={22} />
                        </div>
                        <span className="text-xl font-bold text-slate-900 dark:text-white">IMS & Cloud</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">K3s & Telecom Systems</span>
                    </Motion.div>
                </div>

                {/* 3D Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-xl">
                    <a 
                        href="#contact" 
                        onClick={(e) => { e.preventDefault(); onLinkClick('#contact'); }} 
                        className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold rounded-2xl transition-all duration-300 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 group"
                    >
                        <span>{portfolioData.heroButton[language]}</span>
                        <ArrowRight size={18} className="transition-transform group-hover:translate-x-1.5" />
                    </a>
                    
                    <a 
                        href={cvFile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto px-8 py-4 glass-3d-card text-indigo-600 dark:text-indigo-400 font-bold rounded-2xl hover:bg-indigo-50/50 dark:hover:bg-indigo-950/50 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 border border-indigo-500/30"
                    >
                        <Download size={18} />
                        <span>{language === 'vi' ? 'Tải CV' : 'Download CV'}</span>
                    </a>

                    <Link 
                        to="/chatbot"
                        className="w-full sm:w-auto px-6 py-4 glass-3d-card text-purple-600 dark:text-purple-300 font-bold rounded-2xl hover:bg-purple-50/50 dark:hover:bg-purple-950/50 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 border border-purple-500/30 shadow-md shadow-purple-500/10"
                    >
                        <Sparkles size={18} className="text-purple-500 animate-pulse" />
                        <span>AI Assistant</span>
                    </Link>
                </div>
            </Motion.div>
        </div>
    </section>
);

export default Hero;
