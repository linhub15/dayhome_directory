import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { tanstackStartCookies } from "better-auth/tanstack-start";

type DrizzleDatabase = Parameters<typeof drizzleAdapter>[0];

export type DayhomeAuthOptions = {
  database: DrizzleDatabase;
  cookiePrefix?: string;
  google?: {
    clientId: string;
    clientSecret: string;
  };
};

export function createDayhomeAuth({
  database,
  cookiePrefix = "auth",
  google,
}: DayhomeAuthOptions) {
  return betterAuth({
    database: drizzleAdapter(database, { provider: "pg" }),
    plugins: [tanstackStartCookies()],
    advanced: { cookiePrefix },
    socialProviders: google ? { google } : undefined,
  });
}
