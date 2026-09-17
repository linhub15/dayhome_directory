import assert from "node:assert/strict";
import test from "node:test";

import { isScannerPath } from "./is_scanner_path.ts";

test("blocks WordPress and secret scanner paths", () => {
  const paths = [
    "/.env",
    "/.env.backup",
    "/.env.local",
    "/.env.production",
    "/app/.env.development",
    "/.git/config",
    "/actuator/health",
    "/blog/wp-json/batch/v1",
    "/phpinfo.php",
    "/vendor/phpunit/phpunit/src/Util/PHP/eval-stdin.php",
    "/wp-admin",
    "/wp-login.php",
    "/xmlrpc.php",
  ];

  for (const path of paths) {
    assert.equal(isScannerPath(path), true, path);
  }
});

test("allows application routes with similar text", () => {
  const paths = [
    "/",
    "/directory/abc123",
    "/directory/wp-json-dayhome",
    "/privacy",
    "/profile",
  ];

  for (const path of paths) {
    assert.equal(isScannerPath(path), false, path);
  }
});
