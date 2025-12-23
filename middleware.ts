// middleware.ts
import { withAuth } from "next-auth/middleware";

export default withAuth(
  // optional config object
  function middleware(req) {
    return;
  }
);

export const config = {
  matcher: ["/account/:path*", "/orders/:path*", "/my-account/:path*", "/checkout/:path*"],
};
