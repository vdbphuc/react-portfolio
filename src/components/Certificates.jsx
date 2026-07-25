import { useState } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { Award, ExternalLink, ChevronDown, ChevronUp, Sparkles, ShieldCheck } from 'lucide-react';
import { portfolioData } from '../data/portfolio';

const Certificates = ({ language }) => {
    const [showAll, setShowAll] = useState(false);
    
    // Show only 3 items initially
    const displayedCertificates = showAll 
        ? portfolioData.certificates 
        : portfolioData.certificates.slice(0, 3);

    return (
        <section id="certificates" className="w-full py-28 relative overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors bg-grid-pattern">
            {/* Ambient Glow */}
            <div className="absolute top-1/3 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
            <div className="absolute bottom-10 left-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none animate-float-3d" />

            <div className="container mx-auto px-6 max-w-6xl relative z-10 perspective-1000">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-3d-card border border-amber-500/30 text-xs font-bold text-amber-600 dark:text-amber-400 mb-4 shadow-md shadow-amber-500/10">
                        <Sparkles size={14} className="text-amber-500 animate-pulse" />
                        <span>Verified Professional Credentials</span>
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-display font-extrabold text-slate-900 dark:text-white flex items-center justify-center gap-3">
                        <div className="p-3 glass-3d-card rounded-2xl text-amber-500 border border-amber-500/30 shadow-lg shadow-amber-500/20">
                            <Award size={32} />
                        </div>
                        <span>{portfolioData.navLinks.certificates[language]}</span>
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 mt-4 max-w-2xl mx-auto font-light text-lg">
                        {language === 'vi' ? 'Chứng chỉ quốc tế Certified Kubernetes Application Developer (CKAD) & Professional Scrum Master (PSM I).' : 'Verified international certifications including CKAD and PSM I.'}
                    </p>
                </div>

                {/* 3D Certificates Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto transform-style-3d">
                    <AnimatePresence>
                        {displayedCertificates.map((cert, index) => (
                            <Motion.div 
                                key={cert.title.en} 
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                                transition={{ duration: 0.5, delay: showAll ? (index % 3) * 0.1 : index * 0.1 }}
                                whileHover={{ y: -10, rotateX: 6, rotateY: 4, z: 25 }}
                                className="glass-3d-card rounded-3xl overflow-hidden card-3d card-spotlight border border-slate-200/80 dark:border-slate-800/80 hover:border-amber-500/40 flex flex-col group"
                            >
                                <div className="relative h-48 overflow-hidden bg-slate-900/40 flex items-center justify-center">
                                    <img 
                                        src={cert.image} 
                                        alt={cert.title[language]} 
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80" />
                                    
                                    {/* Verified Badge */}
                                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full glass-3d-card text-xs font-bold text-amber-400 border border-amber-500/30 flex items-center gap-1.5 shadow-md">
                                        <ShieldCheck size={14} className="text-amber-400" />
                                        <span>Verified</span>
                                    </div>
                                </div>

                                <div className="p-6 flex flex-col flex-grow relative z-20">
                                    <h3 className="text-lg font-display font-bold mb-3 text-slate-900 dark:text-white group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors leading-snug">
                                        {cert.title[language]}
                                    </h3>
                                    
                                    <div className="text-slate-500 dark:text-slate-400 text-xs mb-6 flex items-center justify-between">
                                        <span className="font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 px-3 py-1 rounded-xl border border-amber-500/20">{cert.issuer}</span>
                                        <span className="font-semibold text-slate-400">{cert.date}</span>
                                    </div>

                                    <div className="mt-auto pt-4 border-t border-slate-200/60 dark:border-slate-800/60">
                                        <a 
                                            href={cert.link} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="inline-flex items-center gap-2 text-amber-600 dark:text-amber-400 hover:text-amber-500 font-bold transition-colors text-sm group/btn"
                                        >
                                            <span>{cert.detailsButton[language]}</span> 
                                            <ExternalLink size={16} className="transform group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5 transition-transform" />
                                        </a>
                                    </div>
                                </div>
                            </Motion.div>
                        ))}
                    </AnimatePresence>
                </div>
                
                {portfolioData.certificates.length > 3 && (
                    <div className="mt-14 flex justify-center">
                        <button 
                            onClick={() => setShowAll(!showAll)}
                            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl glass-3d-card border border-amber-500/30 text-amber-600 dark:text-amber-400 font-bold hover:bg-amber-500/10 transition-all hover:scale-105 active:scale-95 shadow-md shadow-amber-500/10 group"
                        >
                            <span>
                                {showAll 
                                    ? (language === 'vi' ? 'Thu gọn' : 'Show Less') 
                                    : (language === 'vi' ? 'Xem thêm' : 'Show More')}
                            </span>
                            {showAll 
                                ? <ChevronUp size={20} className="transform group-hover:-translate-y-1 transition-transform" /> 
                                : <ChevronDown size={20} className="transform group-hover:translate-y-1 transition-transform" />}
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Certificates;
