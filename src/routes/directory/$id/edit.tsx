import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/directory/$id/edit")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <form>
        here you can update the info for a dayhome
      </form>
    </div>
  );
}
