import express, { Request, Response } from "express";
import cors from "cors";
import { auth } from "./auth.ts"; // Import your Better Auth instance
import { sessionMiddleware } from "./middleware/sessionMiddleware.ts"; // Import session middleware
import { toNodeHandler } from "better-auth/node"; // Use toNodeHandler for Node.js-based frameworks
import morgan from "morgan"; // Import morgan
import querystring from "node:querystring";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const app = express();

// In-memory storage for clients connected via SSE
const sseClients = new Map();

// Enable CORS for your frontend
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5000"],
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

// Apply session middleware to every request
app.use(sessionMiddleware);

// Handle authentication routes using toNodeHandler from Better Auth
app.all("/api/auth/*", async (req, res, next) => {
  try {
    console.log("Request body:", req.body);
    await toNodeHandler(auth)(req, res);
  } catch (error) {
    console.error("Error in Better Auth:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Parse incoming JSON requests
app.use(express.json());

// SSE endpoint for Figma plugin to receive login updates
app.get("/api/sse", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  const clientId = uuidv4();
  sseClients.set(clientId, res);

  req.on("close", () => {
    sseClients.delete(clientId);
    res.end();
  });
});

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

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
