import { Button, LinkButton } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PinnedMap } from "@/components/ui/pinned_map";
import { getDayhomeFn } from "@/features/dayhomes/get_dayhome.fn";
import { listDayhomesAdminFn } from "@/features/dayhomes/list_dayhomes_admin.fn";
import {
  useUpdateDayhomeBasic,
  useUpdateDayhomeOpenHours,
} from "@/features/dayhomes/update_dayhome/use_update_dayhome";
import { assertAdminRequest } from "@/lib/auth/admin_middleware";
import { weekdayIso } from "@/lib/constants/weekday";
import { autocompleteGeocodeFn } from "@/lib/geocoding/autocomplete.fn";
import { useGeocode } from "@/lib/geocoding/use_geocode";
import { useDebouncedValue } from "@tanstack/react-pacer";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const ageGroups = [
  { label: "Infant", value: "infant" },
  { label: "Toddler", value: "toddler" },
  { label: "Preschool", value: "preschool" },
  { label: "Kindergarten", value: "kindergarten" },
  { label: "Grade School", value: "grade_school" },
] as const;

type AgeGroupValue = (typeof ageGroups)[number]["value"];

type Weekday = keyof typeof weekdayIso;

type OpenHourDraft = {
  enabled: boolean;
  openAt: string;
  closeAt: string;
};

type OpenHoursFormState = Record<Weekday, OpenHourDraft>;

export const Route = createFileRoute("/admin/")({
  server: {
    handlers: {
      GET: async ({ next, request }) => {
        assertAdminRequest(request);
        return next();
      },
    },
  },
  component: RouteComponent,
});

function RouteComponent() {
  const listDayhomes = useServerFn(listDayhomesAdminFn);
  const getDayhome = useServerFn(getDayhomeFn);
  const autocompleteGeocode = useServerFn(autocompleteGeocodeFn);
  const updateBasic = useUpdateDayhomeBasic();
  const updateOpenHours = useUpdateDayhomeOpenHours();

  const [selectedDayhomeId, setSelectedDayhomeId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddressMenuOpen, setIsAddressMenuOpen] = useState(false);
  const [debouncedSearchQuery] = useDebouncedValue(searchQuery.trim(), {
    wait: 250,
  });

  const { data: dayhomeOptions, isLoading: isLoadingOptions } = useQuery({
    queryKey: ["admin", "dayhomes", debouncedSearchQuery],
    queryFn: async () =>
      await listDayhomes({
        data: debouncedSearchQuery.length
          ? { query: debouncedSearchQuery }
          : {},
      }),
  });

  const { data: dayhome, isLoading: isLoadingDayhome } = useQuery({
    enabled: !!selectedDayhomeId,
    queryKey: ["admin", "dayhome", selectedDayhomeId],
    queryFn: async () => await getDayhome({ data: { id: selectedDayhomeId } }),
  });

  useEffect(() => {
    if (!dayhomeOptions?.length) {
      setSelectedDayhomeId("");
      return;
    }

    const selectedStillExists = dayhomeOptions.some(
      (option) => option.id === selectedDayhomeId,
    );

    if (!selectedStillExists) {
      setSelectedDayhomeId(dayhomeOptions[0].id);
    }
  }, [dayhomeOptions, selectedDayhomeId]);

  const [basicForm, setBasicForm] = useState({
    id: "",
    name: "",
    address: "",
    x: 0,
    y: 0,
    phone: "",
    email: "",
    isLicensed: false,
    agencyName: "",
    ageGroups: new Set<AgeGroupValue>(),
  });

  const [debouncedAddress] = useDebouncedValue(basicForm.address.trim(), {
    wait: 350,
  });

  const { data: addressSuggestions } = useQuery({
    queryKey: ["admin", "address-autocomplete", debouncedAddress],
    queryFn: async () =>
      await autocompleteGeocode({ data: { query: debouncedAddress } }),
    enabled: Boolean(selectedDayhomeId) && debouncedAddress.length >= 3,
  });

  const visibleAddressSuggestions = useMemo(() => {
    if (!addressSuggestions?.length) {
      return [];
    }

    const seen = new Set<string>();

    return addressSuggestions.filter((item) => {
      const key = item.address.trim().toLowerCase();
      if (!key || seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }, [addressSuggestions]);

  const [openHoursForm, setOpenHoursForm] = useState<OpenHoursFormState>({
    1: { enabled: false, openAt: "08:00", closeAt: "17:00" },
    2: { enabled: false, openAt: "08:00", closeAt: "17:00" },
    3: { enabled: false, openAt: "08:00", closeAt: "17:00" },
    4: { enabled: false, openAt: "08:00", closeAt: "17:00" },
    5: { enabled: false, openAt: "08:00", closeAt: "17:00" },
    6: { enabled: false, openAt: "08:00", closeAt: "17:00" },
    7: { enabled: false, openAt: "08:00", closeAt: "17:00" },
  });

  useEffect(() => {
    if (!dayhome) {
      return;
    }

    setIsAddressMenuOpen(false);

    setBasicForm({
      id: dayhome.id,
      name: dayhome.name,
      address: dayhome.address,
      x: dayhome.location.x,
      y: dayhome.location.y,
      phone: dayhome.phone ?? "",
      email: dayhome.email ?? "",
      isLicensed: dayhome.isLicensed,
      agencyName: dayhome.agencyName ?? "",
      ageGroups: new Set((dayhome.ageGroups ?? []) as AgeGroupValue[]),
    });

    const byWeekday = dayhome.openHours.reduce((acc, item) => {
      acc[item.weekday as Weekday] = {
        enabled: true,
        openAt: item.openAt.slice(0, 5),
        closeAt: item.closeAt.slice(0, 5),
      };
      return acc;
    }, {} as Partial<OpenHoursFormState>);

    setOpenHoursForm({
      1: byWeekday[1] ?? { enabled: false, openAt: "08:00", closeAt: "17:00" },
      2: byWeekday[2] ?? { enabled: false, openAt: "08:00", closeAt: "17:00" },
      3: byWeekday[3] ?? { enabled: false, openAt: "08:00", closeAt: "17:00" },
      4: byWeekday[4] ?? { enabled: false, openAt: "08:00", closeAt: "17:00" },
      5: byWeekday[5] ?? { enabled: false, openAt: "08:00", closeAt: "17:00" },
      6: byWeekday[6] ?? { enabled: false, openAt: "08:00", closeAt: "17:00" },
      7: byWeekday[7] ?? { enabled: false, openAt: "08:00", closeAt: "17:00" },
    });
  }, [dayhome]);

  const openHoursPayload = useMemo(() => {
    return (Object.entries(openHoursForm) as Array<[string, OpenHourDraft]>)
      .filter(([, value]) => value.enabled)
      .map(([weekday, value]) => ({
        weekday: Number(weekday) as Weekday,
        openAt: value.openAt,
        closeAt: value.closeAt,
      }));
  }, [openHoursForm]);

  const mapLocation = useMemo(() => {
    const latitude = basicForm.y;
    const longitude = basicForm.x;

    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude) ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      return undefined;
    }

    return {
      lat: latitude,
      lng: longitude,
    };
  }, [basicForm.x, basicForm.y]);

  const { data: geocode } = useGeocode(basicForm.address);

  useEffect(() => {
    if (!geocode) {
      return;
    }

    setBasicForm((previous) => {
      if (previous.x === geocode.longitude && previous.y === geocode.latitude) {
        return previous;
      }

      return {
        ...previous,
        x: geocode.longitude,
        y: geocode.latitude,
      };
    });
  }, [geocode]);

  useEffect(() => {
    if (!addressSuggestions?.length) {
      return;
    }

    const selectedSuggestion = addressSuggestions.find(
      (item) =>
        item.address.trim().toLowerCase() ===
        basicForm.address.trim().toLowerCase(),
    );

    if (!selectedSuggestion) {
      return;
    }

    setBasicForm((previous) => {
      if (
        previous.x === selectedSuggestion.longitude &&
        previous.y === selectedSuggestion.latitude
      ) {
        return previous;
      }

      return {
        ...previous,
        x: selectedSuggestion.longitude,
        y: selectedSuggestion.latitude,
      };
    });
  }, [addressSuggestions, basicForm.address]);

  const saveBasicDetails = async () => {
    if (!basicForm.id) {
      return;
    }

    await updateBasic.mutateAsync({
      id: basicForm.id,
      name: basicForm.name,
      address: basicForm.address,
      location: { x: basicForm.x, y: basicForm.y },
      phone: basicForm.phone,
      email: basicForm.email,
      isLicensed: basicForm.isLicensed,
      agencyName: basicForm.agencyName,
      ageGroups: Array.from(basicForm.ageGroups),
    });

    toast.success("Basic details saved");
  };

  const saveOpenHours = async () => {
    if (!basicForm.id) {
      return;
    }

    await updateOpenHours.mutateAsync({
      dayhomeId: basicForm.id,
      openHours: openHoursPayload,
    });

    toast.success("Open hours saved");
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Admin Dayhome Editor</h1>
        <LinkButton to="/map" variant="outline">
          Back to map
        </LinkButton>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select listing</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <FieldSet>
              <Label htmlFor="dayhome-search">
                Search by listing id, name, phone, or email
              </Label>
              <Input
                id="dayhome-search"
                placeholder="Type id, name, phone, or email"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.currentTarget.value)}
              />
            </FieldSet>

            <FieldSet>
              <Label htmlFor="dayhome-select">Dayhome</Label>
              <select
                id="dayhome-select"
                className="h-9 w-full rounded-md border bg-transparent px-3 text-sm"
                disabled={isLoadingOptions}
                value={selectedDayhomeId}
                onChange={(event) =>
                  setSelectedDayhomeId(event.currentTarget.value)
                }
              >
                {dayhomeOptions?.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} ({item.id})
                  </option>
                ))}
              </select>
            </FieldSet>
          </div>

          {dayhomeOptions?.length === 0 && (
            <p className="mt-2 text-sm text-muted-foreground">
              No listings match your filter.
            </p>
          )}
        </CardContent>
      </Card>

      {!selectedDayhomeId || isLoadingDayhome ? null : (
        <>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <CardTitle>Basic details</CardTitle>
                {mapLocation ? (
                  <LinkButton
                    to="/map"
                    variant="outline"
                    size="sm"
                    search={{
                      f: basicForm.id,
                      l: `${mapLocation.lat},${mapLocation.lng},16`,
                    }}
                  >
                    Show on map
                  </LinkButton>
                ) : null}
              </div>
            </CardHeader>
            <CardContent>
              <form
                className="space-y-4"
                onSubmit={(event) => {
                  event.preventDefault();
                  saveBasicDetails();
                }}
              >
                <FieldSet>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={basicForm.name}
                    onChange={(event) => {
                      const name = event.currentTarget.value;
                      setBasicForm((previous) => ({
                        ...previous,
                        name,
                      }));
                    }}
                  />
                </FieldSet>

                <FieldSet>
                  <Label htmlFor="address">Address</Label>
                  <div className="relative">
                    <Input
                      id="address"
                      autoComplete="off"
                      value={basicForm.address}
                      onFocus={() => setIsAddressMenuOpen(true)}
                      onBlur={() => {
                        setTimeout(() => setIsAddressMenuOpen(false), 100);
                      }}
                      onChange={(event) => {
                        const address = event.currentTarget.value;

                        setBasicForm((previous) => ({
                          ...previous,
                          address,
                        }));
                        setIsAddressMenuOpen(true);
                      }}
                    />
                    {isAddressMenuOpen &&
                      visibleAddressSuggestions.length > 0 && (
                        <div className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover p-1 shadow-md">
                          {visibleAddressSuggestions.map((suggestion) => (
                            <button
                              className="w-full rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent"
                              key={`${suggestion.address}-${suggestion.latitude}-${suggestion.longitude}`}
                              type="button"
                              onMouseDown={(event) => {
                                event.preventDefault();
                                setBasicForm((previous) => ({
                                  ...previous,
                                  address: suggestion.address,
                                  x: suggestion.longitude,
                                  y: suggestion.latitude,
                                }));
                                setIsAddressMenuOpen(false);
                              }}
                            >
                              {suggestion.address}
                            </button>
                          ))}
                        </div>
                      )}
                  </div>
                </FieldSet>

                <div className="grid gap-4 md:grid-cols-2">
                  <FieldSet>
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input
                      id="latitude"
                      type="number"
                      step="0.000001"
                      value={basicForm.y}
                      onChange={(event) => {
                        const y = Number(event.currentTarget.value);
                        setBasicForm((previous) => ({
                          ...previous,
                          y,
                        }));
                      }}
                    />
                  </FieldSet>

                  <FieldSet>
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input
                      id="longitude"
                      type="number"
                      step="0.000001"
                      value={basicForm.x}
                      onChange={(event) => {
                        const x = Number(event.currentTarget.value);
                        setBasicForm((previous) => ({
                          ...previous,
                          x,
                        }));
                      }}
                    />
                  </FieldSet>
                </div>

                <FieldSet>
                  <Label>Location preview</Label>
                  <PinnedMap
                    location={mapLocation}
                    label={basicForm.address || "Selected location"}
                  />
                </FieldSet>

                <div className="grid gap-4 md:grid-cols-2">
                  <FieldSet>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={basicForm.phone}
                      onChange={(event) => {
                        const phone = event.currentTarget.value;
                        setBasicForm((previous) => ({
                          ...previous,
                          phone,
                        }));
                      }}
                    />
                  </FieldSet>

                  <FieldSet>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={basicForm.email}
                      onChange={(event) => {
                        const email = event.currentTarget.value;
                        setBasicForm((previous) => ({
                          ...previous,
                          email,
                        }));
                      }}
                    />
                  </FieldSet>
                </div>

                <FieldSet>
                  <Label htmlFor="agency-name">Agency Name</Label>
                  <Input
                    id="agency-name"
                    value={basicForm.agencyName}
                    onChange={(event) => {
                      const agencyName = event.currentTarget.value;
                      setBasicForm((previous) => ({
                        ...previous,
                        agencyName,
                      }));
                    }}
                  />
                </FieldSet>

                <FieldSet>
                  <Label htmlFor="is-licensed">Is licensed</Label>
                  <div>
                    <Checkbox
                      id="is-licensed"
                      checked={basicForm.isLicensed}
                      onCheckedChange={(checked) =>
                        setBasicForm((previous) => ({
                          ...previous,
                          isLicensed: Boolean(checked),
                        }))
                      }
                    />
                  </div>
                </FieldSet>

                <FieldSet>
                  <Label>Age groups</Label>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {ageGroups.map((ageGroup) => (
                      <label
                        className="flex items-center gap-2"
                        key={ageGroup.value}
                      >
                        <Checkbox
                          checked={basicForm.ageGroups.has(ageGroup.value)}
                          onCheckedChange={(checked) => {
                            setBasicForm((previous) => {
                              const next = new Set(previous.ageGroups);
                              if (checked) {
                                next.add(ageGroup.value);
                              } else {
                                next.delete(ageGroup.value);
                              }

                              return {
                                ...previous,
                                ageGroups: next,
                              };
                            });
                          }}
                        />
                        <span>{ageGroup.label}</span>
                      </label>
                    ))}
                  </div>
                </FieldSet>

                <Button type="submit" disabled={updateBasic.isPending}>
                  {updateBasic.isPending ? "Saving..." : "Save basic details"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Open hours</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                className="max-w-xl space-y-4"
                onSubmit={(event) => {
                  event.preventDefault();
                  saveOpenHours();
                }}
              >
                {(Object.entries(weekdayIso) as Array<[string, string]>).map(
                  ([weekday, label]) => {
                    const day = Number(weekday) as Weekday;
                    const value = openHoursForm[day];

                    return (
                      <div
                        className="flex items-center gap-3 rounded-md border p-3"
                        key={weekday}
                      >
                        <label className="flex min-w-32 items-center gap-2 text-sm font-medium whitespace-nowrap">
                          <Checkbox
                            checked={value.enabled}
                            onCheckedChange={(checked) =>
                              setOpenHoursForm((previous) => ({
                                ...previous,
                                [day]: {
                                  ...previous[day],
                                  enabled: Boolean(checked),
                                },
                              }))
                            }
                          />
                          {label}
                        </label>

                        <div className="ml-auto flex items-center gap-3">
                          <Input
                            className="w-28"
                            type="time"
                            value={value.openAt}
                            disabled={!value.enabled}
                            onChange={(event) => {
                              const openAt = event.currentTarget.value;
                              setOpenHoursForm((previous) => ({
                                ...previous,
                                [day]: {
                                  ...previous[day],
                                  openAt,
                                },
                              }));
                            }}
                          />

                          <Input
                            className="w-28"
                            type="time"
                            value={value.closeAt}
                            disabled={!value.enabled}
                            onChange={(event) => {
                              const closeAt = event.currentTarget.value;
                              setOpenHoursForm((previous) => ({
                                ...previous,
                                [day]: {
                                  ...previous[day],
                                  closeAt,
                                },
                              }));
                            }}
                          />
                        </div>
                      </div>
                    );
                  },
                )}

                <Button type="submit" disabled={updateOpenHours.isPending}>
                  {updateOpenHours.isPending ? "Saving..." : "Save open hours"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
