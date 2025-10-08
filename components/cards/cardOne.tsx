import Image from "next/image";
import React from "react";

const CardOne = ({ img }: { img: string }) => {
  return (
    <div
      key={img}
      className="carousel-item lg:w-[244px] w-full h-[312px] gap-[4px] flex flex-col"
    >
      <div className="relative overflow-hidden h-[244px] w-full lg:w-[244px] rounded-xl bg-[#FAFAFA]">
        <Image
          fill
          src={img}
          alt="Burger"
          className="object-contain object-center"
        />
      </div>
      <div className="w-full font-poppins flex justify-between text-[#6C757D] text-[12px]">
        Home Decor
        <div className="flex items-center gap-[1px]">
          {[1, 2, 3, 4, 5].map((star) => {
            return (
              <div
                key={`${star}`}
                className="w-[10px] relative h-[10px] lg:w-[13px] lg:h-[13px]"
              >
                <Image
                  src="/home/vector icons/Star 1.png"
                  className="object-cover"
                  alt="star logo"
                  fill
                />
              </div>
            );
          })}
          
        </div>
      </div>
      <span className="text-[15px] font-poppins">Coral Sofa</span>
      <span className="flex items-center gap-2">
        <div className="w-[14.5px] relative h-[14.5px] lg:w-[20px] lg:h-[20px]">
          <Image
            src="/home/hero/Nigeria.png"
            className="object-cover"
            alt="nigeria logo"
            fill
          />
        </div>
        <span className="text-[12px] lg:text-[14px] text-[#ED473D]">
          120,500
        </span>
      </span>
    </div>
  );
};

export default CardOne;
