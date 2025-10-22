"use client";
import { WooCategory } from "@/types";
import {createContext, useContext, useState, ReactNode, SetStateAction, Dispatch, useEffect} from "react"

type SearchContextType = {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);  

export const SearchProvider = ({children}: {children: ReactNode}) => {
    const [search, setSearch] = useState<string>("");
    
    return (
        <SearchContext.Provider value={{search, setSearch}}>
            {children}
        </SearchContext.Provider>
    )
}
export const useSearch = () => {
    const context = useContext(SearchContext);
    if (context === undefined) {
        throw new Error("useSearch must be used within a SearchProvider");
    }
    return context;
}