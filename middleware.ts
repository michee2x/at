// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  // Custom middleware function
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;
    
    // Protect Dashboard Routes: Only sellers/admins can access
    if (path.startsWith("/dashboard")) {
      const userRole = token?.role;
      const isSeller = userRole === 'seller' || userRole === 'administrator' || userRole === 'dokan_vendor';
      
      if (!isSeller) {
        // Redirect non-sellers to My Account or specific page
        return NextResponse.redirect(new URL("/my-account", req.url));
      }
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // Ensure user is logged in first
    },
  }
);

export const config = {
  matcher: [
    "/account/:path*", 
    "/orders/:path*", 
    "/my-account/:path*", 
    "/checkout/:path*",
    "/dashboard/:path*"  // <-- Add dashboard protection
  ],
};
