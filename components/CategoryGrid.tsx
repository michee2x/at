import { groups } from "@/constants";
import CategoryGroup from "./CategoryGroup";

const parentCategories = [
  { name: "Revamp your home in style", id: 76 },
  { name: "Appliances for your home", id: 77 },
  { name: "Great Sound and Headphones", id: 75 },
  { name: "Accessories and more options", id: 78 },
  { name: "Automative Essentials | Up to 60% off", id: 79 },
  { name: "Styles for Women | Up to 30% off", id: 80 },
  { name: "Home Accessories | Up to 20%", id: 81 },
  { name: "Work tools and Accessories", id: 82 },
];

export default function CategoryGrid() {

  return (
    <section className="w-full mt-16 max-w-7xl mx-auto py-6">
      <h2 className="text-center text-lg lg:text-[31px] md:text-xl font-semibold mb-6">
        Explore our diverse categories
      </h2>

      <div className="grid px-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-2">
        {parentCategories.map((category, i) => (
          <CategoryGroup
            key={`${i}`}
            title={category.name}
            parent={category.id}
          />
        ))}
      </div>
    </section>
  );
}
