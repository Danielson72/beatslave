# BeatSlave Market v1.0

Professional beat marketplace built with Next.js 14, TypeScript, Prisma, and Stripe. Gospel, Hip Hop, and Trap beats with instant downloads and secure licensing.

## 🎵 Features

### v1.0 (Current - Production Ready)
- ✅ Browse catalog with filters (genre, mood, BPM, search)
- ✅ Track detail pages with audio preview
- ✅ Standard License ($0.99) with Stripe Checkout
- ✅ Secure download tokens (24-hour validity)
- ✅ Legal pages (Terms, License Agreement)
- ✅ Terms acceptance enforcement
- ✅ Admin dashboard (password-gated)
- ✅ 2-Track downloads (WAV + MP3)

### v1.1 (Database Ready - Not in UI)
- 🔄 Premium License ($4.99) with royalty tracking
- 🔄 Exclusive License ($49.99) with royalty tiers
- 🔄 Royalty reporting system
- 🔄 Advanced license management

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database (Supabase recommended)
- Stripe account

### Installation

1. **Clone and install dependencies:**
```bash
npm install
```

2. **Configure environment variables:**

Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:
```env
# Get from Supabase dashboard
DATABASE_URL="postgresql://..."

# Get from Stripe dashboard
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..." # See webhook setup below

# Application settings
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-random-secret-here"
ADMIN_PASSWORD="your-secure-password"
NEXT_PUBLIC_ADMIN_UI_PASS="your-secure-password"
```

3. **Set up database:**
```bash
npx prisma migrate dev
npx prisma db seed
```

4. **Start development server:**
```bash
npm run dev
```

Visit http://localhost:3000

## 💳 Stripe Setup

### Test Mode

Use Stripe's test card for development:
- **Card Number:** 4242 4242 4242 4242
- **Expiry:** Any future date
- **CVC:** Any 3 digits
- **ZIP:** Any 5 digits

### Webhook Configuration

#### Option 1: Stripe CLI (Recommended for Development)

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Login: `stripe login`
3. Forward webhooks:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```
4. Copy the webhook signing secret (starts with `whsec_`) to your `.env.local`

#### Option 2: Stripe Dashboard (For Production)

1. Go to https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. Set URL: `https://yourdomain.com/api/webhooks/stripe`
4. Select event: `checkout.session.completed`
5. Copy the signing secret to your environment variables

## 📁 Project Structure

```
├── app/
│   ├── api/
│   │   ├── checkout/          # Create Stripe sessions
│   │   ├── webhooks/stripe/   # Handle payment completion
│   │   ├── download/[token]/  # Secure file downloads
│   │   └── tracks/            # Track API endpoints
│   ├── catalog/               # Browse all beats
│   ├── track/[slug]/          # Track detail + purchase
│   ├── success/               # Post-purchase page
│   ├── admin/                 # Upload dashboard
│   ├── legal/
│   │   ├── terms/             # Terms of Service
│   │   └── license/           # License Agreement
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Landing page
├── components/ui/             # Shadcn UI components
├── lib/
│   ├── prisma.ts              # Database client
│   ├── stripe.ts              # Stripe client
│   └── utils.ts               # Utilities
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Seed data
└── public/uploads/            # Local file storage
    ├── covers/
    ├── tracks/
    └── previews/
```

## 🗄️ Database Schema

### Core Models (v1.0 Active)
- **Artist** - Producer information
- **Release** - Album/EP grouping
- **Track** - Individual beats with metadata
- **Order** - Purchase records
- **OrderItem** - Line items per order
- **DownloadToken** - Secure 24h download links

### Future Models (v1.1 Ready)
- **TermsAcceptance** - Legal compliance tracking
- **LicenseAgreement** - License terms per purchase
- **RoyaltyReport** - Revenue sharing for Premium/Exclusive

## 🎨 Design & UX

- Mobile-first responsive design
- Clean, professional aesthetic
- Accessible forms with ARIA attributes
- Loading states for all async operations
- Audio preview player on track pages

## 🔒 Legal Protection

### v1.0 Implementation
1. Terms of Service page
2. License Agreement page
3. Checkbox requirement before purchase
4. Server-side validation of terms acceptance
5. TermsAcceptance records stored in database

### Important Copy (Always Visible)
> "Includes 2-Track WAV + MP3. Stems available separately. Contact: dalvarez@sotsvc.com"

## 🎯 Seed Data

5 pre-loaded tracks across 3 artists:

**The Tru Witnesses**
- Kronological (85 BPM, Hip Hop, Dark)
- In The Shadows (90 BPM, Hip Hop, Mysterious)

**Aaliyah Infinite**
- Your Word Cuts Deep (72 BPM, Gospel/R&B, Emotional)
- Beauty in the Suffering (68 BPM, Gospel, Uplifting)

**Daniel In The Lions Den**
- Heavenly Vibin (140 BPM, Trap, Energetic)

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript (strict mode)
- **Database:** PostgreSQL + Prisma ORM
- **Payments:** Stripe Checkout + Webhooks
- **UI:** Tailwind CSS + Shadcn/UI
- **Storage:** Local filesystem (v1.0), S3-ready (v1.1)
- **Validation:** Zod schemas

## 📝 Scripts

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:migrate   # Run Prisma migrations
npm run db:seed      # Seed database
npm run db:studio    # Open Prisma Studio
```

## 🚢 Production Deployment

1. **Build the application:**
```bash
npm run build
```

2. **Set production environment variables**
3. **Run migrations on production database:**
```bash
npx prisma migrate deploy
```

4. **Configure Stripe webhook endpoint** (see Webhook Configuration above)

## 🔐 Admin Access

Visit `/admin` and enter the password from `NEXT_PUBLIC_ADMIN_UI_PASS`.

**Note:** v1.0 admin panel is UI-only. File uploads require backend API integration.

## 🐛 Troubleshooting

### Webhooks Not Working
- Verify `STRIPE_WEBHOOK_SECRET` is set correctly
- Check Stripe CLI is running (`stripe listen`)
- Confirm endpoint URL in Stripe Dashboard

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Check database is running and accessible
- Run `npx prisma generate` after schema changes

### Downloads Not Working
- Ensure track files exist in `/public/uploads/tracks/`
- Check file permissions
- Verify download token hasn't expired (24h limit)

## 🎓 Development Notes

### Adding New Tracks Manually
1. Place audio files in `/public/uploads/tracks/`
2. Place preview clips in `/public/uploads/previews/`
3. Place cover art in `/public/uploads/covers/`
4. Add records via Prisma Studio or seed script

### v1.1 Migration Path
All v1.1 fields exist in database schema. To enable:
1. Update UI components to show Premium/Exclusive options
2. Update checkout route to handle new license types
3. Implement royalty calculation logic
4. Create admin interface for royalty reports

## 📧 Support & Contact

For stems, custom licenses, or support:
**Email:** dalvarez@sotsvc.com

## 📄 License

See LICENSE file for details.

---

**Version:** 1.0.0
**Status:** Production Ready
**Last Updated:** 2024
