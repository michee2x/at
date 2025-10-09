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
  } catch (err: any) {
    console.error('Error fetching products:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
