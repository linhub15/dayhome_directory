import { Button } from "@/components/ui/button.tsx";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field.tsx";
import { Input } from "@/components/ui/input.tsx";
import {
  claimListingFn,
  type ClaimListingRequest,
} from "@/features/claim_listing/claim_listing.fn.ts";
import { listingClaimKeys } from "@/features/claim_listing/query_keys.ts";
import { useGetDayhome } from "@/features/dayhomes/get_dayhome/use_get_dayhome.ts";
import { authClient } from "@/lib/auth/better_auth_client.ts";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ShieldCheckIcon } from "lucide-react";

/**
 * Idea to validate the ownership of the person.
 * 1. User enters in email, or uses default account email
 * 2. User clicks button to verify, we search the web with AI to find if it is likely the correct email
 * 3. If it matches our records, they are verified
 * 4. If not, we ask them to provide either license picture (for facility) or something for dayhome operators
 */

type Props = {
  dayhomeId: string;
};

export function ClaimListingForm(props: Props) {
  // todo:
  // - let them specify if there is currently vacancy
  // - let them provide age group info
  // - pending state
  // - success state
  // - failure state
  const navigate = useNavigate();
  const { data: dayhome } = useGetDayhome(props.dayhomeId);

  const { data: auth } = authClient.useSession();

  const claimListing = useClaimListing();

  const form = useForm({
    defaultValues: {
      email: dayhome?.email ?? auth?.user.email,
    },
    validators: {
      onSubmit: (_values) => {
        // todo
      },
    },
    onSubmit: ({ value }) => {
      claimListing.mutateAsync(
        {
          dayhomeId: props.dayhomeId,
          email: value.email,
        },
        {
          onSuccess: () => {
            navigate({ to: "/directory/$id", params: { id: props.dayhomeId } });
          },
        },
      );
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        <FieldSet>
          <form.Field name="email">
            {(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>
                  Email of your childcare program
                </FieldLabel>
                <Input
                  id={field.name}
                  type="email"
                  placeholder="mary@gmail.com"
                  required
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </Field>
            )}
          </form.Field>
        </FieldSet>

        <Field orientation="horizontal">
          <Button type="submit">
            <ShieldCheckIcon /> Claim this listing
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}

function useClaimListing() {
  const queryClient = useQueryClient();
  const claimListing = useServerFn(claimListingFn);

  return useMutation({
    mutationFn: async (request: ClaimListingRequest) => {
      await claimListing({ data: request });
      queryClient.invalidateQueries({ queryKey: listingClaimKeys.list() });
    },
    onError: (error) => {
      alert(error.message);
    },
    onSuccess: () => {
      alert("Success! You've claimed the listing");
    },
  });
}
