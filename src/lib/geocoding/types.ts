import z from "@zod/zod";

export const LatLngSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
});

export type LatLng = z.infer<typeof LatLngSchema>;

export type Kilometers = number;
