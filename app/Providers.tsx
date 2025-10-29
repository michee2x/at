"use client";
import React, { ReactNode } from 'react'
import { CategoryProvider } from '@/contexts/category-context'
import { SidebarProvider } from '@/contexts/sidebar-context';
import {FilterProvider} from "@/contexts/filter-context"
import { SearchProvider } from '@/contexts/search-context';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

const Providers = ({children}: {children:ReactNode}) => {
  const [client] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={client}>
    <SidebarProvider>
      <FilterProvider>
        <SearchProvider>
          <CategoryProvider>{children}</CategoryProvider>
        </SearchProvider>
      </FilterProvider>
    </SidebarProvider>
    </QueryClientProvider>
  );
}

export default Providers

//http://localhost:3000/category/lec?cat=352&title=Jewelry%20%26%20Accessories&opt_level=1&page=1&sort=popular