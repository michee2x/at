import Image from "next/image";
import Link from "next/link";
import React from "react";
import { BsArrowUpRight } from "react-icons/bs";
import CardOne from "../cards/cardOne";

const CategoryCarousel = () => {
  return (
    <section className="w-full gap-[64px] flex flex-col items-center">
      <div className="carousel w-full gap-[24px]">
        {[
          "/home/category%20images/d3cee6708c8c81e5e29f833e2e6302099c7844fb.png",
          "/home/category images/7f3d186b0269a780935752f43b5285fcec53c8d3.png",
          "/home/category%20images/a597d6e843faced8f572d9ea652b5af6360c65c7.png",
          "/home/category%20images/28645876e728cafd655bf28c501cddc30f419b08.png",
          "/home/category%20images/d65396930de72559eafd08000dbb3176a0e6fa41.png",
        ].map((img) => {
          return (
            <CardOne fillViewport={false} key={img} img={img} />
          );
        })}
      </div>

      <button className="w-fit h-fit">
        <Link
          href="/"
          className="lg:w-[288px] w-[230px] h-[56px] rounded-[8px] border-[1px] border-[#C4C4C4] flex items-center justify-center px-[24px] py-[16px]"
        >
          <span className="text-[15px] text-nowrap flex gap-[12px] items-center text-[#222222] leading-[100%] tracking-[-0.7%] font-poppins">
            See All Categories{" "}
            <BsArrowUpRight className="transform rotate-45 text-3xl" />
          </span>
        </Link>
      </button>
    </section>
  );
};

export default CategoryCarousel;
