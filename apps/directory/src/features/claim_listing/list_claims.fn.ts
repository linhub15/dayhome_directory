import { auth } from "@/lib/auth/auth_middleware.ts";
import { db } from "@/lib/db/db_middleware.ts";
import { createServerFn } from "@tanstack/react-start";

type Response = { dayhomeId: string; dayhome: { name: string } }[];

export const listClaimsFn = createServerFn({ method: "GET" })
  .middleware([auth, db])
  .handler(async ({ context }): Promise<Response> => {
    const { user, db } = context;

    if (!user) {
      return [];
    }

    const claims = await db.query.listingClaim.findMany({
      where: (item, { eq }) => eq(item.userId, user.id),
      columns: {
        dayhomeId: true,
      },
      with: {
        dayhome: {
          columns: {
            name: true,
          },
        },
      },
    });

    return claims;
  });
