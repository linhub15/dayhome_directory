import { serverEnv } from "@/config/server_env";
import {
  GeocodingCore,
  LngLatBounds,
  type LngLatBoundsLike,
} from "@mapbox/search-js-core";
import { LatLng } from "./types";
import z from "zod";

const geocode = new GeocodingCore({ accessToken: serverEnv.MAPBOX_TOKEN });

/**
 * ISO 3166 Alpha 2 country codes
 * @link https://www.iban.com/country-codes
 */
const COUNTRY_CODES = {
  CANADA: "CA",
  UNITED_STATES: "US",
};

const CANADA_BOUNDING_BOX: LngLatBoundsLike = new LngLatBounds(
  [-141.00275, 41.6765556],
  [-52.3231981, 70],
);

const validQuery = z.string().nonempty();

export async function forwardGeocode(query: string) {
  if (!validQuery.safeParse(query).success) {
    return null;
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
