import 'server-only';
import nodemailer, { type Transporter } from 'nodemailer';

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
  const to = (process.env.QUOTE_TO || user || 'info@mm-eg.co').trim();

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

/**
 * Send one formatted quotation email to the shared Hostinger mailbox (`QUOTE_TO`).
 * Intentionally omits Reply-To because the quotation form has no email field.
 */
export async function sendQuoteEmail(params: {
  subject: string;
  html: string;
  text: string;
}): Promise<void> {
  const config = readSmtpConfig();
  const transporter = getTransporter(config);

  await transporter.sendMail({
    from: config.from,
    to: config.to,
    subject: params.subject,
    html: params.html,
    text: params.text,
  });
}
