// next-auth.d.ts
import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    wpToken?: string; // your WP token
    user: {
      id: string;       // <-- add this
      role?: string;    // <-- Add Role type
    } & DefaultSession["user"]; // keep name, email, image
  }

  interface User {
    token?: string; // WP token returned from authorize()
    role?: string;  // <-- Add Role type
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    wpToken?: string;
  }
}
