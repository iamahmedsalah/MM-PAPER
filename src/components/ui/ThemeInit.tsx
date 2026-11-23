import Script from 'next/script';

const themeBootScript = `
(function () {
  try {
    var pref = localStorage.getItem('mm-theme');
    if (pref !== 'light' && pref !== 'dark' && pref !== 'system') {
      pref = 'system';
    }
    var resolved = pref === 'light' || pref === 'dark'
      ? pref
      : (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    document.documentElement.dataset.theme = resolved;
    document.documentElement.dataset.themePref = pref;
    document.documentElement.style.colorScheme = resolved;
  } catch (e) {}
})();
`;

export function ThemeInit() {
  return <Script id="mm-theme-init" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: themeBootScript }} />;
}
