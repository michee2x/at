// ====================================================================
// FILE: lib/types/payment.types.ts
// ====================================================================

export interface PaystackInitializeRequest {
  orderId: number;
  amount: number; // in kobo (smallest currency unit)
  email: string;
  currency: string;
}

export interface PaystackInitializeResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    status: 'success' | 'failed' | 'abandoned';
    reference: string;
    amount: number;
    customer: {
      email: string;
    };
    paid_at: string;
  };
}

export interface WooCommerceOrder {
  id: number;
  status: string;
  total: string;
  billing: {
    email: string;
    first_name: string;
    last_name: string;
  };
}