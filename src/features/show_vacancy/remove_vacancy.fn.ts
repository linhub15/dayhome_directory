import { auth } from "@/lib/auth/auth_middleware.ts";
import { db } from "@/lib/db/db_middleware.ts";
import { createServerFn } from "@tanstack/react-start";
import z from "@zod/zod";

export const removeVacancyFn = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      dayhomeId: z.string(),
    }),
  )
  .middleware([auth, db])
  .handler(async ({ context }) => {
    const { user, db } = context;

    // check if the user is authenticated
    if (!user) {
      throw new Error("Unauthorized");
    }

    // check if user claimed this listing

    // find the vacancy for the listing and delete it

    return;
  });
