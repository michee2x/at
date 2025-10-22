"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  liteClient as algoliasearch,
  SearchResponse,
} from "algoliasearch/lite";
import { autocomplete, AutocompleteState } from "@algolia/autocomplete-js";
import "@algolia/autocomplete-theme-classic";
import Image from "next/image";
import { CiCircleInfo } from "react-icons/ci";
import { FaChevronLeft } from "react-icons/fa6";
import { useFilter } from "@/contexts/filter-context";


export type ProductHit = {
  objectID: number | string;
  name: string;
  slug?: string;
  permalink?: string;
  price?: number;
  image?: string;
  categories?: string[];
  brands?: string[];
  average_rating?: number;
  stock_status?: string;
  description?: string;
  date_created?: string;
};

const ALGOLIA_APP_ID = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!;
const ALGOLIA_SEARCH_KEY = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY!;
const INDEX_NAME = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME!;

const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_KEY);

async function searchAlgolia(q: string): Promise<ProductHit[]> {
  if (!q.trim()) return [];

  const { results } = await client.search<ProductHit>([
    {
      indexName: INDEX_NAME,
      params: { query: q, hitsPerPage: 6 },
    },
  ]);

  return (results[0] as SearchResponse<ProductHit>)?.hits ?? [];
}

export default function AlgoliaSearch(): React.JSX.Element {
  const {setShowAlgoliaSearch} = useFilter()
  const panelRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [query, setQuery] = useState<string>("");
  const [hits, setHits] = useState<ProductHit[]>([]);
  const [open, setOpen] = useState<boolean>(false);

  const handleSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setHits([]);
      setOpen(false);
      return;
    }
    const results = await searchAlgolia(q);
    setHits(results);
    setOpen(true);
  }, []);

  // debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      void handleSearch(query);
    }, 150);
    return () => clearTimeout(timer);
  }, [query, handleSearch]);

  // Initialize Algolia autocomplete dropdown
  useEffect(() => {
    if (!panelRef.current || !inputRef.current) return;

    const ac = autocomplete<ProductHit>({
      container: panelRef.current,
      openOnFocus: true,
      getSources() {
        return [
          {
            sourceId: "products",
            getItems: async ({ query }) => {
              if (!query) return [];
              return await searchAlgolia(query);
            },
            templates: {
              item({ item }) {
                const title =
                  item.name.length > 60
                    ? `${item.name.slice(0, 60)}…`
                    : item.name;
                const cat = item.categories?.[0] || item.brands?.[0] || "";
                const price = item.price
                  ? `₦${Number(item.price).toLocaleString()}`
                  : "";
                const img = item.image || "";
                return `
                  <div class="flex items-center gap-3 p-2">
                    <img src="${img}" class="w-12 h-12 object-cover rounded" alt="${title}" />
                    <div class="flex-1">
                      <div class="font-medium text-sm">${title}</div>
                      <div class="text-xs text-gray-400">${cat} · ${price}</div>
                    </div>
                  </div>
                `;
              },
            },
            onSelect({ item }) {
              if (item.permalink) window.location.href = item.permalink;
            },
          },
        ];
      },
      onStateChange({ state }: { state: AutocompleteState<ProductHit> }) {
        setQuery(state.query ?? "");
        setOpen(Boolean(state.isOpen));
      },
    });

    return () => ac.destroy();
  }, []);

  return (
    <div
      className={`transition-all duration-200 flex flex-col items-center mx-auto`}
    >
      <div className="w-full px-3 gap-2 h-auto flex">
        <div onClick={() => setShowAlgoliaSearch(false)} className="w-3 lg:hidden flex mt-3 justify-center h-full">
          <FaChevronLeft className="text-xl cursor-pointer" />
        </div>
        <section className="w-fit h-fit">
          <div className="lg:w-[calc(612/1280*100vw)] sm:w-[calc(554/1280*100vw)] md:w-[calc(512/1280*100vw)] lg:h-[52px] w-[90vw] h-[44px] relative bg-gradient-to-r from-[#EBCC97] to-[#9747FF] rounded-[36px] p-[1.5px]">
            <div className="sm:w-[calc(550/1280*100vw)] inset-0 lg:w-[calc(608/1280*100vw)] md:w-[calc(508/1280*100vw)] w-[89vw] h-[40px] lg:h-[48px] flex items-center absolute transform -translate-x-1/2 left-1/2 -translate-y-1/2 top-1/2 lg:gap-3 p-[6px] lg:p-[12px] rounded-[36px] bg-white">
              <span className="flex size-[28px] items-center justify-center bg-gradient-to-r from-[#EBCC97] to-[#9747FF] rounded-full">
                <Image
                  alt="atlaze AI search logo"
                  src="/home/vector%20icons/Vector%20(9).png"
                  width={12}
                  height={12}
                />
              </span>

              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for sneakers, brands, fabrics, etc..."
                className="flex-1 px-2 border-0 outline-0 align-middle text-[14px] tracking-[0%] leading-[100%] text-[#6C757D] text-sm lg:text-base lg:px-3 py-2 bg-transparent outline-none border-none focus:outline-none focus:border-none"
              />

              {/* <Image
                alt="atlaze AI search logo"
                src="/home/hero/d49ad3ba235d33ba9a0d6da5cd9ff0aefadb2ca5.png"
                width={36}
                height={36}
              /> */}
            </div>
          </div>
          <span className="flex gap-[1.5px] items-center">
            <CiCircleInfo />
            <span className="text-[10px] mt-1 italic text-[#6C757D] tracking-[0%] leading-[100%]">
              AI assisted search engine
            </span>
          </span>
        </section>
      </div>
      {/* Dropdown panel */}
      {open && hits.length > 0 && (
        <div
          ref={panelRef}
          className="mt-4 w-full lg:w-[90vw] max-w-[620px] mx-auto bg-white rounded-xl lg:shadow-lg overflow-hidden border border-gray-100"
        >
          {hits.map((hit) => (
            <a
              key={String(hit.objectID)}
              href={hit.permalink ?? "#"}
              className="flex items-center gap-4 p-3 hover:bg-gray-50 transition"
            >
              <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                {hit.image ? (
                  <Image
                    src={hit.image}
                    alt={hit.name}
                    width={64}
                    height={64}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                    No Image
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-800 text-sm line-clamp-2">
                  {hit.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {hit.categories?.[0] ?? hit.brands?.[0]}{" "}
                  {hit.price ? `· ₦${hit.price.toLocaleString()}` : ""}
                </p>
              </div>
            </a>
          ))}
        </div>
      )}
      {open && hits.length === 0 && (
        <div className="mt-4 text-center text-gray-400 text-sm">
          No results — try another search
        </div>
      )}
      <style jsx global>{`
        input {
          border: none !important;
          outline: none !important;
          box-shadow: none !important;
        }
        .aa-Input,
        .aa-Form,
        .aa-Panel {
          border: none !important;
          outline: none !important;
          box-shadow: none !important;
        }
      `}</style>
    </div>
  );
}
