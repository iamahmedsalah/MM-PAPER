import * as THREE from 'three';
import type { ThemeMode } from '../../theme/ThemeContext';

const W = 1.8;
const H = 2.3;

interface PaperSpec {
  n: number;
  th: number;
  map?: () => THREE.Texture;
  mapKind?: 'coated' | 'news' | 'copy';
  core?: number;
  rough?: number;
  bump?: number;
  clear?: number;
  curl?: number;
  tissue?: boolean;
  opacity?: number;
  tint?: number;
}

interface MultiSpec {
  n: number;
  th: number;
  fan: number;
  lift: number;
  peel?: boolean;
  stagger?: number;
}

interface PaperUserData {
  pivots: THREE.Group[];
  th: number;
  tissue: boolean;
  fan?: number;
  lift?: number;
  stagger?: number;
  board?: boolean;
  tp?: THREE.Group;
  peelMesh?: THREE.Mesh;
  peelMax?: number;
  baseCurl?: number;
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

/** Mutates vertex Z positions in-place so hover corner peels allocate zero geometry per frame. */
function updatePeelGeometry(geo: THREE.BufferGeometry, peel: number, baseCurl = 0) {
  const p = geo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i);
    const y = p.getY(i);
    const u = x / W + 0.5;
    const v = y / H + 0.5;
    let z = baseCurl ? baseCurl * Math.pow(u, 2.2) : 0;
    if (peel > 0.0001) {
      z += peel * Math.pow(Math.max(0, u + v - 1.05), 2) * 3;
    }
    p.setZ(i, z);
  }
  p.needsUpdate = true;
  geo.computeVertexNormals();
}

function roundRect(x: CanvasRenderingContext2D, a: number, b: number, w: number, h: number, r: number) {
  x.beginPath();
  x.moveTo(a + r, b);
  x.arcTo(a + w, b, a + w, b + h, r);
  x.arcTo(a + w, b + h, a, b + h, r);
  x.arcTo(a, b + h, a, b, r);
  x.arcTo(a, b, a + w, b, r);
  x.closePath();
}

function stickerMap() {
  return canvasTex(256, (x, s) => {
    const rnd = createRng(103);
    x.fillStyle = '#e4e6e2';
    x.fillRect(0, 0, s, s);
    const cols = 2;
    const rows = 4;
    const m = 12;
    const gw = (s - m * 2) / cols;
    const gh = (s - m * 2) / rows;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const a = m + c * gw + 4;
        const b = m + r * gh + 4;
        const w = gw - 8;
        const h = gh - 8;
        const k = (r * cols + c) % 4;
        roundRect(x, a, b, w, h, 7);
        x.fillStyle = '#f3f3ef';
        x.fill();
        x.strokeStyle = 'rgba(110,125,150,.6)';
        x.lineWidth = 1.2;
        x.stroke();
        if (k === 0) {
          for (let i = 0; i < 34; i++) {
            x.fillStyle = '#1a1f2e';
            const bw = 1 + (rnd() > 0.6 ? 2 : 0);
            x.fillRect(a + 10 + i * 2.8, b + 8, bw, h - 22);
          }
          x.fillRect(a + 10, b + h - 11, w - 20, 2);
        } else if (k === 1) {
          x.fillStyle = '#C9A86A';
          x.beginPath();
          x.arc(a + 20, b + h / 2, 11, 0, 6.28);
          x.fill();
          x.fillStyle = '#193051';
          x.fillRect(a + 38, b + h / 2 - 9, w - 52, 5);
          x.fillRect(a + 38, b + h / 2 + 2, w - 70, 4);
        } else if (k === 2) {
          x.fillStyle = '#193051';
          x.fillRect(a + 10, b + 9, w - 20, 7);
          x.fillStyle = 'rgba(25,48,81,.45)';
          for (let i = 0; i < 3; i++) x.fillRect(a + 10, b + 22 + i * 7, w - 20 - i * 14, 3);
        } else {
          x.fillStyle = '#e8467c';
          roundRect(x, a + 8, b + 8, w - 16, h - 16, 5);
          x.fill();
          x.fillStyle = '#ffffff';
          x.fillRect(a + 16, b + h / 2 - 3, w - 32, 6);
        }
      }
    }
  });
}

function formMap() {
  return canvasTex(256, (x, s) => {
    const rnd = createRng(109);
    x.fillStyle = '#e9e6d8';
    x.fillRect(0, 0, s, s);
    x.fillStyle = '#193051';
    x.fillRect(14, 14, s - 28, 22);
    x.fillStyle = '#C9A86A';
    x.fillRect(20, 21, 60, 8);
    x.strokeStyle = 'rgba(25,48,81,.35)';
    x.lineWidth = 1;
    for (let i = 0; i < 12; i++) {
      x.beginPath();
      x.moveTo(14, 56 + i * 15);
      x.lineTo(s - 14, 56 + i * 15);
      x.stroke();
    }
    x.beginPath();
    x.moveTo(150, 46);
    x.lineTo(150, 236);
    x.stroke();
    x.strokeStyle = '#1d4fd8';
    x.lineWidth = 1.6;
    x.lineCap = 'round';
    for (let r = 0; r < 9; r++) {
      x.beginPath();
      let px = 20 + rnd() * 6;
      const py = 66 + r * 15;
      x.moveTo(px, py);
      const len = 3 + ((rnd() * 7) | 0);
      for (let i = 0; i < len; i++) {
        px += 6 + rnd() * 8;
        x.quadraticCurveTo(px - 4, py - 6 - rnd() * 4, px, py + (rnd() - 0.5) * 4);
      }
      x.stroke();
    }
  });
}

function butterMap() {
  return canvasTex(256, (x, s) => {
    const rnd = createRng(113);
    x.fillStyle = '#d2b377';
    x.fillRect(0, 0, s, s);
    for (let i = 0; i < 70; i++) {
      x.strokeStyle = `rgba(190,160,100,${0.06 + rnd() * 0.1})`;
      x.lineWidth = 1.2;
      const y = rnd() * s;
      x.beginPath();
      x.moveTo(0, y);
      x.bezierCurveTo(s * 0.3, y + 8, s * 0.6, y - 8, s, y + 3);
      x.stroke();
    }
    for (let i = 0; i < 9; i++) {
      const g = x.createRadialGradient(0, 0, 0, 0, 0, 14 + rnd() * 18);
      g.addColorStop(0, 'rgba(120,80,30,.45)');
      g.addColorStop(1, 'rgba(176,132,60,0)');
      x.save();
      x.translate(rnd() * s, rnd() * s);
      x.fillStyle = g;
      x.fillRect(-40, -40, 80, 80);
      x.restore();
    }
  });
}

function copyReamMap() {
  return canvasTex(256, (x, s) => {
    const rnd = createRng(127);
    x.fillStyle = '#fbfbf9';
    x.fillRect(0, 0, s, s);
    for (let i = 0; i < 1800; i++) {
      x.fillStyle = 'rgba(25,48,81,.025)';
      x.fillRect(rnd() * s, rnd() * s, 2, 1);
    }
    x.strokeStyle = 'rgba(25,48,81,.12)';
    x.lineWidth = 1.5;
    x.strokeRect(18, 18, s - 36, s - 36);
    x.fillStyle = '#193051';
    x.fillRect(28, 30, 56, 18);
    x.fillStyle = '#C9A86A';
    x.fillRect(28, 52, 92, 3);
    x.fillStyle = 'rgba(25,48,81,.22)';
    for (let i = 0; i < 6; i++) {
      x.fillRect(28, 70 + i * 14, s - 72 - (i % 3) * 26, 4);
    }
  });
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

const MULTI: Record<string, MultiSpec> = {
  sticker: { n: 9, th: 0.04, fan: 0.012, lift: 0.12, peel: true },
  parchment: { n: 8, th: 0.045, fan: 0.1, lift: 0.3 },
  carbon: { n: 7, th: 0.05, fan: 0.03, lift: 0.2, stagger: 0.24 },
};

const PASTEL = ['#e8c43c', '#6fb0e0', '#ea7aa2', '#86c96f'] as const;

function multiSheetStyle(type: string, i: number): { color: string; rough: number; sheen: number } {
  if (type === 'parchment') return { color: PASTEL[i % 4], rough: 0.85, sheen: 0.3 };
  if (type === 'sticker') return { color: '#9cbfdc', rough: 0.35, sheen: 0.3 };
  const seq = ['#86c96f', 'C', '#e8c43c', 'C', '#ea7aa2', 'C', '#ece8da'] as const;
  const c = seq[i % seq.length];
  return c === 'C'
    ? { color: '#0b1124', rough: 0.5, sheen: 0.05 }
    : { color: c, rough: 0.8, sheen: 0.3 };
}

function buildMulti(type: string): { group: THREE.Group; ud: PaperUserData } {
  const g = new THREE.Group();
  const sp = MULTI[type];
  const pivots: THREE.Group[] = [];
  const bump = bumpTex(3000, 8);
  let peelMesh: THREE.Mesh | undefined;

  for (let i = 0; i < sp.n; i++) {
    const pv = new THREE.Group();
    pv.position.set(-W / 2, -H / 2, i * sp.th);
    const last = i === sp.n - 1;
    const d = multiSheetStyle(type, i);

    if (!(last && type === 'sticker')) {
      const mat = new THREE.MeshPhysicalMaterial({
        color: d.color,
        roughness: d.rough,
        metalness: 0,
        sheen: d.sheen,
        sheenColor: new THREE.Color(0xffffff),
        clearcoat: type === 'sticker' ? 0.6 : 0,
        bumpMap: type === 'parchment' ? bump : null,
        bumpScale: 0.3,
      });
      const box = new THREE.Mesh(new THREE.BoxGeometry(W, H, sp.th * 0.88), mat);
      box.position.set(W / 2, H / 2, 0);
      pv.add(box);
    }

    if (last) {
      const map =
        type === 'sticker'
          ? stickerMap()
          : type === 'carbon'
            ? formMap()
            : canvasTex(256, grainDraw(PASTEL[i % 4], ['#00000010', '#ffffff30'], 3500, 9), 1.5);
      const baseCurl = type === 'parchment' ? 0.07 : 0.05;
      const tm = new THREE.Mesh(
        sheetGeo(W, H, { curl: baseCurl }),
        new THREE.MeshPhysicalMaterial({
          map,
          roughness: type === 'sticker' ? 0.25 : 0.7,
          clearcoat: type === 'sticker' ? 1 : 0,
          clearcoatRoughness: 0.1,
          side: THREE.DoubleSide,
          sheen: 0.3,
          sheenColor: new THREE.Color(0xffffff),
          bumpMap: type === 'parchment' ? bump : null,
          bumpScale: 0.3,
        })
      );
      tm.position.set(W / 2, H / 2, type === 'sticker' ? -sp.th * 0.3 : sp.th * 0.46);
      pv.add(tm);
      if (sp.peel) {
        peelMesh = tm;
      }
    }

    g.add(pv);
    pivots.push(pv);
  }

  return {
    group: g,
    ud: {
      pivots,
      th: sp.th,
      tissue: false,
      fan: sp.fan,
      lift: sp.lift,
      stagger: sp.stagger ?? 0,
      peelMesh,
      peelMax: sp.peel ? 1.1 : 0,
      baseCurl: sp.peel ? 0.05 : 0,
      lastPeel: 0,
    },
  };
}

function buildDuplex(backKind: 'grey' | 'white'): { group: THREE.Group; ud: PaperUserData } {
  const g = new THREE.Group();
  const pivots: THREE.Group[] = [];
  const count = 6;
  const th = 0.065;
  const bump = bumpTex(3500, 8);
  const topFace = canvasTex(
    256,
    grainDraw(backKind === 'white' ? '#ffffff' : '#f4f2ec', ['#eae7df', '#ffffff'], 2600, 7),
    1.5
  );
  const backFace = canvasTex(
    256,
    grainDraw(
      backKind === 'white' ? '#f6f7f9' : '#7b7e83',
      backKind === 'white' ? ['#e6e8ec', '#ffffff'] : ['#66696e', '#92969c'],
      3200,
      8
    ),
    1.5
  );

  for (let i = 0; i < count; i++) {
    const pv = new THREE.Group();
    pv.position.set(-W / 2, -H / 2, i * th);
    const isTop = i === count - 1;
    const isBack = i < 2;

    const slabMat = new THREE.MeshPhysicalMaterial({
      color: isBack
        ? backKind === 'white'
          ? 0xedeff3
          : 0x7b7e83
        : isTop
          ? 0xfdfcf9
          : backKind === 'white'
            ? 0xe8eaef
            : 0x9c9fa5,
      map: isTop ? topFace : isBack ? backFace : null,
      roughness: isTop ? (backKind === 'white' ? 0.28 : 0.42) : 0.85,
      clearcoat: isTop ? (backKind === 'white' ? 0.65 : 0.3) : 0,
      clearcoatRoughness: 0.14,
      bumpMap: bump,
      bumpScale: isTop ? 0.16 : 0.35,
    });

    const sheet = new THREE.Mesh(new THREE.BoxGeometry(W, H, th * 0.86), slabMat);
    sheet.position.set(W / 2, H / 2, 0);
    pv.add(sheet);
    g.add(pv);
    pivots.push(pv);
  }

  return {
    group: g,
    ud: {
      pivots,
      th,
      tissue: false,
      fan: 0.06,
      lift: 0.32,
      stagger: 0.1,
    },
  };
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
  copy: {
    n: 14,
    th: 0.036,
    mapKind: 'copy',
    core: 0xebe9e3,
    rough: 0.72,
    bump: 0.22,
    curl: 0.04,
  },
  bristol: {
    n: 7,
    th: 0.068,
    map: () => canvasTex(256, grainDraw('#f3eee1', ['#e6dfc9', '#fbf8f0'], 2800, 7), 1.5),
    core: 0xdad2be,
    rough: 0.72,
    bump: 0.28,
    curl: 0.03,
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
  butter: {
    n: 6,
    th: 0.075,
    map: butterMap,
    tissue: true,
    opacity: 0.86,
    tint: 0xb8955a,
    rough: 0.28,
    clear: 0.7,
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
      peelMesh: tm,
      peelMax: 0.5,
      baseCurl: 0,
      lastPeel: 0,
    },
  };
}

function buildPaper(type: string): { group: THREE.Group; ud: PaperUserData } {
  if (MULTI[type]) return buildMulti(type);
  if (type === 'duplex-grey') return buildDuplex('grey');
  if (type === 'duplex-white') return buildDuplex('white');
  if (type === 'cardboard') return buildBoard();

  const g = new THREE.Group();
  const sp = SPECS[type] ?? SPECS.offset;
  const pivots: THREE.Group[] = [];
  const map =
    sp.mapKind === 'coated'
      ? coatedMap()
      : sp.mapKind === 'news'
        ? newsMap()
        : sp.mapKind === 'copy'
          ? copyReamMap()
          : sp.map!();
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
    opacity: sp.tissue ? (sp.opacity ?? 0.88) : 1,
  });
  if (sp.tint) top.color.setHex(sp.tint);

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
  } else if (sp.mapKind === 'copy') {
    plain.map = canvasTex(64, (x, s) => {
      x.fillStyle = '#f8f7f3';
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

    if (slot.ud.peelMesh && (slot.ud.peelMax ?? 0) > 0) {
      const pl = hover * (slot.ud.peelMax ?? 0.5);
      if (Math.abs(pl - (slot.ud.lastPeel ?? 0)) > 0.01) {
        updatePeelGeometry(slot.ud.peelMesh.geometry, pl, slot.ud.baseCurl ?? 0);
        slot.ud.lastPeel = pl;
      }
      if (slot.ud.board && slot.ud.tp) slot.ud.tp.rotation.z = hover * 0.12;
    }

    if (!slot.ud.board) {
      const pivots = slot.ud.pivots;
      const n = pivots.length;
      const fanStep = slot.ud.fan ?? 0.045;
      const liftStep = slot.ud.lift ?? (slot.ud.tissue ? 0.5 : 0.55);
      const stagger = slot.ud.stagger ?? 0;

      pivots.forEach((pv, i) => {
        const k = n > 1 ? i / (n - 1) : 0;
        const d = clamp((it - 0.15 - k * 0.5) / 0.5);
        const drop = reduced ? 0 : (1 - easeOut(d)) * 1.4;
        pv.position.z = i * slot.ud.th + drop + hover * k * k * liftStep;
        pv.rotation.z = hover * (i - n / 2) * fanStep * (1 + k);
        if (stagger) {
          pv.position.x = -W / 2 + hover * (i - n / 2) * stagger;
          pv.position.y = -H / 2 + hover * (i - n / 2) * stagger * 0.55;
        }
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
