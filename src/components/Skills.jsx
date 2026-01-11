import { motion as Motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';
import { portfolioData } from '../data/portfolio';

const Skills = ({ language }) => (
    <section id="skills" className="py-20 bg-gray-100 dark:bg-gray-800/50 rounded-xl">
        <h2 className="text-3xl font-bold text-center mb-12 text-slate-900 dark:text-white flex items-center justify-center gap-3"><Briefcase />{portfolioData.navLinks.skills[language]}</h2>
        <Motion.div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center max-w-4xl mx-auto"
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
        >
            {portfolioData.skills.map(skill => (
                <Motion.div key={skill.name} className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl dark:hover:bg-gray-700 transition-all transform hover:-translate-y-2"
                    variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
                >
                    {skill.icon}
                    <span className="font-semibold mt-3 text-gray-700 dark:text-gray-300">{skill.name}</span>
                </Motion.div>
            ))}
        </Motion.div>
    </section>
);

export default Skills;
