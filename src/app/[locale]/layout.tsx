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
  colorScheme: 'dark light',
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
        { url: '/favicon-light.svg', media: '(prefers-color-scheme: light)', type: 'image/svg+xml' },
        { url: '/favicon-dark.svg', media: '(prefers-color-scheme: dark)', type: 'image/svg+xml' },
        { url: '/favicon.svg', type: 'image/svg+xml' },
      ],
      shortcut: ['/favicon.ico'],
      apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    },
    other: {
      'msapplication-TileColor': '#193051',
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
  const fontsHref =
    locale === 'ar'
      ? 'https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&display=swap'
      : 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Sora:wght@400;600;700;800&display=swap';

  return (
    <html lang={locale} dir={dir} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <ThemeInit />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href={fontsHref} rel="stylesheet" />
      </head>
      <body>
        <ThemeProvider>
          <LanguageProvider initialLang={locale}>{children}</LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
