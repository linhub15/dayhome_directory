import { debounce } from "@tanstack/react-pacer";
import z from "@zod/zod";
import type { LatLngExpression } from "leaflet";
import {
  memo,
  type Ref,
  useCallback,
  useImperativeHandle,
  useMemo,
} from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { pinClusterIcon } from "@/components/ui/map/pin_cluster_icon.ts";
import {
  mapAvailableIcon,
  mapDefaultIcon,
} from "@/components/ui/map/pin_icon.ts";
import { useMapView } from "@/features/dayhomes/dayhome_map/map_view_provider.tsx";
import { useListDayhomes } from "@/features/dayhomes/dayhome_map/use_list_dayhomes.ts";
import type { LatLng } from "@/lib/geocoding/types.ts";
import { Route } from "@/routes/map/index.tsx";

type MapState = {
  center: LatLng;
  zoom: number;
  selectedId?: string;
};

const zMapStateFromSearch = z.string().transform((s) => {
  const [latitude, longitude, zoom] = s.split(",");
  return {
    latitude: Number(latitude),
    longitude: Number(longitude),
    zoom: Number(zoom),
  };
});

export function MapView({ children }: { children: React.ReactNode }) {
  const search = new URLSearchParams(window.location.search);
  const initial = zMapStateFromSearch.parse(search.get("l"));

  return (
    <MapContainer
      style={{ height: "100vh", width: "100%", isolation: "isolate" }}
      center={{ lat: initial.latitude, lng: initial.longitude }}
      zoom={initial.zoom ?? 11}
      zoomControl={false}
      zoomAnimation={true}
      markerZoomAnimation={true}
      doubleClickZoom={true}
      scrollWheelZoom={true}
      minZoom={10}
      maxZoom={16}
      dragging={true}
      fadeAnimation={true}
      attributionControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {children}
    </MapContainer>
  );
}

type InnerMapProps = {
  ref: Ref<{
    panTo: (latLng: LatLngExpression, zoom: number) => void;
    locate: () => void;
  }>;
};

export function InnerMap(props: InnerMapProps) {
  const map = useMap();
  const { onMoveEnd, dismissSheet, selectMarker } = useMapView();
  const filters = Route.useSearch({ select: ({ filters }) => filters });
  const { data: items } = useListDayhomes({
    filters: filters,
  });

  useImperativeHandle(props.ref, () => {
    return {
      panTo: (latLng: LatLngExpression, zoom: number) => {
        map.setView(latLng, zoom, { animate: true });
      },
      locate: () => {
        map.locate({ setView: true, enableHighAccuracy: true, maxZoom: 14 });
      },
    };
  }, [map]);

  const markers = useMemo(
    () =>
      items?.map((d) => ({
        id: d.id,
        name: d.name,
        position: {
          lat: d.location.y,
          lng: d.location.x,
        } as LatLngExpression,
        isLicensed: d.isLicensed,
        ageGroups: d.ageGroups || [],
        hasVacancy: d.vancancies.length > 0,
      })) ?? [],
    [items],
  );

  const mapStateChange = debounce(
    (data: MapState) => {
      onMoveEnd(data);
    },
    { wait: 500 },
  );

  useMapEvents({
    dragstart: () => {
      dismissSheet();
    },
    moveend: () => {
      const center = map.getCenter();
      mapStateChange({
        center: {
          latitude: center.lat,
          longitude: center.lng,
        },
        zoom: map.getZoom(),
      });
    },
  });

  const handleSelectMarker = useCallback(
    (id: string, position: LatLngExpression) => {
      selectMarker(id);

      const targetZoom = map.getZoom();
      const targetPoint = map
        .project(position, targetZoom)
        .subtract([0, map.getSize().y / -3.5]);
      const targetLatLng = map.unproject(targetPoint, targetZoom);
      map.setView(targetLatLng, targetZoom, { animate: true });
    },
    [selectMarker, map],
  );

  return (
    <MarkerClusterGroup
      iconCreateFunction={pinClusterIcon}
      zoomToBoundsOnClick
      animate
      showCoverageOnHover={false}
    >
      {markers.map((item) => (
        <MarkerItem key={item.id} item={item} onSelect={handleSelectMarker} />
      ))}
    </MarkerClusterGroup>
  );
}

const MarkerItem = memo(function MarkerItem({
  item,
  onSelect,
}: {
  item: {
    id: string;
    name: string;
    position: LatLngExpression;
    isLicensed: boolean;
    ageGroups: string[];
    hasVacancy: boolean;
  };
  onSelect: (id: string, position: LatLngExpression) => void;
}) {
  const handleClick = () => {
    onSelect(item.id, item.position);
  };

  return (
    <Marker
      position={item.position}
      icon={item.hasVacancy ? mapAvailableIcon : mapDefaultIcon}
      title={item.name}
      autoPanOnFocus={false}
      eventHandlers={{ click: handleClick }}
    >
      {/* {map.getZoom() >= 14 && (
            <Tooltip permanent interactive>
              <div className="text-base font-normal text-black px-2 text-shadow-md text-shadow-white capitalize">
                {item.name}
              </div>
            </Tooltip>
          )} */}
    </Marker>
  );
});
