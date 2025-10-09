import { Nav } from "@/components/blocks/nav/nav";
import { LinkButton } from "@/components/ui/button";
import { DayhomeSearch } from "@/features/dayhomes/dayhome_search";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(www)/home")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Nav />
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="max-w-2xl">
          <div className="text-center">
            <h1 className="text-4xl font-light tracking-tight text-balance text-gray-900 sm:text-6xl">
              Find{" "}
              <em className="font-bold">
                Edmonton
              </em>{" "}
              Childcare
            </h1>
            <p className="mt-8 text-lg text-pretty text-gray-500 sm:text-xl/8">
              Search from a curated list of dayhomes and daycares in Edmonton.
            </p>
          </div>
        </div>

        <div className="text-center mt-10 max-w-md w-full mx-auto py-8 space-y-2">
          <DayhomeSearch />
          <LinkButton variant="link" size="sm" to="/directory">
            View all listings
          </LinkButton>
        </div>

        <div>
          <p className="mt-8 text-sm text-center text-gray-500">
            Are you a{" "}
            <strong>childcare provider</strong>? Contact us to get listed for
            free.
          </p>
        </div>
      </div>
    </>
  );
}
