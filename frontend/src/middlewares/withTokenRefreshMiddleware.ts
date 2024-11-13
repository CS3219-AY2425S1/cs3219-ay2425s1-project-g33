import { isTokenExpired } from "@/lib/auth";
import { NextRequest, NextFetchEvent, NextResponse } from "next/server";
import { CustomMiddleware } from "./chain";
import { refreshAccessToken } from "@/services/authService";

export function withTokenRefreshMiddleware(
  next: CustomMiddleware
): CustomMiddleware {
  return async (
    request: NextRequest,
    event: NextFetchEvent,
    response: NextResponse
  ) => {
    const res = response || NextResponse.next();

    const accessToken = request.cookies.get("access_token")?.value;

    if (accessToken && isTokenExpired(accessToken)) {
      const tokenPairResponse = await refreshAccessToken();

      if (tokenPairResponse.statusCode === 200 && tokenPairResponse.data) {
        res.cookies.set("access_token", tokenPairResponse.data.access_token);
        res.cookies.set("refresh_token", tokenPairResponse.data.refresh_token);
      } else {
        res.cookies.delete("access_token");
        res.cookies.delete("refresh_token");
      }
    }
    return next(request, event, res);
  };
}
