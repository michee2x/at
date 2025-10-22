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