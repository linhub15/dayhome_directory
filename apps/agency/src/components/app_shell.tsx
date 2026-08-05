import {
  ContactRound as ContactRoundIcon,
  LogOut as LogOutIcon,
  Menu as MenuIcon,
  Settings as SettingsIcon,
  X as XIcon,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  LinkButton,
  Separator,
  cn,
} from "@dayhome/ui";

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
      icon: ContactRoundIcon,
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
    <div className="min-h-svh bg-background md:flex">
      <Button
        className={cn(
          "fixed inset-0 z-40 bg-black/50 opacity-0 transition-opacity md:hidden",
          menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none",
        )}
        variant="unstyled"
        size="unstyled"
        type="button"
        aria-label="Close navigation"
        onClick={() => setMenuOpen(false)}
      />
      <aside
        id="primary-navigation"
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 -translate-x-full flex-col border-r border-sidebar-border bg-sidebar p-2 text-sidebar-foreground transition-transform md:sticky md:top-0 md:z-0 md:h-svh md:translate-x-0",
          menuOpen && "translate-x-0",
        )}
      >
        <div className="flex h-12 items-center gap-2 px-2">
          <div
            className="flex size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"
            aria-hidden="true"
          >
            <ContactRoundIcon className="size-4" />
          </div>
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-sm font-medium">Dayhome Flow</p>
            <p className="truncate text-xs text-muted-foreground">
              {tenantName}
            </p>
          </div>
          <Button
            className="ml-auto md:hidden"
            variant="ghost"
            size="icon"
            type="button"
            aria-label="Close navigation"
            onClick={() => setMenuOpen(false)}
          >
            <XIcon />
          </Button>
        </div>

        <nav className="grid gap-1 pt-2" aria-label="Primary navigation">
          <p className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
            Workspace
          </p>
          {navItems.map(({ label, icon: Icon, active, count, to }) => {
            return (
              <LinkButton
                key={to}
                className={cn(
                  "w-full cursor-default justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  active && "bg-sidebar-accent text-sidebar-accent-foreground",
                )}
                variant="ghost"
                size="sm"
                to={to}
              >
                <Icon />
                <span>{label}</span>
                {count ? (
                  <Badge
                    className="ml-auto h-5 min-w-5 px-1.5 tabular-nums"
                    variant="secondary"
                  >
                    {count}
                  </Badge>
                ) : null}
              </LinkButton>
            );
          })}
        </nav>

        <div className="mt-auto grid gap-1">
          <LinkButton
            className={cn(
              "w-full cursor-default justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              activePage === "settings" &&
                "bg-sidebar-accent text-sidebar-accent-foreground",
            )}
            variant="ghost"
            size="sm"
            to="/settings"
          >
            <SettingsIcon /> Settings
          </LinkButton>
          <LinkButton
            className="w-full cursor-default justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            variant="ghost"
            size="sm"
            to="/logout"
          >
            <LogOutIcon /> Log out
          </LinkButton>
          <Separator className="my-1" />
          <div className="flex items-center gap-2 px-2 py-1.5">
            <Avatar className="size-8 rounded-lg">
              {user.image ? <AvatarImage src={user.image} alt="" /> : null}
              <AvatarFallback className="rounded-lg text-xs">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="grid min-w-0 flex-1 text-left text-sm leading-tight">
              <strong className="truncate font-medium">{user.name}</strong>
              <small className="truncate text-xs text-muted-foreground">
                {user.email}
              </small>
            </span>
          </div>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="flex h-12 items-center gap-2 border-b bg-background px-4">
          <Button
            className="md:hidden"
            variant="ghost"
            size="icon"
            type="button"
            aria-label="Open navigation"
            aria-controls="primary-navigation"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
          >
            <MenuIcon />
          </Button>
        </header>
        {children}
      </div>
    </div>
  );
}
