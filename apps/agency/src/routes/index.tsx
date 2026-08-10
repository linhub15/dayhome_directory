import {
  careTypeLabels,
  formatChildAge,
  formatExpectedStart,
} from "#/features/inquiries/inquiry_schema";
import { listProviderInquiriesFn } from "#/features/inquiries/list_provider_inquiries.fn";
import { ShareInquiryDialog } from "#/features/inquiries/share_inquiry_dialog";
import { InquiryStatusControl } from "#/features/inquiries/inquiry_status_control";
import {
  inquiryStatusLabels,
  inquiryStatusValues,
  type InquiryStatus,
} from "#/features/inquiries/inquiry_status";
import type {
  InquiryStatusHistoryRecord,
  InquiryWithChildren,
} from "@dayhome/db/schema";
import { Avatar, AvatarFallback } from "@dayhome/ui/avatar";
import { Badge } from "@dayhome/ui/badge";
import { Button } from "@dayhome/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@dayhome/ui/dialog";
import { Input } from "@dayhome/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@dayhome/ui/select";
import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import {
  BabyIcon,
  CircleCheckIcon,
  Clock3Icon,
  HistoryIcon,
  MailIcon,
  SearchIcon,
} from "lucide-react";
import { useMemo, useState } from "react";

import { AppShell } from "../components/app_shell";
import { getAgencySessionFn } from "#/lib/auth/agency_session.fn";

export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    const session = await getAgencySessionFn();
    if (!session.user) throw redirect({ to: "/login" });
    if (!session.user.emailVerified) throw redirect({ to: "/confirm-email" });
    if (!session.workspace) throw redirect({ to: "/onboarding" });
    return session;
  },
  loader: () => listProviderInquiriesFn(),
  component: PipelinePage,
});

function PipelinePage() {
  const { user } = Route.useRouteContext();
  const { tenant, inquiries } = Route.useLoaderData();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<InquiryStatus | "all">(
    "all",
  );

  const filteredInquiries = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return inquiries.filter((item) => {
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      if (!normalized) return true;
      return [
        item.parentFirstName,
        item.parentLastName,
        item.parentEmail,
        ...item.children.flatMap((child) => [
          careTypeLabels[child.careType],
          formatChildAge(child.birthDate),
          formatExpectedStart(child.expectedStart, child.expectedStartDate),
        ]),
      ].some((value) => value.toLowerCase().includes(normalized));
    });
  }, [inquiries, query, statusFilter]);

  const refreshInquiries = async () => {
    await router.invalidate();
  };

  return (
    <AppShell
      tenantName={tenant.name}
      inquiryCount={inquiries.length}
      user={user!}
      activePage="dashboard"
    >
      <main className="px-7.5 pt-7.5 pb-12.5 max-md:px-4 max-md:pt-5.5 max-md:pb-8.75">
        <section className="flex items-end justify-between gap-5 max-sm:items-start">
          <div>
            <h1 className="m-0 font-heading text-3xl font-medium tracking-tight">
              Inquiries
            </h1>
            <p className="mt-1.75 mb-0 text-sm text-muted-foreground max-sm:max-w-72">
              Review new childcare inquiries submitted to {tenant.name}.
            </p>
          </div>
          <ShareInquiryDialog tenantSlug={tenant.slug} />
        </section>

        <section className="mt-4.25 overflow-hidden rounded-xl border bg-muted/20 shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b bg-card px-3.25 py-2.75 text-card-foreground max-sm:flex-col max-sm:items-stretch">
            <div className="flex gap-2 max-sm:grid max-sm:grid-cols-2">
              <div className="relative w-55 max-sm:w-auto">
                <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 z-10 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="bg-background pl-8"
                  aria-label="Search inquiries"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search inquiries"
                />
              </div>
              <Select
                value={statusFilter}
                onValueChange={(value) => value && setStatusFilter(value)}
              >
                <SelectTrigger
                  className="bg-background"
                  aria-label="Filter by status"
                >
                  <SelectValue>
                    {(value) =>
                      value === "all"
                        ? "All Statuses"
                        : inquiryStatusLabels[value as InquiryStatus]
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {inquiryStatusValues.map((status) => (
                    <SelectItem key={status} value={status}>
                      {inquiryStatusLabels[status]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <p className="m-0 text-sm text-muted-foreground">
              {filteredInquiries.length}{" "}
              {filteredInquiries.length === 1 ? "inquiry" : "inquiries"}
            </p>
          </div>

          <div className="block p-3.25">
            <section className="min-w-0">
              <header className="flex items-center gap-2 px-0.75 py-2">
                <span className="size-1.75 rounded-full bg-primary" />
                <h2 className="m-0 text-sm font-medium">Inquiry pipeline</h2>
                <Badge size="sm" variant="secondary">
                  {filteredInquiries.length}
                </Badge>
              </header>
              <div className="grid gap-2.5">
                {filteredInquiries.map((inquiry) => (
                  <InquiryRow
                    key={inquiry.id}
                    inquiry={inquiry}
                    onUpdated={refreshInquiries}
                  />
                ))}
                {filteredInquiries.length === 0 ? (
                  <div className="grid min-h-25 place-items-center rounded-lg border border-dashed text-sm text-muted-foreground">
                    {inquiries.length
                      ? "No matching inquiries"
                      : "No inquiries yet"}
                  </div>
                ) : null}
              </div>
            </section>
          </div>
        </section>
      </main>
    </AppShell>
  );
}

type InquiryListItem = InquiryWithChildren & {
  statusHistory: Array<
    InquiryStatusHistoryRecord & { changedBy: { name: string } | null }
  >;
};

function InquiryRow({
  inquiry,
  onUpdated,
}: {
  inquiry: InquiryListItem;
  onUpdated: () => Promise<void>;
}) {
  const fullName = `${inquiry.parentFirstName} ${inquiry.parentLastName}`;
  const initials = `${inquiry.parentFirstName[0] ?? ""}${inquiry.parentLastName[0] ?? ""}`;

  return (
    <article className="grid grid-cols-[minmax(--spacing(45),0.9fr)_minmax(--spacing(80),1.7fr)_auto] items-center gap-5 rounded-lg border bg-card px-4 py-3.5 text-card-foreground shadow-xs max-lg:grid-cols-[minmax(--spacing(42.5),0.8fr)_minmax(--spacing(65),1.3fr)] max-sm:block">
      <div className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)] items-center gap-2.5 max-sm:border-b max-sm:pb-3">
        <Avatar className="size-9 rounded-lg">
          <AvatarFallback className="rounded-lg bg-primary/10 text-xs font-medium text-primary">
            {initials.toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <h3 className="m-0 overflow-hidden text-sm font-medium text-ellipsis whitespace-nowrap">
            {fullName}
          </h3>
          <a
            className="mt-1 flex items-center gap-1 overflow-hidden text-xs text-muted-foreground no-underline hover:text-primary"
            href={`mailto:${inquiry.parentEmail}`}
          >
            <MailIcon className="shrink-0" size={12} />
            <span className="overflow-hidden text-ellipsis whitespace-nowrap">
              {inquiry.parentEmail}
            </span>
          </a>
        </div>
      </div>

      <div className="grid gap-1.5 max-sm:py-3">
        {inquiry.children.map((child, index) => (
          <div
            className="grid min-w-0 grid-cols-[minmax(--spacing(28.75),0.8fr)_minmax(--spacing(25),0.7fr)_minmax(--spacing(35),1fr)] items-center gap-3 rounded-lg bg-muted/50 px-3 py-2 max-sm:grid-cols-2"
            key={child.id}
          >
            <span className="flex min-w-0 items-center gap-1.5 text-sm font-medium text-foreground">
              <BabyIcon className="shrink-0 text-muted-foreground" size={14} />
              <span className="truncate">
                {inquiry.children.length > 1 ? `Child ${index + 1} · ` : ""}
                {formatChildAge(child.birthDate)}
              </span>
            </span>
            <Badge className="w-fit" variant="secondary">
              {careTypeLabels[child.careType]}
            </Badge>
            <span className="flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground max-sm:col-span-2">
              <Clock3Icon className="shrink-0" size={13} />
              {formatExpectedStart(
                child.expectedStart,
                child.expectedStartDate,
              )}
            </span>
          </div>
        ))}
      </div>

      <div className="grid justify-items-end gap-2 max-lg:col-span-2 max-lg:grid-flow-col max-lg:items-center max-lg:justify-between max-lg:border-t max-lg:pt-2.5 max-sm:flex max-sm:flex-wrap max-sm:border-t max-sm:pt-2.5">
        <InquiryStatusControl
          inquiryId={inquiry.id}
          status={inquiry.status}
          onUpdated={onUpdated}
        />
        <Badge variant="outline">
          Received {formatRelativeDate(inquiry.createdAt)}
        </Badge>
        <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
          {inquiry.parentConfirmationSentAt &&
          inquiry.providerNotificationSentAt ? (
            <>
              <CircleCheckIcon size={14} /> Notifications sent
            </>
          ) : (
            "Notification pending"
          )}
        </span>
        <InquiryDetailsDialog inquiry={inquiry} onUpdated={onUpdated} />
      </div>
    </article>
  );
}

function InquiryDetailsDialog({
  inquiry,
  onUpdated,
}: {
  inquiry: InquiryListItem;
  onUpdated: () => Promise<void>;
}) {
  const fullName = `${inquiry.parentFirstName} ${inquiry.parentLastName}`;

  return (
    <Dialog>
      <DialogTrigger render={<Button size="sm" variant="ghost" />}>
        View details
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{fullName}</DialogTitle>
          <DialogDescription>{inquiry.parentEmail}</DialogDescription>
        </DialogHeader>

        <section className="grid gap-3 rounded-lg border p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="m-0 text-xs text-muted-foreground">
                Current status
              </p>
              <p className="mt-1 mb-0 text-sm font-medium">
                {inquiryStatusLabels[inquiry.status]}
              </p>
            </div>
            <InquiryStatusControl
              inquiryId={inquiry.id}
              status={inquiry.status}
              onUpdated={onUpdated}
            />
          </div>
        </section>

        <section>
          <h3 className="mb-2 text-sm font-medium">Children</h3>
          <div className="grid gap-2">
            {inquiry.children.map((child, index) => (
              <div
                key={child.id}
                className="rounded-lg bg-muted/50 p-3 text-sm"
              >
                <span className="font-medium">Child {index + 1}</span>
                <span className="text-muted-foreground">
                  {` · ${formatChildAge(child.birthDate)} · ${careTypeLabels[child.careType]} · ${formatExpectedStart(child.expectedStart, child.expectedStartDate)}`}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-medium">
            <HistoryIcon className="size-4 text-muted-foreground" /> Activity
          </h3>
          <ol className="m-0 grid list-none gap-0 p-0">
            {inquiry.statusHistory.map((entry) => (
              <li
                key={entry.id}
                className="relative border-l pl-4 pb-4 last:pb-0"
              >
                <span className="absolute top-1 -left-1 size-2 rounded-full bg-primary" />
                <p className="m-0 text-sm">
                  {entry.fromStatus ? (
                    <>
                      {entry.changedBy?.name ?? "System"} changed status from{" "}
                      <span className="font-medium">
                        {inquiryStatusLabels[entry.fromStatus]}
                      </span>{" "}
                      to{" "}
                    </>
                  ) : (
                    <>{entry.changedBy?.name ?? "System"} created inquiry as </>
                  )}
                  <span className="font-medium">
                    {inquiryStatusLabels[entry.toStatus]}
                  </span>
                </p>
                <time className="mt-1 block text-xs text-muted-foreground">
                  {formatTimestamp(entry.changedAt)}
                </time>
              </li>
            ))}
          </ol>
        </section>
      </DialogContent>
    </Dialog>
  );
}

function formatRelativeDate(date: Date) {
  const days = Math.floor(
    (Date.now() - date.getTime()) / (24 * 60 * 60 * 1000),
  );
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  return `${days} days ago`;
}

function formatTimestamp(date: Date) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}
