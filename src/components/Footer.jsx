import { portfolioData } from '../data/portfolio';

const Footer = ({ language }) => (
    <footer className="border-t border-gray-200 dark:border-gray-800 mt-20">
        <div className="container mx-auto px-6 py-6 text-center text-gray-500 dark:text-gray-400">
            <p>&copy; {new Date().getFullYear()} {portfolioData.name}. {portfolioData.footer.rights[language]}</p>
        </div>
    </footer>
);

export default Footer;
