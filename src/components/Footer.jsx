import { portfolioData } from '../data/portfolio';

const Footer = ({ language }) => (
    <footer className="w-full border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950 transition-colors">
        <div className="max-w-6xl mx-auto px-6 py-8 text-center text-slate-500 dark:text-slate-400 text-sm font-medium">
            <p>&copy; {new Date().getFullYear()} <span className="font-bold text-slate-800 dark:text-slate-200">{portfolioData.name}</span>. {portfolioData.footer.rights[language]}</p>
        </div>
    </footer>
);

export default Footer;
