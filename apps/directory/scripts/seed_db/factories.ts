import {
  dayhome,
  type dayhomeOpenHours,
  type license,
} from "@/lib/db/schema.ts";
import { EDMONTON_BOUNDING_BOX } from "@/lib/geocoding/constant_data.ts";
import { nanoid } from "@/lib/utils/nanoid.ts";
import { faker as f } from "@faker-js/faker";

type HasId = { id: string };
export function createDayhome({
  agencyName,
  licenseId,
}: {
  agencyName?: string;
  licenseId?: string;
}): typeof dayhome.$inferInsert & HasId {
  return {
    id: nanoid(),
    name: f.company.name(),
    address: `${f.location.streetAddress()}, Edmonton AB, ${f.helpers.replaceSymbols("?#?#?#")}`,
    location: {
      x: f.location.longitude({
        min: EDMONTON_BOUNDING_BOX.southWest.longitude,
        max: EDMONTON_BOUNDING_BOX.northEast.longitude,
      }),
      y: f.location.latitude({
        min: EDMONTON_BOUNDING_BOX.southWest.latitude,
        max: EDMONTON_BOUNDING_BOX.northEast.latitude,
      }),
    },
    email: f.internet.email(),
    phone: f.helpers.replaceSymbols("7804######"),
    isLicensed: f.datatype.boolean(),
    ageGroups: f.helpers.uniqueArray(
      ["infant", "toddler", "preschool", "kindergarten", "grade_school"],
      f.number.int({ min: 1, max: 5 }),
    ),
    agencyName: agencyName,
    licenseId: licenseId,
  };
}

export function createLicense(): typeof license.$inferInsert & HasId {
  return {
    id: f.string.alphanumeric(20),
    name: f.company.name(),
    address: f.location.streetAddress(),
    city: f.location.city(),
    postalCode: f.helpers.replaceSymbols("?#?#?#"),
    phoneNumber: f.helpers.replaceSymbols("7804######"),
    type: f.helpers.weightedArrayElement([
      { weight: 0.7, value: "FACILITY-BASED PROGRAM" },
      { weight: 0.3, value: "FAMILY DAY HOME" },
    ]),
    hasDayCare: f.datatype.boolean(),
    hasOutOfSchoolCare: f.datatype.boolean(),
    hasPreschool: f.datatype.boolean(),
    capacity: f.number.int({ min: 6, max: 300 }),
  } as const;
}

export function createDayhomeOpenHoursSet(
  dayhomeId: string,
): Array<typeof dayhomeOpenHours.$inferInsert> {
  // enhancement: randomly choose days and times
  const monToFri = [1, 2, 3, 4, 5] as const;
  const monToFri_7to6 = monToFri.map((weekday) => ({
    dayhomeId: dayhomeId,
    weekday: weekday,
    openAt: "07:00:00",
    closeAt: "18:00:00",
  }));

  return monToFri_7to6;
}
