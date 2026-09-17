import assert from "node:assert/strict";
import { test } from "node:test";
import { createDatabase } from "@dayhome/db/client";
import { getDayhome } from "./get_dayhome.server";

test("public listing SQL does not require the agency tenant column", () => {
  // SQL generation does not open a connection.
  const database = createDatabase("postgres://localhost/unused");
  const query = getDayhome(database, "7gbkddueE0").toSQL();

  assert.doesNotMatch(query.sql, /tenant_id/);
  assert.match(query.sql, /"dayhome_open_hours"/);
  assert.match(query.sql, /"license"/);
  assert.ok(query.params.includes("7gbkddueE0"));
});
