# DNS & Email Launch Playbook for `mm-eg.co`

DNS, SSL, business mailbox, and search setup for **MM Paper Industry** (`mm-eg.co`) on Vercel.

---

## 1. Web Hosting DNS (Vercel)

Verify the registrant email using the message sent to the domain owner's existing contact address. Check **Domains** in Hostinger if you need to resend the message or refresh the verification status. [Hostinger domain verification](https://www.hostinger.com/support/1583443-how-to-verify-domain-registrant-s-contact-details-at-hostinger/)

1. In **Vercel → Project Settings → Domains**, add `mm-eg.co` and `www.mm-eg.co`.
2. Set `mm-eg.co` as the **Primary Domain** and configure `www.mm-eg.co` to **308 Redirect** to `mm-eg.co`.
3. Add the exact DNS records shown by Vercel at your DNS provider (keep TTL at `300` during cutover, then raise to `3600`):

| Type | Name / Host | Value / Target | TTL | Notes |
| --- | --- | --- | --- | --- |
| `A` | `@` | Exact IP shown in Vercel Domains | `300` | Points `mm-eg.co` to Vercel |
| `CNAME` | `www` | Exact target shown in Vercel Domains | `300` | Points `www.mm-eg.co` to Vercel for the redirect |

> **Important (if using Cloudflare DNS)**: Keep the Cloudflare proxy **OFF (Grey Cloud / DNS Only)** for Vercel `@` and `www` records so Vercel issues SSL directly and does not intercept AI search bots (`GPTBot`, `OAI-SearchBot`, `PerplexityBot`, `ClaudeBot`).

---

## 2. Primary Mailbox (`info@mm-eg.co`) on Hostinger

In Hostinger, open **Emails → Mailboxes** for `mm-eg.co` and create the mailbox with username `info`. Under **Domain settings**, use **Connect automatically** if Hostinger manages your DNS. If you manage DNS elsewhere, add the records shown in that panel at the authoritative DNS provider. [Create the Hostinger mailbox](https://www.hostinger.com/support/1583217-how-to-create-and-manage-mailboxes-for-hostinger-email/) · [Connect Hostinger DNS](https://www.hostinger.com/support/8671304-set-up-a-domain-for-hostinger-email-automatically/)

| Type | Name | Value / Target | Priority | TTL |
| --- | --- | --- | --- | --- |
| `MX` | `@` | `mx1.hostinger.com` | `5` | `3600` |
| `MX` | `@` | `mx2.hostinger.com` | `10` | `3600` |
| `TXT` | `@` | `v=spf1 include:_spf.mail.hostinger.com ~all` | — | `3600` |
| `CNAME` | Each of the three DKIM hostnames shown in hPanel | Matching target shown in hPanel | — | Default |
| `TXT` | `_dmarc` | Value shown in Hostinger Domain settings | — | Default |

In Hostinger, open **Developers → Manage keys** and create a Mail API token scoped to `info@mm-eg.co` with sending permission. Save it as the sensitive Vercel Production variable `HOSTINGER_MAIL_API_TOKEN`. The app looks up the mailbox by address and sends quotes to `QUOTE_TO`, which defaults to `info@mm-eg.co` on this path. Redeploy to apply the variable and the code. [Hostinger Mail API access](https://docs.hostinger.com/emails/agentic-mail#api-access) · [Vercel environment variables](https://vercel.com/docs/environment-variables)

When the API token is unset, the app uses SMTP with `SMTP_USER`, `SMTP_PASS`, and `QUOTE_TO`. The defaults for `SMTP_HOST` and `SMTP_PORT` are `smtp.hostinger.com` and `465`. [Hostinger SMTP settings](https://www.hostinger.com/support/1575756-how-to-get-email-account-configuration-details-for-hostinger-email/)

1. Send a test from a separate email account to `info@mm-eg.co`. Open Hostinger Webmail and confirm that the message appears in Inbox. Reply and confirm it reaches the external account.
2. Submit a quote on the deployed site with a unique test name. Confirm the matching message appears in the mailbox and includes the quote details, the company address, and the Google Maps and WhatsApp links. Check Spam if it is missing from Inbox.

---

## 3. Vercel Environment & Search Engine Cutover Checklist

1. Set environment variables in **Vercel → Project Settings → Environment Variables** (Production & Preview):
   - `NEXT_PUBLIC_SITE_URL=https://mm-eg.co`
   - `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=<token>` *(optional meta verification)*
   - `NEXT_PUBLIC_BING_VERIFICATION=<token>` *(optional meta verification)*
2. Once `https://mm-eg.co/en` is serving the Vercel site, set `REDIRECT_VERCEL_APP=1` in Production. Deploy a new build with this setting and `NEXT_PUBLIC_SITE_URL=https://mm-eg.co` to update the canonical URLs and enable HTTP `308` redirects from `mm-paper.vercel.app`.
3. Verify that `https://mm-paper.vercel.app/ar?ref=old-link` returns `308` with `Location: https://mm-eg.co/ar?ref=old-link`, and that the destination serves the Arabic page.
4. In **Google Search Console**, verify the `Domain` property for `mm-eg.co` by adding the `TXT` record (`google-site-verification=...`) on `@`, then submit `https://mm-eg.co/sitemap.xml`.
5. In **Bing Webmaster Tools**, import from Search Console or verify `mm-eg.co`, then verify `https://mm-eg.co/llms.txt` and `https://mm-eg.co/robots.txt` return HTTP `200`.

## 4. BIMI sender logo in Gmail

1. Submit [`mm-bimi.svg`](../public/brand/mm-bimi.svg) for a Verified Mark Certificate (VMC) or Common Mark Certificate (CMC). The site serves the SVG at `https://mm-eg.co/brand/mm-bimi.svg` after deployment. [BIMI certificate issuers](https://bimigroup.org/vmc-issuers/)
2. Verify that a manual Hostinger Webmail message and a site quote confirmation both show `DMARC: PASS` in Gmail's **Show original**. Review any other legitimate sending services before enforcing the domain policy. Update the existing Hostinger `_dmarc` TXT record through a staged rollout. The BIMI target is `p=quarantine` or `p=reject` with `pct=100`. [Google's recommended DMARC rollout](https://knowledge.workspace.google.com/admin/security/recommended-dmarc-rollout)
3. When the certificate authority supplies the certificate, publish the public PEM chain with the embedded logo at `https://mm-eg.co/brand/mm-bimi.pem`. Confirm the public URL returns HTTP `200` over HTTPS.
4. In **Hostinger → DNS / Nameservers**, add the following TXT record once the PEM is available and DMARC enforcement is active. The PEM contains the certified logo. [Google's BIMI setup guide](https://knowledge.workspace.google.com/admin/security/set-up-bimi)

   | Type | Name | Value |
   | --- | --- | --- |
   | `TXT` | `default._bimi` | `v=BIMI1;l=;a=https://mm-eg.co/brand/mm-bimi.pem` |

5. Verify the TXT record at `default._bimi.mm-eg.co`, then send a new message to Gmail to check the sender logo.
