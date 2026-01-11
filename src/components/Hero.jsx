import { portfolioData } from '../data/portfolio';

const Hero = ({ onLinkClick, language }) => (
    <section id="hero" className="min-h-screen flex flex-col justify-center items-center text-center">
        <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white leading-tight mb-4">
                {language === 'vi' ? 'Xin chào, tôi là' : 'Hello, I am'} <span className="text-indigo-600 dark:text-indigo-400">{portfolioData.name}</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-8">{portfolioData.title[language]}</p>
            <a href="#contact" onClick={(e) => { e.preventDefault(); onLinkClick('#contact'); }} className="bg-indigo-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 inline-block">
                {portfolioData.heroButton[language]}
            </a>
        </div>
    </section>
);

export default Hero;
