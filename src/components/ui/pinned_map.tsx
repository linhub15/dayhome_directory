import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import { Icon } from "leaflet";

type Props = {
  location: { lat: number; lng: number };
  label?: string;
};
export function PinnedMap({ location, label }: Props) {
  return (
    <MapContainer
      style={{ height: 200, isolation: "isolate" }}
      center={[location.lat, location.lng]}
      zoom={13}
      zoomControl={false}
      doubleClickZoom={false}
      dragging={false}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker
        position={[location.lat, location.lng]}
        icon={new Icon({
          iconUrl: markerIconPng,
          iconSize: [25, 41],
          iconAnchor: [12, 41],
        })}
      >
        {label && <Popup>{label}</Popup>}
      </Marker>
    </MapContainer>
  );
}
