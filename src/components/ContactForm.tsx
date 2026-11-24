'use client';

import { useActionState, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Loader2,
  Mail,
  MessageCircle,
  Phone,
  RotateCcw,
} from 'lucide-react';
import SectionHeader from './SectionHeader';
import AmbientPaperBackdrop from './ui/AmbientPaperBackdrop';
import { GoldButton, GoldLink } from './ui/Buttons';
import { Reveal } from './ui/Reveal';
import { SocialIcon } from './ui/SocialIcons';
import { submitQuote, type QuoteActionState } from '../app/actions/submitQuote';
import { COMPANY_CONTACT } from '../data/contact';
import { governorates } from '../data/governorates';
import { paperTypes } from '../data/papers';
import { socialChannels } from '../data/socials';
import { useLang } from '../i18n/LanguageContext';
import type { QuoteFormat } from '../lib/quote-schema';

interface LocalFormValues {
  name: string;
  company: string;
  phone: string;
  paperTypeId: string;
  gsm: string;
  size: string;
  format: QuoteFormat;
  quantity: string;
  governorate: string;
  notes: string;
}

const INITIAL_VALUES: LocalFormValues = {
  name: '',
  company: '',
  phone: '',
  paperTypeId: '',
  gsm: '',
  size: '',
  format: 'reel',
  quantity: '',
  governorate: '',
  notes: '',
};

const INITIAL_STATE: QuoteActionState = {
  ok: false,
  status: 'idle',
};

const inputClass =
  'min-h-[46px] w-full rounded-sm border border-line/20 bg-canvas/70 px-4 py-3 text-base text-ink placeholder:text-inkSubtle/70 transition-shadow duration-200 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/40 sm:text-sm';

export default function ContactForm({ preselectedPaperId }: { preselectedPaperId?: string }) {
  const { t, lang, L } = useLang();
  const [values, setValues] = useState<LocalFormValues>(INITIAL_VALUES);
  const [startedAt, setStartedAt] = useState<string>('');
  const [dismissedSuccess, setDismissedSuccess] = useState(false);
  const [toast, setToast] = useState<{ kind: 'success' | 'error'; text: string } | null>(null);
  const lastOpenedIdRef = useRef<number>(0);

  const [state, formAction, isPending] = useActionState(submitQuote, INITIAL_STATE);

  useEffect(() => {
    setStartedAt(String(Date.now()));
  }, []);

  useEffect(() => {
    if (preselectedPaperId && paperTypes.some((p) => p.id === preselectedPaperId)) {
      setValues((prev) => ({ ...prev, paperTypeId: preselectedPaperId }));
      setDismissedSuccess(true);
    }
  }, [preselectedPaperId]);

  useEffect(() => {
    if (state.status === 'idle') return;
    setDismissedSuccess(false);

    if (state.ok && state.whatsappUrl && state.submissionId && state.submissionId !== lastOpenedIdRef.current) {
      lastOpenedIdRef.current = state.submissionId;
      setValues(INITIAL_VALUES);
      setStartedAt(String(Date.now()));
      setToast({ kind: 'success', text: state.message || t.contact.successTitle });

      // Attempt automatic handoff to WhatsApp; if blocked on mobile, the "افتح واتساب" button remains visible.
      window.open(state.whatsappUrl, '_blank', 'noopener,noreferrer');
    } else if (!state.ok && state.message) {
      setToast({ kind: 'error', text: state.message });
    }
  }, [state, t.contact.successTitle]);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 5500);
    return () => window.clearTimeout(id);
  }, [toast]);

  const setField =
    <K extends keyof LocalFormValues>(key: K) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const nextVal = e.target.value as LocalFormValues[K];
      setValues((prev) => ({ ...prev, [key]: nextVal }));
    };

  const showSuccessCard = state.ok && Boolean(state.whatsappUrl) && !dismissedSuccess;

  const formatOptions: Array<{ value: QuoteFormat; label: string }> = useMemo(
    () => [
      { value: 'reel', label: t.contact.formatReel },
      { value: 'sheet', label: t.contact.formatSheet },
      { value: 'both', label: t.contact.formatBoth },
    ],
    [t.contact.formatReel, t.contact.formatSheet, t.contact.formatBoth]
  );

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

  const err = state.fieldErrors;

  return (
    <section id="contact" className="relative overflow-hidden bg-canvas py-20 md:py-28">
      <AmbientPaperBackdrop variant="contact" />
      <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeader eyebrow={t.contact.eyebrow} title={t.contact.title} intro={t.contact.intro} />

        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <Reveal>
            <div className="rounded-sm border border-line/20 bg-surface p-5 sm:p-6 md:p-8">
              {showSuccessCard && state.whatsappUrl ? (
                <div
                  role="status"
                  aria-live="polite"
                  className="flex flex-col items-start gap-5 rounded-sm border border-gold/45 bg-canvas/60 p-6 sm:p-8"
                >
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-sm border border-gold/40 bg-gold/15 text-accent">
                    <CheckCircle2 size={24} aria-hidden />
                  </div>
                  <div>
                    <h3 className="font-heading text-xl font-bold text-ink">{t.contact.successTitle}</h3>
                    <p className="mt-2 text-sm leading-[165%] text-inkMuted">{state.message}</p>
                  </div>
                  <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                    <GoldLink
                      href={state.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto"
                    >
                      <MessageCircle size={17} aria-hidden />
                      <span>{t.contact.openWhatsapp}</span>
                    </GoldLink>
                    <button
                      type="button"
                      onClick={() => {
                        setDismissedSuccess(true);
                        setStartedAt(String(Date.now()));
                      }}
                      className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-sm border border-line/30 px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-gold hover:text-accent"
                    >
                      <RotateCcw size={15} aria-hidden />
                      <span>{t.contact.newRequest}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <form action={formAction} noValidate>
                  <input type="hidden" name="locale" value={lang} />
                  <input type="hidden" name="startedAt" value={startedAt} />

                  {/* Anti-spam honeypot hidden from keyboard users and assistive tech */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -start-[9999px] h-px w-px overflow-hidden opacity-0"
                  >
                    <label htmlFor="quote-website">Website</label>
                    <input
                      id="quote-website"
                      name="website"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      defaultValue=""
                    />
                  </div>

                  {!state.ok && state.status === 'error' && state.message && (
                    <div
                      role="alert"
                      className="mb-6 flex items-start gap-3 rounded-sm border border-red-500/50 bg-red-500/10 p-3.5 text-sm text-ink"
                    >
                      <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-500" aria-hidden />
                      <span>{state.message}</span>
                    </div>
                  )}

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field id="quote-name" label={`${t.contact.name} *`} error={err?.name}>
                      <input
                        id="quote-name"
                        name="name"
                        type="text"
                        required
                        className={inputClass}
                        value={values.name}
                        onChange={setField('name')}
                        placeholder={t.contact.namePh}
                        autoComplete="name"
                        aria-invalid={Boolean(err?.name)}
                        aria-describedby={err?.name ? 'quote-name-err' : undefined}
                      />
                    </Field>

                    <Field id="quote-company" label={t.contact.company} error={err?.company}>
                      <input
                        id="quote-company"
                        name="company"
                        type="text"
                        className={inputClass}
                        value={values.company}
                        onChange={setField('company')}
                        placeholder={t.contact.companyPh}
                        autoComplete="organization"
                        aria-invalid={Boolean(err?.company)}
                        aria-describedby={err?.company ? 'quote-company-err' : undefined}
                      />
                    </Field>

                    <Field id="quote-phone" label={`${t.contact.phone} *`} error={err?.phone}>
                      <input
                        id="quote-phone"
                        name="phone"
                        type="tel"
                        required
                        dir="ltr"
                        className={inputClass}
                        value={values.phone}
                        onChange={setField('phone')}
                        placeholder={t.contact.phonePh}
                        autoComplete="tel"
                        aria-invalid={Boolean(err?.phone)}
                        aria-describedby={err?.phone ? 'quote-phone-err' : undefined}
                      />
                    </Field>

                    <Field id="quote-paper" label={`${t.contact.paperType} *`} error={err?.paperTypeId}>
                      <div className="relative">
                        <select
                          id="quote-paper"
                          name="paperTypeId"
                          required
                          className={`${inputClass} appearance-none pe-10`}
                          value={values.paperTypeId}
                          onChange={setField('paperTypeId')}
                          aria-invalid={Boolean(err?.paperTypeId)}
                          aria-describedby={err?.paperTypeId ? 'quote-paper-err' : undefined}
                        >
                          <option value="" className="bg-surface text-inkSubtle">
                            {t.contact.paperPh}
                          </option>
                          {paperTypes.map((p) => (
                            <option key={p.id} value={p.id} className="bg-surface text-ink">
                              {L(p.name)}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          size={16}
                          aria-hidden
                          className="pointer-events-none absolute end-3.5 top-1/2 -translate-y-1/2 text-inkSubtle"
                        />
                      </div>
                    </Field>

                    <Field id="quote-gsm" label={t.contact.gsm} error={err?.gsm}>
                      <input
                        id="quote-gsm"
                        name="gsm"
                        type="text"
                        className={inputClass}
                        value={values.gsm}
                        onChange={setField('gsm')}
                        placeholder={t.contact.gsmPh}
                        aria-invalid={Boolean(err?.gsm)}
                        aria-describedby={err?.gsm ? 'quote-gsm-err' : undefined}
                      />
                    </Field>

                    <Field id="quote-size" label={t.contact.size} error={err?.size}>
                      <input
                        id="quote-size"
                        name="size"
                        type="text"
                        className={inputClass}
                        value={values.size}
                        onChange={setField('size')}
                        placeholder={t.contact.sizePh}
                        aria-invalid={Boolean(err?.size)}
                        aria-describedby={err?.size ? 'quote-size-err' : undefined}
                      />
                    </Field>

                    <Field id="quote-qty" label={t.contact.quantity} error={err?.quantity}>
                      <input
                        id="quote-qty"
                        name="quantity"
                        type="text"
                        className={inputClass}
                        value={values.quantity}
                        onChange={setField('quantity')}
                        placeholder={t.contact.quantityPh}
                        aria-invalid={Boolean(err?.quantity)}
                        aria-describedby={err?.quantity ? 'quote-qty-err' : undefined}
                      />
                    </Field>

                    <Field id="quote-gov" label={t.contact.governorate} error={err?.governorate}>
                      <div className="relative">
                        <select
                          id="quote-gov"
                          name="governorate"
                          className={`${inputClass} appearance-none pe-10`}
                          value={values.governorate}
                          onChange={setField('governorate')}
                          aria-invalid={Boolean(err?.governorate)}
                          aria-describedby={err?.governorate ? 'quote-gov-err' : undefined}
                        >
                          <option value="" className="bg-surface text-inkSubtle">
                            {t.contact.governoratePh}
                          </option>
                          {governorates.map((g) => (
                            <option key={g.id} value={g.id} className="bg-surface text-ink">
                              {lang === 'ar' ? g.ar : g.en}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          size={16}
                          aria-hidden
                          className="pointer-events-none absolute end-3.5 top-1/2 -translate-y-1/2 text-inkSubtle"
                        />
                      </div>
                    </Field>

                    <fieldset
                      className="sm:col-span-2"
                      aria-invalid={Boolean(err?.format)}
                      aria-describedby={err?.format ? 'quote-format-err' : undefined}
                    >
                      <legend className="tracking-brand mb-2 block text-xs font-semibold text-inkMuted">
                        {t.contact.formatLabel}
                      </legend>
                      <div className="grid grid-cols-3 gap-2.5">
                        {formatOptions.map((opt) => {
                          const selected = values.format === opt.value;
                          return (
                            <label
                              key={opt.value}
                              className={`relative flex min-h-[46px] cursor-pointer items-center justify-center rounded-sm border px-3 py-2 text-sm font-semibold transition-all duration-200 focus-within:ring-2 focus-within:ring-gold/40 ${
                                selected
                                  ? 'border-gold bg-gold/15 text-ink shadow-[0_0_0_1px_rgba(201,168,106,0.35)]'
                                  : 'border-line/20 bg-canvas/70 text-inkMuted hover:border-gold/50 hover:text-ink'
                              }`}
                            >
                              <input
                                type="radio"
                                name="format"
                                value={opt.value}
                                checked={selected}
                                onChange={setField('format')}
                                className="sr-only"
                              />
                              <span>{opt.label}</span>
                            </label>
                          );
                        })}
                      </div>
                      {err?.format && (
                        <span id="quote-format-err" className="mt-1.5 block text-xs font-medium text-red-500">
                          {err.format}
                        </span>
                      )}
                    </fieldset>

                    <Field id="quote-notes" label={t.contact.notes} error={err?.notes} className="sm:col-span-2">
                      <textarea
                        id="quote-notes"
                        name="notes"
                        className={`${inputClass} min-h-[110px] resize-y`}
                        value={values.notes}
                        onChange={setField('notes')}
                        placeholder={t.contact.notesPh}
                        aria-invalid={Boolean(err?.notes)}
                        aria-describedby={err?.notes ? 'quote-notes-err' : undefined}
                      />
                    </Field>
                  </div>

                  <GoldButton
                    type="submit"
                    disabled={isPending}
                    aria-busy={isPending}
                    className="mt-6 w-full disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                  >
                    {isPending ? (
                      <>
                        <Loader2 size={16} className="animate-spin" aria-hidden />
                        <span>{t.contact.sending}</span>
                      </>
                    ) : (
                      <>
                        <MessageCircle size={16} aria-hidden />
                        <span>{t.contact.send}</span>
                      </>
                    )}
                  </GoldButton>
                </form>
              )}
            </div>
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
    <div className={className}>
      <label htmlFor={id} className="tracking-brand mb-2 block text-xs font-semibold text-inkMuted">
        {label}
      </label>
      {children}
      {error && (
        <span id={`${id}-err`} className="mt-1.5 block text-xs font-medium text-red-500">
          {error}
        </span>
      )}
    </div>
  );
}
