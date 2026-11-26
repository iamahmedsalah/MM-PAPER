'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Camera, Film, Layers, Pause, Play, ZoomIn } from 'lucide-react';
import type { PaperType } from '../data/papers';
import type { PaperVideoSpec } from '../data/paper-details';
import { useLang } from '../i18n/LanguageContext';

const PaperStack3D = dynamic(() => import('./three/PaperStack3D'), { ssr: false });

type StageMode = 'video' | 'photo' | '3d';

export default function PaperProductStage({
  paper,
  video,
}: {
  paper: PaperType;
  video?: PaperVideoSpec;
}) {
  const { lang, t, L } = useLang();
  const hasVideo = Boolean(video?.webm || video?.mp4);
  const [mode, setMode] = useState<StageMode>(hasVideo ? 'video' : 'photo');
  const [loupeEnabled, setLoupeEnabled] = useState(true);
  const [loupeActive, setLoupeActive] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(true);
  const stageRef = useRef<HTMLDivElement>(null);
  const loupeRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!hasVideo || mode !== 'video') return;
    const vid = videoRef.current;
    if (!vid) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      vid.pause();
      setVideoPlaying(false);
    } else {
      vid.play().then(
        () => setVideoPlaying(true),
        () => setVideoPlaying(false)
      );
    }
  }, [hasVideo, mode]);

  const toggleVideoPlay = () => {
    const vid = videoRef.current;
    if (!vid) return;
    if (vid.paused) {
      vid.play().then(
        () => setVideoPlaying(true),
        () => setVideoPlaying(false)
      );
    } else {
      vid.pause();
      setVideoPlaying(false);
    }
  };

  const updateLoupePosition = (clientX: number, clientY: number) => {
    const el = stageRef.current;
    const loupe = loupeRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const x = Math.min(92, Math.max(8, ((clientX - rect.left) / rect.width) * 100));
    const y = Math.min(88, Math.max(14, ((clientY - rect.top) / rect.height) * 100));
    if (!loupeActive) setLoupeActive(true);
    if (loupe) {
      loupe.style.left = `${x}%`;
      loupe.style.top = `${y}%`;
      loupe.style.backgroundPosition = `${x}% ${y}%`;
    }
  };

  return (
    <div className="overflow-hidden rounded-sm border border-line/25 bg-surface shadow-card">
      <div
        ref={stageRef}
        onPointerMove={(e) => {
          if (mode === 'photo' && loupeEnabled) {
            updateLoupePosition(e.clientX, e.clientY);
          }
        }}
        onPointerEnter={(e) => {
          if (mode === 'photo' && loupeEnabled) {
            updateLoupePosition(e.clientX, e.clientY);
          }
        }}
        onPointerLeave={() => setLoupeActive(false)}
        className="relative aspect-[16/10] w-full select-none overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, var(--thumb-grad-a), var(--thumb-grad-b))',
        }}
      >
        {mode === 'video' && hasVideo ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster={video?.poster || paper.image}
              aria-label={`${L(paper.name)} — ${lang === 'ar' ? 'فيديو الخامة' : 'Motion Showcase'}`}
              className="h-full w-full object-cover"
            >
              {video?.webm && <source src={video.webm} type="video/webm" />}
              {video?.mp4 && <source src={video.mp4} type="video/mp4" />}
            </video>
            <button
              type="button"
              onClick={toggleVideoPlay}
              aria-label={
                videoPlaying
                  ? lang === 'ar'
                    ? 'إيقاف الفيديو مؤقتاً'
                    : 'Pause video'
                  : lang === 'ar'
                    ? 'تشغيل الفيديو'
                    : 'Play video'
              }
              className="absolute bottom-3 end-3 z-20 inline-flex h-[40px] w-[40px] items-center justify-center rounded-full border border-line/35 bg-canvas/85 text-ink backdrop-blur-md transition-colors hover:border-gold hover:text-accent"
            >
              {videoPlaying ? <Pause size={16} aria-hidden /> : <Play size={16} aria-hidden />}
            </button>
          </>
        ) : mode === 'photo' ? (
          <>
            <Image
              src={paper.image}
              alt={`${L(paper.name)} — ${L(paper.surfaceFinish)}`}
              fill
              quality={82}
              priority
              sizes="(max-width: 1024px) 100vw, 600px"
              className="object-cover"
            />

            <div
              ref={loupeRef}
              aria-hidden
              className={`pointer-events-none absolute z-20 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-gold shadow-[0_10px_28px_rgba(11,16,32,0.65),inset_0_0_12px_rgba(201,168,106,0.35)] transition-opacity duration-150 sm:h-36 sm:w-36 ${
                loupeEnabled && loupeActive ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                left: '50%',
                top: '50%',
                backgroundImage: `url(${paper.image})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: '240% 240%',
                backgroundPosition: '50% 50%',
              }}
            >
              <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 rounded-full bg-midnight/85 px-2 py-0.5 text-[10px] font-bold tracking-wider text-gold">
                2.4×
              </span>
            </div>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-midnight/90 via-midnight/45 to-transparent px-4 pb-2.5 pt-8 text-xs text-cream/90">
              <p className="flex items-center gap-1.5">
                <ZoomIn size={14} className="shrink-0 text-gold" aria-hidden />
                <span className="truncate">{t.papers.loupeHint}</span>
              </p>
            </div>
          </>
        ) : (
          <PaperStack3D type={paper.id} sizeVariant="modal" active className="h-full w-full" />
        )}

        {/* Top Switcher Bar */}
        <div
          onPointerEnter={() => setLoupeActive(false)}
          onPointerMove={(e) => e.stopPropagation()}
          className="absolute inset-x-3 top-3 z-30 flex flex-wrap items-center justify-between gap-2"
        >
          <div
            role="tablist"
            aria-label={L(paper.name)}
            className="inline-flex rounded-full border border-line/35 bg-canvas/85 p-0.5 backdrop-blur-md"
          >
            {hasVideo && (
              <button
                type="button"
                role="tab"
                aria-selected={mode === 'video'}
                onClick={() => setMode('video')}
                className={`inline-flex min-h-[36px] items-center gap-1.5 rounded-full px-3 text-xs font-semibold transition-colors ${
                  mode === 'video' ? 'bg-gold text-midnight shadow-sm' : 'text-ink hover:text-accent'
                }`}
              >
                <Film size={13} aria-hidden />
                <span>{lang === 'ar' ? 'فيديو الخامة' : 'Motion Video'}</span>
              </button>
            )}
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'photo'}
              onClick={() => setMode('photo')}
              className={`inline-flex min-h-[36px] items-center gap-1.5 rounded-full px-3 text-xs font-semibold transition-colors ${
                mode === 'photo' ? 'bg-gold text-midnight shadow-sm' : 'text-ink hover:text-accent'
              }`}
            >
              <Camera size={13} aria-hidden />
              <span>{t.papers.viewPhoto}</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === '3d'}
              onClick={() => setMode('3d')}
              className={`inline-flex min-h-[36px] items-center gap-1.5 rounded-full px-3 text-xs font-semibold transition-colors ${
                mode === '3d' ? 'bg-gold text-midnight shadow-sm' : 'text-ink hover:text-accent'
              }`}
            >
              <Layers size={13} aria-hidden />
              <span>{t.papers.view3D}</span>
            </button>
          </div>

          {mode === 'photo' && (
            <button
              type="button"
              aria-pressed={loupeEnabled}
              onClick={() => setLoupeEnabled((v) => !v)}
              className={`inline-flex min-h-[36px] items-center gap-1.5 rounded-full border px-3 text-xs font-semibold backdrop-blur-md transition-colors ${
                loupeEnabled
                  ? 'border-gold/70 bg-midnight/85 text-gold'
                  : 'border-line/30 bg-canvas/80 text-inkMuted hover:border-gold'
              }`}
            >
              <ZoomIn size={13} aria-hidden />
              <span>{t.papers.loupeToggle}</span>
            </button>
          )}
        </div>
      </div>

      {/* Compact Surface & Print Compatibility Footer */}
      <div className="grid divide-y divide-line/15 border-t border-line/15 bg-canvas/50 sm:grid-cols-2 sm:divide-x sm:divide-y-0 rtl:sm:divide-x-reverse">
        <div className="px-4 py-3">
          <p className="text-[11px] font-semibold text-accent">{t.papers.surfaceLabel}</p>
          <p className="mt-1 text-xs font-medium leading-[155%] text-ink">{L(paper.surfaceFinish)}</p>
        </div>
        <div className="px-4 py-3">
          <p className="text-[11px] font-semibold text-accent">{t.papers.printMethodLabel}</p>
          <p className="mt-1 text-xs font-medium leading-[155%] text-ink">{L(paper.printMethod)}</p>
        </div>
      </div>
    </div>
  );
}
