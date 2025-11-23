import { getSession } from 'next-auth/react';
import { NextResponse } from 'next/server';
//import { getSession } from 'next-auth/react'; // To get session for logged-in users
import fetch from 'node-fetch';


const WP_URL = process.env.WC_API_URL!;
const WC_KEY = process.env.WC_CONSUMER_KEY!;
const WC_SECRET = process.env.WC_CONSUMER_SECRET!;



export async function GET(req: Request) {
  // Get the user session (check if logged in)
  const session = await getSession();

  if (session) {
    // If logged in, fetch the cart from WooCommerce
    const response = await getWooCommerceCart(session);
    return response;
  } else {
    // If not logged in, WooCommerce will handle the guest cart via session
    return getWooCommerceSessionCart();
  }
}

async function getWooCommerceCart(session: any) {
  const response = await fetch(`${process.env.WC_BASE_URL}/cart`, {
    method: 'GET',
    headers: {
      'Authorization': `Basic ${Buffer.from(`${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`).toString('base64')}`,
      'Content-Type': 'application/json',
      'Cookie': `wordpress_logged_in=${session.user.email}`,
    },
  });

  if (response.ok) {
    const data = await response.json();
    return NextResponse.json({ cart: data });
  } else {
    return NextResponse.json({ message: 'Failed to retrieve WooCommerce cart' }, { status: 400 });
  }
}

// WooCommerce handles the guest cart via session automatically.
async function getWooCommerceSessionCart() {
  const response = await fetch(`${process.env.WC_BASE_URL}/cart`, {
    method: 'GET',
    headers: {
      'Authorization': `Basic ${Buffer.from(`${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`).toString('base64')}`,
      'Content-Type': 'application/json',
    },
  });

  if (response.ok) {
    const data = await response.json();
    return NextResponse.json({ cart: data });
  } else {
    return NextResponse.json({ message: 'Failed to retrieve WooCommerce guest cart' }, { status: 400 });
  }
}





// Handler for adding product to WooCommerce cart
export async function POST(req: Request) {
  const { productId, quantity, session } = await req.json();

  // Validate input
  if (!productId || !quantity) {
    return NextResponse.json(
      { message: "Product ID and quantity are required" },
      { status: 400 }
    );
  }

  try {

    let cartResponse;
    if (session?.user) {
      // User is logged in, add product to logged-in user's cart via WooCommerce API
      const cartData = {
        product_id: productId,
        quantity: quantity,
        user_id: session?.user
      };

      cartResponse = await addToLoggedInUserCart(cartData);
    } else {
      // User is not logged in, use WooCommerce session cart
      cartResponse = await addToSessionCart(productId, quantity);
    }
    console.log("CART STATUS: ", cartResponse.status, session)

    if (cartResponse?.status === 200) {
      return NextResponse.json({ message: "Product added to cart" }, { status: 200 });
    } else {
      return NextResponse.json({ message: "Failed to add product to WooCommerce cart" }, { status: 500 });
    }
  } catch (error) {
    console.error("Error adding to cart:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}

// Add product to logged-in user's cart
async function addToLoggedInUserCart({ product_id, quantity, user_id }: { product_id: number; quantity: number, user_id:string }) {
  const response = await fetch(`${WP_URL}cart/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString("base64")}`,
    },
    body: JSON.stringify({ product_id, quantity, user_id }),
  });
  
    // Read the response text before attempting to parse it as JSON
    const text = await response.text();
    

    // If the response is not JSON, log it for debugging
    if (!response.ok) {
      console.error("Error adding to cart:", text);
      throw new Error(`Failed to add to cart: ${text}`);
    }

    // Try parsing the JSON response
    const data = JSON.parse(text);
    console.log("Product added to cart:", data);

  return response;
}

// Add product to WooCommerce session cart (for guest users)
async function addToSessionCart(productId: number, quantity: number) {
  const response = await fetch(`${WP_URL}cart/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      product_id: productId,
      quantity: quantity,
    }),
  });

  return response;
}
