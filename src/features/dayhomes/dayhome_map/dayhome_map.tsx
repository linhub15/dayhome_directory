import type { LatLng } from "@/lib/geocoding/types";
import { Icon, LatLngExpression } from "leaflet";
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvent,
} from "react-leaflet";
import { useListDayhomes } from "../dayhome_list/use_list_dayhomes";
import { useState } from "react";
import { Link } from "@tanstack/react-router";

type Props = {
  center: LatLng;
};

export function DayhomeMap(props: Props) {
  const { center } = props;

  return (
    <MapContainer
      style={{ height: "100vh", width: "100%", isolation: "isolate" }}
      center={{ lat: center.latitude, lng: center.longitude }}
      zoom={13}
      zoomControl={false}
      doubleClickZoom={false}
      dragging={true}
      scrollWheelZoom={false}
      fadeAnimation={false}
      attributionControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <InnerMap />
    </MapContainer>
  );
}

function InnerMap() {
  const map = useMap();
  const [center, setCenter] = useState(map.getCenter());

  useMapEvent("moveend", () => {
    setCenter(map.getCenter());
  });

  const { data } = useListDayhomes({
    center: { latitude: center.lat, longitude: center.lng },
    radius: 5,
  });

  const items = data?.map((d) => ({
    id: d.id,
    name: d.name,
    position: { lat: d.location.y, lng: d.location.x } as LatLngExpression,
    isLicensed: d.isLicensed,
    ageGroups: d.ageGroups || [],
  })) ?? [];

  return (
    <>
      {/* Add markers for each item */}
      {items.map((item) => (
        <Marker
          key={item.id}
          position={item.position}
          icon={new Icon({
            iconUrl: markerIconPng,
            iconSize: [25, 41],
            iconAnchor: [12, 41],
          })}
        >
          <Popup>
            <Link to={"/directory/$id"} params={{ id: item.id }}>
              <strong>{item.name}</strong>
              <br />
              {item.ageGroups.join(", ")}
            </Link>
          </Popup>
        </Marker>
      ))}
    </>
  );
}
