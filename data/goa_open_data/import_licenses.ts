import { parse } from "@std/csv";
import { readTextFile } from "@std/fs/unstable-read-text-file";
import { writeTextFile } from "@std/fs/unstable-write-text-file";
import z from "@zod/zod";

const file = await readTextFile(`${import.meta.dirname}/raw.csv`);

const csv = parse(file, {
  skipFirstRow: true,
  trimLeadingSpace: true,
});

const childcareInfoSchema = z
  .object({
    "Program ID": z.string(),
    "Program Name": z.string(),
    "Program Address": z.string(),
    "Program City": z.string(),
    "Postal Code": z.string(),
    "Phone Number": z.string(),
    "Type of Program": z.literal([
      "FACILITY-BASED PROGRAM",
      "INNOVATIVE CHILD CARE PROGRAM",
      "FAMILY DAY HOME",
      "GROUP FAMILY CHILD CARE PROGRAM",
    ]),
    "Day Care Y/N": z.stringbool(),
    "Out of School Care Y/N": z.stringbool(),
    "Preschool Y/N": z.stringbool(),
    Capacity: z.string().transform((x) => Number(x) || 0),
    "Inspection Date": z.string(),
    "Inspection Reason": z.string(),
    "Non Compliance": z.string(),
    "Enforcement Action": z.string(),
    "Remedy Date": z.string(),
  })
  .transform((obj) => ({
    id: obj["Program ID"],
    name: obj["Program Name"],
    address: obj["Program Address"],
    city: obj["Program City"],
    postalCode: obj["Postal Code"],
    phoneNumber: obj["Phone Number"],
    type: obj["Type of Program"],
    hasDayCare: obj["Day Care Y/N"],
    hasOutOfSchoolCare: obj["Out of School Care Y/N"],
    hasPreschool: obj["Preschool Y/N"],
    capacity: obj.Capacity,
    inspectedOn: obj["Inspection Date"],
    inspectionReason: obj["Inspection Reason"],
    nonCompliance: obj["Non Compliance"],
  }));

const json = z.array(childcareInfoSchema).parse(csv);

// get all of edmonton records

const edmontonRecords = json
  .filter(
    ({ city }) =>
      city.toLowerCase() === "edmonton" || city.toLowerCase() === "st. albert",
  )
  .map((x) => ({
    id: x.id,
    name: x.name,
    address: x.address,
    city: x.city,
    postalCode: x.postalCode,
    phoneNumber: x.phoneNumber,
    type: x.type,
    hasDayCare: x.hasDayCare,
    hasOutOfSchoolCare: x.hasOutOfSchoolCare,
    hasPreschool: x.hasPreschool,
    capacity: x.capacity,
  }));

const unique = new Map();

edmontonRecords.forEach((x) => {
  if (unique.has(x.id)) return;
  unique.set(x.id, x);
});

await writeTextFile(
  `${import.meta.dirname}/edmonton_licenses.json`,
  JSON.stringify(Array.from(unique.values()), null, 2),
);
