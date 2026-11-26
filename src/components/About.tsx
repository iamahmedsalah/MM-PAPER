'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BookOpen,
  Maximize2,
  Package,
  Pause,
  Play,
  Printer,
  Utensils,
  X,
} from 'lucide-react';
import { useCases } from '../data/site';
import { Reveal, LineReveal } from './ui/Reveal';
import BrandLogo from './ui/BrandLogo';
import { useLang } from '../i18n/LanguageContext';
import { useTheme } from '../theme/ThemeContext';

const PAPER_EASE = [0.22, 1, 0.36, 1] as const;
const VIDEO_SRC = '/media/mm-logo-paper-motion.webm';

const iconMap: Record<string, typeof Printer> = {
  Printer,
  Package,
  BookOpen,
  Utensils,
};

export default function About() {
  const { t, L } = useLang();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const replayTimerRef = useRef<number>(0);

  const [playing, setPlaying] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);

  const attemptPlay = useCallback(() => {
    const vid = videoRef.current;
    if (!vid || videoFailed) return;
    vid.playbackRate = 0.92;
    setFadingOut(false);
    vid.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  }, [videoFailed]);

  const pauseBackground = useCallback(() => {
    window.clearTimeout(replayTimerRef.current);
    const vid = videoRef.current;
    if (!vid) return;
    vid.pause();
    setPlaying(false);
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || videoFailed) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let inView = false;

    const syncPlayback = () => {
      if (reduced || document.hidden || expanded || userPaused || !inView) {
        pauseBackground();
      } else {
        attemptPlay();
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        inView = Boolean(entry?.isIntersecting);
        syncPlayback();
      },
      { rootMargin: '280px 0px', threshold: 0.05 }
    );
    io.observe(el);

    const onVisChange = () => syncPlayback();
    document.addEventListener('visibilitychange', onVisChange);

    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisChange);
      window.clearTimeout(replayTimerRef.current);
    };
  }, [attemptPlay, pauseBackground, expanded, userPaused, videoFailed]);

  useEffect(() => {
    if (!expanded) return;
    pauseBackground();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setExpanded(false);
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [expanded, pauseBackground]);

  const handleTogglePlay = () => {
    const vid = videoRef.current;
    if (!vid || videoFailed) return;
    if (vid.paused) {
      setUserPaused(false);
      if (vid.ended || (vid.duration > 0 && vid.currentTime >= vid.duration - 0.5)) {
        vid.currentTime = 0;
      }
      attemptPlay();
    } else {
      setUserPaused(true);
      pauseBackground();
    }
  };

  const handleLoadedData = () => {
    const vid = videoRef.current;
    if (vid) {
      vid.playbackRate = 0.92;
    }
  };

  const handleTimeUpdate = () => {
    const vid = videoRef.current;
    if (!vid || !Number.isFinite(vid.duration) || vid.duration <= 2) return;
    if (vid.currentTime >= vid.duration - 0.95 && !fadingOut) {
      setFadingOut(true);
    }
  };

  const handleVideoEnded = () => {
    const vid = videoRef.current;
    if (!vid || userPaused || expanded) return;
    setFadingOut(true);
    window.clearTimeout(replayTimerRef.current);
    replayTimerRef.current = window.setTimeout(() => {
      vid.currentTime = 0;
      vid.playbackRate = 0.92;
      vid.play()
        .then(() => {
          setPlaying(true);
          window.requestAnimationFrame(() => setFadingOut(false));
        })
        .catch(() => setPlaying(false));
    }, 160);
  };

  const videoOpacityClass = fadingOut
    ? 'opacity-0'
    : isLight
      ? 'opacity-30 md:opacity-38'
      : 'opacity-55 md:opacity-65';

  return (
    <>
      <section
        id="about"
        ref={sectionRef}
        className={`relative overflow-hidden border-y py-20 transition-colors duration-300 md:py-28 ${
          isLight
            ? 'border-[#193051]/15 bg-[#F1E8D4] text-[#193051]'
            : 'border-gold/25 bg-[#0B1020] text-[#F4EFE3]'
        }`}
      >
        {!videoFailed && (
          <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
            <video
              ref={videoRef}
              src={VIDEO_SRC}
              muted
              playsInline
              preload="none"
              onLoadedData={handleLoadedData}
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleVideoEnded}
              onPlay={() => {
                if (videoRef.current) videoRef.current.playbackRate = 0.92;
                setPlaying(true);
              }}
              onPause={() => setPlaying(false)}
              onError={() => setVideoFailed(true)}
              className={`h-full w-full object-cover transition-opacity duration-700 ease-out ${videoOpacityClass} ${
                isLight ? 'mix-blend-multiply [filter:invert(1)_contrast(1.06)_brightness(1.04)]' : ''
              }`}
            />
          </div>
        )}

        <div
          className={`pointer-events-none absolute inset-0 z-[1] ${
            isLight
              ? 'bg-gradient-to-b from-[#F1E8D4]/75 via-[#F1E8D4]/28 to-[#F1E8D4]/80'
              : 'bg-gradient-to-b from-[#0B1020]/65 via-[#0B1020]/20 to-[#0B1020]/70'
          }`}
          aria-hidden
        />

        <div className="relative z-10 mx-auto grid max-w-7xl items-start gap-12 px-5 md:px-8 lg:grid-cols-2 lg:gap-20">
          <div>
            <Reveal>
              <p
                className={`tracking-brand mb-3 text-xs font-semibold ${
                  isLight ? 'text-accent' : 'text-gold'
                }`}
              >
                {t.about.eyebrow}
              </p>
            </Reveal>
            <h2
              className={`font-heading text-3xl font-bold leading-[120%] md:text-5xl ${
                isLight ? 'text-[#193051]' : 'text-[#F4EFE3]'
              }`}
            >
              <LineReveal lines={[t.about.titleA, t.about.titleB]} />
            </h2>
            <Reveal delay={0.18}>
              <div
                className={`mt-6 space-y-4 leading-[165%] ${
                  isLight ? 'text-[#193051]/85' : 'text-[#F4EFE3]/85'
                }`}
              >
                <p>{t.about.p1}</p>
                <p>{t.about.p2}</p>
                <p>{t.about.p3}</p>
              </div>
            </Reveal>
            <Reveal delay={0.28}>
              <BrandLogo
                variant={isLight ? 'lightSurface' : 'darkSurface'}
                alt={t.about.monogramAlt}
                className="mt-10 h-14 w-auto"
                width={140}
                height={56}
              />
            </Reveal>
          </div>

          <div>
            <Reveal>
              <h3
                className={`font-heading text-xl font-semibold ${
                  isLight ? 'text-[#193051]' : 'text-[#F4EFE3]'
                }`}
              >
                {t.about.usesTitle}
              </h3>
            </Reveal>
            <div className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-2">
              {useCases.map((u, i) => {
                const Icon = iconMap[u.icon] ?? Printer;
                return (
                  <Reveal key={u.id} delay={i * 0.06}>
                    <div
                      className={`group flex h-full flex-col items-start gap-3 rounded-sm border p-5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-gold hover:shadow-lg ${
                        isLight
                          ? 'border-[#193051]/15 bg-[#F7F4EC]/82 text-[#193051]'
                          : 'border-gold/20 bg-[#193051]/55 text-[#F4EFE3]'
                      }`}
                    >
                      <span
                        className={`inline-flex rounded-sm border p-2.5 transition-colors group-hover:bg-gold group-hover:text-midnight ${
                          isLight
                            ? 'border-[#9A7634]/40 bg-[#C9A86A]/18 text-[#806026]'
                            : 'border-gold/50 bg-gold/15 text-gold'
                        }`}
                      >
                        <Icon size={20} strokeWidth={1.6} aria-hidden />
                      </span>
                      <span className="text-sm font-semibold">{L(u.title)}</span>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>

        {!videoFailed && (
          <div
            className={`absolute top-5 end-5 z-20 flex items-center gap-1 rounded-full border p-1 backdrop-blur-md ${
              isLight
                ? 'border-[#193051]/20 bg-[#F7F4EC]/90 text-[#193051]'
                : 'border-cream/20 bg-[#0B1020]/75 text-cream'
            }`}
          >
            <button
              type="button"
              onClick={handleTogglePlay}
              aria-label={playing ? t.showcase.pause : t.showcase.play}
              title={playing ? t.showcase.pause : t.showcase.play}
              className="inline-flex h-[44px] w-[44px] items-center justify-center rounded-full transition-colors hover:bg-gold hover:text-midnight focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
            >
              {playing ? <Pause size={16} aria-hidden /> : <Play size={16} aria-hidden />}
            </button>
            <button
              type="button"
              onClick={() => setExpanded(true)}
              aria-label={t.showcase.expand}
              title={t.showcase.expand}
              className="inline-flex h-[44px] w-[44px] items-center justify-center rounded-full transition-colors hover:bg-gold hover:text-midnight focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
            >
              <Maximize2 size={16} aria-hidden />
            </button>
          </div>
        )}
      </section>

      <AnimatePresence>
        {expanded && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={t.showcase.modalTitle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setExpanded(false)}
            className={`fixed inset-0 z-[90] flex items-center justify-center p-4 backdrop-blur-md sm:p-8 ${
              isLight ? 'bg-[#193051]/70' : 'bg-[#0B1020]/90'
            }`}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.25, ease: PAPER_EASE }}
              onClick={(e) => e.stopPropagation()}
              className={`relative w-full max-w-5xl overflow-hidden rounded-sm border shadow-2xl ${
                isLight
                  ? 'border-[#193051]/25 bg-[#F1E8D4] text-[#193051]'
                  : 'border-gold/40 bg-[#0B1020] text-cream'
              }`}
            >
              <div
                className={`flex items-center justify-between border-b px-4 py-3 sm:px-6 ${
                  isLight ? 'border-[#193051]/15' : 'border-cream/15'
                }`}
              >
                <span className="tracking-brand text-xs font-semibold">{t.showcase.modalTitle}</span>
                <button
                  type="button"
                  onClick={() => setExpanded(false)}
                  aria-label={t.showcase.closeModal}
                  title={t.showcase.closeModal}
                  className={`inline-flex h-[44px] w-[44px] items-center justify-center rounded-full border transition-colors hover:border-gold hover:bg-gold hover:text-midnight focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold ${
                    isLight ? 'border-[#193051]/25 text-[#193051]' : 'border-cream/25 text-cream'
                  }`}
                >
                  <X size={18} aria-hidden />
                </button>
              </div>
              <div className={`aspect-video w-full ${isLight ? 'bg-[#F1E8D4]' : 'bg-[#0B1020]'}`}>
                <video
                  src={VIDEO_SRC}
                  autoPlay
                  loop
                  controls
                  playsInline
                  aria-label={t.showcase.videoLabel}
                  className={`h-full w-full object-contain ${
                    isLight
                      ? 'mix-blend-multiply [filter:invert(1)_contrast(1.06)_brightness(1.04)]'
                      : ''
                  }`}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
