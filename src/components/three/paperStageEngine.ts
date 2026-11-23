import * as THREE from 'three';
import type { ThemeMode } from '../../theme/ThemeContext';

const W = 1.8;
const H = 2.3;

interface PaperSpec {
  n: number;
  th: number;
  map?: () => THREE.Texture;
  mapKind?: 'coated' | 'news';
  core?: number;
  rough?: number;
  bump?: number;
  clear?: number;
  curl?: number;
  tissue?: boolean;
}

interface PaperUserData {
  pivots: THREE.Group[];
  th: number;
  tissue: boolean;
  board?: boolean;
  tp?: THREE.Group;
  tm?: THREE.Mesh;
  lastPeel?: number;
}

export interface PaperSlotConfig {
  canvas: HTMLCanvasElement;
  type: string;
  sizeVariant: 'card' | 'modal';
  onFallback: () => void;
}

export interface PaperSlotHandle {
  setVisible: (v: boolean) => void;
  setHover: (v: boolean) => void;
  setActive: (v: boolean) => void;
  setPointer: (nx: number, ny: number) => void;
  setSize: (w: number, h: number) => void;
  setTheme: (theme: ThemeMode) => void;
  dispose: () => void;
}

interface InternalSlot {
  id: number;
  canvas: HTMLCanvasElement;
  ctx2d: CanvasRenderingContext2D;
  scene: THREE.Scene;
  cam: THREE.PerspectiveCamera;
  root: THREE.Group;
  ud: PaperUserData;
  keyLight: THREE.DirectionalLight;
  rimLight: THREE.DirectionalLight;
  w: number;
  h: number;
  sizeVariant: 'card' | 'modal';
  visible: boolean;
  hv: boolean;
  active: boolean;
  hoverVal: number;
  ptrX: number;
  ptrY: number;
  start: number | null;
  dirtyStatic: boolean;
}

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const easeOut = (p: number) => 1 - Math.pow(1 - p, 3);

function createRng(seed: number) {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function canvasTex(size: number, draw: (ctx: CanvasRenderingContext2D, s: number) => void, rep?: number) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d');
  if (ctx) draw(ctx, size);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  if (rep) {
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(rep, rep);
  }
  return t;
}

const grainDraw =
  (base: string, fibre: string[], n = 4500, len = 10) =>
  (x: CanvasRenderingContext2D, s: number) => {
    const rnd = createRng(42);
    x.fillStyle = base;
    x.fillRect(0, 0, s, s);
    for (let i = 0; i < n; i++) {
      x.strokeStyle = fibre[i % fibre.length];
      x.lineWidth = 0.5 + rnd();
      const px = rnd() * s;
      const py = rnd() * s;
      const a = rnd() * 6.28;
      const l = 2 + rnd() * len;
      x.beginPath();
      x.moveTo(px, py);
      x.lineTo(px + Math.cos(a) * l, py + Math.sin(a) * l);
      x.stroke();
    }
  };

function bumpTex(n = 5000, len = 9) {
  return canvasTex(256, (x, s) => {
    const rnd = createRng(91);
    x.fillStyle = '#808080';
    x.fillRect(0, 0, s, s);
    for (let i = 0; i < n; i++) {
      const v = rnd() > 0.5 ? 170 : 90;
      x.strokeStyle = `rgba(${v},${v},${v},.5)`;
      x.lineWidth = 0.7;
      const px = rnd() * s;
      const py = rnd() * s;
      const a = rnd() * 6.28;
      const l = 2 + rnd() * len;
      x.beginPath();
      x.moveTo(px, py);
      x.lineTo(px + Math.cos(a) * l, py + Math.sin(a) * l);
      x.stroke();
    }
  });
}

function sheetGeo(w: number, h: number, o: { curl?: number; peel?: number; wave?: number } = {}) {
  const g = new THREE.PlaneGeometry(w, h, 22, 28);
  const p = g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i);
    const y = p.getY(i);
    const u = x / w + 0.5;
    const v = y / h + 0.5;
    let z = 0;
    if (o.curl) z += o.curl * Math.pow(u, 2.2);
    if (o.peel) z += o.peel * Math.pow(Math.max(0, u + v - 1.05), 2) * 3;
    if (o.wave) {
      z +=
        o.wave *
        (Math.sin(x * 5 + y * 2.3) * 0.5 +
          Math.sin(y * 7.1 - x * 3.1) * 0.35 +
          Math.sin(x * 11 + y * 9) * 0.15);
    }
    p.setZ(i, z);
  }
  g.computeVertexNormals();
  return g;
}

/** Mutates top-liner vertex Z positions in-place so cardboard corner peel allocates zero memory per frame. */
function updatePeelGeometry(geo: THREE.BufferGeometry, peel: number) {
  const p = geo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i);
    const y = p.getY(i);
    const u = x / W + 0.5;
    const v = y / H + 0.5;
    const z = peel > 0.0001 ? peel * Math.pow(Math.max(0, u + v - 1.05), 2) * 3 : 0;
    p.setZ(i, z);
  }
  p.needsUpdate = true;
  geo.computeVertexNormals();
}

function coatedMap() {
  return canvasTex(256, (x, s) => {
    x.fillStyle = '#f7f4ee';
    x.fillRect(0, 0, s, s);
    const g = x.createLinearGradient(0, 0, s, s);
    g.addColorStop(0, '#e8467c');
    g.addColorStop(0.55, '#f5a623');
    g.addColorStop(1, '#27a3d8');
    x.fillStyle = g;
    x.beginPath();
    x.arc(s * 0.5, s * 0.46, s * 0.34, 0, 6.28);
    x.fill();
    x.fillStyle = '#f7f4ee';
    x.beginPath();
    x.arc(s * 0.6, s * 0.4, s * 0.16, 0, 6.28);
    x.fill();
    (['#00aeef', '#ec008c', '#fff200', '#111111'] as const).forEach((c, i) => {
      x.fillStyle = c;
      x.fillRect(14 + i * 18, s - 22, 14, 10);
    });
  });
}

function newsMap() {
  return canvasTex(256, (x, s) => {
    const rnd = createRng(17);
    x.fillStyle = '#d8d3c5';
    x.fillRect(0, 0, s, s);
    for (let i = 0; i < 2400; i++) {
      x.fillStyle = 'rgba(120,115,100,.12)';
      x.fillRect(rnd() * s, rnd() * s, 2, 1);
    }
    x.fillStyle = '#2b2a27';
    x.fillRect(14, 16, s - 28, 20);
    x.fillStyle = '#d8d3c5';
    x.fillRect(22, 22, s - 44, 8);
    for (let c = 0; c < 3; c++) {
      for (let r = 0; r < 18; r++) {
        x.fillStyle = 'rgba(40,38,34,.55)';
        x.fillRect(14 + c * 80, 50 + r * 10, 66 - (r % 5) * 4, 3);
      }
    }
    x.fillStyle = 'rgba(40,38,34,.35)';
    x.fillRect(14, 54, 66, 40);
  });
}

const SPECS: Record<string, PaperSpec> = {
  kraft: {
    n: 10,
    th: 0.045,
    map: () => canvasTex(256, grainDraw('#b98a52', ['#a67842', '#c99b62', '#8f6636']), 1.5),
    core: 0x9c7142,
    rough: 0.85,
    bump: 0.7,
    curl: 0.12,
  },
  offset: {
    n: 12,
    th: 0.04,
    map: () => canvasTex(256, grainDraw('#f4f1e8', ['#e9e4d6', '#fffdf6'], 3000, 8), 1.5),
    core: 0xe2ddcf,
    rough: 0.75,
    bump: 0.3,
    curl: 0.06,
  },
  coated: {
    n: 8,
    th: 0.04,
    mapKind: 'coated',
    core: 0xd8d2c4,
    rough: 0.12,
    clear: 1,
    curl: 0.1,
  },
  newsprint: {
    n: 10,
    th: 0.035,
    mapKind: 'news',
    core: 0xb9b4a6,
    rough: 0.9,
    bump: 0.35,
    curl: 0.05,
  },
  tissue: {
    n: 5,
    th: 0.09,
    map: () =>
      canvasTex(256, (x, s) => {
        const rnd = createRng(77);
        x.fillStyle = '#fbf1ee';
        x.fillRect(0, 0, s, s);
        for (let i = 0; i < 90; i++) {
          x.strokeStyle = `rgba(210,180,175,${0.08 + rnd() * 0.12})`;
          x.lineWidth = 1;
          const y = rnd() * s;
          x.beginPath();
          x.moveTo(0, y);
          x.bezierCurveTo(s * 0.3, y + 6, s * 0.6, y - 6, s, y + 2);
          x.stroke();
        }
      }),
    tissue: true,
  },
};

function buildBoard(): { group: THREE.Group; ud: PaperUserData } {
  const g = new THREE.Group();
  const T = 0.34;
  const amp = 0.06;
  const kraft = canvasTex(256, grainDraw('#a9825a', ['#96704a', '#bb9568']), 1.5);
  const lm = new THREE.MeshStandardMaterial({ map: kraft, roughness: 0.9, side: THREE.DoubleSide });
  const fm = new THREE.MeshStandardMaterial({ color: 0xc09a68, roughness: 0.85, side: THREE.DoubleSide });
  const pts: THREE.Vector2[] = [];
  const N = 60;
  for (let i = 0; i <= N; i++) {
    const x = -W / 2 + (W * i) / N;
    pts.push(new THREE.Vector2(x, Math.sin(x * 17) * amp + 0.03));
  }
  const sh = new THREE.Shape();
  pts.forEach((p, i) => (i ? sh.lineTo(p.x, p.y) : sh.moveTo(p.x, p.y)));
  for (let i = N; i >= 0; i--) sh.lineTo(pts[i].x, pts[i].y - 0.03);
  sh.closePath();

  const fg = new THREE.ExtrudeGeometry(sh, { depth: H, bevelEnabled: false, curveSegments: 1 });
  fg.rotateX(-Math.PI / 2);
  fg.translate(0, -H / 2, T / 2 - 0.02);
  g.add(new THREE.Mesh(fg, fm));

  const bot = new THREE.Mesh(new THREE.BoxGeometry(W, H, 0.035), lm);
  bot.position.z = T / 2 - amp - 0.06;
  g.add(bot);

  const tp = new THREE.Group();
  tp.position.set(-W / 2, -H / 2, T / 2 + amp + 0.045);
  const tm = new THREE.Mesh(sheetGeo(W, H, { peel: 0 }), lm);
  tm.position.set(W / 2, H / 2, 0);
  tp.add(tm);
  g.add(tp);

  return {
    group: g,
    ud: {
      pivots: [],
      th: 0,
      tissue: false,
      board: true,
      tp,
      tm,
      lastPeel: 0,
    },
  };
}

function buildPaper(type: string): { group: THREE.Group; ud: PaperUserData } {
  if (type === 'cardboard') return buildBoard();
  const g = new THREE.Group();
  const sp = SPECS[type] ?? SPECS.offset;
  const pivots: THREE.Group[] = [];
  const map = sp.mapKind === 'coated' ? coatedMap() : sp.mapKind === 'news' ? newsMap() : sp.map!();
  const bump = sp.bump ? bumpTex() : null;

  const top = new THREE.MeshPhysicalMaterial({
    map,
    roughness: sp.rough ?? 0.8,
    bumpMap: bump,
    bumpScale: sp.bump || 0,
    clearcoat: sp.clear || 0,
    clearcoatRoughness: 0.08,
    side: THREE.DoubleSide,
    sheen: sp.tissue ? 1 : 0.3,
    sheenColor: new THREE.Color(0xffffff),
    transparent: !!sp.tissue,
    opacity: sp.tissue ? 0.88 : 1,
  });

  const plain = top.clone();
  if (sp.mapKind === 'coated') {
    plain.map = canvasTex(64, (x, s) => {
      x.fillStyle = '#f2efe8';
      x.fillRect(0, 0, s, s);
    });
  } else if (sp.mapKind === 'news') {
    plain.map = canvasTex(64, (x, s) => {
      x.fillStyle = '#d4cfc1';
      x.fillRect(0, 0, s, s);
    });
  }

  const total = sp.n * sp.th;
  if (!sp.tissue) {
    const core = new THREE.Mesh(
      new THREE.BoxGeometry(W - 0.02, H - 0.02, total),
      new THREE.MeshStandardMaterial({ color: sp.core ?? 0xd8d2c4, roughness: 0.9 })
    );
    core.position.z = total / 2 - sp.th * 0.5;
    g.add(core);
  }

  for (let i = 0; i < sp.n; i++) {
    const pv = new THREE.Group();
    pv.position.set(-W / 2, -H / 2, i * sp.th);
    const last = i === sp.n - 1;
    const geo = sheetGeo(W, H, {
      curl: sp.tissue ? 0 : (sp.curl ?? 0) * (last ? 1 : 0.2 + (i / sp.n) * 0.5),
      wave: sp.tissue ? 0.09 + i * 0.02 : 0,
    });
    const m = new THREE.Mesh(geo, last ? top : plain);
    m.position.set(W / 2, H / 2, 0);
    if (sp.tissue) m.rotation.z = (i - 2) * 0.05;
    pv.add(m);
    g.add(pv);
    pivots.push(pv);
  }

  return { group: g, ud: { pivots, th: sp.th, tissue: !!sp.tissue } };
}

function createEnvScene() {
  const e = new THREE.Scene();
  e.add(new THREE.Mesh(new THREE.BoxGeometry(20, 20, 20), new THREE.MeshBasicMaterial({ color: 0x8a8f99, side: THREE.BackSide })));
  const walls: Array<[number, number, number, number, number, number, number]> = [
    [0, 9.5, 0, 12, 12, 0, 1],
    [-9.5, 2, 3, 6, 8, 1, 1],
    [9.5, 1, -2, 5, 8, 1, 0.6],
  ];
  walls.forEach(([x, y, z, w, h, ax, k]) => {
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(w, h),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(k * 6, k * 5.8, k * 5.4), side: THREE.DoubleSide })
    );
    m.position.set(x, y, z);
    if (ax) m.rotation.y = Math.PI / 2;
    else m.rotation.x = Math.PI / 2;
    e.add(m);
  });
  return e;
}

function disposeObjectTree(root: THREE.Object3D) {
  const seenTex = new Set<THREE.Texture>();
  root.traverse((obj) => {
    if (obj instanceof THREE.Mesh) {
      obj.geometry.dispose();
      const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
      mats.forEach((mat) => {
        if (!mat) return;
        const std = mat as THREE.MeshPhysicalMaterial;
        if (std.map && !seenTex.has(std.map)) {
          seenTex.add(std.map);
          std.map.dispose();
        }
        if (std.bumpMap && !seenTex.has(std.bumpMap)) {
          seenTex.add(std.bumpMap);
          std.bumpMap.dispose();
        }
        mat.dispose();
      });
    }
  });
}

class PaperStageEngine {
  private renderer: THREE.WebGLRenderer | null = null;
  private pmrem: THREE.PMREMGenerator | null = null;
  private envTex: THREE.Texture | null = null;
  private webglBroken = false;
  private slots = new Map<number, InternalSlot>();
  private nextId = 1;
  private raf = 0;
  private lastTime = 0;
  private docHidden = typeof document !== 'undefined' ? document.hidden : false;
  private theme: ThemeMode = 'dark';

  constructor() {
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', this.onVisChange);
    }
  }

  private onVisChange = () => {
    this.docHidden = document.hidden;
    if (!this.docHidden) {
      this.lastTime = performance.now();
      this.ensureLoop();
    }
  };

  private initRenderer(): boolean {
    if (this.webglBroken) return false;
    if (this.renderer) return true;
    try {
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        preserveDrawingBuffer: true,
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 0.96;
      const pmrem = new THREE.PMREMGenerator(renderer);
      const envSceneObj = createEnvScene();
      const envTex = pmrem.fromScene(envSceneObj, 0.04).texture;
      disposeObjectTree(envSceneObj);
      this.renderer = renderer;
      this.pmrem = pmrem;
      this.envTex = envTex;
      return true;
    } catch {
      this.webglBroken = true;
      return false;
    }
  }

  private isReducedMotion(): boolean {
    return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  private applyThemeToSlot(slot: InternalSlot, theme: ThemeMode) {
    if (theme === 'dark') {
      slot.scene.environmentIntensity = 0.78;
      slot.keyLight.color.setHex(0xfff0dc);
      slot.keyLight.intensity = 2.05;
      slot.rimLight.color.setHex(0x6f8dbf);
      slot.rimLight.intensity = 0.75;
    } else {
      slot.scene.environmentIntensity = 1.04;
      slot.keyLight.color.setHex(0xfffaf0);
      slot.keyLight.intensity = 2.25;
      slot.rimLight.color.setHex(0xc9a86a);
      slot.rimLight.intensity = 0.9;
    }
    slot.dirtyStatic = true;
  }

  private updateCamera(slot: InternalSlot) {
    slot.cam.aspect = Math.max(0.1, slot.w / Math.max(1, slot.h));
    const half = Math.tan((slot.cam.fov * Math.PI) / 360);
    const distScale = slot.sizeVariant === 'modal' ? 1.85 : slot.h < 150 ? 1.8 : 2.05;
    slot.cam.position.z = distScale / half;
    slot.cam.updateProjectionMatrix();
  }

  private renderSlot(slot: InternalSlot, now: number, dt: number, reduced: boolean) {
    if (!this.renderer) return;
    if (slot.start === null) slot.start = now;

    const targetHover = slot.hv || slot.active ? 1 : 0;
    if (reduced) {
      slot.hoverVal = targetHover;
    } else {
      slot.hoverVal += (targetHover - slot.hoverVal) * Math.min(1, dt * 6);
    }

    const t = now / 1000;
    const it = (now - slot.start) / 1000;
    const intro = reduced ? 1 : easeOut(clamp(it / 1.2));
    const hover = slot.hoverVal;

    slot.root.rotation.set(
      -1.0 + slot.ptrY * 0.12 - hover * 0.12,
      -0.12 + slot.ptrX * 0.25,
      -0.55 + (reduced ? 0 : Math.sin(t * 0.7) * 0.1) + hover * 0.25 + (1 - intro) * 1.15
    );
    slot.root.position.y = -0.05 + (reduced ? 0 : Math.sin(t * 1.2) * 0.05) + (1 - intro) * 1.15;
    slot.root.scale.setScalar(0.75 + 0.25 * intro + hover * 0.05);

    if (slot.ud.board && slot.ud.tm) {
      const pl = hover * 0.5;
      if (Math.abs(pl - (slot.ud.lastPeel ?? 0)) > 0.01) {
        updatePeelGeometry(slot.ud.tm.geometry, pl);
        slot.ud.lastPeel = pl;
      }
      if (slot.ud.tp) slot.ud.tp.rotation.z = hover * 0.12;
    } else {
      const pivots = slot.ud.pivots;
      const n = pivots.length;
      pivots.forEach((pv, i) => {
        const k = n > 1 ? i / (n - 1) : 0;
        const d = clamp((it - 0.15 - k * 0.5) / 0.5);
        const drop = reduced ? 0 : (1 - easeOut(d)) * 1.4;
        pv.position.z = i * slot.ud.th + drop + hover * k * k * (slot.ud.tissue ? 0.5 : 0.55);
        pv.rotation.z = hover * (i - n / 2) * 0.045 * (1 + k);
      });
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const pw = Math.max(1, Math.round(slot.w * dpr));
    const ph = Math.max(1, Math.round(slot.h * dpr));

    if (slot.canvas.width !== pw || slot.canvas.height !== ph) {
      slot.canvas.width = pw;
      slot.canvas.height = ph;
    }

    this.renderer.setPixelRatio(1);
    this.renderer.setSize(pw, ph, false);
    this.renderer.render(slot.scene, slot.cam);

    slot.ctx2d.clearRect(0, 0, pw, ph);
    slot.ctx2d.drawImage(this.renderer.domElement, 0, 0, pw, ph);
    slot.dirtyStatic = false;
  }

  private tick = (now: number) => {
    this.raf = 0;
    if (this.docHidden) return;

    const dt = Math.min(0.05, Math.max(0.001, (now - this.lastTime) / 1000));
    this.lastTime = now;
    const reduced = this.isReducedMotion();
    let hasAnimatedVisible = false;

    this.slots.forEach((slot) => {
      if (!slot.visible) return;
      if (!reduced) {
        hasAnimatedVisible = true;
        this.renderSlot(slot, now, dt, false);
      } else if (slot.dirtyStatic) {
        this.renderSlot(slot, now, dt, true);
      }
    });

    if (hasAnimatedVisible) {
      this.raf = window.requestAnimationFrame(this.tick);
    }
  };

  private ensureLoop() {
    if (this.raf || this.docHidden || this.slots.size === 0) return;
    this.lastTime = performance.now();
    this.raf = window.requestAnimationFrame(this.tick);
  }

  public mountSlot(config: PaperSlotConfig): PaperSlotHandle | null {
    if (!this.initRenderer()) {
      config.onFallback();
      return null;
    }
    const ctx2d = config.canvas.getContext('2d');
    if (!ctx2d) {
      config.onFallback();
      return null;
    }

    const scene = new THREE.Scene();
    scene.environment = this.envTex;
    const keyLight = new THREE.DirectionalLight(0xfff0dc, 2.05);
    keyLight.position.set(-3, 4, 5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x6f8dbf, 0.75);
    rimLight.position.set(4, -2, -3);
    scene.add(rimLight);

    const cam = new THREE.PerspectiveCamera(28, 1, 0.1, 50);
    cam.position.set(0, 0, 9);

    const { group: paper, ud } = buildPaper(config.type);
    const root = new THREE.Group();
    root.add(paper);
    scene.add(root);

    const id = this.nextId++;
    const slot: InternalSlot = {
      id,
      canvas: config.canvas,
      ctx2d,
      scene,
      cam,
      root,
      ud,
      keyLight,
      rimLight,
      w: 300,
      h: 176,
      sizeVariant: config.sizeVariant,
      visible: false,
      hv: false,
      active: false,
      hoverVal: 0,
      ptrX: 0,
      ptrY: 0,
      start: null,
      dirtyStatic: true,
    };

    this.applyThemeToSlot(slot, this.theme);
    this.updateCamera(slot);
    this.slots.set(id, slot);
    this.ensureLoop();

    return {
      setVisible: (v: boolean) => {
        slot.visible = v;
        if (v) {
          if (slot.start === null) slot.start = performance.now();
          slot.dirtyStatic = true;
          this.ensureLoop();
        }
      },
      setHover: (v: boolean) => {
        slot.hv = v;
        slot.dirtyStatic = true;
        if (this.isReducedMotion() && slot.visible) this.ensureLoop();
      },
      setActive: (v: boolean) => {
        slot.active = v;
        slot.dirtyStatic = true;
        if (slot.visible) this.ensureLoop();
      },
      setPointer: (nx: number, ny: number) => {
        slot.ptrX = clamp(nx, -1, 1);
        slot.ptrY = clamp(ny, -1, 1);
      },
      setSize: (w: number, h: number) => {
        slot.w = Math.max(60, w);
        slot.h = Math.max(60, h);
        this.updateCamera(slot);
        slot.dirtyStatic = true;
        if (slot.visible) this.ensureLoop();
      },
      setTheme: (nextTheme: ThemeMode) => {
        this.theme = nextTheme;
        this.applyThemeToSlot(slot, nextTheme);
        if (slot.visible) this.ensureLoop();
      },
      dispose: () => {
        this.slots.delete(id);
        disposeObjectTree(slot.scene);
        if (this.slots.size === 0 && this.raf) {
          window.cancelAnimationFrame(this.raf);
          this.raf = 0;
        }
      },
    };
  }
}

export const paperStageEngine = new PaperStageEngine();
