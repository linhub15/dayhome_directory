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
      readonly NODE_ENV: "development" | "production" | "test";
    }
  }
}

export {};
