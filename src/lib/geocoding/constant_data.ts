import { LatLng } from "./types";

export const EDMONTON = {
  latitude: 53.5462,
  longitude: -113.4937,
} satisfies LatLng;

export function googleDirections(address: string): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${
    encodeURIComponent(address)
  }`;
}
