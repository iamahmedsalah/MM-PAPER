/* MM Paper — small 3D paper per card. Usage: <div data-paper="kraft"></div> (kraft|offset|coated|newsprint|cardboard|tissue) */
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
function envScene() {
  const e = new THREE.Scene();
  e.add(new THREE.Mesh(new THREE.BoxGeometry(20, 20, 20), new THREE.MeshBasicMaterial({ color: 0x8a8f99, side: THREE.BackSide })));
  [[0, 9.5, 0, 12, 12, 0, 1], [-9.5, 2, 3, 6, 8, 1, 1], [9.5, 1, -2, 5, 8, 1, .6]].forEach(([x, y, z, w, h, ax, k]) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(k * 6, k * 5.8, k * 5.4), side: THREE.DoubleSide })); m.position.set(x, y, z); if (ax) m.rotation.y = Math.PI / 2; else m.rotation.x = Math.PI / 2; e.add(m); });
  return e;
}

const W = 1.8, H = 2.3;
const rnd = (s => () => (s = (s * 16807) % 2147483647) / 2147483647)(42);
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const eo = p => 1 - Math.pow(1 - p, 3);

function canvasTex(size, draw, rep) {
  const c = document.createElement('canvas'); c.width = c.height = size; draw(c.getContext('2d'), size);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  if (rep) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep, rep); } return t;
}
const grain = (base, fibre, n = 5000, len = 10, size = 256) => (x, s) => {
  x.fillStyle = base; x.fillRect(0, 0, s, s);
  for (let i = 0; i < n; i++) { x.strokeStyle = fibre[i % fibre.length]; x.lineWidth = .5 + rnd(); const px = rnd() * s, py = rnd() * s, a = rnd() * 6.28, l = 2 + rnd() * len; x.beginPath(); x.moveTo(px, py); x.lineTo(px + Math.cos(a) * l, py + Math.sin(a) * l); x.stroke(); }
};
const bumpTex = (n = 6000, len = 9) => canvasTex(256, (x, s) => { x.fillStyle = '#808080'; x.fillRect(0, 0, s, s); for (let i = 0; i < n; i++) { const v = rnd() > .5 ? 170 : 90; x.strokeStyle = `rgba(${v},${v},${v},.5)`; x.lineWidth = .7; const px = rnd() * s, py = rnd() * s, a = rnd() * 6.28, l = 2 + rnd() * len; x.beginPath(); x.moveTo(px, py); x.lineTo(px + Math.cos(a) * l, py + Math.sin(a) * l); x.stroke(); } });

function sheetGeo(w, h, o = {}) {
  const g = new THREE.PlaneGeometry(w, h, 22, 28), p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), u = x / w + .5, v = y / h + .5; let z = 0;
    if (o.curl) z += o.curl * Math.pow(u, 2.2);
    if (o.peel) z += o.peel * Math.pow(Math.max(0, u + v - 1.05), 2) * 3;
    if (o.wave) z += o.wave * (Math.sin(x * 5 + y * 2.3) * .5 + Math.sin(y * 7.1 - x * 3.1) * .35 + Math.sin(x * 11 + y * 9) * .15);
    p.setZ(i, z);
  } g.computeVertexNormals(); return g;
}

const SPECS = {
  kraft: { n: 10, th: .045, map: () => canvasTex(256, grain('#b98a52', ['#a67842', '#c99b62', '#8f6636']), 1.5), core: 0x9c7142, rough: .85, bump: .7, curl: .12 },
  offset: { n: 12, th: .04, map: () => canvasTex(256, grain('#f4f1e8', ['#e9e4d6', '#fffdf6'], 3000, 8), 1.5), core: 0xe2ddcf, rough: .75, bump: .3, curl: .06 },
  coated: { n: 8, th: .04, map: 'coated', core: 0xd8d2c4, rough: .12, clear: 1, curl: .1 },
  newsprint: { n: 10, th: .035, map: 'news', core: 0xb9b4a6, rough: .9, bump: .35, curl: .05 },
  tissue: { n: 5, th: .09, map: () => canvasTex(256, (x, s) => { x.fillStyle = '#fbf1ee'; x.fillRect(0, 0, s, s); for (let i = 0; i < 90; i++) { x.strokeStyle = `rgba(210,180,175,${.08 + rnd() * .12})`; x.lineWidth = 1; const y = rnd() * s; x.beginPath(); x.moveTo(0, y); x.bezierCurveTo(s * .3, y + 6, s * .6, y - 6, s, y + 2); x.stroke(); } }), tissue: true },
};
function coatedMap() {
  return canvasTex(256, (x, s) => {
    x.fillStyle = '#f7f4ee'; x.fillRect(0, 0, s, s);
    const g = x.createLinearGradient(0, 0, s, s); g.addColorStop(0, '#e8467c'); g.addColorStop(.55, '#f5a623'); g.addColorStop(1, '#27a3d8');
    x.fillStyle = g; x.beginPath(); x.arc(s * .5, s * .46, s * .34, 0, 6.28); x.fill();
    x.fillStyle = '#f7f4ee'; x.beginPath(); x.arc(s * .6, s * .4, s * .16, 0, 6.28); x.fill();
    ['#00aeef', '#ec008c', '#fff200', '#111'].forEach((c, i) => { x.fillStyle = c; x.fillRect(14 + i * 18, s - 22, 14, 10); });
  });
}
function newsMap() {
  return canvasTex(256, (x, s) => {
    x.fillStyle = '#d8d3c5'; x.fillRect(0, 0, s, s);
    for (let i = 0; i < 2500; i++) { x.fillStyle = 'rgba(120,115,100,.12)'; x.fillRect(rnd() * s, rnd() * s, 2, 1); }
    x.fillStyle = '#2b2a27'; x.fillRect(14, 16, s - 28, 20); x.fillStyle = '#d8d3c5'; x.fillRect(22, 22, s - 44, 8);
    for (let c = 0; c < 3; c++) for (let r = 0; r < 18; r++) { x.fillStyle = 'rgba(40,38,34,.55)'; x.fillRect(14 + c * 80, 50 + r * 10, 66 - (r % 5) * 4, 3); }
    x.fillStyle = 'rgba(40,38,34,.35)'; x.fillRect(14, 54, 66, 40);
  });
}

function buildPaper(type) {
  const g = new THREE.Group(); const sp = SPECS[type]; const pivots = [];
  if (type === 'cardboard') return buildBoard(g);
  const map = sp.map === 'coated' ? coatedMap() : sp.map === 'news' ? newsMap() : sp.map();
  const bump = sp.bump ? bumpTex() : null;
  const mats = [];
  const top = new THREE.MeshPhysicalMaterial({ map, roughness: sp.rough ?? .8, bumpMap: bump, bumpScale: sp.bump || 0, clearcoat: sp.clear || 0, clearcoatRoughness: .08, side: THREE.DoubleSide, sheen: sp.tissue ? 1 : .3, sheenColor: new THREE.Color(0xffffff), transparent: !!sp.tissue, opacity: sp.tissue ? .88 : 1 });
  const plain = top.clone(); if (type === 'coated' || type === 'newsprint') { plain.map = type === 'coated' ? canvasTex(64, (x, s) => { x.fillStyle = '#f2efe8'; x.fillRect(0, 0, s, s); }) : canvasTex(64, (x, s) => { x.fillStyle = '#d4cfc1'; x.fillRect(0, 0, s, s); }); }
  const total = sp.n * sp.th;
  if (!sp.tissue) { const core = new THREE.Mesh(new THREE.BoxGeometry(W - .02, H - .02, total), new THREE.MeshStandardMaterial({ color: sp.core, roughness: .9 })); core.position.z = total / 2 - sp.th * .5; g.add(core); }
  for (let i = 0; i < sp.n; i++) {
    const pv = new THREE.Group(); pv.position.set(-W / 2, -H / 2, i * sp.th);
    const last = i === sp.n - 1;
    const geo = sheetGeo(W, H, { curl: sp.tissue ? 0 : sp.curl * (last ? 1 : .2 + i / sp.n * .5), wave: sp.tissue ? .09 + i * .02 : 0 });
    const m = new THREE.Mesh(geo, last ? top : plain); m.position.set(W / 2, H / 2, 0);
    if (sp.tissue) m.rotation.z = (i - 2) * .05;
    pv.add(m); g.add(pv); pivots.push(pv);
  }
  g.userData = { pivots, total, th: sp.th, tissue: !!sp.tissue };
  return g;
}
function buildBoard(g) {
  const T = .34, amp = .06; const liners = [];
  const kraft = canvasTex(256, grain('#a9825a', ['#96704a', '#bb9568']), 1.5);
  const lm = new THREE.MeshStandardMaterial({ map: kraft, roughness: .9, side: THREE.DoubleSide });
  const fm = new THREE.MeshStandardMaterial({ color: 0xc09a68, roughness: .85, side: THREE.DoubleSide });
  const pts = [], N = 60; for (let i = 0; i <= N; i++) { const x = -W / 2 + W * i / N; pts.push(new THREE.Vector2(x, Math.sin(x * 17) * amp + .03)); }
  const sh = new THREE.Shape(); pts.forEach((p, i) => i ? sh.lineTo(p.x, p.y) : sh.moveTo(p.x, p.y)); for (let i = N; i >= 0; i--) sh.lineTo(pts[i].x, pts[i].y - .03); sh.closePath();
  const fg = new THREE.ExtrudeGeometry(sh, { depth: H, bevelEnabled: false, curveSegments: 1 }); fg.rotateX(-Math.PI / 2); fg.translate(0, -H / 2, T / 2 - .02);
  const flute = new THREE.Mesh(fg, fm); g.add(flute);
  const bot = new THREE.Mesh(new THREE.BoxGeometry(W, H, .035), lm); bot.position.z = T / 2 - amp - .06; g.add(bot);
  const tp = new THREE.Group(); tp.position.set(-W / 2, -H / 2, T / 2 + amp + .045);
  const tm = new THREE.Mesh(sheetGeo(W, H, { peel: .0 }), lm); tm.position.set(W / 2, H / 2, 0); tp.add(tm); g.add(tp);
  // peel mesh re-generated on hover
  g.userData = { board: true, tp, tm, T, W, H, peelGeo: v => { tm.geometry.dispose(); tm.geometry = sheetGeo(W, H, { peel: v }); }, lastPeel: 0 };
  return g;
}

export function mount(el, type) {
  if (el.__paper) return; el.__paper = 1;
  const cs = getComputedStyle(el); if (cs.position === 'static') el.style.position = 'relative';
  [...el.children].forEach(c => c.style.visibility = 'hidden');
  const cv = document.createElement('canvas'); cv.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;visibility:visible;pointer-events:none';
  el.appendChild(cv);
  const r = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: true }); r.setPixelRatio(Math.min(devicePixelRatio, 2));
  r.toneMapping = THREE.ACESFilmicToneMapping; r.toneMappingExposure = .95;
  const sc = new THREE.Scene(); sc.environment = new THREE.PMREMGenerator(r).fromScene(envScene(), .04).texture; sc.environmentIntensity = .75;
  const key = new THREE.DirectionalLight(0xfff0dc, 2); key.position.set(-3, 4, 5); sc.add(key);
  const cam = new THREE.PerspectiveCamera(28, 1, .1, 50); cam.position.set(0, 0, 9);
  const paper = buildPaper(type), U = paper.userData; const root = new THREE.Group(); root.add(paper); sc.add(root);
  const isBoard = U.board;
  function size() { const w = el.clientWidth || 300, h = el.clientHeight || 110; r.setSize(w, h, false); cam.aspect = w / h; const fit = 3.3 / 1; const half = Math.tan(cam.fov * Math.PI / 360); cam.position.z = Math.max(fit / half / 1.0 * (110 / Math.max(h, 60)) * .62, 5); cam.position.z = (h < 140 ? 1.75 : 2.1) / half * (h / h); cam.updateProjectionMatrix(); }
  size(); new ResizeObserver(size).observe(el);
  let hover = 0, hv = 0, vis = false, t0 = performance.now(), start = null; const ptr = { x: 0, y: 0 };
  const host = el.closest('a,article,li,[class*="card"],[class*="Card"]') || el;
  host.addEventListener('pointerenter', () => hv = 1); host.addEventListener('pointerleave', () => { hv = 0; ptr.x = ptr.y = 0; });
  host.addEventListener('pointermove', e => { const b = el.getBoundingClientRect(); ptr.x = clamp((e.clientX - b.left) / b.width * 2 - 1, -1, 1); ptr.y = clamp((e.clientY - b.top) / b.height * 2 - 1, -1, 1); });
  new IntersectionObserver(es => { vis = es[0].isIntersecting; if (vis && start === null) start = performance.now(); }, { threshold: .1 }).observe(el);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let last = performance.now();
  r.setAnimationLoop(now => {
    if (!vis) return; const dt = Math.min(.05, (now - last) / 1000); last = now; const t = (now - t0) / 1000, it = (now - start) / 1000;
    hover += (hv - hover) * Math.min(1, dt * 6);
    const intro = reduce ? 1 : eo(clamp(it / 1.2));
    root.rotation.set(-1.0 + ptr.y * .12 - hover * .12, -.12 + ptr.x * .25, -.55 + Math.sin(t * .7) * .12 + hover * .25 + (1 - intro) * 1.2);
    root.position.y = -.05 + Math.sin(t * 1.2) * .06 + (1 - intro) * 1.2; root.scale.setScalar(.74 + .26 * intro + hover * .05);
    if (isBoard) { const pl = hover * .5; if (Math.abs(pl - U.lastPeel) > .01) { U.peelGeo(pl); U.lastPeel = pl; } U.tp.rotation.z = hover * .12; }
    else U.pivots.forEach((pv, i) => {
      const n = U.pivots.length, k = i / (n - 1), d = clamp((it - .15 - k * .5) / .5);
      const drop = reduce ? 0 : (1 - eo(d)) * 1.4;
      pv.position.z = i * U.th + drop + hover * k * k * (U.tissue ? .5 : .55);
      pv.rotation.z = hover * (i - n / 2) * .045 * (1 + k);
    });
    r.render(sc, cam);
  });
}
export function auto(root = document) { root.querySelectorAll('[data-paper]').forEach(el => mount(el, el.dataset.paper)); }
if (typeof window !== 'undefined') { window.MMPaper = { mount, auto }; (document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', () => auto()) : auto()); }
