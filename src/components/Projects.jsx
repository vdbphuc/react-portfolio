import { useState } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { FolderGit2, ChevronRight, X, ExternalLink, Sparkles } from 'lucide-react';
import { portfolioData } from '../data/portfolio';

const Projects = ({ language }) => {
    const [selectedProject, setSelectedProject] = useState(null);

    return (
        <>
        <Motion.section 
            id="projects" 
            className="w-full py-28 relative overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors bg-grid-pattern"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
        >
            {/* Ambient Glow Orbs */}
            <div className="absolute top-1/4 left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none animate-float-delayed" />

            <div className="container mx-auto px-6 max-w-6xl relative z-10 perspective-1000">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-3d-card border border-purple-500/30 text-xs font-bold text-purple-600 dark:text-purple-300 mb-4 shadow-md shadow-purple-500/10">
                        <Sparkles size={14} className="text-purple-500 animate-pulse" />
                        <span>Featured Work & Systems</span>
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-display font-extrabold text-slate-900 dark:text-white flex items-center justify-center gap-3">
                        <div className="p-3 glass-3d-card rounded-2xl text-purple-500 border border-purple-500/30 shadow-lg shadow-purple-500/20">
                            <FolderGit2 size={32} />
                        </div>
                        <span>{portfolioData.navLinks.projects[language]}</span>
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 mt-4 max-w-2xl mx-auto font-light text-lg">
                        {language === 'vi' ? 'Hệ thống viễn thông IMS, Kubernetes, hiển thị vùng phủ LoRaWAN & dự án phần mềm.' : 'High-concurrency Telecom IMS components, Kubernetes monitoring, and IoT coverage systems.'}
                    </p>
                </div>

                {/* 3D Projects Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto transform-style-3d">
                    {portfolioData.projects.map((project, index) => (
                        <Motion.div 
                            key={project.title.en} 
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.15 }}
                            whileHover={{ y: -10, rotateX: 6, rotateY: -4, z: 30 }}
                            className="glass-3d-card rounded-3xl overflow-hidden card-3d border border-slate-200/80 dark:border-slate-800/80 hover:border-purple-500/40 flex flex-col cursor-pointer group"
                            onClick={() => setSelectedProject(project)}
                        >
                            <div className="relative h-56 overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent z-10 group-hover:opacity-60 transition-opacity" />
                                <img 
                                    src={project.image} 
                                    alt={project.title[language]} 
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
                                />
                                <div className="absolute top-4 right-4 z-20 px-3 py-1 rounded-full glass-3d-card text-xs font-bold text-white border border-white/20">
                                    Project #{index + 1}
                                </div>
                            </div>

                            <div className="p-6 flex flex-col flex-grow relative z-20">
                                <h3 className="text-xl font-display font-bold mb-3 text-slate-900 dark:text-white group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors">
                                    {project.title[language]}
                                </h3>
                                <p className="text-slate-600 dark:text-slate-300 mb-6 text-sm leading-relaxed flex-grow line-clamp-3 font-light">
                                    {project.description[language]}
                                </p>
                                
                                {/* Tags */}
                                <div className="flex flex-wrap gap-1.5 mb-6">
                                    {project.tags.map(tag => (
                                        <span key={tag} className="bg-purple-500/10 text-purple-600 dark:text-purple-300 text-xs font-bold px-3 py-1 rounded-xl border border-purple-500/20">
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <div className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-sm group/btn mt-auto">
                                    <span>{project.detailsButton[language]}</span> 
                                    <ChevronRight size={16} className="transform group-hover/btn:translate-x-1.5 transition-transform" />
                                </div>
                            </div>
                        </Motion.div>
                    ))}
                </div>
            </div>
        </Motion.section>

        {/* 3D Project Details Modal */}
        <AnimatePresence>
            {selectedProject && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    <Motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }} 
                        onClick={() => setSelectedProject(null)}
                        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
                    />
                    <Motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 30, rotateX: 10 }} 
                        animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }} 
                        exit={{ opacity: 0, scale: 0.9, y: 30 }} 
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-2xl glass-3d-card rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] z-10 border border-slate-700/50"
                    >
                        <button 
                            onClick={() => setSelectedProject(null)}
                            className="absolute top-4 right-4 z-20 p-2.5 glass-3d-card rounded-full text-slate-800 dark:text-white transition-transform active:scale-95 hover:bg-slate-800/50"
                        >
                            <X size={20} />
                        </button>
                        
                        <div className="h-56 sm:h-72 relative flex-shrink-0">
                            <img src={selectedProject.image} alt={selectedProject.title[language]} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                            <h3 className="absolute bottom-6 left-6 right-6 text-2xl sm:text-3xl font-display font-black text-white leading-tight">
                                {selectedProject.title[language]}
                            </h3>
                        </div>
                        
                        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
                            <div>
                                <h4 className="text-sm font-bold text-purple-500 uppercase tracking-wider mb-2">
                                    {language === 'vi' ? 'Tổng quan dự án' : 'Project Overview'}
                                </h4>
                                <p className="text-slate-700 dark:text-slate-200 leading-relaxed font-light text-base">
                                    {selectedProject.description[language]}
                                </p>
                            </div>
                            
                            <div>
                                <h4 className="text-sm font-bold text-purple-500 uppercase tracking-wider mb-2">
                                    {language === 'vi' ? 'Chi tiết kĩ thuật & Đóng góp' : 'Technical Details & Key Contributions'}
                                </h4>
                                <p className="text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-line text-sm bg-slate-900/40 p-4 rounded-2xl border border-slate-800/80">
                                    {selectedProject.details?.[language]}
                                </p>
                            </div>
                            
                            <div className="flex flex-wrap gap-2 pt-2">
                                {selectedProject.tags.map(tag => (
                                    <span key={tag} className="bg-purple-500/15 text-purple-400 text-xs font-bold px-3.5 py-1.5 rounded-xl border border-purple-500/30">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            
                            {selectedProject.link !== "#" && (
                                <a 
                                    href={selectedProject.link} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3.5 rounded-2xl font-bold transition-all hover:scale-105 shadow-lg shadow-purple-500/30 w-full sm:w-auto justify-center"
                                >
                                    <span>{language === 'vi' ? 'Xem liên kết ngoài' : 'Visit External Link'}</span>
                                    <ExternalLink size={18} />
                                </a>
                            )}
                        </div>
                    </Motion.div>
                </div>
            )}
        </AnimatePresence>
        </>
    );
};

export default Projects;
