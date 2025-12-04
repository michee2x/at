"use server";
// app/actions/userActions.ts
import { User } from "@/lib/user/User";
import type { UserBillingInfo } from "@/types/checkout";

export async function getUserDetailsAction(userId: number) {
  const user = new User({ id: userId });
  return await user.getUserDetails();
}

export async function updateUserAction(userId: number, data: UserBillingInfo) {
  const user = new User({ id: userId });
  const update = await user.updateUser(data);
  console.log("\n\n\n\n\User updated for billing:", update);
  return update;
}

export async function getUserOrdersAction(userId: number) {
  const user = new User({ id: userId });
  return await user.getOrders();
}

export async function getUserOrderByIdAction(userId: number, orderId: number) {
  const user = new User({ id: userId });
  return await user.getOrderById(orderId);
}
