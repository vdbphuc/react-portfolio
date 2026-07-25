import Hero from '../components/Hero';
import About from '../components/About';
import Skills from '../components/Skills';
import Projects from '../components/Projects';
import Certificates from '../components/Certificates';
import Contact from '../components/Contact';

const HomePage = ({ language }) => {
    const handleLinkClick = (targetId) => {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <main className="w-full flex-grow overflow-x-hidden">
            <Hero onLinkClick={handleLinkClick} language={language} />
            <About language={language} />
            <Skills language={language} />
            <Projects language={language} />
            <Certificates language={language} />
            <Contact language={language} />
        </main>
    );
};

export default HomePage;
