import { createFileRoute } from "@tanstack/react-router";
import type { Inquiry } from "@dayhome/core/inquiry";
import { Button } from "@dayhome/ui/button";
import {
  ArrowDownUp,
  CalendarClock,
  ChevronDown,
  CircleCheck,
  Clock3,
  Ellipsis,
  Filter,
  Mail,
  MapPin,
  MessageCircle,
  Plus,
  Search,
  SlidersHorizontal,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";

import { AppShell } from "../components/app_shell";

export const Route = createFileRoute("/")({ component: PipelinePage });

const columns: Array<{
  title: string;
  count: number;
  accent: string;
  inquiries: Inquiry[];
}> = [
  {
    title: "New inquiry",
    count: 8,
    accent: "#5e7fdd",
    inquiries: [
      {
        initials: "SM",
        family: "Singh family",
        child: "Arjun, 18 months",
        area: "Mill Woods",
        need: "Sep 2026",
        source: "Website",
        tone: "blue",
      },
      {
        initials: "EC",
        family: "Chen family",
        child: "Mia, 3 years",
        area: "Terwillegar",
        need: "ASAP",
        source: "Referral",
        tone: "coral",
      },
      {
        initials: "OB",
        family: "O'Brien family",
        child: "Theo, 2 years",
        area: "Strathcona",
        need: "Oct 2026",
        source: "Google",
        tone: "gold",
      },
    ],
  },
  {
    title: "Contacted",
    count: 6,
    accent: "#d39d32",
    inquiries: [
      {
        initials: "KM",
        family: "Martinez family",
        child: "Sofia, 4 years",
        area: "Windermere",
        need: "Sep 2026",
        source: "Website",
        tone: "lavender",
      },
      {
        initials: "JL",
        family: "Lee family",
        child: "Noah, 14 months",
        area: "Summerside",
        need: "Nov 2026",
        source: "Facebook",
        tone: "teal",
      },
    ],
  },
  {
    title: "Tour scheduled",
    count: 4,
    accent: "#8a65c7",
    inquiries: [
      {
        initials: "AP",
        family: "Patel family",
        child: "Aanya, 2 years",
        area: "Laurel",
        need: "Sep 2026",
        source: "Referral",
        tone: "gold",
      },
      {
        initials: "RW",
        family: "Williams family",
        child: "Ivy, 3 years",
        area: "Chappelle",
        need: "Jan 2027",
        source: "Website",
        tone: "coral",
      },
    ],
  },
  {
    title: "Placement offered",
    count: 3,
    accent: "#278f73",
    inquiries: [
      {
        initials: "NK",
        family: "Kaur family",
        child: "Navi, 20 months",
        area: "Walker",
        need: "Sep 2026",
        source: "Google",
        tone: "teal",
      },
      {
        initials: "DT",
        family: "Thompson family",
        child: "Eli, 4 years",
        area: "Rutherford",
        need: "Oct 2026",
        source: "Website",
        tone: "blue",
      },
    ],
  },
];

function PipelinePage() {
  const [query, setQuery] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(toastTimeoutRef.current), []);

  const filteredColumns = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return columns;
    return columns.map((column) => ({
      ...column,
      inquiries: column.inquiries.filter((item) =>
        [item.family, item.child, item.area, item.source].some((value) =>
          value.toLowerCase().includes(normalized),
        ),
      ),
    }));
  }, [query]);

  function showPrototypeNotice() {
    setToastVisible(true);
    window.clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = window.setTimeout(
      () => setToastVisible(false),
      2400,
    );
  }

  return (
    <AppShell>
      <main className="workspace">
        <section className="page-heading">
          <div>
            <p className="eyebrow">Family intake</p>
            <h1>Inquiry pipeline</h1>
            <p>Keep every family moving toward the right dayhome placement.</p>
          </div>
          <Button
            className="primary-button"
            type="button"
            variant="unstyled"
            size="unstyled"
            onClick={showPrototypeNotice}
          >
            <Plus size={18} /> New inquiry
          </Button>
        </section>

        <section className="metrics" aria-label="Pipeline summary">
          <Metric
            icon={<Users size={19} />}
            value="24"
            label="Open inquiries"
            note="+5 this week"
          />
          <Metric
            icon={<CalendarClock size={19} />}
            value="4"
            label="Tours this week"
            note="2 need confirmation"
          />
          <Metric
            icon={<Clock3 size={19} />}
            value="1.8 days"
            label="Avg. response time"
            note="↓ 12% from July"
            positive
          />
          <Metric
            icon={<CircleCheck size={19} />}
            value="72%"
            label="Placement rate"
            note="9 placed this month"
            positive
          />
        </section>

        <section className="pipeline-panel">
          <div className="pipeline-toolbar">
            <label className="pipeline-search">
              <Search size={17} />
              <input
                aria-label="Search this pipeline"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search this pipeline"
              />
            </label>
            <div className="toolbar-actions">
              <button className="secondary-button" type="button">
                <Filter size={16} /> Filter{" "}
                <span className="filter-count">2</span>
              </button>
              <button className="secondary-button" type="button">
                <ArrowDownUp size={16} /> Sort
              </button>
              <button
                className="icon-button bordered"
                type="button"
                aria-label="View options"
              >
                <SlidersHorizontal size={17} />
              </button>
            </div>
          </div>

          <div className="board">
            {filteredColumns.map((column) => (
              <section className="board-column" key={column.title}>
                <header className="column-heading">
                  <span
                    className="column-dot"
                    style={{ backgroundColor: column.accent }}
                  />
                  <h2>{column.title}</h2>
                  <span className="column-count">
                    {query ? column.inquiries.length : column.count}
                  </span>
                  <button type="button" aria-label={`${column.title} options`}>
                    <Ellipsis size={18} />
                  </button>
                </header>
                <div className="card-stack">
                  {column.inquiries.map((inquiry) => (
                    <InquiryCard key={inquiry.family} inquiry={inquiry} />
                  ))}
                  {column.inquiries.length === 0 ? (
                    <div className="empty-column">No matching inquiries</div>
                  ) : null}
                </div>
                <button
                  className="add-card"
                  type="button"
                  onClick={showPrototypeNotice}
                >
                  <Plus size={16} /> Add inquiry
                </button>
              </section>
            ))}
          </div>
        </section>
      </main>
      {toastVisible ? (
        <output className="prototype-toast is-visible">
          <CircleCheck size={18} /> Inquiry creation is ready for the next build
          phase.
        </output>
      ) : null}
    </AppShell>
  );
}

function Metric({
  icon,
  value,
  label,
  note,
  positive = false,
}: {
  icon: ReactNode;
  value: string;
  label: string;
  note: string;
  positive?: boolean;
}) {
  return (
    <article className="metric-card">
      <div className="metric-icon">{icon}</div>
      <div>
        <strong>{value}</strong>
        <span>{label}</span>
      </div>
      <small className={positive ? "positive" : ""}>{note}</small>
    </article>
  );
}

function InquiryCard({ inquiry }: { inquiry: Inquiry }) {
  return (
    <article className="inquiry-card">
      <div className="card-topline">
        <span className={`family-avatar ${inquiry.tone}`}>
          {inquiry.initials}
        </span>
        <div>
          <h3>{inquiry.family}</h3>
          <p>{inquiry.child}</p>
        </div>
        <button type="button" aria-label={`${inquiry.family} options`}>
          <Ellipsis size={17} />
        </button>
      </div>
      <div className="detail-row">
        <MapPin size={14} />
        <span>{inquiry.area}</span>
        <span className="detail-separator" />
        <CalendarClock size={14} />
        <span>{inquiry.need}</span>
      </div>
      <div className="card-footer">
        <span className="source-pill">{inquiry.source}</span>
        <div className="card-actions">
          <button type="button" aria-label={`Email ${inquiry.family}`}>
            <Mail size={15} />
          </button>
          <button type="button" aria-label={`Message ${inquiry.family}`}>
            <MessageCircle size={15} />
          </button>
          <button type="button" aria-label={`Move ${inquiry.family}`}>
            <ChevronDown size={15} />
          </button>
        </div>
      </div>
    </article>
  );
}
