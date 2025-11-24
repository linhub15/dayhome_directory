import { LinkButton } from "@/components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { ClaimListingForm } from "@/features/claim_listing/claim_listing_form.tsx";
import { useGetDayhome } from "@/features/dayhomes/get_dayhome/use_get_dayhome.ts";
import { getSessionFn } from "@/lib/auth/get_session_fn.ts";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { ArrowLeftIcon } from "lucide-react";

export const Route = createFileRoute("/directory/$id/claim")({
  component: RouteComponent,
  beforeLoad: async ({ params }) => {
    const { user } = await getSessionFn();

    if (!user) {
      const { id } = params;
      throw redirect({
        to: "/login",
        search: { redirect: `/directory/${id}/claim` },
      });
    }
  },
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const { id } = Route.useParams();
  const { data: dayhome, isLoading } = useGetDayhome(id);

  if (!dayhome && !isLoading) {
    alert("Dayhome not found");
    navigate({ to: ".." });
  }

  // navigate to listing page if already claimed
  // toast a message

  return (
    <div className="space-y-6">
      <div>
        <LinkButton variant="outline" to="/directory/$id" params={{ id: id }}>
          <ArrowLeftIcon />
          Back to the listing
        </LinkButton>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Claiming {dayhome?.name}</CardTitle>
          <div>{dayhome?.address}</div>
        </CardHeader>
        <CardContent>
          <ClaimListingForm dayhomeId={id} />
        </CardContent>
      </Card>
    </div>
  );
}
