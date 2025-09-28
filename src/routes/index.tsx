import { LinkButton } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="max-w-2xl">
        <div className="text-center">
          <h1 className="text-4xl font-light tracking-tight text-balance text-gray-900 sm:text-6xl">
            Find{" "}
            <em className="font-bold">
              Edmonton
            </em>{" "}
            dayhomes and daycares
          </h1>
          <p className="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
            Search from a curated list of dayhomes and daycares in Edmonton.
          </p>
        </div>

        <div className="text-center mt-10">
          <LinkButton to="/directory">
            Go to Directory
          </LinkButton>
        </div>
      </div>

      <div>
        <p className="mt-8 text-sm text-center text-gray-400">
          Are you a childcare provider? Contact us to get listed for free.
        </p>
      </div>
    </div>
  );
}
