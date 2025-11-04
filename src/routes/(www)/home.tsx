import { createFileRoute } from "@tanstack/react-router";
import { ContactForm } from "@/components/blocks/contact/contact_form.tsx";
import { Nav } from "@/components/blocks/nav/nav";
import { LinkButton } from "@/components/ui/button";

export const Route = createFileRoute("/(www)/home")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="px-2">
      <Nav />
      <div className="flex flex-col items-center justify-center py-24">
        <div className="max-w-2xl">
          <div className="text-center">
            <h1 className="text-4xl font-light tracking-tight text-balance text-gray-900 sm:text-6xl">
              Find Childcare in <em className="font-bold">Edmonton</em>
            </h1>
            <p className="mt-8 text-lg text-pretty text-gray-500 sm:text-xl/8">
              We've put together a map of all the licensed dayhomes and daycares
              in Edmonton and surrounding areas.
            </p>
          </div>
        </div>

        <div className="text-center mt-10 max-w-md w-full mx-auto py-8 space-y-2">
          <LinkButton variant="default" to="/map">
            See the Map
          </LinkButton>
        </div>
      </div>

      <div className="max-w-lg mx-auto mb-24" id="contact">
        <ContactForm />
      </div>
    </div>
  );
}
