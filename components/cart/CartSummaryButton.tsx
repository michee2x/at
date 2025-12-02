import Link from 'next/link';
import React from 'react'

const CartSummaryButton = () => {
  return (
    <div className="mt-5 w-full flex gap-3 flex-col items-center">
      <span className="text-[15.35px] text-center font-bold">
        You are #5,000 away from free delivery
      </span>

      <progress
        className="progress w-full [--p:70] [&::-webkit-progress-bar]:bg-gray-200 [&::-webkit-progress-value]:bg-[#F7B232]"
        value="70"
        max="100"
      ></progress>
      <Link className='w-full h-auto' href={"/checkout"}>
        <button className="btn text-[17px] btn-neutral py-6 mt-4 w-full rounded-lg lg:text-[20.46px] font-normal">
          Payment Checkout
        </button>
      </Link>
    </div>
  );
}

export default CartSummaryButton