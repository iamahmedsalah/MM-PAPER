'use client';

import { useTheme } from '../../theme/ThemeContext';
import {
  MM_LOGO_CREAM,
  MM_LOGO_NAVY,
  MM_LOGO_VIEWBOX,
  MM_SERIF_LOGO_PATH,
} from './logoPaths';

interface BrandLogoProps {
  className?: string;
  alt?: string;
  variant?: 'auto' | 'inverse' | 'darkSurface' | 'lightSurface';
  decorative?: boolean;
  width?: number;
  height?: number;
}

/** Official serif MM monogram: Cream (#F1E8D4) on dark surfaces, Navy (#193051) on light surfaces. */
export default function BrandLogo({
  className = 'h-8 w-auto',
  alt = 'MM Paper Industry',
  variant = 'auto',
  decorative = false,
  width = 80,
  height = 32,
}: BrandLogoProps) {
  const { theme } = useTheme();

  let fill = MM_LOGO_CREAM;
  if (variant === 'lightSurface') {
    fill = MM_LOGO_NAVY;
  } else if (variant === 'darkSurface') {
    fill = MM_LOGO_CREAM;
  } else if (variant === 'inverse') {
    fill = theme === 'dark' ? MM_LOGO_NAVY : MM_LOGO_CREAM;
  } else {
    fill = theme === 'dark' ? MM_LOGO_CREAM : MM_LOGO_NAVY;
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={MM_LOGO_VIEWBOX}
      width={width}
      height={height}
      className={className}
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : alt}
      aria-hidden={decorative || undefined}
      focusable="false"
    >
      <path d={MM_SERIF_LOGO_PATH} fill={fill} fillRule="evenodd" />
    </svg>
  );
}
