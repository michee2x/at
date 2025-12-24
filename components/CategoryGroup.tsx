import Image from "next/image";
import { FaChevronRight } from "react-icons/fa6";
import Link from "next/link";
import { CategoryItem } from "@/lib/category-service";

interface CategoryGroupProps {
  title: string;
  parent: number;
  items: CategoryItem[];
  linkText?: string;
}

export default function CategoryGroup({
  title,
  parent,
  items,
  linkText = "Explore",
}: CategoryGroupProps) {
  
  const getImageSrc = (image: CategoryItem["image"]): string => {
    if (!image) return "/placeholder.png";
    if (typeof image === "string") return image;
    if (typeof image === "object" && "src" in image) return image.src;
    return "/placeholder.png";
  };

  return (
    <div className="rounded-2xl flex flex-col place-content-between w-full shadow-sm lg:shadow-md p-4 bg-white hover:shadow-lg transition">
      <h3 className="font-semibold text-[22px] font-poppins md:text-base mb-3">
        {title}
      </h3>

      <div className="flex-1 flex flex-col place-content-between">
        <div className="grid grid-cols-2 gap-2 mb-3">
            {items.map((item, idx) => (
              <Link
                key={`${item.id}-${idx}`}
                className="flex flex-col items-start space-y-1"
                href={`/categories/?cat=${item.id}&title=${item.name}`}
              >
                <div className="relative w-full aspect-square rounded-lg overflow-hidden">
                  <Image
                    src={getImageSrc(item.image)}
                    alt={item?.name || "Category image"}
                    fill
                    className="object-cover w-full transition-transform duration-300 ease-in-out hover:scale-105"
                  />
                </div>

                <p className="text-xs text-gray-600 leading-tight">
                  {item.name.replace("amp;", "").length > 19
                    ? `${item.name.replace("amp;", "")?.slice(0, 19)}...`
                    : item.name.replace("amp;", "")}
                </p>
              </Link>
            ))}
        </div>

        <button className="text-xs flex items-center gap-1 font-medium text-[#6A00EF] font-poppins hover:underline">
          {linkText}
          <FaChevronRight className=" mt-1`" />
        </button>
      </div>
    </div>
  );
}
