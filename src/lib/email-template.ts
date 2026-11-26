import { COMPANY_CONTACT, COMPANY_LOCATION } from '../data/contact.ts';
import type { Lang } from '../i18n/types.ts';

export type EmailIconName =
  | 'user'
  | 'building'
  | 'phone'
  | 'layers'
  | 'scale'
  | 'ruler'
  | 'package'
  | 'mapPin'
  | 'hash'
  | 'message';

const SVG_ICON_PATHS: Record<EmailIconName, string> = {
  user: '<circle cx="12" cy="8" r="4"/><path d="M5 20a7 7 0 0 1 14 0"/>',
  building:
    '<path d="M4 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16M16 10h4a1 1 0 0 1 1 1v10M2 21h20M8 7h2M8 11h2M8 15h2M12 7h1M12 11h1M12 15h1"/>',
  phone:
    '<path d="M5.5 4h3l1.5 4-2 1.5a11 11 0 0 0 6.5 6.5l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A15.8 15.8 0 0 1 3.5 6.2 2 2 0 0 1 5.5 4Z"/>',
  layers: '<path d="m12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5"/>',
  scale: '<path d="M12 3v18M5 8h14M6 8l-2.5 5a3.2 3.2 0 0 0 5 0L6 8Zm12 0-2.5 5a3.2 3.2 0 0 0 5 0L18 8Z"/>',
  ruler: '<path d="M3 15.5 15.5 3 21 8.5 8.5 21 3 15.5ZM7.5 11l2 2M10.5 8l2 2M13.5 5l2 2"/>',
  package: '<path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Zm0 9 8-4.5M12 12v9M12 12 4 7.5M16 5.25l-8 4.5"/>',
  mapPin: '<path d="M12 21s7-6.2 7-11.2A7 7 0 0 0 5 9.8C5 14.8 12 21 12 21Z"/><circle cx="12" cy="10" r="2.5"/>',
  hash: '<path d="M9 4 7 20M17 4l-2 16M4 9h16M3 15h16"/>',
  message: '<path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7A2.5 2.5 0 0 1 17.5 16H9l-5 4V6.5Z"/>',
};

export const mmBrand = {
  navy: '#193051',
  midnight: '#0B1020',
  gold: '#C9A86A',
  goldText: '#9A7634',
  cream: '#F4EFE3',
  creamSoft: '#F7F4EC',
  muted: '#425472',
  line: '#DFD3BC',
  cardBorder: '#E6DBC7',
} as const;

/** Escape HTML entities safely before interpolating any user field into email markup. */
export function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

/** Strip CR/LF control characters so user input can never inject extra SMTP headers. */
export function stripHeaderNewlines(value: string): string {
  return value.replace(/[\r\n]+/g, ' ').trim();
}

export function renderEmailIcon(name: EmailIconName, color: string = mmBrand.gold, size = 15): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="display:inline-block;vertical-align:middle;flex-shrink:0;">${SVG_ICON_PATHS[name]}</svg>`;
}

export interface EmailDetailItem {
  icon: EmailIconName;
  label: string;
  /** Trusted, already-escaped HTML value. */
  valueHtml: string;
  fullWidth?: boolean;
}

/**
 * Email-safe 2-column card grid (collapses cleanly to 1 column on mobile)
 * matching the ALMORAD AMC transactional layout in MM Paper Industry colors.
 */
export function renderEmailDetailGrid(items: EmailDetailItem[], dir: 'rtl' | 'ltr' = 'rtl'): string {
  const ar = dir === 'rtl';
  const textAlign = ar ? 'right' : 'left';
  const iconGap = ar ? 'margin-left:6px;' : 'margin-right:6px;';
  const rows: string[] = [];
  let buffer: EmailDetailItem[] = [];

  const renderCell = (item: EmailDetailItem, colspan = 1) => `
    <td ${colspan > 1 ? `colspan="${colspan}"` : 'width="50%"'} class="${colspan > 1 ? 'mm-grid-full' : 'mm-grid-cell'}" valign="top" style="padding:6px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;background:#FFFFFF;border:1px solid ${mmBrand.cardBorder};border-radius:12px;">
        <tr>
          <td style="padding:13px 15px;text-align:${textAlign};">
            <div style="font-size:11px;font-weight:700;letter-spacing:${ar ? '0' : '0.04em'};text-transform:${ar ? 'none' : 'uppercase'};color:${mmBrand.goldText};line-height:1.4;margin-bottom:5px;">
              <span style="display:inline-block;vertical-align:middle;${iconGap}">${renderEmailIcon(item.icon, mmBrand.gold, 15)}</span><span style="vertical-align:middle;">${escapeHtml(item.label)}</span>
            </div>
            <div style="font-size:14px;line-height:1.6;color:${mmBrand.navy};font-weight:600;word-break:break-word;overflow-wrap:anywhere;">
              ${item.valueHtml}
            </div>
          </td>
        </tr>
      </table>
    </td>`;

  const flushPair = () => {
    if (buffer.length === 0) return;
    if (buffer.length === 1) {
      rows.push(`<tr>${renderCell(buffer[0]!, 2)}</tr>`);
    } else {
      rows.push(`<tr>${renderCell(buffer[0]!, 1)}${renderCell(buffer[1]!, 1)}</tr>`);
    }
    buffer = [];
  };

  for (const item of items) {
    if (item.fullWidth) {
      flushPair();
      rows.push(`<tr>${renderCell(item, 2)}</tr>`);
    } else {
      buffer.push(item);
      if (buffer.length === 2) flushPair();
    }
  }
  flushPair();

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:separate;border-spacing:0;margin:18px 0;padding:8px;background:${mmBrand.creamSoft};border:1px solid ${mmBrand.cardBorder};border-radius:16px;">${rows.join('')}</table>`;
}

export interface MmEmailLayoutInput {
  locale?: Lang;
  preheader?: string;
  heading: string;
  /** Trusted, already-escaped HTML content. */
  bodyHtml: string;
  primaryCta?: { label: string; url: string };
  secondaryCta?: { label: string; url: string };
  footerNote?: string;
}

function getSiteOrigin(): string {
  const raw = (process.env.NEXT_PUBLIC_SITE_URL || 'https://mm-eg.co').trim();
  return raw.replace(/\/+$/, '');
}

/**
 * Reusable MM Paper Industry email shell with a table layout and inline CSS
 * so Gmail, Outlook, and mobile mail apps render consistently.
 */
export function renderMmEmailLayout(input: MmEmailLayoutInput): string {
  const locale = input.locale ?? 'ar';
  const ar = locale === 'ar';
  const dir = ar ? 'rtl' : 'ltr';
  const companyName = ar ? 'إم إم لصناعة الورق' : 'MM Paper Industry';
  const tagline = ar
    ? 'عراقة ممتدة منذ عام 2006 · استيراد وتجهيز وتجارة الورق'
    : 'Since 2006 · Paper import, converting and supply';
  const origin = getSiteOrigin();
  const siteHref = input.locale ? `${origin}/${locale}` : origin;
  const logoCid = 'cid:mm-logo';
  const font = "'Cairo', Tahoma, 'Segoe UI', Arial, sans-serif";
  const ctaButtons = [
    input.primaryCta
      ? `<a href="${escapeHtml(input.primaryCta.url)}" style="display:inline-block;margin:0 6px 8px;background:${mmBrand.gold};color:${mmBrand.midnight};font-weight:700;font-size:14px;text-decoration:none;padding:12px 24px;border-radius:12px;">${escapeHtml(input.primaryCta.label)}</a>`
      : '',
    input.secondaryCta
      ? `<a href="${escapeHtml(input.secondaryCta.url)}" style="display:inline-block;margin:0 6px 8px;background:${mmBrand.navy};color:${mmBrand.cream};font-weight:700;font-size:14px;text-decoration:none;padding:12px 24px;border-radius:12px;">${escapeHtml(input.secondaryCta.label)}</a>`
      : '',
  ]
    .filter(Boolean)
    .join('');

  const ctaSection = ctaButtons
    ? `<tr><td style="padding:4px 28px 26px;text-align:center;">${ctaButtons}</td></tr>`
    : '';

  return `<!DOCTYPE html>
<html dir="${dir}" lang="${locale}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<title>${escapeHtml(input.heading)}</title>
<style>
@media only screen and (max-width:560px){
  .mm-grid-cell{display:block!important;width:100%!important;box-sizing:border-box!important;}
  .mm-body-pad{padding:24px 16px 12px!important;}
}
</style>
</head>
<body style="margin:0;padding:0;background:${mmBrand.creamSoft};font-family:${font};color:${mmBrand.midnight};direction:${dir};">
<span style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(input.preheader || input.heading)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${mmBrand.creamSoft};">
<tr><td align="center" style="padding:28px 12px;">
  <table role="presentation" width="640" cellpadding="0" cellspacing="0" style="width:100%;max-width:640px;background:#FFFFFF;border:1px solid ${mmBrand.line};border-radius:20px;overflow:hidden;">
    <tr><td style="background:${mmBrand.navy};padding:26px 32px;text-align:center;">
      <a href="${escapeHtml(siteHref)}" style="text-decoration:none;color:${mmBrand.cream};">
        <img src="${logoCid}" width="64" height="64" alt="${companyName}" style="display:block;width:64px;height:64px;border:0;margin:0 auto 10px;border-radius:12px;"/>
        <div style="font-size:18px;font-weight:700;color:${mmBrand.cream};line-height:1.3;">${companyName}</div>
        <div style="font-size:12px;color:#E0C795;margin-top:4px;">${tagline}</div>
      </a>
    </td></tr>
    <tr><td style="height:4px;background:${mmBrand.gold};font-size:0;line-height:0;">&nbsp;</td></tr>
    <tr><td class="mm-body-pad" style="padding:30px 28px 12px;text-align:center;">
      <h1 style="margin:0 0 10px;font-size:24px;line-height:1.35;color:${mmBrand.navy};">${escapeHtml(input.heading)}</h1>
      <div style="font-size:15px;line-height:1.75;color:${mmBrand.midnight};">${input.bodyHtml}</div>
    </td></tr>
    ${ctaSection}
    ${input.footerNote ? `<tr><td style="padding:0 28px 24px;text-align:center;font-size:13px;line-height:1.6;color:${mmBrand.muted};">${escapeHtml(input.footerNote)}</td></tr>` : ''}
    <tr><td style="background:${mmBrand.navy};padding:22px 28px;text-align:center;font-size:13px;line-height:1.8;color:#C2CADA;">
      <a href="${escapeHtml(siteHref)}" style="color:${mmBrand.cream};text-decoration:underline;font-weight:600;">${escapeHtml(origin.replace(/^https?:\/\//, ''))}</a>
      &nbsp;·&nbsp;
      <a href="${escapeHtml(COMPANY_CONTACT.salesEmailHref)}" style="color:${mmBrand.cream};text-decoration:underline;">${escapeHtml(COMPANY_CONTACT.salesEmail)}</a>
      &nbsp;·&nbsp;
      <span dir="ltr" style="color:${mmBrand.cream};">${escapeHtml(COMPANY_CONTACT.phoneDisplay)}</span>
      <p style="margin:10px 0 0;color:${mmBrand.cream};">${renderEmailIcon('mapPin', mmBrand.gold, 14)} <span style="vertical-align:middle;">${escapeHtml(COMPANY_LOCATION.address[locale])}</span></p>
      <p style="margin:8px 0 0;">
        <a href="${escapeHtml(COMPANY_LOCATION.googleMapsUrl)}" style="display:inline-block;padding:6px 10px;color:${mmBrand.cream};text-decoration:underline;">${ar ? 'فتح الموقع على Google Maps' : 'Open in Google Maps'}</a>
        <a href="${escapeHtml(COMPANY_CONTACT.whatsappHref)}" style="display:inline-block;padding:6px 10px;color:${mmBrand.cream};text-decoration:underline;">${ar ? 'واتساب الشركة' : 'Company WhatsApp'}</a>
      </p>
      <div style="margin-top:10px;color:#94A0B8;font-size:12px;">© ${new Date().getFullYear()} ${companyName} · ${ar ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}</div>
    </td></tr>
  </table>
</td></tr>
</table>
</body>
</html>`;
}

export function buildQuoteConfirmationEmail(locale: Lang, paperName: string) {
  const ar = locale === 'ar';
  const heading = ar ? 'تم استلام طلب عرض السعر' : 'We received your quote request';
  const companyName = ar ? 'إم إم لصناعة الورق' : 'MM Paper Industry';
  const description = ar
    ? 'شكرًا لتواصلك معنا. استلم فريق المبيعات طلبك وسيراجع المواصفات ويتواصل معك لاستكمال عرض السعر.'
    : 'Thank you for contacting us. Our sales team will review your specifications and get back to you about your quote.';
  const productLabel = ar ? 'نوع الورق' : 'Paper grade';
  const whatsappLabel = ar ? 'تواصل مع المبيعات على واتساب' : 'Contact sales on WhatsApp';
  const mapLabel = ar ? 'الموقع على الخريطة' : 'Location on Google Maps';

  return {
    subject: `${heading} — ${companyName}`,
    html: renderMmEmailLayout({
      locale,
      heading,
      preheader: description,
      bodyHtml: `<p style="margin:0;">${escapeHtml(description)}</p>${renderEmailDetailGrid(
        [{ icon: 'layers', label: productLabel, valueHtml: escapeHtml(paperName) }],
        ar ? 'rtl' : 'ltr',
      )}`,
      primaryCta: { label: whatsappLabel, url: COMPANY_CONTACT.whatsappHref },
    }),
    text: [
      heading,
      description,
      `${productLabel}: ${paperName}`,
      '',
      `${whatsappLabel}: ${COMPANY_CONTACT.whatsappHref}`,
      COMPANY_CONTACT.salesEmail,
      COMPANY_LOCATION.address[locale],
      `${mapLabel}: ${COMPANY_LOCATION.googleMapsUrl}`,
    ].join('\n'),
  };
}
