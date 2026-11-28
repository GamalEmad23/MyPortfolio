(function () {
  var AR = {
    hi: "أهلاً، أنا",
    h1: "أبني تطبيقات Flutter على <mark>Clean Architecture</mark>.",
    l4: "البيانات",
    l3d: "Clean Architecture · نمط Repository",
    l3: "المستودع",
    l2: "الحالة",
    l1d: "واجهة Flutter متجاوبة",
    l1: "العرض",
    arch_p: "الهيكل الذي أطبقه في مشاريع Flutter، من الشاشة وحتى مصدر البيانات.",
    h_arch: "تطبيق واحد، أربع طبقات واضحة.",
    k_arch: "طريقة عملي",
    n2: "عماد",
    n1: "جمال",
    hire: "تواصل معي",
    nav_projects: "الأعمال", nav_exp: "المسار", nav_skills: "الأدوات", nav_contact: "تواصل",
    resume: "اطلب السيرة الذاتية",
    avail: "متاح لوظائف Flutter والتدريب والعمل الحر",
    h1: "تطبيقات Flutter مبنية على Clean Architecture",
    lead: "أبني تطبيقات Flutter على Clean Architecture، مع Firebase وREST APIs في الخلفية، وCubit (BLoC) أو Provider لإدارة الحالة.",
    cta_projects: "شاهد الأعمال", cta_contact: "تواصل معي", web_profile: "الصفحة التعريفية",
    role: "مطور Flutter / مهندس تطبيقات الهاتف",
    f1_t: "DEPI وNTI", f1_d: "خريج البرنامجين",
    f2_t: "علوم الحاسب", f2_d: "جامعة المنوفية، دفعة 2027",
    f3_t: "Flutter · Dart", f3_d: "Cubit (BLoC)، Provider",
    f4_t: "Firebase · REST", f4_d: "المصادقة وFirestore وStorage وFCM",
    k_projects: "أعمال مختارة", h_projects: "أعمال مختارة",
    eco_tag: "تطبيق ذكي لإعادة التدوير", eco_kind: "مشروع تخرج DEPI",
    eco_desc: "منصة ذكية لإعادة التدوير تتضمن مكافآت وإنجازات وتتبعًا للأثر البيئي. صُممت لتشجيع المجتمع على إعادة التدوير من خلال التحفيز واكتشاف المراكز تفاعليًا.",
    eco_1: "تحديد مراكز إعادة التدوير على خريطة تفاعلية.",
    eco_2: "مكافآت ومستويات وشارات وإحصاءات للتقدم البيئي.",
    eco_3: "محتوى تعليمي ولوحة تحكم للمشرفين.",
    eco_4: "هيكل مشروع قائم على الميزات مع Firebase في الخلفية.",
    source: "الكود على GitHub",
    ml_s1: "رفع البيانات", ml_s2: "تدريب النموذج", ml_s3: "متابعة الحالة", ml_s4: "فحص التوقعات",
    ml_kind: "تطبيق هاتف للتعلم الآلي",
    ml_desc: "تطبيق متعدد المنصات متصل بخلفية FastAPI للتعلم الآلي. يرفع المستخدم البيانات، ويدرّب النماذج، ويتابع الحالة، ويفحص نتائج التوقع لحظة بلحظة.",
    ml_1: "شاشات متجاوبة لإدارة البيانات والتوقعات.",
    ml_2: "نقاط FastAPI لتدريب النموذج والتحقق من الحالة وعرض النتائج.",
    ml_3: "تدفق واجهة نظيف مع إدارة حالة غير متزامنة.",
    more: "مستودعات Flutter أخرى", all_repos: "كل المستودعات ↗",
    k_exp: "الخلفية", h_exp: "المسار", completed: "مكتمل",
    t1: "مسار تطوير Flutter، DEPI",
    t1d: "تدريب عملي على Flutter يركز على التطوير متعدد المنصات ومعمارية التطبيقات الحديثة وأساليب العمل الرشيق. عملت مع Cubit / Bloc / Provider وREST APIs وFirebase (المصادقة وCloud Firestore وStorage وCloud Messaging) وGit/GitHub.",
    t2: "متدرب تطوير Flutter، NTI",
    t2d: "مسار تقني مكثف في Flutter وDart، ومسار غير تقني في مهارات العمل الحر والتفاوض والتواصل المهني. أنشأت مشاريع صغيرة بتطبيق Clean Architecture.",
    t3: "بكالوريوس علوم الحاسب", t3o: "كلية الحاسبات والمعلومات · جامعة المنوفية",
    t3d: "البرمجة كائنية التوجه، وهياكل البيانات والخوارزميات، وهندسة البرمجيات، وتصميم الأنظمة.",
    k_skills: "الأدوات", h_skills: "الأدوات",
    s1: "اللغات وأطر العمل", s2: "إدارة الحالة", s3: "الخلفية والخدمات", s4: "المعمارية", s5: "أسلوب العمل", s6: "اللغات", s6d: "العربية (لغة أم) · الإنجليزية (محادثة)",
    k_contact: "تواصل", h_contact: "لنبنِ شيئًا معًا.",
    contact_p: "متاح لوظائف Flutter بدوام كامل، وللتدريب، ولمشاريع تطبيقات الهاتف الحرة.",
    phone: "الهاتف / واتساب", loc: "الموقع", loc_v: "المنوفية، مصر", top: "العودة للأعلى ↑"
  };
  var root = document.documentElement;
  var nodes = Array.prototype.slice.call(document.querySelectorAll("[data-i18n]"));
  nodes.forEach(function (n) { n.setAttribute("data-en", n.innerHTML); });
  function setLang(l) {
    var ar = l === "ar";
    root.lang = ar ? "ar" : "en"; root.dir = ar ? "rtl" : "ltr";
    nodes.forEach(function (n) {
      var k = n.getAttribute("data-i18n");
      n.innerHTML = ar && AR[k] ? AR[k] : n.getAttribute("data-en");
    });
    document.title = ar ? "جمال عماد | مطور Flutter ومهندس تطبيقات الهاتف" : "Gamal Emad | Flutter Developer & Mobile Engineer";
    document.querySelector(".lang-label").textContent = ar ? "EN" : "عربي";
    try { localStorage.setItem("language", l); } catch (e) {}
  }
  document.getElementById("language-toggle").addEventListener("click", function () { setLang(root.lang === "ar" ? "en" : "ar"); });
  document.getElementById("theme-toggle").addEventListener("click", function () {
    var dark = root.classList.toggle("dark");
    try { localStorage.setItem("theme", dark ? "dark" : "light"); } catch (e) {}
  });
  if (root.lang === "ar") setLang("ar");
})();
