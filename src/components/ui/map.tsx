import { MapContainer, Marker, TileLayer } from "react-leaflet";

type Props = {
  location: { lat: number; lng: number };
};
export function Map({ location }: Props) {
  return (
    <MapContainer
      style={{ height: 200, isolation: "isolate" }}
      center={[location.lat, location.lng]}
      zoom={12}
      zoomControl={false}
      doubleClickZoom={false}
      dragging={false}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[location.lat, location.lng]}>
      </Marker>
    </MapContainer>
  );
}
