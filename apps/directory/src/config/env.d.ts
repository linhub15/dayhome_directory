/// <reference types="vite/client" />

/** Client-side environment variables */
interface ImportMetaEnv {
  readonly VITE_PUBLIC_POSTHOG_HOST: string;
  readonly VITE_PUBLIC_POSTHOG_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/** Server-side environment variables */
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly DATABASE_URL: string;
      readonly MAPBOX_TOKEN: string;
      readonly GOOGLE_OAUTH_CLIENT_ID: string;
      readonly GOOGLE_OAUTH_CLIENT_SECRET: string;
      readonly BETTER_AUTH_SECRET: string;
      readonly BETTER_AUTH_TRUSTED_ORIGINS: string;
      readonly BETTER_AUTH_COOKIE_DOMAIN: string;
      readonly NODE_ENV: "development" | "production" | "test";
    }
  }
}

export {};
