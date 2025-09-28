import { LinkButton } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex items-center justify-center h-screen">
      <LinkButton to="/directory">
        Go to Directory
      </LinkButton>
    </div>
  );
}
