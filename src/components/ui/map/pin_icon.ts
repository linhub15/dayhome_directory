import { Icon } from "leaflet";

const circleIcon = `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="#2b7fff"
      stroke="white"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
    </svg>
`;

const encodedSvg = encodeURIComponent(circleIcon);
const svgUrl = `data:image/svg+xml,${encodedSvg}`;

export const mapMarkerIcon = new Icon({
  className: "fill-background",
  iconUrl: svgUrl,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});
