import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'MM Paper Industry',
    short_name: 'MM Paper',
    description:
      'Leading Egyptian company since 2006 specialized in importing, preparing, converting, and trading all types of paper in partnership with major international paper mills.',
    start_url: '/en',
    display: 'standalone',
    background_color: '#0B1020',
    theme_color: '#0B1020',
    icons: [
      {
        src: '/mm-logo-dark.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}
