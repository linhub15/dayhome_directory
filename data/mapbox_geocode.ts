import mapbox from "@mapbox/search-js-core";
import z from "@zod/zod";
import { getGeocode, setGeocode } from "./geocode_cache.ts";

const { GeocodingCore, LngLatBounds } = mapbox;

let geocodeCount = 0;

const geocode = new GeocodingCore({
  accessToken: Deno.env.get("MAPBOX_TOKEN"),
});

/**
 * ISO 3166 Alpha 2 country codes
 * @link https://www.iban.com/country-codes
 */
const COUNTRY_CODES = {
  CANADA: "CA",
  UNITED_STATES: "US",
};

const CANADA_BOUNDING_BOX: mapbox.LngLatBoundsLike = new LngLatBounds(
  [-141.00275, 41.6765556],
  [-52.3231981, 70],
);

export async function forwardGeocode(query: string) {
  if (!query) {
    throw new Error("No query provided for geocoding");
  }

  const fromCache = getGeocode(query);

  if (fromCache) {
    return fromCache;
  }

  const response = await geocode.forward(query, {
    autocomplete: false,
    limit: 1,
    country: COUNTRY_CODES.CANADA,
    permanent: false,
    proximity: undefined,
    bbox: CANADA_BOUNDING_BOX,
    language: "en",
  });

  geocodeCount++;

  const geometry = z.object({
    type: z.literal("Point"),
    coordinates: z.tuple([z.number(), z.number()]),
  });

  const { coordinates } = geometry.parse(response.features.at(0)?.geometry);

  const location = {
    latitude: coordinates[1],
    longitude: coordinates[0],
  };

  setGeocode(query, location);

  return location;
}

export function getGeocodeCount() {
  return geocodeCount;
}
