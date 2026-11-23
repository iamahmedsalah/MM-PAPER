import * as THREE from 'three';

/* MM — 3D paper-strip logo. 2 letters × 4 strips (leg, diagonal, diagonal, leg). */
export const THEMES = {
  light: { bg: 0xf5efe3, m1: 0x17402f, m2: 0xb9854a, sheet1: 0xfffaf0, sheet2: 0xe2c9a3, env: 1.0 },
  dark:  { bg: 0x0f1a15, m1: 0xf1e8d4, m2: 0xd9a35f, sheet1: 0x24402f, sheet2: 0x5a4328, env: 0.55 },
};
const W = 3.2, H = 4, T = 0.8, YV = 0.9, G = 1.1, H1 = 2.9, GAP = 0.03, D = 0.7;
export const M_W = W, M_H = H, M_GAP = 0.8;
const NAMES = ['legL', 'diagL', 'diagR', 'legR'];

export function stripPolys() {            // 2D polygons in M space (y up)
  const hw = W / 2, g = GAP;
  const legL = [[0, 0], [T, 0], [T, H], [0, H]];
  const diagL = [[T + g, H1], [hw - g / 2, YV], [hw - g / 2, YV + G], [T + g, H]];
  const mir = p => p.map(([x, y]) => [W - x, y]).reverse();
  return [legL, diagL, mir(diagL), mir(legL)];
}

function rng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const easeOut = p => 1 - Math.pow(1 - p, 3);
const easeIO = p => p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
const backOut = p => { const c1 = 1.4, c3 = c1 + 1; return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2); };

function paperTex(rep = 2) {
  const c = document.createElement('canvas'); c.width = c.height = 256; const x = c.getContext('2d');
  x.fillStyle = '#808080'; x.fillRect(0, 0, 256, 256);
  const r = rng(7);
  for (let i = 0; i < 9000; i++) { const v = 100 + r() * 60 | 0; x.fillStyle = `rgba(${v},${v},${v},.35)`; x.fillRect(r() * 256, r() * 256, 1 + r() * 2, 1); }
  for (let i = 0; i < 700; i++) { const v = r() > .5 ? 170 : 90; x.strokeStyle = `rgba(${v},${v},${v},.25)`; x.lineWidth = .6; x.beginPath(); const px = r() * 256, py = r() * 256, a = r() * 6.28, l = 4 + r() * 12; x.moveTo(px, py); x.lineTo(px + Math.cos(a) * l, py + Math.sin(a) * l); x.stroke(); }
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep, rep); return t;
}

export function buildMM(opts = {}) {
  const theme = opts.theme || 'light';
  const root = new THREE.Group(); root.name = 'MM';
  const grain = paperTex();
  const mats = [0, 1].map(i => new THREE.MeshPhysicalMaterial({
    color: THEMES[theme][i ? 'm2' : 'm1'], roughness: .55, metalness: 0, bumpMap: grain, bumpScale: .6,
    sheen: 1, sheenRoughness: .5, sheenColor: new THREE.Color(0xffffff), clearcoat: .15, clearcoatRoughness: .6,
  }));

  const letters = [], pieces = [];
  const r = rng(11);
  const polys = stripPolys();
  const bev = .05;
  [0, 1].forEach(li => {
    const grp = new THREE.Group(); grp.name = 'M' + (li + 1);
    grp.position.x = (li ? 1 : -1) * (W + M_GAP) / 2;
    root.add(grp); letters.push(grp);
    polys.forEach((poly, k) => {
      const s = new THREE.Shape(poly.map(([x, y]) => new THREE.Vector2(x - W / 2, y - H / 2)));
      const geo = new THREE.ExtrudeGeometry(s, { depth: D, bevelEnabled: true, bevelSize: bev, bevelOffset: -bev, bevelThickness: .07, bevelSegments: 3, curveSegments: 1 });
      geo.translate(0, 0, -D / 2);
      geo.computeBoundingBox(); const ctr = new THREE.Vector3(); geo.boundingBox.getCenter(ctr); ctr.z = 0;
      geo.translate(-ctr.x, -ctr.y, 0);
      const m = new THREE.Mesh(geo, mats[li]); m.name = `M${li + 1}_${NAMES[k]}`;
      m.position.copy(ctr); grp.add(m);
      const from = {
        pos: new THREE.Vector3((r() - .5) * 16, 6 + r() * 6, 3 + r() * 6),
        quat: new THREE.Quaternion().setFromEuler(new THREE.Euler((r() - .5) * 7, (r() - .5) * 7, (r() - .5) * 9)),
        flut: r() * 6.28,
      };
      pieces.push({ mesh: m, home: ctr.clone(), from, delay: (li * 4 + k) * .11 + li * .15, li });
    });
  });

  const DUR = 1.5, INTRO = 3.2;
  const qI = new THREE.Quaternion();
  function pieceAt(pc, T) {
    const p = clamp((T - pc.delay) / DUR), e = easeOut(p), b = backOut(p);
    const pos = pc.from.pos.clone().lerp(pc.home, e);
    const fl = Math.sin(p * Math.PI * 3 + pc.from.flut) * (1 - p) * .5;
    pos.x += fl; pos.y += Math.cos(p * Math.PI * 2 + pc.from.flut) * (1 - p) * .25;
    const quat = pc.from.quat.clone().slerp(qI, easeIO(p));
    const sc = .2 + .8 * clamp(b, 0, 1.08);
    return { pos, quat, sc };
  }
  function applyIntro(T) { pieces.forEach(pc => { const s = pieceAt(pc, T); pc.mesh.position.copy(s.pos); pc.mesh.quaternion.copy(s.quat); pc.mesh.scale.setScalar(s.sc); }); }

  // exportable clip: assemble
  function makeClip() {
    const times = [], N = Math.round(INTRO * 30);
    for (let i = 0; i <= N; i++) times.push(i / 30);
    const tracks = [];
    pieces.forEach(pc => {
      const pv = [], qv = [], sv = [];
      times.forEach(t => { const s = pieceAt(pc, t); pv.push(s.pos.x, s.pos.y, s.pos.z); qv.push(s.quat.x, s.quat.y, s.quat.z, s.quat.w); sv.push(s.sc, s.sc, s.sc); });
      tracks.push(new THREE.VectorKeyframeTrack(pc.mesh.name + '.position', times, pv));
      tracks.push(new THREE.QuaternionKeyframeTrack(pc.mesh.name + '.quaternion', times, qv));
      tracks.push(new THREE.VectorKeyframeTrack(pc.mesh.name + '.scale', times, sv));
    });
    return new THREE.AnimationClip('Assemble', INTRO, tracks);
  }
  const clips = [makeClip()];

  // background paper sheets
  const sheets = new THREE.Group(); sheets.name = 'Sheets'; const sr = rng(5);
  const sheetMats = [new THREE.MeshBasicMaterial({ color: THEMES[theme].sheet1, side: THREE.DoubleSide, transparent: true, opacity: .85 }), new THREE.MeshBasicMaterial({ color: THEMES[theme].sheet2, side: THREE.DoubleSide, transparent: true, opacity: .85 })];
  const sheetData = [];
  for (let i = 0; i < 18; i++) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 1.5), sheetMats[i % 2]);
    const d = { x: (sr() - .5) * 20, z: -2 - sr() * 7, y0: sr() * 14, spd: .25 + sr() * .35, ax: sr() * 6, rs: .4 + sr() * .8, sc: .6 + sr() * 1.1 };
    m.scale.setScalar(d.sc); sheets.add(m); sheetData.push({ m, d });
  }
  root.add(sheets);
  // sheets excluded from the exported model
  sheets.userData.noExport = true;

  let clock = 0, introT = 0, flipT = -1, autoFlip = opts.autoFlip !== false, nextFlip = 7;
  const tilt = { x: 0, y: 0 }, hover = { v: 0 };
  function update(dt, ptr = { x: 0, y: 0 }) {
    clock += dt;
    if (introT < INTRO + .2) { introT += dt; applyIntro(introT); }
    // pointer tilt + float
    tilt.x += ((-ptr.y * .25) - tilt.x) * Math.min(1, dt * 4);
    tilt.y += ((ptr.x * .45) - tilt.y) * Math.min(1, dt * 4);
    const intro = clamp(introT / INTRO);
    letters.forEach((l, i) => {
      l.position.y = Math.sin(clock * 1.1 + i * 1.3) * .12 * intro;
      let fy = 0;
      if (flipT >= 0) { const p = clamp((flipT - i * .22) / 1.5); fy = easeIO(p) * Math.PI * 2; l.position.z = Math.sin(p * Math.PI) * 1.2; } else l.position.z = 0;
      l.rotation.set(tilt.x, tilt.y * (1 + i * .15) + fy, Math.sin(clock * .7 + i) * .012);
    });
    if (flipT >= 0) { flipT += dt; if (flipT > 2.2) flipT = -1; }
    else if (autoFlip && introT > INTRO && clock > nextFlip) { flipT = 0; nextFlip = clock + 8; }
    // paper "breathe": strips slide slightly in z
    if (introT >= INTRO) pieces.forEach((pc, i) => { pc.mesh.position.z = Math.sin(clock * 1.4 + i * .8) * .09; pc.mesh.position.x = pc.home.x; pc.mesh.position.y = pc.home.y; });
    // sheets
    sheetData.forEach(({ m, d }) => {
      const y = 8 - ((d.y0 + clock * d.spd) % 16);
      m.position.set(d.x + Math.sin(clock * .6 + d.ax) * .8, y, d.z);
      m.rotation.set(clock * d.rs + d.ax, clock * d.rs * .7, clock * d.rs * .5);
    });
  }
  function replay() { introT = 0; flipT = -1; nextFlip = clock + INTRO + 5; }
  function flip() { if (flipT < 0) flipT = 0; }
  function setTheme(n) { const t = THEMES[n]; mats[0].color.setHex(t.m1); mats[1].color.setHex(t.m2); sheetMats[0].color.setHex(t.sheet1); sheetMats[1].color.setHex(t.sheet2); }
  function skipIntro() { introT = INTRO + .3; applyIntro(INTRO + 2); }
  function exportRoot() { // clone-free: temporarily hide sheets
    return root;
  }
  return { root, clips, update, replay, flip, setTheme, skipIntro, sheets, letters, pieces, INTRO, THEMES };
}
