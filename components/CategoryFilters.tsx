"use client";

import { IoAddOutline } from "react-icons/io5";
import { useFilter } from "@/contexts/filter-context";

type FilterMap = Record<string, string>;

const RadioSection = ({
  title,
  options,
  selected,
  onChange,
}: {
  title: string;
  options: string[];
  selected: string | undefined;
  onChange: (title: string, value: string) => void;
}) => (
  <div className="border-t border-gray-200 py-3">
    <h3 className="font-semibold text-gray-800 mb-2 pl-4 lg:pl-0">{title}</h3>
    <ul className="space-y-2 text-sm text-gray-700">
      {options.map((opt) => (
        <li key={opt} className="flex pl-4 items-center space-x-2">
          <input
            type="radio"
            name={title}
            id={`${title}-${opt}`}
            checked={selected === opt}
            onChange={() => onChange(title, opt)}
            className="text-purple-600 focus:ring-purple-500"
          />
          <label htmlFor={`${title}-${opt}`}>{opt}</label>
        </li>
      ))}
    </ul>
  </div>
);

export default function CategoryFilters({
  filters,
  setFilters,
}: {
  filters: FilterMap;
  setFilters: React.Dispatch<React.SetStateAction<FilterMap>>;
}) {
  const { showFilter, setShowFilter } = useFilter();

  const closeSidebar = () => setShowFilter(false);

  const handleRadioChange = (title: string, value: string) => {
    setFilters((prev) => ({ ...prev, [title]: value }));
  };

  return (
    <aside
      className={`fixed lg:relative transition-all duration-300 ${
        showFilter ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      } overflow-y-auto w-full z-50 bg-white top-0 left-0 
      h-[100vh] lg:h-auto lg:col-span-1 xl:w-[220px] lg:p-4 shadow-lg lg:shadow-none pb-4`}
    >
      {/* Mobile Header */}
      <div className="w-full lg:hidden flex p-4 justify-between items-center">
        <span>Filters</span>
        <IoAddOutline
          onClick={closeSidebar}
          className="text-2xl text-black transform rotate-45"
        />
      </div>

      {/* FILTER SECTIONS */}
      <RadioSection
        title="Delivery Day"
        options={["Get in 2 Days"]}
        selected={filters["Delivery Day"]}
        onChange={handleRadioChange}
      />

      <RadioSection
        title="brand"
        options={[
          "Samsung",
          "LG",
          "Haier",
          "Infinix",
          "Oraimo",
          "iTel",
          "Panasonic",
        ]}
        selected={filters["brand"]}
        onChange={handleRadioChange}
      />

      <RadioSection
        title="Price"
        options={[
          "All",
          "₦5000 to ₦10,000",
          "₦10,000 to ₦20,000",
          "₦20,000 to ₦30,000",
          "₦30,000 to ₦40,000",
          "₦40,000 to ₦50,000",
        ]}
        selected={filters["Price"]}
        onChange={handleRadioChange}
      />

      <RadioSection
        title="Deals & Discount"
        options={["All discount", "Today's discount"]}
        selected={filters["Deals & Discount"]}
        onChange={handleRadioChange}
      />

      <RadioSection
        title="Item Condition"
        options={["New"]}
        selected={filters["Item Condition"]}
        onChange={handleRadioChange}
      />

      <RadioSection
        title="Pay on Delivery"
        options={["Eligible for Pay on Delivery"]}
        selected={filters["Pay on Delivery"]}
        onChange={handleRadioChange}
      />

      <RadioSection
        title="Discount"
        options={[
          "All",
          "10% off or more",
          "25% off or more",
          "35% off or more",
          "50% off or more",
          "70% off or more",
        ]}
        selected={filters["Discount"]}
        onChange={handleRadioChange}
      />

      <RadioSection
        title="Seller"
        options={[
          "DAVINETTE ELECTRONICS",
          "INWAE LIMITED",
          "mefirt LIMITED",
          "NGX MOBILE ELECTRONICS",
          "Kitchen Brand Store",
          "LOWENTEX DEALZ",
        ]}
        selected={filters["Seller"]}
        onChange={handleRadioChange}
      />

      <RadioSection
        title="Availability"
        options={["In Stock", "Out of Stock"]}
        selected={filters["Availability"]}
        onChange={handleRadioChange}
      />
    </aside>
  );
}
