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

export type queryType = { catId: string | number; catTitle: string };

type CategoryContextType = {
  categories: WooCategory[] | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  activeCategory: WooCategory | null;
  setActiveCategory: (props: WooCategory | null) => void;
  queryData: queryType;
  setQueryData: (props: queryType) => void;
};

// Create context
const CategoryContext = createContext<CategoryContextType | undefined>(
  undefined
);

export const CategoryProvider = ({ children }: { children: ReactNode }) => {
  const [activeCategory, setActiveCategory] = useState<WooCategory | null>(
    null
  );
  const [queryData, setQueryData] = useState<queryType>({
    catId: 0,
    catTitle: "General",
  });

  const {
    isLoading,
    data: categories,
    isError,
    error,
  } = useParentCategories({ id: queryData.catId, cache: false });

  useEffect(() => {
    if (categories && categories.length > 0) {
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
        queryData,
        setQueryData,
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
