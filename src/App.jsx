import React, { useState, useRef, useEffect } from 'react';
import { Github, Linkedin, Facebook, Mail, Menu, X, Code, Server, Container, Book, Briefcase, User, MessageSquare, ChevronLeft, ChevronRight, Cuboid, Sun, Moon, Bot } from 'lucide-react';
import { motion } from 'framer-motion';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import ChatBot from './ChatBot';

// 👇 1. IMPORT COMPONENT DASHBOARD
import StatusDashboard from '../uptime-monitor/frontend-component/StatusDashboard.jsx';

// --- DATA (Giữ nguyên data của bạn) ---
const portfolioData = {
  name: "Phúc Vũ",
  title: {
    en: "Software Engineer & Scrum Master",
    vi: "Kỹ Sư Phần Mềm & Scrum Master"
  },
  bio: {
    en: "I am Vu Dinh Bao Phuc with more than three years of experience as a Software Engineer in the telecommunications industry at Endava. While I have expertise in developing IMS systems and leading Agile teams as a Scrum Master, I am open to exploring and contributing to any new domain industry. My meticulous attention to detail, strong analytical skills, and ability to inspire team motivation drive me to deliver high- quality results. Career Interests: Open to opportunities in diverse industries and eager to apply my skills to new domains.",
    vi: "Tôi là Vũ Đình Bảo Phúc với hơn ba năm kinh nghiệm làm Kỹ sư phần mềm trong ngành viễn thông tại Endava. Mặc dù có chuyên môn về phát triển hệ thống IMS và dẫn dắt các nhóm Agile với vai trò Scrum Master, tôi luôn sẵn sàng khám phá và đóng góp cho bất kỳ lĩnh vực công nghiệp mới nào. Sự tỉ mỉ, kỹ năng phân tích sắc bén và khả năng truyền cảm hứng cho đội nhóm là động lực để tôi mang lại kết quả chất lượng cao. Định hướng nghề nghiệp: Sẵn sàng đón nhận cơ hội trong các ngành công nghiệp đa dạng và mong muốn áp dụng kỹ năng của mình vào những lĩnh vực mới."
  },
  navLinks: {
    about: { en: "About me", vi: "Giới thiệu" },
    skills: { en: "Skills", vi: "Kỹ năng" },
    projects: { en: "Projects", vi: "Dự án" },
    contact: { en: "Contact", vi: "Liên hệ" },
    chatbot: { en: "ChatBot", vi: "Trợ lý ảo" },
    monitor: { en: "System Status", vi: "Trạng thái hệ thống" }
  },
  heroButton: { en: "Contact Me", vi: "Liên Hệ Với Tôi" },
  contact: {
    email: "phuc821644@gmail.com",
    social: {
      github: "https://github.com/vdbphuc",
      linkedin: "https://www.linkedin.com/in/phucvu1810/",
      facebook: "https://www.facebook.com/phucvu1810/",
    },
    p1: {
      en: "Please contact me if you have any questions based on the these links below.",
      vi: "Vui lòng liên hệ với tôi nếu bạn có bất kỳ câu hỏi nào qua các liên kết bên dưới."
    },
    button: { en: "Send Email", vi: "Gửi Email" }
  },
  skills: [
    { name: "JavaScript", icon: <Code className="w-8 h-8 text-yellow-400" /> },
    { name: "React", icon: <Code className="w-8 h-8 text-sky-400" /> },
    { name: "Node.js", icon: <Server className="w-8 h-8 text-green-400" /> },
    { name: "Python", icon: <Code className="w-8 h-8 text-blue-500" /> },
    { name: "Kubernetes", icon: <Container className="w-8 h-8 text-orange-400" /> },
    { name: "Erlang", icon: <Code className="w-8 h-8 text-red-500" /> },
    { name: "C++", icon: <Code className="w-8 h-8 text-purple-500" /> },
    { name: "Docker", icon: <Cuboid className="w-8 h-8 text-blue-600" /> },
    { name: "VMWare", icon: <Server className="w-8 h-8 text-green-600" /> },
    { name: "Redis", icon: <Server className="w-8 h-8 text-red-600" /> },
    { name: "SUSE Linux", icon: <Server className="w-8 h-8 text-yellow-600" /> },
    { name: "Jenkin", icon: <Server className="w-8 h-8 text-gray-600" /> },
    { name: "Confluence", icon: <Book className="w-8 h-8 text-gray-600" /> },
    { name: "Jira", icon: <Book className="w-8 h-8 text-gray-600" /> },
  ],
  projects: [
    {
      title: { en: "Telecommunication System", vi: "Hệ Thống Viễn Thông" },
      description: {
        en: "Developing a P-CSCF and IBCF in the IP Multimedia Subsystem (IMS) which is commonly used by many operators telecommunication network all over the world. Our product is supporting multimedia in IMS application such as Voice over LTE (VoLTE), WiFi-Calling and many interconnect scenarios",
        vi: "Phát triển P-CSCF và IBCF trong Hệ thống con Đa phương tiện IP (IMS) được nhiều nhà khai thác mạng viễn thông trên toàn thế giới sử dụng. Sản phẩm hỗ trợ đa phương tiện trong ứng dụng IMS như Thoại qua LTE (VoLTE), Gọi qua WiFi và nhiều kịch bản kết nối khác."
      },
      tags: ["VMWare", "Docker", "Kubernetes", "Redis", "Erlang", "SIP Protocol", "gRPC", "SUSE Linux", "Jenkin", "Confluence", "Jira"],
      link: "#",
      image: "https://placehold.co/600x400/1f2937/9ca3af?text=Telecommunication+System",
      detailsButton: { en: "View Details", vi: "Xem chi tiết" }
    },
    {
      title: { en: "Scrum Master", vi: "Scrum Master" },
      description: {
        en: "As a Scrum Master, I facilitated Agile ceremonies, removed impediments, and guided the team in adhering to Scrum practices to ensure successful delivery of the project. I worked closely with the Product Owner, stakeholders, and the development team to ensure alignment with project objectives.",
        vi: "Với vai trò Scrum Master, tôi điều phối các nghi lễ Agile, loại bỏ các trở ngại và hướng dẫn nhóm tuân thủ các phương pháp Scrum để đảm bảo dự án được giao thành công. Tôi đã làm việc chặt chẽ với Product Owner, các bên liên quan và đội phát triển để đảm bảo sự thống nhất với các mục tiêu của dự án."
      },
      tags: ["VMWare", "Docker", "Kubernetes", "Redis", "Erlang", "SIP Protocol", "gRPC", "SUSE Linux", "Jenkin", "Confluence", "Jira"],
      link: "#",
      image: "https://placehold.co/600x400/1f2937/9ca3af?text=Scrum+Master",
      detailsButton: { en: "View Details", vi: "Xem chi tiết" }
    },
    {
      title: { en: "Kazoo - Voice Over IP", vi: "Hệ thống Kazoo" },
      description: {
        en: "As a mentor and PO for the Kazoo internship program, I help interns gain a deeper understanding of the company's way of working. I guide them through small projects that closely resemble real-world tasks, providing hands-on experience. Additionally, I assist them in getting familiar with the technologies currently used in the company, ensuring they are well-prepared for future challenges.",
        vi: "Là người hướng dẫn và PO cho chương trình thực tập Kazoo, tôi giúp các thực tập sinh hiểu sâu hơn về cách làm việc của công ty. Tôi hướng dẫn họ qua các dự án nhỏ mô phỏng sát với các nhiệm vụ thực tế, cung cấp kinh nghiệm thực hành. Ngoài ra, tôi còn hỗ trợ họ làm quen với các công nghệ đang được sử dụng, đảm bảo họ được chuẩn bị tốt cho những thách thức trong tương lai."
      },
      tags: ["Docker", "CouchDB", "Erlang", "SIP Protocol"],
      link: "#",
      image: "https://placehold.co/600x400/1f2937/9ca3af?text=Kazoo+-+Voice+Over+IP",
      detailsButton: { en: "View Details", vi: "Xem chi tiết" }
    },
    {
      title: { en: "Smart Billiards Booking & POS System", vi: "Hệ Thống Đặt Bàn & POS Bida Thông Minh" },
      description: {
        en: "Developed a comprehensive web application to streamline the daily operations of a billiards hall. This system features real-time table management, an integrated Point-of-Sale (POS) for billing, and a customer service request system, all designed to optimize efficiency and enhance the customer experience.",
        vi: "Phát triển một ứng dụng web toàn diện để hợp lý hóa hoạt động hàng ngày của một quán bida. Hệ thống này có tính năng quản lý bàn theo thời gian thực, điểm bán hàng (POS) tích hợp để thanh toán và hệ thống yêu cầu dịch vụ khách hàng, tất cả được thiết kế để tối ưu hóa hiệu quả và nâng cao trải nghiệm khách hàng."
      },
      tags: ["React", "Node.js", "REST API", "Firebase", "Tailwind CSS"],
      link: "#",
      image: "https://placehold.co/600x400/1f2937/9ca3af?text=Smart+Billiards+Booking+%26+POS+System",
      detailsButton: { en: "View Details", vi: "Xem chi tiết" }
    },
    {
      title: { en: "AI ChatBot Assistant", vi: "Trợ Lý Ảo AI" },
      description: {
        en: "An intelligent virtual assistant integrated directly into the portfolio to help visitors navigate and find information quickly. Built with React and tailored with a modern, responsive UI supporting dark mode.",
        vi: "Một trợ lý ảo thông minh được tích hợp trực tiếp vào portfolio giúp khách truy cập điều hướng và tìm kiếm thông tin nhanh chóng. Được xây dựng bằng React với giao diện hiện đại, tương thích mọi thiết bị và hỗ trợ chế độ tối."
      },
      tags: ["React", "Tailwind CSS", "React Router", "Lucide React"],
      link: "https://github.com/vdbphuc/chatbot-repo",
      image: "https://placehold.co/600x400/4f46e5/ffffff?text=AI+ChatBot",
      detailsButton: { en: "View Code", vi: "Xem Code" }
    }
  ],
  footer: {
      rights: { en: "All Rights Reserved.", vi: "Bản quyền được bảo lưu." }
  }
};

// --- COMPONENTS ---
const ThemeToggle = ({ theme, setTheme }) => (
  <button
    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
    aria-label="Toggle theme"
  >
    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
  </button>
);

const LanguageToggle = ({ language, setLanguage }) => {
    const inactiveClass = "cursor-pointer text-gray-500 dark:text-gray-400";
    const activeClass = "font-bold text-indigo-600 dark:text-indigo-400";
    return (
      <div className="flex space-x-1 items-center bg-gray-100 dark:bg-gray-800 p-1 rounded-full">
        <span onClick={() => setLanguage('vi')} className={`px-2 py-1 transition-colors duration-300 rounded-full ${language === 'vi' ? activeClass : inactiveClass}`}>VI</span>
        <span className="text-gray-300 dark:text-gray-600">|</span>
        <span onClick={() => setLanguage('en')} className={`px-2 py-1 transition-colors duration-300 rounded-full ${language === 'en' ? activeClass : inactiveClass}`}>EN</span>
      </div>
    );
};

const Nav = ({ theme, setTheme, language, setLanguage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenuToggle = () => setIsOpen(!isOpen);

  const handleNavLinkClick = (e, targetId) => {
    e.preventDefault();
    setIsOpen(false);

    if (targetId.startsWith('#')) {
      if (location.pathname === '/') {
        const element = document.querySelector(targetId);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate('/');
        setTimeout(() => {
          const element = document.querySelector(targetId);
          if (element) element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      navigate(targetId);
    }
  };

  const navLinks = [
    { href: "#about", label: portfolioData.navLinks.about[language] },
    { href: "#skills", label: portfolioData.navLinks.skills[language] },
    { href: "#projects", label: portfolioData.navLinks.projects[language] },
    { href: "#contact", label: portfolioData.navLinks.contact[language] },
    { href: "/chatbot", label: portfolioData.navLinks.chatbot[language] },
    { href: "/monitor", label: portfolioData.navLinks.monitor[language] },
  ];

  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50 transition-colors duration-300">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <a href="/" onClick={(e) => handleNavLinkClick(e, '#hero')} className="text-2xl font-bold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">{portfolioData.name}</a>
        <div className="flex items-center space-x-2 sm:space-x-4">
            <nav className="hidden md:flex space-x-8">
            {navLinks.map(link => (
                <a key={link.href} href={link.href} onClick={(e) => handleNavLinkClick(e, link.href)} className={`text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors ${location.pathname === link.href ? 'font-bold text-indigo-600 dark:text-indigo-400' : ''}`}>
                  {link.label}
                </a>
            ))}
            </nav>
            <ThemeToggle theme={theme} setTheme={setTheme} />
            <LanguageToggle language={language} setLanguage={setLanguage} />
            <button onClick={handleMenuToggle} className="md:hidden focus:outline-none text-slate-900 dark:text-white">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden px-6 pb-4 flex flex-col space-y-2 bg-white dark:bg-gray-900 shadow-lg">
          {navLinks.map(link => (
            <a key={link.href} href={link.href} onClick={(e) => handleNavLinkClick(e, link.href)} className="block py-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">{link.label}</a>
          ))}
        </div>
      )}
    </header>
  );
};

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

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const About = ({ language }) => (
  <motion.section id="about" className="py-20" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
    <h2 className="text-3xl font-bold text-center mb-12 text-slate-900 dark:text-white flex items-center justify-center gap-3"><User />{portfolioData.navLinks.about[language]}</h2>
    <div className="flex flex-col md:flex-row items-center gap-12">
      <div className="md:w-1/3">
        <img src="/Avatar.jpg" alt="Portrait" className="rounded-full shadow-lg mx-auto w-64 h-64 md:w-80 md:h-80 object-cover border-4 border-indigo-500" />
      </div>
      <div className="md:w-2/3 text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
        <p className="text-justify">{portfolioData.bio[language]}</p>
      </div>
    </div>
  </motion.section>
);

const Skills = ({ language }) => (
  <section id="skills" className="py-20 bg-gray-100 dark:bg-gray-800/50 rounded-xl">
    <h2 className="text-3xl font-bold text-center mb-12 text-slate-900 dark:text-white flex items-center justify-center gap-3"><Briefcase />{portfolioData.navLinks.skills[language]}</h2>
    <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center max-w-4xl mx-auto"
      initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}
      variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
    >
      {portfolioData.skills.map(skill => (
        <motion.div key={skill.name} className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl dark:hover:bg-gray-700 transition-all transform hover:-translate-y-2"
          variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
        >
          {skill.icon}
          <span className="font-semibold mt-3 text-gray-700 dark:text-gray-300">{skill.name}</span>
        </motion.div>
      ))}
    </motion.div>
  </section>
);

const Projects = ({ language }) => {
  const scrollContainer = useRef(null);
  const scrollLeft = () => { if (scrollContainer.current) scrollContainer.current.scrollBy({ left: -scrollContainer.current.offsetWidth, behavior: 'smooth' }); };
  const scrollRight = () => { if (scrollContainer.current) scrollContainer.current.scrollBy({ left: scrollContainer.current.offsetWidth, behavior: 'smooth' }); };

  return (
    <motion.section id="projects" className="py-20" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
      <h2 className="text-3xl font-bold text-center mb-12 text-slate-900 dark:text-white flex items-center justify-center gap-3"><Code />{portfolioData.navLinks.projects[language]}</h2>
      <div className="flex items-center justify-center gap-4">
        <button onClick={scrollLeft} className="flex-shrink-0 bg-white/50 dark:bg-gray-800/50 hover:bg-gray-200 dark:hover:bg-gray-700/80 rounded-full p-2 transition-colors duration-300"><ChevronLeft className="w-6 h-6 text-slate-800 dark:text-white" /></button>
        <div ref={scrollContainer} className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar space-x-8 py-4">
          {portfolioData.projects.map(project => (
            <div key={project.title.en} className="flex-shrink-0 w-full sm:w-[48%] lg:w-[31%] snap-center">
              <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg h-full flex flex-col transform group transition-transform duration-300 hover:scale-105">
                <img src={project.image} alt={project.title[language]} className="w-full h-48 object-cover flex-shrink-0" />
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">{project.title[language]}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm flex-grow">{project.description[language]}</p>
                  <div className="flex flex-wrap gap-2 mb-4 flex-shrink-0">
                    {project.tags.map(tag => <span key={tag} className="bg-indigo-100 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-300 text-xs font-semibold px-2.5 py-0.5 rounded-full">{tag}</span>)}
                  </div>
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-semibold transition-colors mt-auto flex-shrink-0">{project.detailsButton[language]} &rarr;</a>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button onClick={scrollRight} className="flex-shrink-0 bg-white/50 dark:bg-gray-800/50 hover:bg-gray-200 dark:hover:bg-gray-700/80 rounded-full p-2 transition-colors duration-300"><ChevronRight className="w-6 h-6 text-slate-800 dark:text-white" /></button>
      </div>
    </motion.section>
  );
};

const Contact = ({ language }) => (
  <motion.section id="contact" className="py-20" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
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
  </motion.section>
);

const Footer = ({ language }) => (
    <footer className="border-t border-gray-200 dark:border-gray-800 mt-20">
        <div className="container mx-auto px-6 py-6 text-center text-gray-500 dark:text-gray-400">
            <p>&copy; {new Date().getFullYear()} {portfolioData.name}. {portfolioData.footer.rights[language]}</p>
        </div>
    </footer>
);

// --- PAGES ---

// Home Page Component
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

const MonitorPage = () => {
  return (
    <div className="container mx-auto px-6 py-20 min-h-screen">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-10 text-slate-900 dark:text-white">
        System Health Monitor 🚦
      </h1>
      <div className="max-w-4xl mx-auto">
        <StatusDashboard />
      </div>
    </div>
  );
};

// --- MAIN APP ---
export default function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  return (
    <Router>
      <div className="bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-200 font-sans antialiased transition-colors duration-300 min-h-screen flex flex-col">
        <Nav theme={theme} setTheme={setTheme} language={language} setLanguage={setLanguage} />
        <Routes>
          <Route path="/" element={<HomePage language={language} />} />
          <Route path="/chatbot" element={<ChatBot theme={theme} language={language} />} />
          <Route path="/monitor" element={<MonitorPage />} />
        </Routes>
        <Footer language={language} />
      </div>
    </Router>
  );
}