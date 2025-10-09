"use client";

import { WooCategory } from "@/types";
import {createContext, useContext, useState, ReactNode, SetStateAction, Dispatch, useEffect} from "react"




type CategoryContextType = {
    selectedCategory: string;
    setSelectedCategory: Dispatch<SetStateAction<string>>;
    categories: WooCategory[];
    setCategories: Dispatch<SetStateAction<WooCategory[]>>;
    loading: boolean;
    error: any;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);  

export const CategoryProvider = ({children}: {children: ReactNode}) => {
    const [selectedCategory, setSelectedCategory] = useState<string>("beauty & wellness");
    const [categories, setCategories] = useState<WooCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchCategories() {
          setLoading(true);
          try {
            const res = await fetch('/api/categories');
            if (!res.ok) throw new Error('Failed to fetch categories');
    
            const data: WooCategory[] = await res.json();
            setCategories(data);
          } catch (err: any) {
            setError(err.message);
          } finally {
            setLoading(false);
          }
        }
    
        fetchCategories();
      }, [categories.length]);
    
    return (
        <CategoryContext.Provider value={{selectedCategory, setSelectedCategory, categories, setCategories, loading, error}}>
            {children}
        </CategoryContext.Provider>
    )
}
export const useCategory = () => {
    const context = useContext(CategoryContext);
    if (context === undefined) {
        throw new Error("useCategory must be used within a CategoryProvider");
    }
    return context;
}