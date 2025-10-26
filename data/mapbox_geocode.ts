import { forwardGeocode } from "@/lib/geocoding/mapbox.ts";
import { getGeocode, setGeocode } from "./geocode_cache.ts";

let geocodeCount = 0;

export async function geocodeAddress(query: string) {
  if (!query) {
    throw new Error("No query provided for geocoding");
  }

  const fromCache = getGeocode(query);

  if (fromCache) {
    return fromCache;
  }

  const location = await forwardGeocode(query);

  geocodeCount++;

  if (!location) {
    throw new Error(`Geocoding failed for address: ${query}`);
  }

  setGeocode(query, location);

  return location;
}

export function getGeocodeCount() {
  return geocodeCount;
}
