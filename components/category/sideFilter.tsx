"use client";

import { Params } from "@/types";
import React, { useMemo, useState } from "react";
import ScifiButton from "../buttons/button";
import { LiaTimesSolid } from "react-icons/lia";
import { useFilter } from "@/contexts/filter-context";
import { FaStoreAlt } from "react-icons/fa";
import { FaSort } from "react-icons/fa6";
import { IoIosPricetag } from "react-icons/io";



type Brand = { id: number; name: string };
type Store = { id: number; name: string };

interface FiltersProps {
  params: Params;
  onChange: (patch: Params) => void;
  availableAttributes: { name: string; options: string[] }[];
  brands?: Brand[];
  stores?: Store[];
}

// ✅ Debounce utility (no `any`)
function debounce<T extends (...args: Parameters<T>) => void>(fn: T, wait = 300) {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>): void => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), wait);
  };
}

function Filters({
  params,
  onChange,
  availableAttributes,
  brands = [],
  stores = [],
}: FiltersProps) {
  const [local, setLocal] = useState<Params>({ ...params });
  const [activeFilter, setActiveFilter] = useState<string | null>(null); // which filter is open
  const { showFilter,setShowFilter } = useFilter();

  const debounced = useMemo(
    () => debounce((patch: Params) => onChange(patch), 350),
    [onChange]
  );

  const setAndApply = (key: string, val: string | number | undefined) => {
    const next = { ...local, [key]: val };
    setLocal(next);
    debounced(next);
  };

  // Determine which filter’s options to show in the blue panel
  const renderActivePanel = () => {
    switch (activeFilter) {
      case "sort":
        return (
          <div className="space-y-3">
            {[
              { label: "Relevance", value: "none" },
              { label: "Popularity", value: "popularity" },
              { label: "Newest", value: "latest" },
              { label: "Price: Low → High", value: "price_asc" },
              { label: "Price: High → Low", value: "price_desc" },
              { label: "Top Rated", value: "rating" },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  setAndApply("sort", opt.value);
                  setActiveFilter(null);
                }}
                className={`block w-full text-left px-4 py-2 rounded ${
                  local.sort === opt.value
                    ? "bg-white/30 font-semibold"
                    : "hover:bg-white/20"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        );

      case "store":
        return (
          <div className="space-y-3">
            {stores.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setAndApply("store", s.id);
                  setActiveFilter(null);
                }}
                className={`block w-full text-left px-4 py-2 rounded ${
                  local.store === s.id
                    ? "bg-white/30 font-semibold"
                    : "hover:bg-white/20"
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>
        );

      case "brand":
        return (
          <div className="space-y-3">
            {brands.map((b) => (
              <button
                key={b.id}
                onClick={() => {
                  setAndApply("brand", b.id);
                  setActiveFilter(null);
                }}
                className={`block w-full text-left px-4 py-2 rounded ${
                  local.brand === b.id
                    ? "bg-white/30 font-semibold"
                    : "hover:bg-white/20"
                }`}
              >
                {b.name}
              </button>
            ))}
          </div>
        );

      case "availability":
        return (
          <div className="space-y-3">
            {[
              { label: "All", value: "any" },
              { label: "In Stock", value: "instock" },
              { label: "Out of Stock", value: "outofstock" },
              { label: "Backorder", value: "onbackorder" },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  setAndApply("stock_status", opt.value);
                  setActiveFilter(null);
                }}
                className={`block w-full text-left px-4 py-2 rounded ${
                  local.stock_status === opt.value
                    ? "bg-white/30 font-semibold"
                    : "hover:bg-white/20"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        );

      case "price":
        return (
          <div className="mt-3">
            <label className="text-sm hidden">Price range</label>
            <div className="flex gap-2 mt-2">
              <input
                className="p-2 border rounded w-1/2"
                placeholder="min"
                value={(local.min_price as string) || ""}
                onChange={(e) => setAndApply("min_price", e.target.value)}
              />
              <input
                className="p-2 border rounded w-1/2"
                placeholder="max"
                value={(local.max_price as string) || ""}
                onChange={(e) => setAndApply("max_price", e.target.value)}
              />
            </div>
          </div>
        );

      default:
        return <p className="opacity-60">Click a filter to view options</p>;
    }
  };

  return (
    <aside className="fixed bg-white font-poppins lg:sticky z-50 top-0 left-0 flex h-screen lg:w-[15vw]">
      <div
        onClick={() => setShowFilter(false)}
        className={`w-screen h-screen ${
          showFilter ? "block" : "hidden"
        } lg:hidden inset-0  fixed bg-black/40`}
      />
      <div
        className={`relative transition-all duration-400 ${
          showFilter ? "block" : "hidden lg:block"
        }`}
      >
        {/* LEFT WHITE FILTER SIDEBAR */}
        <div className="relative h-screen w-[40vw] bg-white flex flex-col gap-3 md:w-[15vw] text-black p-4 pt-6 shadow-sm overflow-y-auto">
          <h4 className="text-[14px] lg:text-[18px] mt-1 font-semibold mb-4">
            Featured Filters
          </h4>

          <ScifiButton
            sideIcon={<FaSort />}
            onClick={() => setActiveFilter("sort")}
            text={local.sort || "sort"}
            className=" text-left"
          />

          {/* Store */}
          {stores.length > 0 && (
            <ScifiButton
              onClick={() => setActiveFilter("store")}
              className=" text-left"
              text={
                local.store
                  ? stores.find((s) => s.id === local.store)?.name
                  : "Stores"
              }
            />
          )}

          {/* Brand */}
          {brands.length > 0 && (
            <ScifiButton
              onClick={() => setActiveFilter("brand")}
              className=" text-left"
              text={
                local.brand
                  ? brands.find((b) => b.id === local.brand)?.name
                  : "All Brands"
              }
            />
          )}

          <ScifiButton
            onClick={() => setActiveFilter("availability")}
            className=" text-left"
            text={local.stock_status || "Availability"}
          />

          <ScifiButton
            sideIcon={<IoIosPricetag />}
            onClick={() => setActiveFilter("price")}
            className=" text-left"
            text={local.price || "price"}
          />
        </div>

        {/* RIGHT BLUE SECTION */}
        <div
          className={`w-[60vw] ${
            activeFilter ? "block" : "hidden"
          } lg:w-[30vw] z-[9999] hidde h-screen bg-white lg:pt-2 absolute top-0 left-full px-6 overflow-y-auto`}
        >
          <div className="w-full pt-5 h-auto sticky top-0 bg-inherit">
            <h3 className="text-lg font-semibold items-center flex justify-between cursor-pointer mb-4">
              Filter by {activeFilter}{" "}
              <LiaTimesSolid onClick={() => setActiveFilter("")} />
            </h3>
            {/* Search */}
            {activeFilter &&
              !["price", "availability", "sort"].includes(activeFilter) && (
                <label className="input mb-6">
                  <svg
                    className="h-[1em] opacity-50"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <g
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      strokeWidth="2.5"
                      fill="none"
                      stroke="currentColor"
                    >
                      <circle cx="11" cy="11" r="8"></circle>
                      <path d="m21 21-4.3-4.3"></path>
                    </g>
                  </svg>
                  <input
                    type="search"
                    value={(local.q as string) || ""}
                    onChange={(e) => setAndApply("q", e.target.value)}
                    placeholder={`search more ${activeFilter}`}
                    className="outline-none ring-0"
                  />
                </label>
              )}
          </div>
          {renderActivePanel()}
        </div>
      </div>
    </aside>
  );
}

export default Filters;
