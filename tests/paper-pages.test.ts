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

test('buildProductJsonLd outputs Product, BreadcrumbList, and FAQPage for EN and AR', () => {
  const coated = getPaperBySlug('coated-paper-couche');
  assert.ok(coated);

  for (const locale of ['en', 'ar'] as const) {
    const schema = buildProductJsonLd(locale, coated);
    assert.equal(schema['@context'], 'https://schema.org');
    assert.ok(Array.isArray(schema['@graph']));
    const types = schema['@graph'].map((node) => node['@type']);
    assert.ok(types.includes('Product'));
    assert.ok(types.includes('BreadcrumbList'));
    assert.ok(types.includes('FAQPage'));
  }
});
