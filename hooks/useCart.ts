import { WordPressCartAPI } from '@/lib/wordpress-cart';
import { Cart, WooProductToCartItem } from '@/types';
import { toNumber } from '@/utils/to-number';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartStore {
  cart: Cart;
  userId: number | null;
  authToken: string | null;
  isLoading: boolean;

  itemToDelete: WooProductToCartItem | null;

  setItemToDelete: (itemId: WooProductToCartItem | null) => void;

  setUser: (userId: number, authToken: string) => void;
  loadCart: () => Promise<void>;
  addItem: (item: WooProductToCartItem) => Promise<boolean | undefined>;
  removeItem: (itemId: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  syncCart: () => Promise<void>;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: { items: [], total: 0 },
      userId: null,
      authToken: null,
      isLoading: false,

      itemToDelete: null,

      setItemToDelete: (item) => set({ itemToDelete: item }),

      setUser: (userId, authToken) => {
        set({ userId, authToken });
      },

      loadCart: async () => {
        const { userId, authToken } = get();

        if (!userId || !authToken) {
          return;
        }

        set({ isLoading: true });

        try {
          const guestCart = get().cart;

          const userCart = await WordPressCartAPI.getUserCart(userId, authToken);

          if (guestCart.items.length > 0) {
            const mergedCart = await WordPressCartAPI.mergeGuestCart(
              userId,
              guestCart,
              authToken
            );
            set({ cart: mergedCart });
          } else {
            set({ cart: userCart });
          }
        } catch (error) {
          console.error('Error loading cart:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      addItem: async (item) => {
        const { cart, userId, authToken } = get();

        const existingIndex = cart.items.findIndex(i => i.id === item.id);
        let newItems;

        if (existingIndex >= 0) {
          newItems = [...cart.items];
          newItems[existingIndex].quantity += item.quantity;
        } else {
          newItems = [...cart.items, item];
        }

        // FIXED: correct total calculation
        const total = newItems.reduce(
          (sum, i) => sum + (toNumber(i.price) * i.quantity),
          0
        );

        const newCart = { items: newItems, total };

        set({ cart: newCart });

        if (userId && authToken) {
          const result = await WordPressCartAPI.updateUserCart(userId, newCart, authToken);
          return result;
        }
      },

      removeItem: async (itemId) => {
        const { cart, userId, authToken } = get();

        const newItems = cart.items.filter(i => i.id !== itemId);
        const total = newItems.reduce((sum, i) => sum + (toNumber(i.price) * i.quantity), 0);
        const newCart = { items: newItems, total };

        set({ cart: newCart });

        if (userId && authToken) {
          await WordPressCartAPI.updateUserCart(userId, newCart, authToken);
        }
      },

      updateQuantity: async (itemId, quantity) => {
        const { cart, userId, authToken } = get();

        const newItems = cart.items.map(i =>
          i.id === itemId ? { ...i, quantity } : i
        );

        const total = newItems.reduce((sum, i) => sum + (toNumber(i.price) * i.quantity), 0);
        const newCart = { items: newItems, total };

        set({ cart: newCart });

        if (userId && authToken) {
          await WordPressCartAPI.updateUserCart(userId, newCart, authToken);
        }
      },

      clearCart: async () => {
        const { userId, authToken } = get();

        set({ cart: { items: [], total: 0 } });

        if (userId && authToken) {
          await WordPressCartAPI.clearCart(userId, authToken);
        }
      },

      syncCart: async () => {
        const { cart, userId, authToken } = get();

        if (userId && authToken) {
          await WordPressCartAPI.updateUserCart(userId, cart, authToken);
        }
      },
    }),
    {
      name: 'atlaze-cart-storage',
      partialize: (state) => ({ 
        cart: state.userId ? { items: [], total: 0 } : state.cart,
      }),
    }
  )
);
