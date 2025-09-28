import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { getDayhomeFn } from "@/features/dayhomes/get_dayhome.fn";
import { useServerFn } from "@tanstack/react-start";
import { updateDayhomeFn } from "@/features/dayhomes/update_dayhome.fn";
import { Button, LinkButton } from "@/components/ui/button";
import { Field } from "@/components/ui/fieldset";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/directory/$id/edit")({
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

  const form = useForm({
    defaultValues: {
      name: dayhome.name,
      address: dayhome.address,
      location: { latitude: dayhome.location.y, longitude: dayhome.location.x },
      phone: dayhome.phone ?? "",
      email: dayhome.email ?? "",
    },
    onSubmit: async ({ value }) => {
      await updateDayhome({
        data: {
          id: dayhome.id,
          name: value.name,
          address: value.address,
          location: {
            x: value.location.longitude,
            y: value.location.latitude,
          },
          phone: value.phone || null,
          email: value.email || null,
        },
      });

      alert("saved");

      navigate({ to: ".." });
    },
  });

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
                  <Label>Name</Label>
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
                  <Label>Address</Label>
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

            <form.Field name="location">
              {(field) => (
                <Field>
                  <Label>Location (Latitude, Longitude)</Label>
                  <div className="flex gap-4 flex-wrap md:flex-nowrap">
                    <div className="flex items-center space-x-1 w-full">
                      <label>Lat</label>
                      <Input
                        id={field.name}
                        type="number"
                        value={field.state.value.latitude}
                        onChange={(e) =>
                          field.setValue((prev) => ({
                            ...prev,
                            latitude: +e.currentTarget.value,
                          }))}
                      />
                    </div>

                    <div className="flex items-center space-x-1 w-full">
                      <label>Lng</label>
                      <Input
                        id={field.name}
                        type="number"
                        value={field.state.value.longitude}
                        onChange={(e) =>
                          field.setValue((prev) => ({
                            ...prev,
                            longitude: +e.currentTarget.value,
                          }))}
                      />
                    </div>
                  </div>
                </Field>
              )}
            </form.Field>

            <form.Field name="phone">
              {(field) => (
                <Field>
                  <Label>Phone</Label>
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

            <form.Field name="email">
              {(field) => (
                <Field>
                  <Label>Email</Label>
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
