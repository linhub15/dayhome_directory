import { mapMarkerIcon } from "@/components/ui/map/pin_icon.ts";
import type { LatLng } from "@/lib/geocoding/types.ts";
import { debounce } from "@tanstack/react-pacer";
import type { LatLngBounds, LatLngExpression } from "leaflet";
import { useEffect, useState } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  Tooltip,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { MapRef } from "react-leaflet/MapContainer";
import { ListDayhomesData } from "./use_list_dayhomes.ts";

type Props = {
  center: LatLng;
  items: ListDayhomesData;
  onMoveEnd: (data: MapState) => void;
  onSelect: (id: string) => void;
};

type MapState = {
  center: LatLng;
  zoom: number;
  bounds: LatLngBounds;
  selectedId?: string;
};

export function DayhomeMap({ center, items, onMoveEnd, onSelect }: Props) {
  return (
    <MapContainer
      style={{ height: "100vh", width: "100%", isolation: "isolate" }}
      center={{ lat: center.latitude, lng: center.longitude }}
      // Zoom
      zoom={12}
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
      whenReady={(m: { target: MapRef }) => {
        const { target } = m;
        if (!target) return;

        onMoveEnd({
          center: {
            latitude: target.getCenter().lat,
            longitude: target.getCenter().lng,
          },
          zoom: target.getZoom(),
          bounds: target.getBounds(),
        });
      }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <InnerMap
        items={items}
        onMoveEnd={onMoveEnd}
        onSelect={onSelect}
      />
    </MapContainer>
  );
}

function InnerMap(
  props: {
    items: ListDayhomesData;
    onMoveEnd: (data: MapState) => void;
    onSelect: (id: string) => void;
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

  const mapStateChange = debounce((data: MapState) => {
    props.onMoveEnd(data);
  }, { wait: 500 });

  useMapEvents({
    moveend: () => {
      const center = map.getCenter();
      mapStateChange({
        center: {
          latitude: center.lat,
          longitude: center.lng,
        },
        zoom: map.getZoom(),
        bounds: map.getBounds(),
      });
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
          eventHandlers={{
            click: () => {
              props.onSelect(item.id);

              const targetZoom = map.getZoom();
              const targetPoint = map.project(item.position, targetZoom)
                .subtract([0, map.getSize().y / -4]);
              const targetLatLng = map.unproject(targetPoint, targetZoom);
              map.setView(targetLatLng, targetZoom);
            },
          }}
        >
          {map.getZoom() >= 14 && (
            <Tooltip permanent interactive>
              <div className="text-base font-normal text-black px-2 text-shadow-md text-shadow-white">
                {item.name}
              </div>
            </Tooltip>
          )}
        </Marker>
      ))}
    </>
  );
}
