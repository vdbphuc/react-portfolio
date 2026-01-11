import { motion as Motion } from 'framer-motion';
import { MessageSquare, Mail, Github, Linkedin, Facebook } from 'lucide-react';
import { portfolioData } from '../data/portfolio';
import { sectionVariants } from '../utils/variants';

const Contact = ({ language }) => (
    <Motion.section id="contact" className="py-20" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
        <h2 className="text-3xl font-bold text-center mb-12 text-slate-900 dark:text-white flex items-center justify-center gap-3"><MessageSquare />{portfolioData.navLinks.contact[language]}</h2>
        <div className="max-w-lg mx-auto text-center">
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">{portfolioData.contact.p1[language]}</p>
            <a href={`https://mail.google.com/mail/?view=cm&fs=1&to=${portfolioData.contact.email}`} target="_blank" rel="noopener noreferrer" className="inline-block bg-indigo-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-indigo-700 transition-all duration-300 mb-8"><Mail className="inline-block mr-2" /> {portfolioData.contact.button[language]}</a>
            <div className="flex justify-center space-x-6">
                <a href={portfolioData.contact.social.github} target="_blank" rel="noopener noreferrer" className="text-gray-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors"><Github size={32} /></a>
                <a href={portfolioData.contact.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors"><Linkedin size={32} /></a>
                <a href={portfolioData.contact.social.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors"><Facebook size={32} /></a>
            </div>
        </div>
    </Motion.section>
);

export default Contact;
