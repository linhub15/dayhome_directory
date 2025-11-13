import { parse } from "@std/csv";
import * as z from "@zod/zod";
import type { InferEnum } from "drizzle-orm";
import type { ageGroup as ageGroupEnum } from "../src/lib/db/schema.ts";
import { hoursToTimeString } from "./utils.ts";

const spreadsheetId = process.env.DATA_SPREADSHEET_ID;
console.info(`importer: ${spreadsheetId}`);
const sheetName = "directory";
const url = new URL(
  `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq`,
);

url.searchParams.set("tqx", "out:csv");
url.searchParams.set("sheet", encodeURIComponent(sheetName));

const response = await fetch(url);
const data = await response.text();

const json = parse(data, {
  skipFirstRow: true,
  trimLeadingSpace: true,
});

const controlSchema = z.object({
  Name: z.string().trim().optional(),
  Address: z.string().trim().optional(),
  loaded_to_db_on: z.string().optional(),
  ready_to_load: z.stringbool().optional(),
});

const toParse = json.filter((row) => {
  const checkRow = controlSchema.parse(row);
  return (
    !!checkRow.Name &&
    !!checkRow.Address &&
    !checkRow.loaded_to_db_on &&
    checkRow.ready_to_load
  );
});

console.info(`importer: Imported ${json.length} rows from Google Sheets`);

const safeString = z
  .string()
  .trim()
  .optional()
  .transform((x) => x || undefined);
const timeNumber = safeString.transform((x) =>
  x ? hoursToTimeString(Number(x)) : undefined,
);

type AgeGroup = InferEnum<typeof ageGroupEnum>;
const ageGroup = z.literal<AgeGroup[]>([
  "infant",
  "toddler",
  "preschool",
  "kindergarten",
  "grade_school",
]);

const sheetSchema = z.object({
  Name: z.string().trim(),
  Address: z.string().trim(),
  Phone: z
    .string()
    .trim()
    .max(10)
    .transform((x) => x || undefined),
  Email: safeString,
  "Agency Name": safeString.optional(),
  license_id: safeString.optional(),
  "Age Groups": safeString
    .transform((x) => x?.split(",").map((s) => s.trim()))
    .pipe(z.array(ageGroup).default([]))
    .optional(),
  "M▶️": timeNumber,
  "M🛑": timeNumber,
  "T▶️": timeNumber,
  "T🛑": timeNumber,
  "W▶️": timeNumber,
  "W🛑": timeNumber,
  "Th▶️": timeNumber,
  "Th🛑": timeNumber,
  "F▶️": timeNumber,
  "F🛑": timeNumber,
  "Sa▶️": timeNumber,
  "Sa🛑": timeNumber,
  "Su▶️": timeNumber,
  "Su🛑": timeNumber,
  "Is Licensed": z.stringbool(),
});

export const dayhomeFromGoogleSheets = z.array(sheetSchema).parse(toParse);

console.info(`importer: Zod Parsed ${dayhomeFromGoogleSheets.length} rows`);
