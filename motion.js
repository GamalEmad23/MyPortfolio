/* Motion layer: smooth scroll, scroll reveals, the hero intro, tilt, magnetic buttons,
   the counter numbers, the stacked case cards and the little hot-reload toy. */
(function () {
  "use strict";
  var root = document.documentElement;
  var gsap = window.gsap;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- marquee: double the track so the loop is seamless ---------- */
  var track = document.getElementById("stripTrack");
  if (track && track.children.length) track.innerHTML += track.innerHTML;

  /* ---------- copy email ---------- */
  var copyBtn = document.getElementById("copyMail");
  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      var mail = copyBtn.getAttribute("data-copy") || "";
      var label = copyBtn.querySelector("span") || copyBtn;
      var original = label.textContent;
      var done = root.lang === "ar" ? "تم النسخ ✓" : "Copied ✓";
      function flash() {
        label.textContent = done;
        setTimeout(function () { label.textContent = original; }, 1600);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(mail).then(flash, flash);
      } else {
        var ta = document.createElement("textarea");
        ta.value = mail; document.body.appendChild(ta); ta.select();
        try { document.execCommand("copy"); } catch (e) {}
        document.body.removeChild(ta); flash();
      }
    });
  }

  if (!gsap) { return; }
  if (window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);

  /* ---------- smooth scroll ---------- */
  var lenis = null;
  if (!reduce && window.Lenis) {
    lenis = new window.Lenis({ duration: 1.05, smoothWheel: true, wheelMultiplier: 1 });
    window.__lenis = lenis;
    if (window.ScrollTrigger) {
      lenis.on("scroll", window.ScrollTrigger.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    } else {
      function raf(t) { lenis.raf(t); requestAnimationFrame(raf); }
      requestAnimationFrame(raf);
    }
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener("click", function (e) {
        var id = a.getAttribute("href");
        if (!id || id === "#") return;
        var el = document.querySelector(id);
        if (!el) return;
        e.preventDefault();
        lenis.scrollTo(el, { offset: -84, duration: 1.1 });
      });
    });
  }

  /* ---------- progress bar + nav state ---------- */
  var bar = document.getElementById("progress");
  var top = document.getElementById("top");
  function onScroll() {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    if (bar) bar.style.width = (h > 0 ? Math.min(100, (window.scrollY / h) * 100) : 0) + "%";
    if (top) top.classList.toggle("is-stuck", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (reduce) return;

  /* ---------- counters ---------- */
  function countUp(el) {
    if (el.dataset.done) return;
    el.dataset.done = "1";
    var target = parseFloat(el.getAttribute("data-count")) || 0;
    var obj = { v: 0 };
    gsap.to(obj, {
      v: target, duration: 1.5, ease: "power2.out",
      onUpdate: function () { el.textContent = Math.round(obj.v); }
    });
  }

  /* ---------- hero intro ---------- */
  var intro = gsap.timeline({ defaults: { ease: "power3.out" }, delay: .12 });
  intro.from(".hero-copy [data-hero]", { y: 26, opacity: 0, duration: .75, stagger: .085 });
  intro.add(function () {
    document.querySelectorAll(".hero .stats [data-count]").forEach(countUp);
  }, .55);
  intro.from(".hero-hint", { opacity: 0, y: 8, duration: .6 }, .9);
  document.querySelectorAll(".hl").forEach(function (el, i) {
    var hl = { v: 0 };
    intro.to(hl, {
      v: 100, duration: .85, ease: "power2.inOut",
      onUpdate: function () { el.style.setProperty("--hl", hl.v + "%"); }
    }, .45 + i * .05);
  });

  window.addEventListener("load", function () {
    if (window.ScrollTrigger) window.ScrollTrigger.refresh();
  });

  /* ---------- reveals ---------- */
  gsap.utils.toArray("[data-reveal]").forEach(function (el) {
    gsap.from(el, {
      y: 26, opacity: 0, duration: .8, ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 90%", once: true },
      clearProps: "transform"
    });
  });
  if (window.ScrollTrigger) {
    gsap.from(".layers li", {
      x: -14, opacity: 0, duration: .6, stagger: .09, ease: "power2.out",
      scrollTrigger: { trigger: ".layers", start: "top 85%", once: true },
      clearProps: "transform"
    });
    gsap.utils.toArray(".case-visual").forEach(function (v) {
      gsap.from(v.children, {
        y: 20, opacity: 0, duration: .7, stagger: .09, ease: "power2.out",
        scrollTrigger: { trigger: v, start: "top 85%", once: true },
        clearProps: "transform"
      });
    });
    // stacked cards: the one underneath settles back as the next slides over it
    if (window.matchMedia("(min-width: 981px)").matches) {
      var cards = gsap.utils.toArray("[data-case]");
      cards.forEach(function (card, i) {
        if (i === cards.length - 1) return;
        gsap.to(card, {
          scale: .93, opacity: .5, ease: "none",
          scrollTrigger: { trigger: cards[i + 1], start: "top 92%", end: "top 30%", scrub: true }
        });
      });
    }
  }

  /* ---------- tilt + spotlight ---------- */
  gsap.utils.toArray("[data-tilt]").forEach(function (el) {
    gsap.set(el, { transformPerspective: 1000, transformOrigin: "center" });
    var rx = gsap.quickTo(el, "rotationX", { duration: .5, ease: "power2.out" });
    var ry = gsap.quickTo(el, "rotationY", { duration: .5, ease: "power2.out" });
    el.addEventListener("pointermove", function (e) {
      var r = el.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width;
      var py = (e.clientY - r.top) / r.height;
      el.style.setProperty("--mx", (px * 100).toFixed(1) + "%");
      el.style.setProperty("--my", (py * 100).toFixed(1) + "%");
      ry((px - .5) * 9);
      rx((.5 - py) * 9);
    });
    el.addEventListener("pointerleave", function () { rx(0); ry(0); });
  });

  /* ---------- magnetic buttons ---------- */
  gsap.utils.toArray("[data-magnetic]").forEach(function (el) {
    var xTo = gsap.quickTo(el, "x", { duration: .45, ease: "power3.out" });
    var yTo = gsap.quickTo(el, "y", { duration: .45, ease: "power3.out" });
    el.addEventListener("pointermove", function (e) {
      var r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * .16);
      yTo((e.clientY - (r.top + r.height / 2)) * .3);
    });
    el.addEventListener("pointerleave", function () { xTo(0); yTo(0); });
  });

  /* ---------- hot reload ---------- */
  var hrBtn = document.getElementById("hrBtn");
  var hrTerm = document.getElementById("hrTerm");
  var hrTimer = 0;
  function say(lines, hold) {
    if (!hrTerm) return;
    clearTimeout(hrTimer);
    hrTerm.innerHTML = lines.join("\n");
    hrTerm.classList.add("is-on");
    if (hold) hrTimer = setTimeout(function () { hrTerm.classList.remove("is-on"); }, hold);
  }
  function hotReload() {
    var ms = 260 + Math.floor(Math.random() * 220);
    say(['<span style="opacity:.6">$ flutter run  ·  r</span>', "Performing hot reload...", '<b>✓ Reloaded in ' + ms + " ms.</b>"], 2800);
    if (lenis) lenis.scrollTo(0, { duration: .55 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(function () {
      if (window.ScrollTrigger) window.ScrollTrigger.refresh();
      intro.restart();
      document.querySelectorAll("[data-count]").forEach(function (el) { delete el.dataset.done; });
    }, 480);
  }
  if (hrBtn) hrBtn.addEventListener("click", hotReload);
  window.addEventListener("keydown", function (e) {
    if (e.key !== "r" && e.key !== "R") return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    var a = document.activeElement;
    if (a && (/^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName) || a.isContentEditable)) return;
    hotReload();
  });
})();
