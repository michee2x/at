"use client";
import React, { ReactNode } from 'react'
import { CategoryProvider } from '@/contexts/category-context'
import { SidebarProvider } from '@/contexts/sidebar-context';

const Providers = ({children}: {children:ReactNode}) => {
  return (
    <SidebarProvider>
      <CategoryProvider>{children}</CategoryProvider>
    </SidebarProvider>
  );
}

export default Providers