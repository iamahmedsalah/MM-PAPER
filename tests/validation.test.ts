import assert from 'node:assert/strict';
import test from 'node:test';
import {
  isValidPhoneNumber,
  normalizeQuotePayload,
  validateQuoteInput,
  type QuoteFormInput,
  type QuoteValidationMessages,
} from '../src/lib/validation.ts';

const messages: QuoteValidationMessages = {
  nameReq: 'Name required',
  nameShort: 'Name too short',
  emailReq: 'Email required',
  emailBad: 'Email invalid',
  phoneBad: 'Phone invalid',
  paperBad: 'Paper invalid',
  messageReq: 'Message required',
  messageShort: 'Message too short',
};

const validInput: QuoteFormInput = {
  name: 'Ahmed Salah',
  company: 'Cairo Print Co.',
  email: 'Buyer@Example.COM',
  phone: '011 3233 2148',
  paperTypeId: 'kraft',
  quantity: '10 tons / month',
  message: 'Need 120 GSM kraft reels cut to 1000 mm width.',
};

test('accepts a complete valid quote request with Egyptian phone', () => {
  const errors = validateQuoteInput(validInput, messages);
  assert.deepEqual(errors, {});
});

test('accepts international Egyptian mobile format and empty optional phone', () => {
  assert.equal(isValidPhoneNumber('+20 11 3233 2148'), true);
  assert.equal(isValidPhoneNumber('01132332148'), true);
  assert.equal(isValidPhoneNumber(''), true);
});

test('rejects invalid Egyptian or incomplete phone numbers', () => {
  assert.equal(isValidPhoneNumber('011323'), false);
  assert.equal(isValidPhoneNumber('01912345678'), false);
  const errors = validateQuoteInput({ ...validInput, phone: '12345' }, messages);
  assert.equal(errors.phone, messages.phoneBad);
});

test('validates required fields, lengths, email format, and paper grade ID', () => {
  const emptyErrors = validateQuoteInput(
    {
      name: '  ',
      company: '',
      email: '',
      phone: '',
      paperTypeId: 'unknown-grade',
      quantity: '',
      message: 'hi',
    },
    messages
  );
  assert.equal(emptyErrors.name, messages.nameReq);
  assert.equal(emptyErrors.email, messages.emailReq);
  assert.equal(emptyErrors.paperTypeId, messages.paperBad);
  assert.equal(emptyErrors.message, messages.messageShort);

  const shortNameErrors = validateQuoteInput({ ...validInput, name: 'A', email: 'bad@email' }, messages);
  assert.equal(shortNameErrors.name, messages.nameShort);
  assert.equal(shortNameErrors.email, messages.emailBad);
});

test('normalizes quote payload with trimmed fields, lowercase email, and canonical English paper grade', () => {
  const payload = normalizeQuotePayload({
    ...validInput,
    name: '  Ahmed Salah  ',
    company: '   ',
    paperTypeId: 'cardboard',
    quantity: ' 15 tons ',
  });

  assert.deepEqual(payload, {
    name: 'Ahmed Salah',
    company: null,
    email: 'buyer@example.com',
    phone: '011 3233 2148',
    paper_type: 'Cardboard',
    quantity: '15 tons',
    message: 'Need 120 GSM kraft reels cut to 1000 mm width.',
  });
});
