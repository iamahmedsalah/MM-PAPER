'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import BrandLogo from '../ui/BrandLogo';
import { useTheme, type ThemeMode } from '../../theme/ThemeContext';
import {
  applyIntro,
  buildLogoRoot,
  clamp01,
  createFloatingSheetGeometries,
  createPaperGrainTexture,
  createSheetData,
  easeIO,
  INTRO_TOTAL,
  LOGO_WIDTH,
} from './logoGeometry';

interface SheetFinish {
  color: number;
  opacity: number;
}

interface ThemePalette {
  logoColor: number;
  emissiveColor: number;
  emissiveIntensity: number;
  sheenColor: number;
  sheen: number;
  clearcoat: number;
  roughness: number;
  envMapIntensity: number;
  specularIntensity: number;
  bumpScale: number;
  sheets: readonly [SheetFinish, SheetFinish, SheetFinish];
  envIntensity: number;
  ambient: number;
  key: number;
  rimIntensity: number;
  orbColor: number;
  orbIntensity: number;
}

const HERO_PALETTES: Record<ThemeMode, ThemePalette> = {
  dark: {
    logoColor: 0xf1e8d4,
    emissiveColor: 0x000000,
    emissiveIntensity: 0,
    sheenColor: 0xffe9b8,
    sheen: 0.28,
    clearcoat: 0.15,
    roughness: 0.48,
    envMapIntensity: 1,
    specularIntensity: 1,
    bumpScale: 0.45,
    sheets: [
      { color: 0xefe9da, opacity: 0.78 },
      { color: 0xc9a86a, opacity: 0.62 },
      { color: 0x466694, opacity: 0.58 },
    ],
    envIntensity: 0.6,
    ambient: 0.32,
    key: 1.5,
    rimIntensity: 0.9,
    orbColor: 0xffe2b0,
    orbIntensity: 36,
  },
  light: {
    logoColor: 0x152946,
    emissiveColor: 0x000000,
    emissiveIntensity: 0,
    sheenColor: 0x000000,
    sheen: 0,
    clearcoat: 0,
    roughness: 0.92,
    envMapIntensity: 0,
    specularIntensity: 0,
    bumpScale: 0.14,
    sheets: [
      { color: 0xfffdf8, opacity: 0.88 },
      { color: 0xc9a86a, opacity: 0.58 },
      { color: 0x193051, opacity: 0.44 },
    ],
    envIntensity: 0.55,
    ambient: 0.68,
    key: 1.45,
    rimIntensity: 0.3,
    orbColor: 0x193051,
    orbIntensity: 0,
  },
};

function shouldUseFallback(): boolean {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lowEnd = (navigator.hardwareConcurrency ?? 8) <= 2;
  return reduced || lowEnd;
}

export default function Hero3D({ scrollRef }: { scrollRef: React.RefObject<number> }) {
  const { theme } = useTheme();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [fallback, setFallback] = useState(false);
  const [reduced, setReduced] = useState(false);
  const themeSyncRef = useRef<((next: ThemeMode) => void) | null>(null);
  const latestThemeRef = useRef<ThemeMode>(theme);
  latestThemeRef.current = theme;

  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setReduced(isReduced);

    if (shouldUseFallback()) {
      setFallback(true);
      return;
    }

    const wrap = wrapRef.current;
    if (!wrap) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setFallback(true);
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.92;
    renderer.domElement.style.cssText =
      'position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none';
    wrap.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envRoom = new RoomEnvironment();
    const envTex = pmrem.fromScene(envRoom, 0.04).texture;
    envRoom.dispose();
    scene.environment = envTex;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.32);
    const keyLight = new THREE.DirectionalLight(0xfff1dc, 1.5);
    keyLight.position.set(4, 7, 9);
    const rimLight = new THREE.DirectionalLight(0x9ab6ff, 0.9);
    rimLight.position.set(5, 3, -5);
    const orbLight = new THREE.PointLight(0xffe2b0, 36, 30);
    scene.add(ambientLight, keyLight, rimLight, orbLight);

    const initialPal = HERO_PALETTES[latestThemeRef.current];
    const { root, letters, pieces, mats } = buildLogoRoot(initialPal.logoColor, initialPal.sheenColor);
    scene.add(root);

    const sheetGeos = createFloatingSheetGeometries();
    const sheetGrainTex = createPaperGrainTexture(1.5);
    const sheetMats = initialPal.sheets.map(
      (finish) =>
        new THREE.MeshPhysicalMaterial({
          color: finish.color,
          roughness: 0.78,
          metalness: 0,
          bumpMap: sheetGrainTex,
          bumpScale: 0.22,
          sheen: 0.45,
          sheenRoughness: 0.65,
          sheenColor: new THREE.Color(0xffffff),
          side: THREE.DoubleSide,
          transparent: true,
          opacity: finish.opacity,
        })
    );
    const sheetData = createSheetData(18);
    const sheetsGroup = new THREE.Group();
    const sheetMeshes: THREE.Mesh[] = [];
    sheetData.forEach((d, i) => {
      const m = new THREE.Mesh(
        sheetGeos[i % sheetGeos.length],
        sheetMats[i % sheetMats.length]
      );
      m.scale.setScalar(d.scale);
      sheetsGroup.add(m);
      sheetMeshes.push(m);
    });
    scene.add(sheetsGroup);

    const applyTheme = (mode: ThemeMode) => {
      const pal = HERO_PALETTES[mode];
      mats.forEach((mat) => {
        mat.color.setHex(pal.logoColor);
        mat.emissive.setHex(pal.emissiveColor);
        mat.emissiveIntensity = pal.emissiveIntensity;
        mat.sheenColor.setHex(pal.sheenColor);
        mat.sheen = pal.sheen;
        mat.clearcoat = pal.clearcoat;
        mat.roughness = pal.roughness;
        mat.envMapIntensity = pal.envMapIntensity;
        mat.specularIntensity = pal.specularIntensity;
        mat.bumpScale = pal.bumpScale;
      });
      pal.sheets.forEach((finish, idx) => {
        if (sheetMats[idx]) {
          sheetMats[idx].color.setHex(finish.color);
          sheetMats[idx].opacity = finish.opacity;
        }
      });
      scene.environmentIntensity = pal.envIntensity;
      ambientLight.intensity = pal.ambient;
      keyLight.intensity = pal.key;
      rimLight.intensity = pal.rimIntensity;
      orbLight.color.setHex(pal.orbColor);
      orbLight.intensity = pal.orbIntensity;
    };
    applyTheme(latestThemeRef.current);
    themeSyncRef.current = applyTheme;

    const cam = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    let compactMode = false;

    const resize = () => {
      const w = wrap.clientWidth || window.innerWidth;
      const h = wrap.clientHeight || window.innerHeight;
      renderer.setSize(w, h, false);
      const aspect = Math.max(0.25, w / Math.max(1, h));
      cam.aspect = aspect;
      compactMode = aspect < 0.9;
      const halfTan = Math.tan((cam.fov * Math.PI) / 360);
      const need = (LOGO_WIDTH * (compactMode ? 2.15 : 1.35)) / 2;
      cam.position.z = Math.max(need / (halfTan * aspect), compactMode ? 14.5 : 12.5);
      cam.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const ptr = { x: 0, y: 0 };
    const onPointerMove = (e: PointerEvent) => {
      ptr.x = (e.clientX / Math.max(1, window.innerWidth)) * 2 - 1;
      ptr.y = (e.clientY / Math.max(1, window.innerHeight)) * 2 - 1;
    };
    if (finePointer) {
      window.addEventListener('pointermove', onPointerMove, { passive: true });
    }

    let visible = true;
    let docHidden = document.hidden;
    let raf = 0;
    let elapsed = 0;
    let introT = 0;
    let flipT = -1;
    let nextFlip = 7;
    let lastNow = performance.now();
    const tilt = { x: 0, y: 0 };

    const renderFrame = (now: number) => {
      raf = 0;
      if (!visible || docHidden) return;

      const dt = Math.min(0.05, Math.max(0.001, (now - lastNow) / 1000));
      lastNow = now;
      elapsed += dt;
      const t = elapsed;

      if (introT < INTRO_TOTAL + 0.2) {
        introT += dt;
        applyIntro(pieces, introT);
      } else {
        pieces.forEach((pc, i) => {
          pc.mesh.position.z = Math.sin(t * 1.4 + i * 0.8) * 0.09;
        });
      }

      const s = clamp01(scrollRef.current ?? 0);
      const camX = s * (compactMode ? 0.6 : 2.2 * window.innerWidth * 0.0016 + 0.9);
      const camY = -s * 0.6;
      cam.position.x += (camX - cam.position.x) * Math.min(1, dt * 3);
      cam.position.y += (camY - cam.position.y) * Math.min(1, dt * 3);

      const baseScale = compactMode ? 0.88 : 1;
      const baseY = compactMode ? 1.05 : 0;
      root.scale.setScalar(Math.max(0.32, baseScale * (1 - s * 0.45)));
      root.rotation.z = s * 0.5;
      root.position.x = s * (compactMode ? 0.2 : 0.4);
      root.position.y = baseY + s * 0.2;

      tilt.x += (-ptr.y * 0.25 - tilt.x) * Math.min(1, dt * 4);
      tilt.y += (ptr.x * 0.45 - tilt.y) * Math.min(1, dt * 4);

      if (flipT < 0 && introT > INTRO_TOTAL && t > nextFlip) {
        flipT = 0;
      }
      if (flipT >= 0) {
        flipT += dt;
        if (flipT > 2.2) {
          flipT = -1;
          nextFlip = t + 8;
        }
      }

      const introNorm = clamp01(introT / INTRO_TOTAL);
      letters.forEach((l, i) => {
        l.position.y = Math.sin(t * 1.1 + i * 1.3) * 0.12 * introNorm;
        let fy = 0;
        if (flipT >= 0) {
          const p = clamp01((flipT - i * 0.22) / 1.5);
          fy = easeIO(p) * Math.PI * 2;
          l.position.z = Math.sin(p * Math.PI) * 1.2;
        } else {
          l.position.z = 0;
        }
        l.rotation.set(tilt.x, tilt.y * (1 + i * 0.15) + fy, Math.sin(t * 0.7 + i) * 0.012);
      });

      sheetMeshes.forEach((child, i) => {
        const d = sheetData[i];
        const y = 8 - ((d.y0 + t * d.speed) % 16);
        child.position.set(d.x + Math.sin(t * 0.6 + d.axis) * 0.8, y, d.z);
        child.rotation.set(t * d.rotSpeed + d.axis, t * d.rotSpeed * 0.7, t * d.rotSpeed * 0.5);
      });

      orbLight.position.set(Math.sin(t * 0.8) * 7, Math.cos(t * 0.6) * 3 + 2, 5);
      renderer.render(scene, cam);

      raf = window.requestAnimationFrame(renderFrame);
    };

    const scheduleFrame = () => {
      if (!raf && visible && !docHidden) {
        lastNow = performance.now();
        raf = window.requestAnimationFrame(renderFrame);
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = Boolean(entry?.isIntersecting);
        if (visible) scheduleFrame();
      },
      { threshold: 0.02 }
    );
    io.observe(wrap);

    const onVisChange = () => {
      docHidden = document.hidden;
      if (!docHidden) scheduleFrame();
    };
    document.addEventListener('visibilitychange', onVisChange);

    scheduleFrame();

    return () => {
      themeSyncRef.current = null;
      if (raf) window.cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisChange);
      if (finePointer) window.removeEventListener('pointermove', onPointerMove);

      pieces.forEach((p) => p.mesh.geometry.dispose());
      mats.forEach((m) => {
        m.bumpMap?.dispose();
        m.dispose();
      });
      sheetGeos.forEach((g) => g.dispose());
      sheetGrainTex.dispose();
      sheetMats.forEach((m) => m.dispose());
      envTex.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [scrollRef]);

  useEffect(() => {
    themeSyncRef.current?.(theme);
  }, [theme]);

  if (fallback) {
    return (
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden>
        <BrandLogo
          decorative
          className={`w-[min(52vw,210px)] -translate-y-12 opacity-45 sm:w-[min(56vw,340px)] sm:translate-y-0 sm:opacity-80 ${
            reduced ? '' : 'animate-[float_6s_ease-in-out_infinite]'
          }`}
          width={340}
          height={136}
        />
        {!reduced && (
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {Array.from({ length: 8 }).map((_, i) => (
              <span
                key={i}
                className={`absolute block rounded-sm ${i % 2 === 0 ? 'bg-ink/10' : 'bg-gold/20'}`}
                style={{
                  left: `${((i * 37) % 88) + 4}%`,
                  width: 14 + ((i * 7) % 16),
                  height: 20 + ((i * 11) % 22),
                  animation: `float ${7 + (i % 4)}s ease-in-out ${i * 0.65}s infinite alternate`,
                  bottom: '-8%',
                }}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return <div ref={wrapRef} className="pointer-events-none absolute inset-0" aria-hidden />;
}
