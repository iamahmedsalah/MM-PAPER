'use client';

import { useTheme } from '../../theme/ThemeContext';
import { MM_LOGO_PATHS } from './logoPaths';

interface BrandLogoProps {
  className?: string;
  alt?: string;
  variant?: 'auto' | 'inverse' | 'darkSurface' | 'lightSurface';
  decorative?: boolean;
  width?: number;
  height?: number;
}

/** Exact 8-strip MM monogram adapted strictly to #193051, #C9A86A, and #0B1020/Cream. */
export default function BrandLogo({
  className = 'h-8 w-auto',
  alt = 'MM Paper Industry',
  variant = 'auto',
  decorative = false,
  width = 72,
  height = 36,
}: BrandLogoProps) {
  const { theme } = useTheme();

  let primaryFill = '#F4EFE3';
  const accentFill = '#C9A86A';

  if (variant === 'lightSurface') {
    primaryFill = '#193051';
  } else if (variant === 'darkSurface') {
    primaryFill = '#F4EFE3';
  } else if (variant === 'inverse') {
    primaryFill = theme === 'dark' ? '#193051' : '#F4EFE3';
  } else {
    primaryFill = theme === 'dark' ? '#F4EFE3' : '#193051';
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-20 -20 760 440"
      width={width}
      height={height}
      className={className}
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : alt}
      aria-hidden={decorative || undefined}
      focusable="false"
    >
      {MM_LOGO_PATHS.map((strip, idx) => (
        <path key={idx} d={strip.d} fill={strip.letter === 0 ? primaryFill : accentFill} />
      ))}
    </svg>
  );
}
