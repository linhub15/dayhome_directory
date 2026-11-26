import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/directory/$id/claim")({
  beforeLoad: ({ params }) => {
    throw redirect({ to: "/directory/$id", params, replace: true });
  },
});
