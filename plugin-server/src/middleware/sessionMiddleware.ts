import { type Context, type Next } from "@hono/hono";
import { auth } from "../auth.ts";

export const sessionMiddleware = async (c: Context, next: Next) => {
  try {
    // Clone headers to bypass immutability
    const headers = new Headers(c.req.raw.headers);
    const session = await auth.api.getSession({ headers });

    if (!session) {
      c.set("user", null);
      c.set("session", null);
      return next();
    }

    c.set("user", session.user);
    c.set("session", session.session);
    return next();
  } catch (error) {
    console.error("Error in sessionMiddleware:", error);
    // Return a 500 response if an error occurs
    return c.json({ error: "Failed to retrieve session" }, 500);
  }
};

export default sessionMiddleware;
