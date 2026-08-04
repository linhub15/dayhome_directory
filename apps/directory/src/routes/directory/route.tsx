import { AppLayout } from "@/components/blocks/layouts/app_layout";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/directory")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}
