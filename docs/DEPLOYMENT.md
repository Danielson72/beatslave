# BeatSlave - Production Deployment Guide

## Pre-Flight Checklist ✈️

### 1. Environment Variables (Production)
Switch all test/dev values to production:
- [ ] `STRIPE_PUBLISHABLE_KEY` → Live key from Stripe
- [ ] `STRIPE_SECRET_KEY` → Live key from Stripe
- [ ] `STRIPE_WEBHOOK_SECRET` → Production webhook secret
- [ ] `DATABASE_URL` → Production database (Supabase/Railway/Neon)
- [ ] `NEXTAUTH_URL` → Production domain (https://yourdomain.com)
- [ ] `NEXTAUTH_SECRET` → New secret (`openssl rand -base64 32`)
- [ ] `ADMIN_PASSWORD` → Strong password (min 16 chars)

### 2. Stripe Configuration
- [ ] Create production webhook endpoint in Stripe Dashboard  
  URL: `https://yourdomain.com/api/webhooks/stripe`  
  Events: `checkout.session.completed`, `payment_intent.succeeded`
- [ ] Test webhook with Stripe CLI: `stripe trigger checkout.session.completed`

### 3. Database Migration
```bash
# Run migrations on production DB
DATABASE_URL="your_prod_db_url" pnpm -C apps/web prisma migrate deploy

# DO NOT run seed script in production
```

### 4. File Storage Migration (If S3 Ready)
- [ ] Create S3 bucket or Cloudflare R2 bucket
- [ ] Add bucket credentials to env vars
- [ ] Migrate existing uploads to S3
- [ ] Update upload/download code to use S3 URLs

### 5. Hosting Platform Setup

**Recommended: Vercel**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd apps/web
vercel --prod
```

**Alternative: Railway/Render**
- Connect GitHub repo
- Set environment variables in dashboard
- Auto-deploy on push to `main`

### 6. Domain & SSL
- [ ] Point DNS to hosting provider
- [ ] SSL certificate auto-configured (via Let’s Encrypt)
- [ ] Test HTTPS access

### 7. Post-Deploy Testing
- [ ] Browse catalog page
- [ ] Play audio preview
- [ ] Complete test purchase with real card (then refund)
- [ ] Check Stripe dashboard for successful payment
- [ ] Download purchased track via email link
- [ ] Access admin panel with production password

### 8. Monitoring
- [ ] Set up error tracking (Sentry recommended)
- [ ] Configure uptime monitoring (UptimeRobot/Better Uptime)
- [ ] Set up Stripe alerts for failed payments

---

## Rollback Plan
If production breaks:
1. Revert to last working commit: `git revert <commit-sha>`
2. Redeploy: `vercel --prod` or trigger platform redeploy
3. Check database migrations haven’t corrupted data

---

## Production URLs
- Site: https://beatslave.com
- Admin: https://beatslave.com/admin
- Stripe Dashboard: https://dashboard.stripe.com
- Database: (Supabase/Railway/Neon dashboard link)
