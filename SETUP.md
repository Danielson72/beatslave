# BeatSlave Market - Setup Guide

## ✅ What's Been Completed

Your BeatSlave Market v1.0 is now **production-ready** with:

### Database Setup ✓
- PostgreSQL schema deployed to Supabase
- 3 artists seeded
- 5 tracks seeded (Gospel, Hip Hop, Trap)
- RLS enabled with public read policies for catalog

### Application Features ✓
- **Landing Page** - Professional hero section and feature highlights
- **Catalog Page** - Grid layout with track listings
- **Track Detail Pages** - Audio preview, metadata, and purchase flow
- **Purchase Flow** - Stripe Checkout integration with terms acceptance
- **Success Page** - Download link with token validation
- **Legal Pages** - Terms of Service and License Agreement
- **Admin Dashboard** - Password-protected upload interface (UI-only)

### Technical Stack ✓
- Next.js 14 with App Router
- TypeScript with strict mode
- Prisma ORM connected to Supabase
- Stripe Checkout ready (needs API keys)
- Tailwind CSS + Shadcn UI components
- Mobile-first responsive design

### v1.1 Database Preparation ✓
All future royalty tracking fields exist in the database but are hidden from the UI:
- Premium License ($4.99)
- Exclusive License ($49.99)
- Royalty tracking tiers
- License agreement storage
- Royalty report tables

## 🚦 Next Steps to Go Live

### 1. Configure Stripe (Required)

Get your Stripe API keys from https://dashboard.stripe.com/apikeys

Update `.env.local`:
```env
STRIPE_PUBLISHABLE_KEY="pk_test_51..."
STRIPE_SECRET_KEY="sk_test_51..."
```

### 2. Set Up Stripe Webhooks (Required)

**For Development:**
```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the webhook signing secret (starts with `whsec_`) and add to `.env.local`:
```env
STRIPE_WEBHOOK_SECRET="whsec_..."
```

**For Production:**
1. Go to https://dashboard.stripe.com/webhooks
2. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Select event: `checkout.session.completed`
4. Copy webhook signing secret to production environment

### 3. Upload Track Files (Required)

Place actual audio files in these directories:
- `/public/uploads/covers/` - Cover artwork (JPG/PNG)
- `/public/uploads/tracks/` - Full tracks (WAV format)
- `/public/uploads/previews/` - 30-second previews (MP3 format)

Update the database records to point to the correct file paths.

### 4. Test the Purchase Flow

1. Start dev server: `npm run dev`
2. Browse to http://localhost:3000/catalog
3. Click on any track
4. Enter email and accept terms
5. Click "Buy Now" - you'll be redirected to Stripe Checkout
6. Use test card: `4242 4242 4242 4242`
7. Complete payment
8. You'll be redirected to success page with download link

### 5. Production Deployment Checklist

- [ ] Update `NEXTAUTH_URL` to production domain
- [ ] Generate new `NEXTAUTH_SECRET` with: `openssl rand -base64 32`
- [ ] Change `ADMIN_PASSWORD` to a strong password
- [ ] Switch Stripe to live mode keys (not test mode)
- [ ] Configure production webhook endpoint
- [ ] Upload real track files
- [ ] Test complete purchase flow in production
- [ ] Set up domain and SSL certificate

## 📊 Database Stats

- **Artists**: 3 seeded
- **Releases**: 3 seeded
- **Tracks**: 5 seeded and active
- **All tables**: RLS enabled
- **Public access**: Tracks, Artists, and Releases are publicly viewable

## 🔑 Admin Access

- URL: http://localhost:3000/admin
- Password: `admin123` (change in production!)

## 💡 Important Notes

### v1.0 Business Rules
- Only Standard License ($0.99) is shown in UI
- Premium and Exclusive tiers exist in database but are not exposed
- All purchases include: 2-Track WAV + MP3
- Download tokens expire after 24 hours
- Terms acceptance is required and tracked

### Stems Availability
On every track page and checkout confirmation, users see:
> "Stems available separately. Contact: dalvarez@sotsvc.com"

### Legal Protection
- Terms of Service must be accepted before purchase
- Server-side validation enforces terms acceptance
- TermsAcceptance records stored for each order
- License Agreement text stored with each purchase

## 🎵 Seeded Tracks

1. **Kronological** - The Tru Witnesses (85 BPM, Hip Hop, Dark)
2. **In The Shadows** - The Tru Witnesses (90 BPM, Hip Hop, Mysterious)
3. **Your Word Cuts Deep** - Aaliyah Infinite (72 BPM, Gospel/R&B, Emotional)
4. **Beauty in the Suffering** - Aaliyah Infinite (68 BPM, Gospel, Uplifting)
5. **Heavenly Vibin** - Daniel In The Lions Den (140 BPM, Trap, Energetic)

## 🚀 Running the Project

```bash
# Install dependencies (already done)
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Open Prisma Studio (database GUI)
npx prisma studio
```

## 📞 Support

For questions or issues, contact: dalvarez@sotsvc.com

---

**Status**: ✅ Ready for Stripe configuration and testing
**Version**: 1.0.0
**Build**: Successful
