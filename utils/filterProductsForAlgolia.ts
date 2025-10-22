type Product = {
  objectID: number;
  name: string;
  slug: string;
  permalink: string;
  description?: string;
  short_description?: string;
  price: number;
  regular_price?: number;
  sale_price?: number | null;
  on_sale?: boolean;
  average_rating?: number;
  rating_count?: number;
  categories?: string[];
  brands?: string[];
  image?: string;
  stock_status?: string;
  date_created?: string;
};

type CleanedProduct = {
  objectID: number;
  name: string;
  slug: string;
  price: number;
  image?: string;
  categories?: string[];
  brands?: string[];
  average_rating?: number;
  description?: string;
  permalink: string;
  stock_status?: string;
  date_created?: string;
};

export const cleanProducts = (data: Product[]): CleanedProduct[] => {
  return data.map((item) => ({
    objectID: item.objectID,
    name: item.name,
    slug: item.slug,
    price: item.price,
    image: item.image,
    categories: item.categories,
    brands: item.brands,
    average_rating: item.average_rating,
    description: item.short_description || item.description,
    permalink: item.permalink,
    stock_status: item.stock_status,
    date_created: item.date_created,
  }));
};
