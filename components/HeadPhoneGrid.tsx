"use client";
import { Headphone, headphones } from "@/constants";
import Image from "next/image";
import { memo} from "react";
import BlurredDots from "./BlurredDots";


const HeadphoneCard = memo(
  ({ item }: { item: Headphone }) => {
    return (
      <div className="bg-gradient-to-b relative pt-4 from-[#6A00EF] to-[#DBBFFF] flex flex-col place-content-between w-full h-[304.59px] hover:z-50 overflow-hidden text-center text-white hover:scale-105 transition-transform duration-300">
        <div className="flex-1 relative">
          <h1 className="lg:text-[18px] text-[15px] w-full h-auto items-center">
            {item.name}
          </h1>
          <div className="flex justify-center">
            <Image
              src={item.image}
              alt={item.name}
              width={120}
              height={120}
              className="object-contain"
            />
          </div>
          <ul className="text-xs mt-8 list text-gray-300 space-y-1">
            {item.features.map((feature, i) => (
              <li
                key={i}
                className="flex items-center justify-center gap-2 text-gray-100"
              >
                <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="h-[36px] relative w-full flex items-center justify-center text-black text-[18.94px] bg-white">
          {item.price}
        </div>
        <BlurredDots className="flex-col" />
        <BlurredDots className="right-0 flex-col" />
        <BlurredDots className="top-0" />
      </div>
    );
  },
  (prevProps, nextProps) => prevProps.item.name === nextProps.item.name
);


export default function HeadphoneGrid() {
  return (
    <div className=" w-full mt-16 lg:order-7 min-h-screen px-2 flex flex-col items-center py-10">
      <h1 className="text-white flex flex-col bg-gradient-to-b from-[#F8E08F] to-[#ECC870] h-16 w-full lg:h-24 text-3xl font-bold mb-4">
        <div className="w-full flex-nowrap h-auto p-1.5 lg:flex hidden justify-between">
          {[...Array(57)].map((_, idx) => {
            return (
              <span className="flex rounded-full size-[11.32px] bg-white"></span>
            );
          })}
        </div>
        <div className="w-full lg:hidden flex-nowrap h-auto p-1.5 flex justify-between">
          {[...Array(20)].map((_, idx) => {
            return (
              <span className="flex rounded-full size-[11.32px] bg-white"></span>
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
          <HeadphoneCard key={index} item={item} />
        ))}
      </div>
    </div>
  );
}
