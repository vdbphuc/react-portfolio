import { motion as Motion } from 'framer-motion';
import { Download, Sparkles, ShieldCheck, Cpu, ArrowRight, Layers, Terminal, Server, Code, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { portfolioData } from '../data/portfolio';
import cvFile from '../CV/MY CV.pdf';

const Hero = ({ onLinkClick, language }) => (
    <section id="hero" className="w-full relative min-h-screen flex flex-col justify-center items-center text-center overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-500 pt-28 pb-16 bg-grid-pattern">
        {/* 3D Floating Background Orbs */}
        <div className="absolute top-12 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse-glow pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float-delayed pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-72 h-72 bg-cyan-500/15 rounded-full blur-3xl animate-float-3d pointer-events-none" />

        {/* Floating Orbiting Tech Badges Around Hero */}
        <Motion.div 
            animate={{ y: [0, -12, 0], rotate: [0, 5, 0] }} 
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="hidden lg:flex absolute top-36 left-12 glass-3d-card px-4 py-2 rounded-2xl items-center gap-2 text-xs font-bold text-indigo-400 border border-indigo-500/30 shadow-lg shadow-indigo-500/10 pointer-events-none z-10"
        >
            <Server size={16} className="text-indigo-400 animate-pulse" />
            <span>K3s Kubernetes</span>
        </Motion.div>

        <Motion.div 
            animate={{ y: [0, 14, 0], rotate: [0, -6, 0] }} 
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="hidden lg:flex absolute top-48 right-14 glass-3d-card px-4 py-2 rounded-2xl items-center gap-2 text-xs font-bold text-purple-400 border border-purple-500/30 shadow-lg shadow-purple-500/10 pointer-events-none z-10"
        >
            <Zap size={16} className="text-purple-400 animate-bounce" />
            <span>Erlang IMS Core</span>
        </Motion.div>

        <Motion.div 
            animate={{ y: [0, -10, 0], rotate: [0, 4, 0] }} 
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="hidden lg:flex absolute bottom-36 left-20 glass-3d-card px-4 py-2 rounded-2xl items-center gap-2 text-xs font-bold text-pink-400 border border-pink-500/30 shadow-lg shadow-pink-500/10 pointer-events-none z-10"
        >
            <Code size={16} className="text-pink-400" />
            <span>Python & C++</span>
        </Motion.div>

        <Motion.div 
            animate={{ y: [0, 12, 0], rotate: [0, -5, 0] }} 
            transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
            className="hidden lg:flex absolute bottom-40 right-20 glass-3d-card px-4 py-2 rounded-2xl items-center gap-2 text-xs font-bold text-cyan-400 border border-cyan-500/30 shadow-lg shadow-cyan-500/10 pointer-events-none z-10"
        >
            <Layers size={16} className="text-cyan-400" />
            <span>React & Vite</span>
        </Motion.div>

        <div className="relative max-w-5xl px-6 z-10 perspective-1000 w-full">
            <Motion.div 
                initial={{ opacity: 0, y: 40, rotateX: 12 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="transform-style-3d flex flex-col items-center"
            >
                {/* 3D Availability Pill Badge with Pulsing Sonar */}
                <Motion.div 
                    whileHover={{ scale: 1.08, rotateY: 6 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass-3d-card border border-emerald-500/40 text-xs md:text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-8 shadow-lg shadow-emerald-500/15 cursor-default group"
                >
                    <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    <span>{language === 'vi' ? 'Sẵn sàng nhận cơ hội & Dự án mới' : 'Available for New Opportunities & Projects'}</span>
                </Motion.div>

                {/* 3D Main Heading with Shimmer Animated Accent */}
                <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-extrabold text-slate-900 dark:text-white leading-tight mb-6 tracking-tight">
                    {language === 'vi' ? 'Xin chào, tôi là' : 'Hello, I am'} <br className="md:hidden" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 animate-shimmer-text drop-shadow-sm">
                        {portfolioData.name}
                    </span>
                </h1>

                {/* Subtitle */}
                <p className="text-base md:text-2xl text-slate-600 dark:text-slate-300 mb-10 max-w-3xl mx-auto font-light leading-relaxed">
                    {portfolioData.title[language]}
                </p>

                {/* 3D Floating Stat Cards Grid with Magnetic Pulse */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl mb-12 transform-style-3d">
                    <Motion.div 
                        whileHover={{ y: -10, rotateX: 8, rotateY: -8, z: 30 }}
                        transition={{ type: "spring", stiffness: 350, damping: 20 }}
                        className="glass-3d-card p-5 rounded-3xl flex flex-col items-center justify-center card-3d card-spotlight border border-indigo-500/25"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-2.5 shadow-inner">
                            <Cpu size={24} className="animate-pulse" />
                        </div>
                        <span className="text-xl font-bold text-slate-900 dark:text-white">4+ {language === 'vi' ? 'Năm' : 'Years'}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Software Engineer</span>
                    </Motion.div>

                    <Motion.div 
                        whileHover={{ y: -10, rotateX: 8, rotateY: 0, z: 30 }}
                        transition={{ type: "spring", stiffness: 350, damping: 20 }}
                        className="glass-3d-card p-5 rounded-3xl flex flex-col items-center justify-center card-3d card-spotlight border border-purple-500/25"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-2.5 shadow-inner">
                            <ShieldCheck size={24} />
                        </div>
                        <span className="text-xl font-bold text-slate-900 dark:text-white">CKAD & PSM I</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Certified K8s & Scrum</span>
                    </Motion.div>

                    <Motion.div 
                        whileHover={{ y: -10, rotateX: 8, rotateY: 8, z: 30 }}
                        transition={{ type: "spring", stiffness: 350, damping: 20 }}
                        className="glass-3d-card p-5 rounded-3xl flex flex-col items-center justify-center card-3d card-spotlight border border-pink-500/25"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-pink-500/10 text-pink-400 flex items-center justify-center mb-2.5 shadow-inner">
                            <Sparkles size={24} className="animate-spin" style={{ animationDuration: '8s' }} />
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
                        className="relative w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold rounded-2xl transition-all duration-300 shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 group overflow-hidden"
                    >
                        <span className="relative z-10">{portfolioData.heroButton[language]}</span>
                        <ArrowRight size={18} className="relative z-10 transition-transform group-hover:translate-x-1.5" />
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
                        <Sparkles size={18} className="text-purple-400 animate-pulse" />
                        <span>AI Assistant</span>
                    </Link>
                </div>
            </Motion.div>
        </div>
    </section>
);

export default Hero;
