"use server";

import { getAccessToken } from "@/lib/auth";
import {
  CodeReviewResponse,
  CodeReviewResponseSchema,
} from "@/types/CodeReview";
import {
  HistorySessionInfoResponse,
  SessionHistoryResponseSchema,
  SessionInfoResponse,
  SessionInfoResponseSchema,
} from "@/types/SessionInfo";
import { cache } from "react";

export const getSessionInfo = cache(async function (
  sessionId: string
): Promise<SessionInfoResponse> {
  const access_token = await getAccessToken();
  try {
    const res = await fetch(
      process.env.PUBLIC_API_URL + `/api/collaboration/${sessionId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const data = await res.json();

    console.log(data);

    return SessionInfoResponseSchema.parse(data);
  } catch (error) {
    return {
      statusCode: 500,
      message: String(error),
    };
  }
});

export async function getUserSessionHistory(): Promise<HistorySessionInfoResponse> {
  const access_token = await getAccessToken();
  try {
    const res = await fetch(
      process.env.PUBLIC_API_URL + `/api/collaboration/history`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const data = await res.json();

    return SessionHistoryResponseSchema.parse(data);
  } catch (error) {
    return {
      statusCode: 500,
      message: String(error),
    };
  }
}

export async function createCodeReview(
  sessionId: string,
  code: string
): Promise<CodeReviewResponse> {
  const access_token = await getAccessToken();
  try {
    const res = await fetch(
      process.env.PUBLIC_API_URL + "/api/collaboration/review",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify({ sessionId, code }),
      }
    );

    const data = await res.json();

    return CodeReviewResponseSchema.parse(data);
  } catch (error) {
    return {
      statusCode: 500,
      message: String(error),
    };
  }
}
