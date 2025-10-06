import { Button, LinkButton } from "@/components/ui/button";
import { Field } from "@/components/ui/fieldset";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PinnedMap } from "@/components/ui/pinned_map";
import {
  createDayhomeFn,
  CreateDayhomRequest,
} from "@/features/dayhomes/create_dayhome.fn";
import { useGeocode } from "@/lib/geocoding/use_geocode";
import { useForm, useStore } from "@tanstack/react-form";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";

export const Route = createFileRoute("/directory/new")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const createDayhome = useServerFn(createDayhomeFn);

  const form = useForm({
    defaultValues: {
      name: "",
      address: "",
      location: { x: 0, y: 0 },
    } satisfies CreateDayhomRequest,
    onSubmit: async ({ value }) => {
      await createDayhome({
        data: { ...value },
      });

      alert("Dayhome created!");

      await navigate({ to: "/directory" });
    },
  });

  const address = useStore(form.store, (state) => state.values.address);

  const { data: geocode } = useGeocode(address);

  return (
    <div className="max-w-lg mx-auto my-8">
      <form
        className="space-y-6"
        id={form.formId}
        onSubmit={async (e) => {
          e.preventDefault();
          e.stopPropagation();
          await form.handleSubmit(e);
        }}
      >
        <form.Field name="name">
          {(field) => (
            <Field>
              <Label htmlFor={field.name}>Name</Label>
              <Input
                id={field.name}
                type="text"
                value={field.state.value}
                onChange={(e) => field.setValue(e.currentTarget.value.trim())}
              />
            </Field>
          )}
        </form.Field>

        <form.Field name="address">
          {(field) => (
            <Field>
              <Label htmlFor={field.name}>Address</Label>
              <Input
                id={field.name}
                type="text"
                value={field.state.value}
                onChange={(e) => field.setValue(e.currentTarget.value)}
                onBlur={(e) => field.setValue(e.currentTarget.value.trim())}
              />
            </Field>
          )}
        </form.Field>

        <Field>
          <PinnedMap
            location={geocode && {
              lat: geocode.latitude,
              lng: geocode?.longitude,
            }}
          />
        </Field>

        <div className="flex justify-between">
          <LinkButton variant="secondary" to="..">Cancel</LinkButton>
          <Button type="submit">Create listing</Button>
        </div>
      </form>
    </div>
  );
}
