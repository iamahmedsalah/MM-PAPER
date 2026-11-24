'use client';

import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';

export type BackdropVariant = 'services' | 'catalog' | 'leadership' | 'location' | 'contact';

interface SheetLayout {
  primaryClass: string;
  secondaryClass: string;
  accentClass: string;
  glowClass: string;
  tiltDir: 1 | -1;
}

const VARIANT_LAYOUTS: Record<BackdropVariant, SheetLayout> = {
  services: {
    primaryClass: '-top-8 -end-16 h-64 w-52 sm:h-80 sm:w-64 md:-end-8',
    secondaryClass: 'bottom-6 -start-16 h-56 w-44 sm:h-72 sm:w-56 md:-start-8',
    accentClass: 'top-1/2 end-[12%] hidden h-28 w-24 lg:block',
    glowClass: 'top-12 end-0 h-[360px] w-[360px]',
    tiltDir: 1,
  },
  catalog: {
    primaryClass: 'top-10 -start-16 h-64 w-52 sm:h-80 sm:w-64 md:-start-6',
    secondaryClass: 'bottom-12 -end-16 h-60 w-48 sm:h-76 sm:w-60 md:-end-6',
    accentClass: 'top-24 end-[16%] hidden h-32 w-24 lg:block',
    glowClass: 'bottom-10 start-0 h-[420px] w-[420px]',
    tiltDir: -1,
  },
  leadership: {
    primaryClass: '-top-6 -end-14 h-60 w-48 sm:h-76 sm:w-60 md:-end-4',
    secondaryClass: '-bottom-8 -start-14 h-56 w-44 sm:h-72 sm:w-56 md:-start-6',
    accentClass: 'bottom-16 end-[18%] hidden h-28 w-22 lg:block',
    glowClass: 'top-1/3 start-1/2 h-[380px] w-[380px] -translate-x-1/2',
    tiltDir: 1,
  },
  location: {
    primaryClass: 'top-6 -start-16 h-60 w-48 sm:h-72 sm:w-56 md:-start-8',
    secondaryClass: '-bottom-6 -end-14 h-56 w-44 sm:h-68 sm:w-52 md:-end-6',
    accentClass: 'top-16 end-[22%] hidden h-24 w-20 lg:block',
    glowClass: 'bottom-0 end-10 h-[340px] w-[340px]',
    tiltDir: -1,
  },
  contact: {
    primaryClass: '-top-8 -end-16 h-64 w-52 sm:h-80 sm:w-64 md:-end-6',
    secondaryClass: 'bottom-8 -start-16 h-56 w-44 sm:h-72 sm:w-56 md:-start-8',
    accentClass: 'top-1/3 start-[14%] hidden h-28 w-24 lg:block',
    glowClass: 'top-16 start-10 h-[380px] w-[380px]',
    tiltDir: 1,
  },
};

function CurvedPaperSheet({
  flip = false,
  stacked = false,
}: {
  flip?: boolean;
  stacked?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 220 280"
      fill="none"
      className={`h-full w-full overflow-visible ${flip ? '-scale-x-100' : ''}`}
      aria-hidden
    >
      {stacked && (
        <>
          <path
            d="M28 34 C82 22, 148 28, 198 18 L206 244 C152 256, 86 250, 34 262 Z"
            fill="rgb(var(--color-surface) / 0.32)"
            stroke="rgb(var(--color-border) / 0.14)"
            strokeWidth="1"
          />
          <path
            d="M22 26 C76 14, 142 20, 192 10 L200 236 C146 248, 80 242, 28 254 Z"
            fill="rgb(var(--color-surface) / 0.45)"
            stroke="rgb(var(--color-border) / 0.18)"
            strokeWidth="1"
          />
        </>
      )}

      {/* Main curved paper sheet */}
      <path
        d="M16 18 C70 6, 136 14, 158 10 L188 40 L194 228 C140 240, 74 232, 22 246 Z"
        fill="rgb(var(--color-surface) / 0.68)"
        stroke="rgb(var(--color-accent) / 0.34)"
        strokeWidth="1.15"
      />

      {/* Folded top-end corner crease */}
      <path
        d="M158 10 L156 42 C168 41, 178 41, 188 40 Z"
        fill="rgb(var(--color-accent) / 0.16)"
        stroke="rgb(var(--color-accent) / 0.4)"
        strokeWidth="1"
      />

      {/* Architectural paper grain / rulings */}
      <path
        d="M42 74 C86 66, 132 70, 168 65"
        stroke="rgb(var(--color-border) / 0.14)"
        strokeWidth="1"
        strokeDasharray="3 5"
      />
      <path
        d="M44 114 C88 106, 134 110, 170 105"
        stroke="rgb(var(--color-border) / 0.12)"
        strokeWidth="1"
      />
      <path
        d="M46 154 C90 146, 136 150, 172 145"
        stroke="rgb(var(--color-accent) / 0.18)"
        strokeWidth="1"
      />

      {/* Mill trim registration mark */}
      <g stroke="rgb(var(--color-accent) / 0.38)" strokeWidth="1">
        <line x1="38" y1="212" x2="52" y2="212" />
        <line x1="45" y1="205" x2="45" y2="219" />
      </g>
    </svg>
  );
}

export default function AmbientPaperBackdrop({ variant }: { variant: BackdropVariant }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const layout = VARIANT_LAYOUTS[variant];

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 26,
    mass: 0.6,
  });

  const yPrimary = useTransform(smoothProgress, [0, 1], reduced ? [0, 0] : [68, -68]);
  const rPrimaryX = useTransform(smoothProgress, [0, 1], reduced ? [0, 0] : [14 * layout.tiltDir, -12 * layout.tiltDir]);
  const rPrimaryY = useTransform(smoothProgress, [0, 1], reduced ? [0, 0] : [-16 * layout.tiltDir, 14 * layout.tiltDir]);
  const rPrimaryZ = useTransform(smoothProgress, [0, 1], reduced ? [0, 0] : [-8 * layout.tiltDir, 9 * layout.tiltDir]);

  const ySecondary = useTransform(smoothProgress, [0, 1], reduced ? [0, 0] : [-56, 56]);
  const rSecondaryX = useTransform(smoothProgress, [0, 1], reduced ? [0, 0] : [-12 * layout.tiltDir, 14 * layout.tiltDir]);
  const rSecondaryY = useTransform(smoothProgress, [0, 1], reduced ? [0, 0] : [15 * layout.tiltDir, -13 * layout.tiltDir]);
  const rSecondaryZ = useTransform(smoothProgress, [0, 1], reduced ? [0, 0] : [7 * layout.tiltDir, -8 * layout.tiltDir]);

  const yAccent = useTransform(smoothProgress, [0, 1], reduced ? [0, 0] : [92, -92]);
  const rAccentZ = useTransform(smoothProgress, [0, 1], reduced ? [0, 0] : [14, -16]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none [perspective:1200px]"
    >
      {/* Soft ambient gold/navy radial light bloom */}
      <div
        className={`absolute rounded-full opacity-55 ${layout.glowClass}`}
        style={{
          background:
            'radial-gradient(circle, rgb(var(--color-accent) / 0.13) 0%, rgb(var(--color-accent) / 0.04) 45%, transparent 72%)',
        }}
      />

      {/* Subtle architectural paper-slitting hairline & crop marks */}
      <div className="mx-auto h-full max-w-7xl px-5 md:px-8">
        <div className="relative h-full w-full">
          <span className="absolute top-6 start-0 hidden h-3 w-3 border-s border-t border-line/25 md:block" />
          <span className="absolute top-6 end-0 hidden h-3 w-3 border-e border-t border-line/25 md:block" />
          <span className="absolute bottom-6 start-0 hidden h-3 w-3 border-b border-s border-line/25 md:block" />
          <span className="absolute bottom-6 end-0 hidden h-3 w-3 border-b border-e border-line/25 md:block" />
        </div>
      </div>

      {/* Primary 3D floating curved ream sheet */}
      <motion.div
        style={{
          y: yPrimary,
          rotateX: rPrimaryX,
          rotateY: rPrimaryY,
          rotateZ: rPrimaryZ,
          transformStyle: 'preserve-3d',
        }}
        className={`absolute opacity-55 drop-shadow-[0_18px_36px_rgba(11,16,32,0.12)] sm:opacity-75 ${layout.primaryClass}`}
      >
        <div className="h-full w-full animate-[paper-drift-a_9s_ease-in-out_infinite_alternate]">
          <CurvedPaperSheet stacked={variant === 'catalog' || variant === 'services'} />
        </div>
      </motion.div>

      {/* Secondary counter-drifting 3D paper sheet */}
      <motion.div
        style={{
          y: ySecondary,
          rotateX: rSecondaryX,
          rotateY: rSecondaryY,
          rotateZ: rSecondaryZ,
          transformStyle: 'preserve-3d',
        }}
        className={`absolute opacity-45 drop-shadow-[0_16px_32px_rgba(11,16,32,0.1)] sm:opacity-65 ${layout.secondaryClass}`}
      >
        <div className="h-full w-full animate-[paper-drift-b_11s_ease-in-out_infinite_alternate]">
          <CurvedPaperSheet flip stacked={variant === 'leadership'} />
        </div>
      </motion.div>

      {/* Foreground micro swatch accent (desktop only for clean mobile reading) */}
      <motion.div
        style={{
          y: yAccent,
          rotateZ: rAccentZ,
        }}
        className={`absolute opacity-55 ${layout.accentClass}`}
      >
        <div className="h-full w-full animate-[paper-drift-a_7.5s_ease-in-out_infinite_alternate-reverse] rounded-sm border border-gold/25 bg-surface/40 p-2.5 shadow-[0_12px_28px_rgba(201,168,106,0.09)] backdrop-blur-[1px]">
          <div className="h-full w-full rounded-[1px] border border-dashed border-line/20" />
        </div>
      </motion.div>
    </div>
  );
}
