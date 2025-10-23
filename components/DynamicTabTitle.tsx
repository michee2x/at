import { Metadata } from "next";

interface SearchPageProps {
  searchParams: { q?: string };
}

export function generateMetadata({ searchParams }: SearchPageProps): Metadata {
  const query = searchParams.q || "Products";
  return {
    title: `Search results for "${query}" | Atlaze`,
    description: `Find the best deals for ${query} on Atlaze.`,
  };
}
