import { WooProduct } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { FiHeart } from "react-icons/fi";
import { GoArrowUpRight } from "react-icons/go";


export default function ProductSuggestionList({
  suggestions,
}: {
  suggestions: WooProduct[];
}) {
  return (
    <ul className="w-full grid grid-cols-2 gap-y-4 lg:flex lg:gap-x-6 h-auto">
      {suggestions.map((item, idx) => {

        return (
          <li
            key={item.id}
            className="lg:w-[244px] rounded-md overflow-hidden w-[95%] min-h-[170px] lg:h-[285px] flex flex-col lg:max-h-[320.25px]"
            itemScope
            itemType="http://schema.org/Product"
          >
            <Link
              href={`/product/${item.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-[#FAFAFA] relative overflow-hidden w-full h-[175px] lg:w-full lg:min-h-[242.61px]"
              itemProp="url"
            >

              <Image
                fill
                className="object-contain"
                src={item.images?.[0]?.src ?? "/placeholder.png"}
                alt={item.name ?? "Product image"}
                priority
                itemProp="image"
              />

              <div
                className="absolute top-0 w-full p-1 text-[10px] flex items-center justify-between"
                aria-hidden
              >
                <FiHeart className="text-xl" />
                <span className="w-6 h-6 rounded-full text-white text-xl flex items-center justify-center bg-black">
                  +
                </span>
              </div>
            </Link>

            <div className="w-full mt-1 flex flex-col h-auto">
              <div className="flex items-center gap-[2.36px]">
                <span
                  className="text-[#2B2B2B] text-nowrap text-[12px] lg:text-[16px] font-[Red Hat Display]"
                  itemProp="name"
                >
                  {item.name?.slice(0, 14) ?? "Product"}
                </span>
                <GoArrowUpRight className="lg:text-[20px] text-[14px]" />
              </div>
              <span
                className="text-[#6C757D] text-end text-[10px] lg:text-[12px]"
                itemProp="brand"
              >
                {item?.brands?.[0]?.name ??
                  item?.slug?.split("-")[0]?.toUpperCase() ??
                  ""}
              </span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
