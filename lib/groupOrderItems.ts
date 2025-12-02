// lib/groupOrderItems.ts
import { WooOrderItem } from "./user/types";

export function groupOrderItems(items: WooOrderItem[]) {
  const grouped: Record<string, WooOrderItem[]> = {};

  items.forEach((item) => {
    if (!grouped[item.name]) grouped[item.name] = [];
    grouped[item.name].push(item);
  });

  return grouped;
}
