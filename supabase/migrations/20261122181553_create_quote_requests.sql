/*
# Create quote_requests table

1. New Tables
- `quote_requests`: stores quote requests submitted through the MM Paper Industry contact form.
  - `id` (uuid, primary key, auto-generated)
  - `name` (text, not null) — contact person name
  - `company` (text, nullable) — company name
  - `email` (text, not null) — contact email
  - `phone` (text, nullable) — contact phone
  - `paper_type` (text, not null) — requested paper type
  - `quantity` (text, nullable) — requested quantity (free text, e.g. "5 tons")
  - `message` (text, nullable) — free-form message
  - `created_at` (timestamptz, defaults to now)

2. Security
- Enable RLS on `quote_requests`.
- This is a single-tenant, no-auth marketing site: grant SELECT/INSERT to `anon` + `authenticated`.
- INSERT allows visitors to submit quote requests; SELECT is included per Data API defaults but no UI reads it publicly.
*/

CREATE TABLE IF NOT EXISTS quote_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  company text,
  email text NOT NULL,
  phone text,
  paper_type text NOT NULL,
  quantity text,
  message text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT ON quote_requests TO anon, authenticated;

DROP POLICY IF EXISTS "Anyone can submit quote requests" ON quote_requests;
CREATE POLICY "Anyone can submit quote requests"
ON quote_requests FOR INSERT
TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Service role manages quote requests" ON quote_requests;
CREATE POLICY "Service role manages quote requests"
ON quote_requests FOR SELECT
TO anon, authenticated
USING (true);
