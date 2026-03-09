import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { reference } = await request.json();

    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`, // Hidden in env variables
      }
    });

    const data = await response.json();

    if (data.status && data.data.status === 'success') {
      return NextResponse.json({ success: true, data: data.data }, { status: 200 });
    } else {
      return NextResponse.json({ success: false, message: 'Verification failed' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
