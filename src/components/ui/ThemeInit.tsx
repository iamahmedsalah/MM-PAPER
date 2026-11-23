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
    var color = resolved === 'light' ? '#F7F4EC' : '#0B1020';
    document.querySelectorAll('meta[name="theme-color"]').forEach(function (el) {
      el.setAttribute('content', color);
    });
    var meta = document.querySelector('meta[name="theme-color"][data-mm-theme-color]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'theme-color');
      meta.setAttribute('data-mm-theme-color', 'true');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', color);
    var href = resolved === 'light' ? '/favicon-light.svg?v=light' : '/favicon-dark.svg?v=dark';
    document
      .querySelectorAll('link[rel="icon"]:not([data-mm-dynamic-icon]), link[rel="shortcut icon"]')
      .forEach(function (el) {
        el.setAttribute('href', href);
        el.setAttribute('type', 'image/svg+xml');
        el.removeAttribute('media');
      });
    var prevDynamic = document.querySelector('link[data-mm-dynamic-icon]');
    if (prevDynamic && prevDynamic.parentNode) {
      prevDynamic.parentNode.removeChild(prevDynamic);
    }
    var icon = document.createElement('link');
    icon.setAttribute('rel', 'icon');
    icon.setAttribute('type', 'image/svg+xml');
    icon.setAttribute('sizes', 'any');
    icon.setAttribute('data-mm-dynamic-icon', 'true');
    icon.setAttribute('href', href);
    document.head.appendChild(icon);
  } catch (e) {}
})();
`;

export function ThemeInit() {
  return <Script id="mm-theme-init" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: themeBootScript }} />;
}
