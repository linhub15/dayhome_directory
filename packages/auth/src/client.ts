import { createAuthClient } from "better-auth/react";

export function createDayhomeAuthClient(baseURL?: string) {
  return createAuthClient({ baseURL });
}
