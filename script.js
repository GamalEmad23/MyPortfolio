document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;
  const menuButton = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  const themeButton = document.getElementById('theme-toggle');
  const languageButton = document.getElementById('language-toggle');
  if (localStorage.getItem('theme') === 'light') root.classList.remove('dark');
  else root.classList.add('dark');
  themeButton.addEventListener('click', () => {
    root.classList.toggle('dark');
    localStorage.setItem('theme', root.classList.contains('dark') ? 'dark' : 'light');
  });
  menuButton.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
  });
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    menu.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  }));
  const translations = new Map(Object.entries({
    'HOME':'الرئيسية','ABOUT':'عني','SERVICES':'الخدمات','SKILLS':'المهارات','PORTFOLIO':'أعمالي','JOURNEY':'المسيرة','CONTACT':'تواصل معي','ABOUT ME':'نبذة عني','Home':'الرئيسية','About':'نبذة عني','Services':'الخدمات','Skills':'المهارات','Portfolio':'أعمالي','Journey':'المسيرة','Contact':'تواصل معي',
    'LET’S TALK':'لنتحدث','SERVICES':'الخدمات','MY SKILLS':'مهاراتي','PORTFOLIO':'معرض الأعمال','MY PROCESS':'منهجي','EDUCATION & TRAINING':'التعليم والتدريب','CONTACT':'تواصل معي',
    'What I Can':'ما الذي يمكنني','Build For You':'بناؤه لك','Mobile development from the first sketch to a dependable release.':'تطوير تطبيقات الهاتف من أول تصور حتى إصدار موثوق.',
    'Flutter App Development':'تطوير تطبيقات Flutter','Cross-platform Android and iOS apps built in Flutter and Dart.':'تطبيقات Android وiOS متعددة المنصات باستخدام Flutter وDart.',
    'App Architecture':'بنية التطبيقات','Maintainable structure with Clean Architecture and clear feature boundaries.':'بنية سهلة الصيانة باستخدام Clean Architecture وتقسيم واضح للميزات.',
    'APIs & Firebase':'واجهات API وFirebase','REST API integration, authentication, Firestore, storage, and notifications.':'دمج REST API والمصادقة وFirestore والتخزين والإشعارات.',
    'Responsive UI':'واجهات متجاوبة','Carefully crafted mobile screens that feel consistent and intuitive.':'شاشات هاتف مصممة بعناية لتبدو متناسقة وسهلة الاستخدام.',
    'Technologies I':'تقنيات','Work With':'أعمل بها','A practical toolkit for building, integrating, and shipping mobile apps.':'أدوات عملية لبناء تطبيقات الهاتف ودمجها وإطلاقها.',
    'Selected':'مشاريع','Projects':'مختارة','Mobile projects I've been building with Flutter.':'تطبيقات هاتف أعمل عليها باستخدام Flutter.','MORE ON GITHUB ↗':'المزيد على GitHub ↗',
    'VIEW PROJECT ↗':'شاهد المشروع ↗','From Idea to':'من الفكرة إلى','App Store':'التطبيق','A clear workflow keeps the product focused and code maintainable.':'سير عمل واضح يحافظ على تركيز المنتج وسهولة صيانة الكود.',
    'DISCOVER':'اكتشاف','Understand users, goals, and core requirements.':'فهم المستخدمين والأهداف ومتطلبات التطبيق الأساسية.','PLAN':'تخطيط','Shape features, data, and clean architecture.':'تحديد الميزات والبيانات والبنية النظيفة.','DESIGN':'تصميم','Create responsive screens and clear user flows.':'إنشاء شاشات متجاوبة وتدفقات استخدام واضحة.','DEVELOP':'تطوير','Build in Flutter, connect services, and refine.':'التطوير باستخدام Flutter وربط الخدمات وتحسين التفاصيل.','SHIP':'إطلاق','Polish the release and plan the next iteration.':'تجهيز الإصدار وصقله والتخطيط للتطوير التالي.',
    'My':'محطات في','So Far':'من مسيرتي','Milestones from my training and Computer Science studies.':'محطات من تدريبي ودراستي لعلوم الحاسب.','Flutter Developer Intern':'متدرب تطوير Flutter','Flutter development, modern architecture, Firebase, API integration, and agile practices.':'تطوير Flutter والبنية الحديثة وFirebase وواجهات API والعمل ضمن فريق رشيق.','Flutter Developer Trainee':'متدرب Flutter','Technical Flutter and Dart training plus freelancing and collaborative project work.':'تدريب تقني على Flutter وDart والعمل الحر وتنفيذ المشاريع بصورة تعاونية.','BSc in Computer Science':'بكالوريوس علوم الحاسب','Software engineering, OOP, data structures and algorithms, and system design.':'هندسة البرمجيات والبرمجة كائنية التوجه وهياكل البيانات والخوارزميات وتصميم الأنظمة.',
    "Let's Build Something":'لنبنِ شيئًا','Great Together':'رائعًا معًا','Looking for a Flutter developer for your next project or team? I'd be glad to hear what you're building.':'هل تبحث عن مطور Flutter لمشروعك القادم أو لفريقك؟ يسعدني معرفة ما تعملون عليه.',
    'EMAIL ME':'راسلني','CALL / WHATSAPP':'اتصال / واتساب','Menoufia, Egypt':'المنوفية، مصر','AVAILABLE FOR OPPORTUNITIES':'متاح لفرص العمل','All rights reserved.':'جميع الحقوق محفوظة.','BACK TO TOP ↑':'للأعلى ↑'
  }));
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (node.parentElement?.closest('[data-en][data-ar]')) continue;
    const key = node.nodeValue.trim();
    if (translations.has(key)) nodes.push({ node, key, prefix: node.nodeValue.match(/^\s*/)[0], suffix: node.nodeValue.match(/\s*$/)[0] });
  }
  function setLanguage(language) {
    const arabic = language === 'ar';
    root.lang = arabic ? 'ar' : 'en';
    root.dir = arabic ? 'rtl' : 'ltr';
    document.querySelectorAll('[data-en][data-ar]').forEach(element => {
      element.innerHTML = element.dataset[arabic ? 'ar' : 'en'];
    });
    nodes.forEach(({ node, key, prefix, suffix }) => {
      node.nodeValue = prefix + (arabic ? translations.get(key) : key) + suffix;
    });
    languageButton.querySelector('span').textContent = arabic ? 'EN' : 'AR';
    languageButton.title = arabic ? 'Change language' : 'تغيير اللغة';
    document.title = arabic ? 'جمال عماد — مطور Flutter' : 'Gamal Emad — Flutter Developer';
    localStorage.setItem('language', language);
  }
  languageButton.addEventListener('click', () => setLanguage(root.lang === 'ar' ? 'en' : 'ar'));
  setLanguage(localStorage.getItem('language') === 'ar' ? 'ar' : 'en');
});
