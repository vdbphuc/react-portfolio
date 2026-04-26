import { motion as Motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';
import { portfolioData } from '../data/portfolio';

const Skills = ({ language }) => (
    <section id="skills" className="py-24 relative overflow-hidden bg-slate-50 dark:bg-slate-900 transition-colors">
        {/* Decorative background shapes */}
        <div className="absolute top-20 right-0 w-64 h-64 bg-indigo-200 dark:bg-indigo-900/30 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
        <div className="absolute bottom-10 left-0 w-72 h-72 bg-purple-200 dark:bg-purple-900/30 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>

        <div className="container mx-auto px-6 max-w-6xl relative z-10">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-display font-bold text-slate-900 dark:text-white inline-flex items-center justify-center gap-3">
                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl text-indigo-600 dark:text-indigo-400">
                        <Briefcase size={28} />
                    </div>
                    {portfolioData.navLinks.skills[language]}
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mt-4 max-w-2xl mx-auto">
                    {language === 'vi' ? 'Công nghệ và công cụ tôi sử dụng.' : 'Technologies and tools I work with.'}
                </p>
            </div>

            <Motion.div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 max-w-5xl mx-auto"
                initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}
                variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } }}
            >
                {portfolioData.skills.map((skill, index) => (
                    <Motion.div key={skill.name} 
                        className="group flex flex-col items-center justify-center p-6 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-500/30 transition-all duration-300"
                        variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
                        whileHover={{ y: -5 }}
                    >
                        <div className="text-slate-600 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-4 scale-125">
                            {skill.icon}
                        </div>
                        <span className="font-medium text-sm text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                            {skill.name}
                        </span>
                    </Motion.div>
                ))}
            </Motion.div>
        </div>
    </section>
);

export default Skills;
