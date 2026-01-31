import { NextRequest, NextResponse } from "next/server";
import { getUserData, getAuthToken, clearAuthCookies } from "./lib/cookie";

const publicPaths = ["/login", "/register/retailer", "/register/consumer"];
const adminPaths = ["/admin"];
const consumerPaths = ["/consumer"];
const retailerPaths = ["/retailer"];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = await getAuthToken();
  const user = token ? await getUserData() : null;

  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));
  const isAdminPath = adminPaths.some(path => pathname.startsWith(path));
  const isConsumerPath = consumerPaths.some(path => pathname.startsWith(path));
  const isRetailerPath = retailerPaths.some(path => pathname.startsWith(path));

  // Not logged in and trying to access a protected path
  if (!user && !isPublicPath) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Token/user mismatch → clear cookies and force login
  if ((token && !user) || (!token && user)) {
    await clearAuthCookies();
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Already logged in but on a public path → redirect to their dashboard
  if (token && user && isPublicPath) {
    if (user.role === "admin") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    if (user.role === "consumer") {
      return NextResponse.redirect(new URL("/consumer", req.url));
    }
    if (user.role === "retailer") {
      return NextResponse.redirect(new URL("/retailer", req.url));
    }
  }

  // Role-based protection
  if (token && user) {
    if (isAdminPath && user.role !== "admin") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (isConsumerPath && user.role !== "consumer") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (isRetailerPath && user.role !== "retailer") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/consumer/:path*",
    "/retailer/:path*",
    "/login",
    "/register/consumer",
    "/register/retailer",
  ],
};
