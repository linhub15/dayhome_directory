import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { eq, sql } from "drizzle-orm";
import { db } from "@/lib/db/db_middleware";
import { admin } from "@/lib/auth/admin_middleware";
import { dayhome } from "@dayhome/db/schema";
import { pattern } from "@/lib/utils/nanoid";

const ageGroupSchema = z.enum([
  "infant",
  "toddler",
  "preschool",
  "kindergarten",
  "grade_school",
]);

const nullableTrimmedStringSchema = z
  .union([z.string(), z.null(), z.undefined()])
  .transform((value) => {
    if (typeof value !== "string") {
      return null;
    }

    const trimmed = value.trim();
    return trimmed.length ? trimmed : null;
  });

const nullableEmailSchema = nullableTrimmedStringSchema.refine(
  (value) => value === null || z.email().safeParse(value).success,
  {
    message: "Invalid email",
  },
);

const requestSchema = z.object({
  id: z.nanoid({ pattern }),
  name: z.string().trim().min(1),
  address: z.string().trim().min(1),
  location: z.object({
    x: z.number().min(-180).max(180),
    y: z.number().min(-90).max(90),
  }),
  phone: nullableTrimmedStringSchema,
  email: nullableEmailSchema,
  isLicensed: z.boolean(),
  agencyName: nullableTrimmedStringSchema,
  ageGroups: z.array(ageGroupSchema).nullable().optional(),
});

export const updateDayhomeFn = createServerFn({ method: "POST" })
  .middleware([admin, db])
  .validator(requestSchema)
  .handler(async ({ data, context }) => {
    const { db } = context;

    const updated = await db
      .update(dayhome)
      .set({
        name: data.name,
        address: data.address,
        location: sql`ST_SetSRID(ST_MakePoint(${data.location.x}, ${data.location.y}), 4326)`,
        phone: data.phone,
        email: data.email,
        isLicensed: data.isLicensed,
        agencyName: data.agencyName,
        ageGroups: data.ageGroups?.length
          ? Array.from(new Set(data.ageGroups))
          : null,
      })
      .where(eq(dayhome.id, data.id))
      .returning({ id: dayhome.id });

    if (!updated.length) {
      throw new Error("Dayhome not found");
    }

    return { id: updated[0].id };
  });
