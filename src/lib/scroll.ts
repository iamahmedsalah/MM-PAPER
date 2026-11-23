export const SCROLL_TOP_EVENT = 'mm:scroll-top';
export const SCROLL_SECTION_EVENT = 'mm:scroll-section';
export const LANG_SWITCH_SECTION_KEY = 'mm-lang-switch-section';
export const SECTION_IDS = [
  'home',
  'services',
  'paper-types',
  'about',
  'managers',
  'location',
  'contact',
] as const;

export interface ScrollEventDetail {
  id?: string;
  instant: boolean;
}

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Remove any stale hash fragment so language switches do not append #section. */
export function clearUrlHash(): void {
  if (typeof window === 'undefined' || !window.location.hash) return;
  window.history.replaceState(null, '', window.location.pathname + window.location.search);
}

/** Detect the section currently aligned with the upper viewport. */
export function getCurrentSectionId(): string {
  if (typeof window === 'undefined' || window.scrollY < 100) return 'home';
  const threshold = window.innerHeight * 0.35;
  let current: string = 'home';

  for (const id of SECTION_IDS) {
    const el = document.getElementById(id);
    if (!el) continue;
    const rect = el.getBoundingClientRect();
    if (rect.top <= threshold) {
      current = id;
    }
  }
  return current;
}

/** Persist the active section before switching locale so landing restores it seamlessly. */
export function saveCurrentSectionForLangSwitch(): void {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(LANG_SWITCH_SECTION_KEY, getCurrentSectionId());
  } catch {
    // sessionStorage unavailable
  }
}

/** Read and clear the pending section from an in-app locale switch. */
export function consumePendingLangSwitchSection(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const id = window.sessionStorage.getItem(LANG_SWITCH_SECTION_KEY);
    if (id) {
      window.sessionStorage.removeItem(LANG_SWITCH_SECTION_KEY);
    }
    return id;
  } catch {
    return null;
  }
}

/** Scroll smoothly (or instantly) to the top of the page and sync Lenis if active. */
export function scrollToTop(instant = false): void {
  if (typeof window === 'undefined') return;
  clearUrlHash();
  const immediate = instant || prefersReducedMotion();
  window.dispatchEvent(
    new CustomEvent<ScrollEventDetail>(SCROLL_TOP_EVENT, { detail: { instant: immediate } })
  );
  window.scrollTo({ top: 0, left: 0, behavior: immediate ? 'instant' : 'smooth' });
}

/** Scroll cleanly to an in-page section without leaving a sticky #hash in the URL. */
export function scrollToSection(sectionId: string, opts?: { instant?: boolean }): void {
  if (typeof window === 'undefined') return;
  const id = sectionId.replace(/^#/, '');
  const immediate = Boolean(opts?.instant) || prefersReducedMotion();

  if (!id || id === 'home') {
    scrollToTop(immediate);
    return;
  }

  clearUrlHash();
  window.dispatchEvent(
    new CustomEvent<ScrollEventDetail>(SCROLL_SECTION_EVENT, { detail: { id, instant: immediate } })
  );

  const target = document.getElementById(id);
  if (target) {
    target.scrollIntoView({ behavior: immediate ? 'auto' : 'smooth' });
  }
}
