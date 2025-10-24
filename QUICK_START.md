# BeatSlave Market - Quick Start

## 🎯 Get Running in 3 Steps

### Step 1: Add Stripe Keys
Edit `.env.local` and add your Stripe keys from https://dashboard.stripe.com/test/apikeys

```env
STRIPE_PUBLISHABLE_KEY="pk_test_YOUR_KEY_HERE"
STRIPE_SECRET_KEY="sk_test_YOUR_KEY_HERE"
```

### Step 2: Start Stripe Webhook Listener
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the webhook secret that appears (starts with `whsec_`) and add to `.env.local`:
```env
STRIPE_WEBHOOK_SECRET="whsec_YOUR_SECRET_HERE"
```

### Step 3: Start Dev Server
```bash
npm run dev
```

Visit: http://localhost:3000

## 🧪 Test a Purchase

1. Go to http://localhost:3000/catalog
2. Click any track
3. Enter email: `test@example.com`
4. Check "I agree to terms"
5. Click "Buy Now"
6. Use Stripe test card: `4242 4242 4242 4242`
7. Any future expiry date, any CVC
8. Complete purchase
9. Download your track!

## 📋 What's Included

- ✅ 5 sample tracks already in database
- ✅ Catalog with filters (genre, BPM, mood)
- ✅ Audio preview player
- ✅ Secure checkout with Stripe
- ✅ 24-hour download tokens
- ✅ Legal pages (Terms & License)
- ✅ Admin dashboard at /admin (password: `admin123`)

## 🎵 Sample Tracks

- Kronological (85 BPM Hip Hop)
- In The Shadows (90 BPM Hip Hop)
- Your Word Cuts Deep (72 BPM Gospel/R&B)
- Beauty in the Suffering (68 BPM Gospel)
- Heavenly Vibin (140 BPM Trap)

## 🔐 Admin Panel

- URL: http://localhost:3000/admin
- Password: `admin123`

## 💡 Pricing

- **Standard License**: $0.99 (only tier shown in v1.0)
- Includes: 2-Track WAV + MP3
- Stems: Available separately via email

## ⚙️ Environment Variables

All critical env vars are in `.env.local`:
- `DATABASE_URL` - ✅ Already configured (Supabase)
- `STRIPE_PUBLISHABLE_KEY` - ⚠️ ADD YOUR KEY
- `STRIPE_SECRET_KEY` - ⚠️ ADD YOUR KEY
- `STRIPE_WEBHOOK_SECRET` - ⚠️ ADD AFTER STEP 2
- `ADMIN_PASSWORD` - ✅ Set to `admin123`

## 📞 Need Help?

See `SETUP.md` for detailed documentation or contact: dalvarez@sotsvc.com

---

**Ready to go live?** See "Production Deployment Checklist" in SETUP.md
