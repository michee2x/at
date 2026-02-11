import { Cart } from "@/types";
import { toNumber } from "@/utils/to-number";

const WORDPRESS_URL = 'https://api.atlaze.com';

export class WordPressCartAPI {

  static async getUserCart(userId: number, authToken: string): Promise<Cart> {
    try {
      const response = await fetch(
        `${WORDPRESS_URL}/wp-json/atlaze/v1/user-cart/${userId}`,
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
          cache: 'no-store',
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

  static async mergeGuestCart(
    userId: number,
    guestCart: Cart,
    authToken: string
  ): Promise<Cart> {
    if (!guestCart.items.length) return this.getUserCart(userId, authToken);

    const userCart = await this.getUserCart(userId, authToken);
    const mergedItems = [...userCart.items];

    guestCart.items.forEach(guestItem => {
      const existing = mergedItems.find(item => item.id === guestItem.id);
      if (!existing) {
        mergedItems.push(guestItem);
      }
      // Do not add quantities if already exists
    });

    const total = mergedItems.reduce(
      (sum, item) => sum + toNumber(item.price) * item.quantity,
      0
    );

    const mergedCart: Cart = {
      items: mergedItems,
      total,
      updatedAt: new Date().toISOString(),
    };

    await this.updateUserCart(userId, mergedCart, authToken);
    localStorage.removeItem('atlaze-cart-storage');

    return mergedCart;
  }


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
