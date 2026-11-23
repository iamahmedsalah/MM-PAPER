'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

const PAPER_EASE = [0.22, 1, 0.36, 1] as const;

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-48px' }}
      transition={{ duration: 0.56, delay, ease: PAPER_EASE }}
    >
      {children}
    </motion.div>
  );
}

/** Headline that slides up line by line. */
export function LineReveal({ lines, className }: { lines: string[]; className?: string }) {
  return (
    <span className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-1">
          <motion.span
            className="block"
            initial={{ y: '110%' }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: i * 0.12, ease: PAPER_EASE }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/** Thin gold hairline that draws across cleanly in both LTR and RTL. */
export function GoldRule({ className = '' }: { className?: string }) {
  return (
    <div className={`h-px w-full overflow-hidden bg-line/15 ${className}`}>
      <motion.div
        className="h-full origin-left bg-gold rtl:origin-right"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.95, ease: PAPER_EASE }}
      />
    </div>
  );
}
