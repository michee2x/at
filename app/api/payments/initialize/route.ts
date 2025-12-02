import { NextRequest, NextResponse } from 'next/server';
import { PaystackService } from '@/utils/paystack';
import { WooCommerceService } from '@/utils/woocommerce';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, amount, email } = body;

    // Validate required fields
    if (!orderId || !amount || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify order exists in WooCommerce
    const order = await WooCommerceService.getOrder(orderId);
    
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Initialize Paystack transaction
    const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/payment/verify`;
    const paystackResponse = await PaystackService.initializeTransaction(
      email,
      amount,
      orderId,
      callbackUrl
    );

    if (!paystackResponse.status) {
      throw new Error('Paystack initialization failed');
    }

    // Add note to WooCommerce order
    await WooCommerceService.addOrderNote(
      orderId,
      `Payment initialization: Reference ${paystackResponse.data.reference}`
    );

    return NextResponse.json({
      success: true,
      authorizationUrl: paystackResponse.data.authorization_url,
      reference: paystackResponse.data.reference,
      accessCode: paystackResponse.data.access_code
    });

  } catch (error) {
    console.error('Payment initialization error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to initialize payment',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}