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

// Main Product
export interface WooProduct {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  date_created: string;
  date_created_gmt: string;
  date_modified: string;
  date_modified_gmt: string;
  type: string;
  status: string;
  featured: boolean;
  catalog_visibility: string;
  description: string;
  short_description: string;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  date_on_sale_from: string | null;
  date_on_sale_from_gmt: string | null;
  date_on_sale_to: string | null;
  date_on_sale_to_gmt: string | null;
  on_sale: boolean;
  purchasable: boolean;
  total_sales: number;
  virtual: boolean;
  downloadable: boolean;
  downloads: WooDownload[];
  download_limit: number;
  download_expiry: number;
  external_url: string;
  button_text: string;
  tax_status: string;
  tax_class: string;
  manage_stock: boolean;
  stock_quantity: number | null;
  backorders: string;
  backorders_allowed: boolean;
  backordered: boolean;
  low_stock_amount: number | null;
  sold_individually: boolean;
  weight: string;
  dimensions: WooProductDimensions;
  shipping_required: boolean;
  shipping_taxable: boolean;
  shipping_class: string;
  shipping_class_id: number;
  reviews_allowed: boolean;
  average_rating: string;
  rating_count: number;
  upsell_ids: number[];
  cross_sell_ids: number[];
  parent_id: number;
  purchase_note: string;
  categories: WooProductCategory[];
  brands: WooTerm[];
  tags: WooTerm[];
  images: WooProductImage[];
  attributes: WooProductAttribute[];
  default_attributes: WooProductDefaultAttribute[];
  variations: number[];
  grouped_products: number[];
  menu_order: number;
  price_html: string;
  related_ids: number[];
  meta_data: WooMetaData[];
  stock_status: string;
  has_options: boolean;
  post_password: string;
  global_unique_id: string;
  _links: WooProductLinks;
}
