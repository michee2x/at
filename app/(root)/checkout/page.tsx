'use client';

import React from 'react';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import OrderSummary from '@/sections/cart/OrderSummary';
import { useCheckout } from '@/hooks/useCheckout';
import type { BillingInfo } from '@/types/checkout';

export default function CheckoutPage(){
  const { isPlacingOrder, error, placeOrder} = useCheckout();

  const handleContinue = async (values: BillingInfo & { deliveryMethod?: 'deliver' | 'pickup' }) => {
    // you might show a confirmation modal or move to a payment step
    // here we directly place the order
    await placeOrder(values);
  };

  return (
    <main className="container font-display mx-auto py-8 grid grid-cols-1 md:grid-cols-2 gap-8">
      <section className="w-full">
        <CheckoutForm onContinue={handleContinue} loading={isPlacingOrder} />
        {error && <div className="text-sm text-red-500 mt-3">{error}</div>}
      </section>
      <aside className='w-full flex justify-center'>
        <OrderSummary showCheckoutButton={false} />
      </aside>
    </main>
  );
}