import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { getPaperBySlug, paperTypes } from '../src/data/papers.ts';
import { paperDetails } from '../src/data/paper-details.ts';
import { buildProductJsonLd } from '../src/lib/seo.ts';
import robots from '../src/app/robots.ts';
import { buildIndexNowUrlList, INDEXNOW_KEY } from '../scripts/submit-indexnow.mjs';

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

test('every <Image> and <img> element across src/ includes a non-empty alt attribute', () => {
  const srcDir = path.resolve(process.cwd(), 'src');
  const walk = (dir: string): string[] =>
    fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) return walk(full);
      return /\.(ts|tsx)$/.test(entry.name) ? [full] : [];
    });

  const files = walk(srcDir);
  let checkedCount = 0;

  for (const file of files) {
    const source = fs.readFileSync(file, 'utf8');
    const matches = source.matchAll(/<(?:Image|img)\b([\s\S]*?)\/?>/g);
    for (const match of matches) {
      checkedCount += 1;
      const attrs = match[1];
      assert.match(
        attrs,
        /\balt\s*=\s*(?:"[^"]+"|'[^']+'|\{[^}]+\})/,
        `Missing or empty alt attribute in ${path.relative(process.cwd(), file)}`
      );
    }
  }

  assert.ok(checkedCount >= 5, `Expected at least 5 image elements in src/, found ${checkedCount}`);
});

test('robots.ts explicitly allows crawling root for *, Googlebot, and Bingbot with sitemap', () => {
  const config = robots();
  const rules = Array.isArray(config.rules) ? config.rules : [config.rules];

  const wildcard = rules.find((r) => r.userAgent === '*');
  assert.ok(wildcard);
  assert.equal(wildcard.allow, '/');

  const bingRule = rules.find((r) => r.userAgent === 'Bingbot');
  const googleRule = rules.find((r) => r.userAgent === 'Googlebot');
  assert.ok(bingRule);
  assert.ok(googleRule);
  assert.equal(bingRule.allow, '/');
  assert.equal(googleRule.allow, '/');
  assert.equal(config.sitemap, 'https://mm-eg.co/sitemap.xml');
});

test('IndexNow key file in public/ matches scripts/submit-indexnow.mjs and covers all 22 URLs', async () => {
  const { INDEXNOW_KEY, buildIndexNowUrlList } = await import('../scripts/submit-indexnow.mjs');
  const keyFilePath = path.resolve(process.cwd(), 'public', `${INDEXNOW_KEY}.txt`);
  assert.ok(fs.existsSync(keyFilePath), 'IndexNow key verification file must exist in public/');
  assert.equal(fs.readFileSync(keyFilePath, 'utf8').trim(), INDEXNOW_KEY);

  const urls = buildIndexNowUrlList();
  assert.equal(urls.length, 22);
  assert.ok(urls.includes('https://mm-eg.co/en'));
  assert.ok(urls.includes('https://mm-eg.co/ar'));
  for (const paper of paperTypes) {
    assert.ok(urls.includes(`https://mm-eg.co/en/papers/${paper.slug}`));
    assert.ok(urls.includes(`https://mm-eg.co/ar/papers/${paper.slug}`));
  }
});

test('IndexNow verification key file matches script key and covers all 22 canonical URLs', () => {
  const keyFile = path.resolve(process.cwd(), 'public', `${INDEXNOW_KEY}.txt`);
  assert.ok(fs.existsSync(keyFile), `Missing IndexNow key file: ${keyFile}`);
  assert.equal(fs.readFileSync(keyFile, 'utf8').trim(), INDEXNOW_KEY);

  const urls = buildIndexNowUrlList();
  assert.equal(urls.length, 22);
  assert.ok(urls.includes('https://mm-eg.co/en'));
  assert.ok(urls.includes('https://mm-eg.co/ar'));
  for (const paper of paperTypes) {
    assert.ok(urls.includes(`https://mm-eg.co/en/papers/${paper.slug}`));
    assert.ok(urls.includes(`https://mm-eg.co/ar/papers/${paper.slug}`));
  }
});

test('IndexNow verification file in public/ matches key and covers all 22 URLs', async () => {
  const mod = await import('../scripts/submit-indexnow.mjs');
  const keyFile = path.resolve(process.cwd(), 'public', `${mod.INDEXNOW_KEY}.txt`);
  assert.ok(fs.existsSync(keyFile), `Missing IndexNow key file: ${keyFile}`);
  assert.equal(fs.readFileSync(keyFile, 'utf8').trim(), mod.INDEXNOW_KEY);

  const urls = mod.buildIndexNowUrlList();
  assert.equal(urls.length, 22);
  for (const paper of paperTypes) {
    assert.ok(urls.includes(`https://mm-eg.co/en/papers/${paper.slug}`));
    assert.ok(urls.includes(`https://mm-eg.co/ar/papers/${paper.slug}`));
  }
});
