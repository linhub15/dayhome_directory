import { getInquiryFormFn } from "#/features/inquiries/get_inquiry_form.fn";
import { toIsoDate } from "#/features/inquiries/inquiry_schema";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@dayhome/ui/field";
import { Button } from "@dayhome/ui/button";
import { Input } from "@dayhome/ui/input";
import { RadioGroup, RadioGroupItem } from "@dayhome/ui/radio-group";
import { createFileRoute } from "@tanstack/react-router";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { useRef, useState } from "react";
import { z } from "zod";

export const Route = createFileRoute("/inquiry/$tenantSlug")({
  validateSearch: z.object({ submitted: z.boolean().optional().catch(false) }),
  loader: ({ params }) => getInquiryFormFn({ data: params }),
  component: InquiryFormPage,
});

function InquiryFormPage() {
  const tenant = Route.useLoaderData();
  const { submitted } = Route.useSearch();
  const nextChildId = useRef(1);
  const [childIds, setChildIds] = useState([0]);

  if (!tenant) {
    return (
      <main className="grid min-h-screen place-items-center bg-muted/40 p-6 max-sm:items-start max-sm:p-0">
        <section className="w-full max-w-2xl rounded-2xl border bg-card p-6 text-card-foreground shadow-xl max-sm:min-h-screen max-sm:rounded-none max-sm:border-0 max-sm:shadow-none sm:p-11">
          <h1 className="m-0 font-heading text-3xl font-medium tracking-tight">
            Inquiry form unavailable
          </h1>
          <p className="mt-2.5 mb-0 text-sm leading-relaxed text-muted-foreground">
            Please contact the childcare provider directly.
          </p>
        </section>
      </main>
    );
  }

  if (submitted) {
    return (
      <main className="grid min-h-screen place-items-center bg-muted/40 p-6 max-sm:items-start max-sm:p-0">
        <section className="w-full max-w-2xl rounded-2xl border bg-card p-6 text-center text-card-foreground shadow-xl max-sm:min-h-screen max-sm:rounded-none max-sm:border-0 max-sm:shadow-none sm:p-11">
          <span
            className="mx-auto mb-5 grid size-12 place-items-center rounded-full bg-primary/10 text-xl font-medium text-primary"
            aria-hidden="true"
          >
            ✓
          </span>
          <p className="mt-0 mb-2 text-xs font-medium tracking-widest text-primary uppercase">
            Inquiry received
          </p>
          <h1 className="m-0 font-heading text-3xl font-medium tracking-tight">
            Thank you for reaching out.
          </h1>
          <p className="mt-2.5 mb-7 text-sm leading-relaxed text-muted-foreground">
            {tenant.name} has received your inquiry. We sent a confirmation to
            your email, and the provider will review your request.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="grid min-h-screen place-items-center bg-muted/40 p-6 max-sm:items-start max-sm:p-0">
      <section className="w-full max-w-2xl rounded-2xl border bg-card p-6 text-card-foreground shadow-xl max-sm:min-h-screen max-sm:rounded-none max-sm:border-0 max-sm:shadow-none sm:p-11">
        <p className="mt-0 mb-2 text-xs font-medium tracking-widest text-primary uppercase">
          Childcare inquiry
        </p>
        <h1 className="m-0 font-heading text-3xl font-medium tracking-tight">
          Find care with {tenant.name}
        </h1>
        <p className="mt-2.5 mb-7 text-sm leading-relaxed text-muted-foreground">
          Tell us what your family needs. The provider will review your inquiry
          and contact you about next steps.
        </p>

        <form
          className="grid gap-4.5"
          action={`/api/inquiries/${encodeURIComponent(tenant.slug)}`}
          method="post"
        >
          <Field>
            <FieldLabel htmlFor="parent-email">Email</FieldLabel>
            <Input
              id="parent-email"
              name="parentEmail"
              type="email"
              autoComplete="email"
              inputMode="email"
              required
            />
          </Field>

          <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
            <Field>
              <FieldLabel htmlFor="parent-first-name">
                Parent first name
              </FieldLabel>
              <Input
                id="parent-first-name"
                name="parentFirstName"
                required
                maxLength={100}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="parent-last-name">
                Parent last name
              </FieldLabel>
              <Input
                id="parent-last-name"
                name="parentLastName"
                required
                maxLength={100}
              />
            </Field>
          </div>

          <div className="grid gap-3">
            {childIds.map((childId, index) => (
              <ChildFields
                key={childId}
                childId={childId}
                index={index}
                canRemove={childIds.length > 1}
                onRemove={() =>
                  setChildIds((current) =>
                    current.filter((id) => id !== childId),
                  )
                }
              />
            ))}
            <Button
              className="border-dashed"
              size="lg"
              variant="outline"
              type="button"
              onClick={() => {
                setChildIds((current) => [...current, nextChildId.current]);
                nextChildId.current += 1;
              }}
            >
              <PlusIcon size={16} /> Add another child
            </Button>
          </div>

          <label className="sr-only" aria-hidden="true">
            Company
            <input name="company" tabIndex={-1} autoComplete="off" />
          </label>

          <Button size="lg" type="submit">
            Send inquiry
          </Button>
          <p className="-mt-1.5 mb-0 text-center text-xs leading-normal text-muted-foreground">
            Your information is sent securely to {tenant.name} for the purpose
            of responding to your childcare inquiry.
          </p>
        </form>
      </section>
    </main>
  );
}

function ChildFields({
  childId,
  index,
  canRemove,
  onRemove,
}: {
  childId: number;
  index: number;
  canRemove: boolean;
  onRemove: () => void;
}) {
  const [careType, setCareType] = useState("");
  const [expectedStart, setExpectedStart] = useState("as_soon_as_possible");

  return (
    <FieldSet className="m-0 min-w-0 rounded-xl border bg-muted/20 p-4">
      <FieldLegend className="px-1">Child {index + 1}</FieldLegend>
      {canRemove ? (
        <Button
          className="-mt-8 ml-auto text-destructive hover:text-destructive"
          variant="ghost"
          size="sm"
          type="button"
          onClick={onRemove}
          aria-label={`Remove child ${index + 1}`}
        >
          <Trash2Icon size={14} /> Remove
        </Button>
      ) : null}

      <Field>
        <FieldLabel htmlFor={`child-${childId}-birthdate`}>
          Birthdate
        </FieldLabel>
        <Input
          id={`child-${childId}-birthdate`}
          name="childBirthDate"
          type="date"
          max={toIsoDate(new Date())}
          required
        />
      </Field>

      <FieldSet className="gap-2">
        <FieldLegend variant="label">Type of care</FieldLegend>
        <RadioGroup
          className="grid-cols-3 gap-2 max-sm:grid-cols-1"
          name={`child-${childId}-care-type`}
          value={careType}
          onValueChange={(value) => setCareType(value)}
          required
        >
          {[
            ["full_time", "Full-time"],
            ["part_time", "Part-time"],
            ["drop_in", "Drop-in"],
          ].map(([value, label]) => {
            const id = `child-${childId}-care-type-${value}`;

            return (
              <FieldLabel htmlFor={id} key={value}>
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldTitle>{label}</FieldTitle>
                  </FieldContent>
                  <RadioGroupItem id={id} value={value} />
                </Field>
              </FieldLabel>
            );
          })}
        </RadioGroup>
        <input name="careType" type="hidden" value={careType} />
      </FieldSet>

      <FieldSet className="gap-2">
        <FieldLegend variant="label">Expected start</FieldLegend>
        <RadioGroup
          className="grid-cols-3 gap-2 max-sm:grid-cols-1"
          name={`child-${childId}-expected-start`}
          value={expectedStart}
          onValueChange={(value) => setExpectedStart(value)}
          required
        >
          {[
            ["as_soon_as_possible", "As soon as possible", "Ready now"],
            ["within_a_month", "Within a month", "Some flexibility"],
            ["specific_date", "Choose a date", "A planned start"],
          ].map(([value, title, description]) => {
            const id = `child-${childId}-start-${value}`;
            return (
              <FieldLabel htmlFor={id} key={value}>
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldTitle>{title}</FieldTitle>
                    <FieldDescription className="m-0">
                      {description}
                    </FieldDescription>
                  </FieldContent>
                  <RadioGroupItem id={id} value={value} />
                </Field>
              </FieldLabel>
            );
          })}
        </RadioGroup>
        <input name="expectedStart" type="hidden" value={expectedStart} />
      </FieldSet>

      {expectedStart === "specific_date" ? (
        <Field>
          <FieldLabel htmlFor={`child-${childId}-start-date`}>
            Start date
          </FieldLabel>
          <Input
            id={`child-${childId}-start-date`}
            name="expectedStartDate"
            type="date"
            min={toIsoDate(new Date())}
            required
          />
        </Field>
      ) : (
        <input name="expectedStartDate" type="hidden" value="" />
      )}
    </FieldSet>
  );
}
