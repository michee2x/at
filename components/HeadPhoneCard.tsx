import Image from "next/image";
import { memo } from "react";
import BlurredDots from "./BlurredDots";
import { Headphone } from "@/constants";
import { WooProduct } from "@/types";

const HeadphoneCard = memo(
  ({ item }: { item: WooProduct }) => {
    return (
      <div className="bg-gradient-to-b relative pt-4 from-[#6A00EF] to-[#DBBFFF] flex flex-col place-content-between w-full h-[280px] lg:h-[304.59px] hover:z-50 overflow-hidden text-center text-white hover:scale-105 transition-transform duration-300">
        <div className="flex-1 relative">
          <h1 className="lg:text-[18px] text-[15px] w-full h-auto items-center">
            {item.name}
          </h1>
          <div className="flex justify-center">
            <Image
              src={item.images[0]?.src}
              alt={item.name}
              width={130}
              height={130}
              className="object-contain"
            />
          </div>
          <ul className="text-xs mt-2 list text-gray-300 lg:space-y-1">
            {item?.short_description &&
              Array.from(item?.short_description.matchAll(/<li>(.*?)<\/li>/g))
                .map((match) => match[1])
                .map((feature, i) => (
                  <li
                    key={`${i}`}
                    className="flex items-center justify-center gap-0.5 lg:gap-2 text-gray-100"
                  >
                    <span className="lg:w-1.5 w-1 lg:h-1.5 h-1 bg-white rounded-full"></span>
                    <span>{feature?.replace("amp;", "")}</span>
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

HeadphoneCard.displayName