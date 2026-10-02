/* ==========================================================================
   RIGMOD APP.JS - 3D ENGINE, SIMULATOR & INTERACTIVITY
   Includes procedural Minecraft pixel textures, physics, and live telemetry
   ========================================================================== */

(function () {
  'use strict';

  // ---------- Procedural 16x16 Minecraft Texture Generator ----------
  // Creates authentic pixelated block textures via HTML5 Canvas data URLs
  var TEXTURE_CACHE = {};

  function generateBlockTexture(type) {
    if (TEXTURE_CACHE[type]) return TEXTURE_CACHE[type];

    var canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    var ctx = canvas.getContext('2d');

    // Palette palettes for Minecraft blocks
    var palettes = {
      crafting_table_side: {
        bg: '#855d36',
        pixels: [
          [0,0,16,16,'#966b3e'],
          [0,0,16,2,'#5a3d20'],
          [0,14,16,2,'#5a3d20'],
          [0,0,2,16,'#5a3d20'],
          [14,0,2,16,'#5a3d20'],
          [3,3,10,10,'#6a4825'],
          [4,4,8,8,'#b88a53'],
          [5,5,6,6,'#d4a66a'],
          [7,7,2,2,'#4a2e12']
        ]
      },
      crafting_table_top: {
        bg: '#ab7942',
        pixels: [
          [0,0,16,16,'#b8854c'],
          [0,0,16,1,'#5c3a19'],
          [0,15,16,1,'#5c3a19'],
          [0,0,1,16,'#5c3a19'],
          [15,0,1,16,'#5c3a19'],
          [5,0,1,16,'#7d4f24'],
          [10,0,1,16,'#7d4f24'],
          [0,5,16,1,'#7d4f24'],
          [0,10,16,1,'#7d4f24'],
          [2,2,2,2,'#ffd659'],
          [7,7,2,2,'#ffd659'],
          [12,12,2,2,'#ffd659']
        ]
      },
      gold_block: {
        bg: '#f6d03d',
        pixels: [
          [0,0,16,16,'#fadb42'],
          [0,0,16,1,'#ffea6c'],
          [0,0,1,16,'#ffea6c'],
          [0,15,16,1,'#c89617'],
          [15,0,1,16,'#c89617'],
          [2,2,12,12,'#edd03b'],
          [3,3,10,10,'#ffea6c'],
          [4,4,8,8,'#f6d03d'],
          [6,6,4,4,'#fff49e'],
          [1,14,1,1,'#a17409'],
          [14,1,1,1,'#fffbb5']
        ]
      },
      netherite_block: {
        bg: '#443a3b',
        pixels: [
          [0,0,16,16,'#3b3233'],
          [0,0,16,1,'#5c4f50'],
          [0,0,1,16,'#5c4f50'],
          [0,15,16,1,'#262021'],
          [15,0,1,16,'#262021'],
          [3,3,10,10,'#4a3f40'],
          [4,4,8,8,'#2a2324'],
          [5,5,6,6,'#544748'],
          [7,7,2,2,'#1b1617'],
          [1,1,2,2,'#706162']
        ]
      },
      emerald_block: {
        bg: '#17b851',
        pixels: [
          [0,0,16,16,'#19c958'],
          [0,0,16,1,'#56e885'],
          [0,0,1,16,'#56e885'],
          [0,15,16,1,'#0c7531'],
          [15,0,1,16,'#0c7531'],
          [2,2,12,12,'#14a347'],
          [4,4,8,8,'#36db70'],
          [6,6,4,4,'#8cfab0'],
          [8,8,2,2,'#128c3d']
        ]
      },
      diamond_block: {
        bg: '#5ce1e6',
        pixels: [
          [0,0,16,16,'#68ebf0'],
          [0,0,16,1,'#a8f8fa'],
          [0,0,1,16,'#a8f8fa'],
          [0,15,16,1,'#2ca3a8'],
          [15,0,1,16,'#2ca3a8'],
          [2,2,12,12,'#4fd2d7'],
          [4,4,8,8,'#7ef2f7'],
          [6,6,4,4,'#d9fdfe'],
          [8,8,2,2,'#36b8bd']
        ]
      },
      redstone_block: {
        bg: '#a80e0e',
        pixels: [
          [0,0,16,16,'#bf1515'],
          [0,0,16,1,'#e83333'],
          [0,0,1,16,'#e83333'],
          [0,15,16,1,'#6b0707'],
          [15,0,1,16,'#6b0707'],
          [3,3,10,10,'#8f0b0b'],
          [4,4,8,8,'#d61a1a'],
          [6,6,4,4,'#ff5454'],
          [7,7,2,2,'#520404']
        ]
      },
      copper_block: {
        bg: '#c06b4f',
        pixels: [
          [0,0,16,16,'#cd775b'],
          [0,0,16,1,'#e0937a'],
          [0,0,1,16,'#e0937a'],
          [0,15,16,1,'#8c4630'],
          [15,0,1,16,'#8c4630'],
          [2,2,12,12,'#b35f44'],
          [4,4,8,8,'#c97458'],
          [6,6,4,4,'#e0937a'],
          [8,8,2,2,'#733623']
        ]
      }
    };

    var config = palettes[type] || palettes.gold_block;
    ctx.fillStyle = config.bg;
    ctx.fillRect(0, 0, 16, 16);

    config.pixels.forEach(function (p) {
      ctx.fillStyle = p[4];
      ctx.fillRect(p[0], p[1], p[2], p[3]);
    });

    var dataUrl = canvas.toDataURL('image/png');
    TEXTURE_CACHE[type] = dataUrl;
    return dataUrl;
  }

  // Pre-render texture palette
  var ALL_TEXTURES = [
    'crafting_table_side', 'crafting_table_top', 'gold_block',
    'netherite_block', 'emerald_block', 'diamond_block',
    'redstone_block', 'copper_block'
  ];
  ALL_TEXTURES.forEach(generateBlockTexture);

  // Apply preview textures on cards in the wall
  document.querySelectorAll('.pack-block-preview').forEach(function (el) {
    var tex = el.dataset.tex || 'gold_block';
    var img = document.createElement('img');
    img.src = generateBlockTexture(tex);
    img.style.width = '70px';
    img.style.height = '70px';
    img.style.imageRendering = 'pixelated';
    img.style.filter = 'drop-shadow(0 10px 20px rgba(0,0,0,0.6))';
    el.appendChild(img);
  });

  // ---------- 3D Cube Mechanics ----------
  var FACES = [
    { cls: 'fr', tf: 'translateZ(H)' },
    { cls: 'bk', tf: 'rotateY(180deg) translateZ(H)' },
    { cls: 'rt', tf: 'rotateY(90deg) translateZ(H)' },
    { cls: 'lf', tf: 'rotateY(-90deg) translateZ(H)' },
    { cls: 'up', tf: 'rotateX(90deg) translateZ(H)' },
    { cls: 'dn', tf: 'rotateX(-90deg) translateZ(H)' }
  ];

  function createCube(size, sideTex, topTex, botTex) {
    var c = document.createElement('div');
    c.className = 'h3-cube';
    c.style.width = size + 'px';
    c.style.height = size + 'px';
    c.dataset.size = String(size);
    var half = size / 2;

    var sImg = generateBlockTexture(sideTex || 'gold_block');
    var tImg = generateBlockTexture(topTex || sideTex || 'gold_block');
    var bImg = generateBlockTexture(botTex || topTex || sideTex || 'gold_block');

    FACES.forEach(function (f) {
      var el = document.createElement('i');
      el.className = f.cls;
      el.dataset.base = f.tf.replace('H', half + 'px');
      el.style.transform = el.dataset.base;
      var tex = f.cls === 'up' ? tImg : f.cls === 'dn' ? bImg : sImg;
      el.style.backgroundImage = 'url("' + tex + '")';
      c.appendChild(el);
    });
    return c;
  }

  function explodeCube(cubeEl, amount) {
    var half = Number(cubeEl.dataset.size) / 2;
    var faces = cubeEl.children;
    for (var i = 0; i < faces.length; i++) {
      var f = FACES[i];
      var push = half + amount;
      faces[i].style.transform = f.tf.replace('H', push + 'px');
      faces[i].style.opacity = String(Math.max(0.25, 1 - (amount / (half * 2.8))));
    }
  }

  function makeSpinnable(el, startX, startY) {
    var rx = startX == null ? -18 : startX;
    var ry = startY == null ? 32 : startY;
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
    }, { passive: false });
    window.addEventListener('mouseup', function () { down = false; });
    window.addEventListener('touchend', function () { down = false; });

    return function () { return held && down; };
  }

  function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function span(v, a, b) { return clamp((v - a) / (b - a)); }
  function ease(t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

  // ---------- Hero 3D Stage ----------
  var heroCube = null;
  var heroHeld = function () { return false; };

  function buildHero() {
    var stage = document.getElementById('h3-hero-stage');
    if (!stage) return;

    var bloom = document.createElement('div');
    bloom.className = 'h3-bloom';
    stage.appendChild(bloom);

    var size = Math.max(140, Math.min(220, Math.round(window.innerWidth * 0.18)));
    heroCube = createCube(size, 'crafting_table_side', 'crafting_table_top');
    heroHeld = makeSpinnable(heroCube, -18, 30);
    stage.appendChild(heroCube);
  }

  // ---------- Scroll Beats Engine ----------
  var beats = [];

  function buildBeats() {
    document.querySelectorAll('.h3-beat').forEach(function (beat) {
      var scene = beat.querySelector('.h3-scene');
      if (!scene) return;
      var tex = scene.dataset.tex || 'gold_block';
      var size = Math.min(280, Math.round(window.innerWidth * 0.22)) || 220;
      var c = createCube(Math.max(160, size), tex, tex);
      var held = makeSpinnable(c, -18, 28);
      scene.insertBefore(c, scene.firstChild);

      var bloom = document.createElement('div');
      bloom.className = 'h3-bloom';
      scene.insertBefore(bloom, scene.firstChild);

      beats.push({
        section: beat,
        cube: c,
        held: held,
        core: beat.querySelector('.h3-core'),
        fades: [].slice.call(beat.querySelectorAll('.h3-fade'))
      });
    });
  }

  function drawBeat(b, now) {
    var r = b.section.getBoundingClientRect();
    var vh = window.innerHeight;
    var total = r.height - vh;
    var p = total > 0 ? clamp((-r.top) / total) : 0;

    var turn = -30 + p * 210;
    var reach = window.innerWidth < 700 ? 0.45 : 0.65;
    var open = Math.sin(Math.PI * span(p, 0.18, 0.86)) * (Number(b.cube.dataset.size) * reach);
    var lift = (0.5 - Math.abs(p - 0.5)) * 40;
    var scale = 0.88 + Math.sin(Math.PI * clamp(p)) * 0.2;

    var rx = b.held() ? Number(b.cube.dataset.rx) : -18 + Math.sin(p * Math.PI) * 10;
    var ry = b.held() ? Number(b.cube.dataset.ry) : turn;
    if (!b.held()) { b.cube.dataset.rx = rx; b.cube.dataset.ry = ry; }

    b.cube.style.transform = 'translateY(' + (-lift).toFixed(1) + 'px) scale(' + scale.toFixed(3) +
      ') rotateX(' + rx.toFixed(1) + 'deg) rotateY(' + ry.toFixed(1) + 'deg)';
    explodeCube(b.cube, open);

    if (b.core) {
      var reveal = span(p, 0.32, 0.58) * (1 - span(p, 0.74, 0.92));
      b.core.style.opacity = reveal.toFixed(3);
      b.core.style.transform = 'translate(-50%, -50%) translateZ(220px) scale(' + (0.75 + reveal * 0.25).toFixed(3) + ')';
    }

    var pc = clamp(p + 0.08);
    b.fades.forEach(function (el, i) {
      var from = 0.02 + i * 0.04;
      var t = ease(span(pc, from, from + 0.12)) * (1 - span(p, 0.94, 1));
      el.style.opacity = t.toFixed(3);
      el.style.transform = 'translateY(' + ((1 - t) * 26).toFixed(1) + 'px)';
    });
  }

  // ---------- 3D Tilt & Final Orbit ----------
  var spinners = [];
  var finalRing = null;

  function makeTiltable(el, strength) {
    el.addEventListener('mousemove', function (e) {
      var b = el.getBoundingClientRect();
      el.style.setProperty('--ty', (((e.clientX - b.left) / b.width - 0.5) * strength).toFixed(2) + 'deg');
      el.style.setProperty('--tx', (-((e.clientY - b.top) / b.height - 0.5) * strength).toFixed(2) + 'deg');
    });
    el.addEventListener('mouseleave', function () {
      el.style.setProperty('--ty', '0deg');
      el.style.setProperty('--tx', '0deg');
    });
  }

  function setupTailScenes() {
    document.querySelectorAll('.h3-pack').forEach(function (p) { makeTiltable(p, 12); });
    document.querySelectorAll('.h3-quote').forEach(function (q) { makeTiltable(q, 8); });

    // Cubes on numbers
    var numTex = ['gold_block', 'netherite_block', 'emerald_block', 'diamond_block'];
    document.querySelectorAll('.h3-num').forEach(function (n, i) {
      makeTiltable(n, 10);
      var host = document.createElement('div');
      host.className = 'h3-num-cube';
      var size = window.innerWidth < 620 ? 30 : 38;
      var c = createCube(size, numTex[i % numTex.length]);
      c.style.position = 'absolute';
      c.style.left = '50%';
      c.style.top = '50%';
      c.style.marginLeft = (-size / 2) + 'px';
      c.style.marginTop = (-size / 2) + 'px';
      spinners.push({ cube: c, speed: 14 + i * 4, held: makeSpinnable(c, -18, 30) });
      host.appendChild(c);
      n.appendChild(host);
    });

    // Orbiting closing cluster
    var final = document.getElementById('h3-final');
    if (!final) return;
    var bloom = document.createElement('div');
    bloom.className = 'h3-bloom';
    final.appendChild(bloom);

    var ring = document.createElement('div');
    ring.className = 'h3-orbit';
    final.appendChild(ring);

    var orbitBlocks = ['gold_block', 'netherite_block', 'emerald_block', 'diamond_block', 'copper_block'];
    var radius = window.innerWidth < 620 ? 90 : 160;
    var bSize = window.innerWidth < 620 ? 44 : 58;

    orbitBlocks.forEach(function (name, i) {
      var arm = document.createElement('div');
      arm.className = 'h3-arm';
      arm.style.width = bSize + 'px';
      arm.style.height = bSize + 'px';
      arm.style.marginLeft = (-bSize / 2) + 'px';
      arm.style.marginTop = (-bSize / 2) + 'px';
      arm.dataset.angle = String((360 / orbitBlocks.length) * i);
      arm.dataset.radius = String(radius);
      var c = createCube(bSize, name);
      spinners.push({ cube: c, speed: 10 + i * 2, held: makeSpinnable(c, -16, 24) });
      arm.appendChild(c);
      ring.appendChild(arm);
    });
    finalRing = ring;
  }

  function drawTail(t) {
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
      var r = finalRing.parentElement.getBoundingClientRect();
      if (r.bottom < -100 || r.top > window.innerHeight + 100) return;
      [].forEach.call(finalRing.children, function (arm) {
        var a = (Number(arm.dataset.angle) + t * 14) % 360;
        var rad = Number(arm.dataset.radius);
        arm.style.transform = 'rotateY(' + a.toFixed(2) + 'deg) translateZ(' + rad + 'px) translateY(' +
          (Math.sin((a * Math.PI) / 180 + t) * 14).toFixed(1) + 'px)';
      });
    }
  }

  // ---------- 3D Animation Frame Loop ----------
  function drawAll(t) {
    for (var i = 0; i < beats.length; i++) {
      var r = beats[i].section.getBoundingClientRect();
      if (r.bottom > -200 && r.top < window.innerHeight + 200) drawBeat(beats[i], t);
    }
  }

  function frame() {
    var t = performance.now() / 1000;

    if (heroCube) {
      var hr = heroCube.getBoundingClientRect();
      if (hr.bottom > 0 && hr.top < window.innerHeight) {
        var rx = heroHeld() ? Number(heroCube.dataset.rx) : -18 + Math.sin(t * 0.5) * 6;
        var ry = heroHeld() ? Number(heroCube.dataset.ry) : (t * 10) % 360;
        if (!heroHeld()) { heroCube.dataset.rx = rx; heroCube.dataset.ry = ry; }
        var drift = Math.sin(t * 0.8) * 10;
        heroCube.style.transform = 'translateY(' + drift.toFixed(1) + 'px) rotateX(' + rx.toFixed(1) +
          'deg) rotateY(' + ry.toFixed(1) + 'deg)';
      }
    }

    drawAll(t);
    drawTail(t);
    requestAnimationFrame(frame);
  }

  // ---------- Interactive Rig Simulator Logic ----------
  var currentSimMode = 'coinflip';
  var isRigActive = true;
  var simWins = 10;
  var simLosses = 0;
  var simProfit = 450000000;

  function renderSimulatorStage() {
    var stage = document.getElementById('simStage');
    var title = document.getElementById('simTitle');
    if (!stage || !title) return;

    if (currentSimMode === 'coinflip') {
      title.textContent = 'DonutSMP CoinFlip Rig Engine';
      stage.innerHTML = [
        '<div class="sim-coinflip-view">',
        '  <div class="sim-coin" id="simCoin">🪙</div>',
        '  <div style="font-size:18px;font-weight:800;margin-bottom:6px;">Target: DonutSMP /cf $50,000,000</div>',
        '  <div style="font-size:13px;color:var(--text-muted);" id="simStatusText">Ready. Rig will force PRNG seed match.</div>',
        '</div>'
      ].join('');
    } else if (currentSimMode === 'crash') {
      title.textContent = 'Casino Crash Auto-Multiplier Rig';
      stage.innerHTML = [
        '<div style="text-align:center;width:100%;">',
        '  <div style="font-size:42px;font-weight:900;color:var(--accent-gold);margin-bottom:8px;" id="simCrashVal">12.45x</div>',
        '  <div style="font-size:14px;color:var(--text-muted);">Auto-Cashout Locked at Peak Tick: <b class="green-text">12.40x</b></div>',
        '  <div class="rig-meter-bar" style="max-width:320px;margin:16px auto;"><div class="bar-fill" style="width:88%;"></div></div>',
        '</div>'
      ].join('');
    } else if (currentSimMode === 'duels') {
      title.textContent = 'Duels Combat & Reach Forecaster';
      stage.innerHTML = [
        '<div style="width:100%;max-width:380px;">',
        '  <div class="stat-row"><span>Opponent Ping:</span><span class="accent">42ms</span></div>',
        '  <div class="stat-row"><span>Reach Legit Offset:</span><span class="green-bold">+0.18 Blocks</span></div>',
        '  <div class="stat-row"><span>W-Tap Combo Lock:</span><span class="gold-bold">100% SUCCESS</span></div>',
        '  <div class="stat-row"><span>Expected Outcome:</span><b class="green-text">VICTORY (100%)</b></div>',
        '</div>'
      ].join('');
    } else if (currentSimMode === 'spawner') {
      title.textContent = 'Deep Chunk Spawner Radar';
      stage.innerHTML = [
        '<div style="width:100%;max-width:400px;font-family:var(--font-mono);font-size:12px;">',
        '  <div class="log-row"><span class="coord">[+840, -52, -120]</span> <b class="gold">4x Spawners Located</b></div>',
        '  <div class="log-row"><span class="coord">[+1120, +64, +480]</span> <b class="cyan">Obsidian Bunker (28 Shulkers)</b></div>',
        '  <div class="log-row"><span class="coord">[+2400, +12, -900]</span> <b class="purple">Unclaimed Grinder Base</b></div>',
        '</div>'
      ].join('');
    }
  }

  function setupSimulator() {
    var options = document.querySelectorAll('.sim-option');
    options.forEach(function (opt) {
      opt.addEventListener('click', function () {
        options.forEach(function (o) { o.classList.remove('active'); });
        opt.classList.add('active');
        currentSimMode = opt.dataset.mode;
        renderSimulatorStage();
      });
    });

    var rigToggle = document.getElementById('rigToggle');
    if (rigToggle) {
      rigToggle.addEventListener('click', function () {
        isRigActive = !isRigActive;
        rigToggle.textContent = isRigActive ? 'ENABLED' : 'DISABLED';
        rigToggle.className = isRigActive ? 'rig-toggle-btn active' : 'rig-toggle-btn off';
      });
    }

    var runBtn = document.getElementById('simRunBtn');
    if (runBtn) {
      runBtn.addEventListener('click', function () {
        runBtn.disabled = true;
        runBtn.textContent = 'Simulating Tick Packets...';

        var coin = document.getElementById('simCoin');
        if (coin) coin.classList.add('flipping');

        setTimeout(function () {
          if (coin) coin.classList.remove('flipping');
          runBtn.disabled = false;
          runBtn.textContent = 'Execute Rig Simulation';

          var win = isRigActive ? true : (Math.random() > 0.5);
          if (win) {
            simWins++;
            simProfit += 50000000;
          } else {
            simLosses++;
            simProfit -= 50000000;
          }

          var rate = Math.round((simWins / (simWins + simLosses)) * 100);
          var summary = document.getElementById('simSummary');
          if (summary) {
            summary.innerHTML = 'Simulated ' + (simWins + simLosses) + ' Runs: <b class="green-text">' +
              simWins + ' Wins (' + rate + '% Rate)</b> &bull; Total Profit: <b class="gold-text">+$' +
              (simProfit / 1000000).toLocaleString() + ',000,000</b>';
          }

          var st = document.getElementById('simStatusText');
          if (st) {
            st.innerHTML = win ? '<b style="color:var(--accent-green);">RESULT: HEADS WON! +$50M added.</b>' : '<b style="color:#ff4757;">RESULT: TAILS (Rig was disabled)</b>';
          }
        }, 800);
      });
    }

    renderSimulatorStage();
  }

  // ---------- Live Telemetry Stream ----------
  var recentEvents = [
    { user: 'Vortex_SMP', mode: 'CoinFlip', win: '$45,000,000', time: '12s ago' },
    { user: 'ShadowBlade99', mode: 'Spawner Radar', win: '6x Spawners Found', time: '34s ago' },
    { user: 'KryptoPvP', mode: 'Duels Hitbox', win: '18 Win Streak', time: '1m ago' },
    { user: 'DonutKing_x', mode: 'Crash Multiplier', win: '$120,000,000', time: '2m ago' },
    { user: 'AeroFrost', mode: 'CoinFlip', win: '$75,000,000', time: '3m ago' },
    { user: 'Zetron_Live', mode: 'Duels Legit Reach', win: 'Flawless Victory', time: '4m ago' }
  ];

  function renderLiveFeed() {
    var host = document.getElementById('h3-feed');
    if (!host) return;

    host.innerHTML = recentEvents.map(function (ev) {
      return [
        '<div class="feed-row-item">',
        '  <span class="player-name">👤 ' + ev.user + '</span>',
        '  <span style="color:var(--text-muted);">' + ev.mode + '</span>',
        '  <span class="win-amount">' + ev.win + '</span>',
        '  <span class="time-ago">' + ev.time + '</span>',
        '</div>'
      ].join('');
    }).join('');
  }

  function cycleLiveFeed() {
    var sampleUsers = ['FrostBite', 'HyperionPvP', 'Zephyr_x', 'DonutGrinder', 'GhostRider', 'LifestealGod', 'BillionaireMC'];
    var sampleModes = ['CoinFlip', 'Crash Rig', 'Spawner ESP', 'Duels W-Tap', 'Base Finder'];
    var sampleWins = ['$30,000,000', '$65,000,000', '$100,000,000', '12x Spawners Located', '25 Duels Won'];

    var newUser = sampleUsers[Math.floor(Math.random() * sampleUsers.length)];
    var newMode = sampleModes[Math.floor(Math.random() * sampleModes.length)];
    var newWin = sampleWins[Math.floor(Math.random() * sampleWins.length)];

    recentEvents.unshift({ user: newUser, mode: newMode, win: newWin, time: 'Just now' });
    if (recentEvents.length > 6) recentEvents.pop();
    renderLiveFeed();
  }

  // ---------- FAQ Accordion ----------
  function setupFaq() {
    document.querySelectorAll('.faq-item').forEach(function (item) {
      var q = item.querySelector('.faq-question');
      if (q) {
        q.addEventListener('click', function () {
          var isActive = item.classList.contains('active');
          document.querySelectorAll('.faq-item').forEach(function (i) { i.classList.remove('active'); });
          if (!isActive) item.classList.add('active');
        });
      }
    });
  }

  // ---------- Nav Scroll Shadow & Preloader ----------
  function setupNavAndLoader() {
    var nav = document.querySelector('.rp-nav');
    if (nav) {
      window.addEventListener('scroll', function () {
        nav.classList.toggle('scrolled', window.scrollY > 15);
      }, { passive: true });
    }

    var loader = document.getElementById('rp-loader');
    if (loader) {
      setTimeout(function () {
        loader.classList.add('out');
      }, 350);
    }
  }

  // ---------- Checkout Modal Handlers ----------
  window.openCheckout = function (planName, price) {
    var modal = document.getElementById('checkoutModal');
    var title = document.getElementById('modalPlanTitle');
    var priceEl = document.getElementById('modalPlanPrice');
    if (modal && title && priceEl) {
      title.textContent = planName;
      priceEl.textContent = price;
      modal.classList.add('open');
    }
  };

  window.closeCheckout = function () {
    var modal = document.getElementById('checkoutModal');
    if (modal) modal.classList.remove('open');
  };

  window.handleCheckout = function (e) {
    e.preventDefault();
    var key = 'RIG-' + Math.random().toString(36).substring(2, 6).toUpperCase() + '-' +
      Math.random().toString(36).substring(2, 6).toUpperCase() + '-' +
      Math.random().toString(36).substring(2, 6).toUpperCase();

    alert('🎉 Payment Simulated Successfully!\n\nYour RigMod License Key:\n' + key + '\n\nKey has been dispatched to your email & Discord. Enjoy dominating DonutSMP!');
    window.closeCheckout();
  };

  // Close modal when clicking outside card
  var modal = document.getElementById('checkoutModal');
  if (modal) {
    modal.addEventListener('click', function (e) {
      if (e.target === modal) window.closeCheckout();
    });
  }

  // Payment method buttons toggle
  document.querySelectorAll('.pay-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.pay-btn').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
    });
  });

  // ---------- Global Initialization ----------
  function start() {
    setupNavAndLoader();
    buildHero();
    buildBeats();
    setupTailScenes();
    setupSimulator();
    renderLiveFeed();
    setupFaq();

    setInterval(cycleLiveFeed, 8000);

    document.body.classList.add('h3-anim');
    drawAll(0);

    window.addEventListener('scroll', function () { drawAll(performance.now() / 1000); }, { passive: true });
    window.addEventListener('resize', function () { drawAll(performance.now() / 1000); });
    requestAnimationFrame(frame);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
