import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { get } from 'node:http';
import { createServer } from 'node:net';
import { resolve } from 'node:path';

const HOST = '127.0.0.1';
const NEXT_BIN = resolve(process.cwd(), 'node_modules/next/dist/bin/next');

function findFreePort() {
  return new Promise((res, rej) => {
    const srv = createServer();
    srv.unref();
    srv.on('error', rej);
    srv.listen(0, HOST, () => {
      const addr = srv.address();
      const port = typeof addr === 'object' && addr ? addr.port : 4173;
      srv.close(() => res(port));
    });
  });
}

const PORT = process.env.SMOKE_PORT ? Number(process.env.SMOKE_PORT) : await findFreePort();
const BASE = `http://${HOST}:${PORT}`;

function fetchForHost(path, host) {
  return new Promise((resolve, reject) => {
    get(`${BASE}${path}`, { headers: { host } }, (response) => {
      response.resume();
      resolve(response);
    }).on('error', reject);
  });
}

async function waitForServer(timeoutMs = 20000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`${BASE}/en`);
      if (res.status === 200) return;
    } catch {
      // server still booting
    }
    await new Promise((r) => setTimeout(r, 300));
  }
  throw new Error(`Timed out waiting for Next.js server on ${BASE}`);
}

async function runSmokeChecks() {
  const root = await fetch(`${BASE}/`, { redirect: 'manual' });
  assert.ok([307, 308].includes(root.status), `Expected redirect at /, got ${root.status}`);
  assert.ok(root.headers.get('location')?.endsWith('/en'), 'Root / should redirect to /en');

  if (process.env.REDIRECT_VERCEL_APP === '1') {
    for (const path of ['/', '/en', '/ar/papers/sticker-paper?ref=old-link']) {
      const res = await fetchForHost(path, 'mm-paper.vercel.app');
      assert.equal(res.statusCode, 308, `Expected permanent domain redirect for ${path}`);
      assert.equal(new URL(res.headers.location).href, `https://mm-eg.co${path}`);
    }

    const canonical = await fetchForHost('/ar', 'mm-eg.co');
    assert.equal(canonical.statusCode, 200, 'The canonical host should serve the page directly');
  }

  const enRes = await fetch(`${BASE}/en`);
  assert.equal(enRes.status, 200);
  const enHtml = await enRes.text();
  assert.match(enHtml, /lang="en"/);
  assert.match(enHtml, /dir="ltr"/);
  assert.match(enHtml, /data-scroll-behavior="smooth"/);
  assert.match(enHtml, /MM Paper Industry/);
  assert.match(enHtml, /011 3233 2148/);
  assert.match(enHtml, /info@mm-eg\.co/);
  assert.match(enHtml, /application\/ld\+json/);
  assert.match(enHtml, /href[Ll]ang="ar"/);
  assert.match(enHtml, /favicon\.svg/);
  assert.match(enHtml, /favicon-light\.svg/);
  assert.match(enHtml, /favicon-dark\.svg/);
  assert.match(enHtml, /android-chrome-192\.png/);
  assert.match(enHtml, /android-chrome-512\.png/);
  assert.match(enHtml, /apple-touch-icon\.png/);
  assert.match(enHtml, /<meta name="theme-color"/);
  assert.match(enHtml, /<meta name="color-scheme"/);
  assert.match(enHtml, /FAQPage/);
  assert.match(enHtml, /BreadcrumbList/);
  const enPaperLinks = [...enHtml.matchAll(/href="(\/en\/papers\/[^"/]+)"/g)];
  assert.equal(enPaperLinks.length, 10);
  assert.equal(new Set(enPaperLinks.map((match) => match[1])).size, 10);
  assert.match(enHtml, /Frequently asked questions/);
  assert.equal(enHtml.includes('sales@mmpaper.com'), false, 'Legacy placeholder email leaked into /en');
  assert.equal(enHtml.includes('sales@mmpaperindustry.com'), false, 'Old domain email leaked into /en');

  const arRes = await fetch(`${BASE}/ar`);
  assert.equal(arRes.status, 200);
  const arHtml = await arRes.text();
  assert.match(arHtml, /lang="ar"/);
  assert.match(arHtml, /dir="rtl"/);
  assert.match(arHtml, /favicon\.svg/);
  assert.match(arHtml, /favicon-light\.svg/);
  assert.match(arHtml, /favicon-dark\.svg/);
  assert.match(arHtml, /android-chrome-192\.png/);
  assert.match(arHtml, /android-chrome-512\.png/);
  assert.match(arHtml, /apple-touch-icon\.png/);
  assert.match(arHtml, /<meta name="theme-color"/);
  assert.match(arHtml, /<meta name="color-scheme"/);
  assert.match(arHtml, /FAQPage/);
  assert.match(arHtml, /BreadcrumbList/);
  const arPaperLinks = [...arHtml.matchAll(/href="(\/ar\/papers\/[^"/]+)"/g)];
  assert.equal(arPaperLinks.length, 10);
  assert.equal(new Set(arPaperLinks.map((match) => match[1])).size, 10);
  assert.match(arHtml, /الأسئلة الشائعة/);
  assert.match(arHtml, /إم إم لصناعة الورق/);
  assert.match(arHtml, /شركة مصرية رائدة/);
  assert.match(arHtml, /مستورد ومورد رئيسي/);
  assert.match(arHtml, /011 3233 2148/);
  assert.match(arHtml, /info@mm-eg\.co/);

  const robotsRes = await fetch(`${BASE}/robots.txt`);
  assert.equal(robotsRes.status, 200);
  const robotsTxt = await robotsRes.text();
  assert.match(robotsTxt, /Allow: \//);
  assert.match(robotsTxt, /GPTBot/);
  assert.match(robotsTxt, /OAI-SearchBot/);
  assert.match(robotsTxt, /PerplexityBot/);
  assert.match(robotsTxt, /ClaudeBot/);
  assert.match(robotsTxt, /Sitemap:/i);

  const llmsRes = await fetch(`${BASE}/llms.txt`);
  assert.equal(llmsRes.status, 200);
  const llmsTxt = await llmsRes.text();
  assert.match(llmsTxt, /MM Paper Industry/);
  assert.match(llmsTxt, /011 3233 2148/);
  assert.match(llmsTxt, /info@mm-eg\.co/);
  assert.match(llmsTxt, /https:\/\/mm-eg\.co/);

  const sitemapRes = await fetch(`${BASE}/sitemap.xml`);
  assert.equal(sitemapRes.status, 200);
  const sitemapXml = await sitemapRes.text();
  assert.match(sitemapXml, /\/en</);
  assert.match(sitemapXml, /\/ar</);
  assert.match(sitemapXml, /<lastmod>/);
  assert.match(sitemapXml, /<image:image>/);

  const manifestRes = await fetch(`${BASE}/manifest.webmanifest`);
  assert.equal(manifestRes.status, 200);
  const manifestJson = await manifestRes.json();
  assert.equal(manifestJson.name, 'MM Paper Industry');

  const assets = [
    '/favicon.ico',
    '/favicon.svg',
    '/favicon-light.svg',
    '/favicon-dark.svg',
    '/apple-touch-icon.png',
    '/favicon-16.png',
    '/favicon-32.png',
    '/android-chrome-192.png',
    '/android-chrome-512.png',
    '/brand/mm-logo-dark.svg',
    '/brand/mm-logo-light.svg',
    '/brand/mm-bimi.svg',
    '/media/mm-logo-paper-motion.webm',
    '/team/mohamed-morad.webp',
    '/team/khaled-morad.webp',
    '/team/ahmed-morad.webp',
    '/team/mohamed-mohamed-morad.webp',
    '/papers/sticker.webp',
    '/papers/parchment.webp',
    '/papers/bristol.webp',
    '/papers/duplex-grey.webp',
    '/papers/duplex-white.webp',
    '/papers/butter.webp',
    '/papers/offset.webp',
    '/papers/copy.webp',
    '/papers/coated.webp',
    '/papers/carbon.webp',
  ];
  for (const asset of assets) {
    const res = await fetch(`${BASE}${asset}`);
    assert.equal(res.status, 200, `Asset ${asset} returned ${res.status}`);
  }

  console.log(`Smoke check passed on ${BASE}: /, /en, /ar, /robots.txt, /sitemap.xml, /manifest.webmanifest, favicons, and SVGs.`);
}

const server = spawn(process.execPath, [NEXT_BIN, 'start', '-p', String(PORT), '-H', HOST], {
  stdio: ['ignore', 'pipe', 'pipe'],
});

let stderrLog = '';
server.stderr?.on('data', (chunk) => {
  stderrLog += chunk.toString();
});

try {
  await waitForServer();
  await runSmokeChecks();
} catch (err) {
  console.error('Smoke check failed:', err);
  if (stderrLog) console.error('Server stderr:\n', stderrLog);
  process.exitCode = 1;
} finally {
  if (!server.killed) {
    server.kill('SIGTERM');
    await new Promise((r) => setTimeout(r, 300));
    if (!server.killed) server.kill('SIGKILL');
  }
}
