"use client";
import React, { ReactNode } from "react";
import { CategoryProvider } from "@/contexts/category-context";
import { SidebarProvider } from "@/contexts/sidebar-context";
import { FilterProvider } from "@/contexts/filter-context";
import { SearchProvider } from "@/contexts/search-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { CartProvider } from "@/contexts/CartContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "@/contexts/auth-context";

const Providers = ({ children }: { children: ReactNode }) => {
  const [client] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={client}>
      <SessionProvider>
        <AuthProvider>
          <SidebarProvider>
            <FilterProvider>
              <SearchProvider>
                <CartProvider>
                  <CategoryProvider>{children}</CategoryProvider>

                  <ToastContainer
                    position="top-right"
                    autoClose={4000}
                    hideProgressBar
                    newestOnTop
                    closeOnClick
                    draggable
                    pauseOnHover
                    theme="light"
                  />
                </CartProvider>
              </SearchProvider>
            </FilterProvider>
          </SidebarProvider>
        </AuthProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
};

export default Providers;

//http://localhost:3000/category/lec?cat=352&title=Jewelry%20%26%20Accessories&opt_level=1&page=1&sort=popular
