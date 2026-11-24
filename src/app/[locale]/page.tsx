import { notFound } from 'next/navigation';
import LandingPage from '../../components/LandingPage';
import { JsonLd } from '../../components/seo/JsonLd';
import { buildJsonLd, isLocale } from '../../lib/seo';

export const runtime = 'nodejs';

export default async function LocaleHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const jsonLd = buildJsonLd(locale);

  return (
    <>
      <JsonLd data={jsonLd} />
      <LandingPage />
    </>
  );
}
