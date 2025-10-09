import Image from "next/image";
import React from "react";
import { GoArrowUpRight } from "react-icons/go";
import CategoryCard from "../cards/cardTwo";

const SubCategorySection = () => {
  const images = [
    {
      img: "/home/sub-category-images/f8b17e52add4c0e914d3210bd0ea7b9582eccb3c.png",
      cat: "MEN'S SPORT GEAR",
      brand: "NIKE",
    },
    {
      img: "/home/sub-category-images/9de1d476284efe9d2ad81e59cc9f3e0a1f996df2.png",
      cat: "KID'S CASUAL FIT",
      brand: "NIKE",
    },
    {
      img: "/home/sub-category-images/8ce9ca94c3d92facb1276f4bac4d0752af06ae45.png",
      cat: "KIDDIES OUTERWEAR",
      brand: "SUPREME",
    },
    {
      img: "/home/sub-category-images/c6d96b7f3cc969d7f72d6b1e1fddd0905ff6b52c.png",
      cat: "KIDDIES OUTERWEAR",
      brand: "NIKE",
    },
    {
      img: "/home/sub-category-images/1bdd548a9b2f8899f7eac7a774b6e57a977902b0.png",
      cat: "KIDDIES OUTERWEAR",
      brand: "NIKE",
    },
  ];
  return (
    <section className="w-full px-4 mt-20 lg:mt-52 h-auto">
      <h1 className="lg:text-[21px] text-[18px] text-center lg:text-left font-display text-[#000000]">
        FEATURED SUB-CATEGORIES
      </h1>
      <h3 className="text-[#6C757D] text-[14px] text-center lg:text-left lg:text-[16px]">
        Shop your favourite products from global brands
      </h3>
      <div className="carousel hidden lg:inline-flex w-full mt-10 gap-[24px]">
        {images.map((data, idx) => {
          return <CategoryCard key={`${data.img}${idx}`} />;
        })}
      </div>

      <div className=" w-full grid grid-cols-2 h-auto lg:hidden mt-10 gap-2 lg:gap-[24px]">
        {images.map((data, idx) => {
          return <CategoryCard key={`${data.img}${idx}`} />;
        })}
      </div>
    </section>
  );
};

export default SubCategorySection;
