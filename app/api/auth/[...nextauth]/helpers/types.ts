// helpers/types.ts
import { Session } from "next-auth";
import {JWT} from "next-auth/jwt"

export interface CustomToken extends JWT {
  jwt?: string;
  wpNonce?: string;
  google?: boolean;
  email?: string;
  name?: string;
  wpUserId?: number;   // ← MUST BE STRING, NOT NUMBER
}

export interface CustomSession extends Session {
  wpToken?: string;
  wpNonce?: string;
  google?: boolean;
  user: {
    id?: string;           // <-- add WP user id here (optional)
    name?: string;
    email?: string;
  } & Session["user"];
}

export interface WpAuthResult {
  id: number;
  user_display_name: string;
  user_email: string;
  token: string;
}

export interface WpUserMeta {
  id: number;
  slug: string;
  email?: string;
}
  
export interface CartItem {
  product_id: number;
  quantity: number;
  [key: string]: unknown; // allows extra fields like variation, meta
}
