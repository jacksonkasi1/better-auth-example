import express, { Request, Response } from "express";
import cors from "cors";
import { auth } from "./auth.ts";
import { sessionMiddleware } from "./middleware/sessionMiddleware.ts";
import { toNodeHandler } from "better-auth/node";
import morgan from "morgan";
import { WebSocketServer, WebSocket as WsWebSocket } from "ws";
import { parse } from "node:url";
import cookieParser from "cookie-parser";

const app = express();
const wsClients = new Map<string, WsWebSocket>();

// Enable CORS for your frontend
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5000", '*'],
    maxAge: 600,
    credentials: true,
  }),
);


// Custom middleware to log the origin
app.use((req, res, next) => {
  const origin = req.headers.origin || "Unknown Origin";
  console.log(`🔴 Request received from origin: ${origin}`);
  next();
});

// Use morgan for logging incoming requests
app.use(morgan("combined")); // Logs in Apache combined format

// Enable cookie parsing
app.use(cookieParser()); // Add cookie-parser middleware

// Apply session middleware to every request
app.use(sessionMiddleware);

// WebSocket Server setup
const wss = new WebSocketServer({ port: 8080 });
wss.on("connection", (ws, req) => {
  const query = parse(req.url || "", true).query;
  const pluginCode = query.plugin_code as string;

  console.log("WSS pluginCode:", pluginCode);

  if (pluginCode) {
    wsClients.set(pluginCode, ws); // Map client to pluginCode

    ws.on("close", () => {
      wsClients.delete(pluginCode);
    });
  }
});

// Handle authentication routes using Better Auth
app.all("/api/auth/*", async (req, res, next) => {
  try {
    await toNodeHandler(auth)(req, res);

    const session = req.session;
    // Retrieve plugin_code from cookies
    const pluginCode = req?.cookies?.plugin_code as string | undefined;

    console.log("Auth pluginCode:", pluginCode);

    if (pluginCode && session && session.user && session.user.id) {
      const sessionId = session.sessionToken; // Bearer token

      // Send session ID only to the WebSocket client with matching pluginCode
      const client = wsClients.get(pluginCode);
      if (client && client.readyState === WsWebSocket.OPEN) {
        client.send(JSON.stringify({ sessionId }));
        client.close(); // Close the WebSocket connection after sending the session ID
        wsClients.delete(pluginCode); // Remove client from the map
        console.log(
          `WebSocket connection closed. 🔴 Plugin code: ${pluginCode}`,
        );
      }
    }
  } catch (error) {
    console.error("Error in Better Auth:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Parse incoming JSON requests
app.use(express.json());

// Define a public API route (accessible to everyone)
app.get("/api/public-api", (req: Request, res: Response) => {
  res.json({
    message: "This is public data accessible to anyone.",
  });
});

// Define a private API route (only accessible if authenticated)
// @ts-ignore
app.get("/api/private-api", (req: Request, res: Response) => {
  const session = req.session;

  // Check if the session or user is missing, respond with 401 Unauthorized
  if (!session || !session.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // If session exists, return mock private API data
  res.json({
    message: "This is private data, accessible only to authenticated users.",
    user: session.user,
  });
});

// @ts-ignore
app.get("/api/me", (req: Request, res: Response) => {
  const session = req.session;

  // Check if the session or user is missing, respond with 401 Unauthorized
  if (!session || !session.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // If session exists, return mock private API data
  res.json({
    message: "This is private data, accessible only to authenticated users.",
    data: session.user,
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
