import { useState } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { Award, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { portfolioData } from '../data/portfolio';
import { sectionVariants } from '../utils/variants';

const Certificates = ({ language }) => {
    const [showAll, setShowAll] = useState(false);
    
    // Show only 3 items initially
    const displayedCertificates = showAll 
        ? portfolioData.certificates 
        : portfolioData.certificates.slice(0, 3);

    return (
        <Motion.section id="certificates" className="py-24 bg-slate-50 dark:bg-slate-900/50" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
            <div className="container mx-auto px-6 max-w-6xl">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <h2 className="text-4xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-3">
                            <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-xl text-amber-600 dark:text-amber-400">
                                <Award size={28} />
                            </div>
                            {portfolioData.navLinks.certificates[language]}
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 mt-4 max-w-xl">
                            {language === 'vi' ? 'Các chứng chỉ và giải thưởng tôi đã đạt được.' : 'Certifications and awards I have achieved.'}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence>
                        {displayedCertificates.map((cert, index) => (
                            <Motion.div 
                                key={cert.title.en} 
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                                transition={{ duration: 0.4, delay: showAll ? (index % 3) * 0.1 : index * 0.1 }}
                                className="bg-white dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:border-amber-500/30 transition-all duration-300 group flex flex-col"
                            >
                                <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-800">
                                    <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent transition-colors z-10"></div>
                                    <img src={cert.image} alt={cert.title[language]} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                                </div>
                                <div className="p-6 flex flex-col flex-grow relative z-20 bg-white dark:bg-slate-800/80 backdrop-blur-sm -mt-6 mx-4 mb-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50">
                                    <h3 className="text-lg font-display font-bold mb-2 text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                                        {cert.title[language]}
                                    </h3>
                                    <div className="text-slate-500 dark:text-slate-400 text-sm mb-4 flex items-center justify-between">
                                        <span className="font-medium bg-slate-100 dark:bg-slate-700/50 px-3 py-1 rounded-full">{cert.issuer}</span>
                                        <span className="font-semibold">{cert.date}</span>
                                    </div>
                                    <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-700/50">
                                        <a href={cert.link} target="_blank" rel="noopener noreferrer" 
                                           className="inline-flex items-center gap-2 text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-medium transition-colors text-sm w-fit group/btn">
                                            {cert.detailsButton[language]} 
                                            <ExternalLink size={16} className="transform group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5 transition-transform" />
                                        </a>
                                    </div>
                                </div>
                            </Motion.div>
                        ))}
                    </AnimatePresence>
                </div>
                
                {portfolioData.certificates.length > 3 && (
                    <div className="mt-12 flex justify-center">
                        <button 
                            onClick={() => setShowAll(!showAll)}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-amber-500/30 text-amber-600 dark:text-amber-400 font-medium hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors group"
                        >
                            {showAll 
                                ? (language === 'vi' ? 'Thu gọn' : 'Show Less') 
                                : (language === 'vi' ? 'Xem thêm' : 'Show More')}
                            {showAll 
                                ? <ChevronUp size={20} className="transform group-hover:-translate-y-1 transition-transform" /> 
                                : <ChevronDown size={20} className="transform group-hover:translate-y-1 transition-transform" />}
                        </button>
                    </div>
                )}
            </div>
        </Motion.section>
    );
};

export default Certificates;
