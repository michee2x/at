"use client";

import { IoAddOutline } from "react-icons/io5";
import { useFilter } from "@/contexts/filter-context";
import { productBrand } from "@/constants";


type FilterMap = Record<string, string>;

const RadioSection = ({
  title,
  options,
  selected,
  onChange,
  filterKey
}: {
  title: string;
  options: { label: string; value: string }[];
  selected: string | undefined;
  onChange: (title: string, value: string) => void;
  filterKey:string
}) => (
  <div className="border-t border-gray-200 py-3">
    <h3 className="font-semibold text-gray-800 mb-2 pl-4 lg:pl-0">{title}</h3>
    <ul className="space-y-2 text-sm text-gray-700">
      {options.map(({ label, value }) => (
        <li key={value} className="flex pl-4 items-center space-x-2">
          <input
            type="radio"
            name={title}
            id={`${title}-${value}`}
            checked={selected === value}
            onChange={() => onChange(filterKey, value)}
            className="text-purple-600 focus:ring-purple-500"
          />
          <label htmlFor={`${title}-${value}`}>{label}</label>
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
    console.log("title: ", title, "value: ", value)
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
        options={[{ label: "Get in 2 Days", value: "Get in 2 Days" }]}
        selected={filters["delivery_day"]}
        filterKey="delivery_day"
        onChange={handleRadioChange}
      />

      {/* ✅ Brand Filter (uses brand ID values) */}
      <RadioSection
        title="Brand"
        options={productBrand.map((b) => ({
          label: b.name,
          value: String(b.id), // store brand ID as string
        }))}
        filterKey="brand"
        selected={filters["brand"]}
        onChange={handleRadioChange}
      />

      <RadioSection
        title="Price"
        options={[
          { label: "All", value: "All" },
          { label: "₦5000 to ₦10,000", value: "₦5000 to ₦10,000" },
          { label: "₦10,000 to ₦20,000", value: "₦10,000 to ₦20,000" },
          { label: "₦20,000 to ₦30,000", value: "₦20,000 to ₦30,000" },
          { label: "₦30,000 to ₦40,000", value: "₦30,000 to ₦40,000" },
          { label: "₦40,000 to ₦50,000", value: "₦40,000 to ₦50,000" },
        ]}
        filterKey="price"
        selected={filters["price"]}
        onChange={handleRadioChange}
      />

      <RadioSection
        title="Deals & Discount"
        options={[
          { label: "All discount", value: "All discount" },
          { label: "Today's discount", value: "Today's discount" },
        ]}
        filterKey="deals_&_discount"
        selected={filters["Deals & Discount"]}
        onChange={handleRadioChange}
      />

      <RadioSection
        title="Item Condition"
        options={[{ label: "New", value: "New" }]}
        selected={filters["item_condition"]}
        filterKey="item_condition"
        onChange={handleRadioChange}
      />

      <RadioSection
        title="Pay on Delivery"
        options={[
          {
            label: "Eligible for Pay on Delivery",
            value: "Eligible for Pay on Delivery",
          },
        ]}
        filterKey="pay_on_delivery"
        selected={filters["pay_on_delivery"]}
        onChange={handleRadioChange}
      />

      <RadioSection
        title="Discount"
        options={[
          { label: "All", value: "All" },
          { label: "10% off or more", value: "10% off or more" },
          { label: "25% off or more", value: "25% off or more" },
          { label: "35% off or more", value: "35% off or more" },
          { label: "50% off or more", value: "50% off or more" },
          { label: "70% off or more", value: "70% off or more" },
        ]}
        filterKey="discount"
        selected={filters["discount"]}
        onChange={handleRadioChange}
      />

      <RadioSection
        title="Seller"
        options={[
          { label: "DAVINETTE ELECTRONICS", value: "DAVINETTE ELECTRONICS" },
          { label: "INWAE LIMITED", value: "INWAE LIMITED" },
          { label: "mefirt LIMITED", value: "mefirt LIMITED" },
          { label: "NGX MOBILE ELECTRONICS", value: "NGX MOBILE ELECTRONICS" },
          { label: "Kitchen Brand Store", value: "Kitchen Brand Store" },
          { label: "LOWENTEX DEALZ", value: "LOWENTEX DEALZ" },
        ]}
        filterKey="seller"
        selected={filters["seller"]}
        onChange={handleRadioChange}
      />

      <RadioSection
        title="Availability"
        options={[
          { label: "In Stock", value: "instock" },
          { label: "Out of Stock", value: "outofstock" },
        ]}
        filterKey="stock_status"
        selected={filters["stock_status"]}
        onChange={handleRadioChange}
      />
    </aside>
  );
}
