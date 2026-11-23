'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Mail, Phone, MessageCircle, Loader2, Info } from 'lucide-react';
import SectionHeader from './SectionHeader';
import { GoldButton } from './ui/Buttons';
import { Reveal } from './ui/Reveal';
import { SocialIcon } from './ui/SocialIcons';
import { COMPANY_CONTACT } from '../data/contact';
import { paperTypes } from '../data/papers';
import { socialChannels } from '../data/socials';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import {
  normalizeQuotePayload,
  validateQuoteInput,
  type QuoteFormInput,
  type QuoteValidationErrors,
} from '../lib/validation';
import { useLang } from '../i18n/LanguageContext';

const initialForm: QuoteFormInput = {
  name: '',
  company: '',
  email: '',
  phone: '',
  paperTypeId: paperTypes[0].id,
  quantity: '',
  message: '',
};

const inputClass =
  'min-h-[46px] w-full rounded-sm border border-line/20 bg-canvas/70 px-4 py-3 text-base text-ink placeholder:text-inkSubtle/70 transition-shadow duration-200 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/40 sm:text-sm';

export default function ContactForm({ preselectedPaperId }: { preselectedPaperId?: string }) {
  const { t, L } = useLang();
  const [form, setForm] = useState<QuoteFormInput>(initialForm);
  const [errors, setErrors] = useState<QuoteValidationErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof QuoteFormInput, boolean>>>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [toast, setToast] = useState<{ kind: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (preselectedPaperId && paperTypes.some((p) => p.id === preselectedPaperId)) {
      setForm((f) => ({ ...f, paperTypeId: preselectedPaperId }));
    }
  }, [preselectedPaperId]);

  const validationMessages = useMemo(
    () => ({
      nameReq: t.contact.nameReq,
      nameShort: t.contact.nameShort,
      emailReq: t.contact.emailReq,
      emailBad: t.contact.emailBad,
      phoneBad: t.contact.phoneBad,
      paperBad: t.contact.paperBad,
      messageReq: t.contact.messageReq,
      messageShort: t.contact.messageShort,
    }),
    [
      t.contact.nameReq,
      t.contact.nameShort,
      t.contact.emailReq,
      t.contact.emailBad,
      t.contact.phoneBad,
      t.contact.paperBad,
      t.contact.messageReq,
      t.contact.messageShort,
    ]
  );

  const fieldError = (key: keyof QuoteFormInput) => (touched[key] ? errors[key] : undefined);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 5000);
    return () => window.clearTimeout(id);
  }, [toast]);

  const set =
    (key: keyof QuoteFormInput) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value = e.target.value;
      setForm((f) => {
        const next = { ...f, [key]: value };
        if (touched[key]) setErrors(validateQuoteInput(next, validationMessages));
        return next;
      });
    };

  const blur = (key: keyof QuoteFormInput) => () => {
    setTouched((prev) => ({ ...prev, [key]: true }));
    setErrors(validateQuoteInput(form, validationMessages));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateQuoteInput(form, validationMessages);
    setErrors(errs);
    setTouched({ name: true, email: true, phone: true, paperTypeId: true, message: true });
    if (Object.keys(errs).length > 0) return;

    if (!isSupabaseConfigured || !supabase) {
      setStatus('error');
      setToast({ kind: 'error', text: t.contact.configNotice });
      return;
    }

    setStatus('loading');
    const payload = normalizeQuotePayload(form);
    const { error } = await supabase.from('quote_requests').insert(payload);

    if (error) {
      setStatus('error');
      setToast({ kind: 'error', text: t.contact.toastErr });
      return;
    }

    setStatus('success');
    setToast({ kind: 'success', text: t.contact.toastOk });
    setForm(initialForm);
    setTouched({});
    setErrors({});
  };

  const directCards = useMemo(
    () => [
      {
        key: 'phone',
        icon: Phone,
        label: t.contact.phoneLabel,
        value: COMPANY_CONTACT.phoneDisplay,
        href: COMPANY_CONTACT.phoneHref,
        external: false,
      },
      {
        key: 'whatsapp',
        icon: MessageCircle,
        label: t.contact.whatsapp,
        value: COMPANY_CONTACT.phoneDisplay,
        href: COMPANY_CONTACT.whatsappHref,
        external: true,
      },
      {
        key: 'email',
        icon: Mail,
        label: t.contact.emailLabel,
        value: COMPANY_CONTACT.salesEmail,
        href: COMPANY_CONTACT.salesEmailHref,
        external: false,
      },
    ],
    [t.contact.phoneLabel, t.contact.whatsapp, t.contact.emailLabel]
  );

  return (
    <section id="contact" className="relative bg-canvas py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeader eyebrow={t.contact.eyebrow} title={t.contact.title} intro={t.contact.intro} />

        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <Reveal>
            <form onSubmit={submit} noValidate className="rounded-sm border border-line/20 bg-surface p-5 sm:p-6 md:p-8">
              {!isSupabaseConfigured && (
                <div className="mb-5 flex items-start gap-3 rounded-sm border border-gold/40 bg-gold/10 p-3.5 text-xs leading-[155%] text-ink">
                  <Info size={16} className="mt-0.5 shrink-0 text-accent" aria-hidden />
                  <span>{t.contact.configNotice}</span>
                </div>
              )}

              <div className="grid gap-5 sm:grid-cols-2">
                <Field id="quote-name" label={`${t.contact.name} *`} error={fieldError('name')}>
                  <input
                    id="quote-name"
                    className={inputClass}
                    value={form.name}
                    onChange={set('name')}
                    onBlur={blur('name')}
                    autoComplete="name"
                    aria-invalid={!!fieldError('name')}
                    aria-describedby={fieldError('name') ? 'quote-name-err' : undefined}
                  />
                </Field>

                <Field id="quote-company" label={t.contact.company}>
                  <input
                    id="quote-company"
                    className={inputClass}
                    value={form.company}
                    onChange={set('company')}
                    autoComplete="organization"
                  />
                </Field>

                <Field id="quote-email" label={`${t.contact.email} *`} error={fieldError('email')}>
                  <input
                    id="quote-email"
                    className={inputClass}
                    type="email"
                    dir="ltr"
                    value={form.email}
                    onChange={set('email')}
                    onBlur={blur('email')}
                    autoComplete="email"
                    aria-invalid={!!fieldError('email')}
                    aria-describedby={fieldError('email') ? 'quote-email-err' : undefined}
                  />
                </Field>

                <Field id="quote-phone" label={t.contact.phone} error={fieldError('phone')}>
                  <input
                    id="quote-phone"
                    className={inputClass}
                    type="tel"
                    dir="ltr"
                    value={form.phone}
                    onChange={set('phone')}
                    onBlur={blur('phone')}
                    autoComplete="tel"
                    placeholder="011 3233 2148"
                    aria-invalid={!!fieldError('phone')}
                    aria-describedby={fieldError('phone') ? 'quote-phone-err' : undefined}
                  />
                </Field>

                <Field id="quote-paper" label={t.contact.paperType} error={fieldError('paperTypeId')}>
                  <select
                    id="quote-paper"
                    className={`${inputClass} appearance-none`}
                    value={form.paperTypeId}
                    onChange={set('paperTypeId')}
                  >
                    {paperTypes.map((p) => (
                      <option key={p.id} value={p.id} className="bg-surface text-ink">
                        {L(p.name)}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field id="quote-qty" label={t.contact.quantity}>
                  <input
                    id="quote-qty"
                    className={inputClass}
                    value={form.quantity}
                    onChange={set('quantity')}
                    placeholder={t.contact.quantityPh}
                  />
                </Field>

                <Field id="quote-msg" label={`${t.contact.message} *`} error={fieldError('message')} className="sm:col-span-2">
                  <textarea
                    id="quote-msg"
                    className={`${inputClass} min-h-[120px] resize-y`}
                    value={form.message}
                    onChange={set('message')}
                    onBlur={blur('message')}
                    placeholder={t.contact.messagePh}
                    aria-invalid={!!fieldError('message')}
                    aria-describedby={fieldError('message') ? 'quote-msg-err' : undefined}
                  />
                </Field>
              </div>

              <GoldButton
                type="submit"
                disabled={status === 'loading'}
                aria-busy={status === 'loading'}
                className="mt-6 w-full disabled:opacity-60 sm:w-auto"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 size={16} className="animate-spin" aria-hidden />
                    <span>{t.contact.sending}</span>
                  </>
                ) : (
                  t.contact.send
                )}
              </GoldButton>
            </form>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex h-full flex-col gap-3.5">
              {directCards.map(({ key, icon: Icon, label, value, href, external }) => (
                <a
                  key={key}
                  href={href}
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noopener noreferrer' : undefined}
                  className="group flex min-h-[68px] items-center gap-4 rounded-sm border border-line/20 bg-surface p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold hover:shadow-[0_10px_30px_rgba(201,168,106,0.14)]"
                >
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-sm border border-line/25 bg-canvas/70 text-accent transition-colors group-hover:bg-gold group-hover:text-midnight">
                    <Icon size={20} aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="tracking-brand block text-xs text-inkSubtle">{label}</span>
                    <span className="mt-0.5 block truncate text-sm font-medium text-ink" dir="ltr">
                      {value}
                    </span>
                  </span>
                </a>
              ))}

              <div className="rounded-sm border border-line/20 bg-surface p-4">
                <p className="tracking-brand text-xs font-semibold text-accent">{t.footer.follow}</p>
                <div className="mt-3 flex flex-wrap gap-2.5">
                  {socialChannels.map((ch) => (
                    <a
                      key={ch.id}
                      href={ch.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${L(ch.name)} — ${ch.handle}`}
                      title={L(ch.name)}
                      className="inline-flex h-[44px] w-[44px] items-center justify-center rounded-sm border border-line/25 bg-canvas/60 text-inkMuted transition-colors hover:border-gold hover:bg-gold hover:text-midnight"
                    >
                      <SocialIcon platform={ch.id} size={18} />
                    </a>
                  ))}
                </div>
              </div>

              <p className="mt-auto rounded-sm border border-line/15 bg-surface/65 p-5 text-sm leading-[160%] text-inkMuted">
                {t.contact.prefer}
              </p>
            </div>
          </Reveal>
        </div>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className={`fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] left-1/2 z-[80] flex w-[min(92vw,420px)] -translate-x-1/2 items-start gap-3 rounded-sm border bg-surface p-4 shadow-2xl backdrop-blur-md ${
              toast.kind === 'success' ? 'border-gold/60' : 'border-red-500/60'
            }`}
          >
            {toast.kind === 'success' ? (
              <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-accent" aria-hidden />
            ) : (
              <AlertCircle size={20} className="mt-0.5 shrink-0 text-red-500" aria-hidden />
            )}
            <p className="text-sm text-ink">{toast.text}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function Field({
  id,
  label,
  error,
  children,
  className = '',
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label htmlFor={id} className={`block ${className}`}>
      <span className="tracking-brand mb-2 block text-xs font-semibold text-inkMuted">{label}</span>
      {children}
      {error && (
        <span id={`${id}-err`} className="mt-1.5 block text-xs font-medium text-red-500">
          {error}
        </span>
      )}
    </label>
  );
}
