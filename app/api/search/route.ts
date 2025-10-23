import { NextResponse } from "next/server";
import { algoliasearch } from "algoliasearch";

const client = algoliasearch(
  process.env.ALGOLIA_APP_ID!,
  process.env.ALGOLIA_API_KEY!
);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") || "";

  try {
    const results = await client.searchSingleIndex({
      indexName: "AT",
      searchParams: {
        query,
        hitsPerPage: 10,
      },
    });

    return NextResponse.json(results);
  } catch (error) {
    console.error("Algolia search error:", error);
    return NextResponse.json({ hits: [] }, { status: 500 });
  }
}
