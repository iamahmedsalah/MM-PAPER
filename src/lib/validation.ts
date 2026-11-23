import { paperTypes } from '../data/papers.ts';

export interface QuoteFormInput {
  name: string;
  company: string;
  email: string;
  phone: string;
  paperTypeId: string;
  quantity: string;
  message: string;
}

export type QuoteValidationErrors = Partial<Record<keyof QuoteFormInput, string>>;

export interface QuoteValidationMessages {
  nameReq: string;
  nameShort: string;
  emailReq: string;
  emailBad: string;
  phoneBad: string;
  paperBad: string;
  messageReq: string;
  messageShort: string;
}

export interface NormalizedQuotePayload {
  name: string;
  company: string | null;
  email: string;
  phone: string | null;
  paper_type: string;
  quantity: string | null;
  message: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_CHARS_RE = /^[+\d][\d\s\-()]{6,}$/;

export function isValidPhoneNumber(raw: string): boolean {
  const trimmed = raw.trim();
  if (!trimmed) return true;
  if (!PHONE_CHARS_RE.test(trimmed)) return false;
  const digits = trimmed.replace(/\D/g, '');
  if (digits.length < 8 || digits.length > 18) return false;
  // Egyptian mobile format: 010/011/012/015 + 8 digits (11 digits) or +201...
  if (trimmed.startsWith('01')) {
    return /^01[0125]\d{8}$/.test(digits);
  }
  return true;
}

export function validateQuoteInput(
  input: QuoteFormInput,
  messages: QuoteValidationMessages
): QuoteValidationErrors {
  const errors: QuoteValidationErrors = {};
  const name = input.name.trim();
  const email = input.email.trim();
  const phone = input.phone.trim();
  const message = input.message.trim();

  if (!name) {
    errors.name = messages.nameReq;
  } else if (name.length < 2 || name.length > 120) {
    errors.name = messages.nameShort;
  }

  if (!email) {
    errors.email = messages.emailReq;
  } else if (email.length > 254 || !EMAIL_RE.test(email)) {
    errors.email = messages.emailBad;
  }

  if (phone && !isValidPhoneNumber(phone)) {
    errors.phone = messages.phoneBad;
  }

  if (!paperTypes.some((p) => p.id === input.paperTypeId)) {
    errors.paperTypeId = messages.paperBad;
  }

  if (!message) {
    errors.message = messages.messageReq;
  } else if (message.length < 5 || message.length > 2000) {
    errors.message = messages.messageShort;
  }

  return errors;
}

export function normalizeQuotePayload(input: QuoteFormInput): NormalizedQuotePayload {
  const selectedPaper = paperTypes.find((p) => p.id === input.paperTypeId) ?? paperTypes[0];
  const company = input.company.trim().slice(0, 120);
  const phone = input.phone.trim().slice(0, 40);
  const quantity = input.quantity.trim().slice(0, 120);

  return {
    name: input.name.trim().slice(0, 120),
    company: company || null,
    email: input.email.trim().toLowerCase().slice(0, 254),
    phone: phone || null,
    paper_type: selectedPaper.name.en,
    quantity: quantity || null,
    message: input.message.trim().slice(0, 2000),
  };
}
