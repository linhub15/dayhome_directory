/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Client-side environment variables
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Server-side environment variables
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
