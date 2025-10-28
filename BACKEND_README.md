# BeatSlave Market v1.1 - Backend Implementation Guide

This document provides a complete guide to the backend implementation for BeatSlave Market v1.1.

---

## 🎯 Overview

BeatSlave Market is a Next.js 14 application with a complete backend for selling beat licenses. The backend handles:

- **Payment processing** via Stripe
- **Email notifications** via Resend
- **Secure downloads** with time-limited tokens
- **Admin dashboard** with analytics

---

## 🏗️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL (Supabase)
- **ORM:** Prisma
- **Payments:** Stripe
- **Email:** Resend
- **Deployment:** Netlify (recommended)

---

## 📦 Installation

### 1. Clone and Install Dependencies

```bash
git clone https://github.com/Danielson72/beatslave.git
cd beatslave
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

**Required variables:**

```env
# Database (PostgreSQL via Supabase)
DATABASE_URL="postgresql://USER:PASS@HOST:PORT/postgres?pgbouncer=true&connection_limit=1"

# Stripe Payment Processing
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Application URLs
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate_with_openssl_rand_base64_32"

# Email (Resend)
RESEND_API_KEY="re_..."
RESEND_FROM="BeatSlave <onboarding@resend.dev>"
RESEND_TO="admin@yourdomain.com"

# Admin Access
ADMIN_PASSWORD="your_secure_password"
NEXT_PUBLIC_ADMIN_UI_PASS="your_secure_password"
```

### 3. Set Up Database

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# (Optional) Seed database with sample data
npm run db:seed
```

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

---

## 🔐 Authentication

### Admin Authentication

Admin endpoints use **Bearer token authentication**:

```bash
curl -H "Authorization: Bearer YOUR_ADMIN_PASSWORD" \
  https://beatslave.netlify.app/api/admin/analytics
```

The admin password is set in the `ADMIN_PASSWORD` environment variable.

---

## 🌐 API Endpoints

### Public Endpoints

#### **GET /api/tracks**
List all active tracks.

**Response:**
```json
[
  {
    "id": "clxxx...",
    "title": "Kronological",
    "slug": "kronological",
    "artist": "The Tru Witnesses",
    "release": "Tru Witness Vol. 1",
    "bpm": 85,
    "key": "G Minor",
    "genre": "Hip Hop",
    "mood": "Dark",
    "tags": ["Gospel", "Boom Bap"],
    "priceCents": 99,
    "previewUrl": "/uploads/previews/kronological.mp3"
  }
]
```

---

#### **GET /api/tracks/[slug]**
Get details for a specific track.

**Example:** `GET /api/tracks/kronological`

---

#### **POST /api/checkout**
Create a Stripe checkout session.

**Request:**
```json
{
  "trackId": "clxxx...",
  "email": "customer@example.com",
  "acceptedTerms": true,
  "licenseType": "STANDARD"
}
```

**Response:**
```json
{
  "url": "https://checkout.stripe.com/c/pay/cs_test_..."
}
```

**Flow:**
1. Frontend calls this endpoint
2. Backend creates order in database (status: PENDING)
3. Backend creates Stripe checkout session
4. Frontend redirects user to Stripe checkout URL
5. User completes payment
6. Stripe sends webhook to `/api/webhooks/stripe`
7. Backend updates order status to COMPLETED
8. Backend sends confirmation emails

---

#### **POST /api/webhooks/stripe**
Stripe webhook handler (called by Stripe, not your frontend).

**Events handled:**
- `checkout.session.completed`

**Actions:**
- Updates order status to COMPLETED
- Generates 24-hour download token
- Records terms acceptance
- Sends purchase confirmation email to customer
- Sends admin notification email

---

#### **GET /api/download/[token]**
Download purchased track using a download token.

**Example:** `GET /api/download/550e8400-e29b-41d4-a716-446655440000`

**Response:** Binary audio file (WAV/MP3)

**Validations:**
- Token must exist
- Token must not be expired (24 hours)
- Order must be COMPLETED
- Token is marked as used after download

---

### Admin Endpoints

All admin endpoints require `Authorization: Bearer <ADMIN_PASSWORD>` header.

#### **POST /api/admin/tracks**
Create a new track.

**Request:**
```json
{
  "artistName": "The Tru Witnesses",
  "artistSlug": "the-tru-witnesses",
  "releaseName": "Tru Witness Vol. 1",
  "releaseSlug": "tru-witness-vol-1",
  "trackTitle": "Kronological",
  "trackSlug": "kronological",
  "bpm": 85,
  "key": "G Minor",
  "genre": "Hip Hop",
  "mood": "Dark",
  "tags": ["Gospel", "Boom Bap"],
  "standardPrice": 99,
  "isActive": true,
  "audioUrl": "/uploads/tracks/kronological.wav",
  "previewUrl": "/uploads/previews/kronological.mp3",
  "coverUrl": "/uploads/covers/tru-witness-vol-1.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "track": {
    "id": "clxxx...",
    "title": "Kronological",
    "slug": "kronological",
    "artist": "The Tru Witnesses",
    "release": "Tru Witness Vol. 1"
  }
}
```

---

#### **GET /api/admin/tracks**
List all tracks with sales statistics.

**Response:**
```json
{
  "tracks": [
    {
      "id": "clxxx...",
      "title": "Kronological",
      "slug": "kronological",
      "artist": "The Tru Witnesses",
      "release": "Tru Witness Vol. 1",
      "bpm": 85,
      "key": "G Minor",
      "genre": "Hip Hop",
      "mood": "Dark",
      "tags": ["Gospel", "Boom Bap"],
      "priceCents": 99,
      "isActive": true,
      "salesCount": 5,
      "createdAt": "2025-10-27T12:00:00Z"
    }
  ]
}
```

---

#### **GET /api/admin/orders**
List all orders.

**Query Parameters:**
- `status` (optional): Filter by order status (PENDING, COMPLETED, FAILED, REFUNDED)
- `limit` (optional): Number of orders to return (default: 50)

**Example:** `GET /api/admin/orders?status=COMPLETED&limit=20`

**Response:**
```json
{
  "orders": [
    {
      "id": "clxxx...",
      "customerEmail": "customer@example.com",
      "status": "COMPLETED",
      "totalCents": 99,
      "items": [
        {
          "trackTitle": "Kronological",
          "artistName": "The Tru Witnesses",
          "licenseType": "STANDARD",
          "priceCents": 99
        }
      ],
      "downloadTokens": [
        {
          "token": "550e8400-e29b-41d4-a716-446655440000",
          "expiresAt": "2025-10-28T12:00:00Z",
          "usedAt": "2025-10-27T13:00:00Z"
        }
      ],
      "termsAccepted": true,
      "createdAt": "2025-10-27T12:00:00Z"
    }
  ],
  "stats": [
    {
      "status": "COMPLETED",
      "count": 10,
      "totalRevenue": 990
    }
  ]
}
```

---

#### **GET /api/admin/analytics**
Get comprehensive analytics.

**Response:**
```json
{
  "revenue": {
    "total": 9900,
    "totalOrders": 100,
    "last30Days": 2970,
    "last30DaysOrders": 30,
    "byLicenseType": [
      {
        "licenseType": "STANDARD",
        "revenue": 9900,
        "count": 100
      }
    ]
  },
  "catalog": {
    "totalTracks": 25,
    "activeTracks": 20,
    "totalArtists": 5
  },
  "topTracks": [
    {
      "trackId": "clxxx...",
      "trackTitle": "Kronological",
      "artistName": "The Tru Witnesses",
      "salesCount": 15,
      "totalRevenue": 1485
    }
  ],
  "downloads": {
    "totalTokens": 100,
    "usedTokens": 85,
    "expiredTokens": 5,
    "unusedTokens": 10
  }
}
```

---

## 📧 Email Templates

### Purchase Confirmation Email

Sent to customer after successful payment.

**Includes:**
- Track title and artist
- License type
- Price paid
- Download link (24-hour expiration)
- Order ID
- What's included (WAV, MP3, license)

### Admin Notification Email

Sent to admin email after each sale.

**Includes:**
- Track title and artist
- License type
- Price
- Customer email
- Order ID
- Timestamp

---

## 🔄 Payment Flow Diagram

```
Customer                Frontend              Backend                 Stripe
   |                       |                     |                      |
   |--[Select Track]------>|                     |                      |
   |                       |                     |                      |
   |                       |--[POST /checkout]-->|                      |
   |                       |                     |--[Create Session]--->|
   |                       |                     |<--[Session URL]------|
   |                       |<--[Redirect URL]----|                      |
   |                       |                     |                      |
   |<--[Redirect to Stripe]|                     |                      |
   |                       |                     |                      |
   |--[Enter Payment]------|-------------------->|                      |
   |                       |                     |                      |
   |                       |                     |<--[Webhook Event]----|
   |                       |                     |                      |
   |                       |                     |--[Update Order]      |
   |                       |                     |--[Generate Token]    |
   |                       |                     |--[Send Emails]       |
   |                       |                     |                      |
   |<--[Redirect Success]--|                     |                      |
   |                       |                     |                      |
   |--[Click Download]---->|--[GET /download/token]->|                 |
   |<--[Audio File]--------|<--------------------|                      |
```

---

## 🚀 Deployment

### Netlify Deployment

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Backend implementation complete"
   git push origin main
   ```

2. **Import to Netlify:**
   - Go to https://vercel.com
   - Import your GitHub repository
   - Netlify will auto-detect Next.js

3. **Configure Environment Variables:**
   - In Netlify dashboard, go to Settings → Environment Variables
   - Add all variables from `.env`
   - Make sure to use production values for Stripe, Resend, etc.

4. **Deploy:**
   - Netlify will automatically deploy
   - Note your production URL (e.g., `https://beatslave.netlify.app`)

5. **Configure Stripe Webhook:**
   - Go to Stripe Dashboard → Developers → Webhooks
   - Add endpoint: `https://beatslave.netlify.app/api/webhooks/stripe`
   - Select event: `checkout.session.completed`
   - Copy webhook signing secret
   - Add to Netlify environment variables as `STRIPE_WEBHOOK_SECRET`

6. **Test in Production:**
   - Test checkout flow
   - Verify emails are sent
   - Test download with valid token

---

## 🧪 Testing

### Local Testing with Stripe CLI

1. **Install Stripe CLI:**
   ```bash
   brew install stripe/stripe-cli/stripe
   ```

2. **Login to Stripe:**
   ```bash
   stripe login
   ```

3. **Forward webhooks to local server:**
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

4. **Copy webhook secret to .env:**
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

5. **Trigger test payment:**
   ```bash
   stripe trigger checkout.session.completed
   ```

### Testing Emails

Use Resend's test mode to verify emails without sending to real addresses.

---

## 📁 Project Structure

```
beatslave/
├── app/
│   ├── api/
│   │   ├── admin/
│   │   │   ├── analytics/route.ts
│   │   │   ├── orders/route.ts
│   │   │   └── tracks/route.ts
│   │   ├── checkout/route.ts
│   │   ├── download/[token]/route.ts
│   │   ├── tracks/route.ts
│   │   ├── tracks/[slug]/route.ts
│   │   └── webhooks/stripe/route.ts
│   ├── admin/page.tsx
│   ├── catalog/page.tsx
│   ├── success/page.tsx
│   └── track/[slug]/page.tsx
├── lib/
│   ├── email-service.ts
│   ├── email-templates.ts
│   ├── resend.ts
│   ├── prisma.ts
│   ├── stripe.ts
│   └── utils.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── .env
├── .env.example
├── package.json
├── STATUS.md
└── BACKEND_README.md (this file)
```

---

## 🐛 Troubleshooting

### Database Connection Issues

**Error:** `Can't reach database server`

**Solution:**
- Check `DATABASE_URL` is correct
- Verify Supabase project is active
- Check connection pooling settings

### Stripe Webhook Not Working

**Error:** `Invalid signature`

**Solution:**
- Verify `STRIPE_WEBHOOK_SECRET` matches Stripe dashboard
- Check webhook endpoint URL is correct
- Use Stripe CLI for local testing

### Emails Not Sending

**Error:** `Failed to send email`

**Solution:**
- Verify `RESEND_API_KEY` is correct
- Check sender email is verified in Resend
- Review Resend dashboard for error logs

### Download Token Expired

**Error:** `Download token has expired`

**Solution:**
- Tokens expire after 24 hours
- Contact admin to regenerate token
- Future: Add token regeneration endpoint

---

## 📞 Support

For issues or questions:
- **Email:** dalvarez@sotsvc.com
- **GitHub:** https://github.com/Danielson72/beatslave

---

**Backend implementation by Manus AI Assistant**  
**Date:** October 27, 2025

