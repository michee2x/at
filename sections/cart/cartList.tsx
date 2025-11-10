'use client'
import React from 'react'
import CartItem from './cartItem';
import { useCart } from '@/contexts/CartContext';

const CartList = () => {
    const {cart}=useCart()
  return (
    <div className="flex-1 flex flex-col lg:gap-5">
      {cart.map((item, idx) => (
        <CartItem product={item} key={`${idx}`} />
      ))}
    </div>
  );
}

export default CartList