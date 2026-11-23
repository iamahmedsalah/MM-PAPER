import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
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

  const enRes = await fetch(`${BASE}/en`);
  assert.equal(enRes.status, 200);
  const enHtml = await enRes.text();
  assert.match(enHtml, /lang="en"/);
  assert.match(enHtml, /dir="ltr"/);
  assert.match(enHtml, /data-scroll-behavior="smooth"/);
  assert.match(enHtml, /MM Paper Industry/);
  assert.match(enHtml, /011 3233 2148/);
  assert.match(enHtml, /sales@mmpaperindustry\.com/);
  assert.match(enHtml, /application\/ld\+json/);
  assert.match(enHtml, /href[Ll]ang="ar"/);
  assert.equal(enHtml.includes('sales@mmpaper.com'), false, 'Legacy placeholder email leaked into /en');

  const arRes = await fetch(`${BASE}/ar`);
  assert.equal(arRes.status, 200);
  const arHtml = await arRes.text();
  assert.match(arHtml, /lang="ar"/);
  assert.match(arHtml, /dir="rtl"/);
  assert.match(arHtml, /إم إم لصناعة الورق/);
  assert.match(arHtml, /شركة مصرية رائدة/);
  assert.match(arHtml, /مستورد ومورد رئيسي/);
  assert.match(arHtml, /011 3233 2148/);
  assert.match(arHtml, /sales@mmpaperindustry\.com/);

  const robotsRes = await fetch(`${BASE}/robots.txt`);
  assert.equal(robotsRes.status, 200);
  const robotsTxt = await robotsRes.text();
  assert.match(robotsTxt, /Sitemap:/i);

  const sitemapRes = await fetch(`${BASE}/sitemap.xml`);
  assert.equal(sitemapRes.status, 200);
  const sitemapXml = await sitemapRes.text();
  assert.match(sitemapXml, /\/en</);
  assert.match(sitemapXml, /\/ar</);

  const manifestRes = await fetch(`${BASE}/manifest.webmanifest`);
  assert.equal(manifestRes.status, 200);
  const manifestJson = await manifestRes.json();
  assert.equal(manifestJson.name, 'MM Paper Industry');

  for (const asset of ['/mm-logo-dark.svg', '/mm-logo-light.svg']) {
    const res = await fetch(`${BASE}${asset}`);
    assert.equal(res.status, 200, `Asset ${asset} returned ${res.status}`);
  }

  console.log(`Smoke check passed on ${BASE}: /, /en, /ar, /robots.txt, /sitemap.xml, /manifest.webmanifest, SVGs.`);
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
