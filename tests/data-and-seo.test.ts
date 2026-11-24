import assert from 'node:assert/strict';
import test from 'node:test';
import { COMPANY_CONTACT } from '../src/data/contact.ts';
import { managers } from '../src/data/managers.ts';
import { paperTypes } from '../src/data/papers.ts';
import { services } from '../src/data/services.ts';
import { stats } from '../src/data/site.ts';
import { socialChannels } from '../src/data/socials.ts';
import { dictionaries } from '../src/i18n/translations.ts';
import { buildJsonLd } from '../src/lib/seo.ts';

test('company contact uses verified phone 011 3233 2148 and sales@mmpaperindustry.com', () => {
  assert.equal(COMPANY_CONTACT.phoneDisplay, '011 3233 2148');
  assert.equal(COMPANY_CONTACT.phoneHref, 'tel:+201132332148');
  assert.equal(COMPANY_CONTACT.whatsappHref, 'https://wa.me/201132332148');
  assert.equal(COMPANY_CONTACT.salesEmail, 'sales@mmpaperindustry.com');
  assert.equal(COMPANY_CONTACT.salesEmailHref, 'mailto:sales@mmpaperindustry.com');
});

test('catalog contains all 10 bilingual paper grades and 5 bilingual services', () => {
  assert.equal(paperTypes.length, 10);
  assert.equal(services.length, 5);

  for (const service of services) {
    assert.ok(service.id);
    assert.ok(service.title.en && service.title.ar);
    assert.ok(service.description.en && service.description.ar);
  }

  for (const grade of paperTypes) {
    assert.ok(grade.id);
    assert.ok(grade.name.en && grade.name.ar);
    assert.ok(grade.description.en && grade.description.ar);
    assert.ok(grade.gsmRange.includes('GSM'));
    assert.ok(grade.specs.length >= 3);
  }
});

test('leadership roster contains verified Morad executives with portraits and positions', () => {
  assert.equal(managers.length, 4);
  assert.deepEqual(
    managers.map((m) => ({ name: m.name, positionCode: m.positionCode, photo: m.photo })),
    [
      { name: 'Mr. Mohamed Morad', positionCode: 'Chairman', photo: '/team/mohamed-morad.webp' },
      { name: 'Mr. Khaled Morad', positionCode: 'CEO | CFO', photo: '/team/khaled-morad.webp' },
      { name: 'Mr. Ahmed Morad', positionCode: 'CSO', photo: '/team/ahmed-morad.webp' },
      { name: 'Mr. Mohamed Mohamed Morad', positionCode: 'COO', photo: '/team/mohamed-mohamed-morad.webp' },
    ]
  );
});

test('social channels contain clean verified URLs without tracking query strings', () => {
  assert.equal(socialChannels.length, 4);
  const hrefs = socialChannels.map((c) => c.href);
  assert.deepEqual(hrefs, [
    'https://www.facebook.com/MM.paper.industry',
    'https://www.instagram.com/mmpaperindustry/',
    'https://www.tiktok.com/@mmpaperindustry',
    'https://www.linkedin.com/company/mm-paper-industry/',
  ]);
  for (const href of hrefs) {
    assert.equal(href.includes('fbclid'), false);
  }
});

test('EN and AR dictionaries use MM Paper Industry branding and verified Egypt 2006 facts', () => {
  assert.equal(dictionaries.en.brand, 'MM Paper Industry');
  assert.equal(dictionaries.ar.brand, 'إم إم لصناعة الورق');
  assert.ok(dictionaries.ar.hero.sub.includes('شركة مصرية رائدة'));
  assert.ok(dictionaries.ar.hero.sub.includes('مستورد ومورد رئيسي'));
  assert.ok(dictionaries.ar.about.titleA.includes('2006'));
  assert.ok(dictionaries.ar.services.intro.includes('استيراد وتجارة وتحويل الورق'));
  assert.ok(dictionaries.ar.services.ctaPrompt.includes('هل تبحث عن مورد ورق موثوق'));
  assert.equal(stats[0].value, 20);

  const serialized = JSON.stringify(dictionaries);
  assert.equal(serialized.includes('MM Groups'), false);
  assert.equal(serialized.includes('Tehran'), false);
  assert.equal(serialized.includes('sales@mmpaper.com'), false);
});

test('JSON-LD schema outputs Organization, WebSite, and 6-item OfferCatalog with verified contact and socials', () => {
  for (const locale of ['en', 'ar'] as const) {
    const schema = buildJsonLd(locale);
    assert.equal(schema['@context'], 'https://schema.org');
    const graph = schema['@graph'];
    assert.equal(graph.length, 3);

    const org = graph[0] as {
      '@type': string;
      logo: string;
      foundingDate: string;
      sameAs: string[];
      contactPoint: { telephone: string; email: string };
    };
    assert.equal(org['@type'], 'Organization');
    assert.ok(org.logo.endsWith('/android-chrome-512.png'));
    assert.equal(org.foundingDate, '2006');
    assert.equal(org.sameAs.length, 4);
    assert.equal(org.contactPoint.telephone, '+20-11-3233-2148');
    assert.equal(org.contactPoint.email, 'sales@mmpaperindustry.com');

    const catalog = graph[2] as { '@type': string; itemListElement: unknown[] };
    assert.equal(catalog['@type'], 'OfferCatalog');
    assert.equal(catalog.itemListElement.length, 10);
  }
});
