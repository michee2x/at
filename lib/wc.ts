export async function fetchWCProductsServer(params: Record<string, any>) {
  const base = process.env.WC_BASE_URL;
  const key = process.env.WC_CONSUMER_KEY;
  const secret = process.env.WC_CONSUMER_SECRET;
  if (!base || !key || !secret) throw new Error('WooCommerce credentials not configured');

  // Map our friendly params to WooCommerce REST v3 query params
  const map: Record<string, any> = {};
  if (params.cat) map['category'] = params.cat;
  if (params.page) map['page'] = params.page;
  if (params.per_page) map['per_page'] = params.per_page;
  if (params.min_price) map['min_price'] = params.min_price;
  if (params.max_price) map['max_price'] = params.max_price;
  if (params.in_stock !== undefined) map['stock_status'] = params.in_stock === 'true' ? 'instock' : undefined;
  if (params.q) map['search'] = params.q;
  // Attributes: attr_Color=Gold => filter by attribute
  Object.keys(params).forEach((k) => {
    if (k.startsWith('attr_')) {
      const name = k.replace('attr_', '');
      // Assuming attribute taxonomies are available and mapped; WooCommerce expects attribute term IDs or slug
      map[`attribute`] = name;
      map[`attribute_term`] = params[k];
    }
  });

  // sorting
  if (params.sort) {
    switch (params.sort) {
      case 'price_asc':
        map['orderby'] = 'price';
        map['order'] = 'asc';
        break;
      case 'price_desc':
        map['orderby'] = 'price';
        map['order'] = 'desc';
        break;
      case 'latest':
        map['orderby'] = 'date';
        map['order'] = 'desc';
        break;
      case 'rating':
        map['orderby'] = 'rating';
        map['order'] = 'desc';
        break;
      default:
        map['orderby'] = 'popularity';
    }
  }

  // Build url
  const url = new URL('/wp-json/wc/v3/products', base);
  Object.entries({ ...map, consumer_key: key, consumer_secret: secret }).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, String(v));
  });

  const res = await fetch(url.toString(), { cache: 'no-store' });
  if (!res.ok) throw new Error('WC fetch failed');
  const data = await res.json();

  // WooCommerce provides totals in headers for pagination
  const total = Number(res.headers.get('X-WP-Total') || 0);
  const totalPages = Number(res.headers.get('X-WP-TotalPages') || 1);

  return { products: data, total, totalPages };
}