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
  categories: WooCategory[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  activeCategory: WooCategory | null;
  setActiveCategory: (props: WooCategory | null) => void;
  queryCat: string | null;
  queryTitle: string | null;
};

const CategoryContext = createContext<CategoryContextType | undefined>(
  undefined
);

export const CategoryProvider = ({ children }: { children: ReactNode }) => {
  const [activeCategory, setActiveCategory] = useState<WooCategory | null>(
    null
  );
  const [queryCat, setQueryCat] = useState<string | null>(null);
  const [queryTitle, setQueryTitle] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  const searchParams = useSearchParams();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      setQueryCat(searchParams.get("cat"));
      setQueryTitle(searchParams.get("title"));
    }
  }, [isClient, searchParams]);

  const {
    isLoading,
    data: categories = [],
    isError,
    error,
  } = useParentCategories({ id: Number(queryCat ?? 0) });

  useEffect(() => {
    if (categories.length > 0) setActiveCategory(categories[0]);
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

export const useCategory = () => {
  const context = useContext(CategoryContext);
  if (!context)
    throw new Error("useCategory must be used within a CategoryProvider");
  return context;
};
