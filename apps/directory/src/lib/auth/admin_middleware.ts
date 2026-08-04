import { createMiddleware } from "@tanstack/react-start";
import z from "zod";

const adminCredentialsSchema = z.object({
  ADMIN_BASIC_AUTH_USER: z.string().min(1),
  ADMIN_BASIC_AUTH_PASSWORD: z.string().min(1),
});

function getAdminCredentials() {
  return adminCredentialsSchema.parse(process.env);
}

function decodeBasicAuthorization(authorization: string | null) {
  const [scheme, encoded] = authorization?.split(" ") ?? [];
  if (!authorization || scheme !== "Basic" || !encoded) {
    return null;
  }

  try {
    const [username, password] = atob(encoded).split(":");
    if (!username || !password) {
      return null;
    }

    return { username, password };
  } catch {
    return null;
  }
}

export function isAdminRequest(request: Request) {
  const { ADMIN_BASIC_AUTH_USER, ADMIN_BASIC_AUTH_PASSWORD } =
    getAdminCredentials();
  const credentials = decodeBasicAuthorization(
    request.headers.get("Authorization"),
  );

  if (!credentials) {
    return false;
  }

  return (
    credentials.username === ADMIN_BASIC_AUTH_USER &&
    credentials.password === ADMIN_BASIC_AUTH_PASSWORD
  );
}

export function assertAdminRequest(request: Request) {
  if (!isAdminRequest(request)) {
    throw new Response("Unauthorized", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Admin"',
      },
    });
  }
}

export const admin = createMiddleware({ type: "request" }).server(
  async ({ next, request }) => {
    assertAdminRequest(request);
    return next();
  },
);
