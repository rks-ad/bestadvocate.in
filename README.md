# Best Advocate — Lead Generation Site

Production-ready Next.js landing page for **bestadvocate.in**: case intake form, email OTP verification via Resend, and verified lead forwarding to your team.

## Features

- Attractive full-bleed hero with brand-first design and light motion
- Lead form: Name, Mobile, Email, Case description, attachments
- OTP email from `noreply@notify.bestadvocate.in`
- Verified submissions emailed to `help@bestadvocate.in` (with attachments)
- SEO metadata, sitemap, robots, and LegalService JSON-LD for Jaipur / Rajasthan / India advocate searches
- Docker image ready for Dokploy

## Quick start (local)

```bash
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
| `LEADS_TO_EMAIL` | `help@bestadvocate.in` | Inbox for verified form submissions |
| `LEADS_REPLY_TO` | `help@bestadvocate.in` | Reply-To on OTP emails |
| `SITE_URL` | `https://bestadvocate.in` | Canonical URL for SEO |

Ensure the Resend domain **notify.bestadvocate.in** is verified, with sending from `noreply@notify.bestadvocate.in`.

## Dokploy deploy

1. Create a new application from this Git repo.
2. Use **Dockerfile** build (included).
3. Set the environment variables above.
4. Expose port `3000` and map your domain `bestadvocate.in`.
5. Optional: persist `/app/.data` if you want OTP session files to survive restarts (compose volume already defined).

```bash
docker compose up -d --build
```

## Funnel

1. Visitor submits case details (+ optional documents)
2. OTP is emailed for verification
3. On success, lead + attachments are forwarded to `help@bestadvocate.in`
4. Your team calls the client

## Logo

CDN: `https://pub-c1e7ac8fa69c401eb3c7a8d699524095.r2.dev/bestadvocatelogo.png`  
Also mirrored at `/bestadvocatelogo.png`.
