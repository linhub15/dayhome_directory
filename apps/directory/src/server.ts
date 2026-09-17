import serverEntry, {
  createServerEntry,
} from "@tanstack/react-start/server-entry";

import { isScannerPath } from "@/lib/security/is_scanner_path.ts";

export default createServerEntry({
  async fetch(request, ...args) {
    if (isScannerPath(new URL(request.url).pathname)) {
      return new Response(null, {
        status: 404,
        headers: {
          "Cache-Control": "public, max-age=86400",
        },
      });
    }

    return await serverEntry.fetch(request, ...args);
  },
});
