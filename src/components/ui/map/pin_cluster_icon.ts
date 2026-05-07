import "leaflet.markercluster";
import L from "leaflet";

export function pinClusterIcon(cluster: L.MarkerCluster) {
  return L.divIcon({
    html: `<div><span>${cluster.getChildCount()}</span></div>`,
    className:
      "custom-cluster-icon bg-blue-500 rounded-full p-1.5 text-white font-bold text-center",
    iconSize: L.point(30, 30, true),
  });
}
