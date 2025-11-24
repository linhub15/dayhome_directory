import { ContactForm } from "@/components/blocks/contact/contact_form.tsx";
import { Faq } from "@/components/blocks/faq/faq.tsx";
import { Nav } from "@/components/blocks/nav/nav";
import { LinkButton } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowDownIcon, MapPinnedIcon } from "lucide-react";

export const Route = createFileRoute("/(www)/home")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Nav />
      <div className="px-2">
        <div className="flex flex-col gap-13 items-center justify-center py-24">
          <img
            className="w-full max-w-xl rounded-lg shadow-lg"
            src="/banner.jpg"
            alt="Discover Care"
            width={768}
            height={512}
          />

          <div className="max-w-2xl">
            <div className="text-center">
              <h1 className="text-4xl font-light tracking-tight text-balance text-gray-900 sm:text-6xl">
                Find Childcare in <em className="font-bold">Edmonton</em>
              </h1>
              <p className="mt-8 text-lg text-pretty text-gray-500 sm:text-xl/8">
                We've put together a map of all the licensed dayhomes and
                daycares in Edmonton and surrounding areas.
              </p>
            </div>
          </div>

          <div className="text-center max-w-xl w-full mx-auto space-y-3">
            <div className="rounded-full px-3 py-1 text-sm/6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
              <p>Looking for childcare nearby?</p>
            </div>
            <ArrowDownIcon className="mx-auto h-6 w-6 text-gray-400 animate-bounce" />
            <LinkButton variant="default" size="lg" to="/map">
              <MapPinnedIcon />
              See the Map
            </LinkButton>
            <p className="text-muted-foreground text-sm">
              We have over 800 daycares and dayhomes listed
            </p>
          </div>
        </div>

        <Faq />

        <div className="max-w-lg mx-auto mb-24" id="contact">
          <ContactForm />
        </div>
      </div>
    </>
  );
}
