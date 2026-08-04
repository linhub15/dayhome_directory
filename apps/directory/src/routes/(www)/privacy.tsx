import { AppLayout } from "@/components/blocks/layouts/app_layout.tsx";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(www)/privacy")({
  component: RouteComponent,
});

function RouteComponent() {
  return <AppLayout>Privacy Policy</AppLayout>;
}
