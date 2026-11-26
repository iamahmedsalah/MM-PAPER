import assert from 'node:assert/strict';
import test from 'node:test';
import nodemailer from 'nodemailer';
import { COMPANY_CONTACT, COMPANY_LOCATION } from '../src/data/contact.ts';
import {
  buildQuoteEmailContent,
  checkSpamSignals,
  escapeHtml,
  MIN_FILL_TIME_MS,
  normalizeEgyptianMobile,
  parseQuoteInput,
  stripHeaderNewlines,
} from '../src/lib/quote-schema.ts';
import { buildWhatsAppQuoteUrl, sanitizeWhatsAppNumber } from '../src/lib/whatsapp.ts';

test('normalizes valid Egyptian mobile formats and rejects invalid numbers', () => {
  assert.deepEqual(normalizeEgyptianMobile('011 3233 2148'), {
    display: '01132332148',
    intlDigits: '201132332148',
  });
  assert.deepEqual(normalizeEgyptianMobile('+20 101-234-5678'), {
    display: '01012345678',
    intlDigits: '201012345678',
  });
  assert.deepEqual(normalizeEgyptianMobile('00201555555555'), {
    display: '01555555555',
    intlDigits: '201555555555',
  });

  assert.equal(normalizeEgyptianMobile('01912345678'), null);
  assert.equal(normalizeEgyptianMobile('011323321'), null);
  assert.equal(normalizeEgyptianMobile('not-a-phone'), null);
});

test('parses valid full quotation payload and optional minimal payload', () => {
  const full = parseQuoteInput({
    name: '  أحمد محمود  ',
    company: '  مطبعة النيل  ',
    phone: '011 3233 2148',
    paperTypeId: 'duplex-white',
    gsm: '300',
    size: '70×100',
    format: 'both',
    quantity: '5 طن',
    governorate: 'alexandria',
    notes: 'التسليم خلال أسبوع',
  });

  assert.equal(full.ok, true);
  if (!full.ok) return;
  assert.equal(full.data.name, 'أحمد محمود');
  assert.equal(full.data.company, 'مطبعة النيل');
  assert.equal(full.data.phoneDisplay, '01132332148');
  assert.equal(full.data.phoneIntl, '201132332148');
  assert.equal(full.data.paperNameAr, 'ورق الدوبليكس ـ ظهر أبيض');
  assert.equal(full.data.formatLabelAr, 'الاثنان');
  assert.equal(full.data.governorateAr, 'الإسكندرية');

  const minimal = parseQuoteInput({
    name: 'محمد علي',
    phone: '01012345678',
    paperTypeId: 'copy',
    format: 'sheet',
  });
  assert.equal(minimal.ok, true);
  if (!minimal.ok) return;
  assert.equal(minimal.data.company, '');
  assert.equal(minimal.data.governorateAr, '');
});

test('rejects missing/short fields, invalid paper grade, invalid format, invalid governorate, and long notes', () => {
  const invalid = parseQuoteInput(
    {
      name: 'أ',
      phone: '12345',
      paperTypeId: 'non-existent',
      format: 'roll',
      governorate: 'atlantis',
      notes: 'x'.repeat(2005),
    },
    'ar'
  );

  assert.equal(invalid.ok, false);
  if (invalid.ok) return;
  assert.ok(invalid.fieldErrors.name);
  assert.ok(invalid.fieldErrors.phone);
  assert.ok(invalid.fieldErrors.paperTypeId);
  assert.ok(invalid.fieldErrors.format);
  assert.ok(invalid.fieldErrors.governorate);
  assert.ok(invalid.fieldErrors.notes);
});

test('trips spam checks on non-empty honeypot or fast submit', () => {
  const now = 1_700_000_000_000;
  assert.deepEqual(checkSpamSignals({ website: 'https://spam.example', startedAt: String(now - 10_000), now }), {
    isSpam: true,
    reason: 'honeypot',
  });
  assert.deepEqual(
    checkSpamSignals({ website: '', startedAt: String(now - (MIN_FILL_TIME_MS - 500)), now }),
    { isSpam: true, reason: 'too_fast' }
  );
  assert.deepEqual(
    checkSpamSignals({ website: '', startedAt: String(now - (MIN_FILL_TIME_MS + 1000)), now }),
    { isSpam: false }
  );
});

test('escapes HTML, strips CR/LF from headers, and builds RTL email + WhatsApp URL', () => {
  assert.equal(stripHeaderNewlines('Name\r\nBcc: attacker@evil.test'), 'Name Bcc: attacker@evil.test');
  assert.equal(escapeHtml('<script>"test"&\'x\'</script>'), '&lt;script&gt;&quot;test&quot;&amp;&#39;x&#39;&lt;/script&gt;');

  const parsed = parseQuoteInput({
    name: 'عميل\r\n<script>alert(1)</script>',
    company: 'شركة & مطبعة "الرواد"',
    phone: '01234567890',
    paperTypeId: 'sticker',
    gsm: '80',
    size: '70×100',
    format: 'reel',
    quantity: '3 طن',
    governorate: 'cairo',
    notes: '<img src=x onerror=alert(1)>',
  });
  assert.equal(parsed.ok, true);
  if (!parsed.ok) return;

  const email = buildQuoteEmailContent(parsed.data);
  assert.equal(/[\r\n]/.test(email.subject), false);
  assert.ok(email.subject.startsWith('طلب عرض سعر جديد — '));
  assert.ok(email.html.includes('dir="rtl"'));
  assert.ok(email.html.includes('cid:mm-logo'));
  assert.ok(email.html.includes('mm-grid-cell'));
  assert.ok(email.html.includes('#193051'));
  assert.ok(email.html.includes('#C9A86A'));
  assert.ok(email.html.includes('برج العرب الجديدة'));
  assert.ok(email.html.includes('info@mm-eg.co'));
  assert.equal(email.html.includes('<script>'), false);
  assert.equal(email.html.includes('<img src=x'), false);
  assert.ok(email.html.includes('&lt;script&gt;alert(1)&lt;/script&gt;'));
  assert.ok(email.html.includes('tel:+201234567890'));
  assert.ok(email.html.includes('https://wa.me/201234567890'));
  assert.ok(email.text.includes('tel:+201234567890'));
  assert.ok(email.html.includes(`href="${escapeHtml(COMPANY_LOCATION.googleMapsUrl)}"`));
  assert.ok(email.html.includes(`href="${COMPANY_CONTACT.whatsappHref}"`));
  assert.ok(email.text.includes(COMPANY_LOCATION.address.ar));
  assert.ok(email.text.includes(COMPANY_LOCATION.googleMapsUrl));
  assert.ok(email.text.includes(COMPANY_CONTACT.whatsappHref));

  assert.equal(sanitizeWhatsAppNumber('+20 11 3233 2148'), '201132332148');
  const waUrl = buildWhatsAppQuoteUrl(parsed.data, '+20 11 3233 2148');
  assert.ok(waUrl.startsWith('https://wa.me/201132332148?text='));
  const decoded = decodeURIComponent(waUrl.split('?text=')[1]);
  assert.ok(decoded.includes('ورق استيكر'));
  assert.ok(decoded.includes('01234567890'));
  assert.ok(decoded.includes('بكر'));
  assert.ok(decoded.includes('القاهرة'));
});

test('Nodemailer transport surfaces rejection cleanly on unreachable SMTP failure', async () => {
  const transporter = nodemailer.createTransport({
    host: '127.0.0.1',
    port: 1,
    secure: false,
    auth: { user: 'info@mm-eg.co', pass: 'wrong-pass' },
    connectionTimeout: 500,
    greetingTimeout: 500,
  });

  await assert.rejects(() =>
    transporter.sendMail({
      from: 'info@mm-eg.co',
      to: 'info@mm-eg.co',
      subject: 'Test',
      text: 'Test',
    })
  );
  transporter.close();
});
