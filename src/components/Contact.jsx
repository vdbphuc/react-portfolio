import { motion as Motion } from 'framer-motion';
import { MessageSquare, Mail, Github, Linkedin, Facebook, Send, Sparkles } from 'lucide-react';
import { portfolioData } from '../data/portfolio';

const Contact = ({ language }) => (
    <section id="contact" className="w-full py-28 relative overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors bg-grid-pattern">
        {/* Ambient Glow */}
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />

        <div className="container mx-auto px-6 max-w-4xl relative z-10 perspective-1000">
            <Motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                whileHover={{ rotateX: 2, rotateY: 2, z: 15 }}
                className="glass-3d-card p-8 sm:p-14 rounded-3xl card-3d border border-slate-200/80 dark:border-slate-800/80 text-center flex flex-col items-center"
            >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-3d-card border border-purple-500/30 text-xs font-bold text-purple-600 dark:text-purple-400 mb-6 shadow-md shadow-purple-500/10">
                    <Sparkles size={14} className="text-purple-500 animate-pulse" />
                    <span>Get in Touch</span>
                </div>

                <h2 className="text-4xl sm:text-5xl font-display font-extrabold text-slate-900 dark:text-white mb-6 flex items-center justify-center gap-3">
                    <div className="p-3 glass-3d-card rounded-2xl text-purple-500 border border-purple-500/30 shadow-lg shadow-purple-500/20">
                        <MessageSquare size={32} />
                    </div>
                    <span>{portfolioData.navLinks.contact[language]}</span>
                </h2>

                <p className="text-slate-600 dark:text-slate-300 mb-10 max-w-xl text-base sm:text-lg font-light leading-relaxed">
                    {portfolioData.contact.p1[language]}
                </p>

                {/* Email Action Button */}
                <a 
                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=${portfolioData.contact.email}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold py-4 px-10 rounded-2xl hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl shadow-purple-500/30 mb-12 text-base sm:text-lg"
                >
                    <Mail size={22} />
                    <span>{portfolioData.contact.button[language]}</span>
                </a>

                {/* Social Media 3D Badges */}
                <div className="flex justify-center items-center space-x-6">
                    <a 
                        href={portfolioData.contact.social.github} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="p-3.5 glass-3d-card rounded-2xl text-slate-700 dark:text-slate-300 hover:text-purple-500 dark:hover:text-purple-400 hover:border-purple-500/40 transition-all hover:scale-110 shadow-md"
                    >
                        <Github size={26} />
                    </a>
                    <a 
                        href={portfolioData.contact.social.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="p-3.5 glass-3d-card rounded-2xl text-slate-700 dark:text-slate-300 hover:text-indigo-500 dark:hover:text-indigo-400 hover:border-indigo-500/40 transition-all hover:scale-110 shadow-md"
                    >
                        <Linkedin size={26} />
                    </a>
                    <a 
                        href={portfolioData.contact.social.facebook} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="p-3.5 glass-3d-card rounded-2xl text-slate-700 dark:text-slate-300 hover:text-blue-500 dark:hover:text-blue-400 hover:border-blue-500/40 transition-all hover:scale-110 shadow-md"
                    >
                        <Facebook size={26} />
                    </a>
                </div>
            </Motion.div>
        </div>
    </section>
);

export default Contact;
