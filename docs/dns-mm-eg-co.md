# DNS & Email Launch Playbook for `mm-eg.co`

Complete, copy-paste-ready DNS, SSL, email alias (`info@mm-eg.co`), and SEO/GEO cutover guide for **MM Paper Industry** (`mm-eg.co`) hosted on **Vercel**.

---

## 1. Web Hosting DNS (Vercel)

After purchasing `mm-eg.co`:
1. In **Vercel → Project Settings → Domains**, add `mm-eg.co` and `www.mm-eg.co`.
2. Set `mm-eg.co` as the **Primary Domain** and configure `www.mm-eg.co` to **308 Redirect** to `mm-eg.co`.
3. Add the exact DNS records shown by Vercel at your DNS provider (keep TTL at `300` during cutover, then raise to `3600`):

| Type | Name / Host | Value / Target | TTL | Notes |
| --- | --- | --- | --- | --- |
| `A` | `@` | `76.76.21.21` *(or exact IP shown in Vercel Domains)* | `300` | Points apex `mm-eg.co` to Vercel Edge |
| `CNAME` | `www` | `cname.vercel-dns.com` | `300` | Redirects `www.mm-eg.co` → `mm-eg.co` |
| `CAA` | `@` | `0 issue "letsencrypt.org"` | `3600` | Allows automatic TLS certificates for Vercel |

> **Important (if using Cloudflare DNS)**: Keep the Cloudflare proxy **OFF (Grey Cloud / DNS Only)** for Vercel `@` and `www` records so Vercel issues SSL directly and does not intercept AI search bots (`GPTBot`, `OAI-SearchBot`, `PerplexityBot`, `ClaudeBot`).

---

## 2. Primary Mailbox (`info@mm-eg.co`) on Hostinger

Using `info@mm-eg.co` directly as your primary mailbox (for both receiving customer inquiries and sending quotation notifications via SMTP — no alias forwarding needed):

| Type | Name | Value / Target | Priority | TTL |
| --- | --- | --- | --- | --- |
| `MX` | `@` | `mx1.hostinger.com` | `5` | `3600` |
| `MX` | `@` | `mx2.hostinger.com` | `10` | `3600` |
| `TXT` | `@` | `v=spf1 include:_spf.mail.hostinger.com ~all` | — | `3600` |
| `CNAME` | `hostingermail._domainkey` *(use exact 3 DKIM CNAMEs from hPanel)* | From Hostinger hPanel → Emails → DNS | — | `3600` |
| `TXT` | `_dmarc` | `v=DMARC1; p=quarantine; rua=mailto:info@mm-eg.co;` | — | `3600` |

> **Vercel SMTP Setup**: Set `SMTP_USER=info@mm-eg.co`, `QUOTE_TO=info@mm-eg.co`, `MAIL_FROM="MM Paper Industry <info@mm-eg.co>"`, and `SMTP_PASS=<mailbox password>` in Vercel Environment Variables (`smtp.hostinger.com`, port `465`).

---

## 3. Vercel Environment & Search Engine Cutover Checklist

1. Set environment variables in **Vercel → Project Settings → Environment Variables** (Production & Preview):
   - `NEXT_PUBLIC_SITE_URL=https://mm-eg.co`
   - `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=<token>` *(optional meta verification)*
   - `NEXT_PUBLIC_BING_VERIFICATION=<token>` *(optional meta verification)*
2. Redeploy on Vercel after adding `NEXT_PUBLIC_SITE_URL=https://mm-eg.co` so SSR HTML, canonical tags, `sitemap.xml`, `robots.txt`, and `JSON-LD` reflect `https://mm-eg.co`.
3. In **Google Search Console**, verify the `Domain` property for `mm-eg.co` by adding the `TXT` record (`google-site-verification=...`) on `@`, then submit `https://mm-eg.co/sitemap.xml`.
4. In **Bing Webmaster Tools**, import from Search Console or verify `mm-eg.co`, then verify `https://mm-eg.co/llms.txt` and `https://mm-eg.co/robots.txt` return HTTP `200`.
