import { DayhomeMap } from "@/features/dayhomes/dayhome_map/dayhome_map";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/directory/map")({
  ssr: "data-only",
  component: RouteComponent,
});
function RouteComponent() {
  const initialCenter = { latitude: 53.4792, longitude: -113.565081 };

  return (
    // Negative margin to offset absolute nav
    <div className="-mt-15">
      <DayhomeMap
        center={initialCenter}
      />
    </div>
  );
}
