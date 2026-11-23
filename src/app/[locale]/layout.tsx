import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import '../../index.css';
import { ThemeProvider } from '../../theme/ThemeContext';
import { LanguageProvider } from '../../i18n/LanguageContext';
import { ThemeInit } from '../../components/ui/ThemeInit';
import { dictionaries } from '../../i18n/translations';
import { isLocale, LOCALES, SITE_URL } from '../../lib/seo';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0B1020' },
    { media: '(prefers-color-scheme: light)', color: '#F7F4EC' },
  ],
};

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const dict = dictionaries[locale];

  return {
    metadataBase: new URL(SITE_URL),
    title: dict.seo.title,
    description: dict.seo.description,
    keywords: [...dict.seo.keywords],
    authors: [{ name: dict.brand }],
    creator: dict.brand,
    publisher: dict.brand,
    category: 'Paper Industry & Bulk Supply',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
    icons: {
      icon: [
        { url: '/favicon.svg', type: 'image/svg+xml' },
        { url: '/favicon.ico', sizes: '48x48' },
        { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
        { url: '/favicon-16.png', sizes: '16x16', type: 'image/png' },
      ],
      apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    },
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: '/en',
        ar: '/ar',
        'x-default': '/en',
      },
    },
    openGraph: {
      type: 'website',
      locale: locale === 'ar' ? 'ar_EG' : 'en_US',
      alternateLocale: locale === 'ar' ? ['en_US'] : ['ar_EG'],
      url: `/${locale}`,
      siteName: dict.brand,
      title: dict.seo.title,
      description: dict.seo.description,
      images: ['/android-chrome-512.png'],
    },
    twitter: {
      card: 'summary_large_image',
      title: dict.seo.title,
      description: dict.seo.description,
      images: ['/android-chrome-512.png'],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <ThemeInit />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&family=Inter:wght@400;500;600&family=Sora:wght@400;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeProvider>
          <LanguageProvider initialLang={locale}>{children}</LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
