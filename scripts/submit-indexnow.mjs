import fs from 'node:fs';
import path from 'node:path';

export const INDEXNOW_HOST = 'mm-eg.co';
export const INDEXNOW_KEY = '4f8a2c91e7b34d60a5c8f1e29b4d7a3c';
export const INDEXNOW_KEY_LOCATION = `https://${INDEXNOW_HOST}/${INDEXNOW_KEY}.txt`;

const PAPER_SLUGS = [
  'sticker-paper',
  'coloured-parchment',
  'bristol-board',
  'duplex-board-grey-back',
  'duplex-board-white-back',
  'butter-paper',
  'printing-paper',
  'copy-paper',
  'coated-paper-couche',
  'carbon-paper',
];

export function buildIndexNowUrlList(origin = `https://${INDEXNOW_HOST}`) {
  const base = origin.replace(/\/+$/, '');
  const urls = [`${base}/en`, `${base}/ar`];
  for (const slug of PAPER_SLUGS) {
    urls.push(`${base}/en/papers/${slug}`, `${base}/ar/papers/${slug}`);
  }
  return urls;
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const keyFile = path.resolve(process.cwd(), 'public', `${INDEXNOW_KEY}.txt`);

  if (!fs.existsSync(keyFile) || fs.readFileSync(keyFile, 'utf8').trim() !== INDEXNOW_KEY) {
    console.error(`IndexNow key file missing or mismatched: ${keyFile}`);
    process.exit(1);
  }

  const payload = {
    host: INDEXNOW_HOST,
    key: INDEXNOW_KEY,
    keyLocation: INDEXNOW_KEY_LOCATION,
    urlList: buildIndexNowUrlList(),
  };

  if (dryRun) {
    console.log(JSON.stringify(payload, null, 2));
    console.log(`Dry run OK — ${payload.urlList.length} URLs ready for IndexNow.`);
    return;
  }

  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(payload),
  });

  const body = await res.text().catch(() => '');
  console.log(`IndexNow response: HTTP ${res.status} ${res.statusText}`);
  if (body) console.log(body);

  if (res.status !== 200 && res.status !== 202) {
    process.exit(1);
  }

  console.log(`Successfully submitted ${payload.urlList.length} URLs to Bing / IndexNow.`);
}

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(import.meta.filename);
if (isDirectRun) {
  main().catch((err) => {
    console.error('IndexNow submission failed:', err);
    process.exit(1);
  });
}
