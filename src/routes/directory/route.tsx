import { Nav } from "@/components/blocks/nav/nav";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/directory")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <Nav />
      <Outlet />
    </div>
  );
}
