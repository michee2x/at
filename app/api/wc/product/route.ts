import { QueryParams } from "@/types";
import { NextResponse } from "next/server";
import { fetchDokanProducts, fetchWCProducts } from "@/lib/product-service";

// -----------------------------
// App Router GET handler
// -----------------------------
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const params = Object.fromEntries(searchParams.entries()) as QueryParams;
    const { store, domain, vendor } = params;

    const useDokan = domain === "dokan" || (store && store !== "none") || !!vendor;
    console.log("\n\n\n\n\n\n👉 Using Dokan?", useDokan, "Domain:", domain, "params", params, "\n\n\n\n\n");

    if (vendor && useDokan) {
      if (!params.store) {
          params.store = vendor; 
      }
    }

    const result = useDokan
      ? await fetchDokanProducts(params)
      : await fetchWCProducts(params);

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (err) {
    const error = err instanceof Error ? err : new Error("Unknown error");
    console.error("API Error:", error);
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}
