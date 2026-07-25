import { motion as Motion } from 'framer-motion';
import { User, Sparkles, ShieldCheck } from 'lucide-react';
import { portfolioData } from '../data/portfolio';

const About = ({ language }) => (
    <section id="about" className="w-full py-28 relative overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors bg-grid-pattern">
        {/* Ambient Glow */}
        <div className="absolute top-10 left-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />

        <div className="container mx-auto px-6 max-w-5xl relative z-10 perspective-1000">
            {/* Header */}
            <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-3d-card border border-indigo-500/30 text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-4 shadow-md shadow-indigo-500/10">
                    <Sparkles size={14} className="text-indigo-500 animate-pulse" />
                    <span>Background & Career</span>
                </div>
                <h2 className="text-4xl sm:text-5xl font-display font-extrabold text-slate-900 dark:text-white flex items-center justify-center gap-3">
                    <div className="p-3 glass-3d-card rounded-2xl text-indigo-500 border border-indigo-500/30 shadow-lg shadow-indigo-500/20">
                        <User size={32} />
                    </div>
                    <span>{portfolioData.navLinks.about[language]}</span>
                </h2>
            </div>

            {/* 3D Glass Card Container */}
            <Motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                whileHover={{ rotateX: 2, rotateY: -2, z: 15 }}
                className="glass-3d-card p-8 sm:p-12 rounded-3xl card-3d border border-slate-200/80 dark:border-slate-800/80 flex flex-col md:flex-row items-center gap-10 sm:gap-12"
            >
                {/* 3D Avatar Image with Glowing Rim Light */}
                <div className="relative flex-shrink-0 group">
                    <div className="absolute -inset-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full blur-md opacity-75 group-hover:opacity-100 transition-opacity animate-pulse-glow" />
                    <img 
                        src="/Avatar.jpg" 
                        alt="Bao Phuc Vu" 
                        className="relative rounded-full shadow-2xl w-56 h-56 sm:w-72 sm:h-72 object-cover border-4 border-slate-900 z-10" 
                    />
                    <div className="absolute bottom-2 right-2 z-20 px-3.5 py-1.5 rounded-full glass-3d-card border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center gap-1.5 shadow-lg">
                        <ShieldCheck size={14} className="text-emerald-400" />
                        <span>CKAD & PSM I</span>
                    </div>
                </div>

                {/* Bio text */}
                <div className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-light space-y-4">
                    <p className="text-justify font-normal">
                        {portfolioData.bio[language]}
                    </p>
                </div>
            </Motion.div>
        </div>
    </section>
);

export default About;
