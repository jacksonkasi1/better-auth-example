import { betterAuth } from "better-auth";
import { bearer } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db/schema.ts";
import * as schema from "./db/schema.ts";

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
    schema,
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
    bearer(), // Enable Bearer token authentication
  ],
  accountLinking: {
    enabled: true,
    trustedProviders: ["google", "github"],
  },
});
