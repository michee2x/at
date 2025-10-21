import Image from "next/image";
import { FaStar } from "react-icons/fa";
import { GoPlus } from "react-icons/go";
import { WooProduct } from "@/types";


function ProductCard({ product }: { product: WooProduct }) {
  return (
    <div className="border border-gray-200 pb-2 font-poppins bg-white rounded-xl flex flex-col">
      <div className="relative w-full aspect-square mb-3">
        <Image
          src={product.images?.[0]?.src || "/placeholder.png"}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="px-3 w-full h-auto">
        <h2 className="lg:text-[15px] text-[14px] flex flex-col lg:flex-row justify-between font-medium text-black mb-1">
          {`${product.name.slice(0, 15)}...`}
          <span className="flex items-center">
            {[...Array(5)].map((_, idx) => (
              <FaStar
                key={idx}
                className="text-[10px] text-[#FFD700] lg:text-[12px]"
              />
            ))}
          </span>
        </h2>
        <div className="lg:text-[12px] text-[10px] text-black/50">
          Elica 60 cm 1200 m3/hr Filterless Autocl...
        </div>
        <div className="flex mt-3 lg:mt-6 flex-col lg:flex-row justify-between lg:items-center">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <div className="w-[14.5px] relative h-[14.5px] lg:w-[20px] lg:h-[20px]">
                <Image
                  src="/home/hero/Nigeria.png"
                  className="object-cover"
                  alt="nigeria logo"
                  fill
                />
              </div>
              <span className="text-[12px] lg:text-[14px] text-[#6A00EF]">
                {`${product.price.slice(0, 10)}...`}
              </span>
            </div>
            <span className="text-[10px] text-black/50">300+ purchased</span>
          </div>
          <button className="lg:mt-auto mt-2 w-full lg:w-[110px] text-[10px] bg-[#6A00EF] text-white py-[6px] rounded-[24px] hover:bg-purple-700 items-center gap-1 justify-center flex transition">
            <GoPlus className="text-2xl" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;


//product brands endpoint: /wp-json/wc/v1/products/brands