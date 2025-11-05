"use client";

import { useParentCategories } from "@/hooks/wc/useCategory";
import { WooCategory } from "@/types";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

// Define a proper Error type (instead of `any`)
interface AppError {
  message: string;
}

// Context type
type CategoryContextType = {
  categories: WooCategory[] | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  activeCategory: WooCategory | null;
  setActiveCategory: (props: WooCategory | null) => void;
};

// Create context
const CategoryContext = createContext<CategoryContextType | undefined>(
  undefined
);

export const CategoryProvider = ({ children }: { children: ReactNode }) => {
  const [activeCategory, setActiveCategory] = useState<WooCategory | null>(
    null
  );
  const {
    isLoading,
    data: categories,
    isError,
    error,
  } = useParentCategories({ id: 0 });

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
