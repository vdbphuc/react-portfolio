import Hero from '../components/Hero';
import About from '../components/About';
import Skills from '../components/Skills';
import Projects from '../components/Projects';
import Contact from '../components/Contact';

const HomePage = ({ language }) => {
    const handleLinkClick = (targetId) => {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <main className="container mx-auto px-6">
            <Hero onLinkClick={handleLinkClick} language={language} />
            <About language={language} />
            <Skills language={language} />
            <Projects language={language} />
            <Contact language={language} />
        </main>
    );
};

export default HomePage;
