import { motion as Motion } from 'framer-motion';
import { User } from 'lucide-react';
import { portfolioData } from '../data/portfolio';
import { sectionVariants } from '../utils/variants';

const About = ({ language }) => (
    <Motion.section id="about" className="py-20" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
        <h2 className="text-3xl font-bold text-center mb-12 text-slate-900 dark:text-white flex items-center justify-center gap-3"><User />{portfolioData.navLinks.about[language]}</h2>
        <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/3">
                <img src="/Avatar.jpg" alt="Portrait" className="rounded-full shadow-lg mx-auto w-64 h-64 md:w-80 md:h-80 object-cover border-4 border-indigo-500" />
            </div>
            <div className="md:w-2/3 text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                <p className="text-justify">{portfolioData.bio[language]}</p>
            </div>
        </div>
    </Motion.section>
);

export default About;
