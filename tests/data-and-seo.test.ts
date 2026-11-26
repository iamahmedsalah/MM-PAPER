import assert from 'node:assert/strict';
import test from 'node:test';
import { COMPANY_CONTACT, COMPANY_LOCATION } from '../src/data/contact.ts';
import { faqItems } from '../src/data/faq.ts';
import { managers } from '../src/data/managers.ts';
import { paperTypes } from '../src/data/papers.ts';
import { services } from '../src/data/services.ts';
import { stats } from '../src/data/site.ts';
import { socialChannels } from '../src/data/socials.ts';
import { dictionaries } from '../src/i18n/translations.ts';
import { buildJsonLd } from '../src/lib/seo.ts';

test('company contact uses verified phone 011 3233 2148 and info@mm-eg.co', () => {
  assert.equal(COMPANY_CONTACT.phoneDisplay, '011 3233 2148');
  assert.equal(COMPANY_CONTACT.phoneHref, 'tel:+201132332148');
  assert.equal(COMPANY_CONTACT.whatsappHref, 'https://wa.me/201132332148');
  assert.equal(COMPANY_CONTACT.salesEmail, 'info@mm-eg.co');
  assert.equal(COMPANY_CONTACT.salesEmailHref, 'mailto:info@mm-eg.co');
  assert.ok(COMPANY_LOCATION.address.ar.includes('برج العرب الجديدة'));
  assert.ok(COMPANY_LOCATION.address.ar.includes('قطعة 10 - بلوك 2'));
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
    assert.ok(grade.surfaceFinish.en && grade.surfaceFinish.ar);
    assert.ok(grade.printMethod.en && grade.printMethod.ar);
    assert.ok(grade.image.startsWith('/papers/') && grade.image.endsWith('.webp'));
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
  assert.equal(serialized.includes('sales@mmpaperindustry.com'), false);
});

test('FAQ dataset contains 6 bilingual Q&As matching schema expectations', () => {
  assert.equal(faqItems.length, 6);
  for (const item of faqItems) {
    assert.ok(item.id);
    assert.ok(item.question.en && item.question.ar);
    assert.ok(item.answer.en && item.answer.ar);
  }
});

test('JSON-LD lists quote-only paper pages without retail offers in each locale', () => {
  for (const locale of ['en', 'ar'] as const) {
    const schema = buildJsonLd(locale);
    assert.equal(schema['@context'], 'https://schema.org');
    const graph = schema['@graph'];
    assert.equal(graph.length, 7);

    const org = graph[0] as {
      '@type': string;
      logo: { '@type': string; url: string };
      foundingDate: string;
      sameAs: string[];
      address: { '@type': string; addressCountry: string };
      employee: Array<{ '@type': string; name: string }>;
      contactPoint: { telephone: string; email: string };
    };
    assert.equal(org['@type'], 'Organization');
    assert.equal(org.logo['@type'], 'ImageObject');
    assert.ok(org.logo.url.endsWith('/android-chrome-512.png'));
    assert.equal(org.foundingDate, '2006');
    assert.equal(org.sameAs.length, 4);
    assert.equal(org.address['@type'], 'PostalAddress');
    assert.equal(org.address.addressCountry, 'EG');
    assert.equal(org.employee.length, 4);
    assert.equal(org.contactPoint.telephone, '+20-11-3233-2148');
    assert.equal(org.contactPoint.email, 'info@mm-eg.co');
    if (!process.env.NEXT_PUBLIC_SITE_URL) {
      assert.ok(org.logo.url.startsWith('https://mm-eg.co/'));
    }

    const catalog = graph[2];
    assert.equal(catalog['@type'], 'ItemList');
    assert.ok(catalog.itemListElement);
    assert.equal(catalog.itemListElement.length, 10);
    for (const [index, entry] of catalog.itemListElement.entries()) {
      assert.deepEqual(entry, {
        '@type': 'ListItem',
        position: index + 1,
        name: paperTypes[index].name[locale],
        url: `${new URL(org.logo.url).origin}/${locale}/papers/${paperTypes[index].slug}`,
      });
    }

    const webPage = graph[3] as { '@type': string; dateModified: string };
    assert.equal(webPage['@type'], 'WebPage');
    assert.ok(webPage.dateModified);

    const breadcrumb = graph[4] as { '@type': string; itemListElement: unknown[] };
    assert.equal(breadcrumb['@type'], 'BreadcrumbList');
    assert.equal(breadcrumb.itemListElement.length, 2);

    const serviceList = graph[5] as { '@type': string; itemListElement: unknown[] };
    assert.equal(serviceList['@type'], 'ItemList');
    assert.equal(serviceList.itemListElement.length, 5);

    const faqPage = graph[6] as { '@type': string; mainEntity: unknown[] };
    assert.equal(faqPage['@type'], 'FAQPage');
    assert.equal(faqPage.mainEntity.length, 6);
  }
});
