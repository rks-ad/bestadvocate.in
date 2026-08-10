# Best Advocate — Lead Generation Site

Production-ready Next.js landing page for **bestadvocate.in**: case intake form, email OTP verification via Resend, and verified lead forwarding to your team.

## Features

- Single-viewport lead page (no long scrolling marketing sections)
- Lead form: Name, Mobile, Email, Case description
- OTP email from `noreply@notify.bestadvocate.in` with **resend OTP**
- Verified submissions emailed to `help@bestadvocate.in`
- SEO via metadata + JSON-LD only (keywords not shown on the page)
- Docker image ready for Dokploy (Node 22)

## Requirements

- **Node.js `>=20.9.0`** (recommended: **22**) — Next.js 16 will fail on Node 18
- Version pins: `.nvmrc`, `.node-version`, `package.json` `engines`, and `nixpacks.toml`

## Quick start (local)

```bash
# use Node 22 (nvm / fnm / asdf will read .nvmrc)
nvm use
cp .env.example .env.local
# add your RESEND_API_KEY
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | Example | Purpose |
|---|---|---|
| `RESEND_API_KEY` | `re_...` | Resend API key (**runtime only**) |
| `OTP_FROM_EMAIL` | `noreply@notify.bestadvocate.in` | From address for OTP mail |
| `LEADS_TO_EMAIL` | `help@bestadvocate.in` | Inbox for verified form submissions |
| `LEADS_REPLY_TO` | `help@bestadvocate.in` | Reply-To on OTP emails |
| `SITE_URL` | `https://bestadvocate.in` | Canonical URL for SEO |

Ensure the Resend domain **notify.bestadvocate.in** is verified, with sending from `noreply@notify.bestadvocate.in`.

## Dokploy deploy

**Preferred:** build with the included **Dockerfile** (`node:22-alpine`).

1. Create a new application from this Git repo.
2. Set build type to **Dockerfile** (avoids Nixpacks baking `RESEND_API_KEY` into `ARG`/`ENV`).
3. Set runtime environment variables:
   - `RESEND_API_KEY`
   - `LEADS_TO_EMAIL=help@bestadvocate.in`
   - `LEADS_REPLY_TO=help@bestadvocate.in`
   - `OTP_FROM_EMAIL=noreply@notify.bestadvocate.in`
   - `SITE_URL=https://bestadvocate.in`
4. Expose port `3000` and map your domain `bestadvocate.in`.
5. Persist `/app/.data` so OTP sessions + total-hits counter survive restarts.

### About Nixpacks warnings

If you stay on Nixpacks, Dokploy passes env vars into the generated Dockerfile as `ARG`/`ENV`. Names containing `KEY`/`SECRET` (like `RESEND_API_KEY`) trigger:

`SecretsUsedInArgOrEnv: Do not use ARG or ENV instructions for sensitive data`

That is a **warning** from Docker BuildKit. `RESEND_API_KEY` is not required at build time for this app — keep it as a **runtime** env var only when using Dockerfile builds. `nixpacks.toml` also sets `NIXPACKS_PATH` to avoid the `UndefinedVar: $NIXPACKS_PATH` warning.

```bash
docker compose up -d --build
```

## Funnel

1. Visitor submits name, mobile, email, and case details
2. OTP is emailed for verification (resend available)
3. On success, the lead is emailed to `help@bestadvocate.in`
4. Your team calls the client

## Logo

CDN: `https://pub-c1e7ac8fa69c401eb3c7a8d699524095.r2.dev/bestadvocatelogo.png`  
Also mirrored at `/bestadvocatelogo.png`.
