# 🔧 Supabase CORS Configuration - Quick Guide

**Project:** BeatSlave Market  
**Project ID:** vvmlgbwtaavrkvygazgm

---

## 📍 Step-by-Step Instructions

### **Step 1: Open Supabase Dashboard**

Click this direct link:
👉 **https://supabase.com/dashboard/project/vvmlgbwtaavrkvygazgm/settings/api**

This will take you directly to the API settings page.

---

### **Step 2: Navigate to CORS Section**

Once on the API settings page:

1. You'll see several sections on the page
2. Scroll down to find the **"CORS Configuration"** section
3. It should be below the "Project API keys" section

**Alternative navigation if link doesn't work:**
1. Go to https://supabase.com/dashboard
2. Click on your **BeatSlave** project
3. Click the **⚙️ Settings** icon in the left sidebar (at the bottom)
4. Click **"API"** in the settings menu
5. Scroll down to **"CORS Configuration"**

---

### **Step 3: Add Allowed Origins**

In the CORS Configuration section:

1. You'll see a text field or list for "Allowed Origins"
2. Add each of these origins (one per line or separated by commas):

```
http://localhost:3000
http://localhost:5173
https://*.bolt.new
https://*.netlify.app
https://beatslave.netlify.app
```

**Important Notes:**
- Include the `http://` or `https://` protocol
- Wildcards (`*`) are supported for subdomains
- Each origin should be on a new line or comma-separated

---

### **Step 4: Save Configuration**

1. Click the **"Save"** or **"Update"** button
2. Wait for confirmation message
3. Changes should take effect immediately

---

## ✅ Verification

After saving, test by:

1. Opening your Bolt.new frontend
2. Attempting to upload a file to Supabase Storage
3. If successful, CORS is configured correctly
4. If you get a CORS error, double-check the origins

---

## 🔍 What CORS Does

CORS (Cross-Origin Resource Sharing) allows your frontend (running on Bolt.new or Netlify) to make requests to your Supabase backend (different domain).

Without CORS configured, browsers will block these requests for security reasons.

---

## 📞 Need Help?

If you can't find the CORS settings or encounter issues:

1. Make sure you're logged into the correct Supabase account
2. Verify you have admin access to the project
3. Try refreshing the dashboard page
4. Check Supabase documentation: https://supabase.com/docs/guides/api#cors

---

## 🎯 Quick Summary

**Direct Link:** https://supabase.com/dashboard/project/vvmlgbwtaavrkvygazgm/settings/api

**Add these origins:**
- `http://localhost:3000`
- `http://localhost:5173`
- `https://*.bolt.new`
- `https://*.netlify.app`
- `https://beatslave.netlify.app`

**Then click Save!**

---

**That's it! Once CORS is configured, your storage buckets will be fully accessible from the frontend. 🚀**

