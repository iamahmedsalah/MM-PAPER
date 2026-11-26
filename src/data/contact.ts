export const COMPANY_CONTACT = {
  phoneDisplay: '011 3233 2148',
  phoneIntl: '+20 11 3233 2148',
  phoneSchema: '+20-11-3233-2148',
  phoneHref: 'tel:+201132332148',
  whatsappHref: 'https://wa.me/201132332148',
  salesEmail: 'info@mm-eg.co',
  salesEmailHref: 'mailto:info@mm-eg.co',
} as const;

export const COMPANY_LOCATION = {
  googleMapsUrl:
    'https://www.google.com/maps/search/?api=1&query=' +
    encodeURIComponent('منطقة الورش والمخازن شرق المنطقة الصناعية الثانية برج العرب الجديدة الإسكندرية'),
  getEmbedUrl: (lang: 'en' | 'ar') =>
    `https://maps.google.com/maps?q=${encodeURIComponent(
      lang === 'ar'
        ? 'المنطقة الصناعية الثانية برج العرب الجديدة الإسكندرية'
        : 'Second Industrial Zone, New Borg El Arab, Alexandria, Egypt'
    )}&hl=${lang}&z=15&output=embed`,
  address: {
    ar: 'قطعة 10 - بلوك 2، منطقة الورش والمخازن - شرق المنطقة الصناعية الثانية - برج العرب الجديدة',
    en: 'Plot 10, Block 2 — Workshops & Warehouses Zone, East 2nd Industrial Zone, New Borg El Arab City, Alexandria, Egypt',
  },
} as const;
