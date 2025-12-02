
import { PaystackInitializeResponse, PaystackVerifyResponse } from "@/types/payment.types";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY!;
const PAYSTACK_BASE_URL = 'https://api.paystack.co';

export class PaystackService {
  private static headers = {
    'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
    'Content-Type': 'application/json'
  };

  /**
   * Initialize a payment transaction
   */
  static async initializeTransaction(
    email: string,
    amount: number,
    orderId: number,
    callbackUrl: string
  ): Promise<PaystackInitializeResponse> {
    const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        email,
        amount,
        reference: `order_${orderId}_${Date.now()}`,
        callback_url: callbackUrl,
        metadata: {
          order_id: orderId,
          custom_fields: [
            {
              display_name: 'Order ID',
              variable_name: 'order_id',
              value: orderId
            }
          ]
        }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to initialize payment');
    }

    return response.json();
  }

  /**
   * Verify a payment transaction
   */
  static async verifyTransaction(reference: string): Promise<PaystackVerifyResponse> {
    const response = await fetch(
      `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
      {
        method: 'GET',
        headers: this.headers
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to verify payment');
    }

    return response.json();
  }
}