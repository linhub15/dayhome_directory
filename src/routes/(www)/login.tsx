import { AppLayout } from "@/components/blocks/layouts/app_layout.tsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { authClient } from "@/lib/auth/better_auth_client.ts";
import { GoogleOAuth } from "@/lib/auth/google_oauth.tsx";
import type { FileRoutesByTo } from "@/routeTree.gen.ts";
import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import z from "@zod/zod";
import { InfoIcon } from "lucide-react";

const searchParams = z.object({
  /** Make sure this is a real path */
  redirect: z
    .string()
    .optional()
    .transform((val) => val as keyof FileRoutesByTo),
});

export const Route = createFileRoute("/(www)/login")({
  validateSearch: searchParams,
  component: RouteComponent,
});

function RouteComponent() {
  const session = authClient.useSession();
  const { redirect } = Route.useSearch();

  if (session.data?.user) {
    return <Navigate to="/profile" />;
  }
  return (
    <AppLayout>
      <div className="space-y-12">
        <Card className="max-w-sm mx-2 sm:mx-auto mt-28">
          <CardHeader>
            <CardTitle>Childcare Provider Login</CardTitle>
            <CardDescription>
              <p>Login to manage your listings, post vacancies and more.</p>
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <GoogleOAuth redirect={redirect} />
          </CardContent>
          <CardFooter>
            <p className="w-full text-muted-foreground text-sm leading-normal font-normal group-has-data-[orientation=horizontal]/field:text-balance last:mt-0 nth-last-2:-mt-1 [[data-variant=legend]+&]:-mt-1.5 [&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4 text-center">
              <Link to="/privacy">Privacy Policy</Link>
            </p>
          </CardFooter>
        </Card>

        <Card className="max-w-sm mx-2 sm:mx-auto">
          <CardContent>
            <CardDescription className="flex gap-2">
              <div className="py-1">
                <InfoIcon className="size-4" />
              </div>
              <p className="flex-wrap">
                We currently don't have accounts for parents. But would love to
                hear how we can, please send us a message on our{" "}
                <a
                  className="underline hover:text-primary"
                  href="/home#contact"
                >
                  contact form
                </a>
                .
              </p>
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
