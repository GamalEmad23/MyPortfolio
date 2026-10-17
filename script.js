tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['Inter', 'sans-serif'],
                    },
                    colors: {
                        brand: {
                            50: '#eff6ff',
                            100: '#dbeafe',
                            400: '#60a5fa',
                            500: '#3b82f6',
                            600: '#2563eb',
                            700: '#1d4ed8',
                            accent: '#00d2b8',
                        }
                    }
                }
            }
        }

document.addEventListener('DOMContentLoaded', () => {
// Dark / Light Theme Toggler Logic
        const themeToggleBtn = document.getElementById('theme-toggle');
        
        // Initialize Theme from LocalStorage or System Preference
        if (localStorage.getItem('theme') === 'light') {
            document.documentElement.classList.remove('dark');
        } else {
            document.documentElement.classList.add('dark');
        }

        themeToggleBtn.addEventListener('click', () => {
            if (document.documentElement.classList.contains('dark')) {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('theme', 'light');
            } else {
                document.documentElement.classList.add('dark');
                localStorage.setItem('theme', 'dark');
            }
        });

        // Mobile Navigation Toggle Logic
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');

        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        // Close mobile menu on link click
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });

        // English / Arabic language toggle
        const translations = {
            "About":"نبذة عني", "Experience":"الخبرات", "Projects":"المشاريع", "Skills":"المهارات", "Contact":"تواصل معي", "Resume":"السيرة الذاتية", "Get Resume":"تحميل السيرة الذاتية",
            "Available for Mobile App Opportunities":"متاح لفرص تطوير تطبيقات الهاتف", "Hi, I'm ":"مرحبًا، أنا ", "Flutter Developer | Mobile Application Engineer":"مطور Flutter | مهندس تطبيقات الهاتف", "Clean Architecture":"البنية النظيفة",
            "Mobile application developer specializing in Flutter with hands-on experience building scalable, production-ready apps using ":"مطور تطبيقات هاتف متخصص في Flutter، ولدي خبرة عملية في بناء تطبيقات قابلة للتوسع وجاهزة للإنتاج باستخدام ", ". Proficient in Firebase services, RESTful API integration, and state management solutions including Cubit (BLOC) & Provider. Fast learner who thrives under pressure with a passion for clean, maintainable code and polished, responsive user interfaces.":". أجيد خدمات Firebase ودمج REST APIs وإدارة الحالة باستخدام Cubit (BLOC) وProvider. أتعلم بسرعة وأعمل بكفاءة تحت الضغط، وأهتم بكتابة كود واضح وسهل الصيانة وتصميم واجهات متجاوبة ومتقنة.",
            "CS Major":"طالب علوم حاسب", "Class of 2027":"دفعة 2027", "DEPI & NTI":"DEPI وNTI", "Trained Engineer":"مهندس متدرب", "Clean Code":"كود نظيف", "Bloc & Cubit Expert":"خبير Bloc وCubit", "View My Projects":"شاهد مشاريعي", "Get In Touch":"تواصل معي", "Connect:":"تابعني:", "DEPI & NTI Trainee":"متدرب في DEPI وNTI",
            "Track Record":"المسيرة المهنية", "Experience & Education":"الخبرات والتعليم", "Practical engineering internships and academic background.":"خبرات التدريب العملي والخلفية الأكاديمية.", "Flutter Developer Intern":"متدرب تطوير Flutter", "Practical Training":"تدريب عملي", "Practical Flutter training focused on cross-platform mobile development, modern app architecture, and Agile team practices.":"تدريب عملي على Flutter يركز على تطوير تطبيقات متعددة المنصات، وبنية التطبيقات الحديثة، وأساليب العمل الرشيق.",
            "Developed cross-platform mobile applications using Flutter and Dart.":"طورت تطبيقات هاتف متعددة المنصات باستخدام Flutter وDart.", "Integrated RESTful APIs and managed state using modern Flutter architectures (Cubit / Bloc / Provider).":"دمجت REST APIs وأدرت الحالة باستخدام أنماط Flutter الحديثة (Cubit وBloc وProvider).", "Worked with Firebase services including Authentication, Cloud Firestore, Storage, and Cloud Messaging.":"استخدمت خدمات Firebase، ومنها المصادقة وCloud Firestore والتخزين والرسائل السحابية.", "Applied Git/GitHub for version control and collaborative team development.":"استخدمت Git وGitHub لإدارة الإصدارات والعمل الجماعي.", "Built responsive UI designs and optimized app performance across Android and iOS platforms.":"أنشأت واجهات متجاوبة وحسنت أداء التطبيقات على Android وiOS.",
            "Flutter Developer Trainee":"متدرب Flutter", "Intensive Track":"مسار مكثف", "Completed an intensive Technical Track covering deep Flutter & Dart development.":"أكملت مسارًا تقنيًا مكثفًا في تطوير Flutter وDart.", "Completed a Non-Technical Track focused on Freelancing Skills, business negotiation, and professional communication.":"أكملت مسارًا غير تقني ركز على العمل الحر والتفاوض والتواصل المهني.", "Built real-world mini-projects applying Clean Architecture and industry best practices.":"أنشأت مشاريع تطبيقية باستخدام Clean Architecture وأفضل ممارسات المجال.", "Practiced agile workflows, code review, and collaborative development.":"تدربت على أساليب العمل الرشيق ومراجعة الكود والتطوير التعاوني.",
            "Bachelor's Degree in Computer Science":"بكالوريوس علوم الحاسب", "Class of 2027":"دفعة 2027", "Specializing in Computer Science with focus on Object-Oriented Programming (OOP), Data Structures & Algorithms, Software Engineering principles, and System Design.":"أدرس علوم الحاسب مع التركيز على البرمجة كائنية التوجه وهياكل البيانات والخوارزميات ومبادئ هندسة البرمجيات وتصميم الأنظمة.",
            "Portfolio Work":"أعمالي", "Featured Mobile Projects":"أبرز مشاريع الهاتف", "Real-world Flutter applications built with Clean Architecture & modern APIs.":"تطبيقات Flutter عملية مبنية باستخدام Clean Architecture وواجهات API حديثة.", "DEPI Graduation Project":"مشروع تخرج DEPI", "Smart recycling platform with rewards, achievements, and environmental impact tracking. Built to encourage community recycling through gamification and interactive center discovery.":"منصة ذكية لإعادة التدوير تتضمن مكافآت وإنجازات وتتبعًا للأثر البيئي، وتشجع المجتمع على إعادة التدوير عبر التلعيب واكتشاف مراكز التدوير.", "Built interactive features for locating recycling centers via Google Maps.":"طورت ميزات تفاعلية للعثور على مراكز التدوير عبر خرائط Google.", "Implemented rewards, levels, badges, and environmental progress statistics.":"أضفت المكافآت والمستويات والشارات وإحصاءات التقدم البيئي.", "Added educational content & admin dashboard management functionalities.":"أضفت محتوى تعليميًا وميزات لإدارة لوحة التحكم.", "Source Code & Demo":"الكود المصدري والعرض", "GitHub Repo":"مستودع GitHub", "Machine Learning Mobile App":"تطبيق تعلم آلي للهاتف", "Cross-platform mobile application connected to a FastAPI machine learning backend, allowing users to upload datasets, train models, monitor status, and inspect prediction outcomes in real-time.":"تطبيق هاتف متعدد المنصات متصل بخلفية تعلم آلي باستخدام FastAPI، يتيح رفع البيانات وتدريب النماذج ومتابعة حالتها واستعراض نتائج التنبؤ مباشرة.", "Built responsive mobile screens for managing datasets and predictions.":"أنشأت شاشات متجاوبة لإدارة مجموعات البيانات والتنبؤات.", "Integrated FastAPI endpoints for model training, status checking, and results display.":"دمجت نقاط FastAPI لتدريب النماذج ومتابعة الحالة وعرض النتائج.", "Implemented clean UI flow with seamless asynchronous state management.":"أنشأت تجربة استخدام واضحة مع إدارة سلسة للحالة غير المتزامنة.",
            "Technical Arsenal":"المهارات التقنية", "Skills & Capabilities":"المهارات والقدرات", "Technologies, tools, architectures, and soft skills I bring to teams.":"التقنيات والأدوات والبنى والمهارات الشخصية التي أقدمها للفريق.", "Languages & Frameworks":"اللغات وأطر العمل", "State Management":"إدارة الحالة", "Backend & Services":"الخلفية والخدمات", "Architecture":"البنية البرمجية", "Tools & Workflow":"الأدوات وسير العمل", "Soft Skills & Languages":"المهارات الشخصية واللغات", "Teamwork":"العمل الجماعي", "Problem Solving":"حل المشكلات", "Work Under Pressure":"العمل تحت الضغط", "Arabic (Native)":"العربية (اللغة الأم)", "English (Conversation)":"الإنجليزية (محادثة)",
            "Get In Touch":"تواصل معي", "Let's Build Something Great Together":"لنبنِ شيئًا رائعًا معًا", "I am available for full-time Flutter roles, internships, and freelance mobile application engineering projects. Reach out directly via email or phone!":"أنا متاح لوظائف Flutter بدوام كامل والتدريب ومشاريع تطوير تطبيقات الهاتف المستقلة. تواصل معي مباشرة عبر البريد الإلكتروني أو الهاتف!", "Direct Email":"البريد الإلكتروني", "Phone / WhatsApp":"الهاتف / واتساب", "Location":"الموقع", "Menoufia, Egypt":"المنوفية، مصر", "Send an Email":"أرسل بريدًا إلكترونيًا", "Connect on LinkedIn":"تواصل عبر LinkedIn", "Check GitHub Profile":"شاهد حساب GitHub", "All rights reserved.":"جميع الحقوق محفوظة.", "Back to Top ":"العودة إلى الأعلى "
        };
        const languageToggle = document.getElementById('language-toggle');
        const textNodes = [];
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        while (walker.nextNode()) {
            const node = walker.currentNode;
            if (node.nodeValue.trim()) textNodes.push({ node, original: node.nodeValue });
        }
        const englishToArabic = new Map(Object.entries(translations));
        const arabicToEnglish = new Map(Object.entries(translations).map(([en, ar]) => [ar, en]));
        function setLanguage(language) {
            const arabic = language === 'ar';
            document.documentElement.lang = arabic ? 'ar' : 'en';
            document.documentElement.dir = arabic ? 'rtl' : 'ltr';
            textNodes.forEach(({ node }) => {
                const value = node.nodeValue;
                const trimmed = value.trim();
                const translated = arabic ? englishToArabic.get(trimmed) : arabicToEnglish.get(trimmed);
                if (translated) node.nodeValue = value.replace(trimmed, translated);
            });
            document.title = arabic ? 'جمال عماد | مطور Flutter ومهندس تطبيقات الهاتف' : 'Gamal Emad | Flutter Developer & Mobile Engineer';
            languageToggle.title = arabic ? 'تغيير اللغة / Change language' : 'Change language / تغيير اللغة';
            localStorage.setItem('language', language);
        }
        languageToggle.addEventListener('click', () => setLanguage(document.documentElement.lang === 'ar' ? 'en' : 'ar'));
        if (localStorage.getItem('language') === 'ar') setLanguage('ar');
});
