import { Hono, type Context } from "@hono/hono";
import { cors } from "jsr:@hono/hono/cors";

import sessionMiddleware from "./middleware/sessionMiddleware.ts";

import type { Session, User } from "./types/index.ts";

const app = new Hono<{
  Variables: {
    user: User | null;
    session: Session | null;
  };
}>();

// Enable CORS for all routes
app.use("*", cors());

// Apply sessionMiddleware to all routes
app.use("*", sessionMiddleware);

app.get("/", (c: Context) => {
  return c.json({ message: "Hello, World!" });
});

// Public route
app.get("/api/public-api", (c: Context) => {
  return c.json({
    message: "This is public data accessible to anyone.",
  });
});

// Protected route that requires a session
app.get("/api/me", (c: Context) => {
  const user = c.get("user") as User | null;

  // If no user is found, respond with 401 Unauthorized
  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  // If user exists, respond with user data
  return c.json({
    message: "This is private data, accessible only to authenticated users.",
    data: user,
  });
});

Deno.serve({ port: 8087 }, app.fetch);
