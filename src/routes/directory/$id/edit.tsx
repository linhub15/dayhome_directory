import { Button, LinkButton } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field } from "@/components/ui/fieldset";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PinnedMap } from "@/components/ui/pinned_map";
import { getDayhomeFn } from "@/features/dayhomes/get_dayhome.fn";
import { updateDayhomeFn } from "@/features/dayhomes/update_dayhome.fn";
import { useGeocode } from "@/lib/geocoding/use_geocode";
import { useForm, useStore } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";

export const Route = createFileRoute("/directory/$id/edit")({
  ssr: "data-only",
  component: RouteComponent,
  loader: async ({ params }) => {
    const dayhome = await getDayhomeFn({ data: { id: params.id } });

    if (!dayhome) {
      throw notFound();
    }

    return dayhome;
  },
});

function RouteComponent() {
  const dayhome = Route.useLoaderData();
  const updateDayhome = useServerFn(updateDayhomeFn);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm({
    defaultValues: {
      name: dayhome.name,
      address: dayhome.address,
      location: { latitude: dayhome.location.y, longitude: dayhome.location.x },
      phone: dayhome.phone,
      email: dayhome.email,
      isLicensed: dayhome.isLicensed ?? false,
      agencyName: dayhome.agencyName,
    },
    onSubmit: async ({ value }) => {
      await updateDayhome({
        data: {
          id: dayhome.id,
          name: value.name ? value.name.trim() : "",
          address: value.address ? value.address.trim() : "",
          location: geocode && {
            x: geocode.longitude,
            y: geocode.latitude,
          },
          phone: value.phone ?? null,
          email: value.email ?? null,
          isLicensed: value.isLicensed,
          agencyName: value.agencyName ? value.agencyName.trim() : null,
        },
      });

      alert("saved");

      navigate({ to: "..", reloadDocument: true });
      queryClient.invalidateQueries({ queryKey: ["dayhomes"] });
    },
  });

  const address = useStore(form.store, (state) => state.values.address);
  const { data: geocode } = useGeocode(address);

  return (
    <div className="max-w-lg mx-auto my-8">
      <Card>
        <CardContent>
          <form
            className="space-y-6"
            onSubmit={async (e) => {
              e.preventDefault();
              e.stopPropagation();
              await form.handleSubmit();
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
                    onChange={(e) =>
                      field.setValue(e.currentTarget.value.trim())}
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

            <form.Field name="location">
              {(field) => (
                <Field>
                  <Label htmlFor={field.name}>
                    Location (Latitude, Longitude)
                  </Label>
                  <div className="flex gap-4 flex-wrap md:flex-nowrap">
                    <div className="flex items-center space-x-1 w-full">
                      <label>Lat</label>
                      <Input
                        id={field.name}
                        type="number"
                        value={geocode?.latitude}
                        onChange={(e) =>
                          field.setValue((prev) => ({
                            ...prev,
                            latitude: +e.currentTarget.value,
                          }))}
                        disabled
                      />
                    </div>

                    <div className="flex items-center space-x-1 w-full">
                      <label>Lng</label>
                      <Input
                        id={field.name}
                        type="number"
                        value={geocode?.longitude}
                        onChange={(e) =>
                          field.setValue((prev) => ({
                            ...prev,
                            longitude: +e.currentTarget.value,
                          }))}
                        disabled
                      />
                    </div>
                  </div>
                  <div>
                    <PinnedMap
                      location={geocode && {
                        lat: geocode.latitude,
                        lng: geocode?.longitude,
                      }}
                    />
                  </div>
                </Field>
              )}
            </form.Field>

            <form.Field name="phone">
              {(field) => (
                <Field>
                  <Label htmlFor={field.name}>Phone</Label>
                  <Input
                    id={field.name}
                    type="text"
                    value={field.state.value || ""}
                    onChange={(e) => field.setValue(e.currentTarget.value)}
                  />
                </Field>
              )}
            </form.Field>

            <form.Field name="email">
              {(field) => (
                <Field>
                  <Label htmlFor={field.name}>Email</Label>
                  <Input
                    id={field.name}
                    type="text"
                    value={field.state.value || ""}
                    onChange={(e) => field.setValue(e.currentTarget.value)}
                  />
                </Field>
              )}
            </form.Field>

            <form.Field name="agencyName">
              {(field) => (
                <Field>
                  <Label htmlFor={field.name}>Agency Name</Label>
                  <Input
                    id={field.name}
                    type="text"
                    value={field.state.value || ""}
                    onChange={(e) => field.setValue(e.currentTarget.value)}
                  />
                </Field>
              )}
            </form.Field>

            <form.Field name="isLicensed">
              {(field) => (
                <Field>
                  <Label htmlFor={field.name}>Is Licensed</Label>
                  <Input
                    id={field.name}
                    type="checkbox"
                    checked={field.state.value}
                    onChange={(e) => field.setValue(e.currentTarget.checked)}
                  />
                </Field>
              )}
            </form.Field>

            <div className="flex justify-between">
              <LinkButton variant="secondary" to="..">Cancel</LinkButton>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
