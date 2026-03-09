import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { order, customer } = await request.json();

    // 1. Send to Customer
    await resend.emails.send({
      from: 'RavePlus Collections <orders@ravepluscollections.com>',
      to: customer.email,
      subject: `Order Confirmed - #${order.id}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 40px; border-radius: 10px;">
          <h1 style="color: #FF5722; text-align: center;">RavePlus Collections</h1>
          <p>Dear ${customer.name},</p>
          <p>Your masterpiece has been reserved! We are currently preparing your order for shipment.</p>
          
          <div style="background: #FAF9F6; padding: 20px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Order #${order.id}</h3>
            <ul style="list-style: none; padding: 0;">
              ${order.items.map((item: any) => `
                <li style="padding: 10px 0; border-bottom: 1px solid #ddd;">
                  ${item.name} x ${item.qty} - ₦${(item.price * item.qty).toLocaleString()}
                </li>
              `).join('')}
            </ul>
            <p style="font-size: 18px; font-weight: bold;">Total: ₦${order.total.toLocaleString()}</p>
          </div>

          <p><strong>Shipping to:</strong><br>
          ${order.address?.street}, ${order.address?.city}, ${order.address?.state}</p>

          <p style="text-align: center; color: #888; font-size: 12px; margin-top: 40px;">
            Questions? Contact us on WhatsApp: +234 802 342 7426
          </p>
        </div>
      `
    });

    // 2. Send Alert to Admin
    await resend.emails.send({
      from: 'System <system@ravepluscollections.com>',
      to: 'ohraveplus@gmail.com',
      subject: `🔥 New Order Received - #${order.id}`,
      html: `
        <h2>New Order from ${customer.name}</h2>
        <p><strong>Total:</strong> ₦${order.total.toLocaleString()}</p>
        <p><strong>Customer Phone:</strong> ${customer.phone}</p>
        <p>Check the admin dashboard for full details.</p>
      `
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Email error:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
