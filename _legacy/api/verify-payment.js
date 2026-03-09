/**
 * Paystack Payment Verification (Serverless Function)
 * This securely checks with Paystack to make sure the payment actually happened.
 */
const fetch = require('node-fetch');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { reference } = req.body;

  try {
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`, // Hidden in env variables
      }
    });

    const data = await response.json();

    if (data.status && data.data.status === 'success') {
      return res.status(200).json({ success: true, data: data.data });
    } else {
      return res.status(400).json({ success: false, message: 'Verification failed' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
