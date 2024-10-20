import { clsx, type ClassValue } from "clsx";
import { NextResponse } from "next/server";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function titleCaseWord(word: string) {
  if (!word) return word;
  return word[0].toUpperCase() + word.substr(1).toLowerCase();
}

// Middleware utilities modifies original response object

export function setAuthCookieSession(
  accessToken: string,
  refreshToken: string,
  response: NextResponse
): void {
  response.cookies.set("access_token", accessToken, {
    httpOnly: true,
    // secure: true, // Uncomment this line when using HTTPS
    sameSite: "strict",
  });
  response.cookies.set("refresh_token", refreshToken, {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    httpOnly: true,
    // secure: true, // Uncomment this line when using HTTPS
    sameSite: "strict",
  });
}

export function createResponseRedirect(
  // previousPageUrl: string | null,
  redirectUrl: URL
): NextResponse {
  const redirectResponse = NextResponse.redirect(redirectUrl);

  return redirectResponse;
}

export function getInitialsFromName(name: string) {
  // defined here for encapsulation
  const chunks = name.split(",");

  if (chunks.length > 1) {
    const initials: string[] = [];
    chunks.forEach((chunk) => initials.push(chunk[0]));
    return initials.join("");
  } else {
    const [fname, lname] = chunks[0].split(" ");
    return `${fname[0]}${lname ? lname[0] : ""}`;
  }
}
