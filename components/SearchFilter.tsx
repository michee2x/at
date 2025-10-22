"use client"

import React, { useState } from 'react'
import AlgoliaSearch from './AlgoliaSearch'
import { useFilter } from '@/contexts/filter-context';

const SearchFilter = () => {
    const {showAlgoliaSearch} = useFilter()
  return (
    <div className={`w-screen lg:hidden flex justify-center ${showAlgoliaSearch ? "block" : "hidden"} fixed z-[9999] inset-0 pt-6 h-screen bg-white`}>
      <AlgoliaSearch />
    </div>
  );
}

export default SearchFilter