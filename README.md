# RavePlus Collections 🌟

Welcome to **RavePlus Collections**! This is a modern, high-performance, and luxurious e-commerce storefront built to deliver an exceptional shopping experience. 

## 🚀 Overview

RavePlus Collections is a premium e-commerce web application built using the latest web technologies. The platform provides a seamless shopping journey from browsing the catalog to a secure checkout experience, complemented by elegant animations and responsive design.

## 🛠️ Tech Stack & Features

* **Framework:** [Next.js](https://nextjs.org/) (App Router)
* **UI & Styling:** [React](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/)
* **Animations:** [Framer Motion](https://www.framer.com/motion/)
* **State Management:** [Zustand](https://zustand-demo.pmnd.rs/) for robust, global application state (like the shopping cart).
* **Backend & Auth:** [Supabase](https://supabase.com/)
* **Payments:** [Paystack](https://paystack.com/) for secure, unified checkout.
* **Transactional Emails:** [Resend](https://resend.com/) for order confirmations and notifications.
* **Testing:** Jest and React Testing Library

## 🌟 Key Features

* **Elegant UI/UX:** Luxury-themed aesthetic featuring smooth scroll animations and shimmer effects.
* **Product Catalog:** Seamless grid layout showcasing premium items with Quick View options.
* **Real-time Cart:** Dynamic shopping cart implemented with Zustand, allowing instant updates without page reloads.
* **Secure Checkout Process:** Integrated Paystack payment gateway, complete with fallback handling and user address registration.
* **Automated Emails:** Instant order confirmation emails dispatched to customers and administrators utilizing the Resend API.
* **Robust Testing:** Well-covered unit tests ensuring stability in core components like modals, product cards, and state logic.

## 📦 Getting Started

### Prerequisites
Make sure you have Node.js and npm installed on your machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Cknwamz/RavePlusCollections.git
   cd raveplus-production
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Variables:**
   Create a `.env.local` file in the root directory and add the necessary API keys and configuration parameters (Supabase URLs, Paystack Public Key, Resend API Key, etc.).

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open the app:**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## 🧪 Testing

The project is configured with Jest and React Testing Library. To run the test suite:

```bash
npm run test
```

## 📜 License

This project is proprietary and intended for the RavePlus Collections business.

---
*Embrace Your Inner Royalty. Experience Luxury Redefined.*
