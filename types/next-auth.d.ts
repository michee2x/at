import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    wpToken?: string;
    user?: {
      name?: string;
      email?: string;
    } & DefaultSession["user"];
  }

  interface User {
    token?: string; // the WP token returned from authorize()
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    wpToken?: string;
  }
}
