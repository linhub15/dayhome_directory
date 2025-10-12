import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { forwardGeocode } from "./mapbox";

export const geocodeFn = createServerFn({ method: "GET" })
  .inputValidator(z.object({ query: z.string() }))
  .handler(async ({ data }) => {
    const result = await forwardGeocode(data.query);

    return result;
  });
