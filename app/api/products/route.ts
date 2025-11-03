import { NextResponse } from "next/server";

const siteUrl = "https://atlaze.com";
const consumerKey = process.env.WC_CONSUMER_KEY!;
const consumerSecret = process.env.WC_CONSUMER_SECRET!;

const WC_ALLOWED_TYPES = new Set(["simple", "grouped", "external", "variable"]);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
3
    // Base WooCommerce products endpoint
    const url = new URL(`${siteUrl}/wp-json/wc/v3/products`);
    url.searchParams.append("consumer_key", consumerKey);
    url.searchParams.append("consumer_secret", consumerSecret);

    // Default items per page
    url.searchParams.append("per_page", searchParams.get("per_page") ?? "10");

    for (const [key, value] of searchParams.entries()) {
      if (!value || key === "per_page") continue;

      const k = key.toLowerCase();
      const v = value.toLowerCase();

      switch (k) {
        // Price range filter (e.g., "₦5,000 to ₦10,000")
        case "price": {
          const match = value.match(/(\d[\d,]*)\D+(\d[\d,]*)/);
          if (match) {
            const min = match[1].replace(/,/g, "");
            const max = match[2].replace(/,/g, "");
            url.searchParams.append("min_price", min);
            url.searchParams.append("max_price", max);
          }
          break;
        }

        // Brand filter (new)
        case "brand":
        case "brands": {
          // WooCommerce now supports brand=<id> directly
          url.searchParams.append("brand", v);
          break;
        }

        // Item condition
        case "condition":
        case "item condition": {
          url.searchParams.append("attribute", "pa_condition");
          url.searchParams.append("attribute_term", v);
          break;
        }

        // Delivery Day
        case "delivery":
        case "delivery day": {
          url.searchParams.append("attribute", "pa_delivery");
          url.searchParams.append("attribute_term", v.replace(/\s+/g, "-"));
          break;
        }

        // Pay on Delivery
        case "pay on delivery": {
          url.searchParams.append("attribute", "pa_payment");
          url.searchParams.append("attribute_term", "pay-on-delivery");
          break;
        }

        // Deals & Discounts
        case "discount":
        case "deals":
        case "deals & discount": {
          if (v.includes("discount") || v.includes("deal")) {
            url.searchParams.append("on_sale", "true");
          }
          break;
        }

        // Product Type
        case "type": {
          if (WC_ALLOWED_TYPES.has(v)) {
            url.searchParams.append("type", v);
          } else if (v === "downloadable") {
            url.searchParams.append("downloadable", "true");
          }
          break;
        }

        // Native WooCommerce parameters (pass directly)
        case "page":
        case "search":
        case "category":
        case "tag":
        case "sku":
        case "featured":
        case "stock_status":
        case "orderby":
        case "order":
        case "status":
        case "downloadable": {
          url.searchParams.append(k, value);
          break;
        }

        // Fallback: forward unknown keys safely
        default: {
          url.searchParams.append(k, value);
          break;
        }
      }
    }

    console.log("Forwarding to WooCommerce:", url.toString());

    const response = await fetch(url.toString(), { cache: "no-store" });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`WooCommerce error: ${text}`);
    }

    const products = await response.json();

    return NextResponse.json(products);
  } catch (err) {
    console.error("Error in /api/products:", err);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
