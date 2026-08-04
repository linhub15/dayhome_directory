import {
  CircleHelp,
  ContactRound,
  ChevronDown,
  Menu,
  Settings,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@dayhome/ui";
import { Link } from "@tanstack/react-router";

export function AppShell({
  children,
  tenantName,
  inquiryCount,
  user,
  activePage,
}: {
  children: ReactNode;
  tenantName: string;
  inquiryCount: number;
  user: { name: string; email: string; image?: string | null };
  activePage: "dashboard" | "settings";
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navItems = [
    {
      label: "Inquiries",
      icon: ContactRound,
      active: activePage === "dashboard",
      count: inquiryCount,
      to: "/" as const,
    },
  ];
  const initials = user.name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="grid min-h-screen grid-cols-[252px_minmax(0,1fr)] max-[760px]:block">
      <button
        className={cn(
          "fixed inset-0 z-20 hidden border-0 bg-[rgba(25,42,36,0.28)] opacity-0 transition-opacity duration-180 max-[760px]:block",
          menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none",
        )}
        type="button"
        aria-label="Close navigation"
        onClick={() => setMenuOpen(false)}
      />
      <aside
        id="primary-navigation"
        className={cn(
          "sticky top-0 z-30 flex h-screen flex-col border-r border-[#dce4df] bg-[#fbfcfa] px-4 pt-5.5 pb-4 dark:border-border dark:bg-card dark:text-card-foreground",
          "max-[760px]:fixed max-[760px]:invisible max-[760px]:w-[min(290px,88vw)] max-[760px]:translate-x-[-102%] max-[760px]:shadow-[12px_0_35px_rgba(25,48,40,0.15)] max-[760px]:[transition:transform_180ms_ease,visibility_0s_linear_180ms]",
          menuOpen &&
            "max-[760px]:visible max-[760px]:translate-x-0 max-[760px]:delay-[0s]",
        )}
      >
        <div className="flex items-center gap-2.75 px-2 pb-6.25">
          <div
            className="flex size-8.75 items-end justify-center gap-0.5 overflow-hidden rounded-[11px] bg-[#275f50] px-1.75 py-2"
            aria-hidden="true"
          >
            <span className="block h-2.75 w-1.25 -rotate-12 rounded-[5px_5px_2px_2px] bg-[#e6f4c8]" />
            <span className="block h-4.5 w-1.25 rounded-[5px_5px_2px_2px] bg-white" />
            <span className="block h-3.5 w-1.25 rotate-12 rounded-[5px_5px_2px_2px] bg-[#e6f4c8]" />
          </div>
          <div>
            <p className="m-0 font-[Manrope,sans-serif] text-sm font-extrabold tracking-[-0.02em]">
              Dayhome Flow
            </p>
            <p className="mt-0.5 mb-0 text-[10px] font-semibold text-[#7a8a84] dark:text-muted-foreground">
              {tenantName}
            </p>
          </div>
          <button
            className="ml-auto hidden size-8 place-items-center rounded-lg border-0 bg-[#eef3f0] max-[760px]:grid dark:border dark:border-border dark:bg-accent dark:text-accent-foreground"
            type="button"
            aria-label="Close navigation"
            onClick={() => setMenuOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        <nav className="grid gap-0.75" aria-label="Primary navigation">
          <p className="mx-3 mt-1 mb-2 text-[10px] font-bold tracking-widest text-[#98a59f] uppercase">
            Workspace
          </p>
          {navItems.map(({ label, icon: Icon, active, count, to }) => {
            const content = (
              <>
                <Icon size={18} strokeWidth={1.8} />
                <span>{label}</span>
                {count ? (
                  <span
                    className={cn(
                      "ml-auto min-w-5.75 rounded-[99px] bg-[#eef2ef] px-1.5 py-0.5 text-center text-[10px] text-[#6d7b76] dark:bg-accent dark:text-accent-foreground",
                      active && "bg-[#d2e5dc] text-[#275f50]",
                    )}
                  >
                    {count}
                  </span>
                ) : null}
              </>
            );
            const className = cn(
              "flex w-full cursor-pointer items-center gap-2.75 rounded-[9px] border-0 bg-transparent px-2.75 py-2.5 text-left text-[13px] font-semibold text-[#697973] no-underline hover:bg-[#f0f4f1] hover:text-[#284c42] dark:text-muted-foreground dark:hover:bg-accent dark:hover:text-accent-foreground",
              active &&
                "bg-[#e6f0eb] text-[#275f50] shadow-[inset_3px_0_#3a806b] hover:bg-[#e6f0eb] dark:bg-[color-mix(in_oklab,var(--primary)_16%,var(--card))] dark:text-foreground",
            );

            return (
              <Link
                key={to}
                className={className}
                to={to}
                onClick={() => setMenuOpen(false)}
              >
                {content}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto grid gap-0.75">
          <button
            className="flex w-full cursor-pointer items-center gap-2.75 rounded-[9px] border-0 bg-transparent px-2.75 py-2.5 text-left text-[13px] font-semibold text-[#697973] hover:bg-[#f0f4f1] hover:text-[#284c42] dark:text-muted-foreground dark:hover:bg-accent dark:hover:text-accent-foreground"
            type="button"
          >
            <CircleHelp size={18} /> Help centre
          </button>
          <Link
            className={cn(
              "flex w-full cursor-pointer items-center gap-2.75 rounded-[9px] border-0 bg-transparent px-2.75 py-2.5 text-left text-[13px] font-semibold text-[#697973] no-underline hover:bg-[#f0f4f1] hover:text-[#284c42] dark:text-muted-foreground dark:hover:bg-accent dark:hover:text-accent-foreground",
              activePage === "settings" && "bg-[#e6f0eb] text-[#275f50]",
            )}
            to="/settings"
          >
            <Settings size={18} /> Settings
          </Link>
          <Link
            className="mt-2 flex cursor-pointer items-center gap-2.25 border-0 border-t border-[#e4e9e5] bg-transparent px-1.75 pt-3.75 pb-0.75 text-left text-inherit no-underline dark:border-border"
            to="/logout"
          >
            {user.image ? (
              <img
                className="size-7.75 rounded-[10px] object-cover"
                src={user.image}
                alt=""
              />
            ) : (
              <span className="grid size-7.75 place-items-center rounded-[10px] bg-[#eadbc8] text-[10px] font-extrabold text-[#7d593b]">
                {initials}
              </span>
            )}
            <span className="grid min-w-0 flex-1">
              <strong className="overflow-hidden text-[11px] text-ellipsis whitespace-nowrap">
                {user.name}
              </strong>
              <small className="text-[9px] text-[#8b9792] dark:text-muted-foreground">
                Log out
              </small>
            </span>
            <ChevronDown size={16} />
          </Link>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="flex h-18 items-center gap-5 border-b border-[#dde4df] bg-[rgba(251,252,250,0.88)] px-7 backdrop-blur-2xl max-[760px]:h-16 max-[760px]:px-4 dark:border-border dark:bg-[color-mix(in_oklab,var(--card)_88%,transparent)] dark:text-card-foreground">
          <button
            className="hidden size-9 place-items-center rounded-[9px] border border-[#dce3df] bg-white max-[760px]:grid dark:border-border dark:bg-accent dark:text-accent-foreground"
            type="button"
            aria-label="Open navigation"
            aria-controls="primary-navigation"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
          >
            <Menu size={20} />
          </button>
        </header>
        {children}
      </div>
    </div>
  );
}
