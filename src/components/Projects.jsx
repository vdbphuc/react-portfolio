import { useRef } from 'react';
import { motion as Motion } from 'framer-motion';
import { Code, ChevronLeft, ChevronRight } from 'lucide-react';
import { portfolioData } from '../data/portfolio';
import { sectionVariants } from '../utils/variants';

const Projects = ({ language }) => {
    const scrollContainer = useRef(null);
    const scrollLeft = () => { if (scrollContainer.current) scrollContainer.current.scrollBy({ left: -scrollContainer.current.offsetWidth, behavior: 'smooth' }); };
    const scrollRight = () => { if (scrollContainer.current) scrollContainer.current.scrollBy({ left: scrollContainer.current.offsetWidth, behavior: 'smooth' }); };

    return (
        <Motion.section id="projects" className="py-20" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
            <h2 className="text-3xl font-bold text-center mb-12 text-slate-900 dark:text-white flex items-center justify-center gap-3"><Code />{portfolioData.navLinks.projects[language]}</h2>
            <div className="flex items-center justify-center gap-4">
                <button onClick={scrollLeft} className="flex-shrink-0 bg-white/50 dark:bg-gray-800/50 hover:bg-gray-200 dark:hover:bg-gray-700/80 rounded-full p-2 transition-colors duration-300"><ChevronLeft className="w-6 h-6 text-slate-800 dark:text-white" /></button>
                <div ref={scrollContainer} className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar space-x-8 py-4">
                    {portfolioData.projects.map(project => (
                        <div key={project.title.en} className="flex-shrink-0 w-full sm:w-[48%] lg:w-[31%] snap-center">
                            <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg h-full flex flex-col transform group transition-transform duration-300 hover:scale-105">
                                <img src={project.image} alt={project.title[language]} className="w-full h-48 object-cover flex-shrink-0" />
                                <div className="p-6 flex flex-col flex-grow">
                                    <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">{project.title[language]}</h3>
                                    <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm flex-grow">{project.description[language]}</p>
                                    <div className="flex flex-wrap gap-2 mb-4 flex-shrink-0">
                                        {project.tags.map(tag => <span key={tag} className="bg-indigo-100 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-300 text-xs font-semibold px-2.5 py-0.5 rounded-full">{tag}</span>)}
                                    </div>
                                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-semibold transition-colors mt-auto flex-shrink-0">{project.detailsButton[language]} &rarr;</a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <button onClick={scrollRight} className="flex-shrink-0 bg-white/50 dark:bg-gray-800/50 hover:bg-gray-200 dark:hover:bg-gray-700/80 rounded-full p-2 transition-colors duration-300"><ChevronRight className="w-6 h-6 text-slate-800 dark:text-white" /></button>
            </div>
        </Motion.section>
    );
};

export default Projects;
