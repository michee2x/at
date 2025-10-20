import { NextResponse } from "next/server";

const siteUrl = "https://atlaze.com";
const consumerKey = process.env.WC_CONSUMER_KEY!;
const consumerSecret = process.env.WC_CONSUMER_SECRET!;

const WC_ALLOWED_TYPES = new Set(["simple", "grouped", "external", "variable"]);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const url = new URL(`${siteUrl}/wp-json/wc/v3/products`);
    url.searchParams.append("consumer_key", consumerKey);
    url.searchParams.append("consumer_secret", consumerSecret);

    // Default per_page
    url.searchParams.append("per_page", searchParams.get("per_page") ?? "10");

    // Convert all query params dynamically
    for (const [key, value] of searchParams.entries()) {
      if (!value || ["per_page"].includes(key)) continue; // already handled

      const k = key.toLowerCase();
      const v = value.toLowerCase();

      // --- Custom logic for specific filters ---
      switch (k) {
        // Handle price range, e.g. "₦5,000 to ₦10,000"
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

        // Brand → attribute filter
        case "brand":
        case "brands": {
          url.searchParams.append("attribute", "pa_brand");
          url.searchParams.append("attribute_term", v);
          break;
        }

        // Item condition
        case "condition":
        case "item condition": {
          url.searchParams.append("attribute", "pa_condition");
          url.searchParams.append("attribute_term", v);
          break;
        }

        // Delivery day
        case "delivery":
        case "delivery day": {
          url.searchParams.append("attribute", "pa_delivery");
          url.searchParams.append(
            "attribute_term",
            v.replace(/\s+/g, "-")
          );
          break;
        }

        // Pay on delivery
        case "pay on delivery": {
          url.searchParams.append("attribute", "pa_payment");
          url.searchParams.append("attribute_term", "pay-on-delivery");
          break;
        }

        // Discount / deals
        case "discount":
        case "deals":
        case "deals & discount": {
          if (v.includes("discount")) url.searchParams.append("on_sale", "true");
          break;
        }

        // Product type (simple, variable, etc.)
        case "type": {
          if (WC_ALLOWED_TYPES.has(v)) {
            url.searchParams.append("type", v);
          } else if (v === "downloadable") {
            url.searchParams.append("downloadable", "true");
          }
          break;
        }

        // Known WooCommerce parameters (pass directly)
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

        // --- Default fallback ---
        default: {
          // Dynamically forward *any unknown query param*
          url.searchParams.append(k, value);
          break;
        }
      }
    }

    console.log("👉 Forwarding to WooCommerce:", url.toString());

    const response = await fetch(url.toString(), { cache: "no-store" });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`WooCommerce error: ${text}`);
    }

    const products = await response.json();
    return NextResponse.json(products);
  } catch (err) {
    console.error("❌ Error in /api/products:", err);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
