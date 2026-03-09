# RavePlus Collections — Deployment Guide

**Goal:** Take the site from local development to live production  
**Time Estimate:** 2-4 hours (first time), 30 minutes (updates)

---

## 🎯 Deployment Options

### Option 1: Vercel (Recommended)
**Best For:** Fast deployment, free SSL, serverless functions  
**Cost:** FREE  
**Speed:** 2 minutes to deploy

**Pros:**
- One-click GitHub deployment
- Automatic HTTPS
- Fast global CDN
- Can add serverless API routes later
- Great for React/Next.js if you migrate

**Cons:**
- Requires GitHub account

---

### Option 2: Netlify
**Best For:** Simple static sites, form handling  
**Cost:** FREE  
**Speed:** 3 minutes to deploy

**Pros:**
- Drag-and-drop deployment
- Built-in form handling
- Automatic HTTPS
- Can add serverless functions

**Cons:**
- Slightly slower than Vercel

---

### Option 3: GitHub Pages
**Best For:** Simple hosting, no backend needed  
**Cost:** FREE  
**Speed:** 5 minutes to deploy

**Pros:**
- Completely free
- Direct from GitHub repo
- Custom domain support

**Cons:**
- No serverless functions
- Slower than Vercel/Netlify
- Requires separate backend for API

---

## 🚀 Step-by-Step: Deploy to Vercel (Recommended)

### Prerequisites
- GitHub account
- Vercel account (sign up with GitHub)
- Your HTML file ready

### Step 1: Prepare Your Files
```
your-project/
├── index.html                 # Rename raveplus-v2.1-auth.html to this
├── .gitignore
└── README.md
```

Create `.gitignore`:
```
node_modules/
.env
.DS_Store
```

### Step 2: Push to GitHub
```bash
# In your project folder
git init
git add .
git commit -m "Initial commit - RavePlus Collections"

# Create new repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/raveplus-collections.git
git push -u origin main
```

### Step 3: Deploy to Vercel
1. Go to vercel.com
2. Click "New Project"
3. Import your GitHub repo
4. Vercel auto-detects settings
5. Click "Deploy"
6. Done! Live in 30 seconds

**Your URL:** `raveplus-collections.vercel.app`

### Step 4: Add Custom Domain
1. In Vercel dashboard → Settings → Domains
2. Add `ravepluscollections.com`
3. Update DNS records (Vercel gives instructions)
4. Wait 5-30 minutes for DNS propagation
5. SSL certificate auto-enabled

---

## 🔐 Environment Variables (Paystack Keys)

### Problem
Your Paystack keys are in the HTML file. Anyone can see them!

### Solution
For pure HTML sites, use Vercel environment variables + serverless function:

1. In Vercel dashboard → Settings → Environment Variables
2. Add `PAYSTACK_PUBLIC_KEY` and `PAYSTACK_SECRET_KEY`
3. Create API route to handle payments

**File:** `api/verify-payment.js`
```javascript
export default async function handler(req, res) {
  const { reference } = req.body;
  
  const response = await fetch(
    `https://api.paystack.co/transaction/verify/${reference}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
      }
    }
  );
  
  const data = await response.json();
  
  if (data.data.status === 'success') {
    // Save order, send email, etc.
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
}
```

Update frontend to call this API instead of trusting client.

---

## 📧 Email Setup (Order Confirmations)

### Option A: Resend (Recommended)
**Cost:** Free up to 100 emails/day  
**Setup Time:** 10 minutes

**Steps:**
1. Sign up at resend.com
2. Verify your domain (add DNS records)
3. Get API key
4. Create serverless function to send emails

**File:** `api/send-order-email.js`
```javascript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  const { order } = req.body;
  
  await resend.emails.send({
    from: 'orders@ravepluscollections.com',
    to: order.customerEmail,
    subject: `Order Confirmed - #${order.id}`,
    html: `
      <h1>Thank you for your order!</h1>
      <p>Order #${order.id}</p>
      <p>Total: ₦${order.total.toLocaleString()}</p>
    `
  });
  
  res.json({ success: true });
}
```

---

### Option B: SendGrid
**Cost:** Free up to 100 emails/day  
**Setup:** Similar to Resend

---

### Option C: Zapier (No Code)
**Cost:** Free tier available  
**Setup:** 15 minutes

**Workflow:**
1. Trigger: Paystack webhook (payment success)
2. Action: Send email via Gmail
3. Action: Log order in Google Sheets

---

## 📦 Product Images Hosting

### Option 1: Cloudinary (Recommended)
**Cost:** Free up to 25GB storage  
**Features:** Image optimization, CDN, transformations

**Setup:**
1. Sign up at cloudinary.com
2. Upload product images
3. Get image URLs
4. Use in your `PRODUCTS` array

**Example:**
```javascript
{
  id: 'product-1',
  name: 'Silk Boubou',
  images: [
    'https://res.cloudinary.com/raveplus/image/upload/v1/products/boubou-1.jpg',
    'https://res.cloudinary.com/raveplus/image/upload/v1/products/boubou-2.jpg',
  ]
}
```

---

### Option 2: GitHub Assets
**Cost:** FREE  
**Limit:** 1GB per repo

Store images in repo:
```
your-project/
└── assets/
    └── products/
        ├── boubou-1.jpg
        ├── boubou-2.jpg
        └── ...
```

Reference as:
```javascript
images: ['./assets/products/boubou-1.jpg']
```

---

### Option 3: AWS S3
**Cost:** $0.023 per GB/month  
**Best For:** Large catalogs (100+ products)

---

## 🔒 Security Checklist

### Before Going Live
- [ ] Move Paystack secret key to backend
- [ ] Add rate limiting (prevent spam)
- [ ] Validate all form inputs server-side
- [ ] Enable HTTPS (auto with Vercel/Netlify)
- [ ] Add CORS headers if using API
- [ ] Hash passwords (if storing user data)
- [ ] Add honeypot to forms (spam prevention)
- [ ] Set up CSP headers (Content Security Policy)

### User Data Protection
- [ ] Write privacy policy
- [ ] Add GDPR cookie notice (if serving EU)
- [ ] Encrypt sensitive data
- [ ] Don't log payment details
- [ ] Enable 2FA for admin access

---

## 📊 Analytics Setup

### Google Analytics 4
**Free, Essential**

**Setup:**
1. Go to analytics.google.com
2. Create property
3. Get tracking ID (G-XXXXXXXXXX)
4. Add to HTML `<head>`:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

**Track Events:**
```javascript
// Track add to cart
gtag('event', 'add_to_cart', {
  items: [{
    item_name: product.name,
    price: product.price
  }]
});

// Track purchase
gtag('event', 'purchase', {
  transaction_id: order.id,
  value: order.total,
  currency: 'NGN'
});
```

---

### Facebook Pixel
**For Ads**

**Setup:**
1. Go to business.facebook.com
2. Create pixel
3. Get pixel ID
4. Add to HTML:

```html
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', 'YOUR_PIXEL_ID');
fbq('track', 'PageView');
</script>
```

---

## 🚨 Common Deployment Issues

### Issue 1: "Site not loading after deploy"
**Cause:** File path case sensitivity  
**Fix:** Rename `Index.html` → `index.html` (lowercase)

---

### Issue 2: "Images not showing"
**Cause:** Relative paths broken  
**Fix:** Use absolute URLs or fix paths

❌ Wrong: `<img src="./products/dress.jpg">`  
✅ Right: `<img src="/products/dress.jpg">`

---

### Issue 3: "Paystack popup blocked"
**Cause:** Browser popup blocker  
**Fix:** Ensure user interaction triggered it

```javascript
// Must be called from user click, not async callback
button.onclick = () => {
  PaystackPop.setup({...}).openIframe();
};
```

---

### Issue 4: "localStorage not working"
**Cause:** Incognito mode or Safari restrictions  
**Fix:** Add try-catch:

```javascript
try {
  localStorage.setItem('cart', JSON.stringify(cart));
} catch (e) {
  // Fallback: use cookies or session storage
  sessionStorage.setItem('cart', JSON.stringify(cart));
}
```

---

## 🔄 Updating Your Live Site

### Method 1: Git Push (Automatic)
```bash
# Make changes to your code
git add .
git commit -m "Update: added new products"
git push

# Vercel auto-deploys in 30 seconds
```

---

### Method 2: Vercel Dashboard
1. Go to vercel.com/dashboard
2. Select your project
3. Click "Redeploy"

---

## 📱 Mobile App (Progressive Web App)

Make your site installable on phones!

**Add to HTML `<head>`:**
```html
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#FF5722">
<link rel="apple-touch-icon" href="/icon-192.png">
```

**Create `manifest.json`:**
```json
{
  "name": "RavePlus Collections",
  "short_name": "RavePlus",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#FAF9F6",
  "theme_color": "#FF5722",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

Now users can "Add to Home Screen" and use like an app!

---

## 🎯 Launch Day Checklist

### 24 Hours Before
- [ ] Final test all features
- [ ] Switch to Paystack live keys
- [ ] Test real payment with own card
- [ ] Verify emails are sending
- [ ] Double-check all links work
- [ ] Test on 3+ different devices
- [ ] Backup all code to GitHub
- [ ] Prepare social media posts
- [ ] Draft launch email

### Launch Day
- [ ] Deploy to production
- [ ] Test live site thoroughly
- [ ] Make a real test purchase
- [ ] Post on Instagram/Twitter
- [ ] Send launch email
- [ ] Share in WhatsApp groups
- [ ] Update Google Business listing
- [ ] Monitor analytics

### First Week
- [ ] Check orders daily
- [ ] Respond to inquiries within 2 hours
- [ ] Fix any bugs immediately
- [ ] Gather customer feedback
- [ ] Monitor conversion rates
- [ ] Adjust based on data

---

## 📞 Support Resources

**Vercel Docs:** vercel.com/docs  
**Paystack Docs:** paystack.com/docs  
**Resend Docs:** resend.com/docs  
**Cloudinary Docs:** cloudinary.com/documentation

**Need Help?**
- Vercel Discord: vercel.com/discord
- Paystack Support: support@paystack.com
- Stack Overflow: stackoverflow.com

---

**Last Updated:** February 27, 2026  
**Next:** Build admin dashboard
