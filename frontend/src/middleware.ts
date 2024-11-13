import { chain } from "./middlewares/chain";
import { withAuthMiddleware } from "./middlewares/withAuthMiddleware";
import { withTokenRefreshMiddleware } from "./middlewares/withTokenRefreshMiddleware";

export default chain([withTokenRefreshMiddleware, withAuthMiddleware]);

// Define routes that should use the middleware
export const config = {
  matcher: "/((?!api|static|.*\\..*|_next).*)",
};
