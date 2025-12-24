'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from './useCart';
import { createWooOrder } from '@/lib/wordpress-checkout';
import type { BillingInfo, CreateOrderResult } from '@/types/checkout';
import { WooOrder } from '@/lib/user/types';
import { User } from '@/lib/user/User';
import { updateUserAction } from '@/lib/actions/UserAction';


export const useCheckout = () => {
  const { cart, userId, authToken, clearCart } = useCart();
  const [isPlacingOrder, setIsPlacingOrder] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const placeOrder = async (billing: BillingInfo): Promise<CreateOrderResult | void> => {
    if (!cart || cart.items.length === 0) {
      setError('Cart is empty');
      return { success: false, error: 'Cart is empty' };
    }

    setError(null);
    setIsPlacingOrder(true);

    try {
        const payload =  {
                payment_method: 'cod',
                payment_method_title: 'Cash on Delivery',
                set_paid: false,

                billing: {
                  first_name: billing.firstName,
                  last_name: billing.lastName,
                  email: billing.email,
                  phone: billing.phone,
                  address_2: billing.addressLine2,
                },

                shipping: {
                  first_name: billing.firstName,
                  last_name: billing.lastName,
                },

                line_items: cart.items.map((i) => ({
                  product_id: i.id,
                  quantity: i.quantity,
                })),

                customer_id: userId ?? undefined,

                // VERY IMPORTANT TO MATCH FRONTEND TOTAL:
                fee_lines: [
                  {
                    name: "Packaging Fee",
                    total: "2000.05",
                  },
                  {
                    name: "Service Fee",
                    total: "500.05",
                  },
                  {
                    name: "Delivery Fee",
                    total: "2000.05",
                  }
                ],
      };
      


      const result = await createWooOrder(payload, authToken ?? undefined);
      const user = new User({ id: userId || 0 });

      // IF user wants to save address to profile
      if (billing.saveToProfile && userId) {
        console.log('Updating user profile with billing info', billing);
        await updateUserAction(userId, {
          first_name: billing.firstName,
          last_name: billing.lastName,
          email: billing.email,
          phone: billing.phone,
          address_1: billing.addressLine1,
          address_2: billing.addressLine2,
          city: billing.city,
          state: billing.state, 
          postcode: billing.postcode,
          country: billing.country,
        });
      }


      if (!result.success) {
        setError(result.error);
        return result;
      }

      await clearCart();

      localStorage.setItem('last-order-id', result.order.id.toString());

      router.push('/order/success/' + result.order.id);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unexpected error';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return { isPlacingOrder, error, placeOrder };
};
