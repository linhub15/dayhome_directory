import { Button, LinkButton } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/fieldset";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PinnedMap } from "@/components/ui/pinned_map";
import { useDeleteDayhome } from "@/features/dayhomes/delete_dayhome/use_delete_dayhome";
import { getDayhomeFn } from "@/features/dayhomes/get_dayhome.fn";
import { dayhomeKeys } from "@/features/dayhomes/query_keys";
import { updateDayhomeFn } from "@/features/dayhomes/update_dayhome/update_dayhome.fn";
import { weekdayIso } from "@/lib/constants/weekday";
import { useGeocode } from "@/lib/geocoding/use_geocode";
import { useForm, useStore } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";

const weekdays = [1, 2, 3, 4, 5, 6, 7] as const;
const ageGroups = [
  { label: "Infant", value: "infant" },
  { label: "Toddler", value: "toddler" },
  { label: "Preschool", value: "preschool" },
  { label: "Kindergarten", value: "kindergarten" },
  { label: "Grade School", value: "grade_school" },
] as const;

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
  const navigate = useNavigate();
  const dayhome = Route.useLoaderData();
  const queryClient = useQueryClient();
  const updateDayhome = useServerFn(updateDayhomeFn);
  const deleteDayhome = useDeleteDayhome();

  const handleDeleteDayhome = async () => {
    await deleteDayhome.mutateAsync(dayhome.id);
    await navigate({ to: "/directory" });
  };

  const form = useForm({
    defaultValues: {
      name: dayhome.name,
      address: dayhome.address,
      location: { latitude: dayhome.location.y, longitude: dayhome.location.x },
      phone: dayhome.phone,
      email: dayhome.email,
      isLicensed: dayhome.isLicensed ?? false,
      agencyName: dayhome.agencyName,
      ageGroups: new Set(dayhome.ageGroups),
      openHours: dayhome.openHours.map((hour) => ({
        ...hour,
        openAt: hour.openAt.slice(0, 5),
        closeAt: hour.closeAt.slice(0, 5),
      })),
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
          ageGroups: Array.from(value.ageGroups),
          openHours: value.openHours.map((hour) => ({
            ...hour,
            dayhomeId: dayhome.id,
          })),
        },
      });

      toast.success("Saved");

      navigate({ to: ".." });
      queryClient.invalidateQueries({ queryKey: dayhomeKeys.lists() });
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
                    onChange={(e) => field.setValue(e.currentTarget.value)}
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
                      <label htmlFor={field.name}>Lat</label>
                      <Input
                        id={field.name}
                        type="number"
                        value={geocode?.latitude}
                        onChange={(e) =>
                          field.setValue((prev) => ({
                            ...prev,
                            latitude: +e.currentTarget.value,
                          }))
                        }
                        disabled
                      />
                    </div>

                    <div className="flex items-center space-x-1 w-full">
                      <label htmlFor={field.name}>Lng</label>
                      <Input
                        id={field.name}
                        type="number"
                        value={geocode?.longitude}
                        onChange={(e) =>
                          field.setValue((prev) => ({
                            ...prev,
                            longitude: +e.currentTarget.value,
                          }))
                        }
                        disabled
                      />
                    </div>
                  </div>
                  <div>
                    <PinnedMap
                      location={
                        geocode && {
                          lat: geocode.latitude,
                          lng: geocode?.longitude,
                        }
                      }
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

            <form.Field name="ageGroups">
              {(field) => (
                <Field>
                  <Label htmlFor={field.name}>Age Groups</Label>
                  <div className="space-y-2">
                    {ageGroups.map((ageGroup) => (
                      <div className="flex gap-2" key={ageGroup.value}>
                        <Label className="py-1">
                          <Checkbox
                            value={ageGroup.value}
                            checked={field.state.value.has(ageGroup.value)}
                            onCheckedChange={(checked) => {
                              field.setValue((prev) => {
                                const changed = new Set(prev);
                                if (checked) {
                                  changed.add(ageGroup.value);
                                } else {
                                  changed.delete(ageGroup.value);
                                }
                                return changed;
                              });
                            }}
                          />
                          {ageGroup.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </Field>
              )}
            </form.Field>

            <form.Field name="openHours">
              {(field) => (
                <Field>
                  <Label htmlFor={field.name}>Open Hours</Label>
                  <div>
                    {weekdays.map((weekday) => (
                      <OpenHourInput
                        key={weekday}
                        weekday={weekday}
                        value={field.state.value.find(
                          (v) => v.weekday === weekday,
                        )}
                        onChange={(value) =>
                          field.setValue((prev) => {
                            const existing = prev.find(
                              (v) => v.weekday === weekday,
                            );

                            if (existing) {
                              existing.openAt = value.openAt;
                              existing.closeAt = value.closeAt;
                              return [...prev];
                            }

                            return [
                              ...prev,
                              {
                                id: crypto.randomUUID(),
                                weekday: weekday,
                                ...value,
                              },
                            ];
                          })
                        }
                      />
                    ))}
                  </div>
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
              <LinkButton variant="secondary" to="..">
                Cancel
              </LinkButton>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="py-12 text-center">
        <Button
          type="button"
          variant="destructive"
          onClick={handleDeleteDayhome}
        >
          Permanently Delete
        </Button>
      </div>
    </div>
  );
}

function OpenHourInput({
  weekday,
  value,
  onChange,
}: {
  weekday: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  value: { openAt: string; closeAt: string } | undefined;
  onChange: (value: { openAt: string; closeAt: string }) => void;
}) {
  return (
    <div className="grid grid-cols-3">
      <span>{weekdayIso[weekday]}</span>
      <Input
        type="time"
        value={value?.openAt}
        onChange={(e) =>
          onChange({
            openAt: e.currentTarget.value,
            closeAt: value?.closeAt || "",
          })
        }
      />
      <Input
        type="time"
        value={value?.closeAt}
        onChange={(e) =>
          onChange({
            openAt: value?.openAt || "",
            closeAt: e.currentTarget.value,
          })
        }
      />
    </div>
  );
}
