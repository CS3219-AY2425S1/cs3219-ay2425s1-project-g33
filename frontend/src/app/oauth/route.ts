import { TokenPair, TokenPairSchema } from "@/types/Token";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const queryParams = request.nextUrl.searchParams;
  const accessToken = queryParams.get("accessToken");
  const refreshToken = queryParams.get("refreshToken");

  if (!accessToken || !refreshToken) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  const tokenPair: TokenPair = TokenPairSchema.parse({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  const cookieStore = await cookies();
  cookieStore.set("access_token", tokenPair.access_token);
  cookieStore.set("refresh_token", tokenPair.refresh_token);

  return NextResponse.redirect(new URL("/dashboard", request.url));
}
