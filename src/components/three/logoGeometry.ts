import * as THREE from 'three';
const W = 3.2, H = 4, T = 0.8, YV = 0.9, G = 1.1, H1 = 2.9, GAP = 0.03, D = 0.7;
export const M_W = W, M_H = H, M_GAP = 0.8;

function rng(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const easeOut = (p: number) => 1 - Math.pow(1 - p, 3);
const easeIO = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
const backOut = (p: number) => {
  const c1 = 1.4, c3 = c1 + 1;
  return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2);
};

function stripPolys(): [number, number][][] {
  const hw = W / 2, g = GAP;
  const legL: [number, number][] = [[0, 0], [T, 0], [T, H], [0, H]];
  const diagL: [number, number][] = [[T + g, H1], [hw - g / 2, YV], [hw - g / 2, YV + G], [T + g, H]];
  const mir = (p: [number, number][]) => p.map(([x, y]) => [W - x, y] as [number, number]).reverse();
  return [legL, diagL, mir(diagL), mir(legL)];
}

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
    const px = r() * 256, py = r() * 256, a = r() * 6.28, l = 4 + r() * 12;
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

export function buildLogoRoot(goldHex: number, tintHex: number) {
  const root = new THREE.Group();
  const grain = createPaperGrainTexture(2);
  const mats = [goldHex, tintHex].map(
    (hex) =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(hex),
        roughness: 0.55,
        metalness: 0,
        bumpMap: grain,
        bumpScale: 0.6,
        sheen: 1,
        sheenRoughness: 0.5,
        sheenColor: new THREE.Color(0xffffff),
        clearcoat: 0.15,
        clearcoatRoughness: 0.6,
      })
  );

  const letters: THREE.Group[] = [];
  const pieces: StripPiece[] = [];
  const r = rng(11);
  const polys = stripPolys();
  const bev = 0.05;

  [0, 1].forEach((li) => {
    const grp = new THREE.Group();
    grp.position.x = (li ? 1 : -1) * (W + M_GAP) / 2;
    root.add(grp);
    letters.push(grp);
    polys.forEach((poly, k) => {
      const s = new THREE.Shape(poly.map(([px, py]) => new THREE.Vector2(px - W / 2, py - H / 2)));
      const geo = new THREE.ExtrudeGeometry(s, {
        depth: D,
        bevelEnabled: true,
        bevelSize: bev,
        bevelOffset: -bev,
        bevelThickness: 0.07,
        bevelSegments: 3,
        curveSegments: 1,
      });
      geo.translate(0, 0, -D / 2);
      geo.computeBoundingBox();
      const ctr = new THREE.Vector3();
      geo.boundingBox!.getCenter(ctr);
      ctr.z = 0;
      geo.translate(-ctr.x, -ctr.y, 0);
      const m = new THREE.Mesh(geo, mats[li]);
      m.position.copy(ctr);
      grp.add(m);
      pieces.push({
        mesh: m,
        home: ctr.clone(),
        fromPos: new THREE.Vector3((r() - 0.5) * 16, 6 + r() * 6, 3 + r() * 6),
        fromQuat: new THREE.Quaternion().setFromEuler(
          new THREE.Euler((r() - 0.5) * 7, (r() - 0.5) * 7, (r() - 0.5) * 9)
        ),
        flutter: r() * 6.28,
        delay: (li * 4 + k) * 0.11 + li * 0.15,
      });
    });
  });

  return { root, letters, pieces, mats };
}

export const INTRO_DUR = 1.5;
export const INTRO_TOTAL = 3.2;
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
