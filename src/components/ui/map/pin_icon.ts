import { DivIcon } from "leaflet";

export const mapAvailableIcon = new DivIcon({
  className: "", // deliberately empty to avoid default styles
  html: `
    <div class="relative flex items-center justify-center size-4">
      <span class="absolute size-8 rounded-full bg-green-500/30 animate-ping"></span>
      <span class="relative size-3.5 rounded-full bg-green-600 ring-2 ring-white shadow"></span>
    </div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

export const mapDefaultIcon = new DivIcon({
  className: "", // deliberately empty to avoid default styles
  html: `
      <span class="block size-3.5 rounded-full bg-primary ring-2 ring-white shadow"></span>
    `,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});
