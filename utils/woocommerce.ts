import { WooCommerceOrder } from "@/types/payment.types";

const WC_BASE_URL = process.env.NEXT_PUBLIC_WC_STORE_URL!;
const WC_CONSUMER_KEY = process.env.WC_CONSUMER_KEY!;
const WC_CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET!;

export class WooCommerceService {
  private static getAuthHeader(): string {
    const credentials = Buffer.from(`${WC_CONSUMER_KEY}:${WC_CONSUMER_SECRET}`).toString('base64');
    return `Basic ${credentials}`;
  }

  /**
   * Get order details by ID
   */
  static async getOrder(orderId: number): Promise<WooCommerceOrder> {
    const response = await fetch(`${WC_BASE_URL}/wp-json/wc/v3/orders/${orderId}`, {
      method: 'GET',
      headers: {
        'Authorization': this.getAuthHeader(),
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch order from WooCommerce');
    }

    return response.json();
  }

  /**
   * Update order status and add payment details
   */
  static async updateOrderStatus(
    orderId: number,
    status: 'processing' | 'completed' | 'failed',
    transactionId: string,
    paymentMethod = 'paystack'
  ): Promise<WooCommerceOrder> {
    const response = await fetch(`${WC_BASE_URL}/wp-json/wc/v3/orders/${orderId}`, {
      method: 'PUT',
      headers: {
        'Authorization': this.getAuthHeader(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        status,
        payment_method: paymentMethod,
        payment_method_title: 'Paystack',
        transaction_id: transactionId,
        set_paid: status === 'processing' || status === 'completed'
      })
    });

    if (!response.ok) {
      throw new Error('Failed to update order status');
    }

    return response.json();
  }

  /**
   * Add a note to the order
   */
  static async addOrderNote(orderId: number, note: string): Promise<void> {
    await fetch(`${WC_BASE_URL}/wp-json/wc/v3/orders/${orderId}/notes`, {
      method: 'POST',
      headers: {
        'Authorization': this.getAuthHeader(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        note,
        customer_note: false
      })
    });
  }
}