import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function proxy(req: any) {
  const session = await auth();
  const path = req.nextUrl.pathname;

  if (path.startsWith("/admin") && (session?.user as any)?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (path.startsWith("/cashier") && !["ADMIN", "CASHIER"].includes((session?.user as any)?.role)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/cashier/:path*"],
};