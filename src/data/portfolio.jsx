import {
    Code, Server, Container, Cuboid, Book, Briefcase, User, MessageSquare,
    Bot, PenTool, Atom, Terminal, ShipWheel, Zap, Braces, Layers, Database,
    MonitorCog, Wrench, BookOpen, Kanban, FileCode
} from 'lucide-react';

export const portfolioData = {
    name: "Phúc Vũ",
    title: {
        en: "Software Engineer & Scrum Master",
        vi: "Kỹ Sư Phần Mềm & Scrum Master"
    },
    bio: {
        en: "I am Vu Dinh Bao Phuc, a Software Engineer and PSM I certified Scrum Master with over four years of experience. Currently, I serve as both the Scrum Master and Software Engineer for a telecommunications IMS project, specializing in P-CSCF and IBCF components. The combination of my strong technical background and Agile project management mindset allows me to solve complex challenges and drive teams toward peak performance. While I have deep expertise in the telco industry, I am always eager to embrace new challenges and expand my contributions into emerging technology domains.",
        vi: "Tôi là Vũ Đình Bảo Phúc, một Kỹ sư phần mềm và Scrum Master được chứng nhận PSM I với hơn bốn năm kinh nghiệm. Hiện tại, tôi đang đảm nhiệm vai trò Scrum Master và Kỹ sư phần mềm cho dự án hệ thống viễn thông IMS, đặc biệt chuyên sâu về các thành phần P-CSCF và IBCF. Sự kết hợp giữa kỹ năng kỹ thuật vững vàng và tư duy quản lý dự án Agile giúp tôi giải quyết các bài toán phức tạp và thúc đẩy đội nhóm đạt hiệu suất cao nhất. Dù có chuyên môn sâu trong ngành viễn thông, tôi luôn sẵn sàng đón nhận thử thách và mở rộng khả năng đóng góp của mình sang các lĩnh vực công nghệ mới."
    },
    navLinks: {
        about: { en: "About", vi: "Về Tôi" },
        skills: { en: "Skills", vi: "Kỹ Năng" },
        projects: { en: "Projects", vi: "Dự Án" },
        certificates: { en: "Certificates", vi: "Chứng Chỉ" },
        contact: { en: "Contact", vi: "Liên Hệ" },
        chatbot: { en: "ChatBot", vi: "Trợ lý ảo" },
        monitor: { en: "System Status", vi: "Trạng thái hệ thống" },
        blog: { en: "Blog", vi: "Bài viết" }
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
        { name: "JavaScript", icon: <FileCode className="w-8 h-8 text-yellow-400" /> },
        { name: "React", icon: <Atom className="w-8 h-8 text-sky-400" /> },
        { name: "Node.js", icon: <Server className="w-8 h-8 text-green-500" /> },
        { name: "Python", icon: <Terminal className="w-8 h-8 text-blue-500" /> },
        { name: "Kubernetes", icon: <ShipWheel className="w-8 h-8 text-blue-400" /> },
        { name: "Erlang", icon: <Zap className="w-8 h-8 text-red-500" /> },
        { name: "C++", icon: <Braces className="w-8 h-8 text-purple-600" /> },
        { name: "Docker", icon: <Container className="w-8 h-8 text-blue-600" /> },
        { name: "VMWare", icon: <Layers className="w-8 h-8 text-gray-500" /> },
        { name: "Redis", icon: <Database className="w-8 h-8 text-red-600" /> },
        { name: "SUSE Linux", icon: <MonitorCog className="w-8 h-8 text-green-600" /> },
        { name: "Jenkins", icon: <Wrench className="w-8 h-8 text-slate-600 dark:text-slate-300" /> },
        { name: "Confluence", icon: <BookOpen className="w-8 h-8 text-blue-500" /> },
        { name: "Jira", icon: <Kanban className="w-8 h-8 text-blue-600" /> },
        { name: "Amazon Q", icon: <Bot className="w-8 h-8 text-purple-500" /> },
        { name: "Kiro", icon: <PenTool className="w-8 h-8 text-indigo-400" /> },
    ],
    projects: [
        {
            title: { en: "Telecommunication System", vi: "Hệ Thống Viễn Thông" },
            description: {
                en: "Developing a P-CSCF and IBCF in the IP Multimedia Subsystem (IMS) which is commonly used by many operators telecommunication network all over the world. Our product is supporting multimedia in IMS application such as Voice over LTE (VoLTE), WiFi-Calling and many interconnect scenarios.",
                vi: "Phát triển P-CSCF và IBCF trong Hệ thống con Đa phương tiện IP (IMS) được sử dụng rộng rãi bởi nhiều nhà mạng viễn thông trên toàn thế giới. Sản phẩm của chúng tôi hỗ trợ đa phương tiện trong ứng dụng IMS như Thoại qua LTE (VoLTE), Gọi qua WiFi (WiFi-Calling) và nhiều kịch bản kết nối liên mạng."
            },
            tags: ["Erlang", "Bash Script", "Micro service", "Virtual Machine", "Docker", "Kubernetes", "SUSE Linux", "JIRA", "Confluence", "Jenkin", "Redis"],
            link: "#",
            details: {
                en: "• Domain: Logging, Performance Management, Fault Management, Characteristic and Robustness and Cloud Native\n• Collaborating within a Scrum team (comprising 9 members, including Developers, Scrum Master, and Product Owner), actively participating in all Scrum ceremonies and contributing as a member of a cross-functional team\n• Analyzing and proposing solutions for new customer requirements to enhance the product's functionality\n• Expanding software capabilities by developing and integrating new features to meet customer needs, using Erlang to build features on a virtual machine, with Docker for containerization and Kubernetes for cloud-native deployment.\n• Updating documentation to provide clear guidance for customers on how to use the product effectively\n• Executing a structured testing strategy across three key phases: unit testing, functional testing, and node-level system testing, to ensure comprehensive coverage and product reliability\n• Monitoring test results on Jenkins to ensure the product's quality, stability and reliability\n• Collaborating with the network system testing team to identify, troubleshoot, and resolve bugs, ensuring high-quality software delivery\n• Working closely with team members to troubleshoot and debug software issues, ensuring timely resolution and smooth product operation\n• Engaging with stakeholders to clarify issues and proactively manage the ongoing performance and maintenance of the product",
                vi: "• Lĩnh vực: Logging, Quản lý Hiệu suất, Quản lý Lỗi, Đặc tính, Độ bền bỉ và Điện toán Đám mây (Cloud Native)\n• Phối hợp làm việc trong nhóm Scrum (gồm 9 thành viên: Lập trình viên, Scrum Master và Product Owner), tích cực tham gia các sự kiện Scrum và đóng góp như một thành viên của nhóm đa chức năng\n• Phân tích và đề xuất giải pháp cho các yêu cầu mới của khách hàng nhằm nâng cao chức năng của sản phẩm\n• Mở rộng khả năng phần mềm bằng cách phát triển và tích hợp các tính năng mới để đáp ứng nhu cầu khách hàng, sử dụng Erlang để xây dựng tính năng trên máy ảo, với Docker để container hóa và Kubernetes để triển khai cloud-native\n• Cập nhật tài liệu để cung cấp hướng dẫn rõ ràng cho khách hàng về cách sử dụng sản phẩm hiệu quả\n• Thực thi chiến lược kiểm thử có cấu trúc qua ba giai đoạn: kiểm thử đơn vị, kiểm thử chức năng và kiểm thử hệ thống cấp độ node, đảm bảo độ bao phủ toàn diện và độ tin cậy của sản phẩm\n• Theo dõi kết quả kiểm thử trên Jenkins để đảm bảo chất lượng, tính ổn định và độ tin cậy của sản phẩm\n• Phối hợp với đội kiểm thử hệ thống mạng để xác định, chẩn đoán và khắc phục lỗi, đảm bảo chất lượng phần mềm cao nhất\n• Làm việc chặt chẽ với các thành viên để gỡ lỗi các sự cố phần mềm, đảm bảo khắc phục kịp thời và hoạt động trơn tru\n• Trao đổi với các bên liên quan để làm rõ sự cố và chủ động quản lý hiệu suất cũng như bảo trì sản phẩm"
            },
            image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=600&auto=format&fit=crop",
            detailsButton: { en: "View Details", vi: "Xem chi tiết" }
        },
        {
            title: { en: "Scrum Master", vi: "Scrum Master" },
            description: {
                en: "As a Scrum Master, I facilitated Agile ceremonies, removed impediments, and guided the team in adhering to Scrum practices to ensure successful delivery of the project. I worked closely with the Product Owner, stakeholders, and the development team to ensure alignment with project objectives.",
                vi: "Trong vai trò Scrum Master, tôi điều phối các sự kiện Agile, loại bỏ rào cản và hướng dẫn đội nhóm tuân thủ các thực hành Scrum nhằm đảm bảo dự án được giao đúng hạn thành công. Tôi làm việc chặt chẽ với Product Owner, các bên liên quan và đội phát triển để đảm bảo mọi người cùng hướng tới mục tiêu chung."
            },
            tags: ["Agile", "Scrum", "Kanban", "TEAS", "Jira", "Confluence", "Microsoft Teams", "Miro", "Excel", "Power Point", "Power BI", "CFD Chart", "Burn Down Chart"],
            link: "https://www.credly.com/badges/01e6a425-dbdb-4420-9207-30c0984dd21a/public_url",
            details: {
                en: "• Organizing and facilitating Agile ceremonies and events.\n• Guiding the team to work effectively within the Agile framework.\n• Supporting the team in feature development using Scrum and managing maintenance tasks through Kanban.\n• Assisting the team in resolving any conflicts that may arise.\n• Communicating leadership team directives and translating them into actionable tasks for the team.",
                vi: "• Tổ chức và điều phối các buổi họp và sự kiện Agile.\n• Hướng dẫn đội nhóm làm việc hiệu quả theo đúng framework Agile.\n• Hỗ trợ đội nhóm phát triển tính năng sử dụng Scrum và quản lý các công việc bảo trì qua Kanban.\n• Hỗ trợ giải quyết các xung đột phát sinh trong nhóm.\n• Truyền đạt các chỉ đạo từ ban lãnh đạo và chuyển đổi chúng thành các công việc cụ thể cho đội nhóm thực hiện."
            },
            image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=600&auto=format&fit=crop",
            detailsButton: { en: "View Details", vi: "Xem chi tiết" }
        },
        {
            title: { en: "Kazoo - Line Manager Internship Program", vi: "Hệ thống Kazoo - Line Manager Internship Program" },
            description: {
                en: "As a mentor, Product Owner and Line Manager for the internship program, I help interns gain a deeper understanding of the company's way of working. I guide them through small projects that closely resemble real-world tasks, providing hands-on experience.",
                vi: "Trong vai trò người hướng dẫn, Product Owner và Line Manager cho chương trình thực tập, tôi giúp các thực tập sinh hiểu sâu hơn về cách thức làm việc của công ty. Tôi hướng dẫn họ thông qua các dự án nhỏ mô phỏng thực tế công việc, mang lại trải nghiệm thực tiễn quý giá."
            },
            tags: ["Erlang", "Bash Script", "Docker", "Kazoo", "MobaXterm", "Linux", "Gerrit", "Jenkin"],
            link: "#",
            details: {
                en: "• Organizing meetings to help interns understand the Agile way of working, the Scrum framework, and the internship project's scope\n• Reviewing and evaluating their understanding, providing corrections and clarifications as needed\n• Reviewing code changes to ensure quality and adherence to best practices\n• Providing feedback at the end of each sprint, helping interns track their progress and improve their work\n• Preparing the project environment, including deploying the Kazoo server and setting up the documentation server",
                vi: "• Tổ chức các buổi họp giúp thực tập sinh hiểu về phương pháp làm việc Agile, framework Scrum và phạm vi của dự án thực tập\n• Đánh giá mức độ hiểu biết của thực tập sinh, đồng thời đưa ra các góp ý và giải thích khi cần thiết\n• Đánh giá mã nguồn (code review) để đảm bảo chất lượng và tuân thủ các thực hành tốt nhất (best practices)\n• Cung cấp phản hồi vào cuối mỗi sprint, giúp thực tập sinh theo dõi tiến độ và cải thiện kỹ năng\n• Chuẩn bị môi trường dự án, bao gồm triển khai máy chủ Kazoo và thiết lập máy chủ tài liệu (documentation server)"
            },
            image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&auto=format&fit=crop",
            detailsButton: { en: "View Details", vi: "Xem chi tiết" }
        },
        {
            title: { en: "LoRaWAN gateway's coverage display system", vi: "Hệ thống đo lường và hiển thị vùng phủ sóng LoRaWAN" },
            description: {
                en: "This project involved researching and developing a device to measure signal strength for LoRaWAN gateways and a system to display the coverage area of LoRaWAN gateways.",
                vi: "Dự án này liên quan đến việc nghiên cứu và phát triển một thiết bị để đo lường cường độ tín hiệu cho các gateway LoRaWAN và một hệ thống để hiển thị vùng phủ sóng của các gateway này."
            },
            tags: ["C++", "JavaScript", "TypeScript", "React Native", "LoRa", "Arduino IDE"],
            link: "#",
            details: {
                en: "• Designed a GPS-enabled device capable of determining location and measuring signal strength between the device and the LoRa gateway.\n• Developed a server to act as a mediator between The Things Network cloud and Firebase Database, ensuring seamless data transmission.\n• Created an application to visualize the signal strength between the device and the LoRa gateway through an interactive heatmap.",
                vi: "• Thiết kế một thiết bị có hỗ trợ GPS có khả năng xác định vị trí và đo lường cường độ tín hiệu giữa thiết bị và gateway LoRa.\n• Phát triển một máy chủ trung gian giữa đám mây The Things Network và cơ sở dữ liệu Firebase, đảm bảo truyền dữ liệu liền mạch.\n• Tạo một ứng dụng để trực quan hóa cường độ tín hiệu giữa thiết bị và gateway LoRa thông qua một bản đồ nhiệt tương tác (heatmap)."
            },
            image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=crop",
            detailsButton: { en: "View Details", vi: "Xem chi tiết" }
        }
    ],
    certificates: [
        {
            title: { en: "Professional Scrum Master™ I (PSM I)", vi: "Professional Scrum Master™ I (PSM I)" },
            issuer: "Scrum.org",
            date: "Sep 2025",
            image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&auto=format&fit=crop",
            link: "https://www.credly.com/badges/01e6a425-dbdb-4420-9207-30c0984dd21a/public_url",
            detailsButton: { en: "View Credential", vi: "Xem Chứng Chỉ" }
        },
        {
            title: { en: "Advanced Kubernetes Kustomize", vi: "Advanced Kubernetes Kustomize" },
            issuer: "O'Reilly Media",
            date: "Apr 2026",
            image: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=600&auto=format&fit=crop",
            link: "https://www.credly.com/users/phuc-vu-1810/badges",
            detailsButton: { en: "View Credential", vi: "Xem Chứng Chỉ" }
        },
        {
            title: { en: "CSM and Agile Scrum Course", vi: "CSM and Agile Scrum Course" },
            issuer: "O'Reilly Media",
            date: "Mar 2025",
            image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=600&auto=format&fit=crop",
            link: "https://www.credly.com/users/phuc-vu-1810/badges",
            detailsButton: { en: "View Credential", vi: "Xem Chứng Chỉ" }
        },
        {
            title: { en: "Helm Applications", vi: "Helm Applications" },
            issuer: "O'Reilly Media",
            date: "Apr 2026",
            image: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=600&auto=format&fit=crop",
            link: "https://www.credly.com/users/phuc-vu-1810/badges",
            detailsButton: { en: "View Credential", vi: "Xem Chứng Chỉ" }
        },
        {
            title: { en: "Helm Charts for Kubernetes", vi: "Helm Charts for Kubernetes" },
            issuer: "O'Reilly Media",
            date: "Apr 2026",
            image: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=600&auto=format&fit=crop",
            link: "https://www.credly.com/users/phuc-vu-1810/badges",
            detailsButton: { en: "View Credential", vi: "Xem Chứng Chỉ" }
        },
        {
            title: { en: "K8s Cluster RBAC", vi: "K8s Cluster RBAC" },
            issuer: "O'Reilly Media",
            date: "Apr 2026",
            image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=600&auto=format&fit=crop",
            link: "https://www.credly.com/users/phuc-vu-1810/badges",
            detailsButton: { en: "View Credential", vi: "Xem Chứng Chỉ" }
        },
        {
            title: { en: "K8s Service Uptime", vi: "K8s Service Uptime" },
            issuer: "O'Reilly Media",
            date: "Apr 2026",
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop",
            link: "https://www.credly.com/users/phuc-vu-1810/badges",
            detailsButton: { en: "View Credential", vi: "Xem Chứng Chỉ" }
        },
        {
            title: { en: "Kubernetes for Beginners", vi: "Kubernetes for Beginners" },
            issuer: "O'Reilly Media",
            date: "Mar 2025",
            image: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=600&auto=format&fit=crop",
            link: "https://www.credly.com/users/phuc-vu-1810/badges",
            detailsButton: { en: "View Credential", vi: "Xem Chứng Chỉ" }
        },
        {
            title: { en: "Kubernetes Network Policies", vi: "Kubernetes Network Policies" },
            issuer: "O'Reilly Media",
            date: "Apr 2026",
            image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=600&auto=format&fit=crop",
            link: "https://www.credly.com/users/phuc-vu-1810/badges",
            detailsButton: { en: "View Credential", vi: "Xem Chứng Chỉ" }
        },
        {
            title: { en: "Kubernetes Observability Tools", vi: "Kubernetes Observability Tools" },
            issuer: "O'Reilly Media",
            date: "Apr 2026",
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop",
            link: "https://www.credly.com/users/phuc-vu-1810/badges",
            detailsButton: { en: "View Credential", vi: "Xem Chứng Chỉ" }
        },
        {
            title: { en: "Kubernetes Security Contexts", vi: "Kubernetes Security Contexts" },
            issuer: "O'Reilly Media",
            date: "Apr 2026",
            image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=600&auto=format&fit=crop",
            link: "https://www.credly.com/users/phuc-vu-1810/badges",
            detailsButton: { en: "View Credential", vi: "Xem Chứng Chỉ" }
        },
        {
            title: { en: "Linux Performance Tools", vi: "Linux Performance Tools" },
            issuer: "O'Reilly Media",
            date: "Sep 2025",
            image: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?q=80&w=600&auto=format&fit=crop",
            link: "https://www.credly.com/users/phuc-vu-1810/badges",
            detailsButton: { en: "View Credential", vi: "Xem Chứng Chỉ" }
        }
    ],
    footer: {
        rights: { en: "All Rights Reserved.", vi: "Bản quyền được bảo lưu." }
    },
    blog: {
        githubUsername: "vdbphuc",
        repoName: "react-portfolio"
    }
};
