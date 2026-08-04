import { LatLng } from "./types";

export const EDMONTON = {
  latitude: 53.5462,
  longitude: -113.4937,
} satisfies LatLng;

/** http://bboxfinder.com */
export const EDMONTON_BOUNDING_BOX = {
  northEast: { latitude: 53.728404, longitude: -113.223724 },
  southWest: { latitude: 53.346452, longitude: -113.834839 },
};

export function googleDirections(address: string): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    address,
  )}`;
}
