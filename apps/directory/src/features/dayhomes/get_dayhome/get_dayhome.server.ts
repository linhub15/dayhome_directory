import type { Database } from "@dayhome/db/client";

export function getDayhome(database: Database, id: string) {
  return database.query.dayhome.findFirst({
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
    where: (dayhome, { eq }) => eq(dayhome.id, id),
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
  });
}
