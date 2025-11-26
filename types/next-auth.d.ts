// next-auth.d.ts
import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    wpToken?: string; // your WP token
    user: {
      id: string;       // <-- add this
    } & DefaultSession["user"]; // keep name, email, image
  }

  interface User {
    token?: string; // WP token returned from authorize()
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    wpToken?: string;
  }
}
