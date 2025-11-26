/* eslint-disable */

// helpers/utils.ts
export function generateRandomPassword(): string {
return Math.random().toString(36).slice(-8);
}


export function mergeCartItems(a: Array<any>, b: Array<any>): Array<any> {
const map = new Map<number, any>();
for (const item of a) {
const id = Number(item.product_id);
map.set(id, { ...item });
}
for (const item of b) {
const id = Number(item.product_id);
if (!map.has(id)) map.set(id, { ...item });
else {
const existing = map.get(id);
existing.quantity = (Number(existing.quantity) || 0) + (Number(item.quantity) || 0);
}
}
return Array.from(map.values());
}