"use client";
import React, { ReactNode } from 'react'
import { CategoryProvider } from '@/contexts/category-context'
import { SidebarProvider } from '@/contexts/sidebar-context';
import {FilterProvider} from "@/contexts/filter-context"

const Providers = ({children}: {children:ReactNode}) => {
  return (
    <SidebarProvider>
      <FilterProvider>
        <CategoryProvider>{children}</CategoryProvider>
      </FilterProvider>
    </SidebarProvider>
  );
}

export default Providers