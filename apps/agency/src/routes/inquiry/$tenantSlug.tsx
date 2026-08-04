import { getInquiryFormFn } from "#/features/inquiries/get_inquiry_form.fn";
import { toIsoDate } from "#/features/inquiries/inquiry_schema";
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@dayhome/ui/field";
import { RadioGroup, RadioGroupItem } from "@dayhome/ui/radio-group";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const embedPageClass =
  "grid min-h-screen place-items-center bg-[radial-gradient(circle_at_8%_0%,rgba(219,238,226,0.85),transparent_34%),#f6f8f6] p-6 max-[540px]:items-start max-[540px]:p-0 dark:bg-[radial-gradient(circle_at_8%_0%,rgba(47,79,68,0.45),transparent_34%),var(--background)]";
const embedCardClass =
  "w-[min(620px,100%)] rounded-[18px] border border-[#d8e2dc] bg-[rgba(255,255,255,0.95)] p-[clamp(24px,6vw,44px)] text-[#263831] shadow-[0_20px_50px_rgba(42,68,58,0.08)] max-[540px]:min-h-screen max-[540px]:rounded-none max-[540px]:border-0 max-[540px]:shadow-none dark:border-border dark:bg-card dark:text-card-foreground dark:shadow-[0_20px_50px_rgba(0,0,0,0.22)]";
const headingClass =
  "m-0 font-[Manrope,sans-serif] text-[clamp(25px,5vw,35px)] tracking-[-0.04em]";
const eyebrowClass =
  "mt-0 mb-[7px] text-[10px] font-bold tracking-[0.1em] text-[#4d806f] uppercase dark:text-[#8bc4b0]";
const formGridClass = "grid grid-cols-2 gap-3.5 max-[540px]:grid-cols-1";
const labelClass =
  "grid gap-[7px] text-[11px] font-bold text-[#43544d] dark:text-foreground";
const controlClass =
  "w-full rounded-[9px] border border-[#ced9d2] bg-white px-3 py-[11px] text-xs text-[#263831] hover:border-[#aebfb5] dark:border-input dark:bg-background dark:text-foreground dark:hover:border-ring";

export const Route = createFileRoute("/inquiry/$tenantSlug")({
  validateSearch: z.object({ submitted: z.boolean().optional().catch(false) }),
  loader: ({ params }) => getInquiryFormFn({ data: params }),
  component: InquiryFormPage,
});

function InquiryFormPage() {
  const tenant = Route.useLoaderData();
  const { submitted } = Route.useSearch();

  if (!tenant) {
    return (
      <main className={embedPageClass}>
        <section className={embedCardClass}>
          <h1 className={headingClass}>Inquiry form unavailable</h1>
          <p className="mt-2.5 mb-0 text-[13px] leading-[1.6] text-[#6e7d77] dark:text-muted-foreground">
            Please contact the childcare provider directly.
          </p>
        </section>
      </main>
    );
  }

  if (submitted) {
    return (
      <main className={embedPageClass}>
        <section className={`${embedCardClass} text-center`}>
          <span
            className="mx-auto mb-5 grid size-12 place-items-center rounded-full bg-[#dcefe5] text-[23px] font-extrabold text-[#2f705b] dark:bg-accent dark:text-[#8bc4b0]"
            aria-hidden="true"
          >
            ✓
          </span>
          <p className={eyebrowClass}>Inquiry received</p>
          <h1 className={headingClass}>Thank you for reaching out.</h1>
          <p className="mt-2.5 mb-7 text-[13px] leading-[1.6] text-[#6e7d77] dark:text-muted-foreground">
            {tenant.name} has received your inquiry. We sent a confirmation to
            your email, and the provider will review your request.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className={embedPageClass}>
      <section className={embedCardClass}>
        <p className={eyebrowClass}>Childcare inquiry</p>
        <h1 className={headingClass}>Find care with {tenant.name}</h1>
        <p className="mt-2.5 mb-7 text-[13px] leading-[1.6] text-[#6e7d77] dark:text-muted-foreground">
          Tell us what your family needs. The provider will review your inquiry
          and contact you about next steps.
        </p>

        <form
          className="grid gap-4.5"
          action={`/api/inquiries/${encodeURIComponent(tenant.slug)}`}
          method="post"
        >
          <div className={formGridClass}>
            <label className={labelClass}>
              <span>Parent first name</span>
              <input
                className={controlClass}
                name="parentFirstName"
                required
                maxLength={100}
              />
            </label>
            <label className={labelClass}>
              <span>Parent last name</span>
              <input
                className={controlClass}
                name="parentLastName"
                required
                maxLength={100}
              />
            </label>
          </div>

          <label className={labelClass}>
            <span>Email</span>
            <input
              className={controlClass}
              name="parentEmail"
              type="email"
              autoComplete="email"
              required
            />
          </label>

          <FieldSet className="gap-[7px]">
            <FieldLegend
              className="mb-0 text-[11px] font-bold text-[#43544d] dark:text-foreground"
              variant="label"
            >
              Type of care
            </FieldLegend>
            <RadioGroup
              className="grid-cols-3 gap-2.5 max-[540px]:grid-cols-1"
              name="careType"
              required
            >
              {[
                ["full_time", "Full-time"],
                ["part_time", "Part-time"],
                ["drop_in", "Drop-in"],
              ].map(([value, label]) => {
                const id = `care-type-${value}`;

                return (
                  <FieldLabel
                    className="cursor-pointer rounded-[9px] border-[#ced9d2] bg-white transition-colors hover:border-[#aebfb5] has-data-checked:border-[#306d5c] has-data-checked:bg-[#f2f8f5] dark:border-input dark:bg-background dark:hover:border-ring dark:has-data-checked:border-[#8bc4b0] dark:has-data-checked:bg-accent [&>[data-slot=field]]:p-3.5"
                    htmlFor={id}
                    key={value}
                  >
                    <Field orientation="horizontal">
                      <FieldContent>
                        <FieldTitle className="text-xs font-bold text-[#263831] dark:text-foreground">
                          {label}
                        </FieldTitle>
                      </FieldContent>
                      <RadioGroupItem
                        className="border-[#aebfb5] text-[#306d5c] data-checked:border-[#306d5c] dark:border-ring dark:text-[#8bc4b0] dark:data-checked:border-[#8bc4b0]"
                        id={id}
                        value={value}
                      />
                    </Field>
                  </FieldLabel>
                );
              })}
            </RadioGroup>
          </FieldSet>

          <div className={formGridClass}>
            <label className={labelClass}>
              <span>Child's birthday</span>
              <input
                className={controlClass}
                name="childBirthDate"
                type="date"
                max={toIsoDate(new Date())}
                required
              />
            </label>
            <label className={labelClass}>
              <span>
                Preferred start date{" "}
                <small className="text-[9px] font-medium text-[#89958f] dark:text-muted-foreground">
                  Optional
                </small>
              </span>
              <input
                className={controlClass}
                name="preferredStartDate"
                type="date"
              />
            </label>
          </div>

          <label
            className="absolute left-[-10000px] size-px overflow-hidden"
            aria-hidden="true"
          >
            Company
            <input name="company" tabIndex={-1} autoComplete="off" />
          </label>

          <button
            className="cursor-pointer rounded-[10px] border border-[#285e50] bg-[#306d5c] px-4.5 py-3 text-xs font-bold text-white shadow-[0_5px_15px_rgba(38,91,75,0.16)] hover:bg-[#265b4d]"
            type="submit"
          >
            Send inquiry
          </button>
          <p className="-mt-1.5 mb-0 text-center text-[9px] leading-normal text-[#89958f] dark:text-muted-foreground">
            Your information is sent securely to {tenant.name} for the purpose
            of responding to your childcare inquiry.
          </p>
        </form>
      </section>
    </main>
  );
}
