# 🔐 BeatSlave Market - Credentials Guide

**Last Updated:** October 27, 2025  
**For:** Netlify Deployment

---

## ✅ Credentials Retrieved (Ready to Use)

### **Database (Supabase)**
```
DATABASE_URL="postgresql://postgres.vvmlgbwtaavrkvygazgm:Danielson72@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
```

### **Email (Resend)**
```
RESEND_API_KEY="re_T3hsFp71_HPtWtoXVJgB274h9Zyp7STG9"
RESEND_FROM="BeatSlave <onboarding@resend.dev>"
RESEND_TO="dalvarez@sotsvc.com"
```

### **Application URLs**
```
NEXT_PUBLIC_BASE_URL="https://beatslave.netlify.app"
NEXTAUTH_URL="https://beatslave.netlify.app"
```

---

## ⚠️ Credentials You Need to Get

### **1. Stripe API Keys**

**Where to get them:**
- Go to: https://dashboard.stripe.com/test/apikeys
- Account: **Sonz of Thunder SVC** (acct_1Qlvp0GKbDbFMYBR)

**What to copy:**

**Publishable key:**
```
STRIPE_PUBLISHABLE_KEY="pk_test_..."
```
- This is visible on the page
- Copy the entire key starting with `pk_test_`

**Secret key:**
```
STRIPE_SECRET_KEY="sk_test_..."
```
- Click "Reveal test key" button
- Copy the entire key starting with `sk_test_`
- ⚠️ Keep this secret! Never commit to git

---

### **2. Stripe Webhook Secret**

**You'll get this AFTER deploying to Netlify:**

1. Deploy your site to Netlify first
2. Note your Netlify URL (e.g., `https://beatslave.netlify.app`)
3. Go to: https://dashboard.stripe.com/test/webhooks
4. Click "Add endpoint"
5. Enter URL: `https://beatslave.netlify.app/api/webhooks/stripe`
6. Select event to listen to: `checkout.session.completed`
7. Click "Add endpoint"
8. Copy the "Signing secret" (starts with `whsec_`)

```
STRIPE_WEBHOOK_SECRET="whsec_..."
```

---

### **3. Admin Password**

**Generate a secure password:**

```bash
# Option 1: Use openssl
openssl rand -base64 32

# Option 2: Use a password manager
# Option 3: Create a strong password manually
```

```
ADMIN_PASSWORD="YourSecurePassword123!"
NEXT_PUBLIC_ADMIN_UI_PASS="YourSecurePassword123!"
```

⚠️ Use the same password for both variables

---

### **4. NextAuth Secret**

**Generate with openssl:**

```bash
openssl rand -base64 32
```

Copy the output:
```
NEXTAUTH_SECRET="paste_generated_secret_here"
```

---

## 📋 Complete Environment Variables for Netlify

Copy this to Netlify Dashboard → Site settings → Environment variables:

```env
# Database
DATABASE_URL=postgresql://postgres.vvmlgbwtaavrkvygazgm:Danielson72@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1

# Application URLs
NEXT_PUBLIC_BASE_URL=https://beatslave.netlify.app
NEXTAUTH_URL=https://beatslave.netlify.app
NEXTAUTH_SECRET=[GENERATE_WITH_OPENSSL]

# Stripe (GET FROM DASHBOARD)
STRIPE_PUBLISHABLE_KEY=[FROM_STRIPE_DASHBOARD]
STRIPE_SECRET_KEY=[FROM_STRIPE_DASHBOARD]
STRIPE_WEBHOOK_SECRET=[FROM_STRIPE_WEBHOOK_SETUP]

# Email (Resend)
RESEND_API_KEY=re_T3hsFp71_HPtWtoXVJgB274h9Zyp7STG9
RESEND_FROM=BeatSlave <onboarding@resend.dev>
RESEND_TO=dalvarez@sotsvc.com

# Admin Access
ADMIN_PASSWORD=[YOUR_SECURE_PASSWORD]
NEXT_PUBLIC_ADMIN_UI_PASS=[YOUR_SECURE_PASSWORD]
```

---

## 🚀 Netlify Deployment Checklist

### **Step 1: Generate Secrets**
- [ ] Generate `NEXTAUTH_SECRET` with `openssl rand -base64 32`
- [ ] Create secure `ADMIN_PASSWORD`

### **Step 2: Get Stripe Keys**
- [ ] Go to https://dashboard.stripe.com/test/apikeys
- [ ] Copy `STRIPE_PUBLISHABLE_KEY` (pk_test_...)
- [ ] Reveal and copy `STRIPE_SECRET_KEY` (sk_test_...)

### **Step 3: Deploy to Netlify**
- [ ] Import repository to Netlify
- [ ] Add all environment variables (use placeholders for webhook secret)
- [ ] Deploy site
- [ ] Note your Netlify URL

### **Step 4: Configure Stripe Webhook**
- [ ] Go to https://dashboard.stripe.com/test/webhooks
- [ ] Add endpoint: `https://[your-site].netlify.app/api/webhooks/stripe`
- [ ] Select event: `checkout.session.completed`
- [ ] Copy webhook signing secret
- [ ] Add `STRIPE_WEBHOOK_SECRET` to Netlify env vars
- [ ] Redeploy site

### **Step 5: Test**
- [ ] Visit your site
- [ ] Test purchase with card: `4242 4242 4242 4242`
- [ ] Verify customer email received
- [ ] Verify admin email received
- [ ] Test download link

---

## 🔒 Security Notes

### **Never Commit These to Git:**
- ❌ `STRIPE_SECRET_KEY`
- ❌ `STRIPE_WEBHOOK_SECRET`
- ❌ `RESEND_API_KEY`
- ❌ `ADMIN_PASSWORD`
- ❌ `DATABASE_URL` (contains password)

### **Safe to Commit:**
- ✅ `STRIPE_PUBLISHABLE_KEY` (public key)
- ✅ `NEXT_PUBLIC_BASE_URL` (public URL)
- ✅ `RESEND_FROM` (email address)
- ✅ `RESEND_TO` (email address)

### **Already Protected:**
- ✅ `.env` is in `.gitignore`
- ✅ `.env.production` is in `.gitignore`
- ✅ Only `.env.example` is committed (with placeholders)

---

## 📞 Support

**Stripe Account:** Sonz of Thunder SVC (acct_1Qlvp0GKbDbFMYBR)  
**Stripe Dashboard:** https://dashboard.stripe.com  
**Resend Dashboard:** https://resend.com/dashboard  
**Supabase Dashboard:** https://supabase.com/dashboard

**Admin Email:** dalvarez@sotsvc.com

---

## 🎯 Quick Access Links

| Service | Link |
|---------|------|
| **Stripe API Keys** | https://dashboard.stripe.com/test/apikeys |
| **Stripe Webhooks** | https://dashboard.stripe.com/test/webhooks |
| **Resend Dashboard** | https://resend.com/dashboard |
| **Supabase Project** | https://supabase.com/dashboard/project/vvmlgbwtaavrkvygazgm |
| **Netlify Dashboard** | https://app.netlify.com |

---

**Prepared by:** Manus AI Assistant  
**Date:** October 27, 2025

