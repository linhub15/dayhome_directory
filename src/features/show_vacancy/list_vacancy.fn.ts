import { db } from "@/lib/db/db_middleware.ts";
import { createServerFn } from "@tanstack/react-start";
import z from "@zod/zod";

const Request = z.object({
  dayhomeId: z.string(),
});

export const listVacancyFn = createServerFn({ method: "GET" })
  .inputValidator(Request)
  .middleware([db])
  .handler(async ({ context, data }) => {
    const { db } = context;

    const today = new Date();

    const vacancies = await db.query.dayhomeVacancy.findMany({
      where: (vacancy, { and, eq, gte, lte }) =>
        and(
          eq(vacancy.dayhomeId, data.dayhomeId),
          lte(vacancy.startOn, today),
          gte(vacancy.endOn, today),
        ),
    });

    return vacancies;
  });
