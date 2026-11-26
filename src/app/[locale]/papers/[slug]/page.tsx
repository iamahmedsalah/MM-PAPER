import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JsonLd } from '../../../../components/seo/JsonLd';
import PaperProductPage from '../../../../components/PaperProductPage';
import { getPaperDetail } from '../../../../data/paper-details';
import { getPaperById, getPaperBySlug, paperTypes, type PaperType } from '../../../../data/papers';
import { dictionaries } from '../../../../i18n/translations';
import { buildProductJsonLd, isLocale, LOCALES, SITE_URL } from '../../../../lib/seo';

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    paperTypes.map((paper) => ({
      locale,
      slug: paper.slug,
    }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};

  const paper = getPaperBySlug(slug);
  if (!paper) return {};

  const detail = getPaperDetail(paper.id);
  const dict = dictionaries[locale];
  const canonicalPath = `/${locale}/papers/${paper.slug}`;
  const ogImage = `${SITE_URL}${paper.image}`;

  return {
    title: detail.seoTitle[locale],
    description: detail.seoDescription[locale],
    keywords: detail.keywords[locale],
    alternates: {
      canonical: canonicalPath,
      languages: {
        en: `/en/papers/${paper.slug}`,
        ar: `/ar/papers/${paper.slug}`,
        'x-default': `/en/papers/${paper.slug}`,
      },
    },
    openGraph: {
      type: 'website',
      locale: locale === 'ar' ? 'ar_EG' : 'en_US',
      alternateLocale: locale === 'ar' ? ['en_US'] : ['ar_EG'],
      url: canonicalPath,
      siteName: dict.brand,
      title: detail.seoTitle[locale],
      description: detail.seoDescription[locale],
      images: [
        {
          url: ogImage,
          width: 1280,
          height: 800,
          alt: `${paper.name[locale]} — ${dict.brand}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: detail.seoTitle[locale],
      description: detail.seoDescription[locale],
      images: [ogImage],
    },
  };
}

export default async function ProductDetailRoute({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const paper = getPaperBySlug(slug);
  if (!paper) notFound();

  const detail = getPaperDetail(paper.id);
  const related = detail.relatedIds
    .map((id) => getPaperById(id))
    .filter((item): item is PaperType => Boolean(item));

  return (
    <>
      <JsonLd data={buildProductJsonLd(locale, paper)} />
      <PaperProductPage paper={paper} detail={detail} related={related} />
    </>
  );
}
