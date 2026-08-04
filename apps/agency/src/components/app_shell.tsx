import {
  Bell,
  Building2,
  CalendarDays,
  ChevronDown,
  CircleHelp,
  ContactRound,
  LayoutDashboard,
  Menu,
  MessageSquareText,
  Search,
  Settings,
  Sparkles,
  UsersRound,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";

const navItems = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Inquiry pipeline", icon: ContactRound, active: true, count: 24 },
  { label: "Families", icon: UsersRound },
  { label: "Providers", icon: Building2 },
  { label: "Tours", icon: CalendarDays, count: 4 },
  { label: "Messages", icon: MessageSquareText, count: 7 },
];

export function AppShell({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="app-shell">
      <button
        className={`sidebar-scrim ${menuOpen ? "is-open" : ""}`}
        type="button"
        aria-label="Close navigation"
        onClick={() => setMenuOpen(false)}
      />
      <aside
        id="primary-navigation"
        className={`sidebar ${menuOpen ? "is-open" : ""}`}
      >
        <div className="brand-row">
          <div className="brand-mark" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div>
            <p className="brand-name">Dayhome Flow</p>
            <p className="brand-meta">Little Sprouts Agency</p>
          </div>
          <button
            className="mobile-close"
            type="button"
            aria-label="Close navigation"
            onClick={() => setMenuOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        <nav className="main-nav" aria-label="Primary navigation">
          <p className="nav-label">Workspace</p>
          {navItems.map(({ label, icon: Icon, active, count }) => (
            <button
              key={label}
              className={`nav-item ${active ? "is-active" : ""}`}
              type="button"
              onClick={() => setMenuOpen(false)}
            >
              <Icon size={18} strokeWidth={1.8} />
              <span>{label}</span>
              {count ? <span className="nav-count">{count}</span> : null}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="capacity-card">
            <div className="capacity-icon">
              <Sparkles size={16} />
            </div>
            <p className="capacity-title">August placement goal</p>
            <p className="capacity-copy">12 of 18 spaces filled</p>
            <div className="progress-track">
              <span />
            </div>
          </div>
          <button className="nav-item" type="button">
            <CircleHelp size={18} /> Help centre
          </button>
          <button className="nav-item" type="button">
            <Settings size={18} /> Settings
          </button>
          <button className="profile-row" type="button">
            <span className="avatar">AM</span>
            <span>
              <strong>Avery Morgan</strong>
              <small>Agency manager</small>
            </span>
            <ChevronDown size={16} />
          </button>
        </div>
      </aside>

      <div className="main-column">
        <header className="topbar">
          <button
            className="menu-button"
            type="button"
            aria-label="Open navigation"
            aria-controls="primary-navigation"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
          >
            <Menu size={20} />
          </button>
          <label className="global-search">
            <Search size={18} />
            <input
              type="search"
              aria-label="Search families, providers, or inquiries"
              placeholder="Search families, providers, or inquiries..."
            />
            <kbd>⌘ K</kbd>
          </label>
          <div className="topbar-actions">
            <button
              className="icon-button"
              type="button"
              aria-label="Notifications"
            >
              <Bell size={19} />
              <span className="notification-dot" />
            </button>
            <span className="topbar-divider" />
            <div className="today-copy">
              <span>Monday</span>
              <strong>August 3</strong>
            </div>
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}
