import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { parseJwt } from "@/lib/auth";
import { AccessToken, AccessTokenSchema } from "./types/Token";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token");
  if (!token) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  const tokenValue: AccessToken = AccessTokenSchema.parse(token.value);
  const decoded = parseJwt(tokenValue);

  if (!decoded.isOnboarded) {
    return NextResponse.redirect(new URL("/onboard", request.url));
  }

  return NextResponse.next();
}

// Define routes that should use the middleware
export const config = {
  matcher: ["/dashboard/:path*"],
};
