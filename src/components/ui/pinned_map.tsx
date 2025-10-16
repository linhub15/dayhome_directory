import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import { useEffect } from "react";
import { mapMarkerIcon } from "./map/pin_icon";

const EDMONTON = [53.5462, -113.4937] as LatLngExpression;

type Props = {
  location: { lat: number; lng: number } | undefined;
  label?: string;
};
export function PinnedMap({ location, label }: Props) {
  const center: LatLngExpression | undefined = location &&
    [location?.lat, location?.lng];

  return (
    <MapContainer
      className="rounded-md"
      style={{ height: 200, isolation: "isolate" }}
      center={center || EDMONTON}
      zoom={13}
      zoomControl={false}
      doubleClickZoom={false}
      dragging={false}
      scrollWheelZoom={false}
      fadeAnimation={true}
      attributionControl={false}
      touchZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <InnerMap center={center} label={label} />
    </MapContainer>
  );
}

function InnerMap(
  { center, label }: { center?: LatLngExpression; label?: string },
) {
  const map = useMap();

  useEffect(() => {
    map.setView(center || EDMONTON, map.getZoom(), {
      animate: true,
    });
  }, [center]);

  if (!center) return;

  return (
    <>
      <Marker
        position={center}
        icon={mapMarkerIcon}
      >
        {label && <Popup>{label}</Popup>}
      </Marker>
    </>
  );
}
