import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Link className="p-4 rounded border" to="/directory">
        Go to Directory
      </Link>
    </div>
  );
}
