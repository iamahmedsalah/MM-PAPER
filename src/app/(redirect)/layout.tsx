import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { SITE_URL } from '../../lib/seo';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/android-chrome-192.png', sizes: '192x192', type: 'image/png' },
    ],
    shortcut: ['/favicon.ico'],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
};

export default function RedirectRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0B1020] text-[#F4EFE3]">{children}</body>
    </html>
  );
}
