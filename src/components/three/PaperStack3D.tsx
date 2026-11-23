'use client';

import { useEffect, useRef, useState } from 'react';
import { paperStageEngine, type PaperSlotHandle } from './paperStageEngine';
import { useTheme } from '../../theme/ThemeContext';
import { paperTypes } from '../../data/papers';

interface PaperStack3DProps {
  type: string;
  className?: string;
  active?: boolean;
  sizeVariant?: 'card' | 'modal';
}

const clampUnit = (v: number) => Math.min(1, Math.max(-1, v));

/** Interactive 3D paper stack / corrugated board powered by the single shared WebGL stage engine. */
export default function PaperStack3D({
  type,
  className = '',
  active = false,
  sizeVariant = 'card',
}: PaperStack3DProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const handleRef = useRef<PaperSlotHandle | null>(null);
  const { theme } = useTheme();
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const el = hostRef.current;
    const canvas = canvasRef.current;
    if (!el || !canvas) return;

    const handle = paperStageEngine.mountSlot({
      canvas,
      type,
      sizeVariant,
      onFallback: () => setFallback(true),
    });

    if (!handle) return;
    handleRef.current = handle;
    handle.setTheme(theme);
    handle.setActive(active);
    handle.setSize(el.clientWidth || 300, el.clientHeight || 176);

    const ro = new ResizeObserver((entries) => {
      const box = entries[0]?.contentRect;
      if (box) handle.setSize(box.width, box.height);
    });
    ro.observe(el);

    const io = new IntersectionObserver(
      (entries) => {
        handle.setVisible(Boolean(entries[0]?.isIntersecting));
      },
      { threshold: 0.05 }
    );
    io.observe(el);

    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const hostCard = el.closest('article, [data-card-host]') ?? el;

    const onEnter = () => handle.setHover(true);
    const onLeave = () => {
      handle.setHover(false);
      handle.setPointer(0, 0);
    };
    const onMove = (e: Event) => {
      const pe = e as PointerEvent;
      const b = el.getBoundingClientRect();
      if (!b.width || !b.height) return;
      const nx = clampUnit(((pe.clientX - b.left) / b.width) * 2 - 1);
      const ny = clampUnit(((pe.clientY - b.top) / b.height) * 2 - 1);
      handle.setPointer(nx, ny);
    };

    if (finePointer) {
      hostCard.addEventListener('pointerenter', onEnter);
      hostCard.addEventListener('pointerleave', onLeave);
      hostCard.addEventListener('pointermove', onMove);
    }

    return () => {
      ro.disconnect();
      io.disconnect();
      if (finePointer) {
        hostCard.removeEventListener('pointerenter', onEnter);
        hostCard.removeEventListener('pointerleave', onLeave);
        hostCard.removeEventListener('pointermove', onMove);
      }
      handle.dispose();
      handleRef.current = null;
    };
    // Theme & active sync cleanly via dedicated effects without recreating WebGL scenes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, sizeVariant]);

  useEffect(() => {
    handleRef.current?.setTheme(theme);
  }, [theme]);

  useEffect(() => {
    handleRef.current?.setActive(active);
  }, [active]);

  if (fallback) {
    const grade = paperTypes.find((p) => p.id === type) ?? paperTypes[0];
    return (
      <div ref={hostRef} className={`relative flex items-center justify-center ${className}`} aria-hidden>
        <div className="relative h-24 w-20">
          {[2, 1, 0].map((layer) => (
            <span
              key={layer}
              className="absolute inset-0 rounded-[2px] border shadow-md transition-transform duration-300"
              style={{
                backgroundColor: grade.swatch.base,
                borderColor: grade.swatch.edge,
                transform: `translate(${(layer - 1) * (active ? 8 : 4)}px, ${(layer - 1) * -4}px) rotate(${(layer - 1) * (active ? 6 : 2)}deg)`,
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div ref={hostRef} className={`relative ${className}`} aria-hidden>
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 block h-full w-full"
      />
    </div>
  );
}
