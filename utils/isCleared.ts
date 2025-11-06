import { Params } from "@/types";

export function isCleared(obj: Params,cleared:Params): boolean {
  const keys = Object.keys(cleared) as (keyof Params)[];
  for (const key of keys) {
    if (obj[key] !== cleared[key]) {
      return false;
    }
  }
  return true;
}