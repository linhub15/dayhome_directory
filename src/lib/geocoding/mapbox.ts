import type {
  GeocodingOptions,
  LngLatBoundsLike,
} from "@mapbox/search-js-core";
import z from "@zod/zod";
import { serverEnv } from "@/config/server_env.ts";
import type { LatLng } from "@/lib/geocoding/types.ts";

class Geocoder {
  #accessToken: string;
  #defaults: Partial<GeocodingOptions>;
  #url = new URL("https://api.mapbox.com");

  constructor({
    accessToken,
    options,
  }: Partial<{ accessToken: string; options?: GeocodingOptions }> = {}) {
    if (!accessToken) {
      throw new Error("Mapbox access token is required");
    }
    this.#accessToken = accessToken;
    this.#defaults = options || {};
  }

  async forward(searchText: string, options?: Partial<GeocodingOptions>) {
    const url = new URL("search/geocode/v6/forward", this.#url);

    const newOptions = { ...this.#defaults, ...options };

    url.search = new URLSearchParams({
      access_token: this.#accessToken,
      q: searchText,
      ...Object.fromEntries(
        Object.entries(newOptions)
          .filter(([, v]) => v !== undefined && v !== null)
          .map(([k, v]) => [k, String(v)]),
      ),
    }).toString();

    const response = await fetch(url, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(
        `Mapbox Geocoding API error: ${response.status} ${response.statusText}`,
      );
    }

    const json = await response.json();

    const responseSchema = z.object({
      url: z.string().optional(),
      type: z.literal("FeatureCollection"),
      features: z.array(
        z.object({
          type: z.literal("Feature"),
          geometry: z.object({
            type: z.literal("Point"),
            coordinates: z.tuple([z.number(), z.number()]),
          }),
        }),
      ),
      attribution: z.string(),
    });

    return responseSchema.parse(json);
  }
}

const geocoder = new Geocoder({ accessToken: serverEnv.MAPBOX_TOKEN });

/**
 * ISO 3166 Alpha 2 country codes
 * @link https://www.iban.com/country-codes
 */
const COUNTRY_CODES = {
  CANADA: "CA",
  UNITED_STATES: "US",
};

const CANADA_BOUNDING_BOX: LngLatBoundsLike = [
  [-141.00275, 41.6765556],
  [-52.3231981, 70],
];

const validQuery = z.string().nonempty();

export async function forwardGeocode(query: string) {
  if (!validQuery.safeParse(query).success) {
    return null;
  }

  const response = await geocoder.forward(query, {
    autocomplete: false,
    limit: 1,
    country: COUNTRY_CODES.CANADA,
    permanent: false,
    proximity: undefined,
    bbox: CANADA_BOUNDING_BOX,
    language: "en",
  });

  const { coordinates } = response.features.at(0)?.geometry ?? {};

  if (!coordinates) {
    return null;
  }

  const latLng: LatLng = {
    latitude: coordinates[1],
    longitude: coordinates[0],
  };

  return latLng;
}
