"use client";

import { Params } from "@/types";
import React, { useMemo, useState } from "react";
import { useFilter } from "@/contexts/filter-context";
import { FaSort } from "react-icons/fa6";
import { IoIosPricetag } from "react-icons/io";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "../ui/button";

type Brand = { id: number; name: string };
type Store = { id: number; name: string };

interface FiltersProps {
  params: Params;
  onChange: (patch: Params) => void;
  availableAttributes: { name: string; options: string[] }[];
  brands?: Brand[];
  stores?: Store[];
  setParams?: (value: React.SetStateAction<Params>) => void;
}

// Debounce helper
function debounce<T extends (...args: Parameters<T>) => void>(
  fn: T,
  wait = 300
) {
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
  setParams
}: FiltersProps) {
  const [local, setLocal] = useState<Params>({ ...params });
  const { showFilter, setShowFilter } = useFilter();

  const debounced = useMemo(
    () => debounce((patch: Params) => onChange(patch), 350),
    [onChange]
  );

  const setAndApply = (key: string, val: string | number | undefined) => {
    const next = { ...local, [key]: val };
    setLocal(next);
    debounced(next);
  };

  return (
    <aside className="fixed bg-white font-poppins lg:sticky z-40 top-0 left-0 flex h-screen lg:w-[15vw]">
      {/* Overlay for mobile */}
      <div
        onClick={() => setShowFilter(false)}
        className={`w-screen h-screen ${
          showFilter ? "block" : "hidden"
        } lg:hidden inset-0 fixed bg-black/40`}
      />

      {/* Sidebar content */}
      <div
        className={`relative transition-all duration-400 ${
          showFilter ? "block" : "hidden lg:block"
        }`}
      >
        <div className="relative h-screen w-[70vw] md:w-[15vw] bg-white flex flex-col gap-4 text-black p-4 pt-6 shadow-sm overflow-y-auto">
          <h4 className="text-[14px] lg:text-[18px] mt-1 font-semibold mb-2">
            Featured Filters
          </h4>

          {/* Sort */}
          <div>
            <label className="text-sm font-medium flex items-center gap-2 mb-1">
              <FaSort /> Sort
            </label>
            <Select
              value={local.sort as string}
              onValueChange={(v) => setAndApply("sort", v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select sort order" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectGroup>
                  <SelectLabel>Sort by</SelectLabel>
                  <SelectItem value="none">Relevance</SelectItem>
                  <SelectItem value="popularity">Popularity</SelectItem>
                  <SelectItem value="latest">Newest</SelectItem>
                  <SelectItem value="price_asc">Price: Low → High</SelectItem>
                  <SelectItem value="price_desc">Price: High → Low</SelectItem>
                  <SelectItem value="rating">Top Rated</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Store */}
          {stores.length > 0 && (
            <div>
              <label className="text-sm font-medium mb-1 block">Store</label>
              <Select
                value={local.store?.toString() || ""}
                onValueChange={(v) => setAndApply("store", Number(v))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select store" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectGroup>
                    <SelectLabel>Stores</SelectLabel>
                    {stores.map((s) => (
                      <SelectItem key={s.id} value={s.id.toString()}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Brand */}
          {brands.length > 0 && (
            <div>
              <label className="text-sm font-medium mb-1 block">Brand</label>
              <Select
                value={local.brand?.toString() || ""}
                onValueChange={(v) => setAndApply("brand", Number(v))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select brand" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectGroup>
                    <SelectLabel>Brands</SelectLabel>
                    {brands.map((b) => (
                      <SelectItem key={b.id} value={b.id.toString()}>
                        {b.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Availability */}
          <div>
            <label className="text-sm font-medium mb-1 block">
              Availability
            </label>
            <Select
              value={local.stock_status as string}
              onValueChange={(v) => setAndApply("stock_status", v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select availability" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectGroup>
                  <SelectLabel>Stock Status</SelectLabel>
                  <SelectItem value="any">All</SelectItem>
                  <SelectItem value="instock">In Stock</SelectItem>
                  <SelectItem value="outofstock">Out of Stock</SelectItem>
                  <SelectItem value="onbackorder">Backorder</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Price */}
          <div>
            <label className="text-sm font-medium flex items-center gap-2 mb-1">
              <IoIosPricetag /> Price Range
            </label>
            <div className="flex gap-2 mt-1">
              <input
                className="p-2 border rounded w-1/2 text-sm"
                placeholder="Min"
                value={(local.min_price as string) || ""}
                onChange={(e) => setAndApply("min_price", e.target.value)}
              />
              <input
                className="p-2 border rounded w-1/2 text-sm"
                placeholder="Max"
                value={(local.max_price as string) || ""}
                onChange={(e) => setAndApply("max_price", e.target.value)}
              />
            </div>
          </div>

          <div className="pl-3 flex pt-6 pr-6 items-start absolute bottom-0 left-0 w-full h-24">
            {params && (
              <Button
                className="w-full hover:bg-white"
                onClick={() => setParams?.({ per_page: 24, page: 1 })}
                variant="outline"
              >
                clear filter
              </Button>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Filters;
