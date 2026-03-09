# 🏁 RavePlus Collections: Final Setup Checklist

This document outlines the specific keys and settings you need to transition from "Development" to a "Live Professional Shop."

---

## 1. 📸 Instagram Products (@ravepluscollection)
Your site is ready to fetch products, but you need to link the correct account.
- [ ] **Link Account:** Go to [Behold.so](https://behold.so/), log in as **@ravepluscollection**, and link the account.
- [ ] **Get URL:** Create a new feed and copy the JSON URL.
- [ ] **Update Code:** Paste that URL into `assets/js/state.js` under `INSTAGRAM_FEED_URL`.
- [ ] **Pricing:** Ensure your Instagram captions include `₦45,000` or `45k` so the site can "read" the price.

---

## 2. 💳 Paystack Payments
To accept real money from customers:
- [ ] **Public Key:** Replace the `pk_test_...` key in `assets/js/checkout.js` with your **Live Public Key** from the Paystack Dashboard.
- [ ] **Verification:** Once deployed, add your **Secret Key** (`sk_live_...`) to your Vercel/Netlify environment variables as `PAYSTACK_SECRET_KEY`.

---

## 3. 📧 Automated Emails (Resend)
To send professional receipts automatically:
- [ ] **Signup:** Create a free account at [Resend.com](https://resend.com/).
- [ ] **Verify Domain:** Add your domain (e.g., `ravepluscollections.com`) to Resend so emails look official.
- [ ] **API Key:** Once deployed, add your API Key to environment variables as `RESEND_API_KEY`.

---

## 4. 🚀 Deployment (Going Live)
To put the site on the internet:
- [ ] **Platform:** Use [Vercel](https://vercel.com/) (Recommended) or Netlify.
- [ ] **Upload:** Upload the entire `raveplus-production` folder.
- [ ] **Env Variables:** In the dashboard, add:
    - `PAYSTACK_SECRET_KEY`
    - `RESEND_API_KEY`

---

## 🛠️ Maintenance & Backups
- **Backups:** I have created a `backups/` folder. Every time we make a big change, a `.bak` file is created there.
- **Admin Panel:** You can access your dashboard at `admin.html` (Local credentials: `admin@raveplus.com` / `raveadmin123`).

---
**Need help with any of these?** Just ask!
