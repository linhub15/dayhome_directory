import type { LatLng } from "@/lib/geocoding/types";
import { Icon, type LatLngBounds, type LatLngExpression } from "leaflet";
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { ListDayhomesData } from "./use_list_dayhomes.ts";
import { Link } from "@tanstack/react-router";
import { MapRef } from "react-leaflet/MapContainer";
import { useEffect } from "react";

type Props = {
  center: LatLng;
  items: ListDayhomesData;
  onBoundsChange: (bounds: LatLngBounds) => void;
};

export function DayhomeMap(props: Props) {
  const { center, items, onBoundsChange: onBoundsChange } = props;

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
      // @ts-ignore: react-leaflet types are out of date
      whenReady={(m: { target: MapRef }) =>
        m.target && onBoundsChange(m.target?.getBounds())}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <InnerMap center={center} items={items} onBoundsChange={onBoundsChange} />
    </MapContainer>
  );
}

function InnerMap(
  props: {
    center: LatLng;
    items: ListDayhomesData;
    onBoundsChange: (bounds: LatLngBounds) => void;
  },
) {
  const map = useMap();

  useEffect(() => {
    map.panTo({ lat: props.center.latitude, lng: props.center.longitude });
  }, [props.center]);
  useMapEvents({
    moveend: () => {
      props.onBoundsChange(map.getBounds());
    },
  });

  const items = props.items?.map((d) => ({
    id: d.id,
    name: d.name,
    position: { lat: d.location.y, lng: d.location.x } as LatLngExpression,
    isLicensed: d.isLicensed,
    ageGroups: d.ageGroups || [],
  })) ?? [];

  return (
    <>
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
