// WooCategory type
export interface WooCategory {
  id: number;
  name: string;
  slug: string;
  parent: number;
  description: string;
  display: string;
  image: {
    id: number;
    date_created: string;
    date_created_gmt: string;
    date_modified: string;
    date_modified_gmt: string;
    src: string;
    name: string;
    alt: string;
  } | null;
  menu_order: number;
  count: number;
  _links: {
    self: Array<{
      href: string;
      targetHints?: {
        allow: string[];
      };
    }>;
    collection: Array<{
      href: string;
    }>;
  };
}

// Product Category
export interface WooProductCategory {
  id: number;
  name: string;
  slug: string;
}

// Product Image
export interface WooProductImage {
  id: number;
  date_created: string;
  date_created_gmt: string;
  date_modified: string;
  date_modified_gmt: string;
  src: string;
  name: string;
  alt: string;
  srcset?: string;
  sizes?: string;
  thumbnail?: string;
}

// Dimensions
export interface WooProductDimensions {
  length: string;
  width: string;
  height: string;
}

// Links
export interface WooProductLinks {
  self: Array<{
    href: string;
    targetHints?: { allow: string[] };
  }>;
  collection: Array<{
    href: string;
  }>;
}

// Params
export type ParamValue = string | number | boolean | undefined;
export type Params = Record<string, ParamValue>;

// Downloadable Item
export interface WooDownload {
  id: string;
  name: string;
  file: string;
}

export interface QueryParams {
  cat?: string | number;
  page?: string | number;
  per_page?: string | number;
  min_price?: string | number;
  max_price?: string | number;
  in_stock?: string | boolean;
  q?: string;
  brand_id?: string | number;
  sort?: string;
  store?: string;
  domain?: string;
  [key: string]: string | number | boolean | undefined; // allow attr_* and custom keys
}

// Attribute
export interface WooProductAttribute {
  id: number;
  name: string;
  position: number;
  visible: boolean;
  variation: boolean;
  options: string[];
}

// Default Attribute
export interface WooProductDefaultAttribute {
  id: number;
  name: string;
  option: string;
}

// Meta Data
export interface WooMetaData {
  id: number;
  key: string;
  value: string | number | boolean | null;
}

// Brand or Tag (generic taxonomy)
export interface WooTerm {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

export type WooProductMetaValue =
  | string
  | number
  | WooMinMaxMeta
  | WooWholesaleMeta
  | number[];

export interface WooMinMaxMeta {
  min_quantity: string;
  max_quantity: string;
}

export interface WooWholesaleMeta {
  enable_wholesale: string;
  price: string;
  quantity: string;
}

export interface WooProductMeta {
  id?: number;
  key: string;
  value: WooProductMetaValue;
}


// Main Product
export interface WooProduct {
  id: number;
  name: string;
  slug: string;
  permalink?: string;
  description: string;
  short_description?: string;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  categories: WooProductCategory[];
  brands: WooTerm[];
  tags: WooTerm[];
  images: WooProductImage[];
  rating_count: number;
  average_rating?: string;      // added for rating display
  total_sales?: number;        // added for "purchased" count
  stock_status?: "instock" | "outofstock" | "onbackorder"; // added
  meta_data?: WooProductMeta[]; // for video thumbnails etc
  related_ids: number[];
}




export interface Cart {
  items: WooProductToCartItem[];
  total: number;
  updatedAt?: string;
}

export type WooProductToCartItem = Pick<
  WooProduct,
  | 'id'
  | 'name'
  | 'slug'
  | 'price'
  | 'images'
  | "short_description"
  // add whatever you actually need
> & {
  quantity: number;
};

export type Customer = {
  id: number;
  email: string;
  username: string;
  role: string;

  first_name?: string;
  last_name?: string;

  billing: {
    first_name: string;
    last_name: string;
    address_1: string;
    address_2: string;
    city: string;
    phone: string;
    email: string;
    state?: string;
    postcode?: string;
    country?: string;
    company?: string;
  };

  shipping: {
    first_name: string;
    last_name: string;
    address_1: string;
    address_2: string;
    city: string;
    phone: string;
    state?: string;
    postcode?: string;
    country?: string;
    company?: string;
  };

  avatar_url: string;

  meta_data?: Array<{
    id: number;
    key: string;
    value: string;
  }>;
};
