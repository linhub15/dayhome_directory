import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Nav } from "@/components/blocks/nav/nav";

export const Route = createFileRoute("/directory")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <div>
        <div className="z-10 bg-background w-full h-15">
          <Nav />
        </div>
        <div className="md:pt-15">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
