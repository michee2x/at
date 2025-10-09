"use client";
import React, { ReactNode } from 'react'
import { CategoryProvider } from '@/contexts/category-context'

const Providers = ({children}: {children:ReactNode}) => {
  return (
    <CategoryProvider>
        {children}
    </CategoryProvider>
  )
}

export default Providers