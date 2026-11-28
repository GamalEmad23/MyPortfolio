(function () {
  var AR = {
    nav_projects: "الأعمال", nav_exp: "المسار", nav_skills: "الأدوات", nav_contact: "تواصل",
    hire: "تواصل معي",
    avail: "متاح لوظائف Flutter والتدريب والعمل الحر",
    hi: "أهلاً، أنا", n1: "جمال", n2: "عماد",
    h1a: "أبني تطبيقات Flutter على", h1b: "Clean Architecture",
    lead: "مطور Flutter مهتم بـ Clean Architecture، مع Firebase وREST APIs خلف الشاشات، وCubit (BLoC) أو Provider لإدارة الحالة.",
    cta_projects: "شاهد الأعمال", cta_contact: "تواصل معي",
    f1_d: "برنامجان: DEPI وNTI",
    f2_d: "علوم الحاسب، جامعة المنوفية",
    f3_d: "مشاريع Flutter على GitHub",
    hint: "حرّك الماوس على المجسمات · دوس عليها",
    k_arch: "طريقة عملي", h_arch: "تطبيق واحد، أربع طبقات واضحة.",
    arch_p: "الهيكل الذي أطبقه في مشاريع Flutter، من الشاشة وحتى مصدر البيانات.",
    l1: "العرض", l1d: "واجهة Flutter متجاوبة", l2: "الحالة", l3: "المستودع",
    l3d: "Clean Architecture · نمط Repository", l4: "البيانات",
    h_projects: "أعمال مختارة",
    proj_sub: "تطبيقان يوضحان المسار كامل: المعمارية والواجهة والخلفية والنشر.",
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
    h_exp: "المسار", completed: "مكتمل",
    t1: "مسار تطوير Flutter، DEPI",
    t1d: "تدريب عملي على Flutter يركز على التطوير متعدد المنصات ومعمارية التطبيقات الحديثة وأساليب العمل الرشيق. عملت مع Cubit / Bloc / Provider وREST APIs وFirebase (المصادقة وCloud Firestore وStorage وCloud Messaging) وGit/GitHub.",
    t2: "متدرب تطوير Flutter، NTI",
    t2d: "مسار تقني مكثف في Flutter وDart، ومسار غير تقني في مهارات العمل الحر والتفاوض والتواصل المهني. أنشأت مشاريع صغيرة بتطبيق Clean Architecture.",
    t3: "بكالوريوس علوم الحاسب", t3o: "كلية الحاسبات والمعلومات · جامعة المنوفية",
    t3d: "البرمجة كائنية التوجه، وهياكل البيانات والخوارزميات، وهندسة البرمجيات، وتصميم الأنظمة.",
    h_skills: "الأدوات",
    s1: "اللغات وأطر العمل", s2: "إدارة الحالة", s3: "الخلفية والخدمات", s4: "المعمارية", s5: "أسلوب العمل", s6: "اللغات",
    s6d: "العربية (لغة أم) · الإنجليزية (محادثة)",
    h_contact_a: "لنبنِ", h_contact_b: "شيئًا معًا",
    contact_p: "متاح لوظائف Flutter بدوام كامل، وللتدريب، ولمشاريع تطبيقات الهاتف الحرة.",
    copy_mail: "انسخ الإيميل", web_profile: "الصفحة التعريفية",
    foot_note: "المجسمات الثلاثية الأبعاد تعمل مباشرة بـ WebGL.", top: "العودة للأعلى ↑",
    hr_label: "إعادة تحميل"
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
    var lbl = document.querySelector(".lang-label");
    if (lbl) lbl.textContent = ar ? "EN" : "عربي";
    try { localStorage.setItem("language", l); } catch (e) {}
    document.dispatchEvent(new CustomEvent("langchange", { detail: { lang: l } }));
  }
  var langBtn = document.getElementById("language-toggle");
  if (langBtn) langBtn.addEventListener("click", function () { setLang(root.lang === "ar" ? "en" : "ar"); });

  var themeBtn = document.getElementById("theme-toggle");
  if (themeBtn) themeBtn.addEventListener("click", function () {
    var dark = root.classList.toggle("dark");
    try { localStorage.setItem("theme", dark ? "dark" : "light"); } catch (e) {}
    document.dispatchEvent(new CustomEvent("themechange", { detail: { dark: dark } }));
  });

  if (root.lang === "ar") setLang("ar");
})();
