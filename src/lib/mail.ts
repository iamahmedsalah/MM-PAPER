import 'server-only';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { AccountApi, Configuration, SendApi, type V1SendRequest } from 'hostinger-mail-api-sdk';
import nodemailer, { type Transporter } from 'nodemailer';
import { COMPANY_CONTACT } from '../data/contact.ts';

/**
 * One-line switch: set to `true` if Hostinger SMTP rejects an alias in `MAIL_FROM`
 * so outgoing messages keep the display name while using `SMTP_USER` as the From address.
 */
const USE_SMTP_USER_AS_FROM = false;

interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
  to: string;
}

interface QuoteEmail {
  subject: string;
  html: string;
  text: string;
}

const globalForMail = globalThis as typeof globalThis & {
  __mmSmtpTransporter?: Transporter;
  __mmSmtpKey?: string;
};

/** Resolve the From header cleanly, falling back to `SMTP_USER` if configured. */
export function resolveMailFrom(smtpUser: string, mailFrom?: string): string {
  const trimmedFrom = (mailFrom || '').trim();
  if (!trimmedFrom) {
    return `MM Paper Industry <${smtpUser}>`;
  }
  if (!USE_SMTP_USER_AS_FROM) {
    return trimmedFrom;
  }

  const displayMatch = trimmedFrom.match(/^\s*"?([^"<]+?)"?\s*<[^>]+>\s*$/);
  const displayName = displayMatch?.[1]?.trim();
  return displayName ? `${displayName} <${smtpUser}>` : smtpUser;
}

function readSmtpConfig(): SmtpConfig {
  const host = (process.env.SMTP_HOST || 'smtp.hostinger.com').trim();
  const portRaw = Number(process.env.SMTP_PORT || '465');
  const port = Number.isFinite(portRaw) && portRaw > 0 ? portRaw : 465;
  const secure = port === 465;
  const user = (process.env.SMTP_USER || '').trim();
  const pass = process.env.SMTP_PASS || '';
  const to = (process.env.QUOTE_TO || user || COMPANY_CONTACT.salesEmail).trim();

  if (!user || !pass) {
    throw new Error('SMTP credentials (SMTP_USER / SMTP_PASS) are not configured.');
  }

  return {
    host,
    port,
    secure,
    user,
    pass,
    from: resolveMailFrom(user, process.env.MAIL_FROM),
    to,
  };
}

function getTransporter(config: SmtpConfig): Transporter {
  const cacheKey = `${config.host}:${config.port}:${config.user}`;
  if (globalForMail.__mmSmtpTransporter && globalForMail.__mmSmtpKey === cacheKey) {
    return globalForMail.__mmSmtpTransporter;
  }

  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });

  globalForMail.__mmSmtpTransporter = transporter;
  globalForMail.__mmSmtpKey = cacheKey;
  return transporter;
}

async function sendWithHostingerApi(email: QuoteEmail, accessToken: string, logoPath: string): Promise<void> {
  const configuration = new Configuration({ accessToken, baseOptions: { timeout: 8_000 } });
  const { data } = await new AccountApi(configuration).getCurrentAccount();
  const mailbox = data.data.mailboxes.find(({ address }) => address.toLowerCase() === COMPANY_CONTACT.salesEmail);
  if (!mailbox?.resourceId) {
    throw new Error('Hostinger Mail API token cannot access the company mailbox.');
  }

  const content = existsSync(logoPath) ? await readFile(logoPath, 'base64') : undefined;
  const message = {
    ...email,
    displayName: 'MM Paper Industry',
    to: [process.env.QUOTE_TO?.trim() || COMPANY_CONTACT.salesEmail],
    attachments: content ? [{ filename: 'mm-logo.png', content, contentType: 'image/png', cid: 'mm-logo', encoding: 'base64' }] : [],
  } satisfies Pick<V1SendRequest, 'subject' | 'html' | 'text' | 'displayName' | 'to' | 'attachments'>;

  // The SDK's generated type requires optional CC, BCC, and threading fields.
  await new SendApi(configuration).sendEmail(mailbox.resourceId, message as V1SendRequest);
}

/** Send a formatted quote to the configured recipient. */
export async function sendQuoteEmail(params: QuoteEmail): Promise<void> {
  const logoPath = join(process.cwd(), 'public', 'android-chrome-192.png');
  const accessToken = process.env.HOSTINGER_MAIL_API_TOKEN?.trim();
  if (accessToken) {
    await sendWithHostingerApi(params, accessToken, logoPath);
    return;
  }

  const config = readSmtpConfig();
  const transporter = getTransporter(config);
  const attachments = existsSync(logoPath)
    ? [{ filename: 'mm-logo.png', path: logoPath, cid: 'mm-logo' }]
    : undefined;

  await transporter.sendMail({
    from: config.from,
    to: config.to,
    ...params,
    attachments,
  });
}
