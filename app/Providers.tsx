"use client";
import React, { ReactNode } from 'react'
import { CategoryProvider } from '@/contexts/category-context'
import { SidebarProvider } from '@/contexts/sidebar-context';
import {FilterProvider} from "@/contexts/filter-context"
import { SearchProvider } from '@/contexts/search-context';

const Providers = ({children}: {children:ReactNode}) => {
  return (
    <SidebarProvider>
      <FilterProvider>
        <SearchProvider>
          <CategoryProvider>{children}</CategoryProvider>
        </SearchProvider>
      </FilterProvider>
    </SidebarProvider>
  );
}

export default Providers

//http://localhost:3000/category/lec?cat=352&title=Jewelry%20%26%20Accessories&opt_level=1&page=1&sort=popular