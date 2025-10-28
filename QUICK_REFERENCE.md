# 🎵 BeatSlave Market - Quick Reference Card

**Repository:** https://github.com/Danielson72/beatslave  
**Latest Commit:** f832f14 - "Update deployment platform to Netlify and add AI handoff docs"  
**Status:** ✅ Backend Complete, Ready for Netlify Deployment

---

## 📋 Quick Facts

| Item | Value |
|------|-------|
| **Framework** | Next.js 14 (App Router) + TypeScript |
| **Database** | Supabase PostgreSQL via Prisma |
| **Payments** | Stripe |
| **Email** | Resend |
| **Deployment** | Netlify |
| **Admin Email** | dalvarez@sotsvc.com |

---

## 🌐 API Endpoints

### Public
- `GET /api/tracks` - List tracks
- `GET /api/tracks/[slug]` - Track details
- `POST /api/checkout` - Create checkout
- `POST /api/webhooks/stripe` - Stripe webhook
- `GET /api/download/[token]` - Download file

### Admin (requires `Authorization: Bearer <ADMIN_PASSWORD>`)
- `POST /api/admin/tracks` - Create track
- `GET /api/admin/tracks` - List tracks
- `GET /api/admin/orders` - List orders
- `GET /api/admin/analytics` - Get analytics

---

## 🔐 Environment Variables (Netlify)

```env
DATABASE_URL=postgresql://postgres.vvmlgbwtaavrkvygazgm:Danielson72@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
NEXT_PUBLIC_BASE_URL=https://beatslave.netlify.app
NEXTAUTH_URL=https://beatslave.netlify.app
NEXTAUTH_SECRET=generate_with_openssl_rand_base64_32
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
RESEND_API_KEY=re_...
RESEND_FROM=BeatSlave <onboarding@resend.dev>
RESEND_TO=dalvarez@sotsvc.com
ADMIN_PASSWORD=your_secure_password
NEXT_PUBLIC_ADMIN_UI_PASS=your_secure_password
```

---

## 🚀 Netlify Deployment Steps

1. **Connect:** Import `Danielson72/beatslave` to Netlify
2. **Build:** Auto-detected (Next.js)
3. **Env Vars:** Add all variables above
4. **Deploy:** Click deploy
5. **Stripe Webhook:** Add `https://beatslave.netlify.app/api/webhooks/stripe` to Stripe dashboard
6. **Test:** Purchase with card `4242 4242 4242 4242`

---

## 📧 Email Flow

**Customer receives:**
- Purchase confirmation with download link
- 24-hour expiration notice
- Order details

**Admin receives:**
- New sale notification
- Customer and track details
- Revenue info

---

## 🔄 Purchase Flow

```
Customer → Checkout → Stripe Payment → Webhook → 
Order COMPLETED → Token Generated → Emails Sent → 
Customer Downloads → Token Used
```

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `STATUS.md` | Implementation status & checklist |
| `BACKEND_README.md` | Complete API documentation |
| `MANUS_HANDOFF.md` | Executive summary |
| `HANDOFF_TO_CLAUDE.md` | Handoff for Claude AI |
| `HANDOFF_TO_CHATGPT.md` | Handoff for ChatGPT |
| `QUICK_REFERENCE.md` | This file |

---

## ⚡ Quick Commands

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run development server
npm run dev

# Build for production
npm run build

# Run database migrations
npx prisma migrate deploy

# Open Prisma Studio
npx prisma studio

# Test Stripe webhook locally
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

---

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| Emails not sending | Check `RESEND_API_KEY` in Netlify env vars |
| Stripe webhook failing | Verify `STRIPE_WEBHOOK_SECRET` matches Stripe dashboard |
| Download not working | Check file exists in `/public/uploads/` |
| Database error | Verify `DATABASE_URL` and Supabase is active |

---

## 🎯 What's Working

✅ Stripe payment processing  
✅ Email notifications (customer + admin)  
✅ Secure downloads with token validation  
✅ Admin dashboard API  
✅ Bearer token authentication  
✅ Professional email templates  
✅ Comprehensive error handling  

---

## 📞 Support

**Email:** dalvarez@sotsvc.com  
**Repo:** https://github.com/Danielson72/beatslave

---

**Last Updated:** October 27, 2025 by Manus AI

