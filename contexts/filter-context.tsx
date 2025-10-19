"use client";
import { WooCategory } from "@/types";
import {createContext, useContext, useState, ReactNode, SetStateAction, Dispatch, useEffect} from "react"

type FilterContextType = {
  showFilter: boolean;
  setShowFilter: Dispatch<SetStateAction<boolean>>;
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);  

export const FilterProvider = ({children}: {children: ReactNode}) => {
    const [showFilter, setShowFilter] = useState<boolean>(true);
    
    return (
        <FilterContext.Provider value={{showFilter, setShowFilter}}>
            {children}
        </FilterContext.Provider>
    )
}
export const useFilter = () => {
    const context = useContext(FilterContext);
    if (context === undefined) {
        throw new Error("useFilter must be used within a SidebarProvider");
    }
    return context;
}