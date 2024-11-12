"use server";

import {
  AccessTokenResponse,
  AccessTokenResponseSchema,
  TokenPairResponse,
  TokenPairResponseSchema,
} from "@/types/Token";
import {
  LoginCredentials,
  SignupData,
  SignupDataSchema,
  ForgotPasswordSchema,
} from "@/types/AuthCredentials";
import {
  RequestSSOUrlResponse,
  RequestSSOUrlResponseSchema,
  LogoutResponse,
  LogoutResposeSchema,
} from "@/types/AuthResponses";
import {
  deleteAuthCookieSession,
  getAccessToken,
  getRefreshToken,
  setAuthCookieSession,
} from "@/lib/auth";
import { AccountProvider } from "@/types/AccountProvider";

export async function login(
  credientials: LoginCredentials
): Promise<AccessTokenResponse> {
  try {
    const res: Response = await fetch(
      process.env.PUBLIC_API_URL + `/api/auth/local/login`,
      {
        cache: "no-cache",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credientials),
      }
    );

    const resObj = await res.json();

    const tokenPairResponse = TokenPairResponseSchema.parse(resObj);
    const accessTokenResponse = AccessTokenResponseSchema.parse(resObj);

    if (tokenPairResponse.data) {
      await setAuthCookieSession(tokenPairResponse.data);
    }

    return accessTokenResponse;
  } catch (error) {
    return {
      statusCode: 500,
      message: String(error),
    };
  }
}

export async function requestSSOUrl(
  provider: AccountProvider
): Promise<RequestSSOUrlResponse> {
  try {
    const res: Response = await fetch(
      process.env.PUBLIC_API_URL + `/api/auth/${provider}`,
      {
        cache: "no-cache",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        redirect: "manual",
      }
    );

    return RequestSSOUrlResponseSchema.parse({
      statusCode: res.status,
      message: "SSO redirect request fetched",
      data: res.headers.get("Location"),
    });
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      message: String(error),
    };
  }
}

export async function signup(
  signupData: SignupData
): Promise<AccessTokenResponse> {
  try {
    const parsedSignupData = SignupDataSchema.parse(signupData);
    const res: Response = await fetch(
      process.env.PUBLIC_API_URL + `/api/auth/local/signup`,
      {
        cache: "no-cache",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsedSignupData),
      }
    );

    const resObj = await res.json();

    const tokenPairResponse = TokenPairResponseSchema.parse(resObj);
    const accessTokenResponse = AccessTokenResponseSchema.parse(resObj);

    if (tokenPairResponse.data) {
      await setAuthCookieSession(tokenPairResponse.data);
    }

    return accessTokenResponse;
  } catch (error) {
    return {
      statusCode: 500,
      message: String(error),
    };
  }
}

export async function logout(): Promise<LogoutResponse> {
  const access_token = await getAccessToken();
  try {
    const res: Response = await fetch(
      process.env.PUBLIC_API_URL + `/api/auth/logout`,
      {
        cache: "no-cache",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const resObj = await res.json();

    await deleteAuthCookieSession();

    return LogoutResposeSchema.parse(resObj);
  } catch (error) {
    return {
      statusCode: 500,
      message: String(error),
    };
  }
}

export async function refreshAccessToken(): Promise<TokenPairResponse> {
  const refresh_token = await getRefreshToken();
  try {
    const res: Response = await fetch(
      process.env.PUBLIC_API_URL + `/api/auth/refresh`,
      {
        cache: "no-cache",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${refresh_token}`,
        },
      }
    );

    const resObj = await res.json();

    const tokenPairResponse = TokenPairResponseSchema.parse(resObj);

    return tokenPairResponse;
  } catch (error) {
    return {
      statusCode: 500,
      message: String(error),
    };
  }
}

export async function resetPassword(
  email: string
): Promise<{ statusCode: number; message: string }> {
  try {
    const validatedData = ForgotPasswordSchema.parse({ email });

    const response = await fetch(
      process.env.PUBLIC_API_URL + "/api/auth/reset-password",
      {
        cache: "no-cache",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validatedData),
      }
    );

    const result = await response.json();
    return {
      statusCode: response.status,
      message: result.message,
    };
  } catch (error) {
    return {
      statusCode: 500,
      message: String(error),
    };
  }
}

export async function verifyCode(
  token: string
): Promise<{ statusCode: number; message: string }> {
  try {
    const response = await fetch(
      process.env.PUBLIC_API_URL + "/api/auth/reset-password/verify",
      {
        cache: "no-cache",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }), // Only send the token
      }
    );

    const result = await response.json();
    return {
      statusCode: response.status,
      message: result.message,
    };
  } catch (error) {
    return {
      statusCode: 500,
      message: String(error),
    };
  }
}

export async function confirmResetPassword(
  token: string,
  password: string
): Promise<{ statusCode: number; message: string }> {
  try {
    const response = await fetch(
      process.env.PUBLIC_API_URL + "/api/auth/reset-password/confirm",
      {
        cache: "no-cache",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      }
    );

    const result = await response.json();
    return {
      statusCode: response.status,
      message: result.message,
    };
  } catch (error) {
    return {
      statusCode: 500,
      message: String(error),
    };
  }
}
