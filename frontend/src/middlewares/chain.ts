import { NextMiddlewareResult } from "next/dist/server/web/types";
import { NextRequest, NextFetchEvent, NextResponse } from "next/server";

export type CustomMiddleware = (
  request: NextRequest,
  event: NextFetchEvent,
  response: NextResponse
) => Promise<NextMiddlewareResult> | NextMiddlewareResult;

type MiddlewareFactory = (next: CustomMiddleware) => CustomMiddleware; // Middleware factory that chains the next middleware

export function chain(
  middlewareFactories: MiddlewareFactory[]
): CustomMiddleware {
  // Base case when no middleware is left in the chain
  const next: CustomMiddleware = async (request, event, response) => response;

  // Start chaining middlewares from the last one to the first one
  // First middleware will be on top of the stack and will be called first
  return middlewareFactories
    .reverse()
    .reduce((nextMiddleware, currentFactory) => {
      return currentFactory(nextMiddleware);
    }, next);
}
