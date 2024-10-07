import { cookies } from "next/headers";
import {
  AccessToken,
  AccessTokenPayload,
  AccessTokenPayloadSchema,
  AccessTokenResponse,
  AccessTokenSchema,
} from "@/types/Token";
import { refreshAccessToken } from "@/services/authService";

/**
 * This function retrieves the access token from the cookie store.
 * If the access token is expired, it will refresh the token and store the new token in the cookie store.
 *
 * @returns {Promise<AccessToken>}
 */
export async function getAccessToken(): Promise<AccessToken> {
  "use server";
  const cookieStore = cookies();
  const access_token = AccessTokenSchema.parse(
    cookieStore.get("access_token")?.value
  );

  if (!access_token || isTokenExpired(access_token)) {
    const accessTokenResponse: AccessTokenResponse = await refreshAccessToken();
    if (accessTokenResponse.statusCode === 200 && accessTokenResponse.data) {
      return accessTokenResponse.data.access_token;
    }
  }

  return access_token;
}

function isTokenExpired(token: AccessToken): boolean {
  const decoded = parseJwt(token);
  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime;
}

export function parseJwt(token: AccessToken): AccessTokenPayload {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  return AccessTokenPayloadSchema.parse(JSON.parse(jsonPayload));
}
