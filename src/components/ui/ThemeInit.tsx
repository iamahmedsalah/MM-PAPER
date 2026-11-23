import Script from 'next/script';

const themeBootScript = `
(function () {
  try {
    var theme = localStorage.getItem('mm-theme');
    if (theme !== 'light' && theme !== 'dark') {
      theme = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  } catch (e) {}
})();
`;

export function ThemeInit() {
  return <Script id="mm-theme-init" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: themeBootScript }} />;
}
