"use client";

import { useParentCategories } from "@/hooks/wc/useCategory";
import { WooCategory } from "@/types";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useSearchParams } from "next/navigation";

type CategoryContextType = {
  categories: WooCategory[]; // ✅ no longer possibly undefined
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  activeCategory: WooCategory | null;
  setActiveCategory: (props: WooCategory | null) => void;
  queryCat: string | null;
  queryTitle: string | null;
};

// Create context
const CategoryContext = createContext<CategoryContextType | undefined>(
  undefined
);

export const CategoryProvider = ({ children }: { children: ReactNode }) => {
  const [activeCategory, setActiveCategory] = useState<WooCategory | null>(
    null
  );
  const searchParams = useSearchParams();
  const queryCat = searchParams.get("cat");
  const queryTitle = searchParams.get("title");

  const { isLoading, data, isError, error } = useParentCategories({
    id: Number(queryCat ?? 0),
  });

  // ✅ Always provide an array, even if data is undefined
  const categories = data ?? [];

  useEffect(() => {
    if (categories.length > 0) {
      setActiveCategory(categories[0]);
    }
  }, [categories]);

  return (
    <CategoryContext.Provider
      value={{
        categories,
        isLoading,
        isError,
        error,
        activeCategory,
        setActiveCategory,
        queryCat,
        queryTitle,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

// Custom hook
export const useCategory = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error("useCategory must be used within a CategoryProvider");
  }
  return context;
};
