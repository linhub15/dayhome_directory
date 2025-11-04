import { createFileRoute } from "@tanstack/react-router";
import { ContactForm } from "@/components/blocks/contact/contact_form.tsx";
import { Nav } from "@/components/blocks/nav/nav.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";

export const Route = createFileRoute("/(www)/info")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <Nav />

      <div className="max-w-lg mx-2 sm:mx-auto rounded-3xl space-y-12">
        <h2 className="text-2xl text-center my-4 md:my-10">
          What is this website?
        </h2>
        <Card>
          <CardContent>
            <div className="space-y-3">
              <p>Hi there 👋, thanks for using the site!</p>
              <p>
                We're building this to improve the experience of finding
                childcare for both parents and providers.
              </p>
              <p>
                Our data comes from the Government of Alberta (
                <a
                  className="underline text-blue-600 hover:opacity-80"
                  href="https://open.alberta.ca/opendata/childcareinformation"
                >
                  open.alberta.ca/opendata/childcareinformation
                </a>
                ) and it's up-to-date as of June 2025. Unlicensed and private
                providers are manually entered by us.
              </p>

              <p>
                If you notice wrong info, or things not working, please contact
                us in with form below.
              </p>

              <p className="pt-4">All the best,</p>
              <p>Discover Care Team</p>
            </div>
          </CardContent>
        </Card>

        <ContactForm />
      </div>
    </div>
  );
}
