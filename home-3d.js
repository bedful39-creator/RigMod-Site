/* ==========================================================================
   HOME-3D.JS - CLEAN HIGH-PERFORMANCE 3D ENGINE (REAL MINECRAFT BLOCKS)
   ========================================================================== */
(function () {
  'use strict';

  var TEX = 'mcassets/java/block/';

  var FACES = [
    { cls: 'fr', axis: [0, 0, 1], tf: 'translateZ(H)' },
    { cls: 'bk', axis: [0, 0, -1], tf: 'rotateY(180deg) translateZ(H)' },
    { cls: 'rt', axis: [1, 0, 0], tf: 'rotateY(90deg) translateZ(H)' },
    { cls: 'lf', axis: [-1, 0, 0], tf: 'rotateY(-90deg) translateZ(H)' },
    { cls: 'up', axis: [0, -1, 0], tf: 'rotateX(90deg) translateZ(H)' },
    { cls: 'dn', axis: [0, 1, 0], tf: 'rotateX(-90deg) translateZ(H)' }
  ];

  function cube(size, customFaces) {
    var c = document.createElement('div');
    c.className = 'h3-cube';
    c.style.width = size + 'px';
    c.style.height = size + 'px';
    c.dataset.size = String(size);
    var half = size / 2;

    FACES.forEach(function (f) {
      var el = document.createElement('i');
      el.className = f.cls;
      el.dataset.base = f.tf.replace('H', half + 'px');
      el.style.transform = el.dataset.base;
      
      var textureFile = 'furnace_side';
      if (typeof customFaces === 'string') {
        textureFile = customFaces;
      } else if (customFaces && typeof customFaces === 'object') {
        textureFile = customFaces[f.cls] || customFaces.side || 'furnace_side';
      }

      el.style.backgroundImage = 'url("' + TEX + textureFile + '.png")';
      c.appendChild(el);
    });
    return c;
  }

  function spinnable(el, startX, startY) {
    var rx = startX == null ? -16 : startX;
    var ry = startY == null ? -24 : startY;
    var down = false, lastX = 0, lastY = 0, held = false;
    el.dataset.rx = rx;
    el.dataset.ry = ry;

    function begin(x, y) { down = true; held = true; lastX = x; lastY = y; }
    function move(x, y) {
      if (!down) return;
      ry = Number(el.dataset.ry) + (x - lastX) * 0.8;
      rx = Math.max(-85, Math.min(85, Number(el.dataset.rx) - (y - lastY) * 0.8));
      el.dataset.rx = rx;
      el.dataset.ry = ry;
      lastX = x;
      lastY = y;
    }

    el.addEventListener('mousedown', function (e) { begin(e.clientX, e.clientY); e.preventDefault(); });
    el.addEventListener('touchstart', function (e) { begin(e.touches[0].clientX, e.touches[0].clientY); }, { passive: true });
    window.addEventListener('mousemove', function (e) { move(e.clientX, e.clientY); });
    window.addEventListener('touchmove', function (e) {
      if (!down) return;
      move(e.touches[0].clientX, e.touches[0].clientY);
      if (e.cancelable) e.preventDefault();
    }, { passive: false });
    window.addEventListener('mouseup', function () { down = false; });
    window.addEventListener('touchend', function () { down = false; });

    return function () { return held && down; };
  }

  // Dispenser Face Mapping (Authentic Minecraft Java)
  var DISPENSER_FACES = {
    fr: 'dispenser_front',
    bk: 'furnace_side',
    lf: 'furnace_side',
    rt: 'furnace_side',
    up: 'furnace_top',
    dn: 'furnace_top'
  };

  // ---------- HERO: REAL MINECRAFT DISPENSER ----------
  var heroCube = null;
  var heroHeld = function () { return false; };

  function buildHero() {
    var stage = document.getElementById('h3-hero-stage');
    if (!stage) return;

    var bloom = document.createElement('div');
    bloom.className = 'h3-bloom';
    stage.appendChild(bloom);

    var cubeWrap = document.createElement('div');
    cubeWrap.className = 'h3-cube-wrap';
    stage.appendChild(cubeWrap);

    var size = Math.max(150, Math.min(220, Math.round(window.innerWidth * 0.18)));

    heroCube = cube(size, DISPENSER_FACES);
    heroHeld = spinnable(heroCube, -16, -24);
    cubeWrap.appendChild(heroCube);
  }

  // ---------- 3 DISTINCT FEATURE SECTIONS (BLOCKS: GOLD, COPPER, DIAMOND) ----------
  var featureBlocks = [];

  function buildBeats() {
    [].forEach.call(document.querySelectorAll('.h3-beat'), function (beat, index) {
      var scene = beat.querySelector('.h3-scene');
      if (!scene) return;
      var texName = scene.dataset.tex || (index === 0 ? 'gold_block' : index === 1 ? 'copper_block' : 'diamond_block');
      var size = Math.min(260, Math.round(window.innerWidth * 0.2)) || 220;
      var c = cube(Math.max(160, size), texName);
      var held = spinnable(c, -16, 28);
      scene.insertBefore(c, scene.firstChild);

      var bloom = document.createElement('div');
      bloom.className = 'h3-bloom';
      scene.insertBefore(bloom, scene.firstChild);

      featureBlocks.push({
        cube: c,
        held: held
      });
    });
  }

  // ---------- ORBITING 3D FINALE (FIXED DISPENSER TEXTURE) ----------
  var spinners = [];
  var finalRing = null;

  function tailScenes() {
    var final = document.getElementById('h3-final');
    if (!final) return;
    var bloom = document.createElement('div');
    bloom.className = 'h3-bloom';
    final.appendChild(bloom);

    var ring = document.createElement('div');
    ring.className = 'h3-orbit';
    final.appendChild(ring);

    var blockConfigs = [
      DISPENSER_FACES,
      'gold_block',
      'copper_block',
      'diamond_block'
    ];

    var radius = window.innerWidth < 620 ? 96 : window.innerWidth < 1000 ? 130 : 170;
    var size = window.innerWidth < 620 ? 46 : 62;
    blockConfigs.forEach(function (cfg, i) {
      var arm = document.createElement('div');
      arm.className = 'h3-arm';
      arm.style.width = size + 'px';
      arm.style.height = size + 'px';
      arm.style.marginLeft = (-size / 2) + 'px';
      arm.style.marginTop = (-size / 2) + 'px';
      arm.dataset.angle = String((360 / blockConfigs.length) * i);
      arm.dataset.radius = String(radius);
      var c = cube(size, cfg);
      spinners.push({ cube: c, speed: 9 + i * 2, held: spinnable(c, -16, 24) });
      arm.appendChild(c);
      ring.appendChild(arm);
    });
    finalRing = ring;
  }

  function frame() {
    var t = performance.now() / 1000;

    // 1. Hero Dispenser Animation
    if (heroCube) {
      var rx = heroHeld() ? Number(heroCube.dataset.rx) : -16 + Math.sin(t * 0.7) * 3;
      var ry = heroHeld() ? Number(heroCube.dataset.ry) : -24 + Math.sin(t * 0.5) * 4;
      if (!heroHeld()) { heroCube.dataset.rx = rx; heroCube.dataset.ry = ry; }
      var drift = Math.sin(t * 0.8) * 8;
      heroCube.style.transform = 'translateY(' + drift.toFixed(1) + 'px) rotateX(' + rx.toFixed(1) + 'deg) rotateY(' + ry.toFixed(1) + 'deg)';
    }

    // 2. Feature Section 3D Blocks
    featureBlocks.forEach(function (fb, i) {
      if (fb.held()) {
        fb.cube.style.transform = 'rotateX(' + Number(fb.cube.dataset.rx).toFixed(1) + 'deg) rotateY(' +
          Number(fb.cube.dataset.ry).toFixed(1) + 'deg)';
      } else {
        var rx = -16 + Math.sin(t * 0.6 + i) * 3;
        var ry = 28 + Math.sin(t * 0.5 + i) * 12;
        var drift = Math.sin(t * 0.7 + i) * 6;
        fb.cube.dataset.rx = rx;
        fb.cube.dataset.ry = ry;
        fb.cube.style.transform = 'translateY(' + drift.toFixed(1) + 'px) rotateX(' + rx.toFixed(1) + 'deg) rotateY(' + ry.toFixed(1) + 'deg)';
      }
    });

    // 3. Finale Orbit (with properly textured dispenser)
    spinners.forEach(function (s) {
      if (s.held()) {
        s.cube.style.transform = 'rotateX(' + Number(s.cube.dataset.rx).toFixed(1) + 'deg) rotateY(' +
          Number(s.cube.dataset.ry).toFixed(1) + 'deg)';
        return;
      }
      var ry = (t * (360 / s.speed)) % 360;
      s.cube.dataset.ry = ry;
      s.cube.style.transform = 'rotateX(-18deg) rotateY(' + ry.toFixed(1) + 'deg)';
    });

    if (finalRing) {
      [].forEach.call(finalRing.children, function (arm) {
        var a = (Number(arm.dataset.angle) + t * 12) % 360;
        var rad = Number(arm.dataset.radius);
        arm.style.transform = 'rotateY(' + a.toFixed(2) + 'deg) translateZ(' + rad + 'px) translateY(' +
          (Math.sin((a * Math.PI) / 180 + t) * 14).toFixed(1) + 'px)';
      });
    }

    requestAnimationFrame(frame);
  }

  // Smooth Scroll Helper (respects prefers-reduced-motion)
  window.smoothScrollTo = function (targetSelector, e) {
    if (e && e.preventDefault) e.preventDefault();
    var target = document.querySelector(targetSelector);
    if (!target) return;
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  };

  // Keyboard activation for role="button" elements (Enter / Space)
  document.addEventListener('keydown', function (ev) {
    var el = ev.target;
    if (!el || el.getAttribute('role') !== 'button') return;
    if (ev.key === 'Enter' || ev.key === ' ' || ev.key === 'Spacebar') {
      ev.preventDefault();
      el.click();
    }
  });

  function start() {
    buildHero();
    buildBeats();
    tailScenes();
    requestAnimationFrame(frame);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
