import { Code, Server, Container, Cuboid, Book, Briefcase, User, MessageSquare } from 'lucide-react';

export const portfolioData = {
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
