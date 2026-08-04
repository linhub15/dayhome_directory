/// <reference types="leaflet.markercluster" />
import { divIcon, MarkerCluster, point } from "leaflet";

export function pinClusterIcon(cluster: MarkerCluster) {
  return divIcon({
    html: `<div><span>${cluster.getChildCount()}</span></div>`,
    className:
      "custom-cluster-icon bg-blue-500 rounded-full p-1.5 text-white font-bold text-center",
    iconSize: point(30, 30, true),
  });
}
