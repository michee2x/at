import Image from "next/image";

interface CategoryItem {
  name: string;
  image: string;
}

interface CategoryGroupProps {
  title: string;
  items: CategoryItem[];
  linkText?: string;
}

export default function CategoryGroup({
  title,
  items,
  linkText = "Explore >",
}: CategoryGroupProps) {
  return (
    <div className="rounded-2xl w-full shadow-sm border border-gray-100 p-4 bg-white hover:shadow-md transition">
      <h3 className="font-semibold text-[22px] font-poppins md:text-base mb-3">{title}</h3>

      {/* 2x2 grid of images */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        {items.map((item, i) => (
          <div key={i} className="flex flex-col items-start space-y-1">
            <div className="relative w-full aspect-square rounded-lg overflow-hidden">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
              />
            </div>
            <p className="text-xs text-gray-600 leading-tight">{item.name}</p>
          </div>
        ))}
      </div>

      <button className="text-xs font-medium text-purple-600 hover:underline">
        {linkText}
      </button>
    </div>
  );
}
