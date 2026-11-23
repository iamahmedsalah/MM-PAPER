'use client';

import BrandLogo from './ui/BrandLogo';
import { SocialIcon } from './ui/SocialIcons';
import { socialChannels } from '../data/socials';
import { useLang } from '../i18n/LanguageContext';
import { scrollToSection } from '../lib/scroll';

export default function Footer() {
  const { t, L } = useLang();

  const quickLinks = [
    { label: t.nav.home, href: '#home' },
    { label: t.nav.services, href: '#services' },
    { label: t.nav.paperTypes, href: '#paper-types' },
    { label: t.nav.about, href: '#about' },
    { label: t.nav.managers, href: '#managers' },
    { label: t.nav.location, href: '#location' },
    { label: t.nav.contact, href: '#contact' },
  ];

  const handleLinkClick = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    event.preventDefault();
    scrollToSection(href);
  };

  return (
    <footer className="border-t border-line/15 bg-canvas">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:py-14 md:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div>
            <a
              href="#home"
              onClick={(e) => handleLinkClick(e, '#home')}
              className="inline-flex min-h-[44px] items-center gap-3"
              aria-label={t.a11y.backTop}
            >
              <BrandLogo className="h-9 w-auto" alt={t.brand} width={90} height={36} />
              <span className="tracking-brand text-xs font-semibold text-ink">{t.brand}</span>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-[160%] text-inkMuted">{t.footer.tagline}</p>
          </div>

          <nav aria-label={t.footer.navLabel}>
            <h3 className="tracking-brand text-xs font-semibold text-accent">{t.footer.quickLinks}</h3>
            <ul className="mt-4 grid grid-cols-2 gap-x-8 gap-y-1">
              {quickLinks.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={(e) => handleLinkClick(e, l.href)}
                    className="inline-flex min-h-[44px] items-center text-sm text-inkMuted transition-colors hover:text-accent"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="tracking-brand text-xs font-semibold text-accent">{t.footer.follow}</h3>
            <div className="mt-4 flex flex-wrap gap-3">
              {socialChannels.map((channel) => (
                <a
                  key={channel.id}
                  href={channel.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${L(channel.name)} — ${channel.handle}`}
                  title={L(channel.name)}
                  className="inline-flex h-[44px] w-[44px] items-center justify-center rounded-sm border border-line/25 text-inkMuted transition-all duration-200 hover:border-gold hover:text-accent"
                >
                  <SocialIcon platform={channel.id} size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-line/15 pt-6 text-xs text-inkSubtle sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} {t.brand}. {t.footer.rights}
          </p>
          <p>{t.footer.motto}</p>
        </div>
      </div>
    </footer>
  );
}
