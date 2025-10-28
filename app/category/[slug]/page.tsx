"use client";

import React, { useEffect, useMemo, useState } from "react";
import qs from "query-string";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ProductCard } from "../page";
import { WooProduct } from "@/types";

// -----------------------------
// Types
// -----------------------------
type Product = {
  id: number;
  name: string;
  price: string;
  images?: { src: string; alt?: string }[];
  [k: string]: any;
};

type CategoryMeta = {
  title?: string;
  description?: string;
  attributes?: { name: string; options: string[] }[];
};

// -----------------------------
// Utility: debounce
// -----------------------------
function debounce<T extends (...args: any[]) => void>(fn: T, wait = 300) {
  let t: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (t) clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

// -----------------------------
// Loader
// -----------------------------
export function Loader({ size = 48 }: { size?: number }) {
  return (
    <div className="flex items-center justify-center p-6">
      <svg
        className="animate-spin text-blue-600"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        width={size}
        height={size}
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>
      <span className="sr-only">Loading</span>
    </div>
  );
}

// -----------------------------
// Breadcrumb Component
// -----------------------------
export function Breadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const formatName = (str: string) =>
    decodeURIComponent(
      str.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    );

  const paths = segments.map((seg, i) => ({
    name: formatName(seg),
    href: "/" + segments.slice(0, i + 1).join("/"),
  }));

  return (
    <nav className="text-sm text-gray-500 mb-3" aria-label="Breadcrumb">
      <ol className="flex items-center flex-wrap gap-1">
        <li>
          <Link href="/" className="hover:text-blue-600">
            Home
          </Link>
        </li>
        {paths.map((p, idx) => (
          <li key={idx} className="flex items-center gap-1">
            <span>/</span>
            {idx === paths.length - 1 ? (
              <span className="text-gray-800 font-medium">{p.name}</span>
            ) : (
              <Link href={p.href} className="hover:text-blue-600">
                {p.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

// -----------------------------
// Filters Component
// -----------------------------
export function Filters({
  params,
  onChange,
  availableAttributes,
}: {
  params: Record<string, string | number | undefined>;
  onChange: (patch: Record<string, any>) => void;
  availableAttributes: { name: string; options: string[] }[];
}) {
  const [local, setLocal] = useState<Record<string, any>>({ ...params });

  const debounced = useMemo(
    () =>
      debounce((patch: Record<string, any>) => {
        onChange(patch);
      }, 350),
    [onChange]
  );

  useEffect(() => setLocal({ ...params }), [params]);

  function setAndApply(key: string, val: any) {
    const next = { ...local, [key]: val };
    setLocal(next);
    debounced(next);
  }

  return (
    <aside className="w-full md:w-72 border rounded-lg p-4 sticky top-20 h-fit bg-white shadow-sm">
      <h4 className="font-semibold mb-2">Filters</h4>

      <label className="block mt-3 text-sm">Search</label>
      <input
        value={(local.q as string) || ""}
        onChange={(e) => setAndApply("q", e.target.value)}
        placeholder="Search products..."
        className="mt-1 p-2 w-full border rounded"
      />

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

      <div className="mt-3">
        <label className="text-sm">Availability</label>
        <select
          value={(local.in_stock as string) || ""}
          onChange={(e) => setAndApply("in_stock", e.target.value)}
          className="mt-1 p-2 w-full border rounded"
        >
          <option value="">Any</option>
          <option value="true">In stock</option>
          <option value="false">Out of stock</option>
        </select>
      </div>

      {availableAttributes?.length > 0 &&
        availableAttributes.map((attr) => (
          <div key={attr.name} className="mt-3">
            <label className="text-sm">{attr.name}</label>
            <select
              className="mt-1 p-2 w-full border rounded"
              value={(local[`attr_${attr.name}`] as string) || ""}
              onChange={(e) => setAndApply(`attr_${attr.name}`, e.target.value)}
            >
              <option value="">Any</option>
              {attr.options.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>
        ))}

      <div className="mt-4 flex gap-2">
        <button
          onClick={() => onChange({ _reset: true })}
          className="flex-1 p-2 border rounded bg-gray-50"
        >
          Reset
        </button>
        <button
          onClick={() => onChange({ _apply: true })}
          className="flex-1 p-2 rounded bg-blue-600 text-white"
        >
          Apply
        </button>
      </div>
    </aside>
  );
}

// -----------------------------
// Main Category Page Client
// -----------------------------
export default function CategoryPageClient({
  initialProducts = [],
  initialParams = {},
  categoryMeta = {},
}: {
  initialProducts?: WooProduct[];
  initialParams?: Record<string, string | number | undefined>;
  categoryMeta?: CategoryMeta;
}) {
  const [products, setProducts] = useState<WooProduct[]>(initialProducts);
  const [page, setPage] = useState<number>(Number(initialParams.page) || 1);
  const [perPage, setPerPage] = useState<number>(
    Number(initialParams.per_page) || 24
  );
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [params, setParams] = useState<Record<string, any>>({
    ...initialParams,
  });
  const [availableAttributes, setAvailableAttributes] = useState<
    { name: string; options: string[] }[]
  >(categoryMeta?.attributes || []);

  async function fetchProducts(
    nextParams?: Record<string, any>,
    opts: { replaceProducts?: boolean } = {}
  ) {
    const qp = { ...params, page, per_page: perPage, ...(nextParams || {}) };
    setLoading(true);
    try {
      const q = qs.stringify(qp);
      const res = await fetch(`/api/products?${q}`, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch");
      const payload: WooProduct[] = await res.json();
      setProducts(payload);
      setTotal(payload.length || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleFilterChange(patch: Record<string, any>) {
    if (patch._reset) {
      setParams({});
      setPage(1);
      fetchProducts({}, { replaceProducts: true });
      return;
    }
    if (patch._apply) {
      setPage(1);
      fetchProducts({}, { replaceProducts: true });
      return;
    }

    setParams((prev) => ({ ...prev, ...patch }));
    debounce(() => fetchProducts({ ...params, ...patch }), 400)();
  }

  function gotoPage(n: number) {
    setPage(n);
    fetchProducts({ page: n });
  }

  useEffect(() => {
    if (!initialProducts?.length) fetchProducts();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-6">
        <Filters
          params={params}
          onChange={handleFilterChange}
          availableAttributes={availableAttributes}
        />

        <main className="flex-1">
          <header className="mb-6">
            <Breadcrumb />
            <h1 className="text-3xl font-bold">
              {categoryMeta?.title ?? "Category"}
            </h1>
            {categoryMeta?.description && (
              <p className="text-gray-600 mt-2">{categoryMeta.description}</p>
            )}
          </header>

          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-500">{total} items</div>
            <div className="flex items-center gap-2">
              <label className="text-sm">Per page</label>
              <select
                value={perPage}
                onChange={(e) => setPerPage(Number(e.target.value))}
                className="p-2 border rounded"
              >
                {[12, 24, 36, 48].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading && (
            <div className="w-full p-6 bg-white rounded-lg mb-4">
              <Loader />
              <div className="text-center text-sm text-gray-500">
                Fetching latest products…
              </div>
            </div>
          )}

          <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products && products.length > 0 ? (
              products.map((p) => <ProductCard key={p.id} product={p} />)
            ) : loading ? (
              Array.from({ length: perPage <= 24 ? perPage : 24 }).map(
                (_, i) => (
                  <div
                    key={i}
                    className="border rounded-lg p-3 animate-pulse h-56 bg-gray-100"
                  />
                )
              )
            ) : (
              <div className="col-span-full p-6 text-center text-gray-600">
                No products found.
              </div>
            )}
          </section>

          <footer className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-500">Page {page}</div>
            <div className="flex gap-2">
              <button
                onClick={() => gotoPage(Math.max(1, page - 1))}
                className="px-3 py-2 border rounded"
              >
                Prev
              </button>
              <button
                onClick={() => gotoPage(page + 1)}
                className="px-3 py-2 border rounded"
              >
                Next
              </button>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
