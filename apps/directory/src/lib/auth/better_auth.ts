import { getDb } from "@/lib/db/database.ts";
import { createDayhomeAuth } from "@dayhome/auth/server";

export function getAuth() {
  const db = getDb();

  return createDayhomeAuth({
    database: db,
    google:
      process.env.GOOGLE_OAUTH_CLIENT_ID &&
      process.env.GOOGLE_OAUTH_CLIENT_SECRET
        ? {
            clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
            clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
          }
        : undefined,
  });
}
