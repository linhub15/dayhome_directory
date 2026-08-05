import { inquirySubmissionSchema } from "#/features/inquiries/inquiry_schema";
import { submitInquiry } from "#/features/inquiries/submit_inquiry.server";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/inquiries/$tenantSlug")({
  server: {
    handlers: {
      POST: async ({ request, params }) => {
        const formData = await request.formData();

        // Treat bot submissions as successful without storing or emailing them.
        if (formData.get("company")) {
          return redirectToConfirmation(request, params.tenantSlug);
        }

        const careTypes = formData.getAll("careType");
        const birthDates = formData.getAll("childBirthDate");
        const expectedStarts = formData.getAll("expectedStart");
        const expectedStartDates = formData.getAll("expectedStartDate");

        const parsed = inquirySubmissionSchema.safeParse({
          parentFirstName: formData.get("parentFirstName"),
          parentLastName: formData.get("parentLastName"),
          parentEmail: formData.get("parentEmail"),
          children: birthDates.map((birthDate, index) => ({
            birthDate,
            careType: careTypes[index],
            expectedStart: expectedStarts[index],
            expectedStartDate: expectedStartDates[index],
          })),
        });

        if (!parsed.success) {
          return Response.json(
            {
              message: "Please check the inquiry details",
              issues: parsed.error.issues,
            },
            { status: 422 },
          );
        }

        const result = await submitInquiry(params.tenantSlug, parsed.data);
        if (result.status === "tenant_not_found") {
          return Response.json(
            { message: "Inquiry form not found" },
            { status: 404 },
          );
        }

        return redirectToConfirmation(request, params.tenantSlug);
      },
    },
  },
});

function redirectToConfirmation(request: Request, tenantSlug: string) {
  const location = new URL(
    `/inquiry/${encodeURIComponent(tenantSlug)}?submitted=true`,
    request.url,
  );
  return new Response(null, {
    status: 303,
    headers: { Location: location.href },
  });
}
