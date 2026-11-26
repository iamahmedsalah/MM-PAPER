'use server';

import { sendQuoteEmail } from '../../lib/mail';
import { buildQuoteConfirmationEmail } from '../../lib/email-template';
import {
  buildQuoteEmailContent,
  checkSpamSignals,
  parseQuoteInput,
  type QuoteFieldName,
} from '../../lib/quote-schema';
import { buildWhatsAppQuoteUrl } from '../../lib/whatsapp';

export interface QuoteActionState {
  ok: boolean;
  status: 'idle' | 'success' | 'error';
  message?: string;
  fieldErrors?: Partial<Record<QuoteFieldName, string>>;
  whatsappUrl?: string;
  submissionId?: number;
  confirmationEmailSent?: boolean;
}

function getStr(formData: FormData, key: string): string {
  const val = formData.get(key);
  return typeof val === 'string' ? val : '';
}

export async function submitQuote(
  _prevState: QuoteActionState,
  formData: FormData
): Promise<QuoteActionState> {
  const locale = getStr(formData, 'locale') === 'en' ? 'en' : 'ar';

  // Future Upstash IP rate-limit check would run here before schema parsing if approved.
  const spam = checkSpamSignals({
    website: getStr(formData, 'website'),
    startedAt: getStr(formData, 'startedAt'),
  });

  if (spam.isSpam) {
    return {
      ok: false,
      status: 'error',
      message:
        locale === 'en'
          ? 'Please take a moment to review the fields and submit again.'
          : 'يرجى التأكد من ملء البيانات بشكل طبيعي ثم إعادة المحاولة.',
    };
  }

  const parsed = parseQuoteInput(
    {
      name: getStr(formData, 'name'),
      company: getStr(formData, 'company'),
      phone: getStr(formData, 'phone'),
      email: getStr(formData, 'email'),
      paperTypeId: getStr(formData, 'paperTypeId'),
      gsm: getStr(formData, 'gsm'),
      size: getStr(formData, 'size'),
      format: getStr(formData, 'format'),
      quantity: getStr(formData, 'quantity'),
      governorate: getStr(formData, 'governorate'),
      notes: getStr(formData, 'notes'),
    },
    locale
  );

  if (!parsed.ok) {
    return {
      ok: false,
      status: 'error',
      fieldErrors: parsed.fieldErrors,
      message:
        locale === 'en'
          ? 'Please review the highlighted fields below.'
          : 'يرجى مراجعة الحقول المميزة أدناه وإكمال البيانات المطلوبة.',
    };
  }

  const emailPayload = buildQuoteEmailContent(parsed.data);

  try {
    await sendQuoteEmail(emailPayload);
  } catch (err) {
    console.error('[submitQuote] Quote delivery failed:', err instanceof Error ? err.message : 'Unknown error');
    return {
      ok: false,
      status: 'error',
      message:
        locale === 'en'
          ? 'We could not send your request right now. Please try again in a moment or call 011 3233 2148.'
          : 'تعذر إرسال طلبك حالياً. يرجى المحاولة مرة أخرى بعد لحظات أو التواصل مباشرة على 011 3233 2148.',
    };
  }

  let confirmationEmailSent: boolean | undefined;
  if (parsed.data.email) {
    const paperName = locale === 'ar' ? parsed.data.paperNameAr : parsed.data.paperNameEn;
    try {
      await sendQuoteEmail(buildQuoteConfirmationEmail(locale, paperName), parsed.data.email);
      confirmationEmailSent = true;
    } catch (err) {
      console.error('[submitQuote] Confirmation email failed:', err instanceof Error ? err.message : 'Unknown error');
      confirmationEmailSent = false;
    }
  }

  const whatsappUrl = buildWhatsAppQuoteUrl(parsed.data, process.env.WHATSAPP_NUMBER);

  // WhatsApp Business Cloud API server-side notification hook can be added here after email succeeds.

  return {
    ok: true,
    status: 'success',
    message:
      locale === 'en'
        ? 'Your quote request was emailed to our team! Click "Open WhatsApp" below if it did not open automatically.'
        : 'تم إرسال طلب عرض السعر إلى فريق المبيعات بنجاح! يمكنك فتح واتساب الآن لإرسال نفس الرسالة مباشرة.',
    whatsappUrl,
    submissionId: Date.now(),
    confirmationEmailSent,
  };
}
