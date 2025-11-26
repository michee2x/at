import { WooProduct } from "@/types";

export type CartProducts = WooProduct & { quantity: number };

// ---------------------
// Guest cart manager
// ---------------------
export class GuestCart {
  cart: CartProducts[] = [];

  constructor() {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("cart");
      if (stored) this.cart = JSON.parse(stored);
    }
  }

  private sync() {
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(this.cart));
    }
  }

  add(item: CartProducts) {
    const existing = this.cart.find((i) => i.slug === item.slug);
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      this.cart.push(item);
    }
    this.sync();
    this.emitToast(item);
  }

  remove(slug: string) {
    this.cart = this.cart.filter((i) => i.slug !== slug);
    this.sync();
  }

  clear() {
    this.cart = [];
    this.sync();
  }

  private emitToast(item: CartProducts) {
    if (typeof window !== "undefined") {
      const payload = {
        slug: item.slug,
        name: item.name,
        price: Number(item.price),
        quantity: item.quantity,
        image: item.images?.[0]?.src || null,
        time: Date.now(),
      };
      window.dispatchEvent(new CustomEvent("cart:add", { detail: payload }));
    }
  }

  getItems() {
    return this.cart;
  }
}

// ---------------------
// Logged-in user cart manager
// ---------------------
export class UserCart {
  cart: CartProducts[] = [];
  userId: string;

  constructor(userId: string, localCart: CartProducts[]) {
    this.userId = userId;
    this.cart = [];
    this.merge(localCart); // merge localStorage cart into server cart
  }

  private async fetchServerCart(): Promise<CartProducts[]> {
    const res = await fetch("/api/cart/user-cart", {
      method: "GET",
      headers: { "User-Id": this.userId },
    });
    const data = await res.json();
    return data.items || [];
  }

  private async saveServerCart() {
    await fetch("/api/cart/user-cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: Number(this.userId), items: this.cart }),
    });
  }

  async merge(localCart: CartProducts[]) {
    const serverCart = await this.fetchServerCart();

    const mergedMap = new Map<string, CartProducts>();

    // Add server items
    serverCart.forEach((i: CartProducts) => mergedMap.set(i.slug, i));

    // Merge local items
    localCart.forEach((i) => {
      if (mergedMap.has(i.slug)) {
        mergedMap.get(i.slug)!.quantity += i.quantity;
      } else {
        mergedMap.set(i.slug, i);
      }
    });

    this.cart = Array.from(mergedMap.values());

    await this.saveServerCart();

    // clear localStorage
    if (typeof window !== "undefined") localStorage.removeItem("cart");
  }

  async add(item: CartProducts) {
    const existing = this.cart.find((i) => i.slug === item.slug);
    if (existing) existing.quantity += item.quantity;
    else this.cart.push(item);
    await this.saveServerCart();
  }

  async remove(slug: string) {
    this.cart = this.cart.filter((i) => i.slug !== slug);
    await this.saveServerCart();
  }

  async clear() {
    this.cart = [];
    await this.saveServerCart();
  }

  getItems() {
    return this.cart;
  }
}
