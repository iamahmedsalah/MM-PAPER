'use client';

import { paperTypes } from '../data/papers';
import { useLang } from '../i18n/LanguageContext';

export default function Marquee() {
  const { L } = useLang();
  const names = paperTypes.map((p) => L(p.name));
  const row = [...names, ...names, ...names];
  return (
    <div
      className="group relative overflow-hidden border-y border-line/15 bg-canvas py-4 [mask-image:linear-gradient(to_right,transparent,black_7%,black_93%,transparent)]"
      aria-hidden
    >
      <div className="flex w-max animate-[marquee_30s_linear_infinite] items-center gap-10 pe-10 group-hover:[animation-play-state:paused] rtl:animate-[marquee-rtl_30s_linear_infinite]">
        {row.map((name, i) => (
          <span key={i} className="flex items-center gap-10 whitespace-nowrap">
            <span className="tracking-brand font-heading text-sm font-semibold text-inkSubtle transition-colors duration-200 hover:text-accent">
              {name}
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-gold/75 shadow-[0_0_8px_rgba(201,168,106,0.45)]" />
          </span>
        ))}
      </div>
    </div>
  );
}
