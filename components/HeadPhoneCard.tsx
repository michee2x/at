import Image from "next/image";
import Link from "next/link";
import { memo } from "react";
import { WooProduct } from "@/types";
import { ShoppingCart } from "lucide-react";

const HeadphoneCard = memo(
  ({ item }: { item: WooProduct }) => {
    return (
      <Link
        href={`/product/${item.slug}`}
        className="group relative flex flex-col w-full h-[220px] lg:h-[270px] bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 border border-black/5"
      >
        {/* Discount Badge */}
        {item.regular_price && item.price !== item.regular_price && (
             <div className="absolute top-2 left-2 z-10 bg-black text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
               Sale
             </div>
        )}

        <div className="relative w-full h-[68%] bg-gray-50 flex items-center justify-center p-3 overflow-hidden">
            {/* Circular background decoration */}
            <div className="absolute w-28 h-28 bg-purple-100 rounded-full blur-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
            
           {item.images[0]?.src ? (
             <Image
               src={item.images[0].src}
               alt={item.name}
               fill
               className="object-contain p-2 group-hover:scale-110 transition-transform duration-500 ease-out z-10"
               sizes="(max-width: 768px) 100vw, (max-width: 1200px) 20vw, 15vw"
             />
           ) : (
             <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-xs">
               No Image
             </div>
           )}
           
           {/* Quick action overlay */}
           <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </div>
        
        <div className="flex flex-col flex-1 px-3 py-2 text-center relative bg-white justify-between">
            <h3 className="font-semibold text-gray-900 line-clamp-1 text-xs lg:text-[13px] transition-colors">
            {item.name}
            </h3>
          
            <div className="w-full h-8 relative mt-1">
                {/* Default State: Price */}
                <div className="absolute inset-0 flex flex-col items-center justify-center font-poppins transition-all duration-300 transform group-hover:-translate-y-8 group-hover:opacity-0">
                    <div className="flex items-baseline">
                        <span className="font-bold text-[#5300b8] text-xs">₦</span>
                        <span className="font-extrabold text-[#5300b8] text-lg lg:text-xl leading-none">
                            {parseInt(item.price).toLocaleString()}
                        </span>
                        {item.regular_price && item.price !== item.regular_price && (
                            <span className="ml-1 text-[9px] lg:text-[10px] text-gray-400 line-through">
                                ₦{parseInt(item.regular_price).toLocaleString()}
                            </span>
                        )}
                    </div>
                </div>

                {/* Hover State: Shop Now */}
                <div className="absolute inset-0 flex items-center justify-center transition-all duration-300 transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
                    <p className="text-[10px] font-bold text-white flex items-center gap-1.5 bg-[#5300b8] px-3 py-1.5 rounded-full shadow-md">
                        Shop Now <ShoppingCart className="w-3 h-3 text-white" />
                    </p>
                </div>
            </div>
        </div>
      </Link>
    );
  },
  (prevProps, nextProps) => prevProps.item.id === nextProps.item.id
);

HeadphoneCard.displayName = "HeadphoneCard";

export default HeadphoneCard;
