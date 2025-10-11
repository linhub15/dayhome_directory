import { parse } from "@std/csv";
import * as z from "@zod/zod";
import { ageGroup as ageGroupEnum } from "../src/lib/db/schema.ts";
import { InferEnum } from "drizzle-orm";
import { hoursToTimeString } from "./utils.ts";

const spreadsheetId = Deno.env.get("DATA_SPREADSHEET_ID");
console.info({ SpreadsheetId: spreadsheetId });
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
  strip: true,
});

// Only keep rows with a name and address
const toParse = json.filter((row) => !!row.Name && !!row.Address);

console.info(`Imported ${json.length} rows from Google Sheets`);

const safeString = z.string().trim().optional().transform((x) =>
  x || undefined
);
const timeNumber = safeString.transform((x) =>
  x ? hoursToTimeString(Number(x)) : undefined
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
  Phone: z.string().trim().max(10).transform((x) => x || undefined),
  Email: safeString,
  "Agency Name": safeString.optional(),
  "Age Groups": safeString
    .transform((x) => x?.split(",").map((s) => s.trim()))
    .pipe(z.array(ageGroup)).optional(),
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
  "Is Agency": z.stringbool(),
});

export const dayhomeFromGoogleSheets = z.array(sheetSchema)
  .parse(toParse);

console.info(`Zod Parsed ${dayhomeFromGoogleSheets.length} rows`);
