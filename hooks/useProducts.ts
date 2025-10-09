'use client';
import { WooProduct } from '@/types';
import { useEffect, useState } from 'react';


interface UseProductsOptions {
  /** Category ID (numeric). Use the numeric ID, e.g. 22 */
  category?: number;
  perPage?: number;
  search?: string;
  page?: number;
  orderby?: string;
  order?: 'asc' | 'desc';
}

export function useProducts({
  category,
  perPage = 5,
  search = '',
  page = 1,
  orderby,
  order,
}: UseProductsOptions = {}) {
  const [products, setProducts] = useState<WooProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchProducts() {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        params.append('per_page', perPage.toString());
        if (category !== undefined && category !== null) {
          params.append('category', String(category)); // category ID
        }
        if (search) params.append('search', search);
        if (page && page > 1) params.append('page', String(page));
        if (orderby) params.append('orderby', orderby);
        if (order) params.append('order', order);

        const res = await fetch(`/api/products?${params.toString()}`);
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || res.statusText || 'Failed to fetch products');
        }

        const data: WooProduct[] = await res.json();
        if (!mounted) return;
        setProducts(data);
      } catch (err: any) {
        if (!mounted) return;
        setError(err.message || 'Unknown error');
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    }

    fetchProducts();

    return () => {
      mounted = false;
    };
  }, [category, perPage, search, page, orderby, order]);

  return { products, loading, error };
}
