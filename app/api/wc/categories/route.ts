import { NextResponse } from "next/server";

export async function GET(req: Request) {
const {searchParams} = new URL(req.url);
const {parent} = Object.fromEntries(searchParams.entries());
// if(parent === "0"){
// console.log("REQUESET IS MADEEEEEEEEEEEEEEEEEEEEEEEEEE TO:")
//   console.log("\n\n\n\n\n\n\n\n\n\n\n\n\n\nREQUESET IS MADEEEEEEEEEEEEEEEEEEEEEEEEEE TO:", parent,"\n\n\n\n\n\n\n\n\n\n\n\n\n\n");
// }
  const url = `${process.env.WC_API_URL || "https://atlaze.com/"}wp-json/wc/v3/products/categories?parent=${parent}`;

  //https://atlaze.com/wp-json/wc/v3/products/categories?parent=118
  //https://atlaze.com/wp-json/wc/v3/products/categories?per_page=100&parent=47
  const key = process.env.WC_CONSUMER_KEY!;
  const secret = process.env.WC_CONSUMER_SECRET!;

  try {
    const res = await fetch(url, {
      headers: {
        Authorization:
          "Basic " + Buffer.from(`${key}:${secret}`).toString("base64"),
      },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch categories: ${res.statusText}`);
    }

    const categories = await res.json();
    return NextResponse.json(categories);
  } catch (err) {
    const error = err instanceof Error ? err : new Error("Unknown error");
    console.error("API Error:", error);
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}
