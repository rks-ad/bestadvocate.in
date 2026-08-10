# Best Advocate — Lead Generation Site

Production-ready Next.js landing page for **bestadvocate.in**: case intake form, email OTP verification via Resend, and verified lead forwarding to your team.

## Features

- Single-viewport lead page (no long scrolling marketing sections)
- Lead form: Name, Mobile, Email, Case description
- OTP email from `noreply@notify.bestadvocate.in` with **resend OTP**
- Verified submissions emailed to `iam@rks.ad` (no file attachments — keeps Resend delivery reliable)
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
| `RESEND_API_KEY` | `re_...` | Resend API key |
| `OTP_FROM_EMAIL` | `noreply@notify.bestadvocate.in` | From address for OTP mail |
| `LEADS_TO_EMAIL` | `iam@rks.ad` | Inbox for verified form submissions (comma-separated OK) |
| `LEADS_REPLY_TO` | `iam@rks.ad` | Reply-To on OTP emails |
| `SITE_URL` | `https://bestadvocate.in` | Canonical URL for SEO |

Ensure the Resend domain **notify.bestadvocate.in** is verified, with sending from `noreply@notify.bestadvocate.in`.

## Dokploy deploy

**Preferred:** build with the included **Dockerfile** (uses `node:22-alpine`).

1. Create a new application from this Git repo.
2. Set build type to **Dockerfile** (not Nixpacks default Node 18).
3. Set the environment variables above.
4. Expose port `3000` and map your domain `bestadvocate.in`.
5. Optional: persist `/app/.data` if you want OTP session files to survive restarts (compose volume already defined).

If you use **Nixpacks** instead, `nixpacks.toml` forces **Node 22**. Redeploy after pulling this change so the builder picks it up.

```bash
docker compose up -d --build
```

## Funnel

1. Visitor submits name, mobile, email, and case details
2. OTP is emailed for verification (resend available)
3. On success, the lead is emailed to `iam@rks.ad`
4. Your team calls the client

## Logo

CDN: `https://pub-c1e7ac8fa69c401eb3c7a8d699524095.r2.dev/bestadvocatelogo.png`  
Also mirrored at `/bestadvocatelogo.png`.
