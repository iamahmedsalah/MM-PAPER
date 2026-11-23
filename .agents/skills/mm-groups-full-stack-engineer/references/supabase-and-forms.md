# Supabase & Quote Form Reference

## Table Contract (`supabase/migrations/20261122181553_create_quote_requests.sql`)

| Column | Type | Nullable | Notes |
|---|---|---|---|
| `id` | `uuid` | No | `DEFAULT gen_random_uuid()` |
| `name` | `text` | No | Required contact name |
| `company` | `text` | Yes | Optional company name |
| `email` | `text` | No | Required validated email |
| `phone` | `text` | Yes | Optional phone number |
| `paper_type` | `text` | No | Canonical English grade name (`Kraft`, `White Offset`, etc.) |
| `quantity` | `text` | Yes | Optional monthly/order tonnage note |
| `message` | `text` | Yes | Application, dimensions, delivery schedule |
| `created_at` | `timestamptz` | Yes | `DEFAULT now()` |

## Client Safety Rules

1. Guard `createClient` in `src/lib/supabase.ts` using `process.env.NEXT_PUBLIC_SUPABASE_URL` and `process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY` so missing credentials export `supabase = null` and `isSupabaseConfigured = false`.
2. In `ContactForm.tsx`, store `paperTypeId` (stable grade slug such as `'kraft'`), render localized option labels `L(p.name)`, and resolve the canonical grade name when submitting to `quote_requests`.
3. Never expose `service_role` keys in client bundles or `.env.example`.
4. Prevent double submission while `status === 'loading'` via `disabled={status === 'loading'}` and `aria-busy`.
5. If `!supabase`, surface a helpful localized banner guiding the user to direct WhatsApp, phone, or email channels instead of throwing an unhandled error.
