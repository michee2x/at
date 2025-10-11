"use client";
import { WooCategory } from "@/types";
import {createContext, useContext, useState, ReactNode, SetStateAction, Dispatch, useEffect} from "react"

type SidebarContextType = {
  showSideBar: boolean;
  setShowSideBar: Dispatch<SetStateAction<boolean>>;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);  

export const SidebarProvider = ({children}: {children: ReactNode}) => {
    const [showSideBar, setShowSideBar] = useState<boolean>(false);
    
    return (
        <SidebarContext.Provider value={{showSideBar, setShowSideBar}}>
            {children}
        </SidebarContext.Provider>
    )
}
export const useSideBar = () => {
    const context = useContext(SidebarContext);
    if (context === undefined) {
        throw new Error("useSideBar must be used within a SidebarProvider");
    }
    return context;
}