import test from 'node:test';
import assert from 'node:assert/strict';
import { getPaperBySlug, paperTypes } from '../src/data/papers.ts';
import { paperDetails } from '../src/data/paper-details.ts';
import { buildProductJsonLd } from '../src/lib/seo.ts';

test('all 10 paper grades have unique URL-safe slugs and full bilingual product details', () => {
  assert.equal(paperTypes.length, 10);
  const slugs = new Set<string>();

  for (const paper of paperTypes) {
    assert.match(paper.slug, /^[a-z0-9-]+$/);
    assert.ok(!slugs.has(paper.slug), `Duplicate slug: ${paper.slug}`);
    slugs.add(paper.slug);
    assert.equal(getPaperBySlug(paper.slug)?.id, paper.id);

    const detail = paperDetails[paper.id];
    assert.ok(detail, `Missing detail for ${paper.id}`);
    assert.ok(detail.seoTitle.ar.length > 20);
    assert.ok(detail.seoTitle.en.length > 20);
    assert.ok(detail.applications.length >= 4);
    assert.ok(detail.faqs.length >= 3 && detail.faqs.length <= 5);
    assert.ok(detail.relatedIds.length >= 3);
  }
});

test('quote-only paper pages have page, breadcrumb, and FAQ markup in both locales', () => {
  const coated = getPaperBySlug('coated-paper-couche');
  assert.ok(coated);

  for (const locale of ['en', 'ar'] as const) {
    const schema = buildProductJsonLd(locale, coated);
    assert.equal(schema['@context'], 'https://schema.org');
    assert.ok(Array.isArray(schema['@graph']));
    const types = schema['@graph'].map((node) => node['@type']);
    const page = schema['@graph'].find((node) => node['@type'] === 'ItemPage');
    assert.ok(page);
    assert.equal(page.inLanguage, locale);
    assert.ok(String(page.url).endsWith(`/${locale}/papers/${coated.slug}`));
    assert.doesNotMatch(JSON.stringify(schema), /"@type":"(?:Product|Offer)"/);
    assert.ok(types.includes('BreadcrumbList'));
    assert.ok(types.includes('FAQPage'));
  }
});
