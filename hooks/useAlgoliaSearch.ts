import { useEffect, useState, useRef } from 'react';

interface UseAlgoliaSearchResult<T> {
  products: T[];
  loading: boolean;
  error: Error | null;
  hasSearched: boolean; // NEW: tracks if we've attempted a search
}

function useAlgoliaSearch<T = any>(query: string): UseAlgoliaSearchResult<T> {
  const [products, setProducts] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const hasSearchedRef = useRef(false); // To avoid stale closure issues

  useEffect(() => {
    let cancelled = false;

    async function fetchProducts() {
      const trimmedQuery = query.trim();

      // If query is empty, clear results but don't show "no results" yet
      if (!trimmedQuery) {
        if (!cancelled) {
          setProducts([]);
          setError(null);
          setHasSearched(false);
          hasSearchedRef.current = false;
        }
        return;
      }

      if (!cancelled) {
        setLoading(true);
        setHasSearched(false); // Reset until request finishes
      }

      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(trimmedQuery)}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        if (!cancelled) {
          setProducts(data.hits || []);
          setError(null);
          setHasSearched(true);
          hasSearchedRef.current = true;
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error('An error occurred'));
          setProducts([]);
          setHasSearched(true);
          hasSearchedRef.current = true;
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchProducts();

    return () => {
      cancelled = true;
    };
  }, [query]);

  return { products, loading, error, hasSearched };
}

export default useAlgoliaSearch;