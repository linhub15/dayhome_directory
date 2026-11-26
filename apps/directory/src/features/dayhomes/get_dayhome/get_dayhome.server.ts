import type { Database } from "@dayhome/db/client";

const publicDayhome = {
  // Public listings must not depend on agency-only schema additions.
  columns: {
    id: true,
    name: true,
    address: true,
    location: true,
    phone: true,
    email: true,
    isLicensed: true,
    agencyName: true,
    ageGroups: true,
  },
  with: {
    openHours: {
      columns: {
        weekday: true,
        openAt: true,
        closeAt: true,
      },
    },
    license: {
      columns: {
        name: true,
        type: true,
        city: true,
        postalCode: true,
        hasDayCare: true,
        hasOutOfSchoolCare: true,
        hasPreschool: true,
        capacity: true,
      },
    },
  },
} as const;

export function getDayhome(database: Database, id: string) {
  return database.query.dayhome.findFirst({
    ...publicDayhome,
    where: (dayhome, { eq }) => eq(dayhome.id, id),
  });
}

export function getSnapshotDayhomes(database: Pick<Database, "query">) {
  return database.query.dayhome.findMany({
    ...publicDayhome,
    orderBy: (dayhome, { asc }) => asc(dayhome.id),
  });
}

export type PublicDayhome = NonNullable<Awaited<ReturnType<typeof getDayhome>>>;
