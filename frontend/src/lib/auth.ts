import { cookies } from "next/headers";
import {
  AccessToken,
  AccessTokenPayload,
  AccessTokenPayloadSchema,
  AccessTokenSchema,
  RefreshToken,
  TokenPair,
} from "@/types/Token";

/**
 * This function retrieves the access token from the cookie store.
 *
 * @returns {Promise<AccessToken>}
 */
export async function getAccessToken(): Promise<AccessToken> {
  "use server";
  const cookieStore = await cookies();
  try {
    const access_token = AccessTokenSchema.parse(
      cookieStore.get("access_token")?.value
    );

    return access_token;
  } catch (error) {
    return "";
  }
}

/**
 * This function retrieves the refresh token from the cookie store.
 *
 * @returns {Promise<RefreshToken>}
 */
export async function getRefreshToken(): Promise<RefreshToken> {
  "use server";
  const cookieStore = await cookies();
  try {
    const access_token = AccessTokenSchema.parse(
      cookieStore.get("refresh_token")?.value
    );

    return access_token;
  } catch (error) {
    return "";
  }
}

/**
 * This function stores the access token and refresh token in the cookie store.
 * It is used to maintain the user's session by saving the tokens in the cookies.
 * The access token is used for authentication, and the refresh token can be used
 * to obtain a new access token if the current one expires.
 *
 * @param {TokenPair} tokenPair - An object containing the access token and refresh token.
 * @returns {Promise<void>}
 */
export async function setAuthCookieSession(
  tokenPair: TokenPair
): Promise<void> {
  "use server";
  const cookieStore = await cookies();
  cookieStore.set("access_token", tokenPair.access_token, {
    httpOnly: true,
    // secure: true, // Uncomment this line when using HTTPS
    sameSite: "strict",
  });
  cookieStore.set("refresh_token", tokenPair.refresh_token, {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    httpOnly: true,
    // secure: true, // Uncomment this line when using HTTPS
    sameSite: "strict",
  });
}

/**
 * This function deletes the access token and refresh token from the cookie store.
 * It is used to effectively log out the user by clearing the authentication tokens.
 *
 * After calling this function, the user will need to reauthenticate to obtain new tokens.
 *
 * @returns {Promise<void>}
 */
export async function deleteAuthCookieSession(): Promise<void> {
  "use server";
  const cookieStore = await cookies();
  cookieStore.delete("access_token");
  cookieStore.delete("refresh_token");
}

export function isTokenExpired(token: AccessToken): boolean {
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
