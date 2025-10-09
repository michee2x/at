import React from 'react'

const ProductCard = ({
  fillViewport = true,
}: {
  fillViewport?: boolean;
}) => {
  return (
    <div className="flex-1 my-16 grid grid-cols-2 gap-2.5 lg:gap-5 lg:flex w-full">
      {[1, 2, 3, 4, 5, 6].map((e) => {
        return (
          <div
            key={`${e}`}
            className={`carousel-item lg:w-[244px] ${
              fillViewport ? "w-full" : "w-[240px]"
            } h-[212px] ${e > 4 ? "hidden lg:flex" : "flex"} lg:h-[312px] gap-[4px] flex flex-col`}
          >
            <div className="relative h-[185px] w-full lg:w-[244px] rounded-xl skeleton" />
            <div className="w-full font-poppins flex justify-between text-[#6C757D] text-[12px]">
              <div className="flex w-28 h-3 skeleton" />
              <div className="flex w-16 h-3 skeleton" />
            </div>
            <div className="flex w-16 h-3 skeleton" />

            <span className="flex items-center gap-2">
              <div className="w-[14.5px] relative skeleton rounded-full h-[14.5px] lg:w-[20px] lg:h-[20px]" />
              <div className="flex w-10 h-3 skeleton" />
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default ProductCard