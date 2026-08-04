import { getDb } from "#/lib/db/database";
import {
  createDayhomeAuth,
  dayhomeAuthOptionsFromEnv,
} from "@dayhome/auth/server";
import { tenant, tenantMembership } from "@dayhome/db/schema";
import { and, eq } from "drizzle-orm";

import { AuthVerificationEmail } from "../email/auth_verification_email";
import { sendEmail } from "../email/mailer.server";

export function getAuth() {
  return createDayhomeAuth({
    database: getDb(),
    ...dayhomeAuthOptionsFromEnv(process.env),
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Confirm your Dayhome Flow email",
        template: AuthVerificationEmail({ name: user.name, url }),
      });
    },
    beforeDeleteUser: async (user) => {
      const db = getDb();
      const ownedTenants = await db
        .select({ id: tenantMembership.tenantId })
        .from(tenantMembership)
        .where(
          and(
            eq(tenantMembership.userId, user.id),
            eq(tenantMembership.role, "owner"),
          ),
        );
      for (const ownedTenant of ownedTenants) {
        await db.delete(tenant).where(eq(tenant.id, ownedTenant.id));
      }
    },
  });
}
