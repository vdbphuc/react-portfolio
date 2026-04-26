import { useRef, useState } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { Code, ChevronLeft, ChevronRight, ExternalLink, X } from 'lucide-react';
import { portfolioData } from '../data/portfolio';
import { sectionVariants } from '../utils/variants';

const Projects = ({ language }) => {
    const scrollContainer = useRef(null);
    const [selectedProject, setSelectedProject] = useState(null);
    
    const scrollLeft = () => { if (scrollContainer.current) scrollContainer.current.scrollBy({ left: -scrollContainer.current.offsetWidth, behavior: 'smooth' }); };
    const scrollRight = () => { if (scrollContainer.current) scrollContainer.current.scrollBy({ left: scrollContainer.current.offsetWidth, behavior: 'smooth' }); };

    return (
        <>
        <Motion.section id="projects" className="py-24 bg-white dark:bg-slate-900" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
            <div className="container mx-auto px-6 max-w-6xl">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <h2 className="text-4xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-3">
                            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl text-indigo-600 dark:text-indigo-400">
                                <Code size={28} />
                            </div>
                            {portfolioData.navLinks.projects[language]}
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 mt-4 max-w-xl">
                            {language === 'vi' ? 'Khám phá những dự án tôi đã thực hiện.' : 'Explore my recent projects.'}
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <button onClick={scrollLeft} className="p-3 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all">
                            <ChevronLeft size={20} />
                        </button>
                        <button onClick={scrollRight} className="p-3 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                <div ref={scrollContainer} className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar space-x-6 pb-8 -mx-6 px-6 lg:mx-0 lg:px-0">
                    {portfolioData.projects.map((project, index) => (
                        <Motion.div 
                            key={project.title.en} 
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="flex-shrink-0 w-[85vw] sm:w-[340px] lg:w-[380px] snap-center group"
                        >
                            <div className="bg-white dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:border-indigo-500/30 transition-all duration-300 h-full flex flex-col">
                                <div className="relative h-56 overflow-hidden">
                                    <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent transition-colors z-10"></div>
                                    <img src={project.image} alt={project.title[language]} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                                </div>
                                <div className="p-6 flex flex-col flex-grow relative z-20 bg-white dark:bg-slate-800/80 backdrop-blur-sm -mt-6 mx-4 mb-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50">
                                    <h3 className="text-xl font-display font-bold mb-3 text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                        {project.title[language]}
                                    </h3>
                                    <p className="text-slate-600 dark:text-slate-400 mb-5 text-sm leading-relaxed flex-grow line-clamp-3">
                                        {project.description[language]}
                                    </p>
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {project.tags.map(tag => (
                                            <span key={tag} className="bg-slate-100 text-slate-700 dark:bg-slate-700/50 dark:text-slate-300 text-xs font-medium px-3 py-1 rounded-full border border-slate-200 dark:border-slate-600/50">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <button 
                                        onClick={() => setSelectedProject(project)}
                                        className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium transition-colors text-sm w-fit group/btn cursor-pointer"
                                    >
                                        {project.detailsButton[language]} 
                                        <ChevronRight size={16} className="transform group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </Motion.div>
                    ))}
                </div>
            </div>
        </Motion.section>

        <AnimatePresence>
            {selectedProject && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    <Motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }} 
                        onClick={() => setSelectedProject(null)}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                    />
                    <Motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 20 }} 
                        animate={{ opacity: 1, scale: 1, y: 0 }} 
                        exit={{ opacity: 0, scale: 0.95, y: 20 }} 
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-2xl bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                    >
                        <button 
                            onClick={() => setSelectedProject(null)}
                            className="absolute top-4 right-4 z-10 p-2 bg-white/20 dark:bg-black/20 hover:bg-white/40 dark:hover:bg-black/40 backdrop-blur-md rounded-full text-slate-800 dark:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>
                        
                        <div className="h-48 sm:h-64 relative flex-shrink-0">
                            <img src={selectedProject.image} alt={selectedProject.title[language]} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            <h3 className="absolute bottom-6 left-6 right-6 text-2xl sm:text-3xl font-display font-bold text-white">
                                {selectedProject.title[language]}
                            </h3>
                        </div>
                        
                        <div className="p-6 sm:p-8 overflow-y-auto">
                            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                                {language === 'vi' ? 'Tổng quan dự án' : 'Project Overview'}
                            </h4>
                            <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                                {selectedProject.description[language]}
                            </p>
                            
                            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                                {language === 'vi' ? 'Chi tiết công việc' : 'Detailed Work'}
                            </h4>
                            <p className="text-slate-600 dark:text-slate-300 mb-8 leading-relaxed whitespace-pre-line">
                                {selectedProject.details?.[language]}
                            </p>
                            
                            <div className="flex flex-wrap gap-2 mb-8">
                                {selectedProject.tags.map(tag => (
                                    <span key={tag} className="bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 text-xs font-medium px-3 py-1 rounded-full border border-indigo-100 dark:border-indigo-800">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            
                            {selectedProject.link !== "#" && (
                                <a 
                                    href={selectedProject.link} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-colors w-full sm:w-auto justify-center"
                                >
                                    {language === 'vi' ? 'Xem liên kết ngoài' : 'Visit External Link'} 
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
