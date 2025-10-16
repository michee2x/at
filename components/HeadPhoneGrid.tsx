"use client";
import { Headphone, headphones } from "@/constants";
import HeadphoneCard from "./HeadPhoneCard";


export default function HeadphoneGrid() {
  return (
    <div className=" w-full mt-16 lg:order-7 min-h-screen px-2 flex flex-col items-center py-10">
      <h1 className="text-white flex flex-col bg-gradient-to-b from-[#F8E08F] to-[#ECC870] h-16 w-full lg:h-24 text-3xl font-bold mb-4">
        <div className="w-full flex-nowrap h-auto p-1.5 lg:flex hidden justify-between">
          {[...Array(57)].map((_, idx) => {
            return (
              <span
                key={`${idx}`}
                className="flex rounded-full size-[11.32px] bg-white"
              ></span>
            );
          })}
        </div>
        <div className="w-full lg:hidden flex-nowrap h-auto p-1.5 flex justify-between">
          {[...Array(20)].map((_, idx) => {
            return (
              <span
                key={`${idx}`}
                className="flex rounded-full size-[11.32px] bg-white"
              ></span>
            );
          })}
        </div>
        <div className="flex-1 gap-2 text-[18px] lg:text-[26px] font-poppins text-black font-semibold p-3 flex items-end justify-center">
          <div className="w-fit flex h-fit gap-1">
            <h1>Deals up to 80</h1>
            <span className="text-[16.07px]">%</span>
          </div>
          <h1>off | Wishlist now</h1>
        </div>
      </h1>
      <div className="grid grid-cols-2 w-full gap-x-3 place-items-center sm:grid-cols-2 lg:grid-cols-6 max-w-7xl">
        {headphones.map((item, index) => (
          <HeadphoneCard key={`${index}`} item={item} />
        ))}
      </div>
    </div>
  );
}
