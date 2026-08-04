import { createContext, useContext } from "react";
import type { LatLng } from "@/lib/geocoding/types.ts";

type MapState = {
  center: LatLng;
  zoom: number;
  selectedId?: string;
};

type ContextProps = {
  selectMarker: (id: string) => void;
  dismissSheet: () => void;
  onMoveEnd: (data: MapState) => void;
};

const MapViewContext = createContext<ContextProps | null>(null);

export function useMapView() {
  const context = useContext(MapViewContext);

  if (!context) {
    throw new Error("useMapView must be used within a MapViewProvider");
  }
  return context;
}

export function MapViewProvider(
  props: ContextProps & { children: React.ReactNode },
) {
  return (
    <MapViewContext
      value={{
        selectMarker: props.selectMarker,
        dismissSheet: props.dismissSheet,
        onMoveEnd: props.onMoveEnd,
      }}
    >
      {props.children}
    </MapViewContext>
  );
}
