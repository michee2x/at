import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { WooCommerceService } from '@/utils/woocommerce';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-paystack-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'No signature provided' },
        { status: 401 }
      );
    }

    // Verify webhook signature
    const hash = crypto
      .createHmac('sha512', PAYSTACK_SECRET_KEY)
      .update(body)
      .digest('hex');

    if (hash !== signature) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const event = JSON.parse(body);

    // Handle charge.success event
    if (event.event === 'charge.success') {
      const { reference, metadata } = event.data;
      const orderId = metadata?.order_id;

      if (orderId) {
        // Update order status
        await WooCommerceService.updateOrderStatus(
          orderId,
          'processing',
          reference,
          'paystack'
        );

        await WooCommerceService.addOrderNote(
          orderId,
          `Webhook received: Payment confirmed. Reference: ${reference}`
        );
      }
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}