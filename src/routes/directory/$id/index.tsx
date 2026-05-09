import { buttonVariants, LinkButton } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PinnedMap } from "@/components/ui/pinned_map";
import { ClaimedCard } from "@/features/claim_listing/claimed_card.tsx";
import { AgeGroupBadge } from "@/features/dayhomes/dayhome_map/components/age_group_badge.tsx";
import { DayhomeTitle } from "@/features/dayhomes/dayhome_map/components/dayhome_title.tsx";
import { LicensedBadge } from "@/features/dayhomes/dayhome_map/components/licensed_badge.tsx";
import {
  type GetDayhomeResponse,
  getDayhomeFn,
} from "@/features/dayhomes/get_dayhome.fn";
import { weekdayIso } from "@/lib/constants/weekday";
import { SEO_META } from "@/config/seo_meta";
import { googleDirections } from "@/lib/geocoding/constant_data";
import { createFileRoute, notFound } from "@tanstack/react-router";
import type { ReactNode } from "react";
import {
  ArrowLeftIcon,
  CircleHelpIcon,
  MailIcon,
  MapIcon,
  MapPinIcon,
  PhoneIcon,
} from "lucide-react";

export const Route = createFileRoute("/directory/$id/")({
  ssr: true,
  loader: async ({ params }) => {
    const dayhome = await getDayhomeFn({ data: { id: params.id } });
    if (!dayhome) {
      throw notFound();
    }
    return dayhome;
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return { meta: [{ title: SEO_META.title }] };
    }

    const seo = buildSeoContent(loaderData, params.id);

    return {
      meta: [
        { title: seo.title },
        { name: "description", content: seo.description },
        { property: "og:title", content: seo.title },
        { property: "og:description", content: seo.description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: seo.url },
        { name: "twitter:title", content: seo.title },
        { name: "twitter:description", content: seo.description },
      ],
      links: [{ rel: "canonical", href: seo.url }],
    };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const dayhome = Route.useLoaderData();
  const {
    id,
    name,
    location,
    address,
    phone,
    email,
    isLicensed,
    agencyName,
    openHours,
    ageGroups,
  } = dayhome;
  const seo = buildSeoContent(dayhome, id);
  const details = buildDayhomeDetails(dayhome);
  const structuredData = buildStructuredData(dayhome, id, details);

  return (
    <div className="space-y-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <LinkButton
        variant="outline"
        to="/map"
        search={{ f: id, l: `${location.y},${location.x},16` }}
      >
        <ArrowLeftIcon />
        View in Map
      </LinkButton>

      <ClaimedCard dayhomeId={id} />

      <Card className="overflow-clip">
        <CardHeader>
          <div className="flex justify-between items-center">
            <DayhomeTitle name={name} agencyName={agencyName} dayhomeId={id} />
            <div>
              <LicensedBadge isLicensed={isLicensed} />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="space-x-2">
              {ageGroups?.map((ageGroup) => (
                <AgeGroupBadge key={ageGroup} ageGroup={ageGroup} />
              ))}
            </div>
            <div className="flex gap-3 overflow-scroll no-scrollbar">
              {phone && (
                <div className="flex items-center gap-2 rounded-md border px-4 py-2 text-sm">
                  <PhoneIcon className="size-4" />
                  <span>{phone}</span>
                </div>
              )}
              {email && (
                <div className="flex items-center gap-2 rounded-md border px-4 py-2 text-sm">
                  <MailIcon className="size-4" />
                  <span className="text-nowrap">{email}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between">
            <div className="flex items-top space-x-2">
              <div>
                <MapPinIcon className="size-5 mt-1" />
              </div>
              <div>{address}</div>
            </div>

            <a
              className={buttonVariants({ variant: "outline" })}
              href={googleDirections(address)}
              target="_blank"
            >
              Directions
            </a>
          </div>
        </CardHeader>
        <CardContent>
          <div>
            <PinnedMap location={{ lat: location.y, lng: location.x }} />
          </div>

          <div className="py-4">
            {openHours.length > 0 && <OpenHours openHours={openHours} />}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-medium">About this childcare program</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm leading-6 text-slate-700">
            {seo.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-medium">Program highlights</h2>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {details.highlights.map((highlight) => (
              <InfoPanel
                key={highlight.title}
                icon={highlight.icon}
                title={highlight.title}
              >
                {highlight.body}
              </InfoPanel>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-medium">Questions parents often ask</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {details.faqs.map((faq) => (
              <div key={faq.question} className="rounded-lg border p-4">
                <h3 className="font-medium text-sm">{faq.question}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-medium">Explore more childcare nearby</h2>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3 sm:flex-row">
            <LinkButton
              className="w-full sm:w-auto"
              to="/map"
              search={{ f: id, l: `${location.y},${location.x},16` }}
            >
              View nearby daycares
            </LinkButton>
            <LinkButton
              className="w-full sm:w-auto"
              variant="outline"
              to="/map"
            >
              Browse all listings
            </LinkButton>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-700">
            Compare this listing with other {details.cityPhrase} daycare,
            dayhome, preschool, and out-of-school care options on Discover Care.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

type OpenHours = GetDayhomeResponse["openHours"];

function OpenHours({ openHours }: { openHours: OpenHours }) {
  const hr = (time: string) => {
    const [hourStr, minuteStr] = time.split(":");
    const hour = Number(hourStr);
    const minute = Number(minuteStr);

    const displayHour = hour === 0 ? 12 : hour <= 12 ? hour : hour - 12;
    const displayMinute = minute ? `:${minuteStr}` : "";

    return hour < 12
      ? `${displayHour}${displayMinute} a.m.`
      : `${displayHour}${displayMinute} p.m.`;
  };

  const format = (openDay?: OpenHours[number]) => {
    if (!openDay) return "Closed";

    return `${hr(openDay.openAt)} - ${hr(openDay.closeAt)}`;
  };

  return (
    <div className="space-y-0.5">
      <h3 className="font-medium py-2">Open Hours</h3>
      {Object.entries(weekdayIso).map(([key, value]) => (
        <div className="grid grid-cols-2" key={key}>
          <span className="text-sm">{value}</span>
          <span>
            {format(openHours.find((x) => x.weekday === Number(key)))}
          </span>
        </div>
      ))}
    </div>
  );
}

function InfoPanel({
  icon,
  title,
  children,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-center gap-2 font-medium">
        {icon}
        <span>{title}</span>
      </div>
      <p className="mt-2 text-sm leading-6 text-slate-700">{children}</p>
    </div>
  );
}

function buildSeoContent(dayhome: GetDayhomeResponse, dayhomeId: string) {
  const details = buildDayhomeDetails(dayhome);
  const title = `${dayhome.name} - ${details.seoServiceLabel}${details.locationSuffix}`;
  const description = `${dayhome.name} is a ${details.licensingAdjective} childcare listing${details.locationSuffix} serving ${details.ageSummaryLower}. View hours, contact details, and location info on Discover Care.`;
  const url = `${SEO_META.url}/directory/${dayhomeId}`;

  const paragraphs = [
    `If you are considering ${dayhome.name}, we try to provide age groups, licensing, hours, contact, and location.`,
    `${details.locationSentence} ${details.licensingSentence}`,
    `${details.programSentence} ${details.hoursSentence} ${details.contactSentence}`,
  ];

  return { title, description, url, paragraphs };
}

function buildDayhomeDetails(dayhome: GetDayhomeResponse) {
  const addressParts = splitAddress(dayhome.address);
  const city = firstText(
    dayhome.license?.city,
    guessCityFromAddress(addressParts),
  );
  const neighborhood = guessNeighborhoodFromAddress(addressParts);
  const providerType = getProviderType(dayhome);
  const providerLabel =
    providerType === "dayhome"
      ? "Dayhome"
      : providerType === "preschool"
        ? "Preschool"
        : providerType === "out-of-school care"
          ? "Out-of-school care"
          : "Daycare";
  const ageSummary = formatAgeGroups(dayhome.ageGroups);
  const ageSummaryLower = lowerCaseFirst(ageSummary);
  const licensingSummary = dayhome.isLicensed
    ? `Licensed${dayhome.agencyName ? ` through ${dayhome.agencyName}` : ""}`
    : "Unlicensed or private listing";
  const licensingAdjective = dayhome.isLicensed ? "licensed" : "private";
  const licenseProgramSummary = formatProgramTypes(dayhome);
  const cityPhrase = city ?? "the area";
  const locationSuffix = cityPhrase === "the area" ? "" : ` in ${cityPhrase}`;
  const providerDescriptor = `${dayhome.isLicensed ? "licensed" : "local"} ${providerLabel.toLowerCase()}`;
  const locationSentence = neighborhood
    ? `You can find ${dayhome.name} near ${neighborhood}${locationSuffix}.`
    : cityPhrase === "the area"
      ? `Location details are limited on this listing.`
      : `You can find ${dayhome.name} in ${cityPhrase}.`;
  const licensingSentence = dayhome.isLicensed
    ? `${dayhome.agencyName ? `It is associated with ${dayhome.agencyName}. ` : ""}${licenseProgramSummary ? `The licence includes ${licenseProgramSummary}.` : "It is marked as licensed childcare."}`
    : "This listing is not marked as licensed, so you should confirm current details directly with the provider.";
  const programSentence = dayhome.ageGroups?.length
    ? `The listing says ${dayhome.name} cares for ${ageSummaryLower}.`
    : `${dayhome.name} does not currently list accepted age groups on this profile.`;
  const hoursSentence = dayhome.openHours.length
    ? `You can also review the listed hours.`
    : `Open hours are not listed on this profile.`;
  const contactSentence =
    dayhome.phone || dayhome.email
      ? `Contact details are available if you want to ask about a tour or waitlist.`
      : `Direct contact details are limited on this page.`;
  const seoServiceLabel =
    `${dayhome.isLicensed ? "Licensed " : ""}${providerLabel} ${licenseProgramSummary ? `& ${licenseProgramSummary}` : "Childcare"}`.trim();

  const highlights = [
    {
      title: "Location",
      body: hasText(dayhome.address)
        ? `${dayhome.name} is listed at ${dayhome.address}. You can use the map to check the location and nearby childcare options.`
        : `A full street address is not available on this listing yet.`,
      icon: <MapPinIcon className="size-4 text-slate-500" />,
    },
    {
      title: "Age groups",
      body: dayhome.ageGroups?.length
        ? `The profile indicates care for ${ageSummaryLower}.`
        : "Age groups are not listed on this profile yet.",
      icon: <CircleHelpIcon className="size-4 text-slate-500" />,
    },
    {
      title: "Licensing",
      body: dayhome.isLicensed
        ? `${dayhome.name} is marked as licensed childcare${dayhome.agencyName ? ` with ${dayhome.agencyName}` : ""}.${licenseProgramSummary ? ` The linked licence references ${licenseProgramSummary}.` : ""}`
        : `${dayhome.name} is not currently marked as licensed on this listing.`,
      icon: <MapIcon className="size-4 text-slate-500" />,
    },
    {
      title: "Planning a tour",
      body: `Ask about availability, waitlists, daily routines, meals, outdoor time, and fees when contacting ${dayhome.name}.`,
      icon: <PhoneIcon className="size-4 text-slate-500" />,
    },
  ];

  const faqs = [
    {
      question: `What age groups does ${dayhome.name} serve?`,
      answer: dayhome.ageGroups?.length
        ? `${dayhome.name} lists care for ${ageSummaryLower}. You should confirm current availability directly with the provider.`
        : `${dayhome.name} does not currently list accepted age groups on this profile. Contact the provider to confirm eligibility.`,
    },
    {
      question: `Is ${dayhome.name} licensed?`,
      answer: dayhome.isLicensed
        ? `${dayhome.name} is marked as licensed on Discover Care${dayhome.agencyName ? ` and is associated with ${dayhome.agencyName}` : ""}.`
        : `${dayhome.name} is not marked as licensed on this profile.`,
    },
    {
      question: `What programs may be available at ${dayhome.name}?`,
      answer: licenseProgramSummary
        ? `The linked licence information references ${licenseProgramSummary}. Contact ${dayhome.name} to confirm current enrollment.`
        : `This profile does not list detailed program types beyond the information shown here.`,
    },
    {
      question: `How can I contact ${dayhome.name}?`,
      answer:
        dayhome.phone || dayhome.email
          ? `Use the contact details on this page${dayhome.phone ? `, including ${dayhome.phone}` : ""}${dayhome.email ? `${dayhome.phone ? " and " : ", including "}${dayhome.email}` : ""}, to ask about tours, fees, or waitlists.`
          : `This page does not include full contact details.`,
    },
  ];

  return {
    cityPhrase,
    providerLabel,
    providerDescriptor,
    ageSummary,
    ageSummaryLower,
    licensingSummary,
    licensingAdjective,
    locationSuffix,
    locationSentence,
    licensingSentence,
    programSentence,
    hoursSentence,
    contactSentence,
    seoServiceLabel,
    highlights,
    faqs,
  };
}

function buildStructuredData(
  dayhome: GetDayhomeResponse,
  dayhomeId: string,
  details: ReturnType<typeof buildDayhomeDetails>,
) {
  const addressParts = splitAddress(dayhome.address);
  const streetAddress = addressParts[0];
  const addressLocality = firstText(
    dayhome.license?.city,
    guessCityFromAddress(addressParts),
  );
  const addressRegion = guessRegionFromAddress(addressParts);
  const postalCode = firstText(
    dayhome.license?.postalCode,
    guessPostalCodeFromAddress(addressParts),
  );

  return {
    "@context": "https://schema.org",
    "@type": "ChildCare",
    name: dayhome.name,
    description: `${dayhome.name} is a ${details.licensingAdjective} childcare listing${details.locationSuffix} serving ${details.ageSummaryLower}.`,
    url: `${SEO_META.url}/directory/${dayhomeId}`,
    telephone: dayhome.phone ?? undefined,
    email: dayhome.email ?? undefined,
    isAccessibleForFree: true,
    address: hasAnyAddressField({
      streetAddress,
      addressLocality,
      addressRegion,
      postalCode,
    })
      ? {
          "@type": "PostalAddress",
          streetAddress,
          addressLocality: addressLocality ?? undefined,
          addressRegion,
          postalCode: postalCode ?? undefined,
          addressCountry: "CA",
        }
      : undefined,
    geo: {
      "@type": "GeoCoordinates",
      latitude: dayhome.location.y,
      longitude: dayhome.location.x,
    },
    openingHoursSpecification: dayhome.openHours.map((openDay) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: weekdayIsoToSchemaDay(openDay.weekday),
      opens: openDay.openAt,
      closes: openDay.closeAt,
    })),
    areaServed:
      details.cityPhrase === "the area" ? undefined : details.cityPhrase,
    keywords: [
      details.cityPhrase === "the area"
        ? details.providerLabel.toLowerCase()
        : `${details.providerLabel.toLowerCase()} in ${details.cityPhrase}`,
      `${details.licensingAdjective} childcare`,
      details.ageSummaryLower,
    ].join(", "),
  };
}

function getProviderType(dayhome: GetDayhomeResponse) {
  if (dayhome.license?.type === "FAMILY DAY HOME") return "dayhome";
  if (dayhome.license?.hasPreschool) return "preschool";
  if (dayhome.license?.hasOutOfSchoolCare && !dayhome.license?.hasDayCare) {
    return "out-of-school care";
  }
  return "daycare";
}

function formatAgeGroups(ageGroups: GetDayhomeResponse["ageGroups"]) {
  if (!ageGroups?.length) return "children of various ages";

  const labelMap: Record<
    NonNullable<GetDayhomeResponse["ageGroups"]>[number],
    string
  > = {
    infant: "infants",
    toddler: "toddlers",
    preschool: "preschoolers",
    kindergarten: "kindergarten-aged children",
    grade_school: "grade-school children",
  };

  return joinList(ageGroups.map((ageGroup) => labelMap[ageGroup]));
}

function formatProgramTypes(dayhome: GetDayhomeResponse) {
  const programs = [
    dayhome.license?.hasDayCare ? "daycare" : null,
    dayhome.license?.hasPreschool ? "preschool" : null,
    dayhome.license?.hasOutOfSchoolCare ? "out-of-school care" : null,
  ].filter(Boolean) as string[];

  return programs.length ? joinList(programs) : null;
}

function joinList(items: string[]) {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;

  return `${items.slice(0, -1).join(", ")}, and ${items.at(-1)}`;
}

function lowerCaseFirst(value: string) {
  return value.charAt(0).toLowerCase() + value.slice(1);
}

function splitAddress(address: string | null | undefined) {
  if (!hasText(address)) return [];

  return address
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

function guessNeighborhoodFromAddress(addressParts: string[]) {
  const firstPart = addressParts[0];
  if (!firstPart) return null;
  if (/\d/.test(firstPart) || /^(po\s*box|box)\b/i.test(firstPart)) return null;

  return firstPart;
}

function guessCityFromAddress(addressParts: string[]) {
  for (let index = addressParts.length - 1; index >= 0; index -= 1) {
    const part = addressParts[index];
    if (!part) continue;
    if (looksLikePostalCode(part) || looksLikeRegion(part)) continue;
    if (/\d/.test(part)) continue;
    return part.replace(/^in\s+/i, "");
  }

  return null;
}

function guessRegionFromAddress(addressParts: string[]) {
  return addressParts.find(looksLikeRegion) ?? undefined;
}

function guessPostalCodeFromAddress(addressParts: string[]) {
  return addressParts.find(looksLikePostalCode) ?? undefined;
}

function looksLikePostalCode(value: string) {
  return /^[A-Z]\d[A-Z][ -]?\d[A-Z]\d$/i.test(value.trim());
}

function looksLikeRegion(value: string) {
  return /^[A-Z]{2}$/.test(value.trim());
}

function firstText(...values: Array<string | null | undefined>) {
  return values.find(hasText) ?? null;
}

function hasText(value: string | null | undefined): value is string {
  return Boolean(value?.trim());
}

function hasAnyAddressField(address: {
  streetAddress?: string;
  addressLocality?: string | null;
  addressRegion?: string;
  postalCode?: string | null;
}) {
  return [
    address.streetAddress,
    address.addressLocality,
    address.addressRegion,
    address.postalCode,
  ].some(hasText);
}

function weekdayIsoToSchemaDay(weekday: number) {
  const days = {
    1: "https://schema.org/Monday",
    2: "https://schema.org/Tuesday",
    3: "https://schema.org/Wednesday",
    4: "https://schema.org/Thursday",
    5: "https://schema.org/Friday",
    6: "https://schema.org/Saturday",
    7: "https://schema.org/Sunday",
  } as const;

  return days[weekday as keyof typeof days];
}
