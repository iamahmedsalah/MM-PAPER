'use client';

import { GoldRule, LineReveal, Reveal } from './ui/Reveal';

export default function SectionHeader({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  return (
    <div className="mb-10 max-w-2xl md:mb-14">
      <Reveal>
        <p className="tracking-brand mb-3 text-xs font-semibold text-accent">{eyebrow}</p>
      </Reveal>
      <h2 className="font-heading text-3xl font-bold leading-[120%] text-ink md:text-5xl">
        <LineReveal lines={[title]} />
      </h2>
      {intro && (
        <Reveal delay={0.16}>
          <p className="mt-4 leading-[160%] text-inkMuted">{intro}</p>
        </Reveal>
      )}
      <Reveal delay={0.2}>
        <GoldRule className="mt-7 md:mt-8" />
      </Reveal>
    </div>
  );
}
