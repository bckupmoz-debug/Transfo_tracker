# Transformation Tracker

A multi-region transformation programme management tool, built on the
**triangulation methodology**: three distinct evidence streams —
**people say · documents say · system shows** — are captured separately,
standardised, compared, and resolved into a migration backlog.

The three streams are *not* interchangeable, so each keeps a consistent colour
across every screen.

| Colour | Hex | Meaning |
|---|---|---|
| Light blue | `#D2E0FB` | People / regional |
| Light yellow | `#F9F3CC` | Documents / at-risk |
| Light green | `#D7E5CA` | System-observed / on-track |
| Medium blue | `#8EACCD` | Structural headers |

Dates are shown `dd/mm/yyyy` throughout.

## Stack

- **Next.js 14 + TypeScript** — UI, App Router. Deployed to **Vercel**.
- **Python 3.12 serverless function** (`/api/extract.py`) — entity extraction.
- **Supabase** (Postgres + Auth + RLS) — data layer.
- **GitHub** — source of truth; Actions run type-check, build and Python lint.

## Architecture (five layers)

```
Capture  ->  Model Repository  ->  Standardisation  ->  Fit-Gap  ->  Outputs
(evidence)   (candidate_steps)     (/api/extract)       (arbitr.)    (backlog)
```

Screens: **Dashboard** (filters, metrics, progress, timeline) ·
**Capture** (three intake modes + tight structured form) ·
**Pipeline** (extraction stages with the mandatory SME validation checkpoint) ·
**Arbitration** (three sources side by side, fit-gap controls, resolve to backlog).

## Run locally

```bash
npm install
cp .env.example .env.local
# Fill in Supabase keys and Keycloak client secret
npm run dev                  # http://localhost:3000
```

Without Supabase keys the UI renders from mock data, so you can review it
immediately. Add the keys to switch the queries to live data.

### Keycloak

The app expects a Keycloak realm and confidential client for authentication.

Add these values to `.env.local`:

```ini
AUTH_SECRET=your-random-secret
AUTH_KEYCLOAK_ID=transfo-tracker
AUTH_KEYCLOAK_SECRET=your-keycloak-client-secret
AUTH_KEYCLOAK_ISSUER=http://localhost:8080/realms/transformation
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-random-secret
AUTH_URL=http://localhost:3000
AUTH_TRUST_HOST=true
```

Start Keycloak locally with either Docker or Docker Compose.

```bash
docker run -d --name keycloak -p 8080:8080 \
  -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin \
  quay.io/keycloak/keycloak start-dev
```

Or with Docker Compose:

```yaml
version: '3.9'
services:
  keycloak:
    image: quay.io/keycloak/keycloak:26.2.5
    command: start-dev
    ports:
      - '8080:8080'
    environment:
      KEYCLOAK_ADMIN: admin
      KEYCLOAK_ADMIN_PASSWORD: admin
```

Then create a realm named `transformation` and a client named `transfo-tracker`.
Use these redirect URIs for local development:

- `http://localhost:3000/api/auth/callback/keycloak`
- `http://127.0.0.1:3000/api/auth/callback/keycloak`

If you create a permanent admin user, set it via the container env vars above and keep the credentials in your local run instructions or a secure secrets manager.

## Set up Supabase

1. Create a project at supabase.com.
2. In the SQL editor, run `supabase/migrations/0001_init.sql`, then
   `supabase/seed.sql`.
3. Copy the Project URL and anon key into `.env.local`.
4. Tighten the starter RLS policies before go-live — in particular, limit
   arbitration writes to the **transformation lead** role.

## Deploy

### GitHub
```bash
git init && git add -A && git commit -m "Initial transformation tracker"
git branch -M main
git remote add origin git@github.com:<you>/transformation-tracker.git
git push -u origin main
```

### Vercel
1. Import the GitHub repo at vercel.com.
2. Add the three environment variables from `.env.example` in
   Project Settings → Environment Variables.
3. Deploy. Vercel builds the Next.js app and serves `/api/extract.py` as a
   Python serverless function automatically (see `vercel.json`).

## Open programme decisions (flagged, with current defaults)

- **Default backlog destination** — currently `Jira`; switchable per item in
  the Arbitration screen (Jira / Azure DevOps / ServiceNow / SAP Signavio).
- **Reversible arbitration decisions** — currently `true`, with an
  `arbitration_events` audit trail so reversals stay accountable.

These are wired through the schema and UI so either can be locked down later
without rework.
