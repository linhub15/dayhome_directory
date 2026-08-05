import { AccountSummary } from "@dayhome/auth/components";
import { Button } from "@dayhome/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@dayhome/ui/card";
import { Input } from "@dayhome/ui/input";
import { useForm } from "@tanstack/react-form";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";

import { AppShell } from "#/components/app_shell";
import { updateBusinessFn } from "#/features/account/update_business.fn";
import { getAgencySessionFn } from "#/lib/auth/agency_session.fn";
import { authClient } from "#/lib/auth/better_auth_client";

export const Route = createFileRoute("/settings")({
  beforeLoad: async () => {
    const session = await getAgencySessionFn();
    if (!session.user) throw redirect({ to: "/login" });
    if (!session.user.emailVerified) throw redirect({ to: "/confirm-email" });
    if (!session.workspace) throw redirect({ to: "/onboarding" });
    return session;
  },
  component: SettingsPage,
});

function SettingsPage() {
  const { user, workspace } = Route.useRouteContext();
  const navigate = useNavigate();
  const profileForm = useForm({
    defaultValues: {
      businessName: workspace?.name ?? "",
    },
    onSubmit: async ({ value, formApi }) => {
      try {
        await updateBusinessFn({
          data: { businessName: value.businessName },
        });
      } catch (reason) {
        formApi.setErrorMap({
          onSubmit: {
            form:
              reason instanceof Error
                ? reason.message
                : "Could not save settings",
            fields: {},
          },
        });
        throw reason;
      }
    },
  });
  const deleteForm = useForm({
    defaultValues: {
      confirmation: "",
    },
    onSubmit: async ({ formApi }) => {
      const result = await authClient.deleteUser({ callbackURL: "/login" });
      if (result.error) {
        const reason = new Error(
          result.error.message ?? "Could not delete the account",
        );
        formApi.setErrorMap({
          onSubmit: { form: reason.message, fields: {} },
        });
        throw reason;
      }
      await navigate({ to: "/login", replace: true });
    },
  });

  if (!user || !workspace) return null;

  return (
    <AppShell
      tenantName={workspace.name}
      inquiryCount={0}
      user={user}
      activePage="settings"
    >
      <main className="mx-auto grid w-full max-w-3xl gap-6 px-7.5 py-7.5 max-md:px-4">
        <div>
          <p className="mt-0 mb-2 text-xs font-medium tracking-widest text-primary uppercase">
            Workspace
          </p>
          <h1 className="m-0 font-heading text-3xl font-medium tracking-tight">
            Settings
          </h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>
              Your Google identity and confirmed email address.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AccountSummary
              name={user.name}
              email={user.email}
              image={user.image}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Agency profile</CardTitle>
            <CardDescription>
              Manage the business information shown in Dayhome Flow.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="grid gap-4"
              onSubmit={(event) => {
                event.preventDefault();
                event.stopPropagation();
                void profileForm.handleSubmit().catch(() => undefined);
              }}
            >
              <profileForm.Field name="businessName">
                {(field) => (
                  <label
                    className="grid gap-2 text-sm font-medium"
                    htmlFor={field.name}
                  >
                    Business name
                    <Input
                      id={field.name}
                      value={field.state.value}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      minLength={2}
                      maxLength={120}
                      required
                    />
                  </label>
                )}
              </profileForm.Field>
              <label
                className="grid gap-2 text-sm font-medium"
                htmlFor="settings-business-type"
              >
                Business type
                <Input id="settings-business-type" value="Agency" disabled />
              </label>
              <profileForm.Subscribe
                selector={(state) => ({
                  error: state.errorMap.onSubmit,
                  isSubmitting: state.isSubmitting,
                  isSubmitSuccessful: state.isSubmitSuccessful,
                })}
              >
                {({ error, isSubmitting, isSubmitSuccessful }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Button disabled={isSubmitting} type="submit">
                        {isSubmitting ? "Saving…" : "Save changes"}
                      </Button>
                      {isSubmitSuccessful ? (
                        <span className="text-sm text-primary">Saved</span>
                      ) : null}
                    </div>
                    {error ? (
                      <p className="m-0 text-sm text-destructive" role="alert">
                        {String(error)}
                      </p>
                    ) : null}
                  </>
                )}
              </profileForm.Subscribe>
            </form>
          </CardContent>
        </Card>
        <Card className="border-destructive/30">
          <CardHeader>
            <CardTitle className="text-destructive">Delete account</CardTitle>
            <CardDescription>
              This permanently deletes your account and agency data. This cannot
              be undone.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="grid gap-4"
              onSubmit={(event) => {
                event.preventDefault();
                event.stopPropagation();
                void deleteForm.handleSubmit().catch(() => undefined);
              }}
            >
              <deleteForm.Field name="confirmation">
                {(field) => (
                  <label
                    className="grid gap-2 text-sm font-medium"
                    htmlFor={field.name}
                  >
                    Type <span className="font-mono">{workspace.name}</span> to
                    confirm
                    <Input
                      id={field.name}
                      value={field.state.value}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                    />
                  </label>
                )}
              </deleteForm.Field>
              <deleteForm.Subscribe
                selector={(state) => ({
                  confirmation: state.values.confirmation,
                  error: state.errorMap.onSubmit,
                  isSubmitting: state.isSubmitting,
                })}
              >
                {({ confirmation, error, isSubmitting }) => (
                  <>
                    <Button
                      className="w-fit"
                      variant="destructive"
                      type="submit"
                      disabled={isSubmitting || confirmation !== workspace.name}
                    >
                      {isSubmitting
                        ? "Deleting…"
                        : "Delete account and agency data"}
                    </Button>
                    {error ? (
                      <p className="m-0 text-sm text-destructive" role="alert">
                        {String(error)}
                      </p>
                    ) : null}
                  </>
                )}
              </deleteForm.Subscribe>
            </form>
          </CardContent>
        </Card>
      </main>
    </AppShell>
  );
}
