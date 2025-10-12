# BeatSlave

Digital music marketplace where customers can **preview, purchase, and securely download** beats with multiple licensing tiers.

## Tech Stack
- Next.js 14 (App Router), React, TypeScript
- Tailwind CSS + shadcn/ui
- PostgreSQL + Prisma
- Stripe Checkout + Webhooks (signed + validated)
- Local uploads (temporary) → S3/R2 migration
- HTML5 audio preview (planned waveform + loop regions)

## Quick Start (Local)
```bash
# install deps
pnpm install

# run dev server (apps/web)
pnpm dev

# database
pnpm migrate
pnpm seed
```

Visit http://localhost:3000

## Environment
Copy `.env.example` → `.env.local` and configure all required keys (DB, Stripe, S3, NextAuth, Admin).

## Key App Paths (expected)
- `apps/web/app/catalog/page.tsx` — catalog & filters
- `apps/web/app/track/[slug]/page.tsx` — track detail
- `apps/web/app/api/checkout/route.ts` — Stripe session
- `apps/web/app/api/webhooks/stripe/route.ts` — Stripe webhooks
- `apps/web/prisma/schema.prisma` — DB schema
- `apps/web/scripts/seed.ts` — seeding

## Business Rules (current)
- License tiers: Standard ($0.99), Premium ($4.99), Exclusive ($49.99)
- Alternative (optional): MP3 $0.99, WAV $1.29, BUNDLE $2.00
- Secure, **time-boxed single-use** download links after payment

## Roadmap (next)
- Migrate uploads to S3 with signed URLs
- User accounts & purchase history
- Shopping cart
- Enhanced audio player (waveform/loops/shortcuts)
- Email notifications & analytics
- (Future) Multi-seller onboarding

---

## Troubleshooting

### Database Connection Failed
```bash
# Check PostgreSQL is running
brew services list

# Start PostgreSQL
brew services start postgresql

# Verify DATABASE_URL format
postgresql://username:password@localhost:5432/beatslave
```

### Stripe Webhook Not Triggering
```bash
# Forward webhooks to local dev
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Copy webhook signing secret to .env
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Audio Preview Won’t Play
- Check file exists: `ls uploads/previews/`
- Verify file permissions: `chmod 644 uploads/previews/*.mp3`
- Check browser console for CORS errors
- Ensure previewUrl path in database matches actual file

### Prisma Generate Fails
```bash
# Clear Prisma cache
rm -rf node_modules/.prisma
pnpm -C apps/web prisma generate
```

### Port 3000 Already in Use
```bash
# Kill existing process (macOS)
lsof -ti:3000 | xargs kill -9

# Or use different port
pnpm -C apps/web dev -p 3001
```
