import { NextResponse } from "next/server";

/**
 * 🧩 Shared helper to map params → REST API format
 */
function buildQueryParams(params: Record<string, any>): Record<string, string> {
  const query: Record<string, string> = {};

  if (params.cat) query["category"] = String(params.cat);
  if (params.page) query["page"] = String(params.page);
  query["per_page"] = params.per_page ? String(params.per_page) : "12";

  if (params.min_price) query["min_price"] = String(params.min_price);
  if (params.max_price) query["max_price"] = String(params.max_price);

  if (params.in_stock !== undefined)
    query["stock_status"] = params.in_stock === "true" ? "instock" : "outofstock";

  if (params.q) query["search"] = String(params.q);
  if (params.brand_id) query["brand"] = String(params.brand_id);

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

  return query;
}

/**
 * 🏪 Fetch WooCommerce products
 */
async function fetchWCProducts(params: Record<string, any>) {
  const base = process.env.WC_BASE_URL!;
  const key = process.env.WC_CONSUMER_KEY!;
  const secret = process.env.WC_CONSUMER_SECRET!;

  const query = buildQueryParams(params);
  const url = new URL("/wp-json/wc/v3/products", base);

  Object.entries({ ...query, consumer_key: key, consumer_secret: secret }).forEach(
    ([k, v]) => url.searchParams.set(k, v)
  );

  const res = await fetch(url.toString(), {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (!res.ok) throw new Error(`WooCommerce fetch failed (${res.status})`);
  const data = await res.json();

  return {
    products: data,
    total: Number(res.headers.get("X-WP-Total") ?? 0),
    totalPages: Number(res.headers.get("X-WP-TotalPages") ?? 1),
  };
}

/**
 * 👨‍🍳 Fetch Dokan vendor products
 */
async function fetchDokanProducts(params: Record<string, any>) {
  const base = process.env.WC_BASE_URL!;
  const store = params.store;
  if (!store) throw new Error("Missing store ID for Dokan fetch");

  const query = buildQueryParams(params);
  const url = new URL(`/wp-json/dokan/v1/stores/${store}/products`, base);

  Object.entries(query).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString(), {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (!res.ok) throw new Error(`Dokan fetch failed (${res.status})`);
  const data = await res.json();

  // Dokan may not return total headers, so we fake them
  return {
    products: data,
    total: Array.isArray(data) ? data.length : 0,
    totalPages: 1,
  };
}

/**
 * 🌐 App Router GET handler
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const params = Object.fromEntries(searchParams.entries());
    const { store, domain } = params;

    const useDokan = domain === "dokan" || (store && store !== "none");
    console.log("👉 Using Dokan?", useDokan, "Domain:", domain);

    const result = useDokan
      ? await fetchDokanProducts(params)
      : await fetchWCProducts(params);

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (err: any) {
    console.error("API Error:", err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
