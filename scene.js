/* Hero 3D scene: a cut-out portrait floating in space with glossy objects around it,
   one per thing he actually works with. Pointer parallax, objects that dodge the cursor
   and spring back, hover labels, click spins with confetti, a phone that changes screen,
   and everything drifts apart as the hero scrolls away. */
(function () {
  "use strict";
  var stage = document.getElementById("stage");
  if (!stage) return;
  var T = window.THREE;
  var root = document.documentElement;
  var tipEl = document.getElementById("sceneTip");
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!T) { document.body.classList.add("no-webgl"); return; }

  var LBL = {
    en: {
      flutter: "Flutter & Dart", phone: "EcoCycle app", pin: "Recycling map", bubble: "Firebase · FCM",
      star: "Rewards & badges", db: "Firestore", code: "Clean Architecture", ring: "Cubit / BLoC"
    },
    ar: {
      flutter: "Flutter وDart", phone: "تطبيق EcoCycle", pin: "خريطة المراكز", bubble: "Firebase · FCM",
      star: "المكافآت والشارات", db: "Firestore", code: "Clean Architecture", ring: "Cubit / BLoC"
    }
  };
  function langKey() { return root.lang === "ar" ? "ar" : "en"; }

  /* ---------------------------------------------------------------- renderer */
  var renderer;
  try {
    renderer = new T.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  } catch (e) {
    document.body.classList.add("no-webgl");
    return;
  }
  var W = stage.clientWidth || 560, H = stage.clientHeight || 600;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(W, H, false);
  if (T.sRGBEncoding !== undefined) renderer.outputEncoding = T.sRGBEncoding;
  renderer.setClearAlpha(0);
  stage.appendChild(renderer.domElement);
  var maxAniso = renderer.capabilities.getMaxAnisotropy ? renderer.capabilities.getMaxAnisotropy() : 1;

  var scene = new T.Scene();
  var camera = new T.PerspectiveCamera(38, W / H, 0.1, 100);
  camera.position.set(0, 0, 9);
  camera.lookAt(0, 0, 0);

  var world = new T.Group();
  scene.add(world);

  /* ------------------------------------------------------------- environment */
  function envMap() {
    var c = document.createElement("canvas");
    c.width = 512; c.height = 256;
    var x = c.getContext("2d");
    var g = x.createLinearGradient(0, 0, 0, 256);
    g.addColorStop(0, "#ffffff");
    g.addColorStop(.42, "#e4ebff");
    g.addColorStop(.62, "#9fb4e8");
    g.addColorStop(1, "#182238");
    x.fillStyle = g; x.fillRect(0, 0, 512, 256);
    var r1 = x.createRadialGradient(140, 54, 3, 140, 54, 120);
    r1.addColorStop(0, "rgba(255,255,255,1)"); r1.addColorStop(1, "rgba(255,255,255,0)");
    x.fillStyle = r1; x.fillRect(0, 0, 512, 256);
    var r2 = x.createRadialGradient(400, 196, 3, 400, 196, 96);
    r2.addColorStop(0, "rgba(245,165,36,.9)"); r2.addColorStop(1, "rgba(245,165,36,0)");
    x.fillStyle = r2; x.fillRect(0, 0, 512, 256);
    var t = new T.CanvasTexture(c);
    t.mapping = T.EquirectangularReflectionMapping;
    return t;
  }
  scene.environment = envMap();

  scene.add(new T.AmbientLight(0xffffff, 0.62));
  var key = new T.DirectionalLight(0xffffff, 1.35); key.position.set(-4, 6, 7); scene.add(key);
  var rim = new T.PointLight(0x2f5bea, 2.4, 30); rim.position.set(7, -2, 5); scene.add(rim);
  var warm = new T.PointLight(0xf5a524, 1.9, 30); warm.position.set(-6, -4, 4); scene.add(warm);

  /* --------------------------------------------------------------- materials */
  function gloss(color, extra) {
    return new T.MeshPhysicalMaterial(Object.assign({
      color: color, roughness: .22, metalness: .14, clearcoat: 1, clearcoatRoughness: .09, envMapIntensity: 1.15
    }, extra || {}));
  }
  function roundShape(w, h, r) {
    var s = new T.Shape(), x = -w / 2, y = -h / 2;
    s.moveTo(x + r, y);
    s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
    s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
    s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
    return s;
  }
  function extrude(shape, depth, bevel) {
    var g = new T.ExtrudeGeometry(shape, {
      depth: depth, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 4, curveSegments: 26
    });
    g.center();
    return g;
  }
  function tex(canvas) {
    var t = new T.CanvasTexture(canvas);
    t.anisotropy = maxAniso;
    if (T.sRGBEncoding !== undefined) t.encoding = T.sRGBEncoding;
    return t;
  }

  /* ---------------------------------------------------------------- portrait */
  var portrait = new T.Group();
  world.add(portrait);
  var portraitMesh = null, portraitTarget = { w: 4.6, h: 4.0 };
  var photo = new Image();
  photo.onload = function () {
    var iw = photo.naturalWidth, ih = photo.naturalHeight;
    var scale = Math.min(1, 760 / iw);
    var cw = Math.round(iw * scale), ch = Math.round(ih * scale);
    var c = document.createElement("canvas");
    c.width = cw; c.height = ch;
    var x = c.getContext("2d");
    x.drawImage(photo, 0, 0, cw, ch);
    var data = x.getImageData(0, 0, cw, ch), d = data.data;
    var fade = Math.max(8, Math.round(ch * 0.07));
    for (var py = 0; py < ch; py++) {
      for (var px = 0; px < cw; px++) {
        var i = (py * cw + px) * 4;
        var dmin = 255 - Math.min(d[i], d[i + 1], d[i + 2]);
        var a = dmin <= 6 ? 0 : dmin >= 30 ? 1 : (dmin - 6) / 24;
        if (a > 0 && py > ch - fade) a *= (ch - py) / fade;
        d[i + 3] = Math.round(a * 255);
      }
    }
    x.putImageData(data, 0, 0);
    var texture = tex(c);
    var aspect = cw / ch;
    portraitTarget.h = 5.2;
    portraitTarget.w = 5.2 * aspect;
    portraitMesh = new T.Mesh(
      new T.PlaneGeometry(portraitTarget.w, portraitTarget.h),
      new T.MeshBasicMaterial({ map: texture, transparent: true, alphaTest: .35, depthWrite: true })
    );
    portrait.add(portraitMesh);
    // soft shadow behind, so the cut-out sits in the space
    var sc = document.createElement("canvas"); sc.width = 256; sc.height = 256;
    var sx = sc.getContext("2d");
    var rg = sx.createRadialGradient(128, 128, 10, 128, 128, 126);
    rg.addColorStop(0, "rgba(14,27,44,.34)"); rg.addColorStop(1, "rgba(14,27,44,0)");
    sx.fillStyle = rg; sx.fillRect(0, 0, 256, 256);
    var shadow = new T.Mesh(new T.PlaneGeometry(portraitTarget.w * .95, portraitTarget.h * .95),
      new T.MeshBasicMaterial({ map: tex(sc), transparent: true, depthWrite: false }));
    shadow.position.set(0, -.12, -0.35);
    portrait.add(shadow);
    if (reduce) render(0);
  };
  photo.src = "assets/professional.png";

  /* ------------------------------------------------------------------ objects */
  var pickables = [], objects = [];

  function register(group, opts) {
    group.userData.home = new T.Vector3(opts.x, opts.y, opts.z);
    group.userData.vel = new T.Vector3();
    group.userData.phase = Math.random() * Math.PI * 2;
    group.userData.bob = opts.bob === undefined ? .05 : opts.bob;
    group.userData.spin = opts.spin === undefined ? .12 : opts.spin;
    group.userData.label = opts.label;
    group.userData.action = opts.action || "spin";
    group.userData.scale0 = opts.scale || 1;
    group.userData.pop = 1;
    group.userData.delay = objects.length * .07;
    group.userData.t0 = 0;
    group.position.copy(group.userData.home);
    group.scale.setScalar(group.userData.scale0);
    group.traverse(function (o) {
      if (o.isMesh) { o.userData.root = group; pickables.push(o); }
    });
    world.add(group);
    objects.push(group);
    return group;
  }

  /* Flutter tile */
  function flutterTile() {
    var g = new T.Group();
    var body = new T.Mesh(extrude(roundShape(1.16, 1.16, .26), .16, .03), gloss(0xffffff, { roughness: .16 }));
    g.add(body);
    var c = document.createElement("canvas"); c.width = 256; c.height = 256;
    var x = c.getContext("2d");
    var p = new Path2D("M14.314 0L2.3 12 6 15.7 21.684.013h-7.357zm.014 11.072L7.857 17.53l6.47 6.47H21.7l-6.46-6.468 6.46-6.46h-7.37z");
    x.scale(256 / 24, 256 / 24);
    var grad = x.createLinearGradient(0, 0, 24, 24);
    grad.addColorStop(0, "#5BC8FA"); grad.addColorStop(.55, "#29B6F6"); grad.addColorStop(1, "#0277BD");
    x.fillStyle = grad;
    x.fill(p);
    var logo = new T.Mesh(new T.PlaneGeometry(1.0, 1.0), new T.MeshBasicMaterial({ map: tex(c), transparent: true, depthWrite: false }));
    logo.position.z = .135;
    g.add(logo);
    return g;
  }

  /* phone with two live screens */
  function drawScreen(kind) {
    var c = document.createElement("canvas"); c.width = 300; c.height = 620;
    var x = c.getContext("2d");
    x.fillStyle = "#F7F9FC"; x.fillRect(0, 0, 300, 620);
    x.fillStyle = "#0E1B2C"; x.fillRect(0, 0, 300, 104);
    x.fillStyle = "#5BC8FA"; x.beginPath(); x.arc(34, 52, 15, 0, 6.3); x.fill();
    x.fillStyle = "#fff"; x.font = "700 21px system-ui, sans-serif"; x.fillText("EcoCycle", 60, 50);
    x.fillStyle = "rgba(255,255,255,.55)"; x.font = "500 12px system-ui, sans-serif"; x.fillText("Recycle. Earn. Repeat.", 60, 70);
    if (kind === 0) {
      var map = x.createLinearGradient(0, 104, 300, 430);
      map.addColorStop(0, "#DCEBE4"); map.addColorStop(.5, "#CFE0F5"); map.addColorStop(1, "#E7F0E2");
      x.fillStyle = map; x.fillRect(16, 120, 268, 300);
      for (var i = 0; i < 7; i++) {
        x.strokeStyle = "rgba(255,255,255,.9)"; x.lineWidth = 6;
        x.beginPath(); x.moveTo(-10 + i * 46, 120); x.lineTo(70 + i * 46, 420); x.stroke();
      }
      var pins = [[70, 190], [190, 235], [130, 330], [230, 350]];
      for (var k = 0; k < pins.length; k++) {
        x.fillStyle = k === 0 ? "#2F5BEA" : "#12B886";
        x.beginPath(); x.arc(pins[k][0], pins[k][1], 9, 0, 6.3); x.fill();
        x.strokeStyle = "rgba(255,255,255,.9)"; x.lineWidth = 3; x.stroke();
      }
      x.fillStyle = "#fff"; x.fillRect(16, 440, 268, 92);
      x.fillStyle = "#0E1B2C"; x.font = "700 16px system-ui, sans-serif"; x.fillText("12 centers near you", 32, 472);
      x.fillStyle = "#546070"; x.font = "500 12px system-ui, sans-serif"; x.fillText("Recycling points, hours and routes", 32, 494);
      x.fillStyle = "#2F5BEA"; x.fillRect(32, 504, 96, 16);
    } else {
      x.fillStyle = "#fff"; x.fillRect(16, 120, 268, 150);
      x.strokeStyle = "#E6E3DD"; x.lineWidth = 1; x.strokeRect(16, 120, 268, 150);
      x.strokeStyle = "#2F5BEA"; x.lineWidth = 9; x.beginPath(); x.arc(86, 196, 46, -1.6, 2.6); x.stroke();
      x.fillStyle = "#0E1B2C"; x.font = "800 24px system-ui, sans-serif"; x.fillText("72%", 66, 204);
      x.fillStyle = "#546070"; x.font = "500 12px system-ui, sans-serif"; x.fillText("Weekly goal", 56, 226);
      x.fillStyle = "#0E1B2C"; x.font = "700 15px system-ui, sans-serif"; x.fillText("Badges", 150, 158);
      var badges = ["#F5A524", "#12B886", "#2F5BEA"];
      for (var b = 0; b < 3; b++) {
        x.fillStyle = badges[b]; x.beginPath(); x.arc(172, 186 + b * 30, 10, 0, 6.3); x.fill();
        x.fillStyle = "#8A94A6"; x.fillRect(190, 182 + b * 30, 70, 8);
      }
      x.fillStyle = "#0E1B2C"; x.font = "700 15px system-ui, sans-serif"; x.fillText("Impact", 32, 312);
      var vals = [.4, .62, .5, .8, .68, .92];
      for (var v = 0; v < vals.length; v++) {
        x.fillStyle = v === 5 ? "#F5A524" : "#CFE0F5";
        var hh = vals[v] * 120;
        x.fillRect(34 + v * 40, 420 - hh, 22, hh);
      }
      x.fillStyle = "#546070"; x.font = "500 12px system-ui, sans-serif"; x.fillText("kg recycled this month", 32, 442);
    }
    x.fillStyle = "#0E1B2C"; x.fillRect(112, 596, 76, 5);
    return c;
  }
  function phone() {
    var g = new T.Group();
    var body = new T.Mesh(extrude(roundShape(1.02, 2.0, .2), .12, .02), gloss(0x111a2b, { roughness: .28, metalness: .35 }));
    g.add(body);
    var screens = [drawScreen(0), drawScreen(1)];
    var screenMesh = new T.Mesh(new T.PlaneGeometry(.9, 1.86), new T.MeshBasicMaterial({ map: tex(screens[0]) }));
    screenMesh.position.z = .085;
    g.add(screenMesh);
    g.userData.screens = screens;
    g.userData.screenMesh = screenMesh;
    g.userData.screenIndex = 0;
    return g;
  }

  /* map pin */
  function pin() {
    var g = new T.Group();
    var head = new T.Mesh(new T.SphereGeometry(.34, 32, 24), gloss(0x2f5bea, { roughness: .16 }));
    head.position.y = .3;
    g.add(head);
    var cone = new T.Mesh(new T.ConeGeometry(.32, .58, 32), gloss(0x2f5bea, { roughness: .16 }));
    cone.position.y = -.16; cone.rotation.x = Math.PI;
    g.add(cone);
    var hole = new T.Mesh(new T.CircleGeometry(.12, 24), new T.MeshBasicMaterial({ color: 0xffffff }));
    hole.position.set(0, .3, .335);
    g.add(hole);
    return g;
  }

  /* chat bubble */
  function bubble() {
    var g = new T.Group();
    var body = new T.Mesh(extrude(roundShape(1.05, .74, .24), .2, .02), gloss(0x12b886, { roughness: .2 }));
    g.add(body);
    var tail = new T.Mesh(new T.ConeGeometry(.17, .3, 4), gloss(0x12b886, { roughness: .2 }));
    tail.position.set(-.32, -.5, 0); tail.rotation.z = Math.PI; tail.rotation.y = Math.PI / 4;
    g.add(tail);
    var dotMat = new T.MeshBasicMaterial({ color: 0xffffff });
    for (var i = 0; i < 3; i++) {
      var d = new T.Mesh(new T.CircleGeometry(.075, 20), dotMat);
      d.position.set(-.22 + i * .22, 0, .115);
      g.add(d);
    }
    return g;
  }

  /* star */
  function star() {
    var s = new T.Shape();
    for (var i = 0; i < 10; i++) {
      var r = i % 2 ? .24 : .56;
      var a = -Math.PI / 2 + i * Math.PI / 5;
      var px = Math.cos(a) * r, py = Math.sin(a) * r;
      i ? s.lineTo(px, py) : s.moveTo(px, py);
    }
    s.closePath();
    var m = new T.Mesh(extrude(s, .16, .03), gloss(0xf5a524, { roughness: .18, metalness: .25 }));
    var g = new T.Group(); g.add(m);
    return g;
  }

  /* firestore cylinder */
  function db() {
    var g = new T.Group();
    var c = new T.Mesh(new T.CylinderGeometry(.34, .34, .62, 40), gloss(0xf5a524, { roughness: .2, metalness: .2 }));
    g.add(c);
    var top = new T.Mesh(new T.CylinderGeometry(.34, .34, .05, 40), gloss(0xffd489, { roughness: .15 }));
    top.position.y = .31; g.add(top);
    return g;
  }

  /* code tile */
  function codeTile() {
    var g = new T.Group();
    var body = new T.Mesh(extrude(roundShape(1.1, .78, .2), .16, .02), gloss(0x0e1b2c, { roughness: .3, metalness: .3 }));
    g.add(body);
    var c = document.createElement("canvas"); c.width = 256; c.height = 180;
    var x = c.getContext("2d");
    x.fillStyle = "#7CF0C4"; x.font = "700 96px ui-monospace, Menlo, monospace";
    x.textAlign = "center"; x.textBaseline = "middle";
    x.fillText("</>", 128, 96);
    var m = new T.Mesh(new T.PlaneGeometry(1.0, .7), new T.MeshBasicMaterial({ map: tex(c), transparent: true, depthWrite: false }));
    m.position.z = .125;
    g.add(m);
    return g;
  }

  /* ring */
  function ring() {
    var g = new T.Group();
    var m = new T.Mesh(new T.TorusGeometry(.36, .1, 18, 60), gloss(0x2f5bea, { roughness: .18, metalness: .3 }));
    g.add(m);
    var inner = new T.Mesh(new T.TorusGeometry(.2, .05, 14, 48), gloss(0xf5a524, { roughness: .2, metalness: .3 }));
    g.add(inner);
    return g;
  }

  var narrow = W < 720;
  var S = narrow ? .86 : 1;
  register(flutterTile(), { x: -2.25 * S, y: 1.5 * S, z: 1.0, label: "flutter", action: "pop", scale: .92 });
  register(bubble(), { x: 2.2 * S, y: 1.8 * S, z: .4, label: "bubble", action: "spin", scale: .78 });
  register(phone(), { x: 2.2 * S, y: -.25 * S, z: .6, label: "phone", action: "phone", scale: .95 });
  register(pin(), { x: -2.3 * S, y: -.35 * S, z: 1.15, label: "pin", action: "spin", scale: .76 });
  register(star(), { x: 1.8 * S, y: -2.2 * S, z: 1.2, label: "star", action: "spin", scale: .78 });
  register(db(), { x: -2.05 * S, y: -2.1 * S, z: .4, label: "db", action: "spin", scale: .7 });
  register(codeTile(), { x: .1 * S, y: 2.4 * S, z: .5, label: "code", action: "pop", scale: .68 });
  register(ring(), { x: 1.15 * S, y: 2.35 * S, z: .45, label: "ring", action: "spin", scale: .66 });

  /* ---------------------------------------------------------------- confetti */
  var confetti = [];
  var confGeo = new T.PlaneGeometry(.07, .12);
  var palette = [0x2f5bea, 0xf5a524, 0x12b886, 0x54c5f8, 0xffffff];
  function burst(pos) {
    for (var i = 0; i < 24; i++) {
      var m = new T.Mesh(confGeo, new T.MeshBasicMaterial({
        color: palette[i % palette.length], side: T.DoubleSide, transparent: true
      }));
      m.position.copy(pos);
      var a = Math.random() * Math.PI * 2, sp = .028 + Math.random() * .055;
      m.userData.v = new T.Vector3(Math.cos(a) * sp, Math.sin(a) * sp + .06, (Math.random() - .5) * .05);
      m.userData.r = new T.Vector3((Math.random() - .5) * .28, (Math.random() - .5) * .28, (Math.random() - .5) * .28);
      m.userData.life = 1;
      scene.add(m);
      confetti.push(m);
    }
  }

  /* ------------------------------------------------------------------ pointer */
  var pointer = new T.Vector2(0, 0);
  var pointerPx = { x: 0, y: 0, on: false };
  var raycaster = new T.Raycaster();
  var hovered = null;
  var smoothCam = { x: 0, y: 0 };

  function setPointer(e) {
    var r = stage.getBoundingClientRect();
    var x = (e.clientX - r.left) / r.width;
    var y = (e.clientY - r.top) / r.height;
    pointerPx.x = x * r.width; pointerPx.y = y * r.height;
    pointerPx.on = true;
    pointer.set(x * 2 - 1, -(y * 2 - 1));
  }
  stage.addEventListener("pointermove", setPointer, { passive: true });
  stage.addEventListener("pointerleave", function () {
    pointerPx.on = false; pointer.set(0, 0);
    setHover(null);
  });
  stage.addEventListener("pointerdown", setPointer, { passive: true });

  function setHover(obj) {
    if (obj === hovered) return;
    hovered = obj;
    if (!tipEl) return;
    if (obj) {
      var k = obj.userData.label;
      tipEl.textContent = (LBL[langKey()] && LBL[langKey()][k]) || "";
      tipEl.classList.add("is-on");
    } else {
      tipEl.classList.remove("is-on");
    }
  }

  function pick() {
    raycaster.setFromCamera(pointer, camera);
    var hits = raycaster.intersectObjects(pickables, false);
    return hits.length ? hits[0].object.userData.root : null;
  }

  function activate(obj) {
    if (!obj) return;
    var a = obj.userData.action;
    if (a === "phone") {
      var next = (obj.userData.screenIndex + 1) % 2;
      obj.userData.screenIndex = next;
      obj.userData.screenMesh.material.map = tex(obj.userData.screens[next]);
      obj.userData.screenMesh.material.needsUpdate = true;
      punch(obj);
    } else if (a === "pop") {
      var parts = [];
      obj.traverse(function (o) { if (o.isMesh) parts.push(o); });
      parts.forEach(function (o, i) {
        if (window.gsap) {
          gsap.fromTo(o.position, { x: o.position.x, y: o.position.y },
            { x: o.position.x + (Math.random() - .5) * .5, y: o.position.y + (Math.random() - .5) * .5, duration: .16, yoyo: true, repeat: 1, ease: "power2.out" });
          gsap.fromTo(o.rotation, { z: 0 }, { z: (Math.random() - .5) * .8, duration: .18, yoyo: true, repeat: 1, ease: "power2.inOut" });
        }
      });
      punch(obj);
    } else {
      if (window.gsap) {
        gsap.to(obj.rotation, { y: obj.rotation.y + Math.PI * 2, duration: 1.1, ease: "power3.out" });
      }
      punch(obj);
    }
    var p = new T.Vector3();
    obj.getWorldPosition(p);
    burst(p);
  }
  function punch(obj) { obj.userData.pop = 1.3; }

  var down = null;
  stage.addEventListener("pointerdown", function (e) { down = { x: e.clientX, y: e.clientY }; });
  stage.addEventListener("pointerup", function (e) {
    if (!down) return;
    var moved = Math.hypot(e.clientX - down.x, e.clientY - down.y);
    down = null;
    if (moved > 12) return;
    var obj = pick();
    if (obj) activate(obj);
  });

  /* -------------------------------------------------------------------- loop */
  var clock = new T.Clock();
  var running = true, visible = true;

  function heroProgress() {
    var r = stage.getBoundingClientRect();
    return Math.min(1, Math.max(0, -r.top / Math.max(1, r.height)));
  }

  function render(dt) {
    var t = clock.elapsedTime;
    var p = heroProgress();
    var damp = 1 - Math.pow(.001, Math.min(dt || .016, .05));

    // camera parallax
    var tx = pointerPx.on ? pointer.x * .55 : 0;
    var ty = pointerPx.on ? pointer.y * .34 : 0;
    smoothCam.x += (tx - smoothCam.x) * damp * .9;
    smoothCam.y += (ty - smoothCam.y) * damp * .9;
    camera.position.x = smoothCam.x;
    camera.position.y = smoothCam.y;
    camera.position.z = (narrow ? 10.2 : 9) + p * 2.2;
    camera.lookAt(0, 0, 0);

    world.rotation.y = smoothCam.x * .12;
    world.rotation.x = -smoothCam.y * .1;
    portrait.rotation.y = smoothCam.x * .08;
    portrait.rotation.x = -smoothCam.y * .06;

    // pointer point on each object's depth plane
    raycaster.setFromCamera(pointer, camera);

    for (var i = 0; i < objects.length; i++) {
      var o = objects[i], u = o.userData;
      // spring back home
      u.vel.x += (u.home.x - o.position.x) * .035;
      u.vel.y += (u.home.y - o.position.y) * .035;
      u.vel.z += (u.home.z - o.position.z) * .035;
      // dodge the cursor
      if (pointerPx.on && !narrow) {
        var d = raycaster.ray.direction, org = raycaster.ray.origin;
        var k = (o.position.z - org.z) / (d.z || -1);
        var mx = org.x + d.x * k, my = org.y + d.y * k;
        var dx = o.position.x - mx, dy = o.position.y - my;
        var dist = Math.sqrt(dx * dx + dy * dy);
        var R = .95;
        if (dist < R && dist > .001) {
          var f = (R - dist) / R;
          u.vel.x += (dx / dist) * f * .07;
          u.vel.y += (dy / dist) * f * .07;
        }
      }
      u.vel.multiplyScalar(.86);
      o.position.x += u.vel.x;
      o.position.y += u.vel.y;
      o.position.z += u.vel.z;
      // idle float
      o.position.y += Math.sin(t * .9 + u.phase) * u.bob * .012;
      // scroll: drift apart
      var sp = 1 + p * .38;
      o.position.x += (u.home.x * sp - o.position.x) * p * .05;
      o.position.y += (u.home.y * sp - o.position.y) * p * .05;
      o.rotation.y += u.spin * (dt || .016);
      o.rotation.z = Math.sin(t * .7 + u.phase) * .06;
      // hover scale
      u.pop += (1 - u.pop) * .13;
      u.t0 += (dt || .016);
      var ik = Math.min(1, Math.max(0, (u.t0 - u.delay) / .75));
      var intro = 1 - Math.pow(1 - ik, 3);
      var target = u.scale0 * (o === hovered ? 1.12 : 1) * u.pop * intro;
      var cur = o.scale.x;
      o.scale.setScalar(cur + (target - cur) * .2);
    }

    // hover + tip position
    if (pointerPx.on) {
      var h = pick();
      setHover(h);
      if (h && tipEl) {
        var wp = new T.Vector3();
        h.getWorldPosition(wp);
        wp.project(camera);
        tipEl.style.left = ((wp.x * .5 + .5) * W) + "px";
        tipEl.style.top = ((-wp.y * .5 + .5) * H) + "px";
      }
    }

    // confetti
    for (var c = confetti.length - 1; c >= 0; c--) {
      var m = confetti[c], ud = m.userData;
      ud.life -= (dt || .016) * 1.05;
      if (ud.life <= 0) {
        scene.remove(m);
        m.material.dispose();
        confetti.splice(c, 1);
        continue;
      }
      ud.v.y -= .006;
      m.position.add(ud.v);
      m.rotation.x += ud.r.x; m.rotation.y += ud.r.y; m.rotation.z += ud.r.z;
      m.material.opacity = Math.min(1, ud.life * 1.6);
    }

    renderer.render(scene, camera);
  }

  function loop() {
    if (!running || !visible) return;
    requestAnimationFrame(loop);
    render(Math.min(clock.getDelta(), .05));
  }

  if (reduce) {
    render(0);
  } else {
    loop();
  }

  // pause when the hero is off screen or the tab is hidden
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      if (visible && !reduce) { clock.getDelta(); loop(); }
    }, { threshold: 0 }).observe(stage);
  }
  document.addEventListener("visibilitychange", function () {
    running = !document.hidden;
    if (running && !reduce) { clock.getDelta(); loop(); }
  });

  // resize
  function resize() {
    W = stage.clientWidth || W;
    H = stage.clientHeight || H;
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
    renderer.setSize(W, H, false);
    render(0);
  }
  if ("ResizeObserver" in window) new ResizeObserver(resize).observe(stage);
  else window.addEventListener("resize", resize);

  document.addEventListener("langchange", function () {
    if (hovered && tipEl) {
      var k = hovered.userData.label;
      tipEl.textContent = (LBL[langKey()] && LBL[langKey()][k]) || "";
    }
  });
})();
