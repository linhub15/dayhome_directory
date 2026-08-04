import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { tanstackStartCookies } from "better-auth/tanstack-start";

type DrizzleDatabase = Parameters<typeof drizzleAdapter>[0];

export type DayhomeAuthOptions = {
  database: DrizzleDatabase;
  secret?: string;
  cookiePrefix?: string;
  trustedOrigins?: string[];
  crossSubDomainCookieDomain?: string;
  google?: {
    clientId: string;
    clientSecret: string;
  };
  sendVerificationEmail?: (data: {
    user: { name: string; email: string };
    url: string;
    token: string;
  }) => Promise<void>;
  beforeDeleteUser?: (user: { id: string; email: string }) => Promise<void>;
};

export function createDayhomeAuth({
  database,
  secret,
  cookiePrefix = "dayhome",
  trustedOrigins,
  crossSubDomainCookieDomain,
  google,
  sendVerificationEmail,
  beforeDeleteUser,
}: DayhomeAuthOptions) {
  return betterAuth({
    database: drizzleAdapter(database, { provider: "pg" }),
    secret,
    trustedOrigins,
    plugins: [tanstackStartCookies()],
    advanced: {
      cookiePrefix,
      crossSubDomainCookies: crossSubDomainCookieDomain
        ? {
            enabled: true,
            domain: crossSubDomainCookieDomain,
          }
        : undefined,
    },
    socialProviders: google ? { google } : undefined,
    emailVerification: sendVerificationEmail
      ? {
          sendVerificationEmail,
          autoSignInAfterVerification: true,
          expiresIn: 60 * 60,
        }
      : undefined,
    user: {
      deleteUser: {
        enabled: true,
        beforeDelete: beforeDeleteUser,
      },
    },
  });
}

type AuthEnvironment = {
  BETTER_AUTH_SECRET?: string;
  BETTER_AUTH_TRUSTED_ORIGINS?: string;
  BETTER_AUTH_COOKIE_DOMAIN?: string;
  GOOGLE_OAUTH_CLIENT_ID?: string;
  GOOGLE_OAUTH_CLIENT_SECRET?: string;
};

/** Build the same auth configuration in every app from shared environment keys. */
export function dayhomeAuthOptionsFromEnv(env: AuthEnvironment) {
  const trustedOrigins = env.BETTER_AUTH_TRUSTED_ORIGINS?.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
  const google =
    env.GOOGLE_OAUTH_CLIENT_ID && env.GOOGLE_OAUTH_CLIENT_SECRET
      ? {
          clientId: env.GOOGLE_OAUTH_CLIENT_ID,
          clientSecret: env.GOOGLE_OAUTH_CLIENT_SECRET,
        }
      : undefined;

  return {
    secret: env.BETTER_AUTH_SECRET,
    trustedOrigins,
    crossSubDomainCookieDomain: env.BETTER_AUTH_COOKIE_DOMAIN,
    google,
  } satisfies Omit<DayhomeAuthOptions, "database">;
}
