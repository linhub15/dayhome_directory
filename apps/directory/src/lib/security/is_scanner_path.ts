const scannerPathSegments = [
  "/.git",
  "/actuator",
  "/vendor/phpunit",
  "/wp-admin",
  "/wp-content",
  "/wp-includes",
  "/wp-json",
] as const;

const scannerFileNames = [
  "/phpinfo.php",
  "/server-status",
  "/wp-login.php",
  "/xmlrpc.php",
] as const;

export function isScannerPath(pathname: string) {
  const normalizedPath = pathname.toLowerCase();

  return (
    normalizedPath
      .split("/")
      .some((segment) => segment === ".env" || segment.startsWith(".env.")) ||
    scannerPathSegments.some((segment) =>
      normalizedPath
        .split(segment)
        .some((suffix, index) =>
          index > 0 ? suffix === "" || suffix.startsWith("/") : false,
        ),
    ) ||
    scannerFileNames.some((fileName) => normalizedPath.endsWith(fileName))
  );
}
