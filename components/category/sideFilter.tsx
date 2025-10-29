"use client";

import { Params } from "@/types";
import React, { useMemo, useState } from "react";

type Brand = { id: number; name: string };
type Store = { id: number; name: string };

interface FiltersProps {
  params: Params;
  onChange: (patch: Params) => void;
  availableAttributes: { name: string; options: string[] }[];
  brands?: { id: number; name: string }[];
  stores?: { id: number; name: string }[];
}

// ✅ Strongly typed debounce
function debounce<T extends (...args: any[]) => void>(fn: T, wait = 300) {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>): void => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), wait);
  };
}

function Filters({
  params,
  onChange,
  availableAttributes, // unused but kept for future
  brands = [],
  stores = [],
}: FiltersProps) {
  const [local, setLocal] = useState<Params>({ ...params });

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
    <aside className="w-full md:w-64 rounded-lg p-4 sticky top-4 h-screen overflow-auto bg-white shadow-sm">
      <h4 className="font-semibold mb-2">Filters</h4>

      {/* Search */}
      <label className="block mt-3 text-sm">Search</label>
      <input
        value={(local.q as string) || ""}
        onChange={(e) => setAndApply("q", e.target.value)}
        placeholder="Search products..."
        className="mt-1 p-2 w-full border rounded"
      />

      {/* Sort */}
      <label className="block mt-3 text-sm">Sort</label>
      <select
        value={(local.sort as string) || "popularity"}
        onChange={(e) => setAndApply("sort", e.target.value)}
        className="mt-1 p-2 w-full border rounded"
      >
        <option value="popularity">Popularity</option>
        <option value="latest">Newest</option>
        <option value="price_asc">Price: Low → High</option>
        <option value="price_desc">Price: High → Low</option>
        <option value="rating">Top Rated</option>
      </select>

      {/* Store Filter */}
      {stores.length > 0 && (
        <>
          <label className="block mt-3 text-sm">Vendor/Store</label>
          <select
            value={(local.store as string) || "none"}
            onChange={(e) => setAndApply("store", e.target.value)}
            className="mt-1 p-2 w-full border rounded"
          >
            <option value="none">All Stores</option>
            {stores.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </>
      )}

      {/* Brand Filter */}
      {brands.length > 0 && (
        <>
          <label className="block mt-3 text-sm">Brand</label>
          <select
            value={(local.brand as string) || "none"}
            onChange={(e) => setAndApply("brand", e.target.value)}
            className="mt-1 p-2 w-full border rounded"
          >
            <option value="none">All Brands</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </>
      )}

      {/* Availability */}
      <label className="block mt-3 text-sm">Availability</label>
      <select
        value={(local.stock_status as string) || "any"}
        onChange={(e) => setAndApply("stock_status", e.target.value)}
        className="mt-1 p-2 w-full border rounded"
      >
        <option value="any">All</option>
        <option value="instock">In Stock</option>
        <option value="outofstock">Out of Stock</option>
        <option value="onbackorder">Backorder</option>
      </select>

      {/* Price */}
      <div className="mt-3">
        <label className="text-sm">Price range</label>
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
    </aside>
  );
}

export default Filters;
