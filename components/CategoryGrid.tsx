import { groups } from "@/constants";
import CategoryGroup from "./CategoryGroup";

export default function CategoryGrid() {

  return (
    <section className="w-full mt-16 max-w-7xl mx-auto py-6">
      <h2 className="text-center text-lg lg:text-[31px] md:text-xl font-semibold mb-6">
        Explore our diverse categories
      </h2>

      <div className="grid px-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-2">
        {groups.map((group, i) => (
          <CategoryGroup key={i} {...group} />
        ))}
      </div>
    </section>
  );
}
