import * as THREE from 'three';

export const LOGO_WIDTH = 7.2;

function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const easeOut = (p: number) => 1 - Math.pow(1 - p, 3);
const easeIO = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
const backOut = (p: number) => {
  const c1 = 1.4;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2);
};

// Traced serif M1 & M2 outer contours from public/mm-3d-logo/index.html (482 x 192 viewport).
const SERIF_M_RINGS: readonly (readonly [number, number][])[] = [
  [
    [211.67, 16.3], [210.33, 17.67], [203.19, 28.67], [145.31, 120.0], [144.5, 120.59], [143.83, 120.17],
    [127.12, 97.0], [72.67, 19.03], [71.33, 18.23], [69.0, 17.44], [62.83, 16.27], [10.0, 16.16],
    [8.71, 16.5], [11.5, 17.67], [16.17, 19.1], [22.83, 22.07], [29.7, 26.0], [35.0, 30.1],
    [39.78, 34.83], [42.81, 39.0], [44.19, 43.17], [44.72, 46.83], [44.57, 147.17], [43.69, 154.17],
    [41.84, 159.33], [39.76, 163.33], [37.67, 166.5], [34.83, 169.76], [31.67, 172.77], [29.0, 174.8],
    [24.08, 177.83], [18.59, 180.17], [18.44, 180.5], [18.67, 180.72], [70.33, 180.78], [71.35, 180.5],
    [71.17, 180.12], [66.82, 177.83], [63.89, 175.83], [61.33, 173.67], [58.09, 170.33], [55.96, 167.67],
    [53.07, 162.5], [50.83, 155.67], [50.13, 151.17], [50.07, 50.83], [50.36, 50.17], [51.17, 49.95],
    [51.86, 50.33], [63.78, 68.17], [79.74, 92.83], [100.82, 126.0], [122.78, 162.5], [126.0, 168.46],
    [126.5, 168.7], [131.67, 159.51], [148.0, 128.6], [160.06, 107.83], [200.0, 44.26], [200.83, 43.94],
    [201.5, 44.19], [201.77, 45.0], [201.5, 152.83], [200.98, 158.17], [199.92, 162.5], [198.85, 165.17],
    [197.7, 167.33], [195.64, 170.17], [192.33, 173.66], [188.5, 176.65], [184.67, 178.71], [180.98, 180.17],
    [180.75, 180.5], [180.98, 180.67], [251.0, 180.91], [251.0, 172.51], [250.08, 173.5], [249.17, 173.86],
    [248.17, 173.46], [244.93, 170.0], [242.88, 166.33], [241.54, 161.83], [241.04, 157.0], [241.41, 103.17],
    [241.4, 33.17], [241.81, 29.67], [242.83, 25.67], [243.59, 23.83], [244.33, 23.34], [245.17, 23.59],
    [247.3, 25.0], [250.7, 27.83], [251.0, 28.15], [251.0, 16.28],
  ],
  [
    [467.04, 180.17], [462.5, 177.93], [459.28, 175.83], [456.0, 172.96], [453.93, 170.17], [451.84, 166.5],
    [450.78, 163.33], [450.16, 157.0], [450.42, 149.17], [450.58, 34.33], [450.98, 31.5], [452.0, 28.23],
    [454.1, 24.17], [457.5, 20.22], [459.0, 18.98], [462.91, 16.67], [462.91, 16.33], [421.5, 16.21],
    [420.33, 16.5], [387.28, 69.0], [356.83, 119.38], [356.0, 119.82], [355.03, 119.33], [343.64, 101.5],
    [332.1, 84.33], [288.37, 16.5], [287.33, 16.27], [252.0, 16.28], [252.0, 29.2], [254.67, 32.02],
    [256.74, 34.67], [258.82, 38.17], [260.16, 42.33], [260.29, 44.67], [260.21, 150.5], [259.1, 157.33],
    [257.91, 161.33], [255.94, 166.0], [252.83, 170.53], [252.0, 171.43], [252.0, 180.91], [263.17, 180.95],
    [275.83, 180.7], [285.0, 180.85], [285.51, 180.67], [285.33, 180.06], [280.83, 177.86], [276.84, 174.83],
    [274.04, 172.33], [271.06, 168.67], [269.04, 165.33], [266.99, 160.67], [265.86, 156.17], [265.25, 152.17],
    [265.25, 62.5], [265.4, 49.17], [265.67, 48.52], [266.33, 48.5], [266.83, 48.96], [281.76, 73.67],
    [311.78, 125.17], [329.88, 157.0], [336.02, 168.5], [336.5, 168.88], [337.17, 168.33], [340.0, 162.67],
    [347.54, 149.33], [359.98, 126.33], [372.06, 105.33], [402.14, 55.5], [409.0, 44.48], [410.0, 43.92],
    [410.67, 44.13], [410.93, 44.83], [410.73, 151.83], [410.08, 158.17], [408.95, 163.0], [407.85, 165.5],
    [405.83, 168.86], [403.67, 171.48], [401.33, 173.8], [397.37, 176.83], [393.83, 178.75], [390.0, 180.17],
    [389.76, 180.5], [390.83, 180.85], [407.17, 180.69], [413.83, 180.93], [416.0, 180.68], [456.83, 180.65],
    [458.5, 180.88], [460.0, 180.67], [466.5, 180.75], [467.23, 180.5],
  ],
];

export function createPaperGrainTexture(repeat = 2): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const x = c.getContext('2d')!;
  x.fillStyle = '#808080';
  x.fillRect(0, 0, 256, 256);
  const r = rng(7);
  for (let i = 0; i < 9000; i++) {
    const v = (100 + r() * 60) | 0;
    x.fillStyle = `rgba(${v},${v},${v},.35)`;
    x.fillRect(r() * 256, r() * 256, 1 + r() * 2, 1);
  }
  for (let i = 0; i < 700; i++) {
    const v = r() > 0.5 ? 170 : 90;
    x.strokeStyle = `rgba(${v},${v},${v},.25)`;
    x.lineWidth = 0.6;
    x.beginPath();
    const px = r() * 256;
    const py = r() * 256;
    const a = r() * 6.28;
    const l = 4 + r() * 12;
    x.moveTo(px, py);
    x.lineTo(px + Math.cos(a) * l, py + Math.sin(a) * l);
    x.stroke();
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeat, repeat);
  return t;
}

export interface StripPiece {
  mesh: THREE.Mesh;
  home: THREE.Vector3;
  fromPos: THREE.Vector3;
  fromQuat: THREE.Quaternion;
  flutter: number;
  delay: number;
}

export function buildLogoRoot(logoHex: number, sheenHex: number) {
  const root = new THREE.Group();
  const grain = createPaperGrainTexture(3);
  const mat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(logoHex),
    roughness: 0.48,
    metalness: 0,
    bumpMap: grain,
    bumpScale: 0.45,
    sheen: 0.28,
    sheenRoughness: 0.65,
    sheenColor: new THREE.Color(sheenHex),
    clearcoat: 0.15,
    clearcoatRoughness: 0.5,
  });

  const allPts = SERIF_M_RINGS.flat();
  const allXs = allPts.map((p) => p[0]);
  const allYs = allPts.map((p) => p[1]);
  const xMin = Math.min(...allXs);
  const xMax = Math.max(...allXs);
  const xMid = (xMin + xMax) / 2;
  const yMid = (Math.min(...allYs) + Math.max(...allYs)) / 2;
  const scale = LOGO_WIDTH / (xMax - xMin);
  const depth = 34;
  const bev = 2.2;

  const letters: THREE.Group[] = [];
  const pieces: StripPiece[] = [];
  const r = rng(11);

  SERIF_M_RINGS.forEach((ring, li) => {
    const lxs = ring.map((p) => p[0]);
    const cx = (Math.min(...lxs) + Math.max(...lxs)) / 2;
    const grp = new THREE.Group();
    grp.position.set((cx - xMid) * scale, 0, 0);
    root.add(grp);
    letters.push(grp);

    const shape = new THREE.Shape(ring.map(([px, py]) => new THREE.Vector2(px - cx, yMid - py)));
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth,
      bevelEnabled: true,
      bevelSize: bev,
      bevelOffset: -bev,
      bevelThickness: 2.4,
      bevelSegments: 3,
      curveSegments: 2,
    });
    geo.translate(0, 0, -depth / 2);
    geo.scale(scale, scale, scale);

    const mesh = new THREE.Mesh(geo, mat);
    grp.add(mesh);

    const home = new THREE.Vector3(0, 0, 0);
    pieces.push({
      mesh,
      home,
      fromPos: new THREE.Vector3(li === 0 ? -6.2 : 6.2, 6 + r() * 4, 4 + r() * 4),
      fromQuat: new THREE.Quaternion().setFromEuler(
        new THREE.Euler((r() - 0.5) * 6, (r() - 0.5) * 6, (r() - 0.5) * 7)
      ),
      flutter: r() * 6.28,
      delay: li * 0.26,
    });
  });

  return { root, letters, pieces, mats: [mat] };
}

export const INTRO_DUR = 1.5;
export const INTRO_TOTAL = 2.2;
const qIdentity = new THREE.Quaternion();

export function pieceAt(pc: StripPiece, t: number) {
  const p = clamp01((t - pc.delay) / INTRO_DUR);
  const pos = pc.fromPos.clone().lerp(pc.home, easeOut(p));
  const fl = Math.sin(p * Math.PI * 3 + pc.flutter) * (1 - p) * 0.5;
  pos.x += fl;
  pos.y += Math.cos(p * Math.PI * 2 + pc.flutter) * (1 - p) * 0.25;
  const quat = pc.fromQuat.clone().slerp(qIdentity, easeIO(p));
  const sc = 0.2 + 0.8 * Math.min(1.08, Math.max(0, backOut(p)));
  return { pos, quat, sc };
}

export function applyIntro(pieces: StripPiece[], t: number) {
  pieces.forEach((pc) => {
    const s = pieceAt(pc, t);
    pc.mesh.position.copy(s.pos);
    pc.mesh.quaternion.copy(s.quat);
    pc.mesh.scale.setScalar(s.sc);
  });
}

export function settlePieces(pieces: StripPiece[]) {
  pieces.forEach((pc) => {
    pc.mesh.position.copy(pc.home);
    pc.mesh.quaternion.identity();
    pc.mesh.scale.setScalar(1);
  });
}

export interface SheetDatum {
  x: number;
  y0: number;
  z: number;
  speed: number;
  axis: number;
  rotSpeed: number;
  scale: number;
}

export function createSheetData(count = 18): SheetDatum[] {
  const sr = rng(5);
  return Array.from({ length: count }, () => ({
    x: (sr() - 0.5) * 20,
    y0: sr() * 14,
    z: -2 - sr() * 7,
    speed: 0.25 + sr() * 0.35,
    axis: sr() * 6,
    rotSpeed: 0.4 + sr() * 0.8,
    scale: 0.6 + sr() * 1.1,
  }));
}

type SheetShapeKind = 'flatNatural' | 'cornerFold' | 'letterFold' | 'sWaveCurl' | 'twistScoop';

/**
 * Generates 5 tactile background paper sheet geometries:
 * flat sheets with subtle edge bow plus folded, creased, curved, and twisted sheets.
 */
export function createFloatingSheetGeometries(): THREE.BufferGeometry[] {
  const w = 1.1;
  const h = 1.5;
  const kinds: SheetShapeKind[] = ['flatNatural', 'cornerFold', 'letterFold', 'sWaveCurl', 'twistScoop'];

  return kinds.map((kind) => {
    const geo = new THREE.PlaneGeometry(w, h, 14, 18);
    const pos = geo.attributes.position as THREE.BufferAttribute;

    for (let i = 0; i < pos.count; i++) {
      let x = pos.getX(i);
      let y = pos.getY(i);
      const u = x / w + 0.5;
      const v = y / h + 0.5;
      let z = 0;

      if (kind === 'flatNatural') {
        z = 0.025 * Math.sin(u * Math.PI);
      } else if (kind === 'cornerFold') {
        const d = u + v - 1.26;
        if (d > 0) {
          z = d * 0.68 + d * d * 0.35;
          x -= d * 0.22;
          y -= d * 0.22;
        }
        z += 0.03 * Math.sin(u * Math.PI);
      } else if (kind === 'letterFold') {
        const crease = v * 0.88 + u * 0.22 - 0.56;
        const absC = Math.abs(crease);
        z = 0.28 * Math.sqrt(absC * absC + 0.004) - 0.08;
        y -= Math.max(0, crease) * 0.14;
      } else if (kind === 'sWaveCurl') {
        z = 0.17 * Math.sin((v - 0.5) * Math.PI * 1.6) + 0.08 * Math.cos((u - 0.5) * Math.PI * 1.4);
      } else {
        z = 0.22 * (u - 0.5) * (v - 0.5) * 4 + 0.1 * Math.pow(u - 0.5, 2) * 4;
      }

      pos.setXYZ(i, x, y, z);
    }

    pos.needsUpdate = true;
    geo.computeVertexNormals();
    return geo;
  });
}

export { easeIO };
