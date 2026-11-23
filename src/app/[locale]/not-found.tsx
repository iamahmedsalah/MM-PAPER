import Link from 'next/link';

export default function LocaleNotFound() {
  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center bg-canvas px-6 text-center text-ink">
      <p className="tracking-brand text-xs font-semibold text-accent">404</p>
      <h1 className="mt-3 font-heading text-3xl font-bold sm:text-4xl">Page not found</h1>
      <p className="mt-3 max-w-md text-sm text-inkMuted">
        Choose a language edition below to return to the MM Paper Industry showcase.
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Link
          href="/en"
          className="inline-flex min-h-[44px] items-center rounded-sm bg-gold px-6 py-2.5 text-sm font-semibold text-midnight transition-colors hover:bg-goldLight"
        >
          English (/en)
        </Link>
        <Link
          href="/ar"
          className="inline-flex min-h-[44px] items-center rounded-sm border border-accent/45 px-6 py-2.5 text-sm font-semibold text-accent transition-colors hover:border-gold hover:bg-gold/10"
        >
          العربية (/ar)
        </Link>
      </div>
    </main>
  );
}
