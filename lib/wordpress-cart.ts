import { Cart } from "@/types";
import { toNumber } from "@/utils/to-number";

// lib/wordpress-cart.ts
const WORDPRESS_URL = 'https://atlaze.com';


// Cart API functions
export class WordPressCartAPI {
  
  /**
   * Get user's cart from WordPress
   */
  static async getUserCart(userId: number, authToken: string): Promise<Cart> {
    try {
      const response = await fetch(
        `${WORDPRESS_URL}/wp-json/atlaze/v1/user-cart/${userId}`,
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
          cache: 'no-store', // Always get fresh data
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch cart');
      }

      const data = await response.json();
      const cartData = data.atlaze_user_cart 
        ? JSON.parse(data.atlaze_user_cart) 
        : { items: [], total: 0 };

      return cartData;
    } catch (error) {
      console.error('Error fetching cart:', error);
      return { items: [], total: 0 };
    }
  }

  /**
   * Update user's cart in WordPress
   */
  static async updateUserCart(
    userId: number, 
    cart: Cart, 
    authToken: string,
    deviceInfo?: string
  ): Promise<boolean> {
    try {
      const response = await fetch(
        `${WORDPRESS_URL}/wp-json/atlaze/v1/user-cart/${userId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            cart_data: JSON.stringify({
              ...cart,
              updatedAt: new Date().toISOString(),
            }),
            device_info: deviceInfo,
          }),
        }
      );

      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Error updating cart:', error);
      return false;
    }
  }

  /**
   * Merge guest cart with user cart after login
   */
  static async mergeGuestCart(
    userId: number,
    guestCart: Cart,
    authToken: string
  ): Promise<Cart> {
    // Get the user's saved cart
    const userCart = await this.getUserCart(userId, authToken);

    // Merge logic: combine items, avoiding duplicates
    const mergedItems = [...userCart.items];
    
    guestCart.items.forEach(guestItem => {
      const existingIndex = mergedItems.findIndex(
        item => item.id === guestItem.id
      );

      if (existingIndex >= 0) {
        // Item exists, increase quantity
        mergedItems[existingIndex].quantity += guestItem.quantity;
      } else {
        // New item, add it
        mergedItems.push(guestItem);
      }
    });

    
    const total = mergedItems.reduce(
      (sum, item) => sum + (toNumber(item.price) * item.quantity), 
      0
    );

    const mergedCart: Cart = {
      items: mergedItems,
      total,
      updatedAt: new Date().toISOString(),
    };

    // Save merged cart to WordPress
    await this.updateUserCart(userId, mergedCart, authToken);

    return mergedCart;
  }

  /**
   * Clear user's cart
   */
  static async clearCart(userId: number, authToken: string): Promise<boolean> {
    try {
      const response = await fetch(
        `${WORDPRESS_URL}/wp-json/atlaze/v1/user-cart/${userId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
        }
      );

      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Error clearing cart:', error);
      return false;
    }
  }
}