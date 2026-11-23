'use client';

import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

const base =
  'group/btn relative inline-flex min-h-[44px] items-center justify-center gap-2 overflow-hidden rounded-sm px-6 py-3 text-sm font-semibold tracking-wide transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold';

export function GoldButton({
  children,
  className = '',
  ...rest
}: { children: ReactNode } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`${base} bg-gold text-midnight shadow-[0_0_0_rgba(201,168,106,0)] hover:bg-goldLight hover:shadow-[0_8px_24px_rgba(201,168,106,0.28)] ${className}`}
      {...rest}
    >
      <Sweep />
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </button>
  );
}

export function GoldLink({
  children,
  className = '',
  ...rest
}: { children: ReactNode } & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      className={`${base} bg-gold text-midnight shadow-[0_0_0_rgba(201,168,106,0)] hover:bg-goldLight hover:shadow-[0_8px_24px_rgba(201,168,106,0.28)] ${className}`}
      {...rest}
    >
      <Sweep />
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </a>
  );
}

export function GhostLink({
  children,
  className = '',
  ...rest
}: { children: ReactNode } & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      className={`${base} border border-accent/45 bg-transparent text-accent hover:border-gold hover:bg-gold/10 hover:text-accentStrong ${className}`}
      {...rest}
    >
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </a>
  );
}

function Sweep() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-cream/45 to-transparent transition-transform duration-700 group-hover/btn:translate-x-full rtl:translate-x-full rtl:group-hover/btn:-translate-x-full"
    />
  );
}
