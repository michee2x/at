import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Fetch WooCommerce products securely from server.
 */
export async function fetchWCProductsServer(params: Record<string, any>) {
  const base = process.env.WC_BASE_URL;
  const key = process.env.WC_CONSUMER_KEY;
  const secret = process.env.WC_CONSUMER_SECRET;

  if (!base || !key || !secret) {
    throw new Error("WooCommerce credentials not configured");
  }

  // ✅ Map our friendly params → WooCommerce REST params
  const query: Record<string, string> = {};

  if (params.cat) query["category"] = String(params.cat);
  if (params.page) query["page"] = String(params.page);
  query["per_page"] = params.per_page ? String(params.per_page) : "12";

  if (params.min_price) query["min_price"] = String(params.min_price);
  if (params.max_price) query["max_price"] = String(params.max_price);

  if (params.in_stock !== undefined)
    query["stock_status"] = params.in_stock === "true" ? "instock" : "outofstock";

  if (params.q) query["search"] = String(params.q);

  // 🧩 Handle attribute filters (attr_color=Gold)
  for (const key of Object.keys(params)) {
    if (key.startsWith("attr_")) {
      const attr = key.replace("attr_", "");
      query["attribute"] = attr;
      query["attribute_term"] = String(params[key]);
    }
  }

  // ⚙️ Sorting
  switch (params.sort) {
    case "price_asc":
      query["orderby"] = "price";
      query["order"] = "asc";
      break;
    case "price_desc":
      query["orderby"] = "price";
      query["order"] = "desc";
      break;
    case "latest":
      query["orderby"] = "date";
      query["order"] = "desc";
      break;
    case "rating":
      query["orderby"] = "rating";
      query["order"] = "desc";
      break;
    default:
      query["orderby"] = "popularity";
  }

  // 🧱 Build REST URL
  const url = new URL("/wp-json/wc/v3/products", base);

  Object.entries({
    ...query,
    consumer_key: key,
    consumer_secret: secret,
  }).forEach(([k, v]) => {
    if (v) url.searchParams.set(k, v);
  });

  // 🔐 Fetch from WooCommerce
  const res = await fetch(url.toString(), {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("WooCommerce fetch failed:", text);
    throw new Error(`WooCommerce fetch failed: ${res.status}`);
  }

  const data = await res.json();

  // WooCommerce pagination headers
  const total = Number(res.headers.get("X-WP-Total") ?? 0);
  const totalPages = Number(res.headers.get("X-WP-TotalPages") ?? 1);

  return { products: data, total, totalPages };
}

/**
 * Next.js API handler
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const result = await fetchWCProductsServer(req.query);
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
    res.status(200).json(result);
  } catch (err: any) {
    console.error("API Error:", err);
    res.status(500).json({ error: err.message || "Server error" });
  }
}
