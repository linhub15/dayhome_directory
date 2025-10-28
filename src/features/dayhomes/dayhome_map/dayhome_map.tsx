import { debounce } from "@tanstack/react-pacer";
import type { LatLngBounds, LatLngExpression } from "leaflet";
import { type Ref, useImperativeHandle } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  Tooltip,
  useMap,
  useMapEvents,
} from "react-leaflet";
import type { MapRef } from "react-leaflet/MapContainer";
import MarkerClusterGroup from "react-leaflet-cluster";
import { pinClusterIcon } from "@/components/ui/map/pin_cluster_icon.ts";
import { mapMarkerIcon } from "@/components/ui/map/pin_icon.ts";
import type { LatLng } from "@/lib/geocoding/types.ts";
import type { ListDayhomesData } from "./use_list_dayhomes.ts";

type Props = {
  ref: Ref<{
    panTo: (latLng: LatLngExpression, zoom: number) => void;
    locate: () => void;
  }>;
  center: LatLng;
  zoom?: number;
  items: ListDayhomesData;
  onMoveEnd: (data: MapState) => void;
  onSelect: (id: string) => void;
  onDragStart: () => void;
};

//todo: reduce props and pass in map state instead of so many different ones
type MapState = {
  center: LatLng;
  zoom: number;
  bounds: LatLngBounds;
  selectedId?: string;
};

export function DayhomeMap({
  ref,
  center,
  zoom,
  items,
  onMoveEnd,
  onSelect,
  onDragStart,
}: Props) {
  return (
    <MapContainer
      style={{ height: "100vh", width: "100%", isolation: "isolate" }}
      center={{ lat: center.latitude, lng: center.longitude }}
      // Zoom
      zoom={zoom ?? 11}
      zoomControl={false}
      zoomAnimation={true}
      markerZoomAnimation={true}
      doubleClickZoom={true}
      scrollWheelZoom={true}
      minZoom={10}
      maxZoom={16}
      //----
      dragging={true}
      fadeAnimation={true}
      attributionControl={true}
      // @ts-expect-error: react-leaflet types are out of date
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
        ref={ref}
        items={items}
        onMoveEnd={onMoveEnd}
        onSelect={onSelect}
        onDragStart={onDragStart}
      />
    </MapContainer>
  );
}

function InnerMap(props: {
  ref: Ref<{
    panTo: (latLng: LatLngExpression, zoom: number) => void;
    locate: () => void;
  }>;
  items: ListDayhomesData;
  onMoveEnd: (data: MapState) => void;
  onSelect: (id: string) => void;
  onDragStart: () => void;
}) {
  const map = useMap();

  useImperativeHandle(props.ref, () => {
    return {
      panTo: (latLng: LatLngExpression, zoom: number) => {
        map.panTo(latLng);
        map.setZoom(zoom);
      },
      locate: () => {
        map.locate({ setView: true, enableHighAccuracy: true, maxZoom: 14 });
      },
    };
  }, [map]);

  const markers =
    props.items?.map((d) => ({
      id: d.id,
      name: d.name,
      position: { lat: d.location.y, lng: d.location.x } as LatLngExpression,
      isLicensed: d.isLicensed,
      ageGroups: d.ageGroups || [],
    })) ?? [];

  const mapStateChange = debounce(
    (data: MapState) => {
      props.onMoveEnd(data);
    },
    { wait: 500 },
  );

  useMapEvents({
    dragstart: () => {
      props.onDragStart();
    },
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
    <MarkerClusterGroup
      iconCreateFunction={pinClusterIcon}
      zoomToBoundsOnClick
      animate
      animateAddingMarkers
      showCoverageOnHover={false}
    >
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
              const targetPoint = map
                .project(item.position, targetZoom)
                .subtract([0, map.getSize().y / -3.5]);
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
    </MarkerClusterGroup>
  );
}
