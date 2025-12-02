import { NextRequest, NextResponse } from 'next/server';
import { PaystackService } from '@/utils/paystack';
import { WooCommerceService } from '@/utils/woocommerce';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const reference = searchParams.get('reference');

    if (!reference) {
      return NextResponse.json(
        { error: 'Payment reference is required' },
        { status: 400 }
      );
    }

    // Verify transaction with Paystack
    const verification = await PaystackService.verifyTransaction(reference);

    if (!verification.status || verification.data.status !== 'success') {
      return NextResponse.json({
        success: false,
        status: verification.data.status,
        message: 'Payment verification failed'
      });
    }

    // Extract order ID from reference (format: order_{orderId}_{timestamp})
    const orderIdMatch = reference.match(/order_(\d+)_/);
    if (!orderIdMatch) {
      throw new Error('Invalid payment reference format');
    }

    const orderId = parseInt(orderIdMatch[1]);

    // Update WooCommerce order status
    await WooCommerceService.updateOrderStatus(
      orderId,
      'processing',
      reference,
      'paystack'
    );

    // Add success note to order
    await WooCommerceService.addOrderNote(
      orderId,
      `Payment successful via Paystack. Reference: ${reference}. Amount: ${verification.data.amount / 100}`
    );

    return NextResponse.json({
      success: true,
      status: 'success',
      orderId,
      reference,
      amount: verification.data.amount,
      paidAt: verification.data.paid_at
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      {
        error: 'Failed to verify payment',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}