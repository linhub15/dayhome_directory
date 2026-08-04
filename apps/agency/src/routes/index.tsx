import {
  careTypeLabels,
  formatChildAge,
} from "#/features/inquiries/inquiry_schema";
import { listProviderInquiriesFn } from "#/features/inquiries/list_provider_inquiries.fn";
import type { InquiryRecord } from "@dayhome/db/schema";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { CircleCheck, Ellipsis, Search } from "lucide-react";
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
  const [query, setQuery] = useState("");

  const filteredInquiries = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return inquiries;

    return inquiries.filter((item) =>
      [
        item.parentFirstName,
        item.parentLastName,
        item.parentEmail,
        careTypeLabels[item.careType],
      ].some((value) => value.toLowerCase().includes(normalized)),
    );
  }, [inquiries, query]);

  return (
    <AppShell
      tenantName={tenant.name}
      inquiryCount={inquiries.length}
      user={user!}
      activePage="dashboard"
    >
      <main className="px-7.5 pt-7.5 pb-12.5 max-[760px]:px-4 max-[760px]:pt-5.5 max-[760px]:pb-8.75">
        <section className="flex items-end justify-between gap-5 max-[540px]:items-start">
          <div>
            <h1 className="m-0 font-[Manrope,sans-serif] text-[clamp(25px,3vw,34px)] font-bold tracking-[-0.045em]">
              Inquiries
            </h1>
            <p className="mt-1.75 mb-0 text-xs text-[#78857f] max-[540px]:max-w-62.5 dark:text-muted-foreground">
              Review new childcare inquiries submitted to {tenant.name}.
            </p>
          </div>
          <a
            className="inline-flex cursor-pointer items-center justify-center gap-1.75 rounded-[9px] border border-[#285e50] bg-[#306d5c] px-3.75 py-2.5 text-[11px] font-bold text-white no-underline shadow-[0_4px_10px_rgba(38,91,75,0.18)] hover:-translate-y-px hover:bg-[#265b4d] max-[540px]:size-10.5 max-[540px]:p-0 max-[540px]:text-[0px]"
            href={`/inquiry/${encodeURIComponent(tenant.slug)}`}
            target="_blank"
            rel="noreferrer"
          >
            Open inquiry form
          </a>
        </section>

        <section className="mt-4.25 overflow-hidden rounded-[14px] border border-[#dae3dd] bg-[#f8faf8] shadow-[0_10px_25px_rgba(31,54,46,0.035)] dark:border-border dark:bg-background">
          <div className="flex items-center justify-between gap-3 border-b border-[#dfe6e1] bg-[#fbfcfa] px-3.25 py-2.75 max-[540px]:flex-col max-[540px]:items-stretch dark:border-border dark:bg-card dark:text-card-foreground">
            <label className="flex w-55 items-center gap-1.75 rounded-lg border border-[#dfe5e1] bg-white px-2.25 py-1.75 text-[#89958f] max-[540px]:w-full dark:border-border dark:bg-card dark:text-card-foreground">
              <Search size={17} />
              <input
                className="w-full border-0 bg-transparent text-xs text-[#293934] outline-none placeholder:text-[#98a39f] dark:text-foreground"
                aria-label="Search inquiries"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search inquiries"
              />
            </label>
            <p className="m-0 text-[10px] font-semibold text-[#7a8983]">
              {filteredInquiries.length}{" "}
              {filteredInquiries.length === 1 ? "inquiry" : "inquiries"}
            </p>
          </div>

          <div className="block p-3.25">
            <section className="min-w-0">
              <header className="flex h-7.75 items-center gap-1.75 px-0.75">
                <span className="size-1.75 rounded-full bg-[#5e7fdd]" />
                <h2 className="m-0 text-[10px] font-bold">New inquiry</h2>
                <span className="grid h-4.75 min-w-4.75 place-items-center rounded-md bg-[#e9eeea] text-[9px] text-[#718079] dark:bg-accent dark:text-accent-foreground">
                  {filteredInquiries.length}
                </span>
              </header>
              <div className="grid grid-cols-3 gap-2.5 max-[1050px]:grid-cols-2 max-[540px]:grid-cols-1">
                {filteredInquiries.map((inquiry) => (
                  <InquiryCard key={inquiry.id} inquiry={inquiry} />
                ))}
                {filteredInquiries.length === 0 ? (
                  <div className="grid min-h-25 place-items-center rounded-[10px] border border-dashed border-[#dce3de] text-[10px] text-[#98a39e]">
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

function InquiryCard({ inquiry }: { inquiry: InquiryRecord }) {
  const fullName = `${inquiry.parentFirstName} ${inquiry.parentLastName}`;
  const initials = `${inquiry.parentFirstName[0] ?? ""}${inquiry.parentLastName[0] ?? ""}`;

  return (
    <article className="rounded-[10px] border border-[#dfe5e1] bg-white p-3 shadow-[0_2px_5px_rgba(38,62,53,0.035)] transition duration-150 ease-in-out hover:-translate-y-px hover:border-[#bfcfc5] hover:shadow-[0_7px_17px_rgba(38,62,53,0.07)] dark:border-border dark:bg-card dark:text-card-foreground">
      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2">
        <span className="grid size-7.75 place-items-center rounded-[9px] bg-[#dde7f4] text-[9px] font-extrabold text-[#526f9b]">
          {initials.toUpperCase()}
        </span>
        <div className="min-w-0">
          <h3 className="m-0 overflow-hidden text-[11px] font-bold text-ellipsis whitespace-nowrap">
            {fullName}
          </h3>
          <p className="mt-0.5 mb-0 text-[9px] text-[#82908a] dark:text-muted-foreground">
            {inquiry.parentEmail}
          </p>
        </div>
        <button
          className="grid cursor-pointer place-items-center border-0 bg-transparent text-[#8d9994] dark:text-muted-foreground"
          type="button"
          aria-label={`${fullName} options`}
          disabled
        >
          <Ellipsis size={17} />
        </button>
      </div>
      <dl className="my-3 grid grid-cols-3 gap-2.25">
        <div className="min-w-0">
          <dt className="text-[8px] font-bold tracking-wider text-[#8a9791] uppercase">
            Care
          </dt>
          <dd className="mt-0.75 mb-0 overflow-hidden text-[9px] font-semibold text-ellipsis whitespace-nowrap text-[#485952]">
            {careTypeLabels[inquiry.careType]}
          </dd>
        </div>
        <div className="min-w-0">
          <dt className="text-[8px] font-bold tracking-wider text-[#8a9791] uppercase">
            Child age
          </dt>
          <dd className="mt-0.75 mb-0 overflow-hidden text-[9px] font-semibold text-ellipsis whitespace-nowrap text-[#485952]">
            {formatChildAge(inquiry.childBirthDate)}
          </dd>
        </div>
        <div className="min-w-0">
          <dt className="text-[8px] font-bold tracking-wider text-[#8a9791] uppercase">
            Preferred start
          </dt>
          <dd className="mt-0.75 mb-0 overflow-hidden text-[9px] font-semibold text-ellipsis whitespace-nowrap text-[#485952]">
            {formatDate(inquiry.preferredStartDate)}
          </dd>
        </div>
      </dl>
      <div className="flex items-center border-t border-[#edf0ee] pt-2.25 dark:border-border">
        <span className="rounded-[5px] bg-[#f0f3f1] px-1.5 py-0.75 text-[8px] font-semibold text-[#73817b] dark:bg-accent dark:text-accent-foreground">
          Received {formatRelativeDate(inquiry.createdAt)}
        </span>
        <span className="ml-auto inline-flex items-center gap-1 text-[8px] font-semibold text-[#5d7f72]">
          {inquiry.parentConfirmationSentAt &&
          inquiry.providerNotificationSentAt ? (
            <>
              <CircleCheck size={14} /> Notifications sent
            </>
          ) : (
            "Notification pending"
          )}
        </span>
      </div>
    </article>
  );
}

function formatDate(date: string | null) {
  if (!date) return "Not specified";
  return new Intl.DateTimeFormat("en-CA", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

function formatRelativeDate(date: Date) {
  const days = Math.floor(
    (Date.now() - date.getTime()) / (24 * 60 * 60 * 1000),
  );
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  return `${days} days ago`;
}
