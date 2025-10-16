import type { LatLng } from "@/lib/geocoding/types";
import { type LatLngBounds, type LatLngExpression } from "leaflet";
import {
  MapContainer,
  Marker,
  Pane,
  Popup,
  TileLayer,
  Tooltip,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { ListDayhomesData } from "./use_list_dayhomes.ts";
import { Link } from "@tanstack/react-router";
import { MapRef } from "react-leaflet/MapContainer";
import { useEffect, useState } from "react";
import { debounce } from "@tanstack/react-pacer";
import { mapMarkerIcon } from "@/components/ui/map/pin_icon.ts";

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
      // Zoom
      zoom={13}
      zoomControl={false}
      zoomAnimation={true}
      markerZoomAnimation={true}
      doubleClickZoom={true}
      scrollWheelZoom={true}
      minZoom={11}
      maxZoom={15}
      //----
      dragging={true}
      fadeAnimation={true}
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

  const items = props.items?.map((d) => ({
    id: d.id,
    name: d.name,
    position: { lat: d.location.y, lng: d.location.x } as LatLngExpression,
    isLicensed: d.isLicensed,
    ageGroups: d.ageGroups || [],
  })) ?? [];

  const [markers, setMarkers] = useState<typeof items>([]);

  useEffect(() => {
    if (items.length === 0) {
      return;
    }

    setMarkers((prev) => [
      ...prev,
      ...items.filter((item) => !markers.map((m) => m.id).includes(item.id)),
    ]);
  }, [items.length]);

  useEffect(() => {
    map.panTo({ lat: props.center.latitude, lng: props.center.longitude });
  }, [props.center.latitude, props.center.longitude]);

  const debouncedBoundsChange = debounce(
    (bounds: LatLngBounds) => props.onBoundsChange(bounds),
    { wait: 500 },
  );

  useMapEvents({
    moveend: () => {
      // todo: no-op for now to save bandwidth;
      // debouncedBoundsChange(map.getBounds());
    },
  });

  return (
    <>
      {markers.map((item) => (
        <Marker
          key={item.id}
          position={item.position}
          icon={mapMarkerIcon}
          title={item.name}
          autoPanOnFocus={false}
        >
          <Tooltip permanent interactive>
            <div className="text-base font-normal text-black px-2 text-shadow-md text-shadow-white">
              {item.name}
            </div>
          </Tooltip>
        </Marker>
      ))}
    </>
  );
}
