import { betterAuth } from "better-auth";
import { multiSession } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db, user, session } from "./db/schema.ts";

// Ensure environment variables are correctly typed and checked
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET as string;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  throw new Error(
    "Google Client ID and Secret must be set in environment variables",
  );
}

// Define and export the Better Auth configuration
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite", // or 'pg' or 'mysql'
    schema: {
      user, // Schema for the users table
      session, // Schema for the sessions table
    },
  }),
  socialProviders: {
    google: {
      clientId: GOOGLE_CLIENT_ID, // Google OAuth client ID
      clientSecret: GOOGLE_CLIENT_SECRET, // Google OAuth client secret
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
  plugins: [
    multiSession({
      maximumSessions: 1, // Limit to 1 session per user
    }),
  ],
  advanced: {
    disableCSRFCheck: true, // Disable CSRF check for API routes
  },
});
