import { NextResponse } from 'next/server';

const siteUrl = 'https://atlaze.com';
const consumerKey = process.env.WC_CONSUMER_KEY!;
const consumerSecret = process.env.WC_CONSUMER_SECRET!;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const category = searchParams.get('category') || '';
    const perPage = searchParams.get('per_page') || '5';
    const search = searchParams.get('search') || '';

    // Build WooCommerce API URL
    const url = new URL(`${siteUrl}/wp-json/wc/v3/products`);
    url.searchParams.append('consumer_key', consumerKey);
    url.searchParams.append('consumer_secret', consumerSecret);
    url.searchParams.append('per_page', perPage);

    if (category) url.searchParams.append('category', category);
    if (search) url.searchParams.append('search', search);

    const response = await fetch(url.toString(), { cache: 'no-store' });
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    const products = await response.json();

    return NextResponse.json(products);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching categories:", error.message);
    } else if (typeof error === "object" && error !== null && "response" in error) {
      // This handles WooCommerce API errors that contain response data
      console.error("Error fetching categories:", (error as { response?: { data?: unknown } }).response?.data);
    } else {
      console.error("Unknown error fetching categories:", error);
    }

    return Response.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}
