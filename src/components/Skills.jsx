import { motion as Motion } from 'framer-motion';
import { Cpu, Sparkles } from 'lucide-react';
import { portfolioData } from '../data/portfolio';

const Skills = ({ language }) => (
    <section id="skills" className="w-full py-28 relative overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors bg-grid-pattern">
        {/* Ambient 3D Glow Blobs */}
        <div className="absolute top-20 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none animate-float-3d" />

        <div className="container mx-auto px-6 max-w-6xl relative z-10 perspective-1000">
            {/* Header */}
            <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-3d-card border border-indigo-500/30 text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-4 shadow-md shadow-indigo-500/10">
                    <Sparkles size={14} className="animate-spin text-indigo-500" style={{ animationDuration: '6s' }} />
                    <span>Tech Stack & Expertise</span>
                </div>
                <h2 className="text-4xl sm:text-5xl font-display font-extrabold text-slate-900 dark:text-white flex items-center justify-center gap-3">
                    <div className="p-3 glass-3d-card rounded-2xl text-indigo-500 border border-indigo-500/30 shadow-lg shadow-indigo-500/20">
                        <Cpu size={32} />
                    </div>
                    <span>{portfolioData.navLinks.skills[language]}</span>
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mt-4 max-w-2xl mx-auto font-light text-lg">
                    {language === 'vi' ? 'Các ngôn ngữ, hệ thống viễn thông, container orchestration & công cụ phát triển chuyên sâu.' : 'Core engineering stack spanning IMS Telecom, Kubernetes, Erlang, Python, and C++.'}
                </p>
            </div>

            {/* 3D Interactive Skills Cards Grid */}
            <Motion.div 
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 max-w-5xl mx-auto transform-style-3d"
                initial="hidden" 
                whileInView="visible" 
                viewport={{ once: true, amount: 0.1 }}
                variants={{ 
                    hidden: { opacity: 0 }, 
                    visible: { opacity: 1, transition: { staggerChildren: 0.05 } } 
                }}
            >
                {portfolioData.skills.map((skill, index) => (
                    <Motion.div 
                        key={skill.name} 
                        className="group relative flex flex-col items-center justify-center p-6 glass-3d-card rounded-3xl card-3d cursor-pointer border border-slate-200/80 dark:border-slate-800/80 hover:border-indigo-500/50 dark:hover:border-indigo-500/40"
                        variants={{ hidden: { y: 30, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
                        whileHover={{ y: -8, rotateX: 8, rotateY: -8, z: 25 }}
                    >
                        {/* Glow indicator on hover */}
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-indigo-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                        {/* Icon */}
                        <div className="text-slate-600 dark:text-slate-300 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-all duration-300 mb-4 scale-125 group-hover:scale-135 drop-shadow-md">
                            {skill.icon}
                        </div>

                        {/* Skill Name */}
                        <span className="font-bold text-sm text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-white transition-colors text-center tracking-tight">
                            {skill.name}
                        </span>
                    </Motion.div>
                ))}
            </Motion.div>
        </div>
    </section>
);

export default Skills;
