import { getDb } from "@/lib/db/database.ts";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { reactStartCookies } from "better-auth/react-start";

export function getAuth() {
  const db = getDb();

  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "pg",
    }),
    plugins: [
      /**
       * Handle setting cookies for signInEmail
       * https://www.better-auth.com/docs/integrations/tanstack#usage-tips
       */
      reactStartCookies(),
    ],
    advanced: {
      cookiePrefix: "auth",
    },
    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
        clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      },
    },
  });
}
