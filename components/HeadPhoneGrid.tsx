"use client";
import { useProducts } from "@/hooks/wc/useProducts";
import HeadphoneCard from "./HeadPhoneCard";
import { WooProduct } from "@/types";

export default function HeadphoneGrid() {
  const { data, isLoading } = useProducts({
    per_page: 10, 
    category: 51,
  });

  const products: WooProduct[] = Array.isArray(data)
    ? data
    : (data?.products as WooProduct[]) ?? [];

    console.log("HeadphoneGrid products:", products);

  return (
    <section className="w-full py-10 lg:py-16 px-4 md:px-8 mt-10">
      <div className="max-w-[1440px] mx-auto flex flex-col items-center">
        
        {/* PROMOTIONAL HEADER RESTORED */}
        <div className="w-full relative h-20 lg:h-24 mb-8 rounded-xl overflow-hidden shadow-lg group">
           {/* Background Gradient - Brand Purple Theme with visible animation */}
           <div className="absolute inset-0 bg-gradient-to-r from-[#5300b8] via-[#8B5CF6] to-[#5300b8] animate-gradient-xy"></div>
           
           {/* Content */}
           <div className="relative z-10 w-full h-full flex items-center justify-between px-6 lg:px-12">
              {/* Decorative dots */}
              <div className="hidden lg:flex gap-1 opacity-50">
                  {[...Array(12)].map((_, idx) => (
                    <span key={idx} className="block w-2 h-2 rounded-full bg-white/20"></span>
                  ))}
              </div>

              {/* Text Content */}
              <div className="flex-1 flex flex-col md:flex-row items-center justify-center lg:justify-center gap-1 md:gap-3 text-white font-poppins text-center md:text-left">
                 <div className="flex items-baseline gap-1.5">
                    <span className="text-sm md:text-xl lg:text-3xl font-bold uppercase tracking-wide whitespace-nowrap">Deals up to</span>
                    <span className="text-2xl md:text-3xl lg:text-5xl font-extrabold text-[#ECC870] drop-shadow-sm">80%</span>
                 </div>
                 <span className="hidden md:block w-px h-8 bg-white/30 mx-2"></span>
                 <span className="text-[10px] md:text-lg lg:text-2xl font-light uppercase tracking-widest md:tracking-normal bg-white/10 md:bg-transparent px-2 py-0.5 rounded-full md:rounded-none md:px-0 md:py-0">
                    Wishlist Now
                 </span>
              </div>

               {/* Decorative dots */}
               <div className="hidden lg:flex gap-1 opacity-50">
                  {[...Array(12)].map((_, idx) => (
                    <span key={idx} className="block w-2 h-2 rounded-full bg-white/20"></span>
                  ))}
              </div>
           </div>
        </div>

        {/* LOADING & GRID STATE */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 w-full gap-3 md:gap-4 lg:gap-5 animate-pulse">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="w-full h-[260px] lg:h-[300px] bg-gray-200 rounded-2xl"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 w-full gap-3 md:gap-4 lg:gap-5 place-items-center">
            {products.map((item) => (
              <HeadphoneCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
