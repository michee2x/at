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


/**
i want u to create a react search page that searches data from the woocomerce api based on some search filters as u can see on the left of the image. then u can also see the sorting at the top of the products fof sorting products based on price and other factors. i want use tailwind and Nextjs for the ui with typescript. then i want best practice and momoization and caching, if it requires using redux which i want u to, or react query lets fo with them as far it sppeds up our applicaation to the max. Also i want u to use Algolia search for seacrh recommendation while the user types in the input. recently i uploaded some sets of produst json to algolia and already got the tokens to access the api but instead of recommendations returning, i was having products returned to be rendered in the frontend recommendation as the user typed. so i want u to solve that let recommendations come off those products as the user searches in the input, just like walmart and temu, then when we click on a recommendation, products are fetched from the wc rest api and product based on the recommendation are rendered. yeah thats basically it. then this products that come can be sorted in the frontend and can change as the user change the filter in realtime. remember speed and best practice. explain what u do. getgoing */