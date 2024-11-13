import { NextRequest, NextFetchEvent, NextResponse } from "next/server";
import { CustomMiddleware } from "./chain";

const protectedRoutes = ["/onboard", "/dashboard", "/profile"];

export function withAuthMiddleware(next: CustomMiddleware): CustomMiddleware {
  return async (
    request: NextRequest,
    event: NextFetchEvent,
    response: NextResponse
  ) => {
    if (
      !protectedRoutes.some((route) =>
        request.nextUrl.pathname.startsWith(route)
      )
    ) {
      return next(request, event, response);
    }

    const accessToken = request.cookies.get("access_token")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;

    if (!accessToken || refreshToken) {
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }

    return next(request, event, response);
  };
}
