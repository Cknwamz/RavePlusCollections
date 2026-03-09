# RavePlus Collections — API Integration Guide

**Purpose:** Connect backend services for payment verification, email notifications, and data persistence

---

## 🎯 Critical APIs to Integrate

### 1. Payment Verification (Paystack)
### 2. Email Notifications (Resend)
### 3. Order Webhooks (Paystack → Your Server)
### 4. Image Hosting (Cloudinary)
### 5. SMS Notifications (Optional - Africa's Talking)

---

## 💳 1. Paystack Payment Verification

### Problem
Currently, the frontend trusts that payment succeeded without server-side verification. A malicious user could fake a successful payment.

### Solution
Create backend API route to verify payment before creating order.

---

### Backend Setup (Node.js + Vercel Serverless)

**File:** `api/verify-payment.js`

```javascript
// Required: npm install node-fetch
const fetch = require('node-fetch');

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { reference } = req.body;

  // Validate input
  if (!reference) {
    return res.status(400).json({ error: 'Payment reference required' });
  }

  try {
    // Call Paystack verify endpoint
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        }
      }
    );

    const data = await response.json();

    if (data.status && data.data.status === 'success') {
      // Payment is legitimate
      return res.json({
        success: true,
        amount: data.data.amount / 100, // Convert from kobo to naira
        customer: data.data.customer.email,
        reference: data.data.reference,
        paidAt: data.data.paid_at
      });
    } else {
      // Payment failed or is pending
      return res.json({
        success: false,
        message: 'Payment not successful'
      });
    }

  } catch (error) {
    console.error('Paystack verification error:', error);
    return res.status(500).json({ error: 'Verification failed' });
  }
}
```

---

### Frontend Integration

Update `proceedToCheckout()` in main HTML:

```javascript
function proceedToCheckout() {
  // ... existing code ...

  const handler = PaystackPop.setup({
    key: 'pk_live_xxx',
    email: currentUser.email,
    amount: total * 100,
    currency: 'NGN',
    ref: reference,
    callback: async function(response) {
      // STEP 1: Verify payment on server
      const verifyRes = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference: response.reference })
      });

      const verifyData = await verifyRes.json();

      if (verifyData.success) {
        // STEP 2: Payment verified, create order
        const order = {
          id: reference,
          date: new Date().toISOString(),
          items: cart,
          total: total,
          status: 'Confirmed',
          paymentRef: response.reference,
          verifiedAt: verifyData.paidAt
        };

        // STEP 3: Save order
        currentUser.orders.push(order);
        updateUserData();

        // STEP 4: Send confirmation email
        await fetch('/api/send-order-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order, customer: currentUser })
        });

        // Clear cart
        cart = [];
        localStorage.setItem('raveplus_cart', JSON.stringify(cart));
        renderCart();

        alert('Order confirmed! Check your email for details.');
      } else {
        alert('Payment verification failed. Please contact support.');
      }
    },
    onClose: function() {
      alert('Payment window closed');
    }
  });

  handler.openIframe();
}
```

---

### Environment Variables (Vercel)

Add to Vercel dashboard → Settings → Environment Variables:

```
PAYSTACK_SECRET_KEY=sk_live_xxxxxxxxxxxxx
```

---

## 📧 2. Email Notifications (Resend)

### Setup

1. Sign up at resend.com
2. Add and verify your domain
3. Get API key
4. Install: `npm install resend`

---

### Backend Route

**File:** `api/send-order-email.js`

```javascript
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { order, customer } = req.body;

  try {
    // Send to customer
    await resend.emails.send({
      from: 'orders@ravepluscollections.com',
      to: customer.email,
      subject: `Order Confirmed - #${order.id}`,
      html: buildOrderEmail(order, customer)
    });

    // Send copy to admin
    await resend.emails.send({
      from: 'orders@ravepluscollections.com',
      to: 'ohraveplus@gmail.com',
      subject: `New Order - #${order.id}`,
      html: buildAdminEmail(order, customer)
    });

    return res.json({ success: true });

  } catch (error) {
    console.error('Email send error:', error);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}

function buildOrderEmail(order, customer) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; background: #FAF9F6; padding: 40px; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 12px; }
        .header { text-align: center; margin-bottom: 40px; }
        .logo { font-family: 'Georgia', serif; font-size: 36px; color: #FF5722; }
        .order-id { font-size: 24px; font-weight: bold; margin: 20px 0; }
        .items { margin: 30px 0; }
        .item { padding: 15px 0; border-bottom: 1px solid #eee; }
        .total { font-size: 24px; font-weight: bold; margin-top: 20px; padding-top: 20px; border-top: 2px solid #FF5722; }
        .footer { text-align: center; margin-top: 40px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">RavePlus Collections</div>
          <p style="color: #666;">Thank you for your order!</p>
        </div>

        <p>Dear ${customer.name},</p>
        <p>Your order has been confirmed and is being processed.</p>

        <div class="order-id">Order #${order.id}</div>

        <div class="items">
          <h3>Order Details:</h3>
          ${order.items.map(item => `
            <div class="item">
              <strong>${item.name}</strong><br>
              Size: ${item.size || 'N/A'} | Color: ${item.color || 'N/A'}<br>
              Quantity: ${item.qty} × ₦${item.price.toLocaleString()} = ₦${(item.qty * item.price).toLocaleString()}
            </div>
          `).join('')}
        </div>

        <div class="total">
          Total: ₦${order.total.toLocaleString()}
        </div>

        <p style="margin-top: 30px;">
          <strong>Delivery Information:</strong><br>
          Your order will be delivered within 5-7 business days.<br>
          You will receive a tracking number once your order ships.
        </p>

        <p>
          Questions? Contact us:<br>
          WhatsApp: +234 802 342 7426<br>
          Email: ohraveplus@gmail.com
        </p>

        <div class="footer">
          <p>RavePlus Collections | Lagos, Nigeria</p>
          <p>© 2025 All rights reserved</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function buildAdminEmail(order, customer) {
  return `
    <h2>New Order Received</h2>
    <p><strong>Order ID:</strong> ${order.id}</p>
    <p><strong>Customer:</strong> ${customer.name} (${customer.email})</p>
    <p><strong>Phone:</strong> ${customer.phone}</p>
    <p><strong>Total:</strong> ₦${order.total.toLocaleString()}</p>
    <h3>Items:</h3>
    <ul>
      ${order.items.map(item => `
        <li>${item.name} - ${item.size} / ${item.color} × ${item.qty}</li>
      `).join('')}
    </ul>
    <p><strong>Payment Reference:</strong> ${order.paymentRef}</p>
  `;
}
```

---

### Environment Variables

Add to Vercel:

```
RESEND_API_KEY=re_xxxxxxxxxxxxx
```

---

## 🔔 3. Paystack Webhooks

Webhooks let Paystack notify your server when payments happen (more reliable than client-side callbacks).

### Setup Webhook URL

1. Go to Paystack Dashboard → Settings → Webhooks
2. Add webhook URL: `https://your-domain.com/api/paystack-webhook`
3. Save the secret key shown

---

### Backend Route

**File:** `api/paystack-webhook.js`

```javascript
const crypto = require('crypto');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  // Verify webhook signature
  const hash = crypto
    .createHmac('sha512', process.env.PAYSTACK_WEBHOOK_SECRET)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (hash !== req.headers['x-paystack-signature']) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  const event = req.body;

  // Handle different event types
  switch (event.event) {
    case 'charge.success':
      await handleSuccessfulPayment(event.data);
      break;

    case 'charge.failed':
      await handleFailedPayment(event.data);
      break;

    case 'transfer.success':
      await handleRefund(event.data);
      break;

    default:
      console.log('Unhandled event type:', event.event);
  }

  return res.status(200).json({ received: true });
}

async function handleSuccessfulPayment(data) {
  // Extract order info from metadata
  const orderRef = data.reference;
  const customerEmail = data.customer.email;
  const amount = data.amount / 100;

  console.log(`Payment successful: ${orderRef} - ₦${amount}`);

  // TODO: Update order status in database
  // TODO: Send confirmation email
  // TODO: Notify admin via SMS/WhatsApp
}

async function handleFailedPayment(data) {
  console.log('Payment failed:', data.reference);
  // TODO: Send email to customer about failed payment
}

async function handleRefund(data) {
  console.log('Refund processed:', data.reference);
  // TODO: Update order status
}
```

---

## 🖼️ 4. Image Hosting (Cloudinary)

### Setup

1. Sign up at cloudinary.com
2. Get your cloud name, API key, API secret
3. Upload images via dashboard or API

---

### Upload Images

**Option A: Manual Upload via Dashboard**
1. Go to Media Library
2. Upload images
3. Copy URLs
4. Use in products array

---

**Option B: Programmatic Upload**

```javascript
// Install: npm install cloudinary
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload image
async function uploadProductImage(filePath) {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'raveplus/products',
      transformation: [
        { width: 800, height: 1000, crop: 'fill' },
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ]
    });

    return result.secure_url;
  } catch (error) {
    console.error('Upload failed:', error);
  }
}
```

---

### Image Optimization

Add Cloudinary transformations to URLs:

```javascript
const PRODUCTS = [
  {
    id: 'product-1',
    images: [
      'https://res.cloudinary.com/raveplus/image/upload/w_800,h_1000,c_fill,q_auto,f_auto/v1/products/dress-1.jpg',
      'https://res.cloudinary.com/raveplus/image/upload/w_800,h_1000,c_fill,q_auto,f_auto/v1/products/dress-2.jpg'
    ]
  }
];
```

**Transformations:**
- `w_800,h_1000` - Resize to 800×1000
- `c_fill` - Crop to fill dimensions
- `q_auto` - Automatic quality
- `f_auto` - Automatic format (WebP for supported browsers)

---

## 📱 5. SMS Notifications (Optional)

Use Africa's Talking for Nigerian phone numbers.

### Setup

1. Sign up at africastalking.com
2. Get API key and username
3. Buy SMS credits

---

### Send SMS

```javascript
const AfricasTalking = require('africastalking')({
  apiKey: process.env.AFRICASTALKING_API_KEY,
  username: 'raveplus'
});

const sms = AfricasTalking.SMS;

async function sendOrderSMS(phone, orderRef, total) {
  try {
    const result = await sms.send({
      to: [phone],
      message: `RavePlus: Your order #${orderRef} (₦${total.toLocaleString()}) is confirmed! Track: ravepluscollections.com/orders/${orderRef}`
    });

    console.log('SMS sent:', result);
  } catch (error) {
    console.error('SMS failed:', error);
  }
}
```

---

## 🔐 Security Best Practices

### 1. Rate Limiting

Prevent abuse of API endpoints:

```javascript
// Simple in-memory rate limiter
const requestCounts = new Map();

function rateLimit(ip, maxRequests = 10, windowMs = 60000) {
  const now = Date.now();
  const requests = requestCounts.get(ip) || [];
  
  // Remove old requests outside window
  const recent = requests.filter(time => now - time < windowMs);
  
  if (recent.length >= maxRequests) {
    return false; // Rate limit exceeded
  }
  
  recent.push(now);
  requestCounts.set(ip, recent);
  return true; // Allow request
}

export default async function handler(req, res) {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  
  if (!rateLimit(ip)) {
    return res.status(429).json({ error: 'Too many requests' });
  }
  
  // ... rest of handler
}
```

---

### 2. Input Validation

Always validate user input:

```javascript
function validateOrder(order) {
  if (!order.items || !Array.isArray(order.items)) {
    throw new Error('Invalid items');
  }
  
  if (order.items.length === 0) {
    throw new Error('Empty order');
  }
  
  if (typeof order.total !== 'number' || order.total <= 0) {
    throw new Error('Invalid total');
  }
  
  // Verify total matches items
  const calculatedTotal = order.items.reduce((sum, item) => {
    return sum + (item.price * item.qty);
  }, 0);
  
  if (Math.abs(calculatedTotal - order.total) > 1) {
    throw new Error('Total mismatch');
  }
  
  return true;
}
```

---

### 3. CORS Configuration

Only allow requests from your domain:

```javascript
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'https://ravepluscollections.com');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // ... rest of handler
}
```

---

## 🧪 Testing

### Test Payment Verification

```bash
curl -X POST https://your-domain.com/api/verify-payment \
  -H "Content-Type: application/json" \
  -d '{"reference":"RAVE-123456789"}'
```

### Test Email Sending

```bash
curl -X POST https://your-domain.com/api/send-order-email \
  -H "Content-Type: application/json" \
  -d '{
    "order": {
      "id": "RAVE-123",
      "total": 45000,
      "items": [{"name":"Test Product","qty":1,"price":45000}]
    },
    "customer": {
      "name": "Test User",
      "email": "test@example.com"
    }
  }'
```

---

## 📋 Integration Checklist

- [ ] Set up Vercel account
- [ ] Create serverless functions
- [ ] Add environment variables
- [ ] Test payment verification
- [ ] Set up Resend for emails
- [ ] Test email delivery
- [ ] Configure Paystack webhook
- [ ] Test webhook delivery
- [ ] Upload products to Cloudinary
- [ ] Update product images in code
- [ ] Add rate limiting
- [ ] Add input validation
- [ ] Test end-to-end flow
- [ ] Monitor logs for errors

---

**Last Updated:** February 27, 2026  
**Next:** Deploy to production and monitor
