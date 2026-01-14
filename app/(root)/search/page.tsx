"use client";

import { useSearch } from "@/contexts/search-context";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function SearchPage() {
  const { search, setSearch } = useSearch();
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Auto-focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to be implemented later as requested
    console.log("Search submitted:", search);
  };

  return (
    <main className="min-h-screen bg-white flex flex-col items-center pt-4 px-4 pb-20">
      
      {/* Professional Search Input Container */}
      <div className="w-full max-w-3xl">
        <form onSubmit={handleSearch} className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-[#9747FF] transition-colors" />
          </div>
          <input
            ref={inputRef}
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for sneakers, brands, fabrics..."
            className="w-full h-12 pl-12 pr-4 bg-gray-50 border border-gray-200 rounded-full text-base focus:outline-none focus:ring-2 focus:ring-[#9747FF]/20 focus:border-[#9747FF] transition-all shadow-sm"
          />
          {/* Optional: Add clear button logic here later */}
        </form>
      </div>

      {/* Suggested / Recent Searches Placeholder (Professional Touch) */}
      <div className="w-full max-w-3xl mt-8">
        <h3 className="text-sm font-semibold text-gray-900 mb-4 px-2">Popular Searches</h3>
        <div className="flex flex-wrap gap-2">
            {["Sneakers", "Ankara Fabric", "Headphones", "Watches", "Gaming"].map((term) => (
                <button 
                  key={term}
                  onClick={() => setSearch(term)}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                >
                    {term}
                </button>
            ))}
        </div>
      </div>

      {/* Empty State / Initial View */}
      <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-400 mt-20">
         <p className="text-sm">Start typing to see results...</p>
      </div>

    </main>
  );
}
