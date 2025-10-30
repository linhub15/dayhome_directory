import { DivIcon, Icon } from "leaflet";

const circleIcon = `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="#2b7fff"
      stroke="white"
      stroke-width="2.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
    </svg>
`;

const encodedSvg = encodeURIComponent(circleIcon);
const svgUrl = `data:image/svg+xml,${encodedSvg}`;

export const mapPinIcon = new DivIcon({
  className: "", // deliberately empty to avoid default styles
  html: `
    <div class="relative flex items-center justify-center size-4">
      <span class="absolute size-8 rounded-full bg-sky-500/30 animate-ping"></span>
      <span class="relative size-3 rounded-full bg-primary ring-2 ring-white shadow"></span>
    </div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

export const mapMarkerIcon = new Icon({
  className: "fill-background",
  iconUrl: svgUrl,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});
